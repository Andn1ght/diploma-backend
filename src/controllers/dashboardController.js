const DashboardService = require("../services/dashboardService");

class DashboardController {
  // 📋 Получить историю всех видео пользователя
  static async getUserVideos(req, res) {
    try {
      const videos = await DashboardService.getUserVideos(req.user.userId);
      console.log(`[DASHBOARD] ✅ Получена история видео (кол-во: ${videos.length}) для пользователя: ${req.user.userId}`);
      res.status(200).json(videos);
    } catch (error) {
      console.error("[DASHBOARD] ❌ Ошибка при получении истории видео:", error.message);
      res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
  }

  // 🎞️ Получить обработанное видео и отправить как поток
  static async getProcessedVideo(req, res) {
    try {
      const processedVideo = await DashboardService.getProcessedVideo(req.params.id);
      if (!processedVideo) {
        console.warn(`[VIDEO][STREAM] ⚠️ Обработанное видео не найдено: ${req.params.id}`);
        return res.status(404).json({ error: "Обработанное видео не найдено" });
      }

      console.log(`[VIDEO][STREAM] ✅ Стрим обработанного видео: ${req.params.id}`);

      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Length", processedVideo.length);

      const { Readable } = require("stream");
      Readable.from(processedVideo).pipe(res);
    } catch (error) {
      console.error("[VIDEO][STREAM] ❌ Ошибка при стриминге видео:", error.message);
      res.status(500).json({ error: "Ошибка сервера при передаче видео" });
    }
  }

  // 📄 Получить JSON-отчёт по видео
  static async getDetectionReport(req, res) {
    try {
      const report = await DashboardService.getDetectionReport(req.params.id);
      if (!report) {
        console.warn(`[REPORT] ⚠️ Отчёт не найден: ${req.params.id}`);
        return res.status(404).json({ error: "Отчёт не найден" });
      }

      console.log(`[REPORT] ✅ Получен отчёт по видео: ${req.params.id}`);

      res.status(200).json(report);
    } catch (error) {
      console.error("[REPORT] ❌ Ошибка при получении отчёта:", error.message);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  // 🗑️ Удалить видео и связанные данные
  static async deleteVideo(req, res) {
    try {
      await DashboardService.deleteVideo(req.params.id);
      console.log(`[VIDEO][DELETE] 🗑️ Удалено видео и отчёты: ${req.params.id}`);
      res.status(200).json({ message: "Видео и связанные данные удалены" });
    } catch (error) {
      console.error("[VIDEO][DELETE] ❌ Ошибка удаления:", error.message);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  // ⭐ Получить список избранных видео
  static async getFavorites(req, res) {
    try {
      const favorites = await DashboardService.getFavoriteVideos(req.user.userId);
      console.log(`[FAVORITE] ⭐ Получено избранных видео: ${favorites.length}`);
      res.status(200).json(favorites);
    } catch (error) {
      console.error("[FAVORITE] ❌ Ошибка при получении избранного:", error.message);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  // 🕘 Получить последние видео пользователя
  static async getRecent(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const recent = await DashboardService.getRecentVideos(req.user.userId, limit);
      console.log(`[DASHBOARD] 🕘 Получены последние ${limit} видео`);
      res.status(200).json(recent);
    } catch (error) {
      console.error("[DASHBOARD] ❌ Ошибка при получении последних видео:", error.message);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  // ⭐ Установить или снять "избранное"
  static async toggleFavorite(req, res) {
    try {
      const { value } = req.body;
      const result = await DashboardService.toggleFavorite(req.params.id, value);

      console.log(`[FAVORITE] ${value ? "✅ Добавлено" : "❌ Удалено"} из избранного: ${req.params.id}`);

      res.status(200).json(result);
    } catch (error) {
      console.error("[FAVORITE] ❌ Ошибка при установке избранного:", error.message);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
}

module.exports = DashboardController;