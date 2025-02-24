const VideoService = require("../services/videoService");
const sendVideoForProcessing = require("../queue/videoProducer"); // ✅ Ensure this import exists
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage, 
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "video/mp4") {
      return cb(new Error("Only MP4 format is allowed"), false);
    }
    cb(null, true);
  }
});

class VideoController {
  static upload = upload.single("video");

  static async uploadVideo(req, res) {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded or invalid format" });

      const { originalname, buffer } = req.file;
      const userId = req.user.userId;
      const storagePath = `/videos/${originalname}`;

      const video = await VideoService.uploadVideo(userId, originalname, buffer, storagePath);

      // Send video to RabbitMQ for processing
      await sendVideoForProcessing(video.id, buffer);

      res.status(201).json({ message: "Video uploaded and sent for processing", video });
    } catch (error) {
      console.error("❌ Video Upload Error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async streamProcessedVideo(req, res) {
    try {
      const { videoId } = req.params;

      const videoBuffer = await ProcessedVideoRepository.getProcessedVideo(videoId);

      if (!videoBuffer) {
        return res.status(404).json({ error: "Processed video not found" });
      }

      // Set headers for video streaming
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Length", videoBuffer.length);

      // Convert buffer to readable stream and pipe it
      const readableStream = Readable.from(videoBuffer);
      readableStream.pipe(res);
    } catch (error) {
      console.error("❌ Error streaming processed video:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getAllVideos(req, res) {
    try {
      const videos = await VideoService.getAllVideos();
      res.status(200).json(videos);
    } catch (error) {
      console.error("❌ Error fetching videos:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getVideoById(req, res) {
    try {
      const video = await VideoService.getVideoById(req.params.id);
      if (!video) return res.status(404).json({ error: "Video not found" });

      res.status(200).json(video);
    } catch (error) {
      console.error("❌ Error fetching video:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteVideo(req, res) {
    try {
      await VideoService.deleteVideo(req.params.id);
      res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting video:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = VideoController;