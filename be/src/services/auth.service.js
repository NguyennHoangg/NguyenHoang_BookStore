const {
  findByCredential,
  createUser,
  updateLastLoginAt,
} = require("../models/user.model");
const bcrypt = require("bcrypt");
const {
  createError,
  HTTP_STATUS,
  AUTH_ERRORS,
  VALIDATION_ERRORS,
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
//15 minutes
const LOCK_OUT_TIME = 15 * 60 * 1000;

const login = async (email, password) => {
  try {
    const attemptsKey = CACHE_KEYS.LOGIN_ATTEMPTS(email);
    const attemps = await redisCache.get(attemptsKey);

    if (parseInt(attemps) >= MAX_LOGIN_ATTEMPTS) {
      throw createError(
        HTTP_STATUS.TOO_MANY_REQUESTS,
        "Tài khoản của bạn đã bị khóa tạm thời do nhập sai mật khẩu quá nhiều lần. Vui lòng thử lại sau 15 phút.",
      );
    }

    // Kiểm tra xem tài khoản có tồn tại không
    const account = await findByCredential(email);
    if (!account) {
      await redisCache.increaseLoginAttempts(email, LOCK_OUT_TIME);
      throw createError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_ERRORS.INVALID_CREDENTIALS,
      );
    }
    // So sánh mật khẩu đã nhập với mật khẩu đã lưu trong cơ sở dữ liệu
    const isMatch = await bcrypt.compare(password, account.passwordhash);
    if (!isMatch) {
      throw createError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_ERRORS.INVALID_CREDENTIALS,
      );
    }
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
    throw createError(HTTP_STATUS.UNAUTHORIZED, AUTH_ERRORS.REFRESH_TOKEN_INVALID);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw createError(HTTP_STATUS.UNAUTHORIZED, AUTH_ERRORS.REFRESH_TOKEN_INVALID);
  }

  // Kiểm tra refresh token trong Redis có khớp không (chưa bị logout)
  const storedToken = await redisCache.get(CACHE_KEYS.REFRESH_TOKEN(decoded.userid));
  if (!storedToken || storedToken !== refreshToken) {
    throw createError(HTTP_STATUS.UNAUTHORIZED, AUTH_ERRORS.REFRESH_TOKEN_INVALID);
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
 * @param {String} identifier
 * @param {String} password
 * @param {String} fullname
 */
const register = async (identifier, password, fullname) => {
  try {
    if (!identifier) {
      throw createError(
        HTTP_STATUS.BAD_REQUEST,
        VALIDATION_ERRORS.MISSING_FIELDS,
        { fields: ["identifier"] },
      );
    }
    if (!password) {
      throw createError(
        HTTP_STATUS.BAD_REQUEST,
        VALIDATION_ERRORS.MISSING_FIELDS,
        { fields: ["password"] },
      );
    }
    if (!fullname) {
      throw createError(
        HTTP_STATUS.BAD_REQUEST,
        VALIDATION_ERRORS.MISSING_FIELDS,
        { fields: ["fullname"] },
      );
    }

    // Kiểm tra xem tài khoản đã tồn tại chưa
    const existingAccount = await findByCredential(identifier);
    if (existingAccount) {
      throw createError(HTTP_STATUS.CONFLICT, AUTH_ERRORS.AUTH_ALLREADY_EXISTS);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const accountId = generateAccountId();
    const userId = generateUserId();
    const userData = { userId, accountId, identifier, passwordHash, fullname };
    const newUser = await createUser(userData);
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
