const {
  login,
  register,
  logout,
  saveRefreshToken,
  refreshAccessToken,
} = require("../services/auth.service");
const { HTTP_STATUS, AUTH_ERRORS } = require("../constants");
const jwtUtil = require("./../utils/jwt");
const jwt = require("jsonwebtoken");

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);

    // Tạo cả 2 token
    const accessToken = jwtUtil.generateAccessToken(
      { userid: user.userid, role: user.role },
      process.env.JWT_EXPIRES_IN,
    );
    const refreshToken = jwtUtil.generateRefreshToken(
      { userid: user.userid, role: user.role },
      process.env.JWT_REFRESH_EXPIRES_IN,
    );

    // Lưu refresh token vào Redis
    await saveRefreshToken(user.userid, refreshToken);

    // Gửi refresh token qua httpOnly cookie (bảo mật hơn)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày (ms)
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        id: user.userid,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        phone: user.phone,
        address: user.address,
        dob: user.dob,
        gender: user.gender,
        isactive: user.isactive,
        lastLoginAt: user.lastloginat || null,
      },
      token: {
        accessToken,
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/logout
 * Yêu cầu: Authorization: Bearer <accessToken>
 * Refresh token lấy từ httpOnly cookie
 */
const logoutController = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, message: "Thiếu access token" });
    }

    // Tính thời gian còn lại của access token (để set TTL blacklist)
    let accessTokenTTL = 60 * 15; // fallback: 15 phút
    try {
      const decoded = jwt.decode(accessToken);
      if (decoded && decoded.exp) {
        const remaining = decoded.exp - Math.floor(Date.now() / 1000);
        if (remaining > 0) accessTokenTTL = remaining;
      }
    } catch (_) {}

    // userId từ req.user (đã được set bởi authMiddleware)
    const userId = req.user?.userid;

    await logout(accessToken, accessTokenTTL, userId);

    // Xóa cookie refresh token phía client
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/refresh
 * Lấy access token mới từ refresh token trong cookie
 */
const refreshTokenController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    const result = await refreshAccessToken(refreshToken);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      token: result,
    });
  } catch (error) {
    next(error);
  }
};

const registerController = async (req, res, next) => {
  try {
    const { identifier, password, fullname } = req.body;
    const newUser = await register(identifier, password, fullname);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Đăng ký thành công",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginController,
  registerController,
  logoutController,
  refreshTokenController,
};