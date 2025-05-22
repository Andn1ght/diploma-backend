const UserService = require("../services/userService");

class UserController {
  // 📋 Получить всех пользователей (только для admin)
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      console.log(`[USER][ADMIN] ✅ Получен список всех пользователей (${users.length})`);
      res.status(200).json(users);
    } catch (error) {
      console.error("[USER][ADMIN] ❌ Ошибка при получении всех пользователей:", error.message);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  // 🔍 Получить пользователя по ID
  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        console.warn(`[USER] ⚠️ Пользователь не найден: ${req.params.id}`);
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      console.log(`[USER] ✅ Найден пользователь: ${user.username} (${user.email})`);
      res.status(200).json(user);
    } catch (error) {
      console.error("[USER] ❌ Ошибка при получении пользователя:", error.message);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  // ✏️ Обновить пользователя
  static async updateUser(req, res) {
    try {
      const { username, email, role } = req.body;
      const updatedUser = await UserService.updateUser(req.params.id, username, email, role);

      console.log(`[USER][UPDATE] ✅ Обновлён пользователь: ${updatedUser.username} (${updatedUser.email})`);

      res.status(200).json({ message: "Пользователь обновлён", user: updatedUser });
    } catch (error) {
      console.error("[USER][UPDATE] ❌ Ошибка обновления пользователя:", error.message);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  // 🗑️ Удалить пользователя
  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);

      console.log(`[USER][DELETE] 🗑️ Удалён пользователь с ID: ${req.params.id}`);

      res.status(200).json({ message: "Пользователь успешно удалён" });
    } catch (error) {
      console.error("[USER][DELETE] ❌ Ошибка удаления пользователя:", error.message);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
}

module.exports = UserController;