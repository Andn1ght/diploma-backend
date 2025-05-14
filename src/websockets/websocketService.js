const WebSocket = require("ws");

let clients = [];

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("🟢 New WebSocket connection established.");
    clients.push(ws);

    ws.on("close", () => {
      clients = clients.filter((client) => client !== ws);
      console.log("🔴 WebSocket connection closed.");
    });
  });
};

const sendWebSocketNotification = (videoId, message) => {
  const payload = JSON.stringify({ videoId, message });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  console.log(`📢 WebSocket Notification Sent: ${payload}`);
};

// ✅ Ensure proper export
module.exports = { setupWebSocket, sendWebSocketNotification };