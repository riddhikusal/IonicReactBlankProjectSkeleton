import axios, { AxiosRequestConfig } from 'axios';
import type { AxiosInstance } from 'axios'; 

// Modify this to retrieve token from localStorage, cookies, or any auth service
const getToken = (): string | null => {
  return localStorage.getItem('token'); // or from a context or secure storage
};

// Custom config extension to allow skipping JWT
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7171/api',
  timeout: 10000,
});

// Request Interceptor
apiClient.interceptors.request.use((config: CustomAxiosRequestConfig) => {
  const token = getToken();

  if (!config.skipAuth && token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export default apiClient;
