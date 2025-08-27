// src/api/loginApi.ts
import apiClient from './axiosInstance';

interface ValidateMobileRequest {
  mobileNo: string;
}

interface ValidateMobileResponse {
  // define based on backend response
  status?: string;
  message?: string;
  [key: string]: any;
}

export const validateMobile = async (data: ValidateMobileRequest) => {
  return apiClient.post<ValidateMobileResponse>(
    '/api/v1/Authentication/validate-mobile',
    data,
    { skipAuth: true } 
  );
};
