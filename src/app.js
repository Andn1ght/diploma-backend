const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// 🔒 Middleware безопасности и удобства
app.use(cors());                      // Разрешаем CORS
app.use(helmet());                    // Защита HTTP-заголовков
app.use(compression());              // Сжатие ответов
app.use(morgan("dev"));              // HTTP логирование

// 📦 Обработка JSON и форм
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔗 Роутинг API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 🏠 Главная страница API
app.get("/", (req, res) => {
  console.log("[APP] ✅ API работает");
  res.status(200).json({ message: "Backend API работает!" });
});

module.exports = app;