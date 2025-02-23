const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware");
const VideoController = require("../controllers/videoController");

const router = express.Router();

// Upload Video
router.post("/upload", authenticateUser, VideoController.upload, VideoController.uploadVideo);

// Get All Videos
router.get("/", authenticateUser, VideoController.getAllVideos);

// Get Video by ID
router.get("/:id", authenticateUser, VideoController.getVideoById);

// Delete Video
router.delete("/:id", authenticateUser, VideoController.deleteVideo);

// Get Processed Video & Detection Report
router.get("/:id/processed", authenticateUser, async (req, res) => {
    const processedVideo = await ProcessedVideoRepository.getProcessedVideo(req.params.id);
    if (!processedVideo) return res.status(404).json({ error: "Processed video not found" });
  
    res.status(200).json(processedVideo);
});
  
router.get("/:id/report", authenticateUser, async (req, res) => {
    const report = await DetectionReportRepository.getDetectionReport(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
  
    res.status(200).json(report);
});

module.exports = router;