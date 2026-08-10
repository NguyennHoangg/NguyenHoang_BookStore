const winston = require("winston");
const path = require("path");

// ─── Custom format ─────────────────────────────────────────────────────────
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }), // hiện stack trace của Error object
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
      : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

const colorizedFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  logFormat
);

// ─── Transports ────────────────────────────────────────────────────────────
const transports = [
  // Console: luôn hiện, có màu ở dev
  new winston.transports.Console({
    format:
      process.env.NODE_ENV === "production" ? logFormat : colorizedFormat,
  }),
];

// Production: ghi ra file
if (process.env.NODE_ENV === "production") {
  transports.push(
    // Chỉ ghi error
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, // tối đa 5MB mỗi file
      maxFiles: 5,              // giữ tối đa 5 file cũ
    }),
    // Ghi tất cả
    new winston.transports.File({
      filename: path.join("logs", "combined.log"),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    })
  );
}

// ─── Logger instance ───────────────────────────────────────────────────────
const logger = winston.createLogger({
  // dev: debug (hiện hết), production: warn (chỉ warn + error)
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  transports,
  // Không crash process khi logger gặp lỗi
  exitOnError: false,
});

module.exports = logger;
