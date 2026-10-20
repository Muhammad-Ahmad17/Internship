# ✅ Kafka Setup Complete

## Environment Details

- **Your IP Address**: `192.168.1.110`
- **Kafka Broker**: `localhost:9092` (via Docker)
- **Zookeeper**: `localhost:2181` (via Docker)
- **Network**: `kafka-network` (Docker bridge network)

---

## Containers Running

```bash
✅ Zookeeper: Up and running on port 2181
✅ Kafka Broker: Up and running on port 9092
```

## Verify with:
```bash
docker ps
```

---

## Topic Created

**Topic Name**: `rider-updates`  
**Partitions**: 2  
**Status**: ✅ Created successfully

---

## Client Configuration

Your `client.js` has been updated to use:
```javascript
brokers: ['localhost:9092']
```

This allows Node.js to connect to the Kafka broker from your host machine.

---

## How to Run

### 1. **Start Consumer (Group 1)**
```bash
cd /home/muhammad-ahmad/Internship/DAY_13/kafka/kafka-app
node consumer.js group1
```

### 2. **Start Producer (in another terminal)**
```bash
cd /home/muhammad-ahmad/Internship/DAY_13/kafka/kafka-app
node producer.js
```

### 3. **Send Messages**
In the producer terminal, type:
```
> tony south
> tony north
> john south
> john north
```

### 4. **Observe Messages in Consumer**
You should see output like:
```
group1: [rider-updates]: PARTition:0: {"name":"tony","location":"south"}
group1: [rider-updates]: PARTition:1: {"name":"tony","location":"north"}
group1: [rider-updates]: PARTition:0: {"name":"john","location":"south"}
group1: [rider-updates]: PARTition:1: {"name":"john","location":"north"}
```

---

## Test Different Patterns

### Message Queue Pattern (Same Group)
```bash
# Terminal 1: Start first consumer
node consumer.js group1

# Terminal 2: Start second consumer
node consumer.js group1

# Terminal 3: Send messages
node producer.js
```
**Result**: Messages are **distributed** between the two consumers (load balanced).

### Pub/Sub Pattern (Different Groups)
```bash
# Terminal 1: Consumer Group A
node consumer.js group1

# Terminal 2: Consumer Group B
node consumer.js group2

# Terminal 3: Send messages
node producer.js
```
**Result**: **Both groups** receive **all messages**.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` | Ensure Kafka and Zookeeper containers are running: `docker ps` |
| `Topic not found` | Run `node admin.js` to create topic first |
| `Port 9092 already in use` | Stop conflicting container: `docker stop kafka` |
| `Consumer not receiving messages` | Check if producer is connected: Ensure no errors in producer terminal |

---

## Next Steps

1. ✅ Verify Kafka and Zookeeper are running
2. ✅ Run the consumer: `node consumer.js group1`
3. ✅ Run the producer: `node producer.js`
4. ✅ Send test messages
5. ✅ Observe messages in consumer
6. ✅ Test different patterns (Message Queue vs Pub/Sub)

---

## Files Modified

- ✅ `client.js` - Updated broker address to `localhost:9092`

## Files Available

- `admin.js` - Create topics
- `client.js` - Kafka client configuration
- `consumer.js` - Consumer implementation
- `producer.js` - Producer implementation
- `package.json` - Dependencies

---

**Setup Date**: October 31, 2025  
**Status**: 🚀 Ready to use!
