const pool = require("../config/db");

class DetectionReportRepository {
  static async storeDetectionReport(videoId, detectionJson) {
    const result = await pool.query(
      "INSERT INTO detection_results (video_id, detection_json) VALUES ($1, $2) RETURNING *",
      [videoId, detectionJson]
    );
    return result.rows[0];
  }

  static async getDetectionReport(videoId) {
    const result = await pool.query("SELECT * FROM detection_results WHERE video_id = $1", [videoId]);
    return result.rows[0];
  }

  static async deleteDetectionReport(videoId) {
    await pool.query("DELETE FROM detection_results WHERE video_id = $1", [videoId]);
    return { message: "Detection report deleted" };
  }
}

module.exports = DetectionReportRepository;