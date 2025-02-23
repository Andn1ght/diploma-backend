const AuthService = require("../services/authService");
const { validationResult } = require("express-validator");

class AuthController {
  static async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = await AuthService.register(req.body.username, req.body.email, req.body.password);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      console.error("❌ Registration Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { token, user } = await AuthService.login(req.body.email, req.body.password);
      res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
      console.error("❌ Login Error:", error.message);
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = AuthController;