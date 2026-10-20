# 🚀 Kafka Quick Start Guide

## ✅ Already Done For You

- ✅ Docker Zookeeper container running on port `2181`
- ✅ Docker Kafka container running on port `9092`  
- ✅ Kafka topic `rider-updates` created
- ✅ Node.js dependencies installed
- ✅ `client.js` configured for `localhost:9092`

---

## Run Demo in 3 Steps

### Step 1: Open Terminal 1 - Start Consumer
```bash
cd /home/muhammad-ahmad/Internship/DAY_13/kafka/kafka-app
node consumer.js group1
```

**Expected Output:**
```
Connecting Consumer...
Consumer Created with id: kafka-app-XXXX
Subscribing to topic...
Subscribed Successfully
```

### Step 2: Open Terminal 2 - Start Producer
```bash
cd /home/muhammad-ahmad/Internship/DAY_13/kafka/kafka-app
node producer.js
```

**Expected Output:**
```
Connecting Producer...
Producer Created
```

### Step 3: Send Messages
In Terminal 2 (producer), type:
```
> tony south
> tony north
> john south
```

### Step 4: Observe in Terminal 1 (Consumer)
You'll see:
```
group1: [rider-updates]: PARTition:0: {"name":"tony","location":"south"}
group1: [rider-updates]: PARTition:1: {"name":"tony","location":"north"}
group1: [rider-updates]: PARTition:0: {"name":"john","location":"south"}
```

---

## Verify Setup

```bash
# Check Docker containers
docker ps

# Check Kafka logs
docker logs kafka | tail -20

# Check topic exists
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list
```

---

## Stop Everything

```bash
# Stop containers
docker stop kafka zookeeper

# Remove containers
docker rm kafka zookeeper

# Remove network
docker network rm kafka-network
```

---

## Key Concepts

### Producer
- Sends messages to Kafka topic
- Messages are JSON: `{"name": "...", "location": "..."}`
- Uses round-robin partitioner by default

### Consumer
- Listens to Kafka topic
- Joins consumer group (e.g., `group1`)
- Receives messages in order per partition

### Topic
- `rider-updates` - Created with 2 partitions
- Messages distributed across partitions

### Partitions
- Partition 0 & 1 - Load balancing
- Messages with same key go to same partition
- Partition index shown as `PARTition:X`

---

**For more details, see**: `kafka-app/how-to-run.md` and `kafka-app/SETUP_COMPLETE.md`
