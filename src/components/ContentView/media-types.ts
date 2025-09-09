// media-types.ts

export const VideoType = {
  MP4: 'video/mp4',
  WEBM: 'video/webm',
  OGG: 'video/ogg',
  HLS: 'application/x-mpegURL',
  DASH: 'application/dash+xml',
  UNKNOWN: 'application/octet-stream',
} as const;

export type VideoType = typeof VideoType[keyof typeof VideoType];
/**
 * Get the video MIME type from file extension
 * @param url - Video URL or file name
 * @returns VideoType enum
 */
export function getVideoMimeType(url: string): VideoType {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  const extension = pathname.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'mp4':
      return VideoType.MP4;
    case 'webm':
      return VideoType.WEBM;
    case 'ogg':
    case 'ogv':
      return VideoType.OGG;
    case 'm3u8':
      return VideoType.HLS;
    case 'mpd':
      return VideoType.DASH;
    default:
      return VideoType.UNKNOWN;
  }
}
