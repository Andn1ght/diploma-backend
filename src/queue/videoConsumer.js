const connectRabbitMQ = require("../config/rabbitmq");
const ProcessedVideoRepository = require("../repositories/processedVideoRepository");
const DetectionReportRepository = require("../repositories/detectionReportRepository");
const { sendWebSocketNotification } = require("../websockets/websocketService");

const OUTPUT_QUEUE = "processed_video_queue";

// 🧠 Обработка сообщений из очереди RabbitMQ
const processVideoResults = async () => {
  try {
    const { channel } = await connectRabbitMQ();

    await channel.assertQueue(OUTPUT_QUEUE, { durable: true });

    console.log(`📡 [QUEUE][LISTEN] Ожидание сообщений из очереди: ${OUTPUT_QUEUE}`);

    channel.consume(
      OUTPUT_QUEUE,
      async (msg) => {
        if (!msg) return;

        try {
          const data = JSON.parse(msg.content.toString());
          const videoId = data.videoId;
          const processedVideoBuffer = Buffer.from(data.processedVideo.data); // бинарное видео
          const jsonReport = JSON.stringify(data.report); // JSON отчёт

          if (!videoId || !processedVideoBuffer || !jsonReport) {
            console.warn(`[QUEUE][RECEIVE] ⚠️ Пропущено: не хватает полей (videoId=${videoId})`);
            return channel.nack(msg, false, false); // отклонить без повторной попытки
          }

          console.log(`[QUEUE][RECEIVE] 📩 Получено сообщение: videoId=${videoId}`);

          // Сохраняем обработанное видео
          await ProcessedVideoRepository.storeProcessedVideo(videoId, processedVideoBuffer);
          console.log(`[DB] ✅ Обработанное видео сохранено: ${videoId}`);

          // Сохраняем JSON-отчёт
          await DetectionReportRepository.storeDetectionReport(videoId, jsonReport);
          console.log(`[DB] ✅ Отчёт сохранён: ${videoId}`);

          // Уведомляем фронт
          sendWebSocketNotification(videoId, "completed");

          // Подтверждаем сообщение
          channel.ack(msg);
          console.log(`[QUEUE][ACK] ✅ Сообщение подтверждено: ${videoId}`);
        } catch (error) {
          console.error("[QUEUE][ERROR] ❌ Ошибка обработки сообщения:", error.message);
          channel.nack(msg, false, false); // отклонить без повторной попытки
        }
      },
      { noAck: false } // сообщение удаляется только после ack
    );
  } catch (error) {
    console.error("[QUEUE][START] ❌ Ошибка запуска consumer:", error.message);
  }
};

module.exports = { processVideoResults };