const cors = require('cors');

const corsConfig = cors({
    origin: ['http://localhost:5173', 'https://nguyen-hoang-book-store.vercel.app', 'https://nguyen-hoang-book-store-4ufu8ll8r-nguyen-hoang-s-projects.vercel.app/'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

module.exports = corsConfig;
