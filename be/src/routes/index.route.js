const express = require('express');
const router = express.Router();
const userRoutes = require('./user.route');
const bookRoutes = require('./book.route');

// Định nghĩa các route con
router.use('/auth',  userRoutes);
router.use('/books', bookRoutes);




module.exports = router;