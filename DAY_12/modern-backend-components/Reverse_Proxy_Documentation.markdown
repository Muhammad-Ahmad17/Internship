# Reverse Proxy Documentation

## 1. What is a Reverse Proxy?

A **Reverse Proxy** is a server that sits between clients (e.g., users’ web browsers) and backend servers (e.g., web or application servers). It receives client requests, forwards them to the appropriate backend server, and returns the server’s response to the client. Unlike a **forward proxy** (which acts on behalf of clients), a reverse proxy acts on behalf of servers, hiding their details and improving security, performance, and scalability.

A **reverse proxy** acts as an **intermediary between the client and the backend server** — but it **represents the server**, not the client.

---

### 🔁 Role of a Reverse Proxy

* **Client → Reverse Proxy → Backend Server**

The **client** makes a request to what it believes is the **server**, but the request first goes to the **reverse proxy**.

* The reverse proxy then **forwards** the request to the **appropriate backend server**.
* The backend server processes it and sends the response **back to the reverse proxy**, which then sends it **to the client**.

---

### 🎯 It acts as:

| Between          | Acts As                                                        |
| ---------------- | -------------------------------------------------------------- |
| Client ↔ Server  | A **gateway representing the server**                          |
| Server           | A **shield** or **middle layer** that hides internal structure |
| Multiple servers | A **load balancer**, **cacher**, or **SSL terminator**         |

---

### 🧠 Think of it like:

> The **reverse proxy** is the **receptionist** at a large company. You talk to them, not directly to the specific employee (backend server). They handle routing, load, and sometimes even speak on behalf of the backend.

---

### 🛡️ Reverse Proxy — The Server’s Frontman

A **reverse proxy** is like a **frontman (or bouncer)** for the server. It stands **in front of the real servers** and:

1. **Receives all incoming client requests**
2. **Inspects the request** (e.g., headers, IP, authentication)
3. **Decides what to do**:

   * Is this an ethical or authorized user?
   * Which backend service should handle this?
4. **Forwards the request** to the appropriate **backend server**
5. **Returns the server’s response** back to the client

---

### Key Functions of a Reverse Proxy
- **Request Routing**: Directs incoming requests to specific backend servers based on rules (e.g., URL paths).
- **Load Balancing**: Distributes requests across multiple backend servers to prevent overloading.
- **Caching**: Stores responses to serve future requests faster.
- **Security**: Hides backend server details, filters malicious requests, and supports SSL termination.
- **Compression**: Reduces response size to improve speed.

### Real-Life Analogy
Think of a reverse proxy as a **receptionist** at a large office:
- **Clients (Visitors)**: Users making requests (e.g., visiting a website).
- **Receptionist (Reverse Proxy)**: Receives requests, decides which department (backend server) to send them to, and delivers responses back.
- **Departments (Backend Servers)**: Handle the actual work (e.g., serving web pages or processing data).

The receptionist ensures visitors don’t directly access departments, balances workload, and may cache common answers (e.g., office hours) to respond faster.

# Forward Proxy vs. Reverse Proxy vs. VPN

## 🛰️ Forward Proxy

- **Acts on behalf of the client**
- Positioned **between the client and external servers**
- Handles **outgoing requests**
- **Main Purposes**:
  - **Client anonymity**
  - **Access control** (e.g., restricting sites)
  - **Caching** frequently requested content

> Example: A school proxy server blocks access to social media sites for students.

---

## 🛡️ Reverse Proxy

- **Acts on behalf of the server**
- Positioned **in front of one or more backend servers**
- Handles **incoming requests**
- **Main Purposes**:
  - **Load balancing**
  - **SSL termination**
  - **Web acceleration** (caching, compression)
  - **Security filtering**

> Example: NGINX reverse proxy forwards client requests to multiple backend servers based on load.

---

## 🌐 VPN (Virtual Private Network)

- **Encrypts all network traffic** between client and VPN server
- **System-wide security** (not app-specific)
- **Hides client's IP address**
- Useful for:
  - **Secure browsing on public Wi-Fi**
  - **Bypassing geo-restrictions**
  - **Preventing ISP tracking**

> VPN differs from proxies by securing **entire network connections**, not just HTTP/HTTPS.

---

## 🔍 Summary Table

| Feature           | Forward Proxy               | Reverse Proxy                  | VPN                                  |
|-------------------|-----------------------------|----------------------------------|---------------------------------------|
| **Acts For**       | Client                      | Server                          | Client (entire system)                |
| **Traffic Direction** | Outgoing (to external web) | Incoming (from client)          | Bi-directional (full tunnel)          |
| **Scope**          | Application-specific        | Application-specific            | System-wide                           |
| **Key Focus**      | Anonymity, control, caching | Load balancing, security        | Privacy, encryption, bypassing filters |
| **Common Tools**   | Squid, Privoxy              | NGINX, Apache, HAProxy          | OpenVPN, WireGuard, NordVPN           |

---

> ❗ Reverse proxy is **not the same as VPN** — VPN secures full connections, while reverse proxies **optimize and secure servers**.


## 2. Prerequisites for Understanding Reverse Proxy

Since you’re new to reverse proxies and suspect networking knowledge is required, let’s break down the essential prerequisites, focusing on networking concepts, in simple terms.

### 2.1 Networking Basics
Networking is how computers communicate over the internet or local networks. Key concepts relevant to reverse proxies:

- **IP Address**: A unique address for a device on a network (e.g., `192.168.1.1` or `172.16.254.1`). Think of it as a phone number for a server.
  - **Public IP**: Accessible over the internet (e.g., for your reverse proxy).
  - **Private IP**: Used within a local network (e.g., for backend servers).
- **Port**: A number that identifies a specific service on a server (e.g., `80` for HTTP, `443` for HTTPS). Think of ports as specific doors in an office building.
- **HTTP/HTTPS**: Protocols for web communication. HTTP is unencrypted; HTTPS uses SSL/TLS for security.
  - Reverse proxies often handle HTTP/HTTPS requests and may terminate SSL (decrypt HTTPS for backend servers).
- **DNS (Domain Name System)**: Translates domain names (e.g., `example.com`) to IP addresses. A reverse proxy needs a domain or IP to receive requests.
- **TCP/IP**: The protocol suite for reliable data transfer. Reverse proxies use TCP to manage connections between clients and servers.
- **Load Balancing**: Distributing network traffic across multiple servers to avoid overloading any one server.

### 2.2 Server Basics
- **Web Server**: Software that serves web content (e.g., Nginx, Apache).
- **Application Server**: Runs backend logic (e.g., a Node.js app serving API responses).
- **Reverse Proxy Server**: A dedicated server (e.g., running Nginx) that forwards requests to web or application servers.

### 2.3 Software Requirements
- **Operating System**: Linux (e.g., Ubuntu) is common for reverse proxy servers due to stability and tooling. Windows or macOS can work but are less common.
- **Reverse Proxy Software**: Nginx (lightweight, popular), Apache, or HAProxy.
- **Backend Servers**: At least one backend server (e.g., a Node.js app) to handle requests.
- **Node.js**: For backend application development (as per your preference).
- **Firewall**: Basic understanding to allow traffic on ports (e.g., `80`, `443`).

### 2.4 Networking Setup for Reverse Proxy
- **Public IP or Domain**: Clients access the reverse proxy via a public IP or domain (e.g., `example.com`).
- **Local Network**: Backend servers can use private IPs (e.g., `192.168.1.2`) within a local network or cloud VPC.
- **Port Configuration**: Ensure the reverse proxy listens on standard ports (e.g., `80` for HTTP, `443` for HTTPS) and forwards to backend ports (e.g., `3000` for a Node.js app).
- **Firewall Rules**: Allow incoming traffic to the reverse proxy (e.g., `ufw allow 80` on Linux).
- **DNS Setup**: If using a domain, configure DNS records (e.g., A record mapping `example.com` to the reverse proxy’s IP).

### 2.5 Why Networking Matters
Reverse proxies rely on networking to:
- Route requests from clients to backend servers using IPs and ports.
- Balance load across multiple servers.
- Secure communication with SSL/TLS.
- Handle network failures or timeouts gracefully.

No advanced networking knowledge is required, but understanding IPs, ports, and basic firewall settings is sufficient to get started.

## 3. How Reverse Proxy Works

A reverse proxy operates as follows:
1. **Client Request**: A user’s browser sends an HTTP/HTTPS request to the reverse proxy (e.g., `http://example.com/api`).
2. **Proxy Processing**: The reverse proxy:
   - Validates the request (e.g., checks for malicious patterns).
   - Applies rules to route the request (e.g., `/api` to a Node.js server).
   - Optionally caches responses or terminates SSL.
3. **Forward to Backend**: The proxy forwards the request to the appropriate backend server (e.g., `http://192.168.1.2:3000`).
4. **Backend Response**: The backend processes the request and sends a response to the proxy.
5. **Return to Client**: The proxy sends the response back to the client, potentially compressing or caching it.

### Basic Flow
```
[ Client (Browser) ]
         |
         v
[ Reverse Proxy (e.g., Nginx) ]
         |
         v
[ Backend Server (e.g., Node.js) ]
```

## 4. Implementing Reverse Proxy with Nginx

**Nginx** is a popular, lightweight reverse proxy server. Below, we explain how to set up a reverse proxy using Nginx, including prerequisites, configuration, and Node.js backend integration.

### 4.1 Prerequisites for Nginx Reverse Proxy
- **Server**: A Linux server (e.g., Ubuntu) with a public IP or domain.
- **Nginx Installation**:
  ```bash
  sudo apt update
  sudo apt install nginx
  ```
- **Node.js Backend**: A running Node.js application (e.g., on port `3000`).
- **Firewall**: Allow ports `80` and `443`:
  ```bash
  sudo ufw allow 80
  sudo ufw allow 443
  ```
- **DNS (Optional)**: Point a domain (e.g., `example.com`) to the server’s public IP.

### 4.2 Real-World Scenarios

Below are two real-world scenarios demonstrating reverse proxy usage with Nginx, including Node.js backend examples and low-level configuration details.

#### Scenario 1: Load Balancing for a Web Application

##### High-Level Description
An e-commerce website handles high traffic to its product API. The reverse proxy (Nginx) distributes requests across multiple Node.js backend servers to ensure scalability and prevent overload.

- **Workflow**:
  1. Clients request `http://example.com/api/products`.
  2. Nginx receives the request and load-balances it to one of three Node.js servers (e.g., `192.168.1.2:3000`, `192.168.1.3:3000`, `192.168.1.4:3000`).
  3. The selected backend returns a product list, which Nginx forwards to the client.
  4. Nginx caches responses to reduce backend load.

##### Low-Level Details
- **Nginx Configuration**:
  - Define an upstream block for backend servers.
  - Use `proxy_pass` to route requests.
  - Enable caching with `proxy_cache`.
- **Networking**:
  - Nginx listens on port `80` (public IP).
  - Backend servers use private IPs and port `3000`.
- **Cache Setup**: Store responses in `/var/cache/nginx` with a 1-hour TTL.
- **Load Balancing**: Use Nginx’s default round-robin algorithm.

##### Nginx Configuration (/etc/nginx/sites-available/ecommerce)
```nginx
http {
  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;

  upstream backend_servers {
    server 192.168.1.2:3000;
    server 192.168.1.3:3000;
    server 192.168.1.4:3000;
  }

  server {
    listen 80;
    server_name example.com;

    location /api/products {
      proxy_cache my_cache;
      proxy_cache_valid 200 60m;
      proxy_pass http://backend_servers;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }
}
```

##### Node.js Backend (backend.js)
```javascript
const express = require('express');
const app = express();

app.get('/api/products', (req, res) => {
  // Simulate fetching products from a database
  const products = [
    { id: 'P101', name: 'Laptop', price: 999.99 },
    { id: 'P102', name: 'Phone', price: 499.99 }
  ];
  res.json(products);
});

app.listen(3000, () => console.log('Backend running on port 3000'));
```

##### Setup Steps
1. Install Node.js and Express:
   ```bash
   npm install express
   ```
2. Run Node.js backends on three servers (e.g., `192.168.1.2`, `192.168.1.3`, `192.168.1.4`).
3. Configure Nginx as shown above, then restart:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```
4. Test: Access `http://example.com/api/products` to verify load balancing and caching.

##### Outcome
- **Scalability**: Traffic is distributed across three backends, preventing overload.
- **Performance**: Cached responses reduce backend queries.
- **Networking**: Nginx uses public IP/port `80`; backends use private IPs/port `3000`.
- **Security**: Backend servers are hidden from clients.

#### Scenario 2: SSL Termination and Path-Based Routing for Microservices

##### High-Level Description
A microservices-based application has separate services for user management (`/users`) and product catalog (`/products`). Nginx handles HTTPS requests, terminates SSL, and routes requests to the appropriate Node.js service based on the URL path.

- **Workflow**:
  1. Clients request `https://example.com/users` or `https://example.com/products`.
  2. Nginx terminates SSL and routes requests to `192.168.1.5:3001` (users) or `192.168.1.6:3002` (products).
  3. The backend service responds, and Nginx returns the response securely to the client.

##### Low-Level Details
- **Nginx Configuration**:
  - Use `listen 443 ssl` for HTTPS.
  - Configure SSL certificates.
  - Use `location` blocks for path-based routing.
- **Networking**:
  - Nginx listens on port `443` (public IP).
  - Backend services use private IPs and ports `3001`, `3002`.
- **SSL Setup**: Use Let’s Encrypt or a self-signed certificate for HTTPS.

##### Nginx Configuration (/etc/nginx/sites-available/microservices)
```nginx
server {
  listen 443 ssl;
  server_name example.com;

  ssl_certificate /etc/nginx/ssl/cert.pem;
  ssl_certificate_key /etc/nginx/ssl/key.pem;

  location /users {
    proxy_pass http://192.168.1.5:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location /products {
    proxy_pass http://192.168.1.6:3002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

##### Node.js Backend (users.js)
```javascript
const express = require('express');
const app = express();

app.get('/users', (req, res) => {
  // Simulate fetching users from a database
  const users = [
    { id: 'U123', name: 'Alice' },
    { id: 'U124', name: 'Bob' }
  ];
  res.json(users);
});

app.listen(3001, () => console.log('Users service running on port 3001'));
```

##### Node.js Backend (products.js)
```javascript
const express = require('express');
const app = express();

app.get('/products', (req, res) => {
  // Simulate fetching products
  const products = [
    { id: 'P101', name: 'Laptop', price: 999.99 }
  ];
  res.json(products);
});

app.listen(3002, () => console.log('Products service running on port 3002'));
```

##### Setup Steps
1. Install Node.js and Express on backend servers:
   ```bash
   npm install express
   ```
2. Set up SSL certificates (e.g., using Let’s Encrypt):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d example.com
   ```
3. Configure Nginx as shown, then restart:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```
4. Test: Access `https://example.com/users` and `https://example.com/products`.

##### Outcome
- **Security**: HTTPS ensures encrypted communication; backend servers are hidden.
- **Flexibility**: Path-based routing supports multiple microservices.
- **Networking**: Nginx handles public HTTPS traffic; backends use private IPs.
- **Scalability**: Add more backend instances for each service as needed.

## 5. Benefits of Using a Reverse Proxy
- **Performance**: Caching and compression reduce latency and backend load.
- **Scalability**: Load balancing distributes traffic across servers.
- **Security**: Hides backend servers, terminates SSL, and filters malicious requests.
- **Flexibility**: Supports routing to multiple services based on paths or domains.
- **Maintainability**: Centralizes request handling, simplifying backend management.

## 6. Common Reverse Proxy Tools
- **Nginx**: Lightweight, high-performance, easy to configure (used in examples).
- **Apache HTTP Server**: Flexible but heavier than Nginx.
- **HAProxy**: Specialized for load balancing and high availability.
- **Traefik**: Cloud-native, supports automatic service discovery.
- **AWS ELB/ALB**: Managed reverse proxy for cloud environments.

## 7. Conclusion

A reverse proxy is a powerful tool for improving the performance, security, and scalability of web applications by acting as an intermediary between clients and backend servers. Understanding basic networking concepts like IP addresses, ports, and HTTP/HTTPS is essential to set up a reverse proxy effectively. Using **Nginx**, the scenarios of load balancing and SSL termination demonstrate practical applications, with Node.js backends illustrating integration. By leveraging reverse proxies, applications can handle high traffic, secure communications, and support complex architectures like microservices, making them a cornerstone of modern web infrastructure.