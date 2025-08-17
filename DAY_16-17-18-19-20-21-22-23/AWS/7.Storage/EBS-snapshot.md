
---

# Amazon EBS Snapshots

EBS snapshots are **point-in-time backups** of Amazon EBS volumes. They are incremental, meaning only blocks that have changed since the last snapshot are saved, making them efficient for storage and cost management.

## Key Features

### Data Protection and Recovery

* Snapshots provide backup for disaster recovery and data restoration
* Used for creating consistent backups of production workloads

### Operational Flexibility

* Snapshots can be used to create multiple new volumes
* New volumes created from a snapshot are exact copies of the original volume at the time the snapshot was taken
* Stored redundantly in multiple Availability Zones using Amazon S3

### Incremental and Cost-Effective

* Only changed blocks are saved, reducing storage costs
* Helps optimize storage usage and maintain cost efficiency

---

## Working with EBS Snapshots

### Customer Responsibilities

* Schedule and manage regular snapshots
* Monitor snapshot costs and delete unnecessary snapshots
* Ensure sensitive data is encrypted
* Verify snapshot integrity and test restoration procedures

### Use Cases

* Disaster recovery
* Data migration
* Volume resizing
* Backup of production workloads

---

# Amazon Data Lifecycle Manager (DLM)

Amazon Data Lifecycle Manager automates the creation, retention, and deletion of EBS snapshots. It is especially useful for **large-scale deployments**, ensuring consistent backup policies while reducing manual effort.

## Key Features

### Automation

* Schedule snapshots during off-peak hours to minimize performance impact
* Automatically delete outdated backups to control storage costs

### Compliance and Policy Enforcement

* Helps maintain compliance by scheduling regular backups
* Enforces retention rules across EBS volumes and instances

## Amazon Data Lifecycle Manager Workflow

1. **Create an EBS Snapshots Policy**

   * Use the EC2 console, AWS CLI, SDKs, API calls, or CloudFormation to define a snapshot policy

2. **Select Target Resource Type**

   * Choose either an EBS volume or an EC2 instance as the target for snapshots

3. **Exclude Volumes**

   * Optionally exclude root or data volumes to narrow down snapshot scope

4. **Set Custom Schedules**

   * Automate snapshot creation, retention, and deletion with custom schedules

5. **Apply Additional Actions**

   * Configure tags, snapshot archiving, EBS fast snapshot restore
   * Enable cross-Region copying or cross-account sharing

---

## Benefits

* **Data Protection and Recovery:** Ensure consistent backups and rapid restoration
* **Operational Flexibility:** Easily create new volumes from snapshots
* **Cost-Effective:** Incremental snapshots reduce storage costs and optimize resource use
