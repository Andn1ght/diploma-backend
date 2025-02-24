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
    try {
        const processedVideo = await ProcessedVideoRepository.getProcessedVideo(req.params.id);

        if (!processedVideo) {
            return res.status(404).json({ error: "Processed video not found" });
        }

        // ✅ Stream video instead of sending JSON
        res.setHeader("Content-Type", "video/mp4");
        res.setHeader("Content-Length", processedVideo.length);

        const { Readable } = require("stream");
        const stream = Readable.from(processedVideo);
        stream.pipe(res);
    } catch (error) {
        console.error("❌ Error streaming processed video:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Get JSON Detection Report
router.get("/:id/report", authenticateUser, async (req, res) => {
    try {
        const report = await DetectionReportRepository.getDetectionReport(req.params.id);
        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.status(200).json(report);
    } catch (error) {
        console.error("❌ Error retrieving report:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;