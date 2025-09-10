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



export interface ForgotPasswordRequest {
  mobileNo: string;
}

export interface ForgotPasswordResponse {
  status?: string; // e.g. "PASSWORDSENT"
  msg?: string;    // e.g. "Password Sent"
}

export const forgotPassword = async (data: ForgotPasswordRequest) => {
  return apiClient.post<ForgotPasswordResponse>(
    '/api/v1/Authentication/forgot-password',
    data,
    { skipAuth: true }
  );
};


// login API <end>

// Signup Form APIs <start>
export interface Language {
  code: string;
  name: string;
  languageText: string;
  firstChar: string;
}

export interface GetLanguagesResponse {
  languages: Language[];
}

export const getLanguages = async () => {
  return apiClient.post<GetLanguagesResponse>(
    '/api/Content/getLanguages',
    {},
    { skipAuth: true }   // no token needed
  );
};


export interface RegisterUserRequest {
  name: string;
  mobile: string;
  emailId?: string;
  board: string;
  class: string;
  langMedium: string;
  langNative: string;
}

export interface RegisterUserResponse {
  status?: string;
  msg?: string;
  [key: string]: any;
}

export const registerUser = async (data: RegisterUserRequest) => {
  return apiClient.post<RegisterUserResponse>(
    '/api/v1/Authentication/register-user',
    data
  );
};




// Signup Form APIs <end>