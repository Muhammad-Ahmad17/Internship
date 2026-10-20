
# 🟡 Stage 2: Intermediate (Schema & Querying)

👉 **Goal:** Model real-world data effectively and write powerful, efficient MongoDB queries.

---

## 1. Schema Design

### 1.1 Embedded vs Referenced
Theory
- **Embedded**: Stores related data in the same document.  
  • Fast reads, atomic updates.  
  • Good for 1–few, small sub-docs.  
  • Beware 16 MB limit and unbounded arrays.
- **Referenced**: Stores foreign keys (ObjectId) to another collection.  
  • Flexible for unbounded or shared data.  
  • Requires additional round-trips or `$lookup`.

Examples
```js
// Embedded: Comments within a Post
db.posts.insertOne({
  title: "Hello",
  comments: [
    { user: "A", text: "Nice!", createdAt: new Date() },
    { user: "B", text: "Thanks!", createdAt: new Date() }
  ]
});

// Referenced: Separate Comments collection
db.posts.insertOne({ title: "Hello" });
const postId = /* ... */;
db.comments.insertMany([
  { postId, user: "A", text: "Nice!" },
  { postId, user: "B", text: "Thanks!" }
]);
```

Pitfalls
- Embedded arrays can grow unbounded → consider capping size or moving old items out.
- References incur extra lookup → use `$lookup` or application-side join.

---

### 1.2 Relationship Patterns

1) **One-to-One**  
   • Embed small profile in `users` or reference larger profile doc.  
   • Example:  
   ```js
   // Embed
   db.users.insertOne({ _id:1, name:"Alice", profile:{ age:30, bio:"..." } });
   // Reference
   db.profiles.insertOne({ userId:1, age:30, bio:"..." });
   ```

2) **One-to-Many**  
   - Bounded (embed): orders in customer up to N.  
   - Unbounded (reference): separate orders collection with `customerId`.

3) **Many-to-Many**  
   - Embed array of ids: `post.tags = ["news","tech"]`.  
   - Join collection: `userGroups` with `{ userId, groupId }` if metadata needed.

---

### 1.3 Common Schema Patterns

1) **Bucket (time-series)**  
   - Group events by time window (day/hour).  
   - Pros: fewer docs, sorted reads.  
   - Cons: hot spots, doc growth → pick window wisely.  
   ```js
   db.events.insertOne({
     bucketKey:"2025-09-03", readings:[{ t:ISODate(), v:42 },…]
   });
   ```

2) **Outlier**  
   - Move large/rare fields to side collection to keep hot doc small.  
   ```js
   db.users.insertOne({ _id:1, name:"Alice", ... });
   db.userExtras.insertOne({ userId:1, largeBlob:… });
   ```

3) **Extended Reference**  
   - Store subset of referenced doc for join-less reads; stale if source changes.  
   ```js
   db.comments.insertOne({
     postId, userId, username, userAvatar, text
   });
   ```

4) **Tree**  
   - Parent reference: `{ parentId }`.  
   - Materialized path: `{ path:"/root/a/b" }`.  
   - Ancestors array: `{ ancestors:[rootId,aId] }`.

---

## 2. Querying

### 2.1 Array Queries
- `$elemMatch`: match object in array with multiple conditions.  
- `$size`: exact length match (no index).  
- `$all`: array contains all specified values.  
- `$in`: any of values.

Examples
```js
db.posts.find({ 
  comments: { 
    $elemMatch: { user:"A", createdAt:{ $gte: ISODate("2025-01-01") } } 
  } 
});

db.tags.find({ tags: { $all:["tech","mongodb"] } });
```

Index tip: one array field per compound index.

---

### 2.2 Text Search
- Single text index per collection; can include multiple fields.  
- Stemming, stop words by language.  
- Query with `$text`, project `{ score:{ $meta:"textScore" } }`, sort by score.

Examples
```js
db.articles.createIndex({ title:"text", body:"text" },{ default_language:"english" });
db.articles.find(
  { $text:{ $search:"\"exact phrase\" -exclude" } },
  { title:1, score:{ $meta:"textScore" } }
).sort({ score:{ $meta:"textScore" } });
```

Pitfall: text indexes ignore fields not included and exact matches; use normal indexes instead.

---

### 2.3 Aggregation Basics
Theory
- Data flows through stages; order affects performance.  
- Common stages:  
  1. `$match` – filter early  
  2. `$sort` – leverage index  
  3. `$project` – drop unused fields  
  4. `$group` – aggregate  
  5. `$lookup`/`$unwind` – joins & array expansion  
  6. `$limit` – constrain output

Examples
```js
// Total orders per customer
db.orders.aggregate([
  { $match:{ status:"shipped" } },
  { $group:{ _id:"$customerId", count:{ $sum:1 }, total:{ $sum:"$amount" } } },
  { $sort:{ total:-1 } },
  { $limit:10 }
]);
```

---

## 3. Indexes

### 3.1 Single-Field & Compound
- **Single**: `{ field:1 }`, good for equality or simple sort.  
- **Compound**: follow ESR (Equality → Sort → Range).  

```js
db.orders.createIndex({ customerId:1, orderDate:-1 });
```

### 3.2 Multikey
- Index on array field; one per compound index.  
- Example:  
```js
db.posts.createIndex({ tags:1 });
```

### 3.3 Text & TTL
- **Text**: for `$text` queries.  
- **TTL**: auto-expire docs by date field.  
```js
db.sessions.createIndex({ lastActive:1 },{ expireAfterSeconds:3600 });
```

---

## 4. Node.js Project: “Blog & Comment API”

A sample Express + MongoDB app demonstrating schema design, array queries, text search, aggregation, and indexes.

#### Structure
```
blog-api/
├── .env
├── package.json
├── src/
│   ├── db.js
│   ├── seed.js
│   ├── routes.js
│   └── server.js
└── README.md
```

#### .env
```
MONGODB_URI=mongodb://localhost:27017/blogdb
```

#### src/db.js
```js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const client = new MongoClient(process.env.MONGODB_URI);
export async function connect() {
  await client.connect();
  return client.db();
}
export { client };
```

#### src/seed.js
```js
import { connect, client } from "./db.js";
async function seed() {
  const db = await connect();
  const users = db.collection("users"), posts = db.collection("posts");
  await Promise.all([users.drop().catch(()=>{}), posts.drop().catch(()=>{})]);

  // Indexes
  await posts.createIndex({ title:"text", body:"text" });
  await posts.createIndex({ authorId:1, createdAt:-1 });
  await users.createIndex({ email:1 },{ unique:true });

  // Insert users
  const alice = await users.insertOne({ name:"Alice", email:"alice@x.com", profile:{ age:30 } });
  const bob   = await users.insertOne({ name:"Bob",   email:"bob@x.com",   profile:{ age:25 } });

  // Insert posts with embedded comments
  await posts.insertOne({
    authorId: alice.insertedId,
    title:"Intro to MongoDB",
    body:"...text...",
    tags:["mongodb","database"],
    createdAt: new Date(),
    comments:[
      { userId: bob.insertedId, text:"Great post!", createdAt:new Date() }
    ]
  });
  console.log("Seeded.");
  await client.close();
}
seed().catch(console.error);
```

#### src/routes.js
```js
import express from "express";
export const router = express.Router();

// Create post
router.post("/posts", async (req,res) => {
  const db = req.app.locals.db;
  const doc = { ...req.body, createdAt:new Date(), comments:[] };
  const result = await db.collection("posts").insertOne(doc);
  res.json(result);
});

// Add comment (embedded)
router.post("/posts/:id/comments", async (req,res) => {
  const db = req.app.locals.db;
  const postId = new req.app.locals.ObjectId(req.params.id);
  const comment = { userId:new req.app.locals.ObjectId(req.body.userId),
                    text:req.body.text, createdAt:new Date() };
  await db.collection("posts").updateOne(
    { _id:postId },
    { $push:{ comments:comment } }
  );
  res.sendStatus(204);
});

// Text search
router.get("/search", async (req,res) => {
  const db = req.app.locals.db;
  const q = req.query.q || "";
  const docs = await db.collection("posts")
    .find({ $text:{ $search:q } },
          { projection:{ score:{ $meta:"textScore" }, title:1, tags:1 } })
    .sort({ score:{ $meta:"textScore" } })
    .toArray();
  res.json(docs);
});

// Posts with >N comments
router.get("/posts/popular", async (req,res) => {
  const db = req.app.locals.db;
  const n = parseInt(req.query.min || "1",10);
  const docs = await db.collection("posts")
    .find({ comments:{ $size: n } })
    .toArray();
  res.json(docs);
});

// Aggregate: posts per author
router.get("/stats/authors", async (req,res) => {
  const db = req.app.locals.db;
  const pipeline = [
    { $group:{ _id:"$authorId", count:{ $sum:1 } } },
    { $lookup:{
        from:"users", localField:"_id", foreignField:"_id", as:"user"
      }
    },
    { $unwind:"$user" },
    { $project:{ _id:0, author:"$user.name", count:1 } },
    { $sort:{ count:-1 } }
  ];
  const stats = await db.collection("posts").aggregate(pipeline).toArray();
  res.json(stats);
});
```

#### src/server.js
```js
import express from "express";
import { connect, client } from "./db.js";
import { router } from "./routes.js";
import { ObjectId } from "mongodb";

async function main(){
  const db = await connect();
  const app = express();
  app.use(express.json());
  app.locals.db = db;
  app.locals.ObjectId = ObjectId;
  app.use("/api", router);
  app.listen(3000, ()=>console.log("Server @ http://localhost:3000"));
}
main().catch(console.error);
```

#### package.json (partial)
```json
{
  "type":"module",
  "dependencies":{
    "dotenv":"^16.0.0",
    "express":"^4.18.2",
    "mongodb":"^5.0.0"
  },
  "scripts":{
    "seed":"node src/seed.js",
    "start":"node src/server.js"
  }
}
```

---

### Run & Validate

1. `npm install`  
2. `npm run seed`  
3. `npm start`  
4. Test endpoints:
   - `POST  /api/posts`  
   - `POST  /api/posts/:id/comments`  
   - `GET   /api/search?q=mongo`  
   - `GET   /api/posts/popular?min=1`  
   - `GET   /api/stats/authors`  

📌 **Outcome:** You’ll practice embedding vs referencing, run array queries, leverage text search, build aggregation pipelines, and choose