const express = require("express");
const { body } = require("express-validator");
const AuthController = require("../controllers/authController");

const router = express.Router();

// User Registration
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  AuthController.register
);

// User Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  AuthController.login
);

module.exports = router;