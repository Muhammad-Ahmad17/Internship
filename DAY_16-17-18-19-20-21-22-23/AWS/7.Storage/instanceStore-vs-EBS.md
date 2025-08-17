
---

# Amazon EC2 Instance Store

Amazon EC2 instance store refers to block-level storage physically attached to the host computer of an EC2 instance. It is not a stand-alone AWS service but comes included with certain EC2 instance types as default storage.

## Key Features

### Temporary Storage

* Data is lost when the EC2 instance is stopped or terminated
* Ideal for temporary storage needs like buffers, caches, and scratch data
* Not suitable for applications requiring persistent data

### Automatically Available

* Included in the EC2 instance cost; no additional storage fees
* Reduces expenses for applications that only need temporary storage

### High Performance

* Provides low-latency, high-throughput block storage
* Best suited for workloads that require fast, ephemeral storage

### Key Takeaway

* Amazon EC2 instance store offers temporary block-level storage
* Data is deleted when the instance stops or terminates
* Cost-effective solution for non-persistent storage requirements


---

# Amazon Elastic Block Store (EBS)

Amazon EBS provides **persistent block-level storage volumes** for use with Amazon EC2 instances. EBS volumes act like external hard drives, offering consistent, low-latency performance suitable for databases, file systems, and other workloads that require durable storage.

## Key Features

### Persistent Storage

* Data remains available even if the EC2 instance is stopped or terminated
* Suitable for applications that require long-term data storage

### Flexible Volume Management

* Volumes can be backed up, resized, and attached to different EC2 instances
* Incremental backups can be created using Amazon EBS snapshots

### Low-Latency Performance

* Consistent and predictable I/O performance for workloads like databases and file systems
* Supports tuning for performance optimization

### Key Takeaway

* Amazon EBS ensures **data persistence** for block-level storage
* Data on EBS volumes is retained independently of the EC2 instance lifecycle

---

## Use Cases

* Database hosting
* Backup storage for applications
* Rapid deployment of development environments using volume snapshots

---

## Benefits

### Data Portability

* EBS volumes can be detached and reattached to other EC2 instances as needed

### Practical Scenarios

* **Data migration:** Move data between instances or regions
* **Instance type changes:** Detach EBS from one instance and attach to another with a different type
* **Disaster recovery:** Use snapshots for backup and recovery
* **Cost optimization:** Pay only for the storage you provision
* **Performance tuning:** Adjust volume type or IOPS for specific workloads

