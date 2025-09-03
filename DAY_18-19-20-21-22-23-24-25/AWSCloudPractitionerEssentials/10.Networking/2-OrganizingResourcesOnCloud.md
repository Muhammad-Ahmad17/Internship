
---

# Organizing Resources in the AWS Cloud

Imagine the millions of customers who use AWS services, and the millions of resources they create, such as Amazon EC2 instances. Without boundaries, network traffic can flow between these resources unrestricted.

In this section, you will learn about two key components of the AWS Cloud:

* **Amazon Virtual Private Cloud (VPC)**
* **Gateways to connect your resources**

---

## Establishing Boundaries Around AWS Resources

When organizing resources in the AWS Cloud, you need to group certain functions together and either isolate them from the public or make them publicly accessible.

Amazon VPC allows you to provision an **isolated section of the AWS Cloud**. Within this isolated section, you can launch resources in a virtual network that you define.

**Benefits of Amazon VPC:**

* **Security:** Secure and monitor connections, screen traffic, restrict instance access.
* **Control:** Full control over resource placement, connectivity, and security.
* **Convenience:** Less time spent setting up and managing compared to on-premises networks.

<div style="background-color:white; padding:10px; display:inline-block;">
  <img src="../images/VPN benefits.png" alt="VPC Benefits Diagram" style="width:100%; height:auto;"/>
</div>

---

## Subnets

Within an Amazon VPC, you can organize resources into **subnets**. A subnet is a section of a VPC that contains resources such as EC2 instances.

---

## Connecting Your Resources with an Internet Gateway

To allow **public traffic** from the internet to access your VPC, attach an **Internet Gateway (IGW)** to the VPC.

Think of an Internet Gateway as a **doorway** that customers use to enter a coffee shop. Without it, no one can access resources inside your VPC.

<div style="background-color:white; padding:10px; display:inline-block;">
  <img src="../images/ClientInternetGateway.png" alt="Internet Gateway Diagram" style="width:100%; height:auto;"/>
  Client Internet Gateway
</div>

---

## Virtual Private Gateways

What if your VPC contains only **private resources**?

A **Virtual Private Gateway (VGW)** allows you to connect your VPC to a private network, like an on-premises data center, via a **VPN connection**.

* A VPN encrypts internet traffic, creating a secure tunnel.
* The Virtual Private Gateway allows only **approved network traffic** to enter the VPC.

Think of the VPN as a secure, hidden tunnel on the public road (internet) connecting your private network to the VPC.

<div style="background-color:white; padding:10px; display:inline-block;">
  <img src="../images/ClientInternetGateway.png" alt="Virtual Private Gateway Diagram" style="width:100%; height:auto;"/>
  Virtual Private Gateway
</div>

---

## Quick Reference: Core Networking Components

| Component                         | Description                                                 |
| --------------------------------- | ----------------------------------------------------------- |
| **Amazon VPC**                    | Establishes boundaries around AWS resources.                |
| **Virtual Private Gateway**       | Allows protected traffic to enter the VPC.                  |
| **Virtual Private Network (VPN)** | Encrypts internet traffic, protecting it from interception. |

---



