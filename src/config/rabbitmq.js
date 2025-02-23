const amqp = require("amqplib");
require("dotenv").config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;

const connectRabbitMQ = async () => {
  try {
    if (!RABBITMQ_URL) throw new Error("❌ RabbitMQ URL is missing in environment variables.");

    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    console.log("✅ Connected to RabbitMQ");

    return { connection, channel };
  } catch (error) {
    console.error("❌ RabbitMQ Connection Error:", error.message);
    process.exit(1); // Exit process if RabbitMQ fails to connect
  }
};

module.exports = connectRabbitMQ;