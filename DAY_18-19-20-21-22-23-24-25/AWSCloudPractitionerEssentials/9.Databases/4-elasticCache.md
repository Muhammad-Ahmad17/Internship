
# Amazon ElastiCache

Amazon ElastiCache is a fully managed in-memory caching service that reduces the complexity of administering caching systems. It supports Redis, Valkey, and Memcached, and automatically handles node failures, making it ideal for applications requiring consistent high performance.

## Key Features

### High Performance

* Supports Redis, Valkey, and Memcached instances
* Streamlines deployment and maintenance of in-memory caching
* Automatically handles hardware provisioning, software patching, and monitoring
* Seamless scalability by adding or removing nodes as demand changes

### High Availability

* Monitors primary nodes for potential failures
* Automatic promotion of replica nodes to primary in case of issues
* Recovery process completes in minutes to minimize downtime

### Replication Across Multiple Availability Zones

* Enables automatic replication for durability and fault tolerance
* Primary and replica nodes can be configured across different AZs
* Ensures data accessibility even if one zone experiences an outage

### Security and Data Encryption

* Encryption at rest protects stored data and automated backups
* In-transit encryption using TLS secures data between clients and cache nodes

## Use Cases

* Session data management
* Database query enhancement
* Gaming leaderboards

---


| Feature             | Amazon RDS                                             | Amazon Aurora                                              | Amazon DynamoDB                                                       | Amazon ElastiCache                                                   |
| ------------------- | ------------------------------------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Database Type**   | Relational                                             | Relational (MySQL/PostgreSQL compatible)                   | NoSQL (Key-Value / Document)                                          | In-memory caching (Redis, Memcached, Valkey)                         |
| **Performance**     | Standard relational DB performance                     | Up to 5× MySQL, 3× PostgreSQL throughput                   | Single-digit millisecond response times at any scale                  | Extremely low-latency, high-throughput in-memory performance         |
| **Scalability**     | Vertical (instance size) & horizontal (read replicas)  | Auto storage scaling 10 GB → 128 TB, auto scaling          | Automatic scaling of throughput & storage                             | Add/remove nodes seamlessly; supports cluster scaling                |
| **Availability**    | Multi-AZ deployments with automatic failover           | Replicates across 3 AZs with 6 copies, 99.99% availability | 99.999% availability; replicated across multiple facilities & regions | Multi-AZ replication with automatic failover; monitors primary nodes |
| **Backups**         | Automated backups, manual snapshots                    | Continuous backups to S3, point-in-time recovery           | On-demand backups, continuous backups, point-in-time recovery         | Automatic snapshots for Redis; persistent storage optional           |
| **Fault Tolerance** | Multi-AZ replication                                   | Advanced replication across AZs, automatic failover        | Built-in replication across facilities & regions                      | Automatic node replacement and replica promotion                     |
| **Schema**          | Fixed schema                                           | Fixed schema                                               | Flexible, schema-less                                                 | Not applicable; in-memory cache                                      |
| **Use Cases**       | Web apps, enterprise workloads, e-commerce inventories | Gaming, media/content management, real-time analytics      | Gaming, financial apps, global mobile apps                            | Session caching, database query acceleration, leaderboards           |
| **Security**        | VPC isolation, encryption at rest & in transit         | Same as RDS + continuous monitoring                        | Encryption at rest & in transit, customizable key management          | Encryption at rest & in transit (TLS), secure network isolation      |
| **Cost Model**      | Pay-as-you-go                                          | Similar pay-as-you-go; high performance may cost more      | Pay-per-use based on read/write capacity & storage                    | Pay-as-you-go; cost depends on node type and number of nodes         |

This table gives a **side-by-side view of relational, NoSQL, and caching services** in AWS, helping to choose the right service based on performance, scalability, and use case needs.

