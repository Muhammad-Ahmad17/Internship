const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: 'kafka-app',
    brokers: ['192.168.0.122:9092'], // Replace with your Kafka broker address
});


module.exports = { kafka };
