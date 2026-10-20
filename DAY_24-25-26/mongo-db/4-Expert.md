
# 🔴 Stage 4: Production / Expert

👉 **Goal:** Be enterprise-ready: deploy MongoDB at scale, secure it end-to-end, and operate it reliably.

---

## 1. Replication & High Availability

### 1.1 Replica Sets & Elections  
- **Replica Set**: group of `mongod` instances with one primary (writes), multiple secondaries (reads, failover).  
- **Election**: when primary fails, secondaries hold an election to pick a new primary.  
- **Arbiters**: vote in elections but don’t hold data (to maintain odd vote count).

#### Commands
```shell
# Start three nodes
mongod --replSet rs0 --port 27017 --dbpath /data/rs0
mongod --replSet rs0 --port 27018 --dbpath /data/rs1
mongod --replSet rs0 --port 27019 --dbpath /data/rs2

# Initiate
mongo --port 27017 <<EOF
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" },
    { _id: 2, host: "localhost:27019", arbiterOnly: true }
  ]
});
EOF

# Check status
mongo --quiet --eval "rs.status()"
```

### 1.2 Oplog Internals  
- **Oplog**: capped collection (`local.oplog.rs`) storing recent write operations.  
- **Replication**: secondaries tail the oplog and apply operations in order.  
- **Size**: set via `--oplogSizeMB`.

### 1.3 Failover Testing  
- **Simulate Primary Down**:
  ```shell
  mongo --port 27017 --eval "rs.stepDown(60)"
  ```
- **Verify New Primary**:
  ```shell
  mongo --port 27018 --eval "rs.isMaster()"
  ```
- **Pitfall**: stepDown blocks writes; plan maintenance windows.

---

## 2. Sharding (Horizontal Scaling)

### 2.1 Config Servers & mongos  
- **Config Servers**: store metadata (shard map). Must run as a replica set (3 nodes).  
- **mongos**: query router, application connects to this, not directly to shards.

#### Commands
```shell
# Start config servers
mongod --configsvr --replSet cfgrs --port 27019 --dbpath /data/cfg0
# Initiate config RS
mongo --port 27019 <<EOF
rs.initiate({_id:"cfgrs",members:[
  {_id:0,host:"localhost:27019"},
  {_id:1,host:"localhost:27020"},
  {_id:2,host:"localhost:27021"}
]});
EOF

# Start mongos
mongos --configdb cfgrs/localhost:27019,localhost:27020,localhost:27021 --port 27017
```

### 2.2 Choosing Shard Keys  
- **Goal**: evenly distribute writes/reads, avoid “hot” shards.  
- **Patterns**:
  - **Hashed**: simple, uniform distribution (`{ _id: "hashed" }`).  
  - **Ranged**: supports range queries but risk of hotspot on new keys.

### 2.3 Chunk Balancing  
- **Chunks**: contiguous ranges of shard key values.  
- **Balancer**: moves chunks among shards to maintain even data size.  
- **Commands**:
  ```js
  sh.enableSharding("shop")
  sh.shardCollection("shop.orders", { orderDate: 1, _id: "hashed" })
  sh.status()  // view chunk distribution
  ```

---

## 3. Security

### 3.1 Authentication  
- **SCRAM** (default): salted challenge-response.  
- **x.509**: use TLS certificates to authenticate clients/servers.
- **Enable Auth**: setsecurity.authorization: "enabled"` in `mongod.conf`.

### 3.2 Role-Based Access Control (RBAC)  
- **Built-in roles**: `read`, `readWrite`, `dbAdmin`, `clusterAdmin`, etc.  
- **Custom roles**:
  ```js
  use admin
  db.createRole({
    role: "orderManager",
    privileges: [
      { resource: { db: "shop", collection: "orders" }, actions: ["find","update"] }
    ],
    roles: []
  });
  db.createUser({ user:"ordmgr", pwd:"secret", roles:["orderManager"] });
  ```

### 3.3 Encryption  
- **In-Transit**: TLS with `net.tls.mode: "requireTLS"` and cert files.  
- **At-Rest**: 
  - **Encrypted Storage Engine** (Enterprise): `security.enableEncryption: true`.  
  - **CSFLE** (Client-Side Field Level Encryption): driver-side encryption of selected fields.

---

## 4. Connecting with Backend

### 4.1 Drivers  
- Official MongoDB drivers for Node.js, Python, Java, etc.  
- **Connection String**: `mongodb://user:pwd@host1,host2/db?replicaSet=rs0&authSource=admin&tls=true`.

### 4.2 Connection Pooling  
- **Options**:  
  - `poolSize` / `maxPoolSize`  
  - `maxIdleTimeMS`, `socketTimeoutMS`  
  - `keepAlive`  
- **Node.js Example**:
  ```js
  const client = new MongoClient(uri, {
    maxPoolSize: 50,
    minPoolSize: 5,
    keepAlive: true,
    tls: true
  });
  await client.connect();
  ```

### 4.3 ODMs  
- **Mongoose**: schemas, middleware, validation.  
- **Prisma**: type-safe, next-gen ORM with MongoDB preview.  
- **Trade-offs**: flexibility vs performance overhead.

---

## 5. Advanced Features

### 5.1 Change Streams  
- **Real-time data**: applications subscribe to inserts/updates/deletes.  
- **Example**:
  ```js
  const changeStream = collection.watch([{ $match:{ "fullDocument.status":"shipped" } }]);
  changeStream.on("change", doc => console.log("Shipped:", doc.fullDocument));
  ```

### 5.2 Triggers (Atlas/Realm)  
- Server-side JavaScript snippets executed on data changes.

### 5.3 Time Series Collections  
- Optimized storage for IoT/metrics.  
- **Create**:
  ```js
  db.createCollection("temps", {
    timeseries: { timeField: "ts", metaField: "sensorId", granularity: "seconds" }
  });
  ```

### 5.4 Geospatial Queries  
- **2dsphere** index for GeoJSON.  
  ```js
  db.places.createIndex({ location:"2dsphere" });
  db.places.find({
    location: { $near: { $geometry:{ type:"Point", coordinates:[-73.97,40.77] }, $maxDistance:5000 } }
  });
  ```

### 5.5 GridFS for Large Files  
- Splits files into 255 KB chunks; query via MongoDB APIs.

---

## 6. Ops & Best Practices

### 6.1 Backups  
- **mongodump/mongorestore** for logical dumps.  
- **Snapshots**: filesystem or cloud-provider block snapshots.  
- **Atlas Backup**: point-in-time recovery.

### 6.2 Monitoring  
- **mongostat**, **mongotop** for CLI metrics.  
- **Atlas Metrics**: charts for CPU, memory, IOPS, connections.  
- **Prometheus Exporter**: integrate with Prometheus/Grafana.

### 6.3 Disaster Recovery Planning  
- RTO/RPO targets; practice restores; multi-region clusters for HA.

### 6.4 Schema Versioning  
- Embed `schemaVersion` in documents; migrate via scripts or migration framework.

### 6.5 Multi-Tenancy  
- **Shared DB**: tenantId field + row-level filtering.  
- **Isolated DB**: separate database/cluster per tenant.  
- **Hybrid**: shard by tenantId.

---

## 7. Node.js Project: “Inventory Service”  

A sample service illustrating replication, sharding, SSL, RBAC, change streams, and backups.

```
inventory-service/
├── .env
├── package.json
├── config/
│   └── mongod.conf
├── src/
│   ├── db.js
│   ├── models/
│   │   └── product.js
│   ├── service.js
│   └── monitor.js
└── README.md
```

### 7.1 config/mongod.conf
```yaml
replication:
  replSetName: "rs0"
sharding:
  clusterRole: "shardsvr"
security:
  authorization: "enabled"
  keyFile: "/opt/mongo/keyfile"
net:
  tls:
    mode: "requireTLS"
    certificateKeyFile: "/opt/mongo/server.pem"
    CAFile: "/opt/mongo/ca.pem"
```

### 7.2 src/db.js
```js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
export const client = new MongoClient(process.env.MONGODB_URI, {
  tls: true,
  maxPoolSize: 30,
  minPoolSize: 5,
  authMechanism: "SCRAM-SHA-256"
});
export async function connect() {
  await client.connect();
  return client.db(process.env.DB_NAME);
}
```

### 7.3 src/models/product.js
```js
// Using native driver for performance
export function productCollection(db) {
  return db.collection("products");
}
// Ensure sharding
// mongo> sh.enableSharding("shop")
// mongo> sh.shardCollection("shop.products", { productId: "hashed" })
```

### 7.4 src/service.js
```js
import express from "express";
import { connect } from "./db.js";
const app = express();
app.use(express.json());

let db;
connect().then(database => {
  db = database;
  // create RBAC user if not exists
  db.command({
    createUser: "svcUser",
    pwd: process.env.SVC_PWD,
    roles: [{ role: "readWrite", db: process.env.DB_NAME }]
  }).catch(() => {});
});

app.get("/products/:id", async (req, res) => {
  const doc = await db.collection("products").findOne({ productId: req.params.id });
  res.json(doc);
});

app.post("/products", async (req, res) => {
  await db.collection("products").insertOne(req.body);
  res.sendStatus(201);
});

app.listen(4000, ()=> console.log("Service up on 4000"));
```

### 7.5 src/monitor.js
```js
import { connect, client } from "./db.js";
async function monitor() {
  const db = await connect();
  const coll = db.collection("products");
  const stream = coll.watch();
  stream.on("change", change => {
    console.log("Change detected:", change);
    // e.g. trigger backup when stock < threshold
    if (change.updateDescription?.updatedFields.stock < 10) {
      client.db().command({ createBackup: 1 }); // atlas-only example
    }
  });
}
monitor().catch(console.error);
```

---

### Deployment & Testing

1. **Configure** three `mongod` instances with **configsvr**, **shardsvr**, and **mongos** per steps above.  
2. **Initiate** replica sets and sharding.  
3. **Create** TLS certs and `keyFile` for internal auth.  
4. `npm install` → `node src/service.js` → `node src/monitor.js`.  
5. Exercise failover: kill primary, ensure service still reads from new primary.  
6. Test sharding: insert many products, confirm chunk splits via `sh.status()`.  
7. Validate RBAC: connect with `svcUser`, verify access denied for other operations.  
8. Monitor change streams: update stock below threshold, observe backup trigger.

---

📌 **Outcome:** You will have hands-on experience running MongoDB in production: HA via replica sets, linear scalability via sharding, enterprise security (TLS, RBAC, encryption), robust driver connections, real-time event processing, and operational