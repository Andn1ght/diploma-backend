const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware");
const VideoController = require("../controllers/videoController");

const router = express.Router();

// ✅ Загрузка видео (Поменять на Фронтэнде /videos/upload на /upload в VideoService.ts)
router.post("/upload", authenticateUser, VideoController.upload, VideoController.uploadVideo);

// ✅ Стрим обработанного видео
router.get("/:id/processed", authenticateUser, VideoController.streamProcessedVideo);

// ✅ Скачать обработанное видео
router.get("/:id/processed/download", authenticateUser, VideoController.downloadProcessedVideo);

module.exports = router;