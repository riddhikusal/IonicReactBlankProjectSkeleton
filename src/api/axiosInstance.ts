
// src/api/axiosInstance.ts
import axios, { AxiosRequestConfig } from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import { getAccessToken, getRefreshToken, saveAccessToken, clearTokens } from '../utils/tokenStorage';

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7171/api',
  timeout: 10000,
});

//Request Interceptor
apiClient.interceptors.request.use(async (config: CustomAxiosRequestConfig) => {
  if (!config.skipAuth) {
    const token = await getAccessToken();
    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }
  }
  return config;
});

//Response Interceptor (401 + refresh)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipAuth) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers!['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        await saveAccessToken(newAccessToken);

        processQueue(null, newAccessToken);
        originalRequest.headers!['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await clearTokens();
        window.location.href = '/login'; // Redirect on failure
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
