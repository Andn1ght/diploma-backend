const UserRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class AuthService {
  // 📌 Регистрация нового пользователя
  static async register(username, email, password, role = "user") {
    // Проверка на существование пользователя
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      console.warn(`[AUTH][REGISTER] ⚠️ Email уже используется: ${email}`);
      throw new Error("Email уже используется");
    }

    // Хэшируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    // Сохраняем пользователя в БД
    const user = await UserRepository.createUser(username, email, passwordHash, role);

    console.log(`[AUTH][REGISTER] ✅ Зарегистрирован: ${user.username} (${user.email})`);

    return user;
  }

  // 📌 Вход в систему
  static async login(email, password) {
    // Поиск пользователя
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      console.warn(`[AUTH][LOGIN] ❌ Пользователь не найден по email: ${email}`);
      throw new Error("Неверный email или пароль");
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      console.warn(`[AUTH][LOGIN] ❌ Неверный пароль для email: ${email}`);
      throw new Error("Неверный email или пароль");
    }

    // Генерация JWT-токена
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`[AUTH][LOGIN] ✅ Вход выполнен: ${user.username} (${user.email})`);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}

module.exports = AuthService;