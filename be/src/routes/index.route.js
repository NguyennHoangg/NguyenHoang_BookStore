const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const bookRoutes = require('./book.route');
const usersRoute = require('./users.route');

// Định nghĩa các route con
router.use('/auth',  authRoutes);
router.use('/books', bookRoutes);
router.use('/users', usersRoute);



module.exports = router;