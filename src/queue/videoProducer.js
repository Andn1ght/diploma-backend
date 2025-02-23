const connectRabbitMQ = require("../config/rabbitmq");

const sendVideoForProcessing = async (videoId, videoData) => {
  const { channel } = await connectRabbitMQ();
  const queue = "video_processing_queue";

  await channel.assertQueue(queue, { durable: true });

  const message = JSON.stringify({ videoId, videoData });

  channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
  console.log(`📤 Sent video ${videoId} for processing`);

  return { message: "Video sent for processing" };
};

module.exports = sendVideoForProcessing;