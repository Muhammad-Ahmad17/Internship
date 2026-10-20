🟢 Stage 1: Basic (Foundations) — Detailed Guide
👉 Goal: Get comfortable with basic usage and CRUD.

What is MongoDB? (NoSQL vs SQL, when to use)
Document Model (BSON, JSON-like documents)
Databases & Collections
CRUD operations (Insert, Find, Update, Delete)
Basic queries ($eq, $gt, $in, $and/$or)
Projection (select fields)
Sorting, limit, skip
MongoDB Shell (mongosh) basics

---

## 1) What is MongoDB? (NoSQL vs SQL, when to use)
- SQL (relational): fixed tables/columns, joins, strict schemas. Great for complex relationships and transactions.
- MongoDB (NoSQL, document DB): JSON-like documents, flexible schema, nested objects/arrays, easy horizontal scaling.
- Use MongoDB when:
  - Data is document-shaped (profiles, products, logs, events).
  - Schema evolves frequently.
  - High write throughput or large scale reads.
- Use SQL when:
  - Strong relational constraints and complex joins.
  - Multi-row transactional guarantees are core (e.g., accounting). MongoDB supports multi-document transactions, but relational fits naturally for heavy OLTP schemas.
---

## 🗄 SQL vs NoSQL

* **SQL (Relational Databases)** → Structured tables, rows, columns (e.g., MySQL, PostgreSQL, SQL Server).
* **NoSQL (Not Only SQL)** → Non-relational databases that store data in flexible formats.

  * Types include **Key-Value**, **Document**, **Columnar**, **Graph**.
  * Example: Cassandra (columnar), MongoDB (document), Redis (key-value).

👉 So yes, databases like **Cassandra** are **NoSQL** but specifically in the **Columnar** category.

---

## 🔑 Key-Value Store

* **Structure**: Data stored as a simple pair → **Key → Value**.
* **Keys** = unique identifiers (like a dictionary).
* **Values** = could be a string, JSON, binary, etc.
* **Examples**: Redis, DynamoDB (can act as key-value), Riak.
* **Use Cases**:

  * Caching
  * Session storage
  * Fast lookups

📌 **Analogy**: Like a phonebook → You search by *name* (key) to get *phone number* (value).

---

## 📄 Document Store

* **Structure**: Data stored as **documents** (usually JSON, BSON, or XML).
* **Each document** = flexible schema (fields can differ across docs).
* Supports **nested objects & arrays**.
* **Examples**: MongoDB, CouchDB, Amazon DocumentDB.
* **Use Cases**:

  * Content management
  * E-commerce catalogs (products with flexible attributes)
  * User profiles

📌 **Analogy**: Like a **file cabinet** → Each file (document) contains structured info, not just a single value.

---

## ⚖️ Key-Value vs Document Stores

| Feature         | Key-Value Store 🗝         | Document Store 📄                     |
| --------------- | -------------------------- | ------------------------------------- |
| **Data Model**  | Simple pairs (key → value) | JSON-like docs (fields + values)      |
| **Query**       | By key only                | By key + query inside document fields |
| **Flexibility** | Very simple, no schema     | Flexible schema (nested data allowed) |
| **Performance** | Super fast for lookups     | Slightly slower but more expressive   |
| **Examples**    | Redis, DynamoDB            | MongoDB, CouchDB                      |

---

✅ **In short**:

* All databases ≠ SQL → Many are **NoSQL** (key-value, document, columnar, graph).
* **Cassandra** = **Columnar NoSQL**.
* **MongoDB** = **Document NoSQL** (not just key-value).
* **Key-Value** = Simple lookups (fast).
* **Document** = Rich, flexible queries (powerful).
---

## 2) Document Model (BSON, JSON-like)
- Documents are stored as BSON (binary JSON) for speed and extra types (Date, Decimal128, ObjectId, etc.).
- Every document has a unique _id (default: ObjectId()).
Example document in a books collection:

```json
{
  "_id": { "$oid": "60f7d9e8a2b4c11f9c0d1234" },
  "title": "Clean Code",
  "author": { "name": "Robert C. Martin", "country": "US" },
  "year": 2008,
  "rating": 4.7,
  "price": 34.99,
  "tags": ["software", "craftsmanship"],
  "inStock": true
}
```

## 3) Databases & Collections
- A MongoDB server hosts databases; each database contains collections; collections hold documents.
- You can create them implicitly by first insert.

## 4) Quick setup (Linux)
Option A: Docker (recommended for local)
```bash
docker run -d --name mongo -p 27017:27017 mongo:7
# Open a shell
docker exec -it mongo mongosh
```

Option B: Atlas (cloud)
- Create a free cluster on https://www.mongodb.com/atlas, get a connection string (MONGODB_URI).

## 5) mongosh basics
```javascript
// In mongosh:
show dbs
use bookstore
db.createCollection("books")            // optional; insert will auto-create

// Create (Insert)
db.books.insertOne({ title: "Clean Code", year: 2008, rating: 4.7, tags:["software"], inStock:true })
db.books.insertMany([
  { title:"Design Patterns", year:1994, rating:4.6, tags:["software","patterns"], inStock:true, price:45 },
  { title:"Refactoring", year:1999, rating:4.5, tags:["software"], inStock:false, price:39.5 },
  { title:"The Pragmatic Programmer", year:1999, rating:4.8, tags:["software","craftsmanship"], inStock:true, price:42 }
])

// Read (Find)
db.books.find({ inStock: true })
db.books.find({ year: { $gt: 2000 } }, { title:1, year:1, _id:0 }) // projection

// Update
db.books.updateOne({ title: "Refactoring" }, { $set: { inStock: true }, $inc: { price: 1 } })

// Delete
db.books.deleteOne({ title: "Design Patterns" })

// Basic queries
db.books.find({ year: { $gt: 1998 } })                    // $gt
db.books.find({ title: { $in: ["Clean Code","Refactoring"] } })   // $in
db.books.find({ $and: [ { inStock: true }, { rating: { $gt: 4.6 } } ] }) // $and
db.books.find({ $or: [ { inStock: false }, { price: { $gt: 40 } } ] })   // $or

// Projection (select fields)
db.books.find({}, { title:1, price:1, _id:0 })

// Sorting, limit, skip
db.books.find().sort({ rating: -1, year: 1 }).limit(2).skip(1)
```

## 6) Node.js examples (using official driver)
Install:
```bash
mkdir mongodb-stage1 && cd mongodb-stage1
npm init -y
npm install mongodb dotenv
```

Create .env:
```dotenv
MONGODB_URI=mongodb://localhost:27017
DB_NAME=bookstore
```

index.js:
```js
/* Node.js MongoDB Stage 1 demo */
import { MongoClient } from "mongodb";
import 'dotenv/config';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "bookstore";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const books = db.collection("books");

    // Clean slate for demo
    await books.deleteMany({});

    // Create (Insert)
    await books.insertMany([
      { title:"Clean Code", year:2008, rating:4.7, tags:["software"], inStock:true, price:34.99 },
      { title:"Design Patterns", year:1994, rating:4.6, tags:["software","patterns"], inStock:true, price:45 },
      { title:"Refactoring", year:1999, rating:4.5, tags:["software"], inStock:false, price:39.5 },
      { title:"The Pragmatic Programmer", year:1999, rating:4.8, tags:["software","craftsmanship"], inStock:true, price:42 }
    ]);

    // Read (Find) with projection
    const inStockTitles = await books
      .find({ inStock: true }, { projection: { _id:0, title:1 } })
      .toArray();
    console.log("In-stock titles:", inStockTitles);

    // Basic queries: $gt, $in, $and/$or
    const newerThan1998 = await books.find({ year: { $gt: 1998 } }).toArray();
    console.log("Books year > 1998:", newerThan1998.map(b => b.title));

    const someTitles = await books.find({ title: { $in: ["Clean Code","Refactoring"] } }).toArray();
    console.log("$in titles:", someTitles.map(b => b.title));

    const goodAndStock = await books
      .find({ $and: [ { inStock:true }, { rating: { $gt: 4.6 } } ] })
      .toArray();
    console.log("$and filter:", goodAndStock.map(b => b.title));

    // Update (set + inc)
    const upd = await books.updateOne(
      { title:"Refactoring" },
      { $set: { inStock:true }, $inc: { price:1 } }
    );
    console.log("updateOne matched/modified:", upd.matchedCount, upd.modifiedCount);

    // Sorting, limit, skip
    const topByRating = await books
      .find({}, { projection: { _id:0, title:1, rating:1 } })
      .sort({ rating:-1, year:1 })
      .limit(2)
      .skip(1)
      .toArray();
    console.log("Sorted limited skipped:", topByRating);

    // Delete
    const del = await books.deleteOne({ title:"Design Patterns" });
    console.log("Deleted count:", del.deletedCount);

  } finally {
    await client.close();
  }
}

run().catch(console.error);
```

Run:
```bash
node index.js
```

## 7) Raw MongoDB queries recap (copy-paste friendly)
```javascript
// Create
db.books.insertOne({ title:"Clean Code", year:2008, rating:4.7, inStock:true, price:34.99 })
db.books.insertMany([
  { title:"Design Patterns", year:1994, rating:4.6, inStock:true, price:45 },
  { title:"Refactoring", year:1999, rating:4.5, inStock:false, price:39.5 },
  { title:"The Pragmatic Programmer", year:1999, rating:4.8, inStock:true, price:42 }
])

// Read with operators
db.books.find({ year: { $gt: 1998 } })
db.books.find({ title: { $in: ["Clean Code","Refactoring"] } })
db.books.find({ $and: [ { inStock:true }, { rating: { $gt: 4.6 } } ] })
db.books.find({ $or: [ { inStock:false }, { price: { $gt: 40 } } ] })

// Projection
db.books.find({}, { _id:0, title:1, price:1 })

// Sort, limit, skip
db.books.find().sort({ rating:-1, year:1 }).limit(2).skip(1)

// Update
db.books.updateOne({ title:"Refactoring" }, { $set: { inStock:true }, $inc: { price:1 } })

// Delete
db.books.deleteOne({ title:"Design Patterns" })
```

📌 Output of this stage → You can use MongoDB like a normal DB for small apps.

---

🧪 Mini Project: Bookstore Basics (Stage 1 skills check)

Build a minimal Node.js script or simple Express API that manages a books collection.

Requirements:
- Data model: { title, author (string), year (number), rating (number), price (number), tags (array), inStock (bool) }
- Implement CRUD:
  - createBook(doc)
  - getBooks(filter, projection, sort, limit, skip)
  - updateBook(filter, updateOps)
  - deleteBook(filter)
- Queries to support:
  - Find in-stock books with rating > 4.5
  - Return only title and price (projection)
  - Sort by rating desc, then year asc; limit 3, skip 0
  - Find books where title in ["Clean Code","Refactoring"]
- CLI or API:
  - CLI: node app.js list --inStock --minRating=4.5
  - OR API: GET /books?inStock=true&minRating=4.5
- Seed script to insert sample books
- README explaining how to run

Bonus:
- Validate inputs (e.g., ensure year is number).
- Use dotenv for config.
- Write a small healthcheck that pings the DB.

Acceptance:
- Demo commands/requests produce expected output using the filters, projections, sorting, limit, skip.

Tip:
- Reuse the index.js patterns above; extract functions per requirement.

