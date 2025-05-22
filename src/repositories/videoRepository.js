const pool = require("../config/db");

class VideoRepository {
  // ⬆️ Загрузка нового видео
  static async uploadVideo(userId, filename, rawVideo, storagePath, title = "Untitled", description = "") {
    const result = await pool.query(
      `INSERT INTO uploaded_videos (
        user_id, original_filename, raw_video, storage_path, title, description
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [userId, filename, rawVideo, storagePath, title, description]
    );
    return result.rows[0];
  }

  // 📥 Получить все видео пользователя (фильтруем удалённые, добавляем статус)
  static async getUserVideos(userId) {
    const result = await pool.query(
      `SELECT 
         uv.id, 
         uv.title, 
         uv.original_filename, 
         uv.uploaded_at, 
         uv.is_favorite,
         CASE 
           WHEN pv.video_id IS NOT NULL THEN 'Processed'
           ELSE 'Processing'
         END AS status
       FROM uploaded_videos uv
       LEFT JOIN processed_videos pv ON uv.id = pv.video_id
       WHERE uv.user_id = $1 AND uv.is_deleted = FALSE
       ORDER BY uv.uploaded_at DESC`,
      [userId]
    );
    return result.rows;
  }

  // 🔍 Получить одно видео по ID
  static async getVideoById(videoId) {
    const result = await pool.query("SELECT * FROM uploaded_videos WHERE id = $1", [videoId]);
    return result.rows[0];
  }

  // 🗑️ Мягкое удаление видео
  static async deleteVideo(videoId) {
    await pool.query("UPDATE uploaded_videos SET is_deleted = TRUE WHERE id = $1", [videoId]);
    return { message: "Video marked as deleted" };
  }

  // ⭐ Получение избранных видео
  static async getFavorites(userId) {
    const result = await pool.query(
      `SELECT 
         id, 
         title, 
         uploaded_at 
       FROM uploaded_videos
       WHERE user_id = $1 AND is_favorite = TRUE AND is_deleted = FALSE
       ORDER BY uploaded_at DESC`,
      [userId]
    );
    return result.rows;
  }

  // 🕘 Последние N видео
  static async getRecentUserVideos(userId, limit = 5) {
    const result = await pool.query(
      `SELECT 
         id, 
         title, 
         uploaded_at 
       FROM uploaded_videos
       WHERE user_id = $1 AND is_deleted = FALSE
       ORDER BY uploaded_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }

  // ⭐ Установка/снятие "избранного"
  static async toggleFavorite(videoId, value) {
    await pool.query("UPDATE uploaded_videos SET is_favorite = $1 WHERE id = $2", [value, videoId]);
    return { message: value ? "Marked as favorite" : "Unmarked as favorite" };
  }
}

module.exports = VideoRepository;
