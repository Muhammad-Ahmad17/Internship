# Redis for Caching Documentation

## 1. Introduction to Redis for Caching

**Redis** (Remote Dictionary Server) is an in-memory, key-value data store known for its high performance, low latency, and versatility. It is widely used as a caching layer to store frequently accessed data, reducing the load on primary databases and improving application performance. Redis’s simplicity, speed, and support for various data structures make it an ideal choice for caching in modern applications.

### Why Use Redis for Caching?
- **Low Latency**: In-memory storage provides sub-millisecond access times.
- **Flexible Data Structures**: Supports multiple data types for diverse caching needs.
- **Scalability**: Scales horizontally via sharding or Redis Cluster.
- **Persistence Options**: Optional persistence (RDB/AOF) for durability, though typically disabled for caching.

This documentation covers Redis’s basic data structures, their commands, real-world caching scenarios, cache replacement policies, and the concept of locality of caches.

## 2. Basic Data Structures in Redis and Their Commands

Redis supports several data structures, each suited for specific caching use cases. Below are the primary data structures and their commonly used commands, with examples relevant to caching.

### 2.1 Strings
- **Description**: The simplest data structure, storing key-value pairs where the value is a string (up to 512 MB). Ideal for caching simple data like JSON, numbers, or serialized objects.
- **Common Commands**:
  - `SET key value [EX seconds]` - Set a key-value pair with optional expiration.
  - `GET key` - Retrieve the value for a key.
  - `DEL key` - Delete a key.
  - `EXPIRE key seconds` - Set a time-to-live (TTL) for a key.
  - `TTL key` - Get the remaining TTL of a key.
- **Example**:
  ```redis
  SET user:123:profile '{"id": "123", "name": "Alice"}' EX 3600
  GET user:123:profile
  TTL user:123:profile
  ```

### 2.2 Hashes
- **Description**: Store key-value pairs within a single key, like a dictionary. Useful for caching structured data (e.g., user profiles, product details).
- **Common Commands**:
  - `HSET key field value` - Set a field-value pair in a hash.
  - `HGET key field` - Retrieve a field’s value.
  - `HGETALL key` - Get all fields and values in a hash.
  - `HDEL key field` - Delete a field from a hash.
- **Example**:
  ```redis
  HSET product:101 name "Laptop" price "999.99" stock 50
  HGET product:101 name
  HGETALL product:101
  ```

### 2.3 Lists
- **Description**: Ordered lists of strings, useful for caching sequences (e.g., recent items, logs). Can be used as queues for caching tasks.
- **Common Commands**:
  - `LPUSH key value` - Add a value to the head of a list.
  - `RPOP key` - Remove and return a value from the tail.
  - `LRANGE key start end` - Get a range of elements from a list.
- **Example**:
  ```redis
  LPUSH recent:searches "laptop" "phone"
  LRANGE recent:searches 0 1
  ```

### 2.4 Sets
- **Description**: Unordered collections of unique strings, ideal for caching unique items (e.g., tags, user IDs).
- **Common Commands**:
  - `SADD key member` - Add a member to a set.
  - `SMEMBERS key` - Get all members of a set.
  - `SISMEMBER key member` - Check if a member exists in a set.
- **Example**:
  ```redis
  SADD user:123:tags "tech" "gaming"
  SMEMBERS user:123:tags
  ```

### 2.5 Sorted Sets
- **Description**: Sets with scores for ordering, useful for caching ranked data (e.g., leaderboards, trending items).
- **Common Commands**:
  - `ZADD key score member` - Add a member with a score.
  - `ZRANGE key start end` - Get members in a range by score.
  - `ZSCORE key member` - Get a member’s score.
- **Example**:
  ```redis
  ZADD trending:products 100 "Laptop" 50 "Phone"
  ZRANGE trending:products 0 1
  ```

### 2.6 Other Structures
- **Bitmaps**: For compact boolean data (e.g., user activity tracking).
- **HyperLogLog**: For approximate counting (e.g., unique visitors).
- **Streams**: For event streams, though less common in caching.

These data structures enable Redis to handle diverse caching scenarios, from simple key-value pairs to complex structured data.

## 3. Cache Replacement Policies in Redis

Cache replacement policies determine how Redis manages memory when it reaches its limit (`maxmemory`). Redis supports several policies, configurable via the `maxmemory-policy` setting in the configuration file or with `CONFIG SET maxmemory-policy <policy>`.

### Supported Policies
1. **noeviction** (Default):
   - **Description**: Returns an error when memory is full; no keys are evicted.
   - **Use Case**: Critical data where no eviction is acceptable.
   - **Pros**: Ensures no data loss.
   - **Cons**: Application errors if memory is exhausted.
2. **allkeys-lru**:
   - **Description**: Evicts the least recently used (LRU) keys across all keys.
   - **Use Case**: General-purpose caching where recent data is prioritized.
   - **Pros**: Balances memory usage and data relevance.
   - **Cons**: May evict important but less frequently accessed data.
3. **allkeys-lfu**:
   - **Description**: Evicts the least frequently used (LFU) keys based on access frequency.
   - **Use Case**: Caching scenarios where frequently accessed data should persist.
   - **Pros**: Retains high-demand data.
   - **Cons**: Less effective for sporadic access patterns.
4. **volatile-lru**:
   - **Description**: Evicts LRU keys only among those with an expiration (TTL).
   - **Use Case**: Caching with TTLs where only expiring keys are managed.
   - **Pros**: Protects non-expiring keys.
   - **Cons**: Limited to keys with TTLs.
5. **volatile-lfu**:
   - **Description**: Evicts LFU keys among those with an expiration.
   - **Use Case**: Similar to volatile-lru but prioritizes frequency.
   - **Pros**: Retains frequently accessed expiring keys.
   - **Cons**: Limited to TTL keys.
6. **volatile-ttl**:
   - **Description**: Evicts keys with the shortest remaining TTL.
   - **Use Case**: Caching where soon-to-expire keys are less critical.
   - **Pros**: Efficient for time-sensitive data.
   - **Cons**: May evict useful keys with short TTLs.
7. **volatile-random**:
   - **Description**: Randomly evicts keys with an expiration.
   - **Use Case**: Simple caching with TTLs and low eviction precision.
   - **Pros**: Low overhead.
   - **Cons**: Unpredictable eviction.
8. **allkeys-random**:
   - **Description**: Randomly evicts keys across all keys.
   - **Use Case**: Rare, for simple caching with no priority.
   - **Pros**: Minimal overhead.
   - **Cons**: No control over evicted keys.

### Configuration Example
```redis
CONFIG SET maxmemory 100mb
CONFIG SET maxmemory-policy allkeys-lru
```

### Choosing a Policy
- **allkeys-lru** or **allkeys-lfu**: Best for general caching where data relevance matters.
- **volatile-lru** or **volatile-lfu**: Ideal when using TTLs extensively.
- **noeviction**: Use for critical data but requires careful memory management.
- **volatile-ttl**: Suited for time-sensitive caches where early eviction of expiring keys is acceptable.

## 4. Locality of Caches in Redis

**Locality of reference** refers to the tendency of applications to access the same or nearby data repeatedly. In caching, leveraging locality (temporal and spatial) improves performance by keeping frequently or recently accessed data in memory.

### Temporal Locality
- **Definition**: Data accessed recently is likely to be accessed again soon.
- **Redis Support**: Redis’s in-memory storage ensures low-latency access to recently used data. The `allkeys-lru` and `volatile-lru` policies exploit temporal locality by prioritizing recently accessed keys for retention.
- **Example**: Caching user sessions; recently active users’ data remains in cache.

### Spatial Locality
- **Definition**: Data accessed together is likely stored close together (e.g., fields in a hash).
- **Redis Support**: Redis’s data structures like hashes and lists support spatial locality by grouping related data under a single key. For example, a user’s profile (name, email, etc.) is stored in a hash, allowing efficient retrieval of related fields.
- **Example**: Caching product details in a hash (`product:101`) ensures all fields are accessed together efficiently.

### Redis’s Approach to Locality
- **In-Memory Storage**: All data resides in RAM, ensuring fast access regardless of locality.
- **Data Structures**: Hashes, sets, and sorted sets group related data, optimizing for spatial locality.
- **LRU/LFU Policies**: Exploit temporal locality by retaining recently or frequently accessed keys.
- **Key Naming**: Structured key names (e.g., `user:123:profile`) group related data, improving cache hit rates.

### Considerations
- **Cache Hit Rate**: High locality increases cache hits, reducing database queries.
- **Key Design**: Use structured keys to leverage spatial locality (e.g., `user:123:*` for user-related data).
- **Eviction Policies**: LRU/LFU policies align with temporal locality, but require tuning based on access patterns.

## 5. Real-World Caching Scenarios with Redis

Below are two real-world caching scenarios using Redis, with high-level descriptions, low-level details, and Node.js code examples.

### 5.1 Scenario 1: Caching API Responses for a Web Application

#### High-Level Description
A web application serves user profiles via an API. Fetching profiles from a database is slow, so Redis caches responses to reduce latency and database load.

- **Workflow**:
  1. An API request for a user profile checks Redis for a cached response (`user:123:profile`).
  2. If cached (hit), return the response immediately.
  3. If not cached (miss), query the database, cache the result with a TTL, and return it.
  4. Use `allkeys-lru` to evict less recently used profiles when memory is full.

- **Cache Example**:
  ```json
  {
    "id": "123",
    "name": "Alice",
    "email": "alice@example.com",
    "last_login": "2025-07-30T18:14:00Z"
  }
  ```

#### Low-Level Details
- **Data Structure**: Strings to store serialized JSON responses.
- **Commands**:
  - `SET` with `EX` for caching with TTL.
  - `GET` for retrieving cached data.
  - `EXISTS` to check cache hits.
- **Eviction Policy**: `allkeys-lru` to retain recently accessed profiles.
- **Locality**: Temporal locality (recently accessed profiles) and spatial locality (profile fields grouped in JSON).
- **Configuration**: Set `maxmemory 100mb` and `maxmemory-policy allkeys-lru`.

#### Code Example (Node.js with ioredis)
```javascript
const Redis = require('ioredis');
const client = new Redis({ host: 'localhost', port: 6379 });

// Simulate database query
async function getProfileFromDB(userId) {
  // Mock DB query
  return {
    id: userId,
    name: 'Alice',
    email: 'alice@example.com',
    last_login: '2025-07-30T18:14:00Z'
  };
}

// API handler: Get user profile
async function getUserProfile(userId) {
  const cacheKey = `user:${userId}:profile`;
  
  // Check cache
  const cached = await client.get(cacheKey);
  if (cached) {
    console.log('Cache hit');
    return JSON.parse(cached);
  }

  // Cache miss: Query DB and cache result
  console.log('Cache miss');
  const profile = await getProfileFromDB(userId);
  await client.set(cacheKey, JSON.stringify(profile), 'EX', 3600); // Cache for 1 hour
  return profile;
}

// Example usage
getUserProfile('123')
  .then(profile => console.log('Profile:', profile))
  .catch(err => console.error('Error:', err));
```

#### Outcome
- **Performance**: Sub-millisecond response times for cache hits.
- **Scalability**: Redis handles high request volumes, reducing database load.
- **Locality**: Temporal locality ensures recently accessed profiles stay cached.
- **Eviction**: LRU policy evicts old profiles, maintaining memory efficiency.

### 5.2 Scenario 2: Caching Trending Products for an E-commerce Platform

#### High-Level Description
An e-commerce platform displays trending products based on user views. Calculating trends from a database is resource-intensive, so Redis caches a ranked list of products using a sorted set.

- **Workflow**:
  1. Each product view increments a score in a Redis sorted set `trending:products`.
  2. The frontend retrieves the top N products from the sorted set.
  3. The sorted set is refreshed periodically (e.g., daily) with a TTL.
  4. Use `volatile-ttl` to evict products with short TTLs during memory pressure.

- **Cache Example**:
  ```redis
  ZADD trending:products 100 "Laptop" 50 "Phone" 30 "Tablet"
  ```

#### Low-Level Details
- **Data Structure**: Sorted set to store products with view counts as scores.
- **Commands**:
  - `ZADD` to increment view counts.
  - `ZRANGE` to retrieve top products.
  - `EXPIRE` to set a TTL for periodic refresh.
- **Eviction Policy**: `volatile-ttl` to evict keys with the shortest remaining TTL.
- **Locality**: Spatial locality (products grouped in a single sorted set) and temporal locality (frequently accessed trending products).
- **Configuration**: Set `maxmemory 50mb` and `maxmemory-policy volatile-ttl`.

#### Code Example (Node.js with ioredis)
```javascript
const Redis = require('ioredis');
const client = new Redis({ host: 'localhost', port: 6379 });

// Simulate product view
async function recordProductView(productId) {
  const cacheKey = 'trending:products';
  await client.zincrby(cacheKey, 1, productId); // Increment view count
  await client.expire(cacheKey, 86400); // Set TTL to 24 hours
  console.log(`Recorded view for ${productId}`);
}

// Get top trending products
async function getTrendingProducts(limit = 5) {
  const cacheKey = 'trending:products';
  const products = await client.zrange(cacheKey, 0, limit - 1, 'WITHSCORES');
  const result = [];
  for (let i = 0; i < products.length; i += 2) {
    result.push({ product: products[i], views: parseInt(products[i + 1]) });
  }
  return result;
}

// Example usage
recordProductView('Laptop')
  .then(() => getTrendingProducts())
  .then(products => console.log('Trending:', products))
  .catch(err => console.error('Error:', err));
```

#### Outcome
- **Performance**: Fast retrieval of trending products, reducing database queries.
- **Scalability**: Handles high view traffic with efficient sorted set operations.
- **Locality**: Spatial locality groups trending products; temporal locality retains frequently accessed data.
- **Eviction**: `volatile-ttl` ensures old trending data is evicted, keeping the cache fresh.

## 6. Conclusion

Redis is a powerful caching solution due to its in-memory performance, flexible data structures, and support for locality-aware caching. Its basic data structures—strings, hashes, lists, sets, and sorted sets—enable diverse caching scenarios, from simple key-value storage to ranked lists. Cache replacement policies like `allkeys-lru` and `volatile-ttl` manage memory efficiently, leveraging temporal locality to retain relevant data. The real-world scenarios—caching API responses and trending products—demonstrate Redis’s ability to reduce latency and database load. By exploiting temporal and spatial locality, Redis maximizes cache hit rates, making it ideal for high-performance, scalable applications.