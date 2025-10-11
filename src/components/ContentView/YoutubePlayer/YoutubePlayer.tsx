import  { useEffect, useRef } from 'react';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import 'videojs-youtube'; // 🔥 This is important!
import { Video } from '../media';

interface YouTubePlayerProps {
    video: Video;
}

const PadaiYouTubePlayer = ({ video }: YouTubePlayerProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playerRef = useRef<Player | null>(null);

    useEffect(() => {
        if (videoRef.current && !playerRef.current) {
            playerRef.current = videojs(videoRef.current, {
                techOrder: ['youtube'],
                controls: true,
                fluid: true,
                preload: 'auto',
                sources: [
                    {
                        src: video.url,
                        type: 'video/youtube',
                    },
                ],
                youtube: {
                    modestbranding: 1,
                    rel: 0,
                },
            });

            playerRef.current.ready(() => {
                console.log('YouTube player is ready');
            });
        }

        
    }, [video.url]);

    return (
        <div className="border border-gray-200 p-1">
            <div data-vjs-player style={{ height: '200px' }}>
                <video
                    ref={videoRef}
                    className="video-js vjs-default-skin"
                    playsInline
                />
            </div>
        </div>
    );
};

export default PadaiYouTubePlayer;
