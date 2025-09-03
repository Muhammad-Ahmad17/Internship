
---

# AWS Storage Services

AWS provides a variety of storage solutions tailored to different use cases, including block, object, and file storage, as well as additional hybrid and disaster recovery services.

---

## Block Storage

Block storage provides persistent, low-latency block-level storage volumes that attach to EC2 instances like physical hard drives. Volumes can be encrypted, backed up via snapshots, and modified while in use without disrupting the instance.

### Primary Block Storage Services

**Amazon EC2 Instance Store**

* Unmanaged, non-persistent, high-performance storage
* Directly attached to EC2 instances
* Suitable for temporary data

**Amazon Elastic Block Store (EBS)**

* Managed persistent block storage for EC2 instances
* Offers multiple volume types optimized for different workloads
* Supports encryption, snapshots, and dynamic resizing

---

## Object Storage

Object storage manages data as objects in a flat address space, providing unlimited scalability. It’s ideal for storing vast amounts of unstructured data and offers enhanced metadata for search and analytics.

### Primary Object Storage Service

**Amazon Simple Storage Service (S3)**

* Fully managed, scalable object storage
* Stores and retrieves any amount of data from anywhere
* Supports features like versioning, encryption, and lifecycle management

---

## File Storage

AWS file storage services provide shared file systems accessible over a network, allowing multiple users or applications to access the same data simultaneously.

### Primary File Storage Services

**Amazon Elastic File System (EFS)**

* Fully managed, scalable NFS file system
* Supports AWS Cloud and on-premises resources

**Amazon FSx**

* Fully managed file storage for popular file systems like Windows, Lustre, and NetApp ONTAP
* Designed for high-performance workloads and enterprise applications

---

## Additional Storage Services

**AWS Storage Gateway**

* Hybrid cloud storage service
* Provides on-premises access to virtually unlimited cloud storage

**AWS Elastic Disaster Recovery**

* Streamlines recovery of physical, virtual, and cloud servers into AWS
* Ensures minimal downtime during disaster recovery
