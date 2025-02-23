require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const processVideoResults = require("./src/queue/videoConsumer");
const { setupWebSocket } = require("./src/websockets/websocketService");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize WebSocket
setupWebSocket(server);

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  processVideoResults(); // Start listening for processed videos
});