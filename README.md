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
* Applied to routes for abuse prevention
* Prevented brute-force attacks and server overload
* Thoroughly tested using Postman by sending rapid repeated requests

#### **Throttling Email Service to Prevent Spam**

* Implemented **throttling logic** for bulk email sending
* Used p-throttle to control email send rate (1/sec)
* Protected against SMTP rate limits and domain blacklisting
* Improved bulk email reliability and compliance
* Explained throttling vs rate limiting

#### **Redis Caching for Mock API Responses**

* Installed and ran **Redis using Docker** for local caching
* Implemented Redis client in Node.js using `redis` package
* Cached responses from a public mock API using Redis `SET`
* Compared performance of:

  * Direct API fetch (on **cache miss**)
  * Cached response fetch (on **cache hit**)
* Demonstrated use of **temporal locality** to optimize repeated API access
* Compared Two Cache Eviction Strategies:

  **TTL-based eviction**  Removes keys after a fixed duration using Redis `EXPIRE` command.

  **LRU (Least Recently Used)**  Automatically evicts least-accessed keys when memory is full.
  Requires setting `maxmemory` and `maxmemory-policy` in Redis configuration.


### **Day 11: Unit testing**

* Built a modular authentication system in `DAY_11/Authentication/`
  * Organized code into `controllers/`, `models/`, `routes/`, `middlewares/`, `validators/`, and `config/`
  * Implemented JWT authentication, input validation, and user controller logic
  * Added unit tests in `tests/`

### **Day 12: Modern Backend Components**

* Explored backend architecture concepts in `DAY_12/modern-backend-components/`
  * Wrote documentation for:
    * Forward and Reverse Proxy scenarios
    * Load Balancer and Reverse Proxy
    * Message Broker and Message Queuing
    * Rate Limiting
    * Redis Caching
  * Practiced writing technical documentation in Markdown

### **Day 13: Kafka Messaging**

* Built Kafka producer/consumer in `DAY_13/kafka/kafka-app/`
  * Implemented producer, consumer, admin, and client modules
  * Documented Kafka theory in `theory/Kafka_Ecommerce_Documentation.markdown`
  * Added instructions for running Kafka locally in `run-kafka.md`

### **Day 14–17: Linux & DevOps**

* Practiced Linux commands and backend engineering in `DAY_14-15-16-17/Linux/`
  * Explored concepts:
    * Familiarized with Linux environment and explored devops introduction
    * basic commands and shortcuts for terminal
    * Ubuntu for Backend/DevOps


### **Day 18–25: AWS Cloud Practitioner Preparation**

* Studied AWS services in `DAY_18-19-20-21-22-23-24-25/AWSCloudPractitionerEssentials/`
  * Organized notes by service: IAM, EC2, ELB, SQS, Lambda, ECS/EKS/ECR, Storage, CloudFormation, Databases, Networking, Security, Monitoring, Pricing, Architecture, Migration, AI/ML

### **Day 24–26: NoSQL Databases**

* Practiced DynamoDB in `DAY_24-25-26/dynamodb-node/`
  * Wrote use cases and how-to guides
* Explored MongoDB in `DAY_24-25-26/mongo-db/`
  * Notes on basic, intermediate, advanced, and expert topics
  * Aggregation and key concepts

### **Day 27–31: AWS Cloud Projects**

* Completed hands-on AWS projects in `DAY_27-28-29-30-31/aws-cloud-projects/`
  * Project 1: Create a web server on EC2
  * Project 2: Load Balanced Architecture
  * Project 3: Broken Web App Challenge
  * Project 4: Security Group & NACL Challenge
  * Project 5: Serverless Cross-Region DR

### **Day 35: CI/CD**

* Set up CI/CD pipelines (folder: `DAY_35/ci-cd/`)
  * Practiced GitHub Actions for automated build, test, and deployment
  * Explored integration with AWS Elastic Beanstalk

---

> **Tip:** For details on each topic, refer to the respective day’s folder and Markdown documentation.

---
##  Tech Stack

#### **Languages**

* JavaScript 

#### **Backend Framework**

* Node.js
* Express.js

#### **Databases**

* MongoDB (Mongoose ODM)
* Redis (Caching)
* DynamoDB (AWS NoSQL)

#### **Messaging & Queues**

* Kafka (Producer/Consumer Architecture)
* SQS (AWS Simple Queue Service)

#### **Authentication & Validation**

* JWT (JSON Web Tokens)
* Bcrypt (Password Hashing)
* Joi (Input Validation)

#### **Email & Scheduling**

* Nodemailer (Transactional Emails)
* node-cron (Automated Jobs)
* p-throttle (Email Throttling)

#### **Real-time Communication**

* Socket.IO (Chat & Live Systems)

#### **File System & Logging**

* Node.js `fs` module (File Operations)
* Winston / Custom Logger (Server Logs)

#### **Containerization & DevOps**

* Docker (Custom Images, Multi-Container Setup)
* Docker Compose (Service Orchestration)
* GitHub Actions (CI/CD Pipelines)

#### **Caching & Performance**

* Redis (Cache Optimization, TTL/LRU Strategies)
* express-rate-limit (API Rate Limiting)

#### **Cloud & Infrastructure**

* AWS (EC2, S3, IAM, ECS, ECR, Lambda, CloudFormation, CloudWatch, RDS, Route53)
* Load Balancing, Auto Scaling, and Serverless Architectures

#### **Proxies & Architecture**

* Nginx (Reverse Proxy / Load Balancer)
* Message Brokers (Kafka, SQS)
* Microservices & Event-driven Architecture
---

## Author
**Muhammad Ahmad**  
🎓 BS Computer Engineering  
📍 COMSATS University Islamabad  
💼 **Backend Intern at Innovative Saudia (On-site)**
