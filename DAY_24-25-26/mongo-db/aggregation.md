
# MongoDB Aggregation vs. MSSQL — a practical, horizontal guide

## Data model we’ll reference

**MongoDB (denormalized)**
`orders`

```jsonc
{
  _id: ObjectId("..."),
  buyerId: ObjectId("..."),
  items: [ { productId: ObjectId("..."), qty: 2, price: 1200 } ],
  paymentMethod: "Card",
  status: "Completed",
  orderDate: ISODate("2025-08-20")
}
```

`products` → `{ _id, name, category, vendorId }`
`users` → `{ _id, name, role }`

**MSSQL (normalized)**

* `Users(UserId PK, Name, Role, ReferredBy NULL)`
* `Products(ProductId PK, Name, Category, VendorId)`
* `Orders(OrderId PK, BuyerId FK, PaymentMethod, Status, OrderDate)`
* `OrderItems(OrderItemId PK, OrderId FK, ProductId FK, Qty, Price)`

> Tip: Mongo often **embeds** (`items` array), SQL **normalizes** (`OrderItems` table). Most differences come from this.

---

## 1) Filtering: `$match` vs `WHERE`

**MongoDB**

```js
db.orders.aggregate([
  {
    $match: {
      status: "Completed",
      orderDate: { $gte: ISODate("2025-08-01"), $lt: ISODate("2025-09-01") }
    }
  },
  { $project: { _id: 0, orderId: "$_id", buyerId: 1, paymentMethod: 1, orderDate: 1 } }
])
```

**MSSQL**

```sql
SELECT o.OrderId, o.BuyerId, o.PaymentMethod, o.OrderDate
FROM dbo.Orders AS o
WHERE o.Status = 'Completed'
  AND o.OrderDate >= '2025-08-01' AND o.OrderDate < '2025-09-01';
```

**Notes**

* Put `$match` **as early as possible** for performance (like pushing filters to indexes).

---

## 2) Projection & computed fields: `$project/$addFields` vs computed `SELECT`

**Goal:** order value per order.

**MongoDB**

```js
db.orders.aggregate([
  { $match: { status: "Completed" } },
  { $unwind: "$items" },
  { $group: {
      _id: "$_id",
      orderDate: { $first: "$orderDate" },
      orderValue: { $sum: { $multiply: [ "$items.qty", "$items.price" ] } }
  }},
  { $project: { _id: 0, orderId: "$_id", orderDate: 1, orderValue: 1 } }
])
```

**MSSQL**

```sql
SELECT o.OrderId, o.OrderDate,
       SUM(oi.Qty * oi.Price) AS OrderValue
FROM dbo.Orders o
JOIN dbo.OrderItems oi ON oi.OrderId = o.OrderId
WHERE o.Status = 'Completed'
GROUP BY o.OrderId, o.OrderDate;
```

**Notes**

* In Mongo, you often **unwind arrays** before aggregating.

---

## 3) Monthly revenue & AOV (average order value)

**MongoDB**

```js
db.orders.aggregate([
  { $match: { status: "Completed", orderDate: { $gte: ISODate("2025-01-01"), $lt: ISODate("2026-01-01") } } },
  { $unwind: "$items" },
  { $addFields: { itemRevenue: { $multiply: [ "$items.qty", "$items.price" ] } } },
  { $group: {
      _id: { $dateTrunc: { date: "$orderDate", unit: "month" } },
      revenue: { $sum: "$itemRevenue" },
      orders:  { $addToSet: "$_id" }
  }},
  { $project: {
      _id: 0,
      month: "$_id",
      revenue: 1,
      orderCount: { $size: "$orders" },
      avgOrderValue: { $divide: [ "$revenue", { $max: [ 1, { $size: "$orders" } ] } ] }
  }},
  { $sort: { month: 1 } }
])
```

**MSSQL**

```sql
WITH order_totals AS (
  SELECT o.OrderId, o.OrderDate, SUM(oi.Qty * oi.Price) AS OrderValue
  FROM dbo.Orders o
  JOIN dbo.OrderItems oi ON oi.OrderId = o.OrderId
  WHERE o.Status = 'Completed'
    AND o.OrderDate >= '2025-01-01' AND o.OrderDate < '2026-01-01'
  GROUP BY o.OrderId, o.OrderDate
)
SELECT DATEFROMPARTS(YEAR(OrderDate), MONTH(OrderDate), 1) AS [Month],
       COUNT(*) AS OrderCount,
       SUM(OrderValue) AS Revenue,
       AVG(OrderValue) AS AvgOrderValue
FROM order_totals
GROUP BY DATEFROMPARTS(YEAR(OrderDate), MONTH(OrderDate), 1)
ORDER BY [Month];
```

**Notes**

* Mongo’s `$dateTrunc` ≈ SQL’s `DATEFROMPARTS(YEAR(),MONTH(),1)` for month grouping.

---

## 4) Sorting & pagination: `$sort/$skip/$limit` vs `ORDER BY/OFFSET`

**MongoDB**

```js
db.orders.aggregate([
  { $match: { status: "Completed" } },
  { $sort: { orderDate: -1 } },
  { $skip: 20 },
  { $limit: 10 },
  { $project: { _id: 0, orderId: "$_id", orderDate: 1 } }
])
```

**MSSQL**

```sql
SELECT o.OrderId, o.OrderDate
FROM dbo.Orders o
WHERE o.Status = 'Completed'
ORDER BY o.OrderDate DESC
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;
```

**Notes**

* Prefer **index-supported sort**; otherwise both engines spill to disk.

---

## 5) Joins: `$lookup` (basic & pipeline) vs `JOIN`

**Goal:** top 3 products per month by revenue.

**MongoDB**

```js
db.orders.aggregate([
  { $match: { status: "Completed", orderDate: { $gte: ISODate("2025-01-01"), $lt: ISODate("2026-01-01") } } },
  { $unwind: "$items" },
  { $addFields: {
      month: { $dateTrunc: { date: "$orderDate", unit: "month" } },
      itemRevenue: { $multiply: [ "$items.qty", "$items.price" ] }
  }},
  { $group: {
      _id: { month: "$month", productId: "$items.productId" },
      revenue: { $sum: "$itemRevenue" },
      qty: { $sum: "$items.qty" }
  }},
  { $lookup: { from: "products", localField: "_id.productId", foreignField: "_id", as: "p" } },
  { $unwind: "$p" },
  { $sort: { "_id.month": 1, revenue: -1 } },
  { $group: {
      _id: "$_id.month",
      topProducts: { $push: { productId: "$_id.productId", name: "$p.name", category: "$p.category", revenue: "$revenue", qty: "$qty" } }
  }},
  { $project: { _id: 0, month: "$_id", topProducts: { $slice: [ "$topProducts", 3 ] } } },
  { $sort: { month: 1 } }
])
```

**MSSQL**

```sql
WITH item_totals AS (
  SELECT DATEFROMPARTS(YEAR(o.OrderDate), MONTH(o.OrderDate), 1) AS [Month],
         oi.ProductId,
         SUM(oi.Qty * oi.Price) AS Revenue,
         SUM(oi.Qty) AS Qty
  FROM dbo.Orders o
  JOIN dbo.OrderItems oi ON oi.OrderId = o.OrderId
  WHERE o.Status = 'Completed'
    AND o.OrderDate >= '2025-01-01' AND o.OrderDate < '2026-01-01'
  GROUP BY DATEFROMPARTS(YEAR(o.OrderDate), MONTH(o.OrderDate), 1), oi.ProductId
),
ranked AS (
  SELECT it.[Month], it.ProductId, p.Name, p.Category, it.Revenue, it.Qty,
         ROW_NUMBER() OVER (PARTITION BY it.[Month] ORDER BY it.Revenue DESC) AS rn
  FROM item_totals it
  JOIN dbo.Products p ON p.ProductId = it.ProductId
)
SELECT [Month], ProductId, Name, Category, Revenue, Qty
FROM ranked
WHERE rn <= 3
ORDER BY [Month], Revenue DESC;
```

**Notes**

* Mongo also supports **pipeline `$lookup`** with `let` + `$expr` for advanced join filters.

---

## 6) Arrays: `$unwind`, `$map`, `$filter` vs `JOIN`/`OPENJSON`/`APPLY`

**Goal:** keep only items with `qty >= 2`, recompute order value.

**MongoDB**

```js
db.orders.aggregate([
  { $match: { status: "Completed" } },
  { $addFields: {
      items: {
        $filter: { input: "$items", as: "it", cond: { $gte: [ "$$it.qty", 2 ] } }
      }
  }},
  { $unwind: "$items" },
  { $group: {
      _id: "$_id",
      orderValue: { $sum: { $multiply: [ "$items.qty", "$items.price" ] } }
  }}
])
```

**MSSQL (normalized)** → just filter `OrderItems`:

```sql
SELECT o.OrderId, SUM(oi.Qty * oi.Price) AS OrderValue
FROM dbo.Orders o
JOIN dbo.OrderItems oi ON oi.OrderId = o.OrderId
WHERE o.Status = 'Completed' AND oi.Qty >= 2
GROUP BY o.OrderId;
```

---

## 7) Conditional logic: `$cond/$ifNull` vs `CASE/ISNULL`

**MongoDB**

```js
db.orders.aggregate([
  { $project: {
      orderId: "$_id",
      isRefund: { $cond: [ { $eq: [ "$status", "Refunded" ] }, true, false ] },
      method: { $ifNull: [ "$paymentMethod", "Unknown" ] }
  } }
])
```

**MSSQL**

```sql
SELECT o.OrderId,
       CASE WHEN o.Status = 'Refunded' THEN 1 ELSE 0 END AS IsRefund,
       ISNULL(o.PaymentMethod, 'Unknown') AS [Method]
FROM dbo.Orders o;
```

---

## 8) Payment method split per month

**MongoDB**

```js
db.orders.aggregate([
  { $match: { status: "Completed" } },
  { $addFields: { month: { $dateTrunc: { date: "$orderDate", unit: "month" } } } },
  { $group: { _id: { month: "$month", method: "$paymentMethod" }, count: { $sum: 1 } } },
  { $group: { _id: "$_id.month", methods: { $push: { method: "$_id.method", count: "$count" } } } },
  { $project: { _id: 0, month: "$_id", methods: 1 } },
  { $sort: { month: 1 } }
])
```

**MSSQL**

```sql
SELECT DATEFROMPARTS(YEAR(OrderDate), MONTH(OrderDate), 1) AS [Month],
       PaymentMethod, COUNT(*) AS [Count]
FROM dbo.Orders
WHERE Status = 'Completed'
GROUP BY DATEFROMPARTS(YEAR(OrderDate), MONTH(OrderDate), 1), PaymentMethod
ORDER BY [Month], [Count] DESC;
```

---

## 9) Top-N per group pattern

**MongoDB (top 2 buyers by revenue per month)**

```js
db.orders.aggregate([
  { $match: { status: "Completed" } },
  { $unwind: "$items" },
  { $addFields: {
      month: { $dateTrunc: { date: "$orderDate", unit: "month" } },
      itemRevenue: { $multiply: [ "$items.qty", "$items.price" ] }
  }},
  { $group: { _id: { month: "$month", buyerId: "$buyerId" }, revenue: { $sum: "$itemRevenue" } } },
  { $sort: { "_id.month": 1, revenue: -1 } },
  { $group: { _id: "$_id.month", buyers: { $push: { buyerId: "$_id.buyerId", revenue: "$revenue" } } } },
  { $project: { _id: 0, month: "$_id", topBuyers: { $slice: [ "$buyers", 2 ] } } },
  { $sort: { month: 1 } }
])
```

**MSSQL**

```sql
WITH buyer_rev AS (
  SELECT DATEFROMPARTS(YEAR(o.OrderDate), MONTH(o.OrderDate), 1) AS [Month],
         o.BuyerId,
         SUM(oi.Qty * oi.Price) AS Revenue
  FROM dbo.Orders o
  JOIN dbo.OrderItems oi ON oi.OrderId = o.OrderId
  WHERE o.Status = 'Completed'
  GROUP BY DATEFROMPARTS(YEAR(o.OrderDate), MONTH(o.OrderDate), 1), o.BuyerId
),
ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY [Month] ORDER BY Revenue DESC) AS rn
  FROM buyer_rev
)
SELECT [Month], BuyerId, Revenue
FROM ranked
WHERE rn <= 2
ORDER BY [Month], Revenue DESC;
```

---

## 10) Window functions / running totals

**MongoDB (`$setWindowFields`)**

```js
db.orders.aggregate([
  { $match: { status: "Completed" } },
  { $unwind: "$items" },
  { $group: {
      _id: { orderId: "$_id", buyerId: "$buyerId", orderDate: "$orderDate" },
      orderValue: { $sum: { $multiply: [ "$items.qty", "$items.price" ] } }
  }},
  { $setWindowFields: {
      partitionBy: "$_id.buyerId",
      sortBy: { "_id.orderDate": 1 },
      output: {
        runningRevenue: {
          $sum: "$orderValue",
          window: { documents: [ "unbounded", "current" ] }
        }
      }
  }},
  { $project: {
      _id: 0,
      orderId: "$_id.orderId",
      buyerId: "$_id.buyerId",
      orderDate: "$_id.orderDate",
      orderValue: 1,
      runningRevenue: 1
  } }
])
```

**MSSQL**

```sql
WITH ov AS (
  SELECT o.OrderId, o.BuyerId, o.OrderDate, SUM(oi.Qty * oi.Price) AS OrderValue
  FROM dbo.Orders o
  JOIN dbo.OrderItems oi ON oi.OrderId = o.OrderId
  WHERE o.Status = 'Completed'
  GROUP BY o.OrderId, o.BuyerId, o.OrderDate
)
SELECT *, SUM(OrderValue) OVER (PARTITION BY BuyerId ORDER BY OrderDate
                                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningRevenue
FROM ov
ORDER BY BuyerId, OrderDate;
```

---

## 11) Faceted dashboards (multiple outputs at once)

**MongoDB (`$facet`)**

```js
db.orders.aggregate([
  { $match: { status: "Completed", orderDate: { $gte: ISODate("2025-01-01"), $lt: ISODate("2026-01-01") } } },
  { $facet: {
    revenueByMonth: [
      { $unwind: "$items" },
      { $addFields: {
          month: { $dateTrunc: { date: "$orderDate", unit: "month" } },
          itemRevenue: { $multiply: [ "$items.qty", "$items.price" ] }
      }},
      { $group: { _id: "$month", revenue: { $sum: "$itemRevenue" } } },
      { $project: { _id: 0, month: "$_id", revenue: 1 } },
      { $sort: { month: 1 } }
    ],
    topVendors: [
      { $unwind: "$items" },
      { $group: { _id: "$items.productId", revenue: { $sum: { $multiply: [ "$items.qty", "$items.price" ] } } } },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "p" } },
      { $unwind: "$p" },
      { $group: { _id: "$p.vendorId", revenue: { $sum: "$revenue" } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ],
    paymentSplit: [
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
      { $project: { _id: 0, method: "$_id", count: 1 } }
    ]
  } }
])
```

**MSSQL** (return multiple result sets in one batch):

```sql
-- Revenue by month
SELECT DATEFROMPARTS(YEAR(o.OrderDate), MONTH(o.OrderDate), 1) AS [Month],
       SUM(oi.Qty * oi.Price) AS Revenue
FROM dbo.Orders o
JOIN dbo.OrderItems oi ON oi.OrderId = o.OrderId
WHERE o.Status = 'Completed'
  AND o.OrderDate >= '2025-01-01' AND o.OrderDate < '2026-01-01'
GROUP BY DATEFROMPARTS(YEAR(o.OrderDate), MONTH(o.OrderDate), 1)
ORDER BY [Month];

-- Top vendors
SELECT p.VendorId, SUM(oi.Qty * oi.Price) AS Revenue
FROM dbo.Orders o
JOIN dbo.OrderItems oi ON oi.OrderId = o.OrderId
JOIN dbo.Products p ON p.ProductId = oi.ProductId
WHERE o.Status = 'Completed'
  AND o.OrderDate >= '2025-01-01' AND o.OrderDate < '2026-01-01'
GROUP BY p.VendorId
ORDER BY Revenue DESC
OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY;

-- Payment split
SELECT o.PaymentMethod, COUNT(*) AS [Count]
FROM dbo.Orders o
WHERE o.Status = 'Completed'
GROUP BY o.PaymentMethod;
```

---

## 12) Bucketing: `$bucket` / `$bucketAuto` vs `CASE`

**MongoDB**

```js
db.orders.aggregate([
  { $match: { status: "Completed" } },
  { $unwind: "$items" },
  { $group: { _id: "$_id", orderValue: { $sum: { $multiply: [ "$items.qty", "$items.price" ] } } } },
  { $bucket: {
      groupBy: "$orderValue",
      boundaries: [ 0, 50, 100, 200, 500, 1000, 1000000000 ],
      default: "1000+",
      output: { count: { $sum: 1 } }
  } }
])
```

**MSSQL**

```sql
WITH ov AS (
  SELECT o.OrderId, SUM(oi.Qty * oi.Price) AS OrderValue
  FROM dbo.Orders o
  JOIN dbo.OrderItems oi ON oi.OrderId = o.OrderId
  WHERE o.Status = 'Completed'
  GROUP BY o.OrderId
)
SELECT CASE
         WHEN OrderValue < 50  THEN '0-50'
         WHEN OrderValue < 100 THEN '50-100'
         WHEN OrderValue < 200 THEN '100-200'
         WHEN OrderValue < 500 THEN '200-500'
         WHEN OrderValue < 1000 THEN '500-1000'
         ELSE '1000+'
       END AS Bucket,
       COUNT(*) AS [Count]
FROM ov
GROUP BY CASE
           WHEN OrderValue < 50  THEN '0-50'
           WHEN OrderValue < 100 THEN '50-100'
           WHEN OrderValue < 200 THEN '100-200'
           WHEN OrderValue < 500 THEN '200-500'
           WHEN OrderValue < 1000 THEN '500-1000'
           ELSE '1000+'
         END;
```

---

## 13) Anti-join (find buyers with **zero** completed orders)

**MongoDB**

```js
db.users.aggregate([
  { $match: { role: "buyer" } },
  { $lookup: {
      from: "orders",
      let: { uid: "$_id" },
      pipeline: [
        { $match: { $expr: { $and: [ { $eq: [ "$buyerId", "$$uid" ] }, { $eq: [ "$status", "Completed" ] } ] } } }
      ],
      as: "orders"
  } },
  { $match: { orders: { $size: 0 } } },
  { $project: { _id: 0, userId: "$_id", name: 1 } }
])
```

**MSSQL**

```sql
SELECT u.UserId, u.Name
FROM dbo.Users u
LEFT JOIN dbo.Orders o
  ON o.BuyerId = u.UserId
 AND o.Status = 'Completed'
WHERE u.Role = 'buyer'
  AND o.OrderId IS NULL;
```

---

## 14) Recursive relationships (referrals/tree)

**MongoDB (`$graphLookup`)**

```js
db.users.aggregate([
  { $match: { _id: ObjectId("PUT-ROOT-USER-ID") } },
  { $graphLookup: {
      from: "users",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "referredBy",
      as: "downline",
      maxDepth: 5
  } }
])
```

**MSSQL (recursive CTE)**

```sql
WITH cte AS (
  SELECT * FROM dbo.Users WHERE UserId = @RootUserId
  UNION ALL
  SELECT u.*
  FROM dbo.Users u
  JOIN cte p ON u.ReferredBy = p.UserId
)
SELECT * FROM cte;
```

---

## 15) Performance playbook (quick, practical)

* **MongoDB**

  * Create indexes that support your earliest `$match` and join keys (e.g., `orders: { orderDate: 1, status: 1 }`, `products: { _id: 1 }`).
  * Put `$match` and `$project` **as early as possible**.
  * Avoid `$sort` without an index; or use `$sort` **after** `$match` reduces volume.
  * For joins, index `foreignField` (e.g., `products._id`) and the local field when used in `$match`.
  * Use `.allowDiskUse(true)` for heavy sorts/aggregations.
  * Inspect with `.explain("executionStats")`. Sample with an early `{ $limit: N }` while building.

* **MSSQL**

  * Clustered index on `Orders(OrderDate)` or `(Status, OrderDate)` depending on patterns; nonclustered on `Orders(Status, OrderDate) INCLUDE (...)`.
  * Index `OrderItems(OrderId)`, `OrderItems(ProductId)`, `Products(ProductId)`.
  * Use `SET STATISTICS IO, TIME ON` and **actual execution plan**.
  * Precompute heavy metrics into **indexed views** or materialize with jobs for dashboards.

---

## 16) Quick cheatsheet (stage ↔ clause)

| You want…              | MongoDB                       | MSSQL                                |
| ---------------------- | ----------------------------- | ------------------------------------ |
| Filter                 | `$match`                      | `WHERE`                              |
| Choose/compute columns | `$project`, `$addFields`      | `SELECT` expressions                 |
| Group & aggregate      | `$group`                      | `GROUP BY` + aggregates              |
| Sort                   | `$sort`                       | `ORDER BY`                           |
| Pagination             | `$skip`, `$limit`             | `OFFSET … FETCH`                     |
| Join                   | `$lookup` (pipeline optional) | `JOIN`                               |
| Explode array          | `$unwind`                     | normalized join / `OPENJSON` / APPLY |
| Top-N per group        | `$sort`→`$group` push+slice   | `ROW_NUMBER()` + filter              |
| Running totals/window  | `$setWindowFields`            | `OVER (PARTITION BY … ORDER BY …)`   |
| Multi-result dashboard | `$facet`                      | multiple `SELECT`s / temp tables     |
| Bucketing              | `$bucket`, `$bucketAuto`      | `CASE` ranges                        |
| Recursion              | `$graphLookup`                | recursive CTE                        |

---

## 17) “Just the queries” (copy-paste block)

**MongoDB – Monthly revenue & top 3 products**

```js
db.orders.aggregate([
  { $match: { status: "Completed", orderDate: { $gte: ISODate("2025-01-01"), $lt: ISODate("2026-01-01") } } },
  { $unwind: "$items" },
  { $addFields: {
      month: { $dateTrunc: { date: "$orderDate", unit: "month" } },
      itemRevenue: { $multiply: [ "$items.qty", "$items.price" ] }
  }},
  { $group: { _id: { month: "$month", productId: "$items.productId" }, revenue: { $sum: "$itemRevenue" }, qty: { $sum: "$items.qty" } } },
  { $lookup: { from: "products", localField: "_id.productId", foreignField: "_id", as: "p" } },
  { $unwind: "$p" },
  { $sort: { "_id.month": 1, revenue: -1 } },
  { $group: { _id: "$_id.month", topProducts: { $push: { productId: "$_id.productId", name: "$p.name", category: "$p.category", revenue: "$revenue", qty: "$qty" } } } },
  { $project: { _id: 0, month: "$_id", topProducts: { $slice: [ "$topProducts", 3 ] } } },
  { $sort: { month: 1 } }
])
```

**MSSQL – Monthly revenue & top 3 products**

```sql
WITH item_totals AS (
  SELECT DATEFROMPARTS(YEAR(o.OrderDate), MONTH(o.OrderDate), 1) AS [Month],
         oi.ProductId,
         SUM(oi.Qty * oi.Price) AS Revenue,
         SUM(oi.Qty) AS Qty
  FROM dbo.Orders o
  JOIN dbo.OrderItems oi ON oi.OrderId = o.OrderId
  WHERE o.Status = 'Completed'
    AND o.OrderDate >= '2025-01-01' AND o.OrderDate < '2026-01-01'
  GROUP BY DATEFROMPARTS(YEAR(o.OrderDate), MONTH(o.OrderDate), 1), oi.ProductId
),
ranked AS (
  SELECT it.[Month], it.ProductId, p.Name, p.Category, it.Revenue, it.Qty,
         ROW_NUMBER() OVER (PARTITION BY it.[Month] ORDER BY it.Revenue DESC) AS rn
  FROM item_totals it
  JOIN dbo.Products p ON p.ProductId = it.ProductId
)
SELECT [Month], ProductId, Name, Category, Revenue, Qty
FROM ranked
WHERE rn <= 3
ORDER BY [Month], Revenue DESC;
```

---

Got it 👍 you want a **detailed breakdown** of how MongoDB brings SQL-like features even though it’s still NoSQL. Let’s go layer by layer.

---

# 🔍 MongoDB vs SQL – SQL-Like Features in Detail

## 1. **Query Language**

* **SQL DB** → uses **SQL syntax** (`SELECT * FROM users WHERE age > 18`).
* **MongoDB** → uses **MQL (MongoDB Query Language)**, JSON-style queries.

  * Example:

    ```js
    db.users.find({ age: { $gt: 18 } })
    ```
* Key point: Same **concept** (filtering, projection, aggregation), but **different syntax**.

---

## 2. **Schema (Strict vs Flexible)**

* **SQL DB**:

  * Tables with **strict schema**.
  * Example: A column defined as `INT NOT NULL` must always be an integer.
* **MongoDB**:

  * Documents can have **different fields** within the same collection.
  * Schema can be enforced using **Schema Validation**:

    ```js
    db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "age"],
          properties: {
            name: { bsonType: "string" },
            age: { bsonType: "int", minimum: 0 }
          }
        }
      }
    })
    ```
  * This makes MongoDB behave more like **SQL tables** if you want constraints.

---

## 3. **Joins**

* **SQL DB** → Native joins:

  ```sql
  SELECT orders.order_id, users.name 
  FROM orders
  INNER JOIN users ON orders.user_id = users.id;
  ```
* **MongoDB** → Uses `$lookup` in aggregation (introduced to mimic joins):

  ```js
  db.orders.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_info"
      }
    }
  ])
  ```
* **Difference**:

  * SQL joins are more powerful and optimized.
  * Mongo joins exist, but they’re **not as performant at scale** (often denormalization is recommended).

---

## 4. **Transactions & ACID**

* **SQL DB** → Always ACID (transactions across multiple rows/tables).
* **MongoDB**:

  * **Before v4.0** → only **single-document atomicity**.
  * **Since v4.0** → supports **multi-document transactions**:

    ```js
    const session = client.startSession();
    session.startTransaction();
    try {
      await db.collection("users").updateOne({ _id: 1 }, { $inc: { balance: -50 } }, { session });
      await db.collection("accounts").updateOne({ _id: 2 }, { $inc: { balance: 50 } }, { session });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    }
    session.endSession();
    ```
  * Now MongoDB **is ACID compliant** when needed.

---

## 5. **Indexes**

* Both SQL and MongoDB have **indexes**:

  * **SQL**: `CREATE INDEX idx_age ON users(age);`
  * **MongoDB**: `db.users.createIndex({ age: 1 })`
* Both support compound indexes, unique constraints, and partial indexes.

---

## 6. **Aggregations (SQL GROUP BY vs Mongo Pipeline)**

* **SQL**:

  ```sql
  SELECT city, COUNT(*) 
  FROM users 
  GROUP BY city;
  ```
* **MongoDB**:

  ```js
  db.users.aggregate([
    { $group: { _id: "$city", count: { $sum: 1 } } }
  ])
  ```
* Mongo’s **aggregation pipeline** is more like a **data-processing pipeline** (step-by-step), while SQL is more declarative.

---

## 7. **SQL Interface for MongoDB**

* MongoDB has tools to make it feel more SQL-like:

  * **MongoDB Atlas SQL** → lets you query MongoDB using SQL.
  * **BI Connector** → allows integration with SQL tools (Tableau, PowerBI).
  * Example:

    ```sql
    SELECT name, age FROM users WHERE age > 18;
    ```

    (runs under the hood as an MQL query).

---

# ⚖️ Summary Table

| Feature            | SQL DB (MySQL, PostgreSQL, SQL Server) | MongoDB (NoSQL)                                        |
| ------------------ | -------------------------------------- | ------------------------------------------------------ |
| **Query Language** | SQL                                    | MQL (JSON-based), optional SQL via connectors          |
| **Schema**         | Strict, enforced at DB level           | Flexible, schema optional, can enforce with validators |
| **Joins**          | Native, optimized                      | Supported via `$lookup`, less performant               |
| **Transactions**   | ACID always                            | ACID since v4.0 (multi-document)                       |
| **Indexes**        | Full indexing support                  | Full indexing support                                  |
| **Aggregation**    | GROUP BY, HAVING                       | Aggregation pipeline (more procedural)                 |
| **Scalability**    | Vertical (scale-up, sharding later)    | Horizontal (built-in sharding, replica sets)           |

---

✅ **Final Answer:**
MongoDB is **NoSQL by design**, but with features like `$lookup`, schema validation, transactions, and SQL connectors, you can make it behave very much like SQL when you need **ACID compliance and relational-like behavior**.
👉 However, it will **never fully be SQL** because its data model (documents, collections) is fundamentally different from tables and rows.

---

Would you like me to also show you **real-world use cases** where MongoDB is preferred over SQL (and vice versa), so you see why companies might stick to Mongo even though it can “act SQL”?
