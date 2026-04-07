const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Thay đổi thành URL của frontend
    credentials: true, // Cho phép gửi cookie từ frontend
    allowedHeaders: ['Content-Type', 'Authorization'], // Cho phép các header cần thiết
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Cho phép các phương thức HTTP cần thiết
}));
app.use(express.json());
app.use(cookieParser());

module.exports = app;