# AWS Governance & Compliance Matrix (updated)

| Stage      | Purpose | Key AWS Services |
|------------|---------|------------------|
| **Secure 🔒** | Protect data, systems, and infrastructure from unauthorized access, disruption, or modification. | - **IAM** (Identity & Access Management)<br>- **IAM Identity Center** (SSO)<br>- **Secrets Manager** (store credentials)<br>- **AWS KMS** (encryption keys)<br>- **AWS Shield** (DDoS protection)<br>- **AWS WAF** (Web App Firewall)<br>- **AWS Certificate Manager** (TLS/SSL)<br>- **Amazon Macie** (sensitive data protection) |
| **Monitor 👁️** | Continuously observe resources, system activity, and network traffic to detect threats or anomalies. | - **Amazon CloudWatch** (metrics, logs, dashboards, alarms)<br>- **Amazon GuardDuty** (threat detection)<br>- **Amazon Detective** (threat investigation)<br>- **AWS Security Hub** (centralized security findings)<br>- **AWS Systems Manager** (ops monitoring & automation) |
| **Audit 📋** | Track and review activities for accountability and compliance evidence. | - **AWS Config** (assess & evaluate resource configurations)<br>  <div style="background:#fff; padding:8px; display:inline-block; border-radius:6px;"> <img src="../images/ConfigResources.png" alt="AWS Config - resource configuration tracking" style="max-width:100%; height:auto; display:block; background:#fff;" /> </div><br>- **AWS CloudTrail** (user & API activity tracking)<br>- **Amazon Inspector** (vulnerability scans)<br>- **AWS Config Rules** (continuous checks against desired state)<br>- **CloudTrail Insights** (detect anomalies in activity) |
| **Compliance 🏛️** | Ensure adherence to regulatory, industry, and organizational requirements. | - **AWS Audit Manager** (automated evidence collection & continuous auditing)<br>  <div style="background:#fff; padding:8px; display:inline-block; border-radius:6px;"> <img src="../images/AuditAutomation.png" alt="AWS Audit Manager - audit automation" style="max-width:100%; height:auto; display:block; background:#fff;" /> </div><br>- **AWS Artifact** (compliance reports & agreements)<br>- **AWS Artifact Reports / Agreements** (third-party reports & managed agreements)<br>- **AWS Audit Manager** integrations (streamline audits & evidence for regulators) |

---

| **Group**                  | **Service**                                | **Key Function**                                                                                  |
|-----------------------------|-------------------------------------------|--------------------------------------------------------------------------------------------------|
| **Monitoring & Observability** | Amazon CloudWatch                         | Monitors AWS resources and applications in real-time; provides system-wide visibility.           |
|                             | AWS CloudTrail                             | Records user activity and API calls for auditing, security monitoring, and operational troubleshooting. |
| **Security & Compliance**   | AWS Artifact                               | Provides on-demand access to security and compliance reports, certifications, and agreements.    |
|                             | AWS Config                                 | Assesses, audits, and evaluates the configurations of AWS resources.                             |
|                             | AWS Audit Manager                           | Continuously audits AWS usage to streamline risk and compliance assessment.                       |
|                             | AWS IAM Access Analyzer                     | Sets, verifies, and refines IAM permissions for least privilege access.                           |
| **Governance & Management** | AWS Organizations                           | Centrally manages and governs multiple AWS accounts and policies.                                 |
|                             | AWS Control Tower                           | Enforces governance rules and automates multi-account setups at scale.                            |
|                             | AWS Service Catalog                          | Creates, shares, and organizes a curated catalog of AWS resources for consistent governance.     |
|                             | AWS License Manager                          | Manages software licenses and optimizes licensing costs.                                         |
| **Optimization & Recommendations** | AWS Trusted Advisor                     | Optimizes costs, performance, security, and resilience with best practice checks.                 |
| **Health & Events**         | AWS Health                                 | Notifies about service events, planned changes, and account-specific health issues.               |
