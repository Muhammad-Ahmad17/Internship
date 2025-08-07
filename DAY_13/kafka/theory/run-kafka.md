

## ✅ 1. Create a Docker Volume (Optional but recommended)

```bash
docker volume create kafka_data
```

### 🔍 Explanation:

* `docker volume create kafka_data`: Creates a named Docker volume to **persist Kafka logs/data** even if the container stops or is removed.

---

## ✅ 2. Run Kafka (Bitnami Image, KRaft Mode)

```bash
docker run -d --name kafka \
  -p 9092:9092 -p 9093:9093 \
  -e KAFKA_CFG_NODE_ID=1 \
  -e KAFKA_CFG_PROCESS_ROLES=broker,controller \
  -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka:9093 \
  -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
  -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT,CONTROLLER:PLAINTEXT \
  -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  -e KAFKA_KRAFT_CLUSTER_ID=kraft-cluster-id-123 \
  -e ALLOW_PLAINTEXT_LISTENER=yes \
  -v kafka_data:/bitnami/kafka \
  bitnami/kafka:latest
```

### 🔍 Explanation:
Of course! Let’s break down your full Kafka **Docker command line by line** so you understand each part clearly.

---

### 🔧 Full Command:

```bash
docker run -d --name kafka \
  -p 9092:9092 -p 9093:9093 \
  -e KAFKA_CFG_NODE_ID=1 \
  -e KAFKA_CFG_PROCESS_ROLES=broker,controller \
  -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka:9093 \
  -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
  -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT,CONTROLLER:PLAINTEXT \
  -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  -e KAFKA_KRAFT_CLUSTER_ID=kraft-cluster-id-123 \
  -e ALLOW_PLAINTEXT_LISTENER=yes \
  -v kafka_data:/bitnami/kafka \
  bitnami/kafka:latest
```

## 🔍 Line-by-Line Explanation


### `docker run -d --name kafka \`

* `docker run`: Runs a new container.
* `-d`: Detached mode (runs in background).
* `--name kafka`: Names the container `kafka`, so you can reference it easily (e.g., in `--link`, logs, stop, etc.).

---

### `-p 9092:9092 -p 9093:9093 \`

* `-p 9092:9092`: Maps **port 9092** on your host to **Kafka's external listener port** (used by producers/consumers).
* `-p 9093:9093`: Maps **port 9093** on host to **Kafka's internal controller port** (used in KRaft mode).

---

### `-e KAFKA_CFG_NODE_ID=1 \`

* This is the **node ID** of the Kafka broker.
* Needed in **KRaft mode**, where each broker/controller must have a unique ID.

---

### `-e KAFKA_CFG_PROCESS_ROLES=broker,controller \`

* Enables **KRaft mode**.
* This node will act as both:

  * a **broker** (sends/receives messages),
  * and a **controller** (manages the cluster).
* This removes the need for Zookeeper.

---

### `-e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka:9093 \`

* Defines who participates in the **controller quorum**.
* Format: `<node_id>@<host>:<port>`
* Since this is a single-node setup, it's just itself.

---

### `-e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \`

* Defines **how the broker listens** on ports:

  * `PLAINTEXT://:9092`: For Kafka clients (producers/consumers)
  * `CONTROLLER://:9093`: For KRaft controller communication

---

### `-e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \`

* What Kafka **tells clients to connect to**.
* This is critical: producers/consumers will use this to connect.
* In local development: `localhost:9092` is perfect.

---

### `-e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT,CONTROLLER:PLAINTEXT \`

* Maps the **protocol type** used by each listener.
* We're using `PLAINTEXT` for both (no SSL or SASL auth).

---

### `-e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \`

* Specifies which listener name is used for controller communication.
* Here, `CONTROLLER` refers to port `9093` as defined above.

---

### `-e KAFKA_KRAFT_CLUSTER_ID=kraft-cluster-id-123 \`

* A **unique ID** for the Kafka KRaft cluster.
* Required to initialize the metadata log.
* You can use any unique string.

---

### `-e ALLOW_PLAINTEXT_LISTENER=yes \`

* A Bitnami-specific flag.
* Allows Kafka to accept plaintext connections (without auth).

---

### `-v kafka_data:/bitnami/kafka \`

* Mounts the volume named `kafka_data` to Kafka’s internal data directory.
* This ensures **data is persistent** across container restarts.
* If you don't mount a volume, Kafka logs and state will be lost when the container is removed.

---

### `bitnami/kafka:latest`

* The **image** you're pulling and running.
* `bitnami/kafka` is an easy-to-use image that supports **KRaft**, **Zookeeper mode**, and **environment-based config**.
* `latest` ensures you're pulling the newest version.

---

## ✅ Bonus Tips

### 🔄 View logs:

```bash
docker logs -f kafka
```

### 📦 View running container:

```bash
docker ps
```

### 🧹 Stop and remove:

```bash
docker stop kafka
docker rm kafka
```
---

## ✅ 3. Run Kafka UI

```bash
docker run -d --name kafka-ui \
  -p 8080:8080 \
  -e KAFKA_CLUSTERS_0_NAME=kraft-cluster \
  -e KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka:9092 \
  --link kafka \
  provectuslabs/kafka-ui:latest
```

### 🔍 Explanation:

| Part                                              | What it does                                                           |
| ------------------------------------------------- | ---------------------------------------------------------------------- |
| `docker run -d`                                   | Runs container in detached mode                                        |
| `--name kafka-ui`                                 | Names the container `kafka-ui`                                         |
| `-p 8080:8080`                                    | Exposes Kafka UI on `localhost:8080`                                   |
| `-e KAFKA_CLUSTERS_0_NAME=kraft-cluster`          | Sets the display name in the UI                                        |
| `-e KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka:9092` | Kafka server address (uses container name `kafka`)                     |
| `--link kafka`                                    | Links to the running Kafka container (basic way to connect containers) |
| `provectuslabs/kafka-ui:latest`                   | Kafka UI image                                                         |

---

## ✅ 4. Open Kafka UI

After running the above:

👉 Go to your browser:

```
http://localhost:8080
```

You will see the **Kafka UI dashboard**.

There you can:

* See brokers, topics
* Create/delete topics
* View live messages
* Monitor consumers

---

## 🛑 Stop & Clean Up (Optional)

```bash
docker stop kafka kafka-ui
docker rm kafka kafka-ui
docker volume rm kafka_data
```

---

## ✅ TL;DR Summary

| Component        | Port   | Role                                     |
| ---------------- | ------ | ---------------------------------------- |
| Kafka            | `9092` | Client connections (producers/consumers) |
| Kafka (internal) | `9093` | KRaft controller port                    |
| Kafka UI         | `8080` | Web interface                            |


