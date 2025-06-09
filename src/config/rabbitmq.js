const amqp = require("amqplib");          // Библиотека для работы с RabbitMQ
require("dotenv").config();               // Загрузка переменных окружения

const RABBITMQ_URL = process.env.RABBITMQ_URL; // URL для подключения к RabbitMQ (из .env)

// Функция подключения к RabbitMQ
const connectRabbitMQ = async () => {
  try {
    if (!RABBITMQ_URL) {
      throw new Error("❌ Отсутствует переменная RABBITMQ_URL в .env");
    }

    // Устанавливаем соединение и создаём канал
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    console.log("✅ Подключено к RabbitMQ");

    return { connection, channel };
  } catch (error) {
    console.error("❌ Ошибка подключения к RabbitMQ:", error.message);
    process.exit(1); // Завершаем приложение, если не удалось подключиться
  }
};

module.exports = connectRabbitMQ;