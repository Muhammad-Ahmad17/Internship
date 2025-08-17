
# Amazon Aurora

Aurora is a managed relational database designed to reduce unnecessary I/O operations. It is compatible with MySQL and PostgreSQL and provides high performance, availability, and automatic scaling.

## Key Features

### High Performance and Availability

* Up to 5× throughput of standard MySQL and 3× of PostgreSQL
* Distributed storage system across multiple nodes

### Automated Storage and Backup Management

* Storage automatically grows from 10 GB to 128 TB based on actual usage
* Continuous backups to Amazon S3 for point-in-time recovery

### Advanced Replication and Fault Tolerance

* Data replicated across 3 Availability Zones with 6 copies
* 99.99% availability
* Automatic failover to healthy replicas without data loss

## Use Cases

* Gaming applications
* Media and content management
* Real-time analytics

---


| Feature                        | Amazon RDS                                              | Amazon Aurora                                                                  |
| ------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Database Engines Supported** | MySQL, PostgreSQL, SQL Server, MariaDB, Oracle, Aurora  | MySQL-compatible, PostgreSQL-compatible                                        |
| **Performance**                | Standard relational DB performance                      | Up to 5× MySQL, 3× PostgreSQL throughput                                       |
| **Availability**               | Multi-AZ deployments with automatic failover            | Replicates across 3 AZs with 6 copies, 99.99% availability                     |
| **Scalability**                | Vertical (instance size) and horizontal (read replicas) | Automatic storage scaling 10 GB → 128 TB, auto scaling with workload           |
| **Backups**                    | Automated backups, manual DB snapshots                  | Continuous backups to S3, point-in-time recovery                               |
| **Fault Tolerance**            | Multi-AZ replication                                    | Advanced replication across multiple AZs, automatic failover without data loss |
| **Use Cases**                  | Web apps, enterprise workloads, e-commerce inventories  | Gaming, media/content management, real-time analytics                          |
| **Cost Model**                 | Pay-as-you-go, reduces operational overhead             | Similar pay-as-you-go; may cost slightly more for high performance features    |
| **Security**                   | VPC isolation, encryption at rest & in transit          | Same as RDS, plus continuous monitoring and fault-tolerant design              |

---
