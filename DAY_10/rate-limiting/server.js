const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
let counter = 0;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: 'Too many requests, try again later.'
});

app.use(limiter); // Apply to all routes

app.get('/', (req, res) => 
{
    res.send(counter++);
}
);

app.listen(3000, () => console.log('Server running on localhost:3000'));