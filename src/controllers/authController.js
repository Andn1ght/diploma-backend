const AuthService = require("../services/authService");
const { validationResult } = require("express-validator");

class AuthController {
  // 📌 Регистрация нового пользователя
  static async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("[AUTH][REGISTER] ❌ Ошибка валидации:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await AuthService.register(req.body.username, req.body.email, req.body.password);

      console.log(`[AUTH][REGISTER] ✅ Успешная регистрация: ${user.username} (${user.email})`);

      res.status(201).json({ message: "Пользователь успешно зарегистрирован", user });
    } catch (error) {
      console.error("[AUTH][REGISTER] ❌ Ошибка регистрации:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // 📌 Вход пользователя
  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("[AUTH][LOGIN] ❌ Ошибка валидации:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { token, user } = await AuthService.login(req.body.email, req.body.password);
      res.status(200).json({ message: "Вход выполнен успешно", token, user });
    } catch (error) {
      console.warn(`[AUTH][LOGIN] ❌ Неудачный вход для email: ${req.body.email}`);
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = AuthController;