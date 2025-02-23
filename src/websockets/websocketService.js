const WebSocket = require("ws");

let wss;

const setupWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("🔌 New WebSocket connection established");

    ws.on("message", (message) => {
      console.log(`📩 Received message from client: ${message}`);
    });

    ws.on("close", () => {
      console.log("❌ WebSocket connection closed");
    });
  });
};

const sendWebSocketNotification = (videoId, message) => {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ videoId, message }));
      }
    });
  }
};

module.exports = { setupWebSocket, sendWebSocketNotification };