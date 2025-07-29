# Internship at Innovative Saudia

This repository contains my daily learning logs, code implementations, and backend projects completed during my internship at **Innovative Saudia**.

---

## Overview

* **Role**: Backend Internee
* **Duration**: Started July 2025
* **Location**: On-site
* **Focus Areas**: JavaScript, Node.js, MongoDB, API development, Docker, cron jobs, and real-time backend systems

---

## Progress Log

### **Day 1–2**

* Revised core JavaScript concepts *(excluding OOP)*:

  * Variables, functions, arrays, methods
  * ES6 features (`let`, `const`, arrow functions, destructuring)
  * Basic debugging and syntax refresh
  * Async JavaScript & Event Loop 

### **Day 3**

* **JWT-based Authentication System**:

  * Setup Node.js server with Express
  * User authentication using **JWT**
  * Password hashing with `bcrypt`
  * MongoDB connection via **Mongoose**
  * Schema design with built-in validation
  * Input validation using **Joi**
* **Explored `fs` Module**:

  * Read/write operations
  * File handling for simple logging and data manipulation

### **Day 4**

* **Automated Email Notification System**

  * Implemented scheduled emails using **cron jobs**
  * Integrated **Nodemailer** for email sending
  * Configured `.env` variables for secure credentials

* **Third-Party API Usage**
  * Fetched IP address and location data using a public API
  * Practiced API integration and error handling in real-time apps

* **MongoDB Transactions**
  * Learned to implement multi-document transactions in MongoDB
  * Used session.startTransaction() and session.commitTransaction()
  * Handled rollback using abortTransaction() for failed operations
  * Applied use-case example: deduct balance and insert order atomically
  * Understood replica set requirement for transactions

### **Day 5–6**
  ### Docker


* **Installed and configured Docker**
* **Built a custom Docker image** for the Node.js app and **pushed to Docker Hub**
* Learned about **Dockerfile** structure and best practices
* **Ran MongoDB container locally with authentication**
* **Connected local Node.js app to Docker-hosted MongoDB**
* Practiced essential **Docker CLI** commands
* Pulled public images:
  * `mongo` (MongoDB)
  * `mongo-express` (MongoDB GUI)
* **Created a single Docker container setup using `docker-compose.yml`**:
  * Includes **3 images**:
    ✔️ Node.js App (custom-built)
    ✔️ MongoDB
    ✔️ Mongo Express
* Exposed necessary ports for local access to services
* Used a **custom Docker network** for communication between services
* Added named volume `mongo_data` to persist MongoDB data at /data/db
* Verified data storage via Docker volume mount and explored Mongo's data files


### **Day 7**

#### **Real-Time Chat App with Socket.IO**

* Built a basic real-time chat system using **Socket.IO**
* Used backend event listeners:

  * `io.on('connection', ...)` to handle new user connections
  * `socket.on('message', ...)` to receive chat messages from clients
* Understood transport protocols (WebSocket vs HTTP long polling)

#### **WhatsApp Chatbot using whatsapp-web.js**

* Implemented a basic **WhatsApp bot** using `whatsapp-web.js`
* Initialized client with `LocalAuth` and Puppeteer for session persistence
* Generated QR code for authentication directly in the terminal
* Listened for incoming messages using `client.on('message', ...)`
* Replied with preset responses based on message content
* Scheduled automatic replies using `node-cron`


### **Day 8-9**

### **Socket.IO – Full-Stack Room-Based Chat Flow (No DB)**

* Built a complete real-time chat system using React  + Socket.IO (client) , Node.js + Socket.IO (server)
* Enabled dynamic room participation via `join-room`, `send-message`, and `leave-room` events
* Managed in-memory user session data (`username`, `room`) without using a persistent database
* Controlled room access using `socket.join(room)` and `socket.leave(room)`
* Broadcasted structured `"receive-message"` events to synchronize room state across clients
* Ensured that only room members receive relevant join/leave/message updates
* On leave, reset client-side state to clear messages and return to Join UI
* Focused on modular, event-driven flow across full-stack without server-side storage or auth

### **Day 10**



#### **API Rate Limiting with express-rate-limit**

* Integrated **`express-rate-limit`** middleware to protect public APIs
* Logged blocked requests for analysis and server health monitoring
* Applied globally and to specific routes for abuse prevention
* Prevented brute-force attacks and server overload
* Thoroughly tested using Postman by sending rapid repeated requests

#### **Throttling Email Service to Prevent Spam**

* Implemented **throttling logic** for bulk email sending
* Controlled mail dispatch rate using delay/timer/queue
* Ensured sending pattern stays within SMTP provider limits
* Avoided domain blacklisting and improved email deliverability
* Explained difference between **rate limiting** and **throttling**


#### **Redis Caching for Mock API Responses**

* Installed and ran **Redis using Docker** for local caching
* Cached responses from a public mock API using Redis `SET` with TTL
* Compared performance of:

  * Direct API fetch
  * Cached response fetch
* Demonstrated use of **temporal locality** to optimize API performance

.

---
##  Tech Stack

####  Languages
- JavaScript

####  Backend
- Node.js
- Express.js

####  Database
- MongoDB (Mongoose ODM)

####  Tools & Libraries
- **Authentication & Validation**: JWT, Bcrypt, Joi  
- **Email**: Nodemailer  
- **Real-time Communication**: Socket.IO  
- **Task Scheduling**: node-cron
- **Containerization**: Docker  
- **File System**: Node.js `fs` module


---

## Author
**Muhammad Ahmad**  
🎓 BS Computer Engineering  
📍 COMSATS University Islamabad  
💼 **Backend Intern at Innovative Saudia (On-site)**
