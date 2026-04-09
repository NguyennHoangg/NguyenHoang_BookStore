const express = require('express');
const app = express();
const corsConfig = require('./config/cor.config');
const dbConfig = require('./config/database.config');
const errorHandler = require('./middlewares/errorrHandler');
const router = require('./routes/index.route'); 

// Middleware để phân tích JSON
app.use(express.json());

// Định nghĩa các route ở đây
app.use('/api', router);

// Middleware xử lý lỗi
app.use(errorHandler.errorHandler);
// Sử dụng cấu hình CORS
app.use(corsConfig);

// Kết nối đến cơ sở dữ liệu
dbConfig;


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

