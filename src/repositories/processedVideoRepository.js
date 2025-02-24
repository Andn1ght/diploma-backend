const pool = require("../config/db");

class ProcessedVideoRepository {
  static async storeProcessedVideo(videoId, processedVideo) {
    const result = await pool.query(
      "INSERT INTO processed_videos (video_id, processed_video, processed_at) VALUES ($1, $2, NOW()) RETURNING *",
      [videoId, processedVideo]
    );
    return result.rows[0];
  }

  static async getProcessedVideo(videoId) {
    const result = await pool.query("SELECT processed_video FROM processed_videos WHERE video_id = $1", [videoId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].processed_video; // Return only binary data
  }

  static async deleteProcessedVideo(videoId) {
    await pool.query("DELETE FROM processed_videos WHERE video_id = $1", [videoId]);
    return { message: "Processed video deleted" };
  }
}

module.exports = ProcessedVideoRepository;