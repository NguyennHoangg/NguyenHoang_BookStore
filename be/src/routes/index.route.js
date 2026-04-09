const express = require('express');
const router = express.Router();
const userRoutes = require('./user.route');

// Định nghĩa các route con
router.use('/auth', userRoutes);




module.exports = router;