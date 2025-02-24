const express = require("express");
const http = require("http");
const { setupWebSocket } = require("./src/websockets/websocketService");
const { processVideoResults } = require("./src/queue/videoConsumer"); // ✅ Correct import

const app = express();
const server = http.createServer(app);

// ✅ Ensure setupWebSocket exists before calling it
if (typeof setupWebSocket === "function") {
  setupWebSocket(server);
} else {
  console.error("❌ Error: setupWebSocket is not properly defined or exported.");
}

// ✅ Ensure processVideoResults exists before calling it
if (typeof processVideoResults === "function") {
  processVideoResults(); // Start listening for processed videos
} else {
  console.error("❌ Error: processVideoResults is not properly defined or exported.");
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});