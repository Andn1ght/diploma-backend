const pool = require("../config/db");

class VideoRepository {
  static async uploadVideo(userId, filename, rawVideo, storagePath) {
    const result = await pool.query(
      "INSERT INTO uploaded_videos (user_id, original_filename, raw_video, storage_path) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, filename, rawVideo, storagePath]
    );
    return result.rows[0];
  }

  static async getAllVideos() {
    const result = await pool.query("SELECT id, original_filename, storage_path, uploaded_at FROM uploaded_videos");
    return result.rows;
  }

  static async getUserVideos(userId) {
    const result = await pool.query(
      "SELECT id, original_filename, storage_path, uploaded_at FROM uploaded_videos WHERE user_id = $1",
      [userId]
    );
    return result.rows;
  }

  static async getVideoById(videoId) {
    const result = await pool.query("SELECT * FROM uploaded_videos WHERE id = $1", [videoId]);
    return result.rows[0];
  }

  static async getVideoStatus(videoId) {
    const result = await pool.query(
      `SELECT 
        uv.id, uv.original_filename, 
        CASE 
          WHEN pv.video_id IS NOT NULL THEN 'Processed'
          ELSE 'Processing'
        END AS status
      FROM uploaded_videos uv
      LEFT JOIN processed_videos pv ON uv.id = pv.video_id
      WHERE uv.id = $1`,
      [videoId]
    );
    return result.rows[0];
  }

  static async deleteVideo(videoId) {
    await pool.query("DELETE FROM uploaded_videos WHERE id = $1", [videoId]);
    return { message: "Video deleted successfully" };
  }
}

module.exports = VideoRepository;