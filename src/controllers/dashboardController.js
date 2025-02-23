const DashboardService = require("../services/dashboardService");

class DashboardController {
  static async getUserVideos(req, res) {
    try {
      const videos = await DashboardService.getUserVideos(req.user.userId);
      res.status(200).json(videos);
    } catch (error) {
      console.error("❌ Error fetching user videos:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getVideoStatus(req, res) {
    try {
      const status = await DashboardService.getVideoStatus(req.params.id);
      if (!status) return res.status(404).json({ error: "Video not found" });

      res.status(200).json(status);
    } catch (error) {
      console.error("❌ Error fetching video status:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteVideo(req, res) {
    try {
      await DashboardService.deleteVideo(req.params.id);
      res.status(200).json({ message: "Video and associated data deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting video:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getProcessedVideo(req, res) {
    try {
      const processedVideo = await DashboardService.getProcessedVideo(req.params.id);
      if (!processedVideo) return res.status(404).json({ error: "Processed video not found" });

      res.status(200).json(processedVideo);
    } catch (error) {
      console.error("❌ Error fetching processed video:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getDetectionReport(req, res) {
    try {
      const report = await DashboardService.getDetectionReport(req.params.id);
      if (!report) return res.status(404).json({ error: "Report not found" });

      res.status(200).json(report);
    } catch (error) {
      console.error("❌ Error fetching detection report:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = DashboardController;