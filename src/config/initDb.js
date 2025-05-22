const pool = require("../config/db"); // Подключение к PostgreSQL через пул

// Функция инициализации структуры базы данных
const initializeDatabase = async () => {
  try {
    console.log("🔄 Инициализация структуры базы данных...");

    await pool.query(`
      -- Включаем расширение для генерации UUID
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      -- Таблица пользователей с поддержкой ролей (RBAC)
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT CHECK (role IN ('admin', 'user', 'investigator')) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Таблица загруженных видео (сырые видеофайлы)
      CREATE TABLE IF NOT EXISTS uploaded_videos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        original_filename TEXT NOT NULL,
        title TEXT DEFAULT 'Untitled',
        description TEXT DEFAULT '',
        raw_video BYTEA NOT NULL,
        storage_path TEXT NOT NULL,
        is_deleted BOOLEAN DEFAULT FALSE,
        is_favorite BOOLEAN DEFAULT FALSE,
        uploaded_at TIMESTAMP DEFAULT NOW()
      );

      -- Таблица обработанных видео от ML-сервиса
      CREATE TABLE IF NOT EXISTS processed_videos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        video_id UUID UNIQUE REFERENCES uploaded_videos(id) ON DELETE CASCADE,
        processed_video BYTEA NOT NULL,
        processed_at TIMESTAMP DEFAULT NOW()
      );

      -- Таблица с результатами детекции (JSON отчёт)
      CREATE TABLE IF NOT EXISTS detection_results (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        video_id UUID UNIQUE REFERENCES uploaded_videos(id) ON DELETE CASCADE,
        detection_json JSONB NOT NULL,
        detection_accuracy FLOAT CHECK (detection_accuracy BETWEEN 0 AND 1),
        reviewed BOOLEAN DEFAULT FALSE,
        reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
        reviewed_at TIMESTAMP
      );

      -- Таблица логов (для будущей аналитики и аудита)
      CREATE TABLE IF NOT EXISTS logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Структура базы данных успешно инициализирована!");
  } catch (error) {
    console.error("❌ Ошибка инициализации базы:", error.message);
  } finally {
    pool.end(); // Закрываем пул соединений
  }
};

// Запуск инициализации
initializeDatabase();