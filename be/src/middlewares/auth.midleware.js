const jwt = require('jsonwebtoken');
const { createError } = require('../constants');
const {HTTP_STATUS} = require('../constants');
const {isTokenBlacklisted} = require('../services/auth.service');

const authMiddleware = async(req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header
  const secretKey = process.env.JWT_SECRET_KEY; // Sử dụng biến môi trường để lưu trữ secret key

  if(!token) {
     throw createError(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized: No token provided');
  }

  //Kiểm tra token có trong blacklist không
  const isBlocked = await isTokenBlacklisted(token);
  if(isBlocked){
    throw createError(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized: Token has been revoked');
  }


  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    throw createError(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized: Invalid token');
  }

};

module.exports = authMiddleware;
