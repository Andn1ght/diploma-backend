const WebSocket = require("ws");

let clients = []; // Список подключённых клиентов

// 📡 Инициализация WebSocket сервера
const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    console.log("🟢 WebSocket: новое подключение");

    ws.on("close", () => {
      clients = clients.filter((client) => client !== ws);
      console.log("🔴 WebSocket: соединение закрыто");
    });

    ws.on("error", (err) => {
      console.error("⚠️ WebSocket: ошибка соединения:", err.message);
    });
  });

  console.log("🚀 WebSocket сервер запущен и слушает подключения");
};

// 📩 Отправка уведомления всем клиентам
const sendWebSocketNotification = (videoId, message) => {
  const payload = JSON.stringify({ videoId, message });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  console.log(`[WS] 📢 Уведомление отправлено: videoId=${videoId}, message="${message}"`);
};

module.exports = {
  setupWebSocket,
  sendWebSocketNotification,
};