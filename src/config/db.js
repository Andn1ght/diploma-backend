const { Pool } = require("pg");                      // Подключаем модуль для подключения к PostgreSQL
const dotenv = require("dotenv");                    // Для загрузки переменных окружения из .env
const path = require("path");                        // Для безопасной работы с путями

// Загружаем переменные окружения из .env файла
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Выбираем нужный URL подключения в зависимости от окружения
const DATABASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL                // Для Railway или продакшн-среды
    : process.env.DATABASE_PUBLIC_URL;        // Для локальной разработки

// Если переменная окружения не задана — выводим ошибку и завершаем процесс
if (!DATABASE_URL) {
  console.error("❌ ОШИБКА: DATABASE_URL не определён. Проверь .env файл.");
  process.exit(1);
}

// Создаём пул подключений к PostgreSQL
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // SSL только в продакшене
});

// Пробуем подключиться к базе данных
pool
  .connect()
  .then(() => console.log("✅ Успешное подключение к PostgreSQL"))
  .catch((err) => {
    console.error("❌ Ошибка подключения к БД:", err.message);
    process.exit(1);
  });

// Экспортируем пул для использования в других частях проекта
module.exports = pool;