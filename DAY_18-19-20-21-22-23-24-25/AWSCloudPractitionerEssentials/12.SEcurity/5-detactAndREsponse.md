# Detection and Response Services

Preventing and protecting against security threats are important, but you should also be prepared to **detect and respond** to security incidents. AWS provides a variety of services to help with detection, investigation, and remediation.

---

## Amazon Inspector
- Runs **automated security assessments** for Amazon EC2 instances, containers, and Lambda functions.  
- Detects vulnerabilities and deviations from best practices (e.g., open access, outdated software).  
- Findings include a severity ranking, detailed description, and remediation recommendations.  
- Results can be accessed via **Inspector console** or **API**.  

---

## Amazon GuardDuty
- Provides **intelligent threat detection** using account metadata, VPC Flow Logs, and DNS logs.  
- Uses **malicious IP lists, anomaly detection, and machine learning** to identify threats.  
- Findings are shown in the **AWS Management Console** with remediation steps.  
- Can trigger **AWS Lambda functions** for automated responses.  

---

## Amazon Detective
- Helps **investigate the root cause** of detected threats.  
- Provides **interactive visualizations** of resources and user activities over time.  
- Unified AWS Console view with recommended investigation workflows.  

---

## AWS Security Hub
- Centralized view of your **security and compliance posture**.  
- Aggregates and normalizes findings from AWS services (like GuardDuty, Inspector) and partner tools.  
- Groups findings into **Insights** for actionable steps.  
- Supports **automated remediation** to reduce Time to Resolution (TTR).  
