const {
  getBooksByCursorPagination,
  MAP_CURSOR,
  getBookByURL,
  getBookFavorites,
  getTopSellingBooks,
  checkBookExists,
  checkCategoryExists,
  checkPublisherExists,
  createBook,
  createPublisher,
  createCategory,
} = require("../models/book.model");
const { createError } = require("../errors/AppError");
const { HTTP_STATUS } = require("../constants");
const { del, delPattern, get, getOrSet, set } = require("../redis/redisCache");
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;
const redisCache = require("../redis/redisCache");

//CACHING
const CACHE_KEY = {
  BOOK_LIST: (cursor, limit, sortBy) =>
    `book:list:${cursor || "starts"}:${limit}:${sortBy}`,
  BOOK_DETAIL: (url) =>
    `book:detail:${url}`,
  FAVORITES: `book:favorites`,
  TOP_SELLINGS: (limit) =>
    `book:top_selling:${limit}`,
};

//Thời gian tồn tại của cache
const TTL = {
  BOOKS_LIST: 60 * 5, // 5 phút — list thay đổi thường xuyên hơn
  BOOK_DETAIL: 60 * 10, // 10 phút — detail ít thay đổi hơn
  FAVORITES: 60 * 10, // 10 phút
  TOP_SELLING: 60 * 30, // 30 phút — top selling ít thay đổi nhất
};

/**
 * Lấy danh sách sách có cursor pagination
 *
 * @param {object} query - query params từ request
 */
const getBooksService = async ({ cursor, limit, sortBy }) => {
  // Validate limit
  const parsedLimit = parseInt(limit, 4) || DEFAULT_LIMIT;
  if (parsedLimit < 1 || parsedLimit > MAX_LIMIT) {
    throw createError({
      message: `limit phải từ 1 đến ${MAX_LIMIT}`,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: "INVALID_LIMIT",
    });
  }

  // Validate sortBy
  const validSortBy = sortBy && MAP_CURSOR[sortBy] ? sortBy : "default";

  //Gọi hàm getOrSet - để lấy cache hoặc gọi api
  const result = await redisCache.getOrSet(
    CACHE_KEY.BOOK_LIST(cursor, parsedLimit, validSortBy),
    async () => {
      // Gọi DB
      const books = await getBooksByCursorPagination({
        cursor,
        limit: parsedLimit,
        sortBy: validSortBy,
      });
      return books; // Bug fix: thiếu return
    },
    TTL.BOOKS_LIST, // Bug fix: truyền số thay vì object { ttl: ... }
  );

  return result;
};

const getBookByURLService = async (url) => {
  if (!url) {
    url = "/bon-mua-co-bay";
  }

  //Gọi hàm getOrSet để lấy cache hoặc gọi api
  const book = await redisCache.getOrSet(
    CACHE_KEY.BOOK_DETAIL(url),
    async () => {
      // Gọi DB
      const book = await getBookByURL(url);
      return book;
    },
    TTL.BOOK_DETAIL, // Bug fix: truyền số thay vì object { ttl: ... }
  );

  if (!book) {
    throw createError({
      message: "Không tìm thấy sách với URL đã cho",
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "BOOK_NOT_FOUND",
    });
  }
  return book;
};

// Lấy danh sách sách yêu thích
const getBookFavoritesService = async () => {
  //Gọi hàm getOrSet để lấy cache hoặc gọi api
  const books = await redisCache.getOrSet(
    CACHE_KEY.FAVORITES,
    async () => {
      // Gọi DB
      const books = await getBookFavorites();
      return books;
    },
    TTL.FAVORITES, // Bug fix: truyền số thay vì object { ttl: ... }
  );
  return books;
};

/**
 * Lấy danh sách sách yêu thích
 * @returns {Promise<Array>} Danh sách sách yêu thích
 * @throws {Error} Nếu không tìm thấy sách yêu thích
 */
const getFavoriteBooksService = async () => {
  //Gọi hàm getOrSet để lấy cache hoặc gọi api
  const books = await redisCache.getOrSet(
    CACHE_KEY.FAVORITES,
    async () => {
      // Gọi DB
      const books = await getBookFavorites();
      return books;
    },
    TTL.FAVORITES, // Bug fix: truyền số thay vì object { ttl: ... }
  );
  if (!books || books.length === 0) {
    throw createError({
      message: "Không tìm thấy sách yêu thích",
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "FAVORITE_BOOKS_NOT_FOUND",
    });
  }
  return books;
};

/**
 * Lấy danh sách sách bán chạy
 * @returns {Promise<Array>} Danh sách sách bán chạy
 * @throws {Error} Nếu không tìm thấy sách bán chạy
 */
const getTopSellingBooksService = async (limit = 4) => {
  //Gọi hàm getOrSet để lấy cache hoặc gọi api
  const books = await redisCache.getOrSet(
    CACHE_KEY.TOP_SELLINGS(limit),
    async () => {
      // Gọi DB
      const books = await getTopSellingBooks(limit);
      return books;
    },
    TTL.TOP_SELLING, // Bug fix: truyền số thay vì object { ttl: ... }
  );
  if (!books || books.length === 0) {
    throw createError({
      message: "Không tìm thấy sách bán chạy",
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: "TOP_SELLING_BOOKS_NOT_FOUND",
    });
  }
  return books;
};

/**
 * Tạo sách mới
 * @param {object} bookData - Dữ liệu sách
 * @returns {Promise<Object>} Sách vừa tạo
 * @throws {Error} Nếu sách đã tồn tại hoặc danh mục/nhà xuất bản không tồn tại
 */
const createBookService = async (bookData) => {
  try {
    // Kiểm tra xem sách đã tồn tại chưa
    const existingBook = await checkBookExists(bookData.bookid);

    if (existingBook) {
      throw createError({
        message: "Sách đã tồn tại",
        statusCode: HTTP_STATUS.CONFLICT,
        errorCode: "BOOK_ALREADY_EXISTS",
      });
    }

    // Kiểm tra xem danh mục và nhà xuất bản có tồn tại không
    const existingCategory = await checkCategoryExists(bookData.categoryid);
    if (!existingCategory) {
      throw createError({
        message: "Danh mục không tồn tại",
        statusCode: HTTP_STATUS.NOT_FOUND,
        errorCode: "CATEGORY_NOT_FOUND",
      });
    }

    // Kiểm tra xem nhà xuất bản có tồn tại không
    const existingPublisher = await checkPublisherExists(bookData.publisherid);
    if (!existingPublisher) {
      throw createError({
        message: "Nhà xuất bản không tồn tại",
        statusCode: HTTP_STATUS.NOT_FOUND,
        errorCode: "PUBLISHER_NOT_FOUND",
      });
    }

    // Tạo sách mới
    const newBook = await createBook(bookData);
    return newBook;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getBooksService,
  getBookByURLService,
  getBookFavoritesService,
  getFavoriteBooksService,
  getTopSellingBooksService,
  createBookService,
};
