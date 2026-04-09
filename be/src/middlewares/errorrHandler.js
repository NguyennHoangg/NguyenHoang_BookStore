const {
  AppError,
  createError,
  createValidationError,
  formatErrorResponse,
} = require("../errors/AppError");
const { HTTP_STATUS } = require("../constants");
const { generateErrorId } = require("../utils/generateId");

/** * Middleware xử lý lỗi toàn cục
 * @param {Error} err - Đối tượng lỗi
 * @param {Request} req - Đối tượng request
 * @param {Response} res - Đối tượng response
 * @param {Function} next - Hàm next để chuyển sang middleware tiếp theo
 * @returns {Response} - Phản hồi lỗi đã được định dạng
 */

const createErrorResponse = (code, message, statusCode, detail = null) => {
  const error = new AppError(message, statusCode, code, detail);
  return { error, statusCode };
};

const errorHandler = (err, req, res, next) => {
  const requestId = generateErrorId();

  // Log lỗi chi tiết (có thể mở rộng để log ra file hoặc hệ thống log)
  const errLog = {
    requestId,
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: req.user ? req.user.id : null, // Nếu có thông tin user
    error: {
      name: err.name,
      message: err.message,
      code: err.errorCode || "INTERNAL_SERVER_ERROR",
      statusCode: err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      stack: err.stack,
    },
  };
  console.error(JSON.stringify(errLog, null, 2)); // Log lỗi dưới dạng JSON

  let processError = err;
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  if (err instanceof AppError) {
    // Nếu đã là AppError, không cần tạo lại
    processError = err;
    statusCode = err.statusCode;
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    // Xử lý lỗi JWT
    processError = createErrorResponse(
      "TOKEN_INVALID",
      "Token không hợp lệ hoặc đã hết hạn",
      HTTP_STATUS.UNAUTHORIZED,
    );
    statusCode = HTTP_STATUS.UNAUTHORIZED;
  } else if (err.name === "ValidationError") {
    // Xử lý lỗi validation từ các thư viện như Joi, Mongoose, v.v.
    const fieldErrors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    processError = createErrorResponse(
      "VALIDATION_ERROR",
      "Validation failed",
      HTTP_STATUS.BAD_REQUEST,
      { fieldErrors },
    );
    statusCode = HTTP_STATUS.BAD_REQUEST;
  } else if (err.name === "ER_DUP_ENTRY") {
    processError = createErrorResponse(
      "DUPLICATE_ENTRY",
      "Dữ liệu đã tồn tại",
      HTTP_STATUS.CONFLICT,
    );
    statusCode = HTTP_STATUS.CONFLICT;
  } else if (err.name?.startsWith("ER_")) {
    processError = createErrorResponse(
      "DATABASE_ERROR",
      "Lỗi cơ sở dữ liệu",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  } else if (err.name === "MulterError") {
    let message = "Lỗi khi tải lên file";
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Kích thước file vượt quá giới hạn cho phép";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      message = "Số lượng file vượt quá giới hạn cho phép";
    }

    processError = createErrorResponse(
      "FILE_UPLOAD_ERROR",
      message,
      HTTP_STATUS.BAD_REQUEST,
    );
    statusCode = HTTP_STATUS.BAD_REQUEST;
  } else {
    // Lỗi không xác định, tạo lỗi chung
    processError = createErrorResponse(
      "INTERNAL_SERVER_ERROR",
      "Đã xảy ra lỗi không xác định",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  }
  const errorResponse = formatErrorResponse(processError, req.path, requestId);
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found Handler
 * Đặt middleware này trước errorHandler
 */
const notFoundHandler = (req, res, next) => {
  const requestId = req.id || generateRequestId();
  const notFoundError = new AppError(
    `Không tìm thấy route: ${req.method} ${req.path}`,
    HTTP_STATUS.NOT_FOUND,
    "NOT_FOUND",
  );

  const errorResponse = formatErrorResponse(notFoundError, req.path, requestId);
  return res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse);
};

/**
 * Async Error Wrapper
 * Wrapper cho async route handlers để catch errors tự động
 *
 * Usage:
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await UserService.getAll();
 *   res.json({ success: true, data: users });
 * }));
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
