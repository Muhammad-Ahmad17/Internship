## **Key Concepts of AWS Pricing**

AWS pricing is designed to give flexibility, efficiency, and cost savings. The three key concepts are:

### 1. **Pay as You Go**
- Pay only for the resources you actually use.
- Helps adapt to changing business needs.
- Reduces the risk of overprovisioning or missing capacity.

### 2. **Save When You Commit**
- Certain services (e.g., AWS Compute services) offer **Savings Plans**.
- Commit to a 1-year or 3-year plan to get lower prices than On-Demand rates.

### 3. **Pay Less by Using More**
- Some services use **tiered pricing**: the more you use, the less you pay per unit.
- Encourages scaling efficiently.

---

## **Driving Factors of Cost**

AWS pricing varies by service category, configuration, AWS Region, and pricing model.  
The **three fundamental drivers of cost** are:

### 1. **Compute**
- Pay by **time of usage** (hour, second, etc.).
- Cost starts when a resource is launched and stops when the resource is stopped, unless a reservation is made.

### 2. **Storage**
- Broad portfolio of storage solutions with different cost structures.
- Pricing depends on **provisioned storage** or **actual usage**.
- Example: **Amazon S3** has tiered pricing and six key cost components:  
  1. Storage pricing  
  2. Request and data retrieval pricing  
  3. Data transfer and transfer acceleration pricing  
  4. Data management and analytics pricing  
  5. Replication pricing  
  6. Processing with Amazon S3 Object Lambda  

### 3. **Data Transfer**
- **Inbound transfer** and transfer **within the same AWS Region** is mostly free.  
- **Outbound transfer** is aggregated across services and charged per gigabyte.  
- Tiered pricing often applies: the more you transfer, the less you pay per GB.


## **AWS Pricing Scenario: Amazon EC2 Example**

An AWS customer provisions an **EC2 instance** for their nonprofit organization. Let’s see how the **driving factors of cost** apply:

---

### **1. Compute**
- The organization built an application to process and manage online donations.  
- **EC2 Instance Choice:** t4g.nano (selected for lowest price while meeting requirements).  
- **Compute Factors:**  
  - CPU and memory capacity  
  - Instance type (over 500 types available)  
- **Pricing Impact:** Pay for the compute resources from launch to stop, unless using a reserved instance or Savings Plan.  

---

### **2. Storage**
- The application requires storage via **Amazon Elastic Block Store (EBS)**.  
- **Storage Factors:**  
  - Amount of capacity provisioned  
  - Storage type (e.g., SSD, HDD)  
- **Pricing Impact:** Higher capacity and advanced storage options increase cost; pricing is usually per GB per month.  

---

### **3. Data Transfer**
- The application transfers data from the EC2 instance to another solution for analytics.  
- **Data Transfer Factors:**  
  - Amount of outbound data transferred  
  - Destination (same AWS Region, different Region, or internet)  
- **Pricing Impact:** Outbound transfer is charged per GB; costs vary depending on the transfer path.  
- For details, refer to [Data Transfer on Amazon EC2](https://aws.amazon.com/ec2/pricing/on-demand/) and scroll to "Data Transfer".  

---

**Summary:**  
- **Compute, storage, and data transfer** are the key cost drivers for EC2.  
- Choosing the right instance type, storage capacity, and transfer method can help **optimize costs**.



## **AWS Pricing and Billing Services**

| **Service**                          | **Key Function**                                                                 | **Use Cases**                                                                 |
|--------------------------------------|---------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| **AWS Organizations**                | Centralized management and governance of multiple AWS accounts with consolidated billing. | - Consolidate multiple accounts into one central organization.<br>- Apply org-wide security and service policies. |
| **AWS Billing & Cost Management Dashboard** | Central hub for viewing charges, usage, forecasts, invoices, and payment methods. | - Visualize and track monthly AWS spend.<br>- Manage payment methods and invoices. |
| **AWS Budgets**                      | Set custom budgets and receive alerts when costs/usage exceed thresholds.        | - Get alerts when projected costs exceed limits.<br>- Forecast expenses based on usage trends. |
| **AWS Cost Explorer**                | Interactive tool for visualizing, analyzing, and managing AWS costs/usage.       | - Analyze historical spending trends.<br>- Forecast future AWS costs.<br>- Identify cost-saving opportunities. |
| **AWS Pricing Calculator**           | Web-based planning tool to estimate costs before deployment.                     | - Estimate service costs before launching.<br>- Compare costs of different service configurations. |
