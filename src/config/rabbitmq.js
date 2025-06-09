 const amqp = require("amqplib");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const RABBITMQ_URL = process.env.RABBITMQ_URL;

const connectRabbitMQ = async (retries = 5) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!RABBITMQ_URL) {
        throw new Error("❌ RabbitMQ URL is missing in .env");
      }

      const connection = await amqp.connect(RABBITMQ_URL, {
        frameMax: 8192,
      });

      const channel = await connection.createChannel();
      console.log("✅ Connected to RabbitMQ");
      return { connection, channel };
    } catch (error) {
      console.error(`❌ RabbitMQ connection failed (attempt ${attempt}): ${error.message}`);
      if (attempt < retries) {
        console.log("⏳ Retrying in 2 seconds...");
        await new Promise((res) => setTimeout(res, 2000));
      } else {
        console.error("❌ All RabbitMQ connection attempts failed. Exiting.");
        process.exit(1);
      }
    }
  }
};

module.exports = connectRabbitMQ;