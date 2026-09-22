import axios from 'axios';

// Lấy base URL từ môi trường hoặc dùng mặc định theo API_GUIDE.md
const baseURL = import.meta.env.VITE_API_URL || 'https://nguyenhoang-bookstore.onrender.com';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
 
  timeout: 10000, 
  withCredentials: true,
});

// Hàm helper để đọc cookie
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

// Hàm helper để set cookie
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

// Hàm helper để xoá cookie
const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor cho Response: Xử lý lỗi chung (như 401 hết hạn token)
axiosClient.interceptors.response.use(
  (response) => {
    // Chỉ trả về data để các hàm gọi api ngắn gọn hơn
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Xử lý logic refresh token nếu nhận mã 401 và request chưa được retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi BE để lấy access token mới — BE tự đọc refreshToken từ HttpOnly cookie
        // Response shape: { success: true, token: { accessToken, expiresIn } }
        const response = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
        const newAccessToken: string = response.data?.token?.accessToken;

        if (!newAccessToken) throw new Error('Không nhận được access token mới');

        // Lưu token mới vào cookie và xử lý hàng đợi
        setCookie('access_token', newAccessToken, 7);
        isRefreshing = false;
        processQueue(null, newAccessToken);

        // Retry request gốc với token mới
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

        // Xoá token cũ và redirect về login
        deleteCookie('access_token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
