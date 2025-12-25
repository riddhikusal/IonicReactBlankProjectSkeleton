import { FC, useContext, useEffect, useRef, useState } from "react";
import './PlayerView.css';
import {
  IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonProgressBar, IonSelect, IonSelectOption, IonSpinner, IonToggle, IonToolbar
} from "@ionic/react";
import ReactSlider from 'react-slider';
import {
  albumsOutline, chevronDown, closeOutline, contractOutline, expandOutline, pause, play, playSkipBackOutline, playSkipForwardOutline, refreshOutline, settingsOutline,
  speedometerOutline, volumeHighOutline, volumeMuteOutline
} from "ionicons/icons";
import { formatTime } from "../../shared/date";
import Marquee from "../Marquee/Marquee";
import { AppContext } from "../../App.context";
import Player from "../Player/Player";
import { GENERAL } from "../../shared/constants";
import Ellipsis from "../Ellipsis/Ellipsis";
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from "@capacitor/core";

const PlayerView: FC = () => {

  const appContext = useContext(AppContext);
  const playerViewRef = useRef<HTMLDivElement>(null);
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const playerSettingsModalRef = useRef<HTMLIonModalElement>(null);
  const playbackRates = [0.25, 0.5, 1, 1.25, 1.5, 2];

  const [navTabBarHeight, setNavTabBarHeight] = useState(0);
  const [playerViewHeight, setPlayerViewHeight] = useState(0);
  const [isPlayerControlsActive, setIsPlayerControlsActive] = useState(false);
  const [isPlayerControlsActiveTimer, setIsPlayerControlsActiveTimer] = useState<any>(null);

  useEffect(() => {
    setNavTabBarHeight(!appContext?.user ? 0 : ((document.querySelector('#app-tab-bar') as HTMLElement)?.offsetHeight ?? 0));
  }, [appContext?.user]);

  useEffect(() => {
    if (appContext?.outletLeft && appContext?.track?.maximized) {
      appContext.track.maximized = false;
      appContext?.handleTrack(appContext?.track);
    }
  }, [appContext?.outletLeft]);

  useEffect(() => {
    if (appContext?.backButtonTriggered && appContext?.track?.maximized) {
      appContext.track.maximized = false;
      appContext?.handleTrack(appContext?.track);
    }
  }, [appContext?.backButtonTriggered]);

  useEffect(() => {
    if (!appContext?.track?.maximized) {
      setTimeout(() => {
        if (playerViewRef?.current) {
          setPlayerViewHeight(playerViewRef?.current?.clientHeight);
          adjustRouteIonPages(playerViewRef?.current?.clientHeight);
        }
      }, 200);
    }
  }, [appContext?.orientation]);

  useEffect(() => {
    if (!appContext?.track?.maximized) {
      setTimeout(() => {
        if (playerViewRef?.current) {
          setPlayerViewHeight(playerViewRef?.current?.clientHeight);
          adjustRouteIonPages(playerViewRef?.current?.clientHeight);
        }
      }, 500);
    }
    else {
      adjustRouteIonPages(0);
    }
  }, [appContext?.track?.maximized]);

  useEffect(() => {
    if (appContext?.track?.seeking) {
      showPlayerControlsAndStartTimer(false);
    }
    else {
      showPlayerControlsAndStartTimer(true);
    }
  }, [appContext?.track?.seeking]);

  useEffect(() => {
    if (appContext?.track?.loaded && !appContext?.track?.seeking) {
      if (!appContext?.track?.playing) {
        showPlayerControlsAndStartTimer(false);
      }
      else {
        showPlayerControlsAndStartTimer(true);
      }
    }
  }, [appContext?.track?.playing]);

  const adjustRouteIonPages = (val: number) => {
    const pages = document.querySelectorAll('.app-router-outlet > .ion-page');
    pages?.forEach(p => {
      (p as HTMLElement).style.paddingBottom = `${val.toString()}px`;
    });
  }

  const onPlayPause = () => {
    if (appContext?.track) {
      appContext.track.playing = !appContext?.track.playing;
      appContext.handleTrack(appContext?.track);
    }
  }

  const onSeek = (fraction: number) => {
    if (appContext?.track) {
      appContext.track.elapsed = appContext?.track.duration * fraction;
      appContext.track.remaining = appContext?.track.duration - appContext?.track.elapsed;
      appContext.track.progress = fraction;
      appContext.handleTrack(appContext?.track);
    }
  }

  const onRewind = () => {
    if (appContext?.track) {
      appContext.track.elapsed = (appContext?.track.elapsed - 10) > 0 ? (appContext?.track.elapsed - 10) : 0;
      appContext.track.remaining = appContext?.track.duration - appContext?.track.elapsed;
      appContext.track.progress = appContext?.track.elapsed / appContext?.track.duration;
      appContext.handleTrack(appContext?.track);
    }
  };

  const onForward = () => {
    if (appContext?.track) {
      appContext.track.elapsed = (appContext?.track.elapsed + 10) < appContext?.track.duration ? (appContext?.track.elapsed + 10) : appContext?.track.duration;
      appContext.track.remaining = appContext?.track.duration - appContext?.track.elapsed;
      appContext.track.progress = appContext?.track.elapsed / appContext?.track.duration;
      appContext.handleTrack(appContext?.track);
    }
  };

  const onToggleMute = () => {
    if (appContext?.track) {
      appContext.track.muted = !appContext.track.muted;
      appContext.handleTrack(appContext?.track);
    }
  }

  const onEnterFullScreen = () => {
    if (appContext?.track) {
      ScreenOrientation.lock({ orientation: 'landscape' }).catch(e => { });
    }
  };

  const onExitFullScreen = () => {
    if (appContext?.track) {
      ScreenOrientation.lock({ orientation: 'portrait' }).catch(e => { });
    }
  };

  const onMinimize = () => {
    if (appContext?.track) {
      appContext.track.maximized = false;
      appContext.handleTrack(appContext?.track);
    }
  }

  const onMaximize = () => {
    if (appContext?.track) {
      appContext.track.maximized = true;
      appContext.handleTrack(appContext.track);
    }
  }

  const onCancel = () => {
    adjustRouteIonPages(0);
    appContext?.handleTrack();
  }

  const onEpisodeChange = (count: number) => {
    if (appContext?.track) {
      const newEpisode = appContext?.track.content.episodes[parseInt(appContext?.track.episode.episodeNumber) + count - 1];

      appContext.track.url = newEpisode.episodePlayUrl;
      appContext.track.episode = newEpisode;
      appContext.track.elapsed = 0;
      appContext.track.remaining = 0;
      appContext.track.progress = 0;
      appContext.handleTrack(appContext?.track);
    }
  }

  const onFocusPlayerControls = (e?: any) => {
    if (appContext?.track?.loaded && appContext?.track?.playing && !appContext?.track?.seeking) {
      const playerCtrl = e.target.closest('.player-control');
      if (!playerCtrl) {
        !isPlayerControlsActive ? showPlayerControlsAndStartTimer(true) : hidePlayerControlsAndStopTimer();
      }
      else {
        showPlayerControlsAndStartTimer(true);
      }
    }
  }

  const showPlayerControlsAndStartTimer = (timer: boolean) => {
    if (isPlayerControlsActiveTimer) {
      clearTimeout(isPlayerControlsActiveTimer);
      setIsPlayerControlsActiveTimer(null);
    }
    setIsPlayerControlsActive(true);
    if (timer) {
      setIsPlayerControlsActiveTimer(setTimeout(() => {
        setIsPlayerControlsActive(false);
        clearTimeout(isPlayerControlsActiveTimer);
        setIsPlayerControlsActiveTimer(null);
      }, 5000));
    }
  }

  const hidePlayerControlsAndStopTimer = () => {
    if (isPlayerControlsActiveTimer) {
      clearTimeout(isPlayerControlsActiveTimer);
      setIsPlayerControlsActiveTimer(null);
    }
    setIsPlayerControlsActive(false);
  }

  const onPlaybackRateChange = (e: any) => {
    if (appContext?.track) {
      appContext.track.playbackRate = e.detail.value;
      appContext.handleTrack(appContext?.track);
    }
  }

  const onEnterPiP = () => {
    (document.querySelector('.player-wrapper video') as HTMLVideoElement)?.requestPictureInPicture();
  };

  const onExitPiP = () => {
    document.pictureInPictureElement && document.exitPictureInPicture();
  };

  return (
    <>
      <IonModal isOpen={true} canDismiss={false} className={`player ${appContext?.track?.maximized ? 'player-full' : 'player-mini'}`}
        style={{ bottom: appContext?.track?.maximized ? 0 : `${navTabBarHeight}px`, height: appContext?.track?.maximized ? 'auto' : `${playerViewHeight}px` }}>
        {
          appContext?.orientation?.includes('portrait') && appContext?.track?.maximized &&
          <IonHeader>
            <IonToolbar>
            </IonToolbar>
          </IonHeader>
        }
        <IonContent>
          <div ref={playerViewRef} className={`ion-padding p-0 ${!appContext?.track?.maximized ? 'player-mini-content' : ''}`}>
            <div className="d-flex align-items-center">
              <div ref={playerWrapperRef}
                className="player-wrapper"
                style={{
                  width: appContext?.track?.maximized ? window.innerWidth : (appContext?.orientation?.includes('portrait') ? '6rem' : '8rem'),
                  height: appContext?.track?.maximized ? (appContext?.orientation?.includes('landscape') ? window.innerHeight : 'auto') : 'auto'
                }}
                onClick={!appContext?.track?.maximized ? onMaximize : onFocusPlayerControls}>
                {
                  playerWrapperRef?.current && appContext?.track?.contentType === GENERAL.AUDIO && <>
                    {
                      <img className="h-100"
                        src={appContext?.track?.type === 'content' ? appContext?.track?.content.contentImages.landscape : appContext?.track?.episode.episodeImages.landscape} />
                    }
                  </>
                }
                <Player />
                {
                  appContext?.track?.maximized && appContext?.track?.loaded > 0 &&
                  <div className={`player-controls-wrapper ${isPlayerControlsActive ? 'active' : ''}`}>
                    <div className={`d-flex flex-column h-100 ${appContext?.orientation?.includes('portrait') ? 'p-2' : 'pt-3 pb-5 px-5'}`}>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <IonButton size="small" fill="clear" color={"dark"} className="player-control" onClick={onMinimize}>
                            <IonIcon size="small" slot="icon-only" icon={chevronDown}></IonIcon>
                          </IonButton>
                        </div>
                        <div>
                          {
                            Capacitor.isNativePlatform() && <>
                              {
                                appContext?.orientation?.includes('portrait') ?
                                  <IonButton size="small" fill="clear" color={"dark"} className="player-control" onClick={onEnterFullScreen}>
                                    <IonIcon size="small" slot="icon-only" icon={expandOutline}></IonIcon>
                                  </IonButton> :
                                  <IonButton size="small" fill="clear" color={"dark"} className="player-control" onClick={onExitFullScreen}>
                                    <IonIcon size="small" slot="icon-only" icon={contractOutline}></IonIcon>
                                  </IonButton>
                              }
                            </>
                          }
                          <IonButton id="player-settings-trigger" size="small" fill="clear" color={"dark"} className="player-control">
                            <IonIcon size="small" slot="icon-only" icon={settingsOutline}></IonIcon>
                          </IonButton>
                          <IonModal ref={playerSettingsModalRef} trigger="player-settings-trigger"
                            initialBreakpoint={appContext?.track?.contentType === GENERAL.AUDIO ? (appContext?.orientation?.includes('portrait') ? 0.15 : 0.3) : (appContext?.orientation?.includes('portrait') ? 0.22 : 0.45)}
                            breakpoints={appContext?.track?.contentType === GENERAL.AUDIO ? (appContext?.orientation?.includes('portrait') ? [0, 0.15, 0.5] : [0, 0.3, 0.5]) : (appContext?.orientation?.includes('portrait') ? [0, 0.22, 0.75] : [0, 0.45, 0.75])}>
                            <IonContent className="ion-padding">
                              <IonList>
                                <IonItem button={true} detail={false}>
                                  <IonIcon aria-hidden="true" icon={speedometerOutline} slot="start"></IonIcon>
                                  <IonLabel>
                                    <IonSelect interface="action-sheet" label="Playback Speed" value={appContext?.track?.playbackRate} onIonChange={onPlaybackRateChange}>
                                      {
                                        playbackRates.map((x: any) => {
                                          return (<IonSelectOption key={x} value={x}>{x === 1 ? '1 (Normal)' : x}</IonSelectOption>);
                                        })
                                      }
                                    </IonSelect>
                                  </IonLabel>
                                </IonItem>
                                {
                                  appContext?.track?.contentType === GENERAL.VIDEO &&
                                  <IonItem button={true} detail={false}>
                                    <IonIcon aria-hidden="true" icon={albumsOutline} slot="start"></IonIcon>
                                    <IonToggle enableOnOffLabels={true} justify="space-between" checked={appContext?.track?.isPiP}
                                      onIonChange={!appContext.track.isPiP ? onEnterPiP : onExitPiP}>Picture-In-Picture</IonToggle>
                                  </IonItem>
                                }
                              </IonList>
                            </IonContent>
                          </IonModal>
                        </div>
                      </div>
                      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                        {
                          appContext?.track?.content.contentEpisodes > 0 &&
                          <IonButton size="small" fill="clear" color={"dark"} className="player-control" disabled={parseInt(appContext?.track?.episode.episodeNumber) === 1}
                            onClick={() => onEpisodeChange(-1)}>
                            <IonIcon size="large" slot="icon-only" icon={playSkipBackOutline}></IonIcon>
                          </IonButton>
                        }
                        <IonButton size="large" fill="clear" color={"dark"} className="player-control position-relative me-5" onClick={onRewind} disabled={appContext?.track?.seeking}>
                          <IonIcon size="large" slot="icon-only" icon={refreshOutline} className="mirror"></IonIcon>
                          <span className="player-skip-text">10</span>
                        </IonButton>
                        {
                          appContext?.track?.seeking ?
                            <IonSpinner name="lines" color={"dark"} className="player-spinner-lg"></IonSpinner> :
                            <IonButton size="large" fill="clear" color={"dark"} className="player-control" onClick={onPlayPause} disabled={appContext?.track?.seeking}>
                              {
                                !appContext?.track?.playing ?
                                  <IonIcon slot="icon-only" icon={play} className="player-play-pause"></IonIcon> :
                                  <IonIcon slot="icon-only" icon={pause} className="player-play-pause"></IonIcon>
                              }
                            </IonButton>
                        }
                        <IonButton size="large" fill="clear" color={"dark"} className="player-control position-relative ms-5" onClick={onForward} disabled={appContext?.track?.seeking}>
                          <IonIcon size="large" slot="icon-only" icon={refreshOutline}></IonIcon>
                          <span className="player-skip-text">10</span>
                        </IonButton>
                        {
                          appContext?.track?.content.contentEpisodes > 0 &&
                          <IonButton size="small" fill="clear" color={"dark"} className="player-control" disabled={parseInt(appContext?.track?.episode.episodeNumber) === appContext?.track?.content.contentEpisodes}
                            onClick={() => onEpisodeChange(+1)}>
                            <IonIcon size="large" slot="icon-only" icon={playSkipForwardOutline}></IonIcon>
                          </IonButton>
                        }
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="player-control">
                          <span className='small'>{formatTime(Math.floor(appContext?.track?.elapsed ?? 0))}</span>
                          <span className="small px-1">/</span>
                          <span className='small'>{formatTime(Math.floor(appContext?.track?.duration ?? 0))}</span>
                        </div>
                        <div>
                          <IonButton size="small" fill="clear" color={"dark"} className="player-control" onClick={onToggleMute}>
                            <IonIcon size="small" slot="icon-only" icon={appContext.track.muted ? volumeMuteOutline : volumeHighOutline}></IonIcon>
                          </IonButton>
                        </div>
                      </div>
                      <div className="position-relative player-control">
                        {
                          appContext?.track?.loaded &&
                          <div className="player-progress-loaded-track" style={{
                            left: `${appContext?.track?.progress * 100}%`,
                            width: `${(appContext?.track?.loaded - appContext?.track?.progress) * 100}%`
                          }}></div>
                        }
                        <ReactSlider
                          thumbClassName='player-progress-slider-thumb'
                          trackClassName='player-progress-slider-track'
                          max={1}
                          min={0}
                          step={0.001}
                          value={appContext?.track?.progress}
                          onAfterChange={onSeek}
                          disabled={appContext?.track?.seeking}
                        />
                      </div>
                    </div>
                  </div>
                }
              </div>
              {
                !appContext?.track?.maximized && <>
                  <div className={`flex-grow-1 px-3 py-2 ${appContext?.orientation?.includes('portrait') ? 'player-mini-body-portrait' : 'player-mini-body-landscape'}`}
                    onClick={onMaximize}>
                    <div>
                      <Marquee html={appContext?.track?.type === 'content' ? appContext?.track?.content?.contentName : appContext?.track?.episode.episodeName}></Marquee>
                    </div>
                    <IonProgressBar value={appContext?.track?.progress} className="rounded mt-2"></IonProgressBar>
                  </div>
                  <div className="d-flex align-items-center">
                    {
                      appContext?.track?.seeking ?
                        <IonSpinner name="lines" color={"dark"} className="player-spinner-sm"></IonSpinner> :
                        <IonButton fill="clear" color={"dark"} onClick={onPlayPause} disabled={appContext?.track?.seeking}>
                          {
                            !appContext?.track?.playing ?
                              <IonIcon slot="icon-only" icon={play}></IonIcon> :
                              <IonIcon slot="icon-only" icon={pause}></IonIcon>
                          }
                        </IonButton>
                    }
                    <IonButton fill="clear" color={"dark"} onClick={onCancel}>
                      <IonIcon slot="icon-only" icon={closeOutline}></IonIcon>
                    </IonButton>
                  </div>
                </>
              }
            </div>
            {
              appContext?.orientation?.includes('portrait') && appContext?.track?.maximized && <>
                <div className="px-3">
                  <h2 className="fw-700">
                    <Marquee html={appContext?.track?.content.contentName}></Marquee>
                  </h2>
                  {
                    appContext?.track?.type === 'episode' && <>
                      <div className="small">{appContext?.track?.episode.episodeName}</div>
                    </>
                  }
                  <div className="my-4">
                    <Ellipsis html={appContext?.track?.content.contentDescription} lines={5} />
                  </div>
                </div>
              </>
            }
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default PlayerView;