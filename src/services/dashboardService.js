const VideoRepository = require("../repositories/videoRepository");
const ProcessedVideoRepository = require("../repositories/processedVideoRepository");
const DetectionReportRepository = require("../repositories/detectionReportRepository");

class DashboardService {
  // 📋 Получить все видео пользователя
  static async getUserVideos(userId) {
    const videos = await VideoRepository.getUserVideos(userId);
    console.log(`[SERVICE][DASHBOARD] 📋 История видео пользователя ${userId} — ${videos.length} шт.`);
    return videos;
  }

  // 🎞️ Получить обработанное видео
  static async getProcessedVideo(videoId) {
    const video = await ProcessedVideoRepository.getProcessedVideo(videoId);
    console.log(`[SERVICE][VIDEO] 🎞️ Получено обработанное видео: ${videoId}`);
    return video;
  }

  // 📄 Получить JSON-отчёт
  static async getDetectionReport(videoId) {
    const report = await DetectionReportRepository.getDetectionReport(videoId);
    console.log(`[SERVICE][REPORT] 📄 Получен отчёт для видео: ${videoId}`);
    return report;
  }

  // 🗑️ Удаление видео и связанных данных
  static async deleteVideo(videoId) {
    await ProcessedVideoRepository.deleteProcessedVideo(videoId);
    await DetectionReportRepository.deleteDetectionReport(videoId);
    await VideoRepository.deleteVideo(videoId);
    console.log(`[SERVICE][DELETE] 🗑️ Удалено видео и связанные данные: ${videoId}`);
    return { message: "Видео и связанные данные удалены" };
  }

  // ⭐ Получить избранные видео пользователя
  static async getFavoriteVideos(userId) {
    const favorites = await VideoRepository.getFavorites(userId);
    console.log(`[SERVICE][FAVORITE] ⭐ Получено избранных видео: ${favorites.length} для пользователя ${userId}`);
    return favorites;
  }

  // 🕘 Последние N видео пользователя
  static async getRecentVideos(userId, limit = 5) {
    const recent = await VideoRepository.getRecentUserVideos(userId, limit);
    console.log(`[SERVICE][RECENT] 🕘 Последние ${limit} видео пользователя ${userId}`);
    return recent;
  }

  // ⭐ Установить/удалить "избранное"
  static async toggleFavorite(videoId, value) {
    const result = await VideoRepository.toggleFavorite(videoId, value);
    console.log(`[SERVICE][FAVORITE] ${value ? "✅ Добавлено" : "❌ Удалено"} из избранного: ${videoId}`);
    return result;
  }
}

module.exports = DashboardService;