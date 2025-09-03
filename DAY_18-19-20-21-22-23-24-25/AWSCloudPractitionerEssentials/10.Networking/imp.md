
---

# 🔑 AWS Networking Components (Scope & Purpose)

| Component              | Scope / Level             | Purpose                                                                              |
| ---------------------- | ------------------------- | ------------------------------------------------------------------------------------ |
| **Security Groups**    | Instance level            | Controls inbound/outbound traffic for EC2 instances (stateful firewall).             |
| **Network ACLs**       | Subnet level              | Controls inbound/outbound traffic at subnet level (stateless firewall).              |
| **Route Tables**       | VPC level                 | Defines routing rules for traffic inside/outside the VPC.                            |
| **Internet Gateway**   | VPC → Internet            | Enables public connectivity between VPC and the internet.                            |
| **NAT Gateway**        | Private subnet → Internet | Allows outbound-only internet access for private subnets.                            |
| **VPC Peering**        | VPC ↔ VPC                 | Connects two VPCs (same or cross-region) privately.                                  |
| **Transit Gateway**    | Multi-VPC / Multi-Region  | Central hub for scalable inter-VPC and hybrid networking.                            |
| **Direct Connect**     | On-premises ↔ AWS         | Dedicated private line with high bandwidth & low latency.                            |
| **CloudFront**         | Global edge locations     | Content delivery network (CDN) for low-latency global delivery.                      |
| **Global Accelerator** | Global level              | Routes traffic to optimal AWS endpoints using static IPs for performance & failover. |
| **Route 53**           | Global level              | DNS and domain-level traffic management across regions.                              |



---

## 🛠️ Core AWS Networking Components

### 🔹 **Amazon VPC**

* Logically isolated network in AWS.
* You define IP ranges, subnets, routing, and security.
* Think: Your **private cloud data center** in AWS.

---

### 🔹 **Subnet**

* A subdivision inside a VPC.
* Can be **public** (internet-facing) or **private** (internal only).
* Organizes resources (like EC2, RDS).

---

### 🌐 Internet Connectivity

#### **Internet Gateway (IGW)**

* Lets VPC talk to the **public internet**.
* Needed for EC2s with public IPs in a public subnet.

#### **NAT Gateway**

* Lets **private subnet resources** reach the internet **outbound only** (e.g., for updates).
* Blocks **inbound internet traffic**.

**Compare:**

* IGW = full 2-way internet access (public subnets).
* NAT GW = outbound-only internet access (private subnets).

---

### 🔒 Hybrid / Private Connectivity

#### **Virtual Private Gateway (VGW)**

* Entry point for **VPN or Direct Connect** into your VPC.
* Private traffic from **approved networks** only.

#### **AWS Site-to-Site VPN**

* Encrypted tunnel between your **on-premises** and AWS.
* Uses **public internet** as the transport.

#### **AWS Direct Connect**

* **Dedicated private line** between data center and AWS.
* Faster, more secure, less latency than VPN.

#### **AWS Client VPN**

* Remote workers connect securely to AWS.
* Fully managed, elastic VPN for end-users.

**Compare:**

* Client VPN = individual remote workers 👩‍💻
* Site-to-Site VPN = office/data center ↔ AWS over internet 🌍
* Direct Connect = dedicated private connection 🛣️
* VGW = gateway on AWS side for VPN/Direct Connect 🔑

---

### 🔗 Private Service Access

#### **AWS PrivateLink**

* Access AWS services **privately** (via VPC endpoints) without going over the internet.
* Appears as if the service is **inside your VPC**.

#### **Amazon Transit Gateway**

* A **hub** to connect multiple VPCs and on-prem networks.
* Simplifies large-scale network architectures.

**Compare:**

* PrivateLink = connect **to services privately**.
* Transit Gateway = connect **networks together**.

---

### 🔐 Security at Network Layers

#### **Security Groups**

* Instance-level firewall (EC2, RDS, etc.).
* **Stateful**: remembers traffic (return traffic is allowed).

#### **Network ACL (NACL)**

* Subnet-level firewall.
* **Stateless**: rules must be defined both ways (inbound & outbound).

**Compare:**

* SG = instance-level, stateful.
* NACL = subnet-level, stateless.

---

### 🌍 Global Traffic & Content Delivery

#### **DNS (Domain Name System)**

* Converts domain names → IP addresses.

#### **Amazon Route 53**

* AWS-managed DNS + advanced routing (latency, geolocation, failover).
* Can also register domains.

#### **Amazon CloudFront**

* CDN: caches & delivers content via **edge locations** worldwide.
* Improves latency and performance.

#### **AWS Global Accelerator**

* Routes traffic through **AWS global backbone network**.
* Improves app **availability and performance** for global users.

**Compare:**

* Route 53 = DNS, traffic routing by rules.
* CloudFront = CDN, speeds content delivery.
* Global Accelerator = network-level routing optimization for **any app**.

---

### 🛠️ App-Level Networking

#### **Amazon API Gateway**

* Manages APIs (creation, scaling, monitoring, security).
* Handles large-scale API traffic.

---

✅ That way:

* You see each service individually.
* Where services overlap, I’ve made a **compare note**.

---
