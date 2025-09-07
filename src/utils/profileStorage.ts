// src/utils/profileStorage.ts
import { Preferences } from '@capacitor/preferences';
import { getPlatform } from '../utils/platform';

export type UserProfile = {
  name?: string;
  emailId?: string;
  board?: string;
  class?: string;
  langMedium?: string;
  langNative?: string;
  mobileNo?: string;
};

const KEY = 'padAI:user_profile';

// ---- platform check (same style as tokenStorage) ----
const isMobilePlatform = () => {
  const platformInfo = getPlatform();
  const platform = platformInfo.code;
  return platform === 'android' || platform === 'ios';
};

// ---- helpers for storage ----
const setItem = async (key: string, value: string) => {
  if (isMobilePlatform()) {
    await Preferences.set({ key, value });
  } else {
    localStorage.setItem(key, value);
  }
};

const getItem = async (key: string): Promise<string | null> => {
  if (isMobilePlatform()) {
    const { value } = await Preferences.get({ key });
    return value ?? null;
  } else {
    return localStorage.getItem(key);
  }
};

const removeItem = async (key: string) => {
  if (isMobilePlatform()) {
    await Preferences.remove({ key });
  } else {
    localStorage.removeItem(key);
  }
};

// ---- public API ----
export const saveUserProfile = async (partial: UserProfile): Promise<UserProfile> => {
  const prev = await getUserProfile();
  const merged: UserProfile = { ...prev, ...partial };

  await setItem(KEY, JSON.stringify(merged));
  return merged;
};

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const raw = await getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const {
      name, emailId, board, class: klass, langMedium, langNative, mobileNo,
    } = parsed as UserProfile;
    return {
      name,
      emailId,
      board,
      class: klass,
      langMedium,
      langNative,
      mobileNo,
    };
  } catch {
    return {};
  }
};

export const clearUserProfile = async (): Promise<void> => {
  await removeItem(KEY);
};

export const updateUserProfile = async (partial: UserProfile): Promise<UserProfile> => {
  return saveUserProfile(partial);
};
