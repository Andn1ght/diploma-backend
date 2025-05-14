const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware");
const VideoController = require("../controllers/videoController");
const ProcessedVideoRepository = require("../repositories/processedVideoRepository"); // ✅ Import Repository
const DetectionReportRepository = require("../repositories/detectionReportRepository"); // ✅ Import Repository

const router = express.Router();

// ✅ Upload Video
router.post("/upload", authenticateUser, VideoController.upload, VideoController.uploadVideo);

// ✅ Get All Videos
router.get("/", authenticateUser, VideoController.getAllVideos);

// ✅ Get Video by ID
router.get("/:id", authenticateUser, VideoController.getVideoById);

// ✅ Delete Video
router.delete("/:id", authenticateUser, VideoController.deleteVideo);

// ✅ Stream Processed Video (Fix Streaming)
router.get("/:id/processed", authenticateUser, async (req, res) => {
  const videoId = req.params.id;
  console.log(`📥 GET request for processed video [videoId=${videoId}]`);

  try {
    const processedVideo = await ProcessedVideoRepository.getProcessedVideo(videoId);

    if (!processedVideo) {
      console.warn(`⚠️ Processed video not found [videoId=${videoId}]`);
      return res.status(404).json({ error: "Processed video not found" });
    }

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Length", processedVideo.length);

    const { Readable } = require("stream");
    const stream = Readable.from(processedVideo);
    stream.pipe(res);

    console.log(`✅ Streamed processed video to client [videoId=${videoId}]`);
  } catch (error) {
    console.error(`❌ Error streaming processed video [videoId=${videoId}]:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get JSON Detection Report
router.get("/:id/report", authenticateUser, async (req, res) => {
  const videoId = req.params.id;
  console.log(`📥 GET request for detection report [videoId=${videoId}]`);

  try {
    const report = await DetectionReportRepository.getDetectionReport(videoId);

    if (!report) {
      console.warn(`⚠️ Detection report not found [videoId=${videoId}]`);
      return res.status(404).json({ error: "Report not found" });
    }

    res.status(200).json(report);
    console.log(`✅ Sent detection report to client [videoId=${videoId}]`);
  } catch (error) {
    console.error(`❌ Error retrieving detection report [videoId=${videoId}]:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;