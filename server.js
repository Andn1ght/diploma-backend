const express = require("express");
const http = require("http");
const app = require("./src/app"); // ✅ Import app.js
const { setupWebSocket } = require("./src/websockets/websocketService");
const { processVideoResults } = require("./src/queue/videoConsumer"); 

const server = http.createServer(app); // ✅ Attach app to HTTP server

// ✅ Ensure WebSocket setup
if (typeof setupWebSocket === "function") {
  setupWebSocket(server);
} else {
  console.error("❌ Error: setupWebSocket is not properly defined or exported.");
}

// ✅ Ensure RabbitMQ Consumer is started
if (typeof processVideoResults === "function") {
  processVideoResults();
} else {
  console.error("❌ Error: processVideoResults is not properly defined or exported.");
}

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});