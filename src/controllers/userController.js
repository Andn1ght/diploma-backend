const UserService = require("../services/userService");

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("❌ Error fetching users:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.status(200).json(user);
    } catch (error) {
      console.error("❌ Error fetching user:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateUser(req, res) {
    try {
      const { username, email, role } = req.body;
      const updatedUser = await UserService.updateUser(req.params.id, username, email, role);
      
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("❌ Error updating user:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting user:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = UserController;