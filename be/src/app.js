const express = require('express');
const app = express();
const corsConfig = require('./config/cor.config');
const dbConfig = require('./config/database.config');

// Sử dụng cấu hình CORS
app.use(corsConfig);

// Kết nối đến cơ sở dữ liệu
dbConfig;

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

