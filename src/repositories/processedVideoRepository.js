const pool = require("../config/db");

class ProcessedVideoRepository {
  static async storeProcessedVideo(videoId, processedVideo) {
    const result = await pool.query(
      "INSERT INTO processed_videos (video_id, processed_video) VALUES ($1, $2) RETURNING *",
      [videoId, processedVideo]
    );
    return result.rows[0];
  }

  static async getProcessedVideo(videoId) {
    const result = await pool.query("SELECT * FROM processed_videos WHERE video_id = $1", [videoId]);
    return result.rows[0];
  }

  static async deleteProcessedVideo(videoId) {
    await pool.query("DELETE FROM processed_videos WHERE video_id = $1", [videoId]);
    return { message: "Processed video deleted" };
  }
}

module.exports = ProcessedVideoRepository;