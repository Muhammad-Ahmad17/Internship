# 🚀 AWS Cloud Practitioner – Migration

## 🔹 Three Phases of Migration

1. **Assess** – Evaluate current infrastructure, workloads, and plan migration.
2. **Mobilize** – Prepare resources, build strategy, and test migration plans.
3. **Migrate & Modernize** – Execute migration, optimize workloads for cloud.

---

## 🔹 AWS Cloud Adoption Framework (CAF)

Six perspectives to guide cloud adoption:

* **Business** → Align cloud strategy with business goals.
* **People** → Train and prepare teams.
* **Governance** → Policies, compliance, and risk management.
* **Platform** → Design the target AWS architecture.
* **Security** → Ensure secure migration and operations.
* **Operations** → Optimize day-to-day operations.

---

## 🔹 Seven Migration Strategies (7 Rs)

| **Strategy**   | **Description**                               | **When to Use**                           |
| -------------- | --------------------------------------------- | ----------------------------------------- |
| **Relocate**   | Move workloads as-is to AWS-managed platforms | Shift VMs to VMware Cloud on AWS          |
| **Rehost**     | Lift-and-shift apps with minimal/no changes   | Quick migration, minimal refactoring      |
| **Replatform** | Minor optimizations while migrating           | Use AWS-managed services (e.g., RDS)      |
| **Refactor**   | Rebuild into cloud-native apps                | For scalability, agility, modernization   |
| **Repurchase** | Replace with SaaS                             | Move to SaaS solutions (e.g., Salesforce) |
| **Retain**     | Keep some workloads on-premises               | Hybrid needs, legacy apps                 |
| **Retire**     | Decommission unused apps                      | Eliminate redundant/obsolete workloads    |

---

## 🔹 Key AWS Migration Services

| **Service**                      | **Purpose**                              | **When to Use**                          |
| -------------------------------- | ---------------------------------------- | ---------------------------------------- |
| **Migration Evaluator**          | Assess infra & build business case       | Estimate migration costs                 |
| **Application Discovery**        | Inventory on-prem servers & DBs          | Plan migration with data insights        |
| **Application Migration Svc**    | Automate app migration with low downtime | Move workloads with minimal changes      |
| **Migration Hub**                | Centralized tracking & monitoring        | Manage multiple migrations               |
| **Database Migration Svc (DMS)** | Migrate databases securely & quickly     | Move DBs to RDS/Aurora                   |
| **Schema Conversion Tool (SCT)** | Convert DB schemas across engines        | SQL Server → Aurora, Oracle → PostgreSQL |
| **DataSync**                     | Accelerate data transfers to AWS         | Move large datasets to S3/EFS            |
| **Transfer Family**              | Managed file transfers (FTP/SFTP)        | Secure file migration to AWS storage     |
| **Direct Connect**               | Private network link to AWS              | High-speed, low-latency migrations       |
| **Snowball Edge**                | Offline physical migration device        | PB-scale data transfer without internet  |

---

✅ This is the **full Migration module**, stripped of Well-Architected (Module 13).

