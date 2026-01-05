import React, { useRef, useState, useEffect } from "react";
import videojs from "video.js";
import 'video.js/dist/video-js.min.css';
import 'video.js/dist/video-js.min.css';


export interface NewPadAIVideoPlayerProps {
  videoUrl: string;
}

 const NewPadAIVideoPlayer = ({videoUrl}:NewPadAIVideoPlayerProps)=> {
  const videoRef = useRef<any>(null);
  const playerRef = useRef<any>(null);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize player once - this will run on mount and after refresh
  useEffect(() => {
    if (!videoUrl) return; // Don't initialize if no URL
    
    let retryCount = 0;
    const maxRetries = 50; // Maximum 5 seconds (50 * 100ms)
    
    // Wait a bit to ensure videoRef is attached to DOM
    const initPlayer = () => {
      retryCount++;
      
      if (!videoRef.current) {
        if (retryCount < maxRetries) {
          setTimeout(initPlayer, 100);
        } else {
          console.error('Video element ref not available after max retries');
        }
        return;
      }

      // Check if element is actually in the DOM
      // Also check if parent elements exist (more reliable check)
      const isInDOM = videoRef.current.isConnected || 
                      document.body.contains(videoRef.current) ||
                      videoRef.current.offsetParent !== null;
      
      if (!isInDOM) {
        if (retryCount < maxRetries) {
          // Use requestAnimationFrame for better timing
          requestAnimationFrame(() => {
            setTimeout(initPlayer, 50);
          });
        } else {
          console.error('Video element not in DOM after max retries');
        }
        return;
      }

      // Check if player already exists and is not disposed
      if (playerRef.current && !playerRef.current.isDisposed()) {
        return;
      }

      // Dispose existing player if it exists but is disposed
      if (playerRef.current && playerRef.current.isDisposed()) {
        playerRef.current = null;
      }

      // Get container dimensions
      const container = videoRef.current.parentElement?.parentElement;
      const width = container?.offsetWidth || container?.clientWidth || 800;
      const height = container?.offsetHeight || container?.clientHeight || 400;

      console.log('Initializing player with dimensions:', width, height);

      const options = {
        controls: false,
        fluid: false,
        responsive: false,
        autoplay: false,
        preload: "auto",
        playsinline: true,
        width: width,
        height: height,
      };

      try {
        const player: any = videojs(videoRef.current, options);
        playerRef.current = player;

        player.ready(() => {
          console.log('VideoJS player is ready');
          
          // Get the actual video element from player
          const videoEl = player.el().querySelector('video');
          if (videoEl) {
            // Force video element to be visible and have proper dimensions
            videoEl.style.setProperty('display', 'block', 'important');
            videoEl.style.setProperty('visibility', 'visible', 'important');
            videoEl.style.setProperty('opacity', '1', 'important');
            videoEl.style.setProperty('width', '100%', 'important');
            videoEl.style.setProperty('height', '100%', 'important');
            videoEl.style.setProperty('min-height', '400px', 'important');
            videoEl.style.setProperty('object-fit', 'contain', 'important');
            videoEl.style.setProperty('position', 'relative', 'important');
            videoEl.style.setProperty('z-index', '1', 'important');
            console.log('Video element styled. Dimensions:', videoEl.offsetWidth, videoEl.offsetHeight);
          }
          
          // Ensure player container has proper dimensions
          const playerEl = player.el();
          if (playerEl) {
            playerEl.style.setProperty('width', '100%', 'important');
            playerEl.style.setProperty('height', '100%', 'important');
            playerEl.style.setProperty('min-height', '400px', 'important');
            playerEl.style.setProperty('display', 'block', 'important');
          }
          
          // Set initial source if available
          if (videoUrl) {
            player.src({
              src: videoUrl,
              type: "video/mp4"
            });
          }
        });

        player.on("loadedmetadata", () => {
          console.log('Video metadata loaded');
          setDuration(player.duration());
        });
        player.on("timeupdate", () => setProgress(player.currentTime()));
        player.on("progress", () => {
          if (player.buffered().length > 0) {
            setBuffered(player.buffered().end(player.buffered().length - 1));
          }
        });
        player.on("play", () => {
          setPlaying(true);
          // Auto-hide controls after 4.5 seconds when video starts playing
          if (autoHideTimeoutRef.current) {
            clearTimeout(autoHideTimeoutRef.current);
          }
          autoHideTimeoutRef.current = setTimeout(() => {
            setHover(false);
            autoHideTimeoutRef.current = null;
          }, 1000); // 4.5 seconds
        });
        player.on("pause", () => {
          setPlaying(false);
          // Clear auto-hide timeout when paused and keep controls visible
          if (autoHideTimeoutRef.current) {
            clearTimeout(autoHideTimeoutRef.current);
            autoHideTimeoutRef.current = null;
          }
          // Keep controls visible when paused
          setHover(true);
        });
        player.on("error", (e: any) => {
          console.error('VideoJS error:', e);
        });
      } catch (error) {
        console.error('Error initializing VideoJS player:', error);
      }
    };

    // Start initialization after a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initPlayer();
    }, 50);

    // Resize listener for orientation change
    const handleResize = () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        const container = videoRef.current?.parentElement?.parentElement;
        if (container) {
          const width = container.offsetWidth || container.clientWidth;
          const height = container.offsetHeight || container.clientHeight;
          if (width && height) {
            playerRef.current.width(width);
            playerRef.current.height(height);
          }
        }
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
        autoHideTimeoutRef.current = null;
      }
      // Only dispose on unmount, not on re-render
      if (playerRef.current && !playerRef.current.isDisposed()) {
        try {
          playerRef.current.dispose();
        } catch (error) {
          console.error('Error disposing player:', error);
        }
      }
      playerRef.current = null;
      window.removeEventListener("resize", handleResize);
    };
  }, [videoUrl]); // Re-run when videoUrl changes

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
        autoHideTimeoutRef.current = null;
      }
    };
  }, []);

  // Update video source when URL changes
  useEffect(() => {
    if (playerRef.current && videoUrl && !playerRef.current.isDisposed()) {
      console.log('Updating video source to:', videoUrl);
      try {
        playerRef.current.src({
          src: videoUrl,
          type: "video/mp4"
        });
      } catch (error) {
        console.error('Error updating video source:', error);
      }
    }
  }, [videoUrl]);

  const handlePlayPause = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!playerRef.current || playerRef.current.isDisposed()) return;
    
    // Use a small delay to prevent rapid double-clicks
    const currentState = playerRef.current.paused();
    if (currentState) {
      playerRef.current.play().catch((error: any) => {
        console.error('Error playing video:', error);
      });
    } else {
      playerRef.current.pause();
    }
  };

  const handleSkip = (seconds: number) => {
    if (!playerRef.current || playerRef.current.isDisposed()) return;
    const newTime = Math.min(Math.max(playerRef.current.currentTime() + seconds, 0), duration);
    playerRef.current.currentTime(newTime);
  };

  const handleFullscreen = () => {
    if (!playerRef.current || playerRef.current.isDisposed()) return;
    if (playerRef.current.isFullscreen()) {
      playerRef.current.exitFullscreen();
    } else {
      playerRef.current.requestFullscreen();
    }
  };

  const handleSeek = (e: any) => {
    if (!playerRef.current || playerRef.current.isDisposed()) return;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    playerRef.current.currentTime(percent * duration);
  };

  const handleSpeedChange = (s: number) => {
    if (!playerRef.current || playerRef.current.isDisposed()) return;
    playerRef.current.playbackRate(s);
    setSpeed(s);
    setShowSpeedMenu(false);
  };

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!videoUrl) {
    return (
      <div style={{ 
        width: "100%", 
        height: "100%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: "#fff",
        backgroundColor: "#000"
      }}>
        No video URL provided
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
      onMouseEnter={() => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        setHover(true);
      }}
      onMouseLeave={() => {
        // If playing, controls will auto-hide via play event handler (after 4.5 seconds)
        if (playing) {
          return;
        }
        // When paused, keep controls visible - don't auto-hide
        // User can manually hide by moving mouse away for a longer time if needed
        // But by default, keep visible when paused
      }}
      onMouseDown={() => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        setHover(true);
      }}
      onTouchStart={() => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        setHover(true);
      }}
    >
      <div 
        data-vjs-player 
        onClick={(e: React.MouseEvent) => {
          // Only handle click on video area if not clicking on controls
          // Check if click target is the video container itself, not a control
          const target = e.target as HTMLElement;
          const isControlClick = target.closest('[style*="z-index: 1000"], [style*="z-index: 1001"]');
          if (!isControlClick && !hover) {
            handlePlayPause(e);
          }
        }}
        onTouchEnd={(e: React.TouchEvent) => {
          // Handle touch on video area if not touching controls
          const target = e.target as HTMLElement;
          const isControlClick = target.closest('[style*="z-index: 1000"], [style*="z-index: 1001"]');
          if (!isControlClick && !hover) {
            handlePlayPause(e);
          }
        }}
        style={{ 
          width: "100%", 
          height: "100%", 
          position: "relative",
          minHeight: "400px",
          pointerEvents: "auto"
        }}
      >
        <video
          ref={videoRef}
          className="video-js vjs-default-skin vjs-big-play-centered"
          playsInline
          data-setup="{}"
          style={{ 
            width: "100%", 
            height: "100%",
            minHeight: "400px",
            backgroundColor: "#000",
            display: "block",
            visibility: "visible",
            opacity: 1,
            position: "relative",
            zIndex: 1
          }}
        />
      </div>

      {hover && (
        <>
          {/* Central Play/Pause with skip buttons close by */}
          <div
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
              setHover(true);
            }}
            onMouseLeave={() => {
              // Don't hide immediately when leaving controls area
              // Let the auto-hide or main container handle it
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setHover(true);
            }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              gap: "10vw", // responsive distance between skip buttons
              zIndex: 1000,
              pointerEvents: "auto"
            }}
          >
            <CircularArrowButton onClick={() => handleSkip(-10)} label="10s" direction="left" size={45} />
            <CircularButton
              onClick={(e: React.MouseEvent | React.TouchEvent) => handlePlayPause(e)}
              label={playing ? "❚❚" : "▶️"}
              size={90} // bigger button
              color="#fff" // deep white
            />
            <CircularArrowButton onClick={() => handleSkip(10)} label="10s" direction="right" size={45} />
          </div>

          {/* Bottom seek bar */}
          <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onMouseDown={() => setHover(true)}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "40px",
              background: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              padding: "0 10px",
              boxSizing: "border-box",
              gap: "10px",
              zIndex: 1000,
              pointerEvents: "auto"
            }}
          >
            <span style={{ color: "#fff", fontSize: "14px" }}>{formatTime(progress)}</span>

            <div
              onClick={(e) => {
                e.stopPropagation();
                handleSeek(e);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleSeek(e);
              }}
              style={{
                flex: 1,
                height: "6px",
                background: "#555",
                borderRadius: "3px",
                position: "relative",
                cursor: "pointer",
                pointerEvents: "auto",
                zIndex: 1001
              }}
            >
              {/* Buffered */}
              <div
                style={{
                  width: `${(buffered / duration) * 100}%`,
                  height: "100%",
                  background: "#999",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  borderRadius: "3px",
                }}
              />
              {/* Played */}
              <div
                style={{
                  width: `${(progress / duration) * 100}%`,
                  height: "100%",
                  background: "#f00",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  borderRadius: "3px",
                }}
              />
            </div>

            <span style={{ color: "#fff", fontSize: "14px" }}>{formatTime(duration)}</span>

            {/* Speed menu */}
            <div style={{ position: "relative" }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeedMenu(!showSpeedMenu);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setShowSpeedMenu(!showSpeedMenu);
                }}
                style={{...buttonStyle, pointerEvents: "auto", zIndex: 1001, position: "relative"}}
              >
                {speed}x ⚙️
              </button>
              {showSpeedMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    bottom: "40px",
                    right: 0,
                    background: "rgba(0,0,0,0.8)",
                    borderRadius: "5px",
                    padding: "5px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    pointerEvents: "auto",
                    zIndex: 1002
                  }}
                >
                  {[0.5, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeedChange(s);
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        handleSpeedChange(s);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        cursor: "pointer",
                        pointerEvents: "auto",
                        zIndex: 1002
                      }}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleFullscreen();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleFullscreen();
              }}
              style={{...buttonStyle, pointerEvents: "auto", zIndex: 1001, position: "relative"}}
            >
              ⛶
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Play/Pause circular button
function CircularButton({ onClick, label, size = 50, color = "#fff" }: any) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick(e);
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick(e);
      }}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        fontSize: `${size * 0.5}px`, // icon size proportional
        userSelect: "none",
        pointerEvents: "auto",
        zIndex: 1001,
        position: "relative"
      }}
    >
      <span style={{ color: "#000" }}>{label}</span>
    </div>
  );
}

// Circular skip buttons with BIG outer ring and WHITE arrow + text
function CircularArrowButton({
  onClick,
  label = "10s",
  direction = "right",
  size = 110,
}: any) {
  const rotation = direction === "left" ? "-180deg" : "0deg";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        userSelect: "none",
        pointerEvents: "auto",
        zIndex: 1001
      }}
    >
      {/* OUTER ROTATING ARROW RING */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: "3px solid white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `rotate(${rotation})`,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "-14px",
            fontSize: size * 0.28,
            color: "#fff",
          }}
        >
          ⟳
        </span>
      </div>

      {/* CENTER TEXT */}
      <span
        style={{
          color: "#fff",
          fontSize: size * 0.3,
          fontWeight: 700,
          zIndex: 2,
        }}
      >
        {label}
      </span>
    </div>
  );
}



// Bottom control buttons style
const buttonStyle = {
  background: "rgba(0,0,0,0.6)",
  border: "none",
  color: "#fff",
  fontSize: "16px",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer",
};


export default NewPadAIVideoPlayer;