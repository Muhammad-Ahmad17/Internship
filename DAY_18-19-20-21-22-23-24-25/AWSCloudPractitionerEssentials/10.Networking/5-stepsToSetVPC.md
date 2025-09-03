

# Building an Amazon VPC in the AWS Cloud

This is a high-level overview of creating a **Virtual Private Cloud (VPC)** using the **AWS Management Console**, including its **core components**.

---

## 1. Create the Amazon VPC

Before creating resources in AWS, the first step is to **create your VPC**.

* Define your **Region** (best location for your resources).
* A VPC is isolated within a Region.

<div style="background-color:white; padding:10px; display:inline-block;">
  <img src="../images/VPC Demo-1.png" alt="Amazon VPC Creation Diagram" style="width:100%; height:auto;"/>
</div>  

 **Diagram Explanation**:

* **AWS Cloud** → Outer rectangle.
* **Region** → Inside AWS Cloud.
* **VPC** → Inside the Region.

---

## 2. Create the Subnets

* Best practice: Use **multiple Availability Zones (AZs)** for **high availability**.
* Create **two public** and **two private subnets** across two AZs.
* Public subnets → host internet-facing resources (e.g., web servers).
* Private subnets → host internal resources (e.g., databases).

<div style="background-color:white; padding:10px; display:inline-block;">
  <img src="../images/VPC Demo-2.png" alt="VPC Subnets Diagram" style="width:100%; height:auto;"/>
</div>  

 **Diagram Explanation**:

* Region with **two Availability Zones**.
* Each AZ contains **one public** and **one private subnet**.
* Resources (instances, DBs) placed inside these subnets.

---

## 3. Create an Internet Gateway & Route Tables

Without an **Internet Gateway (IGW)**, your VPC can’t connect to the internet.

Steps:

1. Create an **Internet Gateway**.
2. Attach the IGW to your VPC.
3. Create **Route Tables** to define traffic flow:

   * Public subnets → route internet traffic to IGW.
   * Private subnets → route only internal traffic (can use NAT Gateway later if outbound internet needed).

<div style="background-color:white; padding:10px; display:inline-block;">
  <img src="../images/VPC Demo-3.png" alt="VPC Internet Gateway Diagram" style="width:100%; height:auto;"/>
</div>  

 **Diagram Explanation**:

* A user on the internet connects to the VPC via an **Internet Gateway**.
* Public subnets accept traffic, private subnets stay isolated.
* Two AZs ensure redundancy and high availability.

---

## 4. Add Security Layers

At this stage, add **Security Groups** and **Network ACLs** to filter traffic:

* **Security Groups** → Instance-level firewalls.
* **NACLs** → Subnet-level firewalls.

---

## 5. Launch Resources

Finally, deploy AWS resources inside your VPC:

* **EC2 instances** in public subnets for web servers.
* **Databases** in private subnets for security.

---

 With this setup, you now have a **highly available, secure VPC** with **public + private subnets, internet connectivity, and routing in place**.

