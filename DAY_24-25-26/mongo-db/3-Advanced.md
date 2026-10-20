
# 🟠 Stage 3: Advanced (Internals & Optimization)

👉 **Goal:** Understand MongoDB’s internals and learn to profile and optimize reads, writes, aggregations, and transactions.

---

## 1. Internals

### 1.1 WiredTiger Storage Engine
- **Architecture:** B-tree based on LSM vs B-tree trade-offs.  
- **Cache:** Configurable (default ~50% RAM), holds internal B-tree nodes and data pages.  
- **Checkpointing:** Periodic snapshots of data files for faster recovery.  
- **Data files:** `.wt` files store collections and indexes separately.  

#### Example: Check cache usage  
```js
db.serverStatus().wiredTiger.cache
```

### 1.2 Journaling & Durability
- **Write-Ahead Log (WAL):** Journal records writes before committing to data files.  
- **Journaling Dir:** `journal/` files under `dbPath`.  
- **Commit Interval:** Default 100ms; tunable via `--wiredTigerJournalDelay`.  
- **Crash Recovery:** Replays journal to reach a consistent state.

### 1.3 Working Set & Memory Management
- **Working set:** Active data + indexes loaded in cache + OS page cache.  
- **Eviction:** WiredTiger evicts pages when cache > threshold.  
- **Page Faults:** Monitor with `vmstat` or `db.serverStatus().wiredTiger.cache`.

### 1.4 Locking & Concurrency Model
- **Document-level locks:** Concurrent writes on different docs in the same collection.  
- **Intent locks:** Global/DB intent read/write (for metadata ops).  
- **Readers won’t block writers:** WiredTiger MVCC design, readers see snapshot.

---

## 2. Optimization Techniques

### 2.1 Explain Plans
- **`.explain("executionStats")`:**  
  - `totalKeysExamined` vs `totalDocsExamined`  
  - `winningPlan` tree  
  - `stage` names: COLLSCAN, IXSCAN, FETCH  
- **Use Case:** Validate index usage and coverage.

#### Example
```js
db.orders.find({ status: "shipped", total: { $gt: 100 } })
  .sort({ orderDate: -1 })
  .explain("executionStats")
```

### 2.2 Indexing Strategies
- **Single-field & Compound:** Cover equality → sort → range (ESR).  
- **Covering Index:** Include projected fields in index to avoid FETCH.  
- **Index Intersection:** Combine two single-field indexes at query time.  
- **Partial & Sparse Indexes:** Index subset of docs.  
- **Wildcard Index:** `{ "$**": 1 }` for dynamic fields.

#### Example: Create covering index
```js
db.orders.createIndex(
  { status: 1, orderDate: -1, customerId: 1 },
  { name: "status_date_customer", background: true }
)
```

### 2.3 Aggregation Optimization
- **Pipeline Ordering:** `$match` → `$sort` → `$project` → `$group` → `$lookup`.  
- **Index on Pipeline Fields:** Ensure early stages use indexes.  
- **Allow Disk Use:** For large `$group` with `allowDiskUse: true`.  

 Example
```js
db.orders.aggregate([
  { $match: { status: "shipped", orderDate: { $gte: ISODate("2025-01-01") } } },
  { $sort: { orderDate: -1 } },           // uses status_date_customer index
  { $group: { _id: "$customerId", orders: { $sum: 1 } } },
  { $project: { _id: 0, customer: "$_id", orders: 1 } }
], { allowDiskUse: true })
```

### 2.4 Pagination Patterns
- **Avoid `$skip`:** Scans and discards documents.  
- **Range Queries:** Use a “last seen” value on a sorted field (e.g., `_id` or `orderDate`).  
- **Cursor-based:** Store resume token from `find().batchSize()`.

#### Example: Page by date
```js
let lastDate = null;
function getPage(limit = 20) {
  const filter = { status: "shipped" };
  if (lastDate) filter.orderDate = { $lt: lastDate };
  const docs = db.orders.find(filter)
    .sort({ orderDate: -1 })
    .limit(limit)
    .toArray();
  lastDate = docs[docs.length - 1].orderDate;
  return docs;
}
```

### 2.5 Bulk Operations
- **`bulkWrite()`** for mixed inserts/updates/deletes in one roundtrip.  
- **Ordered vs Unordered:** Unordered can be faster (parallel execution).  

#### Example
```js
db.orders.bulkWrite([
  { insertOne: { document: { status: "new", total: 50 } } },
  { updateOne: {
      filter: { _id: ObjectId("...") },
      update: { $set: { status: "processing" } }
    }
  },
  { deleteOne: { filter: { status: "obsolete" } } }
], { ordered: false })
```

### 2.6 Transactions & Consistency
- **Multi-document ACID:** Only on replica sets/sharded clusters.  
- **Session API:** `startSession()`, `withTransaction()`.  
- **Limitations:** 16MB transaction size max, ~1000 operations.

#### Example
```js
const session = client.startSession();
await session.withTransaction(async () => {
  await orders.insertOne({ customerId, total }, { session });
  await inventory.updateOne(
    { productId }, { $inc: { stock: -1 } }, { session }
  );
});
await session.endSession();
```

### 2.7 Write Concern & Read Concern
- **Write Concern:** `{ w: 1|majority, j: true }`. Ensures replication and journaling.  
- **Read Concern:** `{ level: "local"|"majority"|"linearizable" }`. Guarantees consistency levels.

#### Example
```js
db.orders.insertOne(
  { status: "shipped" },
  { writeConcern: { w: "majority", j: true } }
);
db.orders.find({}).readConcern("majority");
```

### 2.8 Retryable Writes
- **Automatic Retries:** Driver-level idempotent writes.  
- **Enabled by default** in modern drivers.  

---

## 3. Node.js Project: “Order Analytics API”

A sample Express + MongoDB app showcasing advanced optimization.

#### Structure
```
project-advanced/
├── .env
├── package.json
├── src/
│   ├── db.js
│   ├── seed.js
│   ├── server.js
│   └── routes.js
└── README.md
```

#### .env
```
MONGODB_URI=mongodb://localhost:27017/analytics
```

#### src/db.js
```js
// establishes connection, exports db and client
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const client = new MongoClient(process.env.MONGODB_URI);
export async function connect() {
  await client.connect();
  return client.db();
}
export function close() {
  return client.close();
}
```

#### src/seed.js
```js
import { connect, close } from "./db.js";
async function seed() {
  const db = await connect();
  const orders = db.collection("orders");

  // drop + create indexes
  await orders.drop().catch(() => {});
  await orders.createIndex({ status: 1, orderDate: -1 }, { background: true });
  await orders.createIndex({ customerId: 1, status: 1 },   { background: true });

  // bulk insert 10k orders
  const docs = [];
  for (let i = 0; i < 10000; i++) {
    docs.push({
      status: ["new","processing","shipped"][i % 3],
      total: Math.random() * 500,
      orderDate: new Date(Date.now() - i * 60000),
      customerId: `C${i%100}`
    });
  }
  await orders.bulkWrite(
    docs.map(d => ({ insertOne: { document: d } })),
    { ordered: false }
  );
  console.log("Seed complete.");
  await close();
}
seed().catch(console.error);
```

#### src/routes.js
```js
import express from "express";
export const router = express.Router();

// 1) Paginated shipped orders (range query)
router.get("/orders", async (req, res) => {
  const db = req.app.locals.db;
  const { lastDate, limit = 20 } = req.query;
  const filter = { status: "shipped" };
  if (lastDate) filter.orderDate = { $lt: new Date(lastDate) };
  const docs = await db.collection("orders")
    .find(filter)
    .sort({ orderDate: -1 })
    .limit(+limit)
    .toArray();
  res.json(docs);
});

// 2) Top customers (aggregation with early match)
router.get("/customers/top", async (req, res) => {
  const db = req.app.locals.db;
  const pipeline = [
    { $match: { status: "shipped" } },
    { $group: { _id: "$customerId", count: { $sum: 1 }, total: { $sum: "$total" } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ];
  const result = await db.collection("orders")
    .aggregate(pipeline, { allowDiskUse: true })
    .toArray();
  res.json(result);
});

// 3) Transactional update (ship & adjust stock)
router.post("/orders/ship", async (req, res) => {
  const { orderId, productId } = req.body;
  const session = req.app.locals.client.startSession();
  try {
    await session.withTransaction(async () => {
      await req.app.locals.db.collection("orders")
        .updateOne({ _id: orderId }, { $set: { status: "shipped" } }, { session });
      await req.app.locals.db.collection("inventory")
        .updateOne({ _id: productId }, { $inc: { stock: -1 } }, { session });
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.endSession();
  }
});

// 4) Explain API
router.get("/orders/explain", async (req, res) => {
  const plan = await req.app.locals.db.collection("orders")
    .find({ status: "shipped", total: { $gt: 100 } })
    .sort({ orderDate: -1 })
    .explain("executionStats");
  res.json(plan);
});
```

#### src/server.js
```js
import express from "express";
import { connect } from "./db.js";
import { router } from "./routes.js";

async function main() {
  const db = await connect();
  const app = express();
  app.use(express.json());
  app.locals.db = db;
  app.locals.client = db.s.client;  // raw MongoClient
  app.use("/api", router);
  app.listen(3000, () => console.log("Listening on http://localhost:3000"));
}
main().catch(console.error);
```

#### package.json (partial)
```json
{
  "type": "module",
  "dependencies": {
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "mongodb": "^5.0.0"
  },
  "scripts": {
    "seed": "node src/seed.js",
    "start": "node src/server.js"
  }
}
```

---

### Run & Test
1. `npm install`  
2. `npm run seed`  
3. `npm start`  
4. Curl or browser:
   - `GET http://localhost:3000/api/orders?limit=10`  
   - `GET http://localhost:3000/api/customers/top`  
   - `GET http://localhost:3000/api/orders/explain`  
   - `POST http://localhost:3000/api/orders/ship` with JSON body.

---

📌 **Outcome:** You’ll inspect execution plans, leverage indexes for coverage, paginate via range queries, run bulk writes, and use multi-document transactions with proper read/write concerns.