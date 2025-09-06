// src/api/loginApi.ts
import apiClient from './axiosInstance';

// Validate Mobile API <start>

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

// Validate Mobile API <end>


// login API <start>

export interface LoginRequest {
  mobileNo: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  status: string;
  msg: string;
}

export const login = async (data: LoginRequest) => {
  return apiClient.post<LoginResponse>(
    '/api/v1/Authentication/login',
    data,
    { skipAuth: true } 
  );
};

export const checkOtp = async (data: LoginRequest) => {
  return apiClient.post<LoginResponse>(
    '/api/v1/Authentication/validate-otp',
    data,
    { skipAuth: true } 
  );
};

// login API <end>