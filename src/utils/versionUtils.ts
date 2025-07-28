// src/utils/versionUtils.ts

export interface VersionCheckResult {
  showPopup: boolean;
  isObsolete: boolean;
  message: string;
}

export const parseVersionResponse = (data: any): VersionCheckResult => {
  const newVersionAvailable = data?.newVrAvailableYN === 'Y';
  const obsolete = data?.obsoleteYN === 'Y';
  const message = data?.vrMsg || '';

  return {
    showPopup: newVersionAvailable,
    isObsolete: obsolete,
    message,
  };
};
