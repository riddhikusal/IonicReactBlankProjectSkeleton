import { useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.min.css';
import type { VideoPlayerProps } from '../media';
import { getVideoMimeType } from '../media-types';
import './VideoPlayer.css';

const PadAIVideoPlayer = forwardRef<Player | null, VideoPlayerProps>(({ video, autoplay = false }, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  const isAudio = useMemo(() => {
    if (video.contentType === 'audio') {
      return true;
    }
    return false;
  }, [video.contentType]);

  const options = useMemo(() => ({
    controls: true,
    autoplay,
    muted: autoplay, // <-- Muted when autoplaying to bypass restriction
    preload: 'auto',
    poster: isAudio ? video.thumbnail : undefined,
  }), [autoplay, isAudio, video.thumbnail]);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, options);
    }

    // Cleanup on unmount

  }, [options]);

  useEffect(() => {
    if (playerRef.current && video) {
      const type = getVideoMimeType(video.url);
      playerRef.current.src({
        src: video.url,
        type: type,
      });


    }
  }, [video,video.url]);

  useImperativeHandle(ref, () => playerRef.current!);

  return (
    <div className='bg-dark video-container'>
      <div className="ion-padding reel">
        {/* Video container with required class and data attribute */}
        <div data-vjs-player>
          <div className="w-full  aspect-video mx-auto">
            <video
              ref={videoRef}
              className="video-js vjs-default-skin"
              playsInline
              poster={''} // fallback poster
            />
          </div>
        </div>
      </div>
      {/* <p className='pt-4'>{video.title}</p> */}

      {/* <h2 className='font-semibold'><span className='mt-4'> Related Videos</span></h2>
      <ul>
        {video?.relatedVideos?.map((video) => (
          <li key={video.id} className='mb-4 relative
          '>
            <Image className='w-full h-auto' src={video.thumbnail} alt={video.title} width={390} height={390} />
            <h3 className='font-semibold'>{video.title}</h3>
            <p>{video.description}</p>
            <button className='absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2' onClick={() => handleVideoSelect(video)}><Image alt='play icon' src={'/assets/svg/play-icon.svg'} width={40} height={40} /></button>
          </li>
        ))}
      </ul> */}
    </div>
  );
});
PadAIVideoPlayer.displayName = "VideoPlayer";

export default PadAIVideoPlayer;
