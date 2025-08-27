// src/services/loginService.ts
import { App } from '@capacitor/app';
import { validateMobile } from '../api/loginApi';

export const getMobileValidation = async (mobileno: string) => {
  const response = await validateMobile({mobileno});
  return (response.data);
};
