const { getRedis } = require("../config/redis");
const logger = require("../utils/logger");

// Thời gian mặc định là 5 phút
const DEFAULT_TTL_SECONDS = 60 * 5;

/**
 * Lấy data từ cache. Nếu không có → gọi fetchFn() rồi lưu vào cache.
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Async function lấy data từ DB
 * @param {number} ttl - Thời gian sống (giây)
 */
const getOrSet = async (key, fetchFn, ttl = DEFAULT_TTL_SECONDS) => {
  const client = getRedis();

  // Redis offline → bypass cache, lấy thẳng từ DB
  if (!client) {
    logger.warn(`[Cache] Redis offline — bypass: ${key}`);
    return await fetchFn(); // Bug fix: thiếu return
  }

  try {
    // Tìm trong cache
    const cached = await client.get(key);
    if (cached) {
      logger.debug(`[Cache] HIT — ${key}`);
      return JSON.parse(cached);
    }

    // Không có trong cache → lấy từ DB
    logger.debug(`[Cache] MISS — ${key}`);
    const freshData = await fetchFn();

    // Lưu vào cache
    await client.setEx(key, ttl, JSON.stringify(freshData));
    return freshData;
  } catch (err) {
    // Redis lỗi giữa chừng → fallback về DB, không crash app
    logger.error(`[Cache] Lỗi Redis, fallback DB — ${key}: ${err.message}`);
    return await fetchFn(); // Bug fix: thiếu message trong console.error gốc
  }
};

/**
 * Xóa 1 cache key
 */
const del = async (key) => {
  const client = getRedis();
  if (!client) return;

  try {
    await client.del(key);
    logger.debug(`[Cache] Deleted — ${key}`);
  } catch (err) {
    // Bug fix: gốc dùng `throw err` nhưng biến tên là `error` → ReferenceError
    logger.error(`[Cache] Lỗi xóa cache — ${key}: ${err.message}`);
  }
};

/**
 * Xóa nhiều key theo pattern (vd: "books:list:*")
 * Dùng sau khi tạo/sửa/xóa sách để invalidate cache danh sách
 */
const delPattern = async (pattern) => {
  const client = getRedis();
  if (!client) return;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
      logger.debug(`[Cache] Deleted ${keys.length} keys — pattern: ${pattern}`);
    }
  } catch (err) {
    logger.error(`[Cache] Lỗi xóa pattern — ${pattern}: ${err.message}`);
  }
};

/**
 * Set giá trị trực tiếp (không qua fetchFn)
 * Dùng cho: token blacklist, rate limit counter, v.v.
 */
const set = async (key, value, ttl) => {
  const client = getRedis();
  if (!client) return;

  try {
    if (ttl) {
      await client.setEx(key, ttl, String(value));
    } else {
      await client.set(key, String(value));
    }
  } catch (err) {
    logger.error(`[Cache] Lỗi set — ${key}: ${err.message}`);
  }
};

/**
 * Lấy giá trị trực tiếp
 */
const get = async (key) => {
  const client = getRedis();
  if (!client) return null;

  try {
    return await client.get(key);
  } catch (err) {
    logger.error(`[Cache] Lỗi get — ${key}: ${err.message}`);
    return null;
  }
};

module.exports = { getOrSet, del, delPattern, set, get };
