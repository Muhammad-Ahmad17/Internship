const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
let counter = 0;

app.set('trust proxy', true); // Add this to get correct IP behind proxy

const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: 'Too many requests, try again later.',
  // handler is a custom function 
  handler: (req, res) => {
    console.log(`Blocked IP: ${req.ip}`);
    res.status(429).send('Too many requests, try again later.');
  }
});

app.use(limiter); // Apply to all routes

app.get('/', (req, res) => {
  console.log(`Request from IP: ${req.ip}`);
  res.send(`Counter: ${counter++} | Your IP: ${req.ip}`);
});

app.listen(3000, () => console.log('Server running on localhost:3000'));


// Rate Limiting	Limit external incoming requests	Server APIs
// Throttling	Limit internal execution rate	Email dispatch