// src/services/loginService.ts
import { App } from '@capacitor/app';
import { login, validateMobile } from '../api/loginApi';
import { saveAccessToken, saveRefreshToken } from '../utils/tokenStorage';

export const getMobileValidation = async (mobileno: string) => {
  const response = await validateMobile({mobileno});
  return (response.data);
};

export const validateLogin = async (mobileno: string, password: string) => {
  const loginResponse = await login({mobileno, password});

  
  // Immediately persist tokens so interceptor can pick them up
  if (loginResponse.data.accessToken && loginResponse.data.refreshToken) {
    await saveAccessToken(loginResponse.data.accessToken);
    await saveRefreshToken(loginResponse.data.refreshToken);
  }

  return (loginResponse.data);
};

export const validateOtp = async (mobileno: string, password: string) => {
  const otpResponse = await checkOtp({mobileno, password});

  
  // Immediately persist tokens so interceptor can pick them up
  if (otpResponse.data.accessToken && otpResponse.data.refreshToken) {
    await saveAccessToken(otpResponse.data.accessToken);
    await saveRefreshToken(otpResponse.data.refreshToken);
  }

  return (otpResponse.data);
};