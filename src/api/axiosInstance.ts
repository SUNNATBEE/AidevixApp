import axios from 'axios';
import { storage } from '../utils/storage';
import { API_URL } from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await storage.getRefreshToken();
        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const { token } = response.data;

        await storage.setToken(token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        await storage.clearTokens();
        // Here we might need to trigger a logout in Redux or navigate to login
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      // Subscription required error - handle globally or pass to screen
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
