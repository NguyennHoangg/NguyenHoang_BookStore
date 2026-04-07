/**
 * Auth Validator
 * @description Validation rules cho authentication endpoints
 */

const { body, validationResult } = require('express-validator');
const { HTTP_STATUS } = require('../../constants');
const { createValidationError } = require('../../constants/errors');

/**
 * Middleware để xử lý kết quả validation
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errorMessages
    });
  }
  
  next();
};

/**
 * Validation rules cho đăng ký
 */
const registerValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email không được để trống')
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail()
    .toLowerCase()
    .escape(), //Chống XSS
  
  body('password')
    .notEmpty().withMessage('Password không được để trống')
    .isLength({ min: 6 }).withMessage('Password phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password phải chứa chữ hoa, chữ thường và số'),
  
  body('fullName')
    .trim()
    .notEmpty().withMessage('Họ tên không được để trống')
    .isLength({ min: 2, max: 100 }).withMessage('Họ tên phải từ 2-100 ký tự')
    .escape() //  Chống XSS
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/).withMessage('Họ tên chỉ chứa chữ cái và khoảng trắng'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Số điện thoại không được để trống')
    .matches(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/).withMessage('Số điện thoại không hợp lệ (VD: 0912345678)')
    .escape(), // Chống XSS
  
  body('role')
    .optional()
    .isIn(['customer', 'admin']).withMessage('Role chỉ có thể là customer hoặc admin'),

  handleValidationErrors
];

/**
 * Validation rules cho đăng nhập
 */
const loginValidation = [
  body('identifier')
    .trim()
    .notEmpty().withMessage('Email hoặc số điện thoại không được để trống')
    .escape(), //  Chống XSS
  
  body('password')
    .notEmpty().withMessage('Password không được để trống'),

  handleValidationErrors
];

/**
 * Validation rules cho refresh token
 * (Không cần validate body vì refresh token lấy từ cookie)
 */
const refreshTokenValidation = [
  // Có thể thêm validation cho cookie nếu cần
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  handleValidationErrors
};