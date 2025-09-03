Amazon EC2
One way to optimize cost with Amazon EC2 instances is to rightsize your resources. This means that you analyze and adjust your resources to meet the needs of your workload. Services such as AWS Compute Optimizer can help rightsize your compute resources.

Also, using Spot Instances can help optimize for cost. Spot Instances work well for workloads that are tolerant to interruptions. Spot Instances use spare Amazon EC2 capacity for a significant discount compared to On-Demand instances.





Auto scaling
Another way to help optimize cost with compute resources is auto scaling. When demand drops, AWS Auto Scaling will automatically remove any excess resource capacity, so you avoid overspending. Application load balancing also helps distribute traffic across EC2 instances.


Amazon RDS
Rightsizing is an important piece of cost optimization in your Amazon Relational Database Service (Amazon RDS) instances. Amazon RDS can scale storage using storage autoscaling which prevents over- or underprovisioning.

Read replicas scale capacity horizontally, meaning your resources won't need to a scale up into a larger instance. Instead of scaling the primary instance, read replicas are used to store data and can be used for heavy read workloads which in turn reduces the strain on the primary instance. Similarly, using something like Amazon Elasticache for caching can also reduce the load on your primary instance and optimize for cost.


Amazon S3
Using the right storage class is key to optimizing cost in the cloud.

For example, you might use S3 Glacier Deep Archive as a low-cost storage tier ideal for data that is accessed once or twice a year. For data with unknown or changing access patterns, S3 Intelligent-Tiering is a great choice.

You can also use VPC endpoints to help optimize for cost as well, as using VPC endpoints for Amazon S3 access can help reduce data transfer costs.