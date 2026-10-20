const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: 'kafka-app',
    brokers: ['localhost:9092'], // Replace with your Kafka broker address
});


module.exports = { kafka };
