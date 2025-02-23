const VideoRepository = require("../repositories/videoRepository");

class VideoService {
  static async uploadVideo(userId, filename, rawVideo, storagePath) {
    return await VideoRepository.uploadVideo(userId, filename, rawVideo, storagePath);
  }

  static async getAllVideos() {
    return await VideoRepository.getAllVideos();
  }

  static async getVideoById(videoId) {
    return await VideoRepository.getVideoById(videoId);
  }

  static async deleteVideo(videoId) {
    return await VideoRepository.deleteVideo(videoId);
  }
}

module.exports = VideoService;