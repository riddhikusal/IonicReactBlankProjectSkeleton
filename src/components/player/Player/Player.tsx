import { FC, useContext, useEffect, useRef } from "react";
import './Player.css';
import ReactPlayer from "";
import { api } from "../../shared/api";
import ENVIRONMENT from "../../environment";
import { AppContext } from "../../App.context";react-player
import { OnProgressProps } from "react-player/base";
import { GENERAL } from "../../shared/constants";

const Player: FC = () => {

  const appContext = useContext(AppContext);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (appContext?.track?.maximized) {
      setTimeout(() => {
        if (appContext?.track?.contentType === GENERAL.VIDEO) {
          const videoElm = (document.querySelector('.player-main>video') as HTMLVideoElement);
          if (videoElm) {
            videoElm.style.height = appContext?.orientation?.includes('landscape') ? `${window.innerHeight}px` : 'auto';
          }
        }
      }, 200);
    }
  }, [appContext?.orientation]);

  useEffect(() => {
    if (appContext?.track?.elapsed && playerRef.current && Math.floor(appContext?.track.elapsed) !== Math.floor(playerRef.current.getCurrentTime())) {
      playerRef.current.seekTo(appContext?.track.elapsed, 'seconds');
    }
  }, [appContext?.track?.elapsed]);

  const onReady = () => {
    if (appContext?.track) {
      appContext.track.ready = true;
      if (appContext?.track.start) {
        playerRef.current?.seekTo(appContext?.track.start, 'seconds');
      }
      appContext?.handleTrack(appContext?.track);
    }
  }

  const onPlay = () => {
    if (appContext?.track) {
      appContext.track.playing = true;
      appContext?.handleTrack(appContext?.track);
    }
  }

  const onProgress = (e: OnProgressProps) => {
    if (appContext?.track) {
      if (playerRef.current) {
        appContext.track.duration = playerRef.current.getDuration();
      }
      appContext.track.loaded = e.loaded;
      appContext.track.elapsed = e.playedSeconds ?? 0;
      appContext.track.remaining = appContext?.track.duration - e.playedSeconds;
      appContext.track.progress = e.played;
      appContext.handleTrack(appContext?.track);
      if (Math.round(e.playedSeconds) % 5 === 0) { // save appContext?.track every 5s
        saveState(Math.round(e.playedSeconds));
      }
    }
  };

  const onDuration = (duration: number) => {
    if (appContext?.track) {
      appContext.track.duration = duration;
      appContext?.handleTrack(appContext?.track);
    }
  }

  const onPause = () => {
    if (appContext?.track) {
      appContext.track.playing = false;
      appContext?.handleTrack(appContext?.track);
    }
  }

  const onBuffer = () => {
    if (appContext?.track) {
      appContext.track.seeking = true;
      appContext.handleTrack(appContext?.track);
    }
  }

  const onBufferEnd = () => {
    if (appContext?.track) {
      appContext.track.seeking = false;
      appContext.handleTrack(appContext?.track);
    }
  }

  const onEnded = () => {
    if (appContext?.track) {
      appContext.track.loaded = 1;
      appContext.track.elapsed = appContext.track.duration;
      appContext.track.remaining = 0;
      appContext.track.progress = 1;
      appContext.track.playing = false;
      appContext.handleTrack(appContext?.track);
      saveState(appContext?.track.type === 'content' ? appContext?.track.content.contentDuration : appContext?.track.episode.episodeDuration);
    }
  }

  const onError = () => { }

  const onEnablePIP = () => {
    if (appContext?.track) {
      appContext.track.isPiP = true;
      appContext.handleTrack(appContext?.track);
    }
  }

  const onDisablePIP = () => {
    if (appContext?.track) {
      appContext.track.isPiP = false;
      appContext.handleTrack(appContext?.track);
    }
  }

  const saveState = async (duration: number) => {
    if (appContext?.track) {
      api(`${ENVIRONMENT.MEDIA_URL}`, appContext?.token.data, true, 'POST', {
        contentId: appContext?.track.content.id,
        episodeId: appContext?.track.episode?.episodeId,
        durationPlayed: duration
      });
    }
  }

  return (
    <>
      {
        appContext?.track &&
        <ReactPlayer
          ref={playerRef}
          className={`player-main ${appContext?.track.contentType === GENERAL.AUDIO ? 'hidden' : ''}`}
          url={appContext?.track.url}
          playing={appContext?.track.playing}
          loop={appContext?.track.loop}
          controls={appContext?.track.controls}
          light={appContext?.track.light}
          volume={appContext?.track.volume}
          muted={appContext?.track.muted}
          playbackRate={appContext?.track.playbackRate}
          width={'100%'}
          height={'auto'}
          playsinline={appContext?.track.contentType === GENERAL.VIDEO}
          pip={appContext?.track.contentType === GENERAL.VIDEO}
          stopOnUnmount={false}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                onContextMenu: (e: Event) => e.preventDefault(),
              }
            }
          }}
          onReady={onReady}
          onPlay={onPlay}
          onProgress={onProgress}
          onDuration={onDuration}
          onPause={onPause}
          onBuffer={onBuffer}
          onBufferEnd={onBufferEnd}
          onEnded={onEnded}
          onError={onError}
          onEnablePIP={onEnablePIP}
          onDisablePIP={onDisablePIP}
        />
      }
    </>
  );
};

export default Player;