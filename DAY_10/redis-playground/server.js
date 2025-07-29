const express = require ('express');
const axios = require ('axios');
const client = require("./client");
const app = express();
const PORT = 3000;

app.get ('/' , async (req,res) => {
    const cached = await client.get ('todos');
    if (cached) {
        console.log('Cache hit');
        return res.json(JSON.parse(cached));
    } else {
        console.log('Cache miss');
        const api = await axios.get('https://jsonplaceholder.typicode.com/todos')

    await client.set ('todos',JSON.stringify(api.data));
    await client.expire ('todos' , 50)

    return res.json(api.data);
    }

})

app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});


// docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest

/**
 * LRU Eviction Policy in Redis
 *
 * - LRU (Least Recently Used) eviction is built into all standard Redis versions,
 *   including Redis OSS and Redis Stack.
 * - To enable LRU eviction, you must configure Redis with:
 *     - maxmemory: sets the memory limit Redis can use.
 *     - maxmemory-policy: set to 'allkeys-lru' or 'volatile-lru' to activate LRU eviction.
 * - Without maxmemory set, Redis does not evict keys automatically, so LRU won't trigger.
 * - Redis uses an approximate LRU algorithm for performance efficiency.
 * - Most managed Redis services also support LRU eviction, but check provider specifics.
 *
 * Example Redis configuration (redis.conf or Docker command):
 *   maxmemory 100mb
 *   maxmemory-policy allkeys-lru
 *
 * Example Docker run command:
 *   docker run -d --name redis-lru -p 6379:6379 redis/redis-stack:latest \
 *     --maxmemory 100mb --maxmemory-policy allkeys-lru
 */
