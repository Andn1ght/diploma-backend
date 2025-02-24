const connectRabbitMQ = require("../config/rabbitmq");
const ProcessedVideoRepository = require("../repositories/processedVideoRepository");
const DetectionReportRepository = require("../repositories/detectionReportRepository");
const { sendWebSocketNotification } = require("../websockets/websocketService");

const OUTPUT_QUEUE = "processed_video_queue";

const processVideoResults = async () => {
  try {
    const { channel } = await connectRabbitMQ();

    await channel.assertQueue(OUTPUT_QUEUE, { durable: true });
    console.log(`📡 Listening for messages in queue: ${OUTPUT_QUEUE}`);

    channel.consume(
      OUTPUT_QUEUE,
      async (msg) => {
        if (msg !== null) {
          try {
            console.log("📩 Received processed video from ML service.");

            // Parse received message
            const data = JSON.parse(msg.content.toString());
            const videoId = data.videoId;
            const processedVideoBuffer = Buffer.from(data.processedVideo.data); // Convert to Buffer
            const jsonReport = JSON.stringify(data.report); // Convert JSON report to string

            if (!videoId || !processedVideoBuffer || !jsonReport) {
              console.error("❌ Error: Missing required fields in message.");
              channel.nack(msg, false, false); // Reject message, do not requeue
              return;
            }

            console.log(`🔄 Storing processed video and JSON report for video ID: ${videoId}`);

            // Store processed video in PostgreSQL
            await ProcessedVideoRepository.storeProcessedVideo(videoId, processedVideoBuffer);

            // Store detection JSON report in PostgreSQL
            await DetectionReportRepository.storeDetectionReport(videoId, jsonReport);

            console.log(`✅ Successfully stored processed video & report for video ID: ${videoId}`);

            // Notify frontend via WebSocket
            sendWebSocketNotification(videoId, "Processing Complete! Video and report are ready.");

            // Acknowledge message processing
            channel.ack(msg);
          } catch (error) {
            console.error("❌ Error processing message:", error);
            channel.nack(msg, false, false); // Reject message (avoid infinite loops)
          }
        }
      },
      { noAck: false } // Ensure message is only removed after successful processing
    );
  } catch (error) {
    console.error("❌ RabbitMQ Consumer Error:", error);
  }
};

// ✅ Ensure proper export
module.exports = { processVideoResults };