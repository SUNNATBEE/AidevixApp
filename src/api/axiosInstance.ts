import axios, { AxiosResponse } from 'axios';
import { storage } from '../utils/storage';
import { API_URL } from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const extractCookie = (setCookie: unknown, name: string): string | null => {
  if (!setCookie) return null;
  const list = Array.isArray(setCookie) ? setCookie : [String(setCookie)];
  for (const entry of list) {
    const match = entry.match(new RegExp(`${name}=([^;]+)`));
    if (match) return match[1];
  }
  return null;
};

const persistTokensFromResponse = async (response: AxiosResponse) => {
  const setCookie = (response.headers as any)?.['set-cookie'];
  const access = extractCookie(setCookie, 'aidevix_access');
  const refresh = extractCookie(setCookie, 'aidevix_refresh');
  if (access) await storage.setToken(access);
  if (refresh) await storage.setRefreshToken(refresh);
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const refresh = await storage.getRefreshToken();
    const cookieParts: string[] = [];
    if (token) cookieParts.push(`aidevix_access=${token}`);
    if (refresh) cookieParts.push(`aidevix_refresh=${refresh}`);
    if (cookieParts.length > 0) {
      (config.headers as any).Cookie = cookieParts.join('; ');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  async (response) => {
    await persistTokensFromResponse(response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const url: string = originalRequest?.url || '';
    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh-token');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthCall) {
      originalRequest._retry = true;
      try {
        const refreshToken = await storage.getRefreshToken();
        const refreshResp = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: refreshToken ? { Cookie: `aidevix_refresh=${refreshToken}` } : {},
          }
        );
        await persistTokensFromResponse(refreshResp);
        const newToken = await storage.getToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        await storage.clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
