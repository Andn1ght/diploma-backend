const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware");
const DashboardController = require("../controllers/dashboardController");

const router = express.Router();

// 📋 Получить историю всех загруженных видео пользователя
router.get("/videos", authenticateUser, DashboardController.getUserVideos);

// 🎞️ Получить обработанное видео (stream)
router.get("/videos/:id/processed", authenticateUser, DashboardController.getProcessedVideo);

// 📄 Получить JSON-отчёт о детекции
router.get("/videos/:id/report", authenticateUser, DashboardController.getDetectionReport);

// 🗑️ Удалить видео (мягкое удаление)
router.delete("/videos/:id", authenticateUser, DashboardController.deleteVideo);

// ⭐ Получить избранные видео
router.get("/videos/favorites", authenticateUser, DashboardController.getFavorites);

// 🕘 Получить последние N видео (по умолчанию limit=5)
router.get("/videos/recent", authenticateUser, DashboardController.getRecent);

// ⭐ Пометить или снять видео как избранное
router.post("/videos/:id/favorite", authenticateUser, DashboardController.toggleFavorite);

module.exports = router;