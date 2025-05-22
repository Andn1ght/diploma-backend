const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const UserController = require("../controllers/userController");

const router = express.Router();

// 👤 Получить всех пользователей (доступно только администратору)
router.get("/", authenticateUser, authorizeRoles("admin"), UserController.getAllUsers);

// 🔍 Получить пользователя по ID (доступен всем авторизованным)
router.get("/:id", authenticateUser, UserController.getUserById);

// ✏️ Обновить пользователя (разрешено самому пользователю или администратору)
router.put("/:id", authenticateUser, authorizeRoles("admin", "user"), UserController.updateUser);

// 🗑️ Удалить пользователя (только администратор)
router.delete("/:id", authenticateUser, authorizeRoles("admin"), UserController.deleteUser);

module.exports = router;