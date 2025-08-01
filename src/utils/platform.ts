// src/utils/platform.ts
import { isPlatform } from '@ionic/react';

export type PlatformCode = 'android' | 'ios' | 'pwa' | 'mobileweb' | 'desktop' | 'unknown';
export interface PlatformInfo { code: PlatformCode; name: string; }

export const getPlatform = (): PlatformInfo => {
  if (isPlatform('android')) return { code: 'android', name: 'Android App' };
  if (isPlatform('ios')) return { code: 'ios', name: 'iOS App' };
  if (isPlatform('pwa')) return { code: 'pwa', name: 'PWA (Progressive Web App)' };
  if (isPlatform('mobileweb')) return { code: 'mobileweb', name: 'Mobile Browser' };
  if (isPlatform('desktop')) return { code: 'desktop', name: 'Desktop Browser' };
  return { code: 'unknown', name: 'Unknown Platform' };
};