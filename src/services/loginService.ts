// src/services/loginService.ts
import { App } from '@capacitor/app';
import { forgotPassword, login, registerUser, RegisterUserRequest, validateMobile } from '../api/loginApi';
import { saveAccessToken, saveRefreshToken } from '../utils/tokenStorage';
import { saveUserProfile } from '../utils/profileStorage';

export const getMobileValidation = async (mobileno: string) => {
  const response = await validateMobile({mobileno});
  return (response.data);
};
export const getForgotPassword = async (mobileno: string) => {
  const response = await forgotPassword({mobileno});
  return (response.data);
};
export const validateLogin = async (mobileno: string, password: string) => {
  const loginResponse = await login({ mobileno, password });


  // // Immediately persist tokens so interceptor can pick them up
  // if (loginResponse.data.accessToken && loginResponse.data.refreshToken) {
  //   await saveAccessToken(loginResponse.data.accessToken);
  //   await saveRefreshToken(loginResponse.data.refreshToken);
  // }

  // return (loginResponse.data);

  const d = loginResponse.data;

  if (d?.accessToken) await saveAccessToken(d.accessToken);
  if (d?.refreshToken) await saveRefreshToken(d.refreshToken);

  // NEW: persist profile fields if present
  await saveUserProfile({
    name: d?.name,
    emailId: d?.emailId,
    board: d?.board,
    class: d?.class,
    langMedium: d?.langMedium,
    langNative: d?.langNative,
  });

  return d;
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

export const signupUser = async (payload: RegisterUserRequest) => {
  const signupResp = await registerUser(payload);
  const d = signupResp.data;

  if (d?.status && d?.status === 'UPDATED') {
    await saveUserProfile({
      name: payload?.name,
      emailId: payload?.emailId,
      board: payload?.board,
      class: payload?.class,
      langMedium: payload?.langMedium,
      langNative: payload?.langNative,
    });
  }
  return d;

};