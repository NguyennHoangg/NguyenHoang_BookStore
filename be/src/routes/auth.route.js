const express = require("express");
const router = express.Router();
const {
  loginController,
  registerController,
  logoutController,
  refreshTokenController,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.midleware");

// Public routes
router.post("/login", loginController);
router.post("/register", registerController);

// Dùng refresh token (trong cookie) để lấy access token mới
router.post("/refresh", refreshTokenController);

// Protected: cần access token hợp lệ để logout
router.post("/logout", authMiddleware, logoutController);


module.exports = router;