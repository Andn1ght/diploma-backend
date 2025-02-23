const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware");
const DashboardController = require("../controllers/dashboardController");

const router = express.Router();

// Get all uploaded videos for user
router.get("/videos", authenticateUser, DashboardController.getUserVideos);

// Get Processed Video
router.get("/videos/:id/processed", authenticateUser, DashboardController.getProcessedVideo);

// Get Detection Report
router.get("/videos/:id/report", authenticateUser, DashboardController.getDetectionReport);

// Get processing status of a specific video
router.get("/videos/:id/status", authenticateUser, DashboardController.getVideoStatus);

// Delete a video and its associated data
router.delete("/videos/:id", authenticateUser, DashboardController.deleteVideo);

module.exports = router;