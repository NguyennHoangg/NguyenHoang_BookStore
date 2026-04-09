const express = require("express");
const router = express.Router();
const {loginController} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.midleware");
const errorHandler = require("../middlewares/errorrHandler");

router.post("/login", loginController);

module.exports = router;