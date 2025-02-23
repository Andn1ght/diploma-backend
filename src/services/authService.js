const UserRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class AuthService {
  static async register(username, email, password, role = "user") {
    // Check if email already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) throw new Error("Email is already in use");

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user in database
    return await UserRepository.createUser(username, email, passwordHash, role);
  }

  static async login(email, password) {
    // Check if user exists
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }
}

module.exports = AuthService;