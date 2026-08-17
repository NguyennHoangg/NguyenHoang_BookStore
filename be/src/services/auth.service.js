const {
  findByCredential,
  createAccount,
  createUser,
  updateLastLoginAt,
} = require("../models/user.model");
const bcrypt = require("bcrypt");
const {
  createError,
  HTTP_STATUS,
  AUTH_ERRORS,
  VALIDATION_ERRORS,
  RATE_LIMIT_ERRORS,
} = require("../constants");
const {
  generateErrorId,
  generateUserId,
  generateAccountId,
} = require("../utils/generateId");
const redisCache = require("../redis/redisCache");
const logger = require("../utils/logger");
const jwtUtil = require("../utils/jwt");
const jwt = require("jsonwebtoken");

//CACHE key
const CACHE_KEYS = {
  TOKEN_BLACKLIST: (token) => `auth:blacklist:${token}`,
  LOGIN_ATTEMPTS: (email) => `auth:login_attempts:${email}`,
  REFRESH_TOKEN: (userId) => `auth:refresh:${userId}`,
};

// Refresh token TTL: 7 ngày (giây)
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;

//login attemp limit configuration
const MAX_LOGIN_ATTEMPTS = 5;
// 15 phút tính bằng giây (dùng cho Redis TTL)
const LOCK_OUT_TIME_SECONDS = 15 * 60;

const login = async (email, password) => {
  try {
    const attemptsKey = CACHE_KEYS.LOGIN_ATTEMPTS(email);
    const attempts = await redisCache.get(attemptsKey);

    logger.debug(`[AUTH] Login attempts for ${email}: ${attempts}`);

    // null nghĩa là chưa có lần thử nào → cho phép đăng nhập bình thường
    if (parseInt(attempts) >= MAX_LOGIN_ATTEMPTS) {
      throw createError(
        RATE_LIMIT_ERRORS.RATE_LIMIT_EXCEEDED,
        "Tài khoản của bạn đã bị khóa tạm thời do nhập sai mật khẩu quá nhiều lần. Vui lòng thử lại sau 15 phút.",
      );
    }

    // Kiểm tra xem tài khoản có tồn tại không
    const account = await findByCredential(email);
    if (!account) {
      // Tăng số lần thất bại kể cả khi không tìm thấy tài khoản
      await redisCache.increaseLoginAttempts(attemptsKey, LOCK_OUT_TIME_SECONDS);
      throw createError(AUTH_ERRORS.AUTH_CREDENTIALS_INVALID);
    }

    // So sánh mật khẩu đã nhập với mật khẩu đã lưu trong cơ sở dữ liệu
    const isMatch = await bcrypt.compare(password, account.passwordhash);
    if (!isMatch) {
      await redisCache.increaseLoginAttempts(attemptsKey, LOCK_OUT_TIME_SECONDS);
      throw createError(AUTH_ERRORS.AUTH_CREDENTIALS_INVALID);
    }

    // Đăng nhập thành công → reset số lần thử
    await redisCache.del(attemptsKey);

    // Update last login time
    await updateLastLoginAt(account.accountid);
    return account;
  } catch (error) {
    throw error;
  }
};

/**
 * Lưu refresh token vào Redis sau khi login thành công
 * @param {String} userId
 * @param {String} refreshToken
 */
const saveRefreshToken = async (userId, refreshToken) => {
  const key = CACHE_KEYS.REFRESH_TOKEN(userId);
  await redisCache.set(key, refreshToken, REFRESH_TOKEN_TTL);
  logger.debug(`[AUTH] Refresh token saved for user ${userId}`);
};

/**
 * Logout Function
 * Thêm access token vào blacklist + xóa refresh token khỏi Redis
 * @param {String} accessToken
 * @param {number} accessTokenTTL - Số giây còn lại của access token
 * @param {String} userId
 */
const logout = async (accessToken, accessTokenTTL, userId) => {
  // Blacklist access token (hết hạn tự xóa)
  const blacklistKey = CACHE_KEYS.TOKEN_BLACKLIST(accessToken);
  await redisCache.set(blacklistKey, "1", accessTokenTTL);
  logger.debug(
    `[AUTH] Access token blacklisted for ${accessTokenTTL}s — user ${userId}`,
  );

  // Xóa refresh token → user không thể lấy access token mới nữa
  if (userId) {
    const refreshKey = CACHE_KEYS.REFRESH_TOKEN(userId);
    await redisCache.del(refreshKey);
    logger.debug(`[AUTH] Refresh token removed for user ${userId}`);
  }
};

/**
 * Kiểm tra token có trong blacklist không
 * → Dùng trong middleware xác thực
 */
const isTokenBlacklisted = async (token) => {
  const key = CACHE_KEYS.TOKEN_BLACKLIST(token);
  const value = await redisCache.get(key);
  return value !== null; // true = đã logout
};

/**
 * Refresh Access Token
 * Kiểm tra refresh token → cấp access token mới
 * @param {String} refreshToken
 * @returns {String} accessToken mới
 */
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw createError(AUTH_ERRORS.REFRESH_TOKEN_INVALID);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw createError(AUTH_ERRORS.REFRESH_TOKEN_INVALID);
  }

  // Kiểm tra refresh token trong Redis có khớp không (chưa bị logout)
  const storedToken = await redisCache.get(CACHE_KEYS.REFRESH_TOKEN(decoded.userid));
  if (!storedToken || storedToken !== refreshToken) {
    throw createError(AUTH_ERRORS.REFRESH_TOKEN_INVALID);
  }

  // Cấp access token mới
  const newAccessToken = jwtUtil.generateAccessToken(
    { userid: decoded.userid, role: decoded.role },
    process.env.JWT_EXPIRES_IN,
  );

  logger.debug(`[AUTH] New access token issued for user ${decoded.userid}`);
  return { accessToken: newAccessToken, expiresIn: process.env.JWT_EXPIRES_IN };
};

/**
 * Register Function
 * @param {String} identifier - Loại định danh (EMAIL | PHONE)
 * @param {String} identifierValue - Giá trị định danh (email hoặc số điện thoại)
 * @param {String} password - Mật khẩu
 * @param {String} fullName - Họ tên
 */
const register = async (identifier, identifierValue, password, fullName) => {
  try {
    // ── Validate required fields ──
    if (!identifier) {
      throw createError(
        VALIDATION_ERRORS.MISSING_REQUIRED_FIELD,
        "Thiếu loại định danh (identifier)",
        { fields: ["identifier"] },
      );
    }
    if (!identifierValue) {
      throw createError(
        VALIDATION_ERRORS.MISSING_REQUIRED_FIELD,
        identifier === "EMAIL" ? "Email không được để trống" : "Số điện thoại không được để trống",
        { fields: ["identifierValue"] },
      );
    }
    if (!password) {
      throw createError(
        VALIDATION_ERRORS.MISSING_REQUIRED_FIELD,
        "Mật khẩu không được để trống",
        { fields: ["password"] },
      );
    }
    if (!fullName) {
      throw createError(
        VALIDATION_ERRORS.MISSING_REQUIRED_FIELD,
        "Họ và tên không được để trống",
        { fields: ["fullName"] },
      );
    }

    // ── Validate email format ──
    if (identifier === "EMAIL") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifierValue)) {
        throw createError(
          VALIDATION_ERRORS.INVALID_EMAIL_FORMAT,
          "Email không đúng định dạng",
        );
      }
    }

    // ── Validate password strength: tối thiểu 8 ký tự, có chữ số hoặc ký tự đặc biệt ──
    if (password.length < 8) {
      throw createError(
        AUTH_ERRORS.PASSWORD_TOO_WEAK,
        "Mật khẩu phải có ít nhất 8 ký tự",
      );
    }
    const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    if (!hasNumberOrSpecial) {
      throw createError(
        AUTH_ERRORS.PASSWORD_TOO_WEAK,
        "Mật khẩu phải chứa ít nhất 1 chữ số hoặc ký tự đặc biệt",
      );
    }

    // ── Kiểm tra tài khoản đã tồn tại chưa ──
    const existingAccount = await findByCredential(identifierValue);
    if (existingAccount) {
      throw createError(
        AUTH_ERRORS.AUTH_ALLREADY_EXISTS,
        identifier === "EMAIL" ? "Email này đã được sử dụng" : "Số điện thoại này đã được sử dụng",
      );
    }

    // ── Tạo account + user ──
    const passwordHash = await bcrypt.hash(password, 10);
    const accountId = generateAccountId();
    const userId = generateUserId();

    await createAccount({ accountId, identifier, identifiervalue: identifierValue, passwordHash });
    await createUser(userId, accountId, fullName);

    // ── Query lại để lấy đầy đủ thông tin user (cần cho việc cấp token) ──
    const newUser = await findByCredential(identifierValue);
    return newUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  login,
  register,
  logout,
  isTokenBlacklisted,
  saveRefreshToken,
  refreshAccessToken,
};
