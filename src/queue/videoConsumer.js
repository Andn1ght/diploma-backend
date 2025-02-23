const connectRabbitMQ = require("../config/rabbitmq");
const ProcessedVideoRepository = require("../repositories/processedVideoRepository");
const DetectionReportRepository = require("../repositories/detectionReportRepository");
const { sendWebSocketNotification } = require("../websockets/websocketService");

const processVideoResults = async () => {
  const { channel } = await connectRabbitMQ();
  const queue = "processed_video_queue";

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const { videoId, processedVideo, detectionJson } = JSON.parse(msg.content.toString());

      console.log(`📥 Received processed video for ID ${videoId}`);

      // Store results in PostgreSQL
      await ProcessedVideoRepository.storeProcessedVideo(videoId, processedVideo);
      await DetectionReportRepository.storeDetectionReport(videoId, detectionJson);

      // Notify frontend via WebSocket
      sendWebSocketNotification(videoId, "Processing Complete! Video and report are ready.");

      // Acknowledge message processing
      channel.ack(msg);
    }
  });

  console.log("📡 Listening for processed videos...");
};

module.exports = processVideoResults;