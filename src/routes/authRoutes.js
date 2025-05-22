const express = require("express");
const { body } = require("express-validator");
const AuthController = require("../controllers/authController");

const router = express.Router();

// 🔐 Регистрация пользователя
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Имя пользователя обязательно"),
    body("email").isEmail().withMessage("Укажите корректный email"),
    body("password").isLength({ min: 6 }).withMessage("Пароль должен содержать минимум 6 символов"),
  ],
  AuthController.register
);

// 🔐 Вход пользователя
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Укажите корректный email"),
    body("password").notEmpty().withMessage("Пароль обязателен"),
  ],
  AuthController.login
);

module.exports = router;