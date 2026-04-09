const jwt = require('jsonwebtoken');
const { createError } = require('../constants');
const {HTTP_STATUS} = require('../constants');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header
  const secretKey = process.env.JWT_SECRET_KEY; // Sử dụng biến môi trường để lưu trữ secret key

  if(!token) {
     throw createError(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized: No token provided');
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    throw createError(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized: Invalid token');
  }

}

module.exports = authMiddleware;
