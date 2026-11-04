import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-NganHa-Client-Signature': 'nganha_sec_2026_shield_v1',
  },
});

api.interceptors.request.use((config) => {
  // Đính kèm chữ ký bảo vệ chống bot gọi trực tiếp API
  config.headers['X-NganHa-Client-Signature'] = 'nganha_sec_2026_shield_v1';
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorResponse = error.response?.data || {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền mạng.',
      },
    };
    return Promise.reject(errorResponse);
  }
);

export default api;

