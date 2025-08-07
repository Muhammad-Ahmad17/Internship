# Kafka
Video Link: [Apache Kafka Crash Course | What is Kafka?](https://youtu.be/ZJJHm_bd9Zo)
## Prerequisite
- Knowledge
  - Node.JS Intermediate level
  - Experience with designing distributed systems
- Tools
  - Node.js: [Download Node.JS](https://nodejs.org/en)
  - Docker: [Download Docker](https://www.docker.com)
  - VsCode: [Download VSCode](https://code.visualstudio.com)

## Commands
- Start Zookeper Container and expose PORT `2181`.
```bash
docker run -p 2181:2181 zookeeper
```
- Start Kafka Container, expose PORT `9092` and setup ENV variables.
```bash
docker run -p 9092:9092 \
-e KAFKA_ZOOKEEPER_CONNECT=<PRIVATE_IP>:2181 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://<PRIVATE_IP>:9092 \
-e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
confluentinc/cp-kafka
```

## Code
`client.js`
```js
const { Kafka } = require("kafkajs");

exports.kafka = new Kafka({
  clientId: "my-app",
  brokers: ["<PRIVATE_IP>:9092"],
});

module.exports = { kafka };
```
`admin.js`
```js
const { kafka } = require("./client");

async function init() {
  const admin = kafka.admin();
  console.log("Admin connecting...");
  admin.connect();
  console.log("Adming Connection Success...");

  console.log("Creating Topic [rider-updates]");
  await admin.createTopics({
    topics: [
      {
        topic: "rider-updates",
        numPartitions: 2,
      },
    ],
  });
  console.log("Topic Created Success [rider-updates]");

  console.log("Disconnecting Admin..");
  await admin.disconnect();
}

init();
```
`producer.js`
```js
const { kafka } = require("./client");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  const producer = kafka.producer();

  console.log("Connecting Producer");
  await producer.connect();
  console.log("Producer Connected Successfully");

  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", async function (line) {
    const [riderName, location] = line.split(" ");
    await producer.send({
      topic: "rider-updates",
      messages: [
        {
          partition: location.toLowerCase() === "north" ? 0 : 1,
          key: "location-update",
          value: JSON.stringify({ name: riderName, location }),
        },
      ],
    });
  }).on("close", async () => {
    await producer.disconnect();
  });
}

init();
```
`consumer.js`
```js
const { kafka } = require("./client");
const group = process.argv[2];

async function init() {
  const consumer = kafka.consumer({ groupId: group });
  await consumer.connect();

  await consumer.subscribe({ topics: ["rider-updates"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      console.log(
        `${group}: [${topic}]: PART:${partition}:`,
        message.value.toString()
      );
    },
  });
}

init();
```
## Running Locally
- Run Multiple Consumers
```bash
node consumer.js <GROUP_NAME>
```
- Create Producer
```bash
node producer.js
```
```bash
> tony south
> tony north
```

### ✅ **1. Message Queue Pattern (Workload Sharing)**

**Scenario**:
Multiple consumers with the **same `groupId`**.

```bash
node consumer.js group1   # Terminal 1
node consumer.js group1   # Terminal 2
```

**Behavior**:

* Kafka treats both consumers as part of **one consumer group**.
* **Messages from a topic partition are distributed across consumers** in the group.
* Each message is processed **only once**, by **one consumer** in the group.

**Use case**:

* Horizontal scaling (e.g., processing logs, orders, tasks, etc.)
* Workload is **shared** among consumers.

**Result**:

> ✅ Each message is processed by only one consumer in the group.

---

### 📣 **2. Publish/Subscribe Pattern (Fan-out)**

**Scenario**:
Multiple consumers with **different `groupId`s**.

```bash
node consumer.js group1   # Terminal 1
node consumer.js group2   # Terminal 2
```

**Behavior**:

* Kafka treats each `groupId` as a separate **subscriber**.
* Every consumer group gets a **copy of every message**.
* Each message is processed **once per group**.

**Use case**:

* Multiple independent consumers for **analytics**, **logging**, **auditing**, **monitoring**, etc.

**Result**:

> 📢 Every group gets a copy of every message.

---

### 🔁 Summary Table

| Pattern           | groupId       | Message Delivered To           | Use Case                     |
| ----------------- | ------------- | ------------------------------ | ---------------------------- |
| **Message Queue** | Same groupId  | One consumer in the group      | Workload distribution        |
| **Pub/Sub**       | Different IDs | Every consumer (in each group) | Independent processing needs |

