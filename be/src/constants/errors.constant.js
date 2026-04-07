/**
 * Error Constants
 * Centralized error definitions for consistent error handling
 * Based on Fashion Store API Specification v1.0
 */

const httpStatus = require('./httpStatus');

// ==================== AUTHENTICATION ERRORS ====================
const AUTH_ERRORS = {
  // Login Errors
  AUTH_CREDENTIALS_INVALID: {
    message: 'Sai email/password',
    statusCode: httpStatus.UNAUTHORIZED,
    errorCode: 'AUTH_CREDENTIALS_INVALID'
  },
  AUTH_ACCOUNT_LOCKED: {
    message: 'Tài khoản bị khóa',
    statusCode: httpStatus.UNAUTHORIZED,
    errorCode: 'AUTH_ACCOUNT_LOCKED'
  },
  AUTH_ACCOUNT_UNVERIFIED: {
    message: 'Chưa xác minh email',
    statusCode: httpStatus.UNAUTHORIZED,
    errorCode: 'AUTH_ACCOUNT_UNVERIFIED'
  },
  AUTH_ACCOUNT_NOT_FOUND: {
    message: 'Người dùng không tồn tại',
    statusCode: httpStatus.UNAUTHORIZED,
    errorCode: 'AUTH_ACCOUNT_NOT_FOUND'
  },
  
  // Registration Errors
  DUPLICATE_EMAIL: {
    message: 'Email đã tồn tại',
    statusCode: httpStatus.CONFLICT,
    errorCode: 'DUPLICATE_EMAIL'
  },
  PASSWORD_TOO_WEAK: {
    message: 'Mật khẩu không đủ mạnh',
    statusCode: httpStatus.BAD_REQUEST,
    errorCode: 'PASSWORD_TOO_WEAK'
  },
  
  // Token Errors
  TOKEN_EXPIRED: {
    message: 'Token đã hết hạn',
    statusCode: httpStatus.UNAUTHORIZED,
    errorCode: 'TOKEN_EXPIRED'
  },
  TOKEN_INVALID: {
    message: 'Token không hợp lệ',
    statusCode: httpStatus.UNAUTHORIZED,
    errorCode: 'TOKEN_INVALID'
  },
  TOKEN_MISSING: {
    message: 'Thiếu token xác thực',
    statusCode: httpStatus.UNAUTHORIZED,
    errorCode: 'TOKEN_MISSING'
  },
  REFRESH_TOKEN_INVALID: {
    message: 'Refresh token không hợp lệ',
    statusCode: httpStatus.UNAUTHORIZED,
    errorCode: 'REFRESH_TOKEN_INVALID'
  },
  
  // OAuth Errors
  OAUTH_TOKEN_INVALID: {
    message: 'OAuth token không hợp lệ',
    statusCode: httpStatus.UNAUTHORIZED,
    errorCode: 'OAUTH_TOKEN_INVALID'
  },
  OAUTH_PROVIDER_ERROR: {
    message: 'Lỗi từ OAuth provider',
    statusCode: httpStatus.BAD_REQUEST,
    errorCode: 'OAUTH_PROVIDER_ERROR'
  }
};

// ==================== VALIDATION ERRORS ====================
const VALIDATION_ERRORS = {
  VALIDATION_ERROR: {
    message: 'Dữ liệu không hợp lệ',
    statusCode: httpStatus.BAD_REQUEST,
    errorCode: 'VALIDATION_ERROR'
  },
  MISSING_REQUIRED_FIELD: {
    message: 'Thiếu thông tin bắt buộc',
    statusCode: httpStatus.BAD_REQUEST,
    errorCode: 'MISSING_REQUIRED_FIELD'
  },
  INVALID_EMAIL_FORMAT: {
    message: 'Email không đúng định dạng',
    statusCode: httpStatus.BAD_REQUEST,
    errorCode: 'INVALID_EMAIL_FORMAT'
  },
  INVALID_PHONE_FORMAT: {
    message: 'Số điện thoại không đúng định dạng',
    statusCode: httpStatus.BAD_REQUEST,
    errorCode: 'INVALID_PHONE_FORMAT'
  },
  INVALID_DATE_FORMAT: {
    message: 'Ngày tháng không đúng định dạng',
    statusCode: httpStatus.BAD_REQUEST,
    errorCode: 'INVALID_DATE_FORMAT'
  }
};

// ==================== USER ERRORS ====================
const USER_ERRORS = {
  USER_NOT_FOUND: {
    message: 'Người dùng không tồn tại',
    statusCode: httpStatus.NOT_FOUND,
    errorCode: 'USER_NOT_FOUND'
  },
  USER_UPDATE_FAILED: {
    message: 'Cập nhật thông tin thất bại',
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'USER_UPDATE_FAILED'
  },
  USER_UNAUTHORIZED: {
    message: 'Không có quyền truy cập',
    statusCode: httpStatus.FORBIDDEN,
    errorCode: 'USER_UNAUTHORIZED'
  }
};

// ==================== ADDRESS ERRORS ====================
const ADDRESS_ERRORS = {
  ADDRESS_NOT_FOUND: {
    message: 'Địa chỉ không tồn tại',
    statusCode: httpStatus.NOT_FOUND,
    errorCode: 'ADDRESS_NOT_FOUND'
  },
  ADDRESS_CREATE_FAILED: {
    message: 'Tạo địa chỉ thất bại',
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'ADDRESS_CREATE_FAILED'
  },
  ADDRESS_UPDATE_FAILED: {
    message: 'Cập nhật địa chỉ thất bại',
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'ADDRESS_UPDATE_FAILED'
  }
};

// ==================== BOOK ERRORS ====================
const BOOK_ERRORS = {
  BOOK_NOT_FOUND: {
    message: 'Sách không tồn tại',
    statusCode: httpStatus.NOT_FOUND,
    errorCode: 'BOOK_NOT_FOUND'
  },
  VARIANT_NOT_FOUND: {
    message: 'Phiên bản sách không tồn tại',
    statusCode: httpStatus.NOT_FOUND,
    errorCode: 'VARIANT_NOT_FOUND'
  },
  CATEGORY_NOT_FOUND: {
    message: 'Danh mục không tồn tại',
    statusCode: httpStatus.NOT_FOUND,
    errorCode: 'CATEGORY_NOT_FOUND'
  }
};

// ==================== CART ERRORS ====================
const CART_ERRORS = {
  CART_NOT_FOUND: {
    message: 'Giỏ hàng không tồn tại',
    statusCode: httpStatus.NOT_FOUND,
    errorCode: 'CART_NOT_FOUND'
  },
  CART_ITEM_NOT_FOUND: {
    message: 'Sách không có trong giỏ hàng',
    statusCode: httpStatus.NOT_FOUND,
    errorCode: 'CART_ITEM_NOT_FOUND'
  },
  INSUFFICIENT_STOCK: {
    message: 'Không đủ hàng trong kho',
    statusCode: httpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'INSUFFICIENT_STOCK'
  },
  BOOK_OUT_OF_STOCK: {
    message: 'Sách đã hết hàng',
    statusCode: httpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'BOOK_OUT_OF_STOCK'
  },
  INVALID_QUANTITY: {
    message: 'Số lượng không hợp lệ',
    statusCode: httpStatus.BAD_REQUEST,
    errorCode: 'INVALID_QUANTITY'
  }
};

// ==================== ORDER ERRORS ====================
const ORDER_ERRORS = {
  ORDER_NOT_FOUND: {
    message: 'Đơn hàng không tồn tại',
    statusCode: httpStatus.NOT_FOUND,
    errorCode: 'ORDER_NOT_FOUND'
  },
  ORDER_CREATE_FAILED: {
    message: 'Tạo đơn hàng thất bại',
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'ORDER_CREATE_FAILED'
  },
  ORDER_CANNOT_CANCEL: {
    message: 'Đơn hàng không thể hủy',
    statusCode: httpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'ORDER_CANNOT_CANCEL'
  },
  ORDER_ALREADY_PAID: {
    message: 'Đơn hàng đã thanh toán không thể hủy',
    statusCode: httpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'ORDER_ALREADY_PAID'
  },
  MIN_ORDER_NOT_MET: {
    message: 'Chưa đủ giá trị đơn hàng tối thiểu',
    statusCode: httpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'MIN_ORDER_NOT_MET'
  },
  ORDER_EMPTY_CART: {
    message: 'Giỏ hàng trống',
    statusCode: httpStatus.BAD_REQUEST,
    errorCode: 'ORDER_EMPTY_CART'
  }
};

// ==================== PAYMENT ERRORS ====================
const PAYMENT_ERRORS = {
  PAYMENT_FAILED: {
    message: 'Thanh toán thất bại',
    statusCode: httpStatus.BAD_REQUEST,
    errorCode: 'PAYMENT_FAILED'
  },
  PAYMENT_GATEWAY_ERROR: {
    message: 'Lỗi từ cổng thanh toán',
    statusCode: httpStatus.BAD_GATEWAY,
    errorCode: 'PAYMENT_GATEWAY_ERROR'
  },
  PAYMENT_TIMEOUT: {
    message: 'Thanh toán hết thời gian',
    statusCode: httpStatus.REQUEST_TIMEOUT,
    errorCode: 'PAYMENT_TIMEOUT'
  },
  PAYMENT_ALREADY_COMPLETED: {
    message: 'Thanh toán đã được xử lý',
    statusCode: httpStatus.CONFLICT,
    errorCode: 'PAYMENT_ALREADY_COMPLETED'
  },
  INVALID_PAYMENT_METHOD: {
    message: 'Phương thức thanh toán không hợp lệ',
    statusCode: httpStatus.BAD_REQUEST,
    errorCode: 'INVALID_PAYMENT_METHOD'
  }
};

// ==================== VOUCHER ERRORS ====================
const VOUCHER_ERRORS = {
  VOUCHER_NOT_FOUND: {
    message: 'Voucher không tồn tại',
    statusCode: httpStatus.NOT_FOUND,
    errorCode: 'VOUCHER_NOT_FOUND'
  },
  VOUCHER_EXPIRED: {
    message: 'Voucher đã hết hạn',
    statusCode: httpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'VOUCHER_EXPIRED'
  },
  VOUCHER_ALREADY_USED: {
    message: 'Voucher đã được sử dụng',
    statusCode: httpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'VOUCHER_ALREADY_USED'
  },
  VOUCHER_LIMIT_REACHED: {
    message: 'Voucher đã hết lượt sử dụng',
    statusCode: httpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'VOUCHER_LIMIT_REACHED'
  },
  VOUCHER_MIN_ORDER_NOT_MET: {
    message: 'Chưa đủ giá trị đơn hàng tối thiểu để áp dụng voucher',
    statusCode: httpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'MIN_ORDER_NOT_MET'
  },
  VOUCHER_NOT_APPLICABLE: {
    message: 'Voucher không áp dụng cho đơn hàng này',
    statusCode: httpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'VOUCHER_NOT_APPLICABLE'
  }
};

// ==================== REVIEW ERRORS ====================
const REVIEW_ERRORS = {
  REVIEW_NOT_FOUND: {
    message: 'Đánh giá không tồn tại',
    statusCode: httpStatus.NOT_FOUND,
    errorCode: 'REVIEW_NOT_FOUND'
  },
  REVIEW_ALREADY_EXISTS: {
    message: 'Bạn đã đánh giá sản phẩm này',
    statusCode: httpStatus.CONFLICT,
    errorCode: 'REVIEW_ALREADY_EXISTS'
  },
  REVIEW_UNAUTHORIZED: {
    message: 'Bạn chưa mua sản phẩm này',
    statusCode: httpStatus.FORBIDDEN,
    errorCode: 'REVIEW_UNAUTHORIZED'
  }
};

// ==================== RATE LIMITING ERRORS ====================
const RATE_LIMIT_ERRORS = {
  RATE_LIMIT_EXCEEDED: {
    message: 'Vượt quá giới hạn requests',
    statusCode: httpStatus.TOO_MANY_REQUESTS,
    errorCode: 'RATE_LIMIT_EXCEEDED'
  }
};

// ==================== DATABASE ERRORS ====================
const DB_ERRORS = {
  CONNECTION_FAILED: {
    message: 'Kết nối cơ sở dữ liệu thất bại',
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'DB_CONNECTION_FAILED'
  },
  QUERY_FAILED: {
    message: 'Truy vấn cơ sở dữ liệu thất bại',
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'DB_QUERY_FAILED'
  },
  TRANSACTION_FAILED: {
    message: 'Giao dịch cơ sở dữ liệu thất bại',
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'DB_TRANSACTION_FAILED'
  }
};

// ==================== GENERAL ERRORS ====================
const GENERAL_ERRORS = {
  INTERNAL_SERVER_ERROR: {
    message: 'Lỗi máy chủ nội bộ',
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'INTERNAL_SERVER_ERROR'
  },
  NOT_FOUND: {
    message: 'Không tìm thấy tài nguyên',
    statusCode: httpStatus.NOT_FOUND,
    errorCode: 'NOT_FOUND'
  },
  BAD_REQUEST: {
    message: 'Yêu cầu không hợp lệ',
    statusCode: httpStatus.BAD_REQUEST,
    errorCode: 'BAD_REQUEST'
  },
  UNAUTHORIZED: {
    message: 'Chưa xác thực',
    statusCode: httpStatus.UNAUTHORIZED,
    errorCode: 'UNAUTHORIZED'
  },
  FORBIDDEN: {
    message: 'Không có quyền truy cập',
    statusCode: httpStatus.FORBIDDEN,
    errorCode: 'FORBIDDEN'
  },
  SERVICE_UNAVAILABLE: {
    message: 'Dịch vụ tạm thời không khả dụng',
    statusCode: httpStatus.SERVICE_UNAVAILABLE,
    errorCode: 'SERVICE_UNAVAILABLE'
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Create AppError from error constant
 * @param {Object} errorConstant - Error constant object
 * @param {string|null} customMessage - Custom error message (optional)
 * @param {Array|Object|null} details - Additional error details (optional)
 * @returns {AppError}
 */
const createError = (errorConstant, customMessage = null, details = null) => {
  return new AppError(
    customMessage || errorConstant.message,
    errorConstant.statusCode,
    errorConstant.errorCode,
    details
  );
};

/**
 * Create validation error with field details
 * @param {Array} fieldErrors - Array of field validation errors
 * @returns {AppError}
 */
const createValidationError = (fieldErrors) => {
  return new AppError(
    'Dữ liệu không hợp lệ',
    httpStatus.BAD_REQUEST,
    'VALIDATION_ERROR',
    fieldErrors
  );
};

/**
 * Format error response
 * @param {Error} error - Error object
 * @param {string} path - Request path
 * @param {string} requestId - Request ID
 * @returns {Object}
 */
const formatErrorResponse = (error, path, requestId) => {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.errorCode,
        message: error.message,
        details: error.details,
        timestamp: error.timestamp,
        path: path,
        requestId: requestId
      }
    };
  }

  // Unknown error
  return {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Đã xảy ra lỗi không xác định',
      timestamp: new Date().toISOString(),
      path: path,
      requestId: requestId
    }
  };
};

// ==================== EXPORTS ====================
module.exports = {
  // Classes
  AppError,
  
  // Error Constants
  AUTH_ERRORS,
  VALIDATION_ERRORS,
  USER_ERRORS,
  ADDRESS_ERRORS,
  PRODUCT_ERRORS,
  CART_ERRORS,
  ORDER_ERRORS,
  PAYMENT_ERRORS,
  VOUCHER_ERRORS,
  REVIEW_ERRORS,
  RATE_LIMIT_ERRORS,
  DB_ERRORS,
  GENERAL_ERRORS,
  
  // Helper Functions
  createError,
  createValidationError,
  formatErrorResponse
};