# AWS Security & Access Management Services

| Service | Purpose | Key Features |
|---------|---------|--------------|
| **AWS Identity and Access Management (IAM)** | Securely manage identities and access to AWS services and resources | Fine-grained permissions, roles, policies |
| **AWS IAM Identity Center** | Centralized workforce identity management with single sign-on | Connect external identity providers, federated access |
| **AWS Secrets Manager** | Centrally store and manage credentials, API keys, and other secrets | Secret rotation, encrypted storage, programmatic retrieval |
| **AWS Systems Manager** | Manage nodes and resources at scale across AWS and multi-cloud | Patch management, automation, centralized view |
| **AWS Shield** | Protect against Distributed Denial of Service (DDoS) attacks | Always-on detection, automatic mitigation |
| **AWS WAF (Web Application Firewall)** | Protect apps from blocked IPs and web exploits | Web ACLs, custom rules, OWASP Top 10 protection |
| **AWS Key Management Service (KMS)** | Create and manage cryptographic keys | Encrypt/decrypt data, integrated with AWS services |
| **Amazon Macie** | Discover and protect sensitive data in Amazon S3 | Uses ML for PII detection, automated alerts |
| **AWS Certificate Manager (ACM)** | Create and manage SSL/TLS certificates | Secure data in transit, auto-renewal of certs |
| **Amazon Inspector** | Automated security assessments for apps | Checks for vulnerabilities, compliance best practices |
| **Amazon GuardDuty** | Intelligent threat detection | Anomaly detection, machine learning, threat intel feeds |
| **Amazon Detective** | Investigate root cause of threats | Interactive visualizations, unified investigation console |
| **AWS Security Hub** | Aggregate and organize security findings | Central dashboard, actionable insights, integrations |



---

# 🔐 AWS Security & Access Management Services (Grouped)

| Category                             | Service                                      | Purpose                                                             | Key Features                                               |
| ------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Access & Identity Management**     | **AWS Identity and Access Management (IAM)** | Securely manage identities and access to AWS services and resources | Fine-grained permissions, roles, policies                  |
|                                      | **AWS IAM Identity Center**                  | Centralized workforce identity management with single sign-on       | Connect external identity providers, federated access      |
|                                      | **AWS Secrets Manager**                      | Centrally store and manage credentials, API keys, and other secrets | Secret rotation, encrypted storage, programmatic retrieval |
|                                      | **AWS Systems Manager**                      | Manage nodes and resources at scale across AWS and multi-cloud      | Patch management, automation, centralized view             |
| **Network & Application Protection** | **AWS Shield**                               | Protect against Distributed Denial of Service (DDoS) attacks        | Always-on detection, automatic mitigation                  |
|                                      | **AWS WAF (Web Application Firewall)**       | Protect apps from blocked IPs and web exploits                      | Web ACLs, custom rules, OWASP Top 10 protection            |
|                                      | **AWS Certificate Manager (ACM)**            | Create and manage SSL/TLS certificates                              | Secure data in transit, auto-renewal of certs              |
| **Data Protection & Privacy**        | **AWS Key Management Service (KMS)**         | Create and manage cryptographic keys                                | Encrypt/decrypt data, integrated with AWS services         |
|                                      | **Amazon Macie**                             | Discover and protect sensitive data in Amazon S3                    | Uses ML for PII detection, automated alerts                |
| **Threat Detection & Response**      | **Amazon Inspector**                         | Automated security assessments for apps                             | Checks for vulnerabilities, compliance best practices      |
|                                      | **Amazon GuardDuty**                         | Intelligent threat detection                                        | Anomaly detection, machine learning, threat intel feeds    |
|                                      | **Amazon Detective**                         | Investigate root cause of threats                                   | Interactive visualizations, unified investigation console  |
|                                      | **AWS Security Hub**                         | Aggregate and organize security findings                            | Central dashboard, actionable insights, integrations       |

---

⚡ Now it’s **organized by category**, so you can quickly recall:

* **Access Management** → IAM, Identity Center, Secrets Manager, Systems Manager
* **Network/App Protection** → Shield, WAF, ACM
* **Data Protection** → KMS, Macie
* **Detection & Response** → Inspector, GuardDuty, Detective, Security Hub


| Service / Feature                    | Purpose                                                                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **AWS Certificate Manager (ACM)**    | Provisions and manages **SSL/TLS certificates** for encrypting data in transit (e.g., HTTPS for websites, ELB, CloudFront). |
| **AWS KMS (Key Management Service)** | Manages encryption keys. Works with services (like S3, EBS, RDS) to enable TLS + secure key exchange for transit.           |
| **TLS/SSL (built-in in services)**   | Almost all AWS services (S3, DynamoDB, RDS, etc.) support **TLS (HTTPS)** for encrypting data in transit automatically.     |
| **AWS VPN (IPSec VPN)**              | Encrypts data in transit between on-premises and AWS over public internet.                                                  |
| **AWS Direct Connect + MACsec**      | Encrypts data in transit over dedicated network links using MACsec (for sensitive workloads).                               |
| **AWS PrivateLink**                  | Keeps data traffic **inside the AWS network**, avoiding the public internet (reduces risk, though still uses TLS).          |
