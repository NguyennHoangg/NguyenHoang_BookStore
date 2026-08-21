import axios from 'axios';

// Lấy base URL từ môi trường hoặc dùng mặc định theo API_GUIDE.md
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Có thể tuỳ chỉnh timeout nếu muốn
  timeout: 10000, 
  // Quan trọng: Cho phép gửi/nhận HTTPOnly Cookie từ Backend
  withCredentials: true,
});

// Hàm helper để đọc cookie
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

// Interceptor cho Request: Tự động đính kèm Token từ Cookie
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ cookie
    const token = getCookie('access_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Xử lý lỗi chung (như 401 hết hạn token)
axiosClient.interceptors.response.use(
  (response) => {
    // Chỉ trả về data để các hàm gọi api ngắn gọn hơn
    return response.data;
  },
  async (error) => {
    // Xử lý logic như refresh token nếu nhận mã 401 ở đây
    if (error.response?.status === 401) {
      console.warn('Token hết hạn hoặc không hợp lệ');
      // Thêm logic refresh token ở đây nếu cần
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
