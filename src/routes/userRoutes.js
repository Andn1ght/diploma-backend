const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const UserController = require("../controllers/userController");

const router = express.Router();

// Get All Users (Admin Only)
router.get("/", authenticateUser, authorizeRoles("admin"), UserController.getAllUsers);

// Get User by ID
router.get("/:id", authenticateUser, UserController.getUserById);

// Update User (Admin or User)
router.put("/:id", authenticateUser, authorizeRoles("admin", "user"), UserController.updateUser);

// Delete User (Admin Only)
router.delete("/:id", authenticateUser, authorizeRoles("admin"), UserController.deleteUser);

module.exports = router;