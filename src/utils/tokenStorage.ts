// src/utils/tokenStorage.ts
import { Preferences } from '@capacitor/preferences';
import { getPlatform } from '../utils/platform';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const isMobilePlatform = () => {
    const platformInfo = getPlatform();;
    const platform = platformInfo.code;
    return platform === 'android' || platform === 'ios';
};

export const saveToken = async (key: string, value: string) => {
    if (isMobilePlatform()) {
        await Preferences.set({ key, value });
    } else {
        localStorage.setItem(key, value);
    }
};

export const getToken = async (key: string): Promise<string | null> => {
    if (isMobilePlatform()) {
        const result = await Preferences.get({ key });
        return result.value;
    } else {
        return localStorage.getItem(key);
    }
};

export const removeToken = async (key: string) => {
    if (isMobilePlatform()) {
        await Preferences.remove({ key });
    } else {
        localStorage.removeItem(key);
    }
};

// Helper methods for access/refresh tokens
export const saveAccessToken = (token: string) => saveToken(ACCESS_TOKEN_KEY, token);
export const saveRefreshToken = (token: string) => saveToken(REFRESH_TOKEN_KEY, token);
export const getAccessToken = () => getToken(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => getToken(REFRESH_TOKEN_KEY);
export const clearTokens = async () => {
    await removeToken(ACCESS_TOKEN_KEY);
    await removeToken(REFRESH_TOKEN_KEY);
};
