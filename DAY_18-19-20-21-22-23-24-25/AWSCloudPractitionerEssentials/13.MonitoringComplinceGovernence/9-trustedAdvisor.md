### **Continuously Evaluating Your AWS Environment**

**Goal:** Improve **security**, **cost optimization**, **performance**, and **resilience**.

---

### **AWS IAM Access Analyzer**

* **Purpose:** Provides fine-grained analysis of IAM permissions to ensure **least privilege access**.
* **Capabilities:**

  * Set, verify, and refine permissions.
  * Analyze **external access**.
  * Validate IAM policies against **corporate security standards**.
* **Benefits:**

  * Refine permissions and remove unnecessary access.
  * Automate IAM policy reviews.
  * Achieve **least privilege goals**.
* **Use Cases:**

  * Set fine-grained permissions.
  * Verify **who can access what**.
  * Remediate **unused access**.
  * Refine and remove **broad or risky access**.

---




---

## 🛡 What is AWS Trusted Advisor?

* It’s an **online tool** that gives you **real-time guidance** to help you follow AWS **best practices**.
* Think of it like a **cloud consultant** built into AWS that checks your environment for:

  * **Cost Optimization**
  * **Performance**
  * **Security**
  * **Fault Tolerance**
  * **Service Quotas**

---

## 📊 What It Checks

1. **Cost Optimization** 💰

   * Unused/underutilized resources (e.g., idle EC2, low-utilized RDS).
   * Opportunities for Reserved Instances/Savings Plans.

2. **Performance** ⚡

   * Service limits close to being reached (e.g., EC2 instance quotas).
   * Use of optimal instance types.

3. **Security** 🔐

   * IAM best practices (e.g., MFA on root account).
   * Publicly accessible S3 buckets.
   * Security group rules (overly permissive ports).

4. **Fault Tolerance** 🔄

   * EBS snapshots for backup.
   * Multi-AZ deployments.
   * Load balancer configurations.

5. **Service Quotas** 📈

   * Warns when you’re approaching account limits (e.g., number of Elastic IPs).

---

## 🛠 Access Levels

* **Basic & Developer Support Plan** → Only a few **core checks**.
* **Business & Enterprise Support Plans** → Full set of **all checks + notifications**.

---

## 🔄 How It Fits with Other AWS Tools

* **CloudWatch** → Monitors metrics/logs in real-time.
* **CloudTrail** → Tracks API calls (who did what).
* **Trusted Advisor** → Periodic **best-practice assessment** and recommendations.

Example:

* CloudWatch shows EC2 CPU < 5% for 2 weeks.
* Trusted Advisor recommends **stop or resize** the instance to save cost.

---

✅ **In short**:
AWS Trusted Advisor = **AWS best practices coach** → Helps you optimize **cost, performance, security, and reliability**.

