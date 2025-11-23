import { useEffect, useRef, useMemo, forwardRef, useImperativeHandle, useState } from 'react';
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
    controls: false, // Hide default controls - using custom controls instead
    autoplay,
    muted: autoplay,
    preload: 'auto',
    poster: isAudio ? video.thumbnail : undefined,
  }), [autoplay, isAudio, video.thumbnail]);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, options);
      
      // Create controls after player is ready - using a flag to prevent duplicates
      let controlsCreated = false;
      playerRef.current.ready(() => {
        const createControlsOnce = () => {
          if (!controlsCreated && playerRef.current) {
            controlsCreated = true;
            // Wait for video.js to fully initialize before adding controls
            setTimeout(() => {
              if (playerRef.current) {
                createCustomControls(playerRef.current);
              }
            }, 800);
          }
        };
        
        // Create controls when video data is loaded
        playerRef.current?.on('loadeddata', createControlsOnce);
        
        // Fallback - create after 2 seconds if loadeddata hasn't fired
        setTimeout(createControlsOnce, 2000);
      });
    }
    
    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        const playerEl = playerRef.current.el();
        if (playerEl) {
          const existingControls = playerEl.querySelector('.custom-video-controls');
          if (existingControls) {
            existingControls.remove();
          }
        }
      }
    };
  }, [options]);

  useEffect(() => {
    if (playerRef.current && video) {
      const type = getVideoMimeType(video.url);
      playerRef.current.src({
        src: video.url,
        type: type,
      });
    }
  }, [video, video.url]);

  useImperativeHandle(ref, () => playerRef.current!);

  return (
    <div className='bg-dark video-container'>
      <div className="ion-padding reel">
        <div data-vjs-player>
          <div className="w-full  aspect-video mx-auto">
            <video
              ref={videoRef}
              className="video-js vjs-default-skin"
              playsInline
              poster={''}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

// Separate function to create controls - attached to video player element
function createCustomControls(player: Player) {
  // Get the video player element
  const playerEl = player.el();
  if (!playerEl) return;
  
  // Remove existing controls if any
  const existingControls = playerEl.querySelector('.custom-video-controls');
  if (existingControls) {
    existingControls.remove();
  }

  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'custom-video-controls';
  controlsDiv.style.cssText = 'position: absolute; bottom: -4px; right: 5px; display: flex; align-items: center; gap: 1px; z-index: 10000; pointer-events: none;';

  // Backward button
  const backwardBtn = document.createElement('button');
//   backwardBtn.innerHTML = `
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
//       <path d="M11 18V6L4 12L11 18Z" fill="white"/>
//       <path d="M11 18V6L18 12L11 18Z" fill="white" opacity="0.6"/>
//     </svg>
//     <span style="font-size: 10px; line-height: 1; font-weight: 600; color: white;">10</span>
//   `;
backwardBtn.innerHTML = `
    <span style="font-size: 14px; line-height: 1; font-weight: 600; color: white;">-10s</span>
  `;
  backwardBtn.style.cssText = 'background: rgba(0, 0, 0, 0.6); border: 2px solid rgba(255, 255, 255, 0.8); border-radius: 50%; width: 40px; height: 40px; display: flex; flex-direction: row; align-items: center; justify-content: center; cursor: pointer; color: white; gap: 2px; padding: 0; outline: none; pointer-events: auto;';
  backwardBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentTime = player.currentTime() || 0;
    player.currentTime(Math.max(currentTime - 10, 0));
  };

  // Play/Pause button
  const playPauseBtn = document.createElement('button');
  updatePlayPauseButton(playPauseBtn, player.paused());
  playPauseBtn.style.cssText = 'background: rgba(0, 0, 0, 0.7); border: 3px solid rgba(255, 255, 255, 0.8); border-radius: 50%; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; padding: 0; outline: none; pointer-events: auto;';
  playPauseBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (player.paused()) {
      player.play();
    } else {
      player.pause();
    }
    setTimeout(() => updatePlayPauseButton(playPauseBtn, player.paused()), 50);
  };

  // Listen to play/pause to update button
  player.on('play', () => {
    updatePlayPauseButton(playPauseBtn, false);
  });
  player.on('pause', () => {
    updatePlayPauseButton(playPauseBtn, true);
  });

  // Forward button
  const forwardBtn = document.createElement('button');
//   forwardBtn.innerHTML = `
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
//       <path d="M13 6V18L6 12L13 6Z" fill="white" opacity="0.6"/>
//       <path d="M13 6V18L20 12L13 6Z" fill="white"/>
//     </svg>
//     <span style="font-size: 10px; line-height: 1; font-weight: 600; color: white;">10</span>
//   `;
forwardBtn.innerHTML = `
    <span style="font-size: 14px; line-height: 1; font-weight: 600; color: white;">+10s</span>
  `;
  forwardBtn.style.cssText = 'background: rgba(0, 0, 0, 0.6); border: 2px solid rgba(255, 255, 255, 0.8); border-radius: 50%; width: 40px; height: 40px; display: flex; flex-direction: row; align-items: center; justify-content: center; cursor: pointer; color: white; gap: 2px; padding: 0; outline: none; pointer-events: auto;';
  forwardBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentTime = player.currentTime() || 0;
    const duration = player.duration();
    if (duration !== undefined && !isNaN(duration)) {
      player.currentTime(Math.min(currentTime + 10, duration));
    }
  };

  controlsDiv.appendChild(backwardBtn);
  controlsDiv.appendChild(playPauseBtn);
  controlsDiv.appendChild(forwardBtn);
  playerEl.appendChild(controlsDiv);
}

function updatePlayPauseButton(btn: HTMLButtonElement, isPaused: boolean) {
  btn.innerHTML = isPaused
    ? '<svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z"/></svg>'
    : '<svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z"/></svg>';
}

PadAIVideoPlayer.displayName = "VideoPlayer";

export default PadAIVideoPlayer;
