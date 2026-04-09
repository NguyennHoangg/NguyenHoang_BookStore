const { findByCredential } = require("../models/user.model");
const bcrypt = require("bcrypt");
const { createError, HTTP_STATUS, AUTH_ERRORS } = require("../constants");

const login = async (email, password) => {
  try {
    // Kiểm tra xem tài khoản có tồn tại không
    // Nếu có, so sánh mật khẩu đã nhập với mật khẩu đã lưu trong cơ sở dữ liệu
    const account = await findByCredential(email);
    if (!account) {
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
    return account;
  } catch (error) {
    throw error;
  }
};

module.exports = { login };
