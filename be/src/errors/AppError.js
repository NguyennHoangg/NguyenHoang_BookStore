/**
 * Custom Application Error Class
 * @extends Error
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true; // Để phân biệt với programming errors
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

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

module.exports = {
  AppError,
  createError,
  createValidationError,
  formatErrorResponse
};