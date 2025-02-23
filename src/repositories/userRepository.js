const pool = require("../config/db");

class UserRepository {
  static async createUser(username, email, passwordHash, role = "user") {
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
      [username, email, passwordHash, role]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  }

  static async findById(userId) {
    const result = await pool.query("SELECT id, username, email, role FROM users WHERE id = $1", [userId]);
    return result.rows[0] || null;
  }

  static async getAllUsers() {
    const result = await pool.query("SELECT id, username, email, role FROM users");
    return result.rows;
  }

  static async updateUser(userId, username, email, role) {
    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, username, email, role",
      [username, email, role, userId]
    );
    return result.rows[0];
  }

  static async deleteUser(userId) {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    return { message: "User deleted successfully" };
  }
}

module.exports = UserRepository;