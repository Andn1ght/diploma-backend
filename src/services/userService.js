const UserRepository = require("../repositories/userRepository");

class UserService {
  static async getAllUsers() {
    return await UserRepository.getAllUsers();
  }

  static async getUserById(userId) {
    return await UserRepository.findById(userId);
  }

  static async updateUser(userId, username, email, role) {
    return await UserRepository.updateUser(userId, username, email, role);
  }

  static async deleteUser(userId) {
    return await UserRepository.deleteUser(userId);
  }
}

module.exports = UserService;