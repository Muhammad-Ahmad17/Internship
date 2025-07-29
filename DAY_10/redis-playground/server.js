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
// cache replalcment policy using stack 