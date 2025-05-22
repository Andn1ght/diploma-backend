const connectRabbitMQ = require("../config/rabbitmq");

// 📤 Отправка видео на обработку в очередь RabbitMQ
const sendVideoForProcessing = async (videoId, videoData) => {
  try {
    const { channel } = await connectRabbitMQ();
    const queue = "video_processing_queue";

    // Гарантируем, что очередь существует
    await channel.assertQueue(queue, { durable: true });

    // Формируем сообщение
    const message = JSON.stringify({ videoId, videoData });

    // Отправка в очередь
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log(`[QUEUE][SEND] ✅ Видео отправлено на обработку: videoId=${videoId}`);

    return { message: "Видео отправлено на обработку" };
  } catch (error) {
    console.error(`[QUEUE][SEND] ❌ Ошибка при отправке видео: ${error.message}`);
    throw error;
  }
};

module.exports = sendVideoForProcessing;