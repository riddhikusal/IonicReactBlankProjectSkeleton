import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
//import { apiProxyRequest } from '../../lib/api-client-proxy';
//import type { AudioFFMPEGResponse } from '../../types/media';
//import { useChatPanelStore } from '../../store/chatStore';
import { megaphone, megaphoneOutline, pauseOutline, playBackOutline, playForwardOutline, playOutline, returnDownBackOutline, returnUpForwardOutline, stop, volumeHighOutline } from 'ionicons/icons';
import { IonCol, IonIcon, IonLabel, IonPage, IonRange, IonRow } from '@ionic/react';
//import ViewToggle from './view-toggle';
//import PdfViewer from './Pdf-viewer';
import audioGenerate from '../../assets/images/others/audioGenerate.png';
import PadaiYouTubePlayer from '../../../components/ContentView/YoutubePlayer/YoutubePlayer';
import PadaiHtmlContentController from '../../../components/ContentView/HtmlViewer/HtmlViewer';
import PadaiHtmlContentViwer from '../../../components/ContentView/HtmlViewer/HtmlViewer';



//   useEffect(() => {
//     fetch(url)
//       .then(res => res.text())
//       .then(setHtmlContent)
//       .catch(err => console.error('Failed to fetch HTML:', err));
//   }, [url]);

//   useEffect(() => {
//     const resize = () => {
//       if (!containerRef.current || !contentRef.current) return;
//       const containerWidth = containerRef.current.offsetWidth;
//       const contentWidth = contentRef.current.scrollWidth;
//       const scale = containerWidth / contentWidth;
//       setZoom(scale > 1 ? 1 : scale);
//     };
//     resize();
//     window.addEventListener('resize', resize);
//     return () => window.removeEventListener('resize', resize);
//   }, [htmlContent]);

//   useEffect(() => {
//     return () => {
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current.currentTime = 0;
//         setIsPlaying(false);
//         setIsPaused(false);
//       }
//     };
//   }, [location]);

//   useEffect(() => {
//     const styleId = 'selection-style';
//     if (!document.getElementById(styleId)) {
//       const style = document.createElement('style');
//       style.id = styleId;
//       style.innerHTML = `
//         ::selection { background: #f5f3c8; color: inherit; }
//         .highlighted-line { background-color: #fcf8c2; transition: background-color 0.3s; }
        
//         /* Creative Orange Audio Slider Styles */
//         .audioSlider {
//           -webkit-appearance: none;
//           appearance: none;
//           height: 8px;
//           border-radius: 10px;
//           background: linear-gradient(90deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%);
//           outline: none;
//           box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
//           transition: all 0.3s ease;
//           cursor: pointer;
//         }
        
//         .audioSlider:hover {
//           box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
//           transform: scale(1.02);
//         }
        
//         .audioSlider::-webkit-slider-thumb {
//           -webkit-appearance: none;
//           appearance: none;
//           width: 20px;
//           height: 20px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #ff6b35, #ff8c42);
//           cursor: pointer;
//           border: 3px solid #fff;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
//           transition: all 0.2s ease;
//         }
        
//         .audioSlider::-webkit-slider-thumb:hover {
//           transform: scale(1.1);
//           box-shadow: 0 4px 12px rgba(255, 107, 53, 0.5);
//           background: linear-gradient(135deg, #ff8c42, #ffa726);
//         }
        
//         .audioSlider::-webkit-slider-thumb:active {
//           transform: scale(1.15);
//           box-shadow: 0 6px 16px rgba(255, 107, 53, 0.6);
//         }
        
//         .audioSlider::-moz-range-thumb {
//           width: 20px;
//           height: 20px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #ff6b35, #ff8c42);
//           cursor: pointer;
//           border: 3px solid #fff;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
//           transition: all 0.2s ease;
//         }
        
//         .audioSlider::-moz-range-thumb:hover {
//           transform: scale(1.1);
//           box-shadow: 0 4px 12px rgba(255, 107, 53, 0.5);
//           background: linear-gradient(135deg, #ff8c42, #ffa726);
//         }
        
//         .audioSlider::-moz-range-track {
//           height: 8px;
//           border-radius: 10px;
//           background: linear-gradient(90deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%);
//           border: none;
//           box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
//         }
        
//         /* Progress indicator */
//         .audioSlider::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           height: 100%;
//           background: linear-gradient(90deg, #ff4757 0%, #ff6b35 100%);
//           border-radius: 10px;
//           pointer-events: none;
//           z-index: -1;
//         }
//       `;
//       document.head.appendChild(style);
//     }
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Element;
//       if (!target.closest('.speedBtn')) {
//         setShowSpeedDropdown(false);
//       }
//     };

//     if (showSpeedDropdown) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showSpeedDropdown]);

//   const formatTime = (seconds: number) => {
//     const m = Math.floor(seconds / 60).toString().padStart(2, '0');
//     const s = Math.floor(seconds % 60).toString().padStart(2, '0');
//     return `${m}:${s}`;
//   };




//   const base64ToArrayBuffer = (base64: string) => {
//     base64 = base64.replace(/_/g, "/").replace(/-/g, "+");
//     const binary = atob(base64);
//     const len = binary.length;
//     const bytes = new Uint8Array(len);
//     for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
//     return bytes.buffer;
//   };


//   const clearHighlights = () => {
//     highlightedElements.forEach(el => el.classList.remove('highlighted-line'));
//     setHighlightedElements([]);
//   };

//   const startSpeech = async (text: string, language: string = 'hi-IN') => {
//     if (!text.trim()) {
//       alert('Please enter text to generate audio.');
//       return;
//     }

//     setLoadingAudio(true);

//     try {

//       const payload = {
//         text, language
//       };
//       const response = await apiProxyRequest<AudioFFMPEGResponse, typeof payload>(
//         "POST",
//         "Audio/synthesizeaudio",
//         payload
//       );


//       const blob = new Blob([new Uint8Array(base64ToArrayBuffer(response.audio))], {
//         type: 'audio/mpeg',
//       });

//       if (audioRef.current) {
//         audioRef.current.src = URL.createObjectURL(blob);
//         setIsPlaying(true);
//         setIsPaused(false);
//         audioRef.current.play();
//       }
//     } catch (err) {
//       alert('Error generating speech.');
//     } finally {
//       setLoadingAudio(false);
//     }
//   };

//   const toggleSpeech = () => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (isPlaying && !isPaused) {
//       audio.pause();
//       setIsPaused(true);
//     } else if (isPlaying && isPaused) {
//       audio.play();
//       setIsPaused(false);
//     } else {
//       const text = contentRef.current?.innerText || '';
//       startSpeech(text);
//     }
//   };

//   const stopSpeech = () => {
//     const audio = audioRef.current;
//     if (audio) {
//       audio.pause();
//       audio.currentTime = 0;
//       setIsPlaying(false);
//       setIsPaused(false);
//       clearHighlights();
//     }
//   };

//   const seekAudio = (seconds: number) => {
//     const audio = audioRef.current;
//     if (audio) {
//       audio.currentTime += seconds;
//     }
//   };

//   const setPlaybackSpeed = (rate: number) => {
//     const audio = audioRef.current;
//     if (audio) {
//       audio.playbackRate = rate;
//     }
//     setPlaybackSpeedState(rate);
//     setShowSpeedDropdown(false);
//   };

//   const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (audioRef.current) {
//       audioRef.current.volume = parseFloat(e.target.value);
//     }
//   };

//   const onTimeUpdate = () => {
//     if (audioRef.current) {
//       setCurrentTime(audioRef.current.currentTime);
//       setDuration(audioRef.current.duration);
//     }
//   };

//   const onProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = parseFloat(e.target.value);
//     }
//   };

  // const PadaiHtmlContentController = () => {
  //   return (
  //     <>
  //     <div className="prose bg-slate-100" ref={containerRef} style={{
  //       overflow: 'auto',
  //       fontSize: '14px',
  //       padding: '9px 8px',
  //       paddingTop: '50px'
  //     }}>
  //       <div
  //         ref={contentRef}
  //         className="html-div origin-top-left user-select"
  //         style={{ transform: `scale(${1})`, transformOrigin: 'center top' }}
  //         dangerouslySetInnerHTML={{ __html: htmlContent }}
  //       />
  //     </div >
  //     </>
  //   );
  // };
  const PadAIHTMLContentScreen: React.FC = () => {
    return (
        <IonPage className='padAIHTMLContentScreen-page'>
          <div style={{ textAlign: 'left' }}>
          <PadaiHtmlContentViwer    
             url="https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Chapter-Summary.html"/>
            </div>
        </IonPage>
    );
};
   
export default PadAIHTMLContentScreen;

