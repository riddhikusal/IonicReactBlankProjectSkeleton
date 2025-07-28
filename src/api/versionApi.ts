import apiClient from './axiosInstance';

export const checkVersion = async (platform: string, version: string) => {
  return apiClient.get('/AppVersion', {
    params: { 
      platfom: platform,  
      vr: version         
    },
    skipAuth: true,
  });
};
