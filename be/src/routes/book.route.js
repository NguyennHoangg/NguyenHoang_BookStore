const express = require('express');
const router  = express.Router();
const { getBooksController, getBookByURLController, getFavoriteBooksController, getTopSellingBooksController, getNewBooksController } = require('../controllers/book.controller');

const RESERVED_BOOK_SLUGS = new Set(['favorites']);

// GET /api/books?limit=12&cursor=xxx&sortBy=price_asc
router.get('/', getBooksController);

// GET /api/books/favorites
router.get('/favorites', getFavoriteBooksController);

// GET /api/books/top-selling?limit=4
router.get('/top-selling', getTopSellingBooksController);

// GET /api/books/new-books
router.get('/new-books', getNewBooksController);

// GET /api/books/:url  ← phải đặt SAU các static routes
router.get('/:url', (req, res, next) => {
	if (RESERVED_BOOK_SLUGS.has(req.params.url)) {
		return next('route');
	}
	next();
}, getBookByURLController);

module.exports = router;
