const jwt = require("jsonwebtoken");

// 🛡️ Проверка авторизационного токена
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    console.warn("[AUTH] ❌ Отсутствует токен в заголовке Authorization");
    return res.status(401).json({ error: "Доступ запрещён. Токен не предоставлен." });
  }

  try {
    // Удаляем 'Bearer ' из токена (если есть)
    const parsedToken = token.replace("Bearer ", "");

    // Расшифровка токена
    const decoded = jwt.verify(parsedToken, process.env.JWT_SECRET);

    // Присваиваем данные пользователя к объекту запроса
    req.user = decoded;

    console.log(`[AUTH] ✅ Авторизован пользователь: ${decoded.userId} (роль: ${decoded.role})`);

    next();
  } catch (error) {
    console.warn("[AUTH] ❌ Недействительный токен");
    res.status(401).json({ error: "Недействительный токен" });
  }
};

// 🎯 Middleware для проверки ролей (RBAC)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      console.warn(`[AUTH][RBAC] ❌ Доступ запрещён для роли: ${req.user.role}`);
      return res.status(403).json({ error: "Доступ запрещён: недостаточно прав" });
    }

    console.log(`[AUTH][RBAC] ✅ Роль разрешена: ${req.user.role}`);
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };