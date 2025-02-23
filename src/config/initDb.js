const pool = require("../config/db");

// Function to create tables if they don't exist
const initializeDatabase = async () => {
  try {
    console.log("🔄 Initializing database...");

    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      -- Users Table (RBAC Enabled)
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT CHECK (role IN ('admin', 'user', 'investigator')) NOT NULL DEFAULT 'user',
          created_at TIMESTAMP DEFAULT NOW()
      );

      -- Uploaded Videos Table (Stores Raw Videos)
      CREATE TABLE IF NOT EXISTS uploaded_videos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          original_filename TEXT NOT NULL,
          raw_video BYTEA NOT NULL,
          storage_path TEXT NOT NULL, 
          uploaded_at TIMESTAMP DEFAULT NOW()
      );

      -- Video Metadata Table (Stores Video Properties)
      CREATE TABLE IF NOT EXISTS video_metadata (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          video_id UUID REFERENCES uploaded_videos(id) ON DELETE CASCADE,
          format TEXT CHECK (format IN ('mp4', 'avi', 'mkv')) NOT NULL,
          resolution TEXT NOT NULL,
          duration INTERVAL NOT NULL,
          frame_rate INT NOT NULL CHECK (frame_rate > 0)
      );

      -- Processed Videos Table (Stores Processed Videos with Labels)
      CREATE TABLE IF NOT EXISTS processed_videos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          video_id UUID REFERENCES uploaded_videos(id) ON DELETE CASCADE,
          processed_video BYTEA NOT NULL,
          processed_at TIMESTAMP DEFAULT NOW()
      );

      -- Detection Results Table (Stores JSON Reports)
      CREATE TABLE IF NOT EXISTS detection_results (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          video_id UUID REFERENCES uploaded_videos(id) ON DELETE CASCADE,
          detection_json JSONB NOT NULL,
          detection_accuracy FLOAT CHECK (detection_accuracy BETWEEN 0 AND 1),
          reviewed BOOLEAN DEFAULT FALSE,
          reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
          reviewed_at TIMESTAMP
      );

      -- Logs Table (Tracks System Events)
      CREATE TABLE IF NOT EXISTS logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE SET NULL,
          action TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Database schema initialized successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
  } finally {
    pool.end();
  }
};

// Run initialization
initializeDatabase();