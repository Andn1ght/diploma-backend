const express = require("express");
const http = require("http");
const app = require("./src/app");

const { setupWebSocket } = require("./src/websockets/websocketService");
const { processVideoResults } = require("./src/queue/videoConsumer");

// Создаём HTTP-сервер
const server = http.createServer(app);

// 🔌 WebSocket сервер
if (typeof setupWebSocket === "function") {
  setupWebSocket(server);
} else {
  console.error("❌ [SERVER] setupWebSocket не определён или не экспортирован.");
}

// 🐇 RabbitMQ consumer (принимаем обработанные видео)
if (typeof processVideoResults === "function") {
  processVideoResults();
} else {
  console.error("❌ [SERVER] processVideoResults не определён или не экспортирован.");
}

// 🚀 Запуск сервера
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});