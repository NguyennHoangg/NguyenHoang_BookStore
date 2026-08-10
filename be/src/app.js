const express = require('express');
const app = express();
const corsConfig = require('./config/cor.config');
const dbConfig = require('./config/database.config');
const errorHandler = require('./middlewares/errorrHandler');
const router = require('./routes/index.route');
const redis = require('./config/redis');
const cookieParser = require('cookie-parser');

// Sử dụng cấu hình CORS (phải đặt trước các route)
app.use(corsConfig);

// Middleware để phân tích JSON
app.use(express.json());

// Middleware đọc cookie (cần cho refresh token)
app.use(cookieParser());

// Định nghĩa các route ở đây
app.use('/api', router);

// Middleware xử lý lỗi
app.use(errorHandler.errorHandler);


// Kết nối đến cơ sở dữ liệu
dbConfig;

redis.init();


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

