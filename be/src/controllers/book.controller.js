const { getBooksService, getBookByURLService, getFavoriteBooksService, getTopSellingBooksService } = require("../services/book.service");
const { HTTP_STATUS }    = require("../constants");

const getBooksController = async (req, res, next) => {
    try {
        const { cursor, limit, sortBy } = req.query;

        const { books, nextCursor, hasNextPage } = await getBooksService({
            cursor,
            limit,
            sortBy,
        });

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: books,
            pagination: {
                nextCursor,
                hasNextPage,
                limit: parseInt(limit, 10) || 12,
            },
        });
    } catch (error) {
        next(error);
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const getBookByURLController = async (req, res, next) => {
    try {
        const { url } = req.params;
        const book = await getBookByURLService(url);
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: book,
        });
    } catch (error) {
        next(error);
    }
};

const getFavoriteBooksController = async (req, res, next) => {
    try {
        const books = await getFavoriteBooksService();
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: books,
        });
    } catch (error) {
        next(error);
    }
};

const getTopSellingBooksController = async (req, res, next) => {
    try {
        const { limit } = req.query;
        const books = await getTopSellingBooksService(parseInt(limit, 10) || 4);
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: books,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { getBooksController, getBookByURLController, getFavoriteBooksController, getTopSellingBooksController };
