const UserRepository = require("../repositories/userRepository");

class UserService {
  // 📋 Получить всех пользователей
  static async getAllUsers() {
    const users = await UserRepository.getAllUsers();
    console.log(`[SERVICE][USER] 📋 Получено пользователей: ${users.length}`);
    return users;
  }

  // 🔍 Получить пользователя по ID
  static async getUserById(userId) {
    const user = await UserRepository.findById(userId);
    if (user) {
      console.log(`[SERVICE][USER] 🔍 Найден пользователь: ${user.username} (${userId})`);
    } else {
      console.warn(`[SERVICE][USER] ⚠️ Пользователь не найден: ${userId}`);
    }
    return user;
  }

  // ✏️ Обновить пользователя
  static async updateUser(userId, username, email, role) {
    const updatedUser = await UserRepository.updateUser(userId, username, email, role);
    console.log(`[SERVICE][USER] ✏️ Обновлён: ${updatedUser.username} (${userId})`);
    return updatedUser;
  }

  // 🗑️ Удалить пользователя
  static async deleteUser(userId) {
    await UserRepository.deleteUser(userId);
    console.log(`[SERVICE][USER] 🗑️ Удалён пользователь: ${userId}`);
    return { message: "Пользователь удалён" };
  }
}

module.exports = UserService;