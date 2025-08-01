// src/services/getVersionService.ts
import { App } from '@capacitor/app';
import { checkVersion } from '../api/versionApi';
import { parseVersionResponse } from '../utils/versionUtils';
import { getPlatform } from '../utils/platform';

export const getPlatformVersionStatus = async () => {
  const platformInfo = getPlatform();
  const platform = platformInfo.code;
  let version = '1';

  if (platform == 'android' || platform == 'ios') {
    const info = await App.getInfo();
    version = info.version;
  }
  ////TODO: Remove hardcoded values
  // For testing purposes, you can replace the below with:
  //const response = await checkVersion(platform, version);
  const response = await checkVersion('android', '1');  ////TODO: Remove hardcoded values
  return parseVersionResponse(response.data);
};
