
# Amazon DynamoDB

Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance for both document and key-value data structures. It is ideal for applications requiring flexible schemas, high performance, and seamless scaling.

## Key Features

### Scalability

* Automatically scales throughput up or down based on actual usage
* Maintains consistent performance without manual intervention
* No practical limits on table size or the amount of data stored

### Performance

* Single-digit millisecond response times at any scale
* Automatic data distribution across multiple servers and SSDs

### High Availability and Durability

* 99.999% data availability within a single AWS Region
* Data replicated across three facilities in each region
* Multiple copies across regions for fault tolerance and durability

### Security

* Data encryption at rest and in transit
* Flexible key management options for customized security control

## Use Cases

* Gaming platforms
* Financial service applications
* Mobile applications with global user bases

## Benefits

### Scalability with Provisioned Capacity

* DynamoDB adjusts capacity automatically to maintain target utilization levels
* Supports growing applications without impacting performance

### Consistent High Performance

* Delivers predictable response times
* Maintains performance through automatic data distribution

### High Availability and Durability

* Data replication across multiple facilities ensures continuous operation
* Provides built-in fault tolerance and protection against data loss

### Data Encryption

* Automatic encryption of all data stored
* Options to choose encryption keys for customized security

---

| Feature             | Amazon RDS                                             | Amazon Aurora                                                | Amazon DynamoDB                                                            |
| ------------------- | ------------------------------------------------------ | ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| **Database Type**   | Relational                                             | Relational (MySQL/PostgreSQL compatible)                     | NoSQL (Key-Value / Document)                                               |
| **Performance**     | Standard relational DB performance                     | Up to 5× MySQL, 3× PostgreSQL throughput                     | Single-digit millisecond response times at any scale                       |
| **Scalability**     | Vertical (instance size) & horizontal (read replicas)  | Automatic storage scaling 10 GB → 128 TB, auto scaling       | Automatic scaling of throughput & storage; seamless growth                 |
| **Availability**    | Multi-AZ deployments with automatic failover           | Replicates across 3 AZs with 6 copies, 99.99% availability   | 99.999% availability; data replicated across multiple facilities & regions |
| **Backups**         | Automated backups, manual snapshots                    | Continuous backups to S3, point-in-time recovery             | On-demand backups, continuous backups, point-in-time recovery              |
| **Fault Tolerance** | Multi-AZ replication                                   | Advanced replication across multiple AZs, automatic failover | Built-in replication across multiple facilities and regions                |
| **Schema**          | Fixed schema                                           | Fixed schema                                                 | Flexible, schema-less                                                      |
| **Use Cases**       | Web apps, enterprise workloads, e-commerce inventories | Gaming, media/content management, real-time analytics        | Gaming, financial apps, global mobile apps                                 |
| **Security**        | VPC isolation, encryption at rest & in transit         | Same as RDS + continuous monitoring                          | Encryption at rest & in transit, customizable key management               |
| **Cost Model**      | Pay-as-you-go                                          | Similar pay-as-you-go; high performance may cost more        | Pay-per-use based on read/write capacity and storage                       |

This table gives a clear, side-by-side view of **relational vs NoSQL AWS databases**, helping you choose the right service for different workloads.


---
