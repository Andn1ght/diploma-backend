const ProcessedVideoRepository = require("../repositories/processedVideoRepository");
const VideoRepository = require("../repositories/videoRepository")
const sendVideoForProcessing = require("../queue/videoProducer");
const multer = require("multer");

// Настройка multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "video/mp4") {
      console.warn("[UPLOAD] ❌ Неверный формат файла");
      return cb(new Error("Only MP4 format is allowed"), false);
    }
    cb(null, true);
  }
});

class VideoController {
  static upload = upload.single("video");

  // 📥 Загрузка видео
  static async uploadVideo(req, res) {
    try {
      if (!req.file) {
        console.warn("[UPLOAD] ❌ Файл не передан");
        return res.status(400).json({ error: "Нет видеофайла" });
      }

      const { originalname, buffer } = req.file;
      const userId = req.user.userId;
      const storagePath = `/videos/${originalname}`;
      const title = req.body.title || "Untitled";
      const description = req.body.description || "";

      console.log(`[UPLOAD] 📥 Загружено: ${originalname} (user: ${userId})`);

      const video = await VideoRepository.uploadVideo(userId, originalname, buffer, storagePath, title, description);

      console.log(`[UPLOAD] ✅ В БД: videoId=${video.id}`);
      await sendVideoForProcessing(video.id, buffer);
      console.log(`[QUEUE] 📤 В очередь: videoId=${video.id}`);

      res.status(201).json({ message: "Видео загружено", video });
    } catch (error) {
      console.error("[UPLOAD] ❌ Ошибка:", error.message);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  // 🎞️ Стрим обработанного видео
  static async streamProcessedVideo(req, res) {
    try {
      const { id: videoId } = req.params;
      const buffer = await ProcessedVideoRepository.getProcessedVideo(videoId);

      if (!buffer) {
        console.warn(`[STREAM] ⚠️ Видео не найдено: ${videoId}`);
        return res.status(404).json({ error: "Видео не найдено" });
      }

      console.log(`[STREAM] ✅ Стрим: ${videoId}`);

      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Length", buffer.length);

      const { Readable } = require("stream");
      Readable.from(buffer).pipe(res);
    } catch (error) {
      console.error("[STREAM] ❌ Ошибка:", error.message);
      res.status(500).json({ error: "Ошибка сервера при стриминге" });
    }
  }

  // 📥 Скачать обработанное видео
  static async downloadProcessedVideo(req, res) {
    try {
      const { id: videoId } = req.params;
      const buffer = await ProcessedVideoRepository.getProcessedVideo(videoId);

      if (!buffer) {
        console.warn(`[DOWNLOAD] ⚠️ Видео не найдено: ${videoId}`);
        return res.status(404).json({ error: "Видео не найдено" });
      }

      console.log(`[DOWNLOAD] 📥 Скачивание: ${videoId}`);

      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Disposition", `attachment; filename="processed_${videoId}.mp4"`);
      res.setHeader("Content-Length", buffer.length);

      res.send(buffer);
    } catch (error) {
      console.error("[DOWNLOAD] ❌ Ошибка:", error.message);
      res.status(500).json({ error: "Ошибка при скачивании видео" });
    }
  }
}

module.exports = VideoController;