const VideoRepository = require("../repositories/videoRepository");
const ProcessedVideoRepository = require("../repositories/processedVideoRepository");
const DetectionReportRepository = require("../repositories/detectionReportRepository");

class DashboardService {
  static async getUserVideos(userId) {
    return await VideoRepository.getUserVideos(userId);
  }

  static async getVideoStatus(videoId) {
    return await VideoRepository.getVideoStatus(videoId);
  }

  static async deleteVideo(videoId) {
    await ProcessedVideoRepository.deleteProcessedVideo(videoId);
    await DetectionReportRepository.deleteDetectionReport(videoId);
    return await VideoRepository.deleteVideo(videoId);
  }
  
  static async getProcessedVideo(videoId) {
    return await ProcessedVideoRepository.getProcessedVideo(videoId);
  }

  static async getDetectionReport(videoId) {
    return await DetectionReportRepository.getDetectionReport(videoId);
  }
}

module.exports = DashboardService;