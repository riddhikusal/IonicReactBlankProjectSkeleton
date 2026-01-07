import React, { useState, useRef, useEffect } from 'react';
import { IonButton, IonIcon, IonContent, IonTextarea, IonText, IonChip } from '@ionic/react';
import { close, expand, contract, mic, send, bulbOutline, languageOutline, closeOutline, trashOutline, arrowUp, cloudUploadOutline, play, pause } from 'ionicons/icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './CustomSheetModal.css';
import { useChatsStore } from '../../../services/store/chats.store';
import { useChapterStore } from '../../../services/store/chapter.store';
import { AskOpenAIAssistant } from '../../../services/homeService';
import { useToaster } from '../../../hooks/toasterHooks/useToaster';
import audioIcon from '/assets/audio_icon.gif';
// [
//   {
//     id: '1',
//     text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. In, nihil voluptas qui voluptatum laborum officiis quidem facere deleniti aliquid quia iusto modi nam reprehenderit animi sequi molestiae consectetur consequatur. Natus, sunt doloribus, aperiam vero molestiae mollitia tempora aut cupiditate est suscipit magni pariatur amet nam voluptatum error eos quisquam minima culpa repellendus. Nulla nihil optio assumenda eum excepturi omnis, earum quidem. Laborum corporis accusamus nobis reprehenderit? Ea reprehenderit at eaque. Nihil, iste facilis saepe impedit, vero quos repellat enim nostrum praesentium, dolore ipsa voluptates vel quo aspernatur ex ullam asperiores alias minus voluptas obcaecati rerum quaerat! Nihil iste quod error!',
//     isUser: false,
//     timestamp: new Date(),
//     type: 'ai'
//   },
//   {
//     id: '2',
//     text: 'This is a long selected text that should be displayed with ellipses to show that it\'s been copied or selected from somewhere else in the application. This text represents content that the user has highlighted or copied from a document, article, or any other source.',
//     isUser: false,
//     timestamp: new Date(Date.now() - 300000),
//     type: 'selected-text'
//   },
//   {
//     id: '3',
//     text: 'Can you help me understand this concept better?',
//     isUser: true,
//     timestamp: new Date(Date.now() - 180000),
//     type: 'user'
//   },
//   {
//     id: '4',
//     text: 'Of course! I\'d be happy to help you understand this concept. Based on the selected text you\'ve shared, it appears to be discussing complex theoretical concepts. Let me break it down for you in simpler terms.',
//     isUser: false,
//     timestamp: new Date(Date.now() - 120000),
//     type: 'ai'
//   },
//   {
//     id: '5',
//     text: 'Another piece of selected text from a different source that demonstrates how the selected text message type works with different content lengths.',
//     isUser: false,
//     timestamp: new Date(Date.now() - 60000),
//     type: 'selected-text'
//   }
// ]
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: 'ai' | 'user' | 'selected-text';
  isSelectedTextHTML?: boolean;
  hasAudioReadout?: boolean;
  audioId?: string;
}

interface CustomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: string;
  selectedText?: string;
}

interface AudioReadoutControlsProps {
  messageId: string;
  audioState?: { playing: boolean; paused: boolean; audioRef: HTMLAudioElement | null };
  onTogglePlayPause: (messageId: string) => void;
  videoRefs: React.MutableRefObject<Record<string, HTMLVideoElement | null>>;
}

const AudioReadoutControls: React.FC<AudioReadoutControlsProps> = ({
  messageId,
  audioState,
  onTogglePlayPause,
  videoRefs
}) => {
  // Sync video with audio playback
  useEffect(() => {
    const video = videoRefs.current[messageId];
    if (!video) return;

    if (audioState?.playing && !audioState.paused) {
      video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [messageId, audioState?.playing, audioState?.paused, videoRefs]);

  return (
    <div className="audio-readout-controls">
      <video
        ref={(el) => {
          if (el) {
            videoRefs.current[messageId] = el;
          }
        }}
        src="https://d1rb72t9cnnyis.cloudfront.net/common/AI+Buddy+Teaching.mp4"
        loop
        muted
        playsInline
        className="audio-readout-video"
        style={{
          display: audioState?.playing ? 'block' : 'none'
        }}
      />
      <IonButton
        fill="clear"
        size="small"
        onClick={() => onTogglePlayPause(messageId)}
        className="audio-toggle-button"
      >
        <IonIcon
          icon={audioState?.playing && !audioState.paused ? pause : play}
        />
      </IonButton>
    </div>
  );
};
const CustomSheetModal: React.FC<CustomSheetModalProps> = ({ isOpen, onClose, trigger, selectedText }) => {
  /* ---------------- REFS ---------------- */
  const wsRef = useRef(null);
  const audioRef = useRef(new Audio());
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const transcriptRef = useRef<string | null>(null);
  const lastFinalRef = useRef("");
  const micEnabledRef = useRef(true);


  const [playingAudio, setPlayingAudio] = useState(false);
  const [audioPaused, setAudioPaused] = useState(false);
  const [language, setLanguage] = useState("en-IN");
  const [voice, setVoice] = useState("female");
  const [memoryTranscript, setMemoryTranscript] = useState("");

  // Track audio state per message
  const [messageAudioStates, setMessageAudioStates] = useState<Record<string, { playing: boolean; paused: boolean; audioRef: HTMLAudioElement | null }>>({});
  const currentAudioMessageIdRef = useRef<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const [ speechToTextBrowserSupported, setSpeechToTextBrowserSupported] = useState(true);
  const [speechRecognitionError, setSpeechRecognitionError] = useState<string | null>(null);
  const { dangerToaster } = useToaster();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCustomSheetOpen, setIsCustomSheetOpen] = useState(false);
  const [isInitialAppear, setIsInitialAppear] = useState(false);
  const [messages, setMessages] = useState<Message[]>();
  const [inputText, setInputText] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiResponseLoading, setAiResponseLoading] = useState(false);

  // Speech Recognition - configure for mobile compatibility
  const { finalTranscript, interimTranscript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Detect mobile device (needs to be before useEffects that use it)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Predefined text chips with icons
  const predefinedChips = [
    { text: 'Explain', icon: bulbOutline },
    { text: 'Translate', icon: languageOutline },
    { text: 'Clear', icon: closeOutline }
  ];

  // chat and chapter info store
  const chapterInfo = useChapterStore((state: any) => state.chapterInfo);
  const chatInfo = useChatsStore((state: any) => state.chatInfo);
  const setIsChatOpen = useChatsStore((state: any) => state.setIsChatOpen);
  const removeSelectedText = useChatsStore((state: any) => state.removeSelectedText);
  const setAIReply = useChatsStore((state: any) => state.setAIReply);
  const updateLastAIReply = useChatsStore((state: any) => state.updateLastAIReply);
  const setUserMessage = useChatsStore((state: any) => state.setUserMessage);
  const clearChat = useChatsStore((state: any) => state.clearChat);
  const [workFlow, setWorkFlow] = useState<string[]>([]);
  const [showWorkFlowLog, setShowWorkFlowLog] = useState(false);
  const workFlowRef = useRef<HTMLDivElement>(null);

  // Helper function to add workflow log with timestamp
  const addWorkFlowLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setWorkFlow(prev => [...prev, logMessage]);
    // Auto-scroll to bottom after a short delay
    setTimeout(() => {
      workFlowRef.current?.scrollTo({
        top: workFlowRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };
  useEffect(() => {
    setMessages(chatInfo.messages);
    setIsCustomSheetOpen(chatInfo.isChatOpen);
  }, [chatInfo]);

  useEffect(() => {
    if (isCustomSheetOpen) {
      document.body.style.overflow = 'hidden';
      setIsInitialAppear(true);
      // Remove initial appear class after animation completes
      const timer = setTimeout(() => {
        setIsInitialAppear(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
      setIsInitialAppear(false);
      // Cleanup when modal closes
      stopEverything();
    }

    return () => {
      document.body.style.overflow = 'unset';
      stopEverything();
    };
  }, [isCustomSheetOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update input text when speech recognition transcript changes (both interim and final)
  useEffect(() => {
    // Combine final and interim transcripts for real-time updates (especially important for Android)
    const combinedTranscript = finalTranscript + (interimTranscript || '');
    if (combinedTranscript) {
      setInputText(combinedTranscript);
      // Log only when final transcript changes (to avoid spam from interim updates)
      if (finalTranscript && finalTranscript !== transcriptRef.current) {
        addWorkFlowLog(`Speech Recognition - Final transcript: "${finalTranscript}"`);
        transcriptRef.current = finalTranscript;
      }
    }
  }, [finalTranscript, interimTranscript]);

  // Monitor listening state for Android - detect unexpected stops
  const listeningRef = useRef(listening);
  const listeningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const isAndroid = isMobile && !isIOS;
    
    // Only monitor on Android
    if (!isAndroid || !browserSupportsSpeechRecognition) {
      return;
    }

    // Clear previous timeout
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
    }

    // If listening state changed from true to false unexpectedly
    if (listeningRef.current === true && listening === false && micEnabledRef.current) {
      addWorkFlowLog('Speech Recognition - WARNING: Listening stopped unexpectedly on Android');
      // Don't auto-restart immediately, let user manually restart
      // This prevents the continuous start/stop loop
    }

    // If we just started listening, set a timeout to check if it stops immediately
    if (listening && !listeningRef.current) {
      listeningTimeoutRef.current = setTimeout(() => {
        if (!listening && micEnabledRef.current) {
          addWorkFlowLog('Speech Recognition - ERROR: Speech recognition stopped immediately after starting (Android abort loop detected)');
          const errorMsg = 'Speech recognition stopped immediately. This may be a browser limitation. Try stopping and starting again.';
          setSpeechRecognitionError(errorMsg);
          dangerToaster(errorMsg);
          // Prevent auto-restart by setting micEnabledRef to false temporarily
          micEnabledRef.current = false;
          setTimeout(() => {
            micEnabledRef.current = true;
          }, 2000);
        }
      }, 500);
    }

    listeningRef.current = listening;

    return () => {
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
      }
    };
  }, [listening, isMobile, isIOS, browserSupportsSpeechRecognition]);

  // Handle mobile browser speech recognition initialization and request permissions
  useEffect(() => {
    if (!browserSupportsSpeechRecognition || !isCustomSheetOpen) {
      return;
    }

    // For mobile browsers (Android PWA and iOS), request microphone permission when modal opens
    const requestMicrophonePermission = async () => {
      if (isMobile && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Request permission proactively for Android PWA
          await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log('Microphone permission granted');
        } catch (error: any) {
          console.error('Microphone permission error:', error);
          // Don't show error immediately, let user try to use voice button
          // Error will be shown when they actually try to use speech recognition
        }
      }
      
      // Also check permissions API if available
      if (isMobile && navigator.permissions) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          if (result.state === 'denied') {
            setSpeechToTextBrowserSupported(false);
            const errorMsg = 'Microphone permission is denied. Please enable it in your browser settings.';
            setSpeechRecognitionError(errorMsg);
          }
        } catch (error) {
          // Permissions API might not be available, that's okay
          console.log('Permissions API not available');
        }
      }
    };

    // Request permission when modal opens on mobile
    if (isMobile) {
      requestMicrophonePermission();
    }
  }, [browserSupportsSpeechRecognition, isMobile, isCustomSheetOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const stopEverything = () => {
    stopMic();
    (wsRef as any).current?.close();
    audioRef.current.pause();
    setPlayingAudio(false);
    setAiResponseLoading(false);
  };

  const handleClose = () => {
    setIsExpanded(false);
    stopEverything();
    onClose();
  };

  // const handleSendMessage = async (defaultText: string = '') => {
  //   if (defaultText.trim() || inputText.trim()) {
  //     const newMessage: Message = {
  //       id: Date.now().toString(),
  //       text: defaultText.trim() ? defaultText.trim() : inputText.trim(),
  //       isUser: true,
  //       timestamp: new Date(),
  //       type: 'user'
  //     };



  //     // Check if last message is selected-text and concatenate if needed
  //     let promptText = newMessage.text;
  //     if (messages && messages.length > 0) {
  //       const lastMessage = messages[messages.length - 1];
  //       if (lastMessage.type === 'selected-text' && lastMessage.text) {
  //         // Concatenate selected text with space before current text
  //         promptText = `${lastMessage.text} ${newMessage.text}`;
  //       }
  //     }

  //     // setMessages([...messages || [], newMessage]);
  //     setUserMessage(newMessage);
  //     setInputText('');
  //     if (browserSupportsSpeechRecognition) {
  //       resetTranscript();
  //     }

  //     setAiResponseLoading(true);

  //     const response = await AskOpenAIAssistant({
  //       prompt: promptText,
  //       chapterId: 12 // chapterInfo.chapterId
  //     }).then((response) => {
  //       setAiResponseLoading(false);
  //       if (response.responseStatus === 'DATA_FOUND') {
  //         setAIReply({
  //           id: (Date.now() + 1).toString(),
  //           text: response.data.response,
  //           isUser: false,
  //           timestamp: new Date(),
  //           type: 'ai'
  //         });
  //       }
  //     }).catch((error) => {
  //       setAiResponseLoading(false);
  //       console.log(error);
  //       dangerToaster(error.message);
  //     });
  //   }
  // };

  const handleSendMessage = async (defaultText: string = '', audioReadOut: boolean = false) => {
    if (defaultText.trim() || inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: defaultText.trim() ? defaultText.trim() : inputText.trim(),
        isUser: true,
        timestamp: new Date(),
        type: 'user'
      };



      // Check if last message is selected-text and concatenate if needed
      let promptText = newMessage.text;
      if (messages && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.type === 'selected-text' && lastMessage.text) {
          // Concatenate selected text with space before current text
          promptText = `${lastMessage.text} ${newMessage.text}`;
        }
      }

      // setMessages([...messages || [], newMessage]);
      setUserMessage(newMessage);
      setInputText('');
      if (browserSupportsSpeechRecognition) {
        resetTranscript();
      }

      setAiResponseLoading(true);

      handleAsk(promptText, audioReadOut);
      // const response = await AskOpenAIAssistant({
      //   prompt: promptText,
      //   chapterId: 12 // chapterInfo.chapterId
      // }).then((response) => {
      //   setAiResponseLoading(false);
      //   if (response.responseStatus === 'DATA_FOUND') {
      //     setAIReply({
      //       id: (Date.now() + 1).toString(),
      //       text: response.data.response,
      //       isUser: false,
      //       timestamp: new Date(),
      //       type: 'ai'
      //     });
      //   }
      // }).catch((error) => {
      //   setAiResponseLoading(false);
      //   console.log(error);
      //   dangerToaster(error.message);
      // });
    }
  };



  /* ---------------- MIC CONTROLS ---------------- */
  const startMic = async () => {
    micEnabledRef.current = true;
    if (browserSupportsSpeechRecognition) {
      try {
        // Request microphone permission on mobile (especially important for Android)
        if (isMobile && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          addWorkFlowLog(`startMic - Requesting microphone permission (isAndroid: ${!isIOS})`);
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            addWorkFlowLog('startMic - Microphone permission granted');
          } catch (error: any) {
            console.error('Microphone permission denied:', error);
            addWorkFlowLog(`startMic - Microphone permission denied: ${error?.message || error}`);
            const errorMsg = 'Microphone permission is required. Please enable it in your browser settings.';
            setSpeechRecognitionError(errorMsg);
            dangerToaster(errorMsg);
            return;
          }
        }
        
        // Mobile browsers need different options
        const isAndroid = isMobile && !isIOS;
        
        // For Android, try native API first for better compatibility
        if (isAndroid) {
          addWorkFlowLog(`startMic - Android detected, trying native SpeechRecognition API`);
          await new Promise(resolve => setTimeout(resolve, 500)); // Increased delay for Android
          
          // Try to access native SpeechRecognition API for better Android support
          const SpeechRecognitionNative = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          if (SpeechRecognitionNative) {
            addWorkFlowLog('startMic - Native SpeechRecognition API available');
            try {
              const recognition = new SpeechRecognitionNative();
              recognition.continuous = true;
              recognition.interimResults = true;
              recognition.lang = language;
              recognition.maxAlternatives = 1;
              
              // Add comprehensive event handlers for debugging
              recognition.onstart = () => {
                addWorkFlowLog('startMic - Native recognition onstart event');
                // Verify microphone access
                navigator.mediaDevices.getUserMedia({ audio: true })
                  .then(stream => {
                    addWorkFlowLog('startMic - Microphone stream active, tracks: ' + stream.getAudioTracks().length);
                    // Don't stop the stream, let recognition use it
                  })
                  .catch(err => {
                    addWorkFlowLog(`startMic - WARNING: Could not verify microphone stream: ${err.message}`);
                  });
              };
              
              recognition.onaudiostart = () => {
                addWorkFlowLog('startMic - Native recognition onaudiostart - Audio capture started');
              };
              
              recognition.onaudioend = () => {
                addWorkFlowLog('startMic - Native recognition onaudioend - Audio capture ended');
              };
              
              recognition.onsoundstart = () => {
                addWorkFlowLog('startMic - Native recognition onsoundstart - Sound detected');
              };
              
              recognition.onsoundend = () => {
                addWorkFlowLog('startMic - Native recognition onsoundend - Sound ended');
              };
              
              recognition.onspeechstart = () => {
                addWorkFlowLog('startMic - Native recognition onspeechstart - Speech detected');
              };
              
              recognition.onspeechend = () => {
                addWorkFlowLog('startMic - Native recognition onspeechend - Speech ended');
              };
              
              recognition.onnomatch = () => {
                addWorkFlowLog('startMic - Native recognition onnomatch - No speech match found');
              };
              
              recognition.onresult = (event: any) => {
                addWorkFlowLog(`startMic - Native recognition onresult event (resultIndex: ${event.resultIndex}, results.length: ${event.results.length})`);
                let interimTranscript = '';
                let finalTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                  const result = event.results[i];
                  const transcript = result[0].transcript;
                  const confidence = result[0].confidence;
                  addWorkFlowLog(`startMic - Result ${i}: transcript="${transcript}", isFinal=${result.isFinal}, confidence=${confidence}`);
                  
                  if (result.isFinal) {
                    finalTranscript += transcript + ' ';
                  } else {
                    interimTranscript += transcript + ' ';
                  }
                }
                
                if (finalTranscript || interimTranscript) {
                  addWorkFlowLog(`startMic - Native recognition transcript: final="${finalTranscript.trim()}", interim="${interimTranscript.trim()}"`);
                  const combined = (finalTranscript + interimTranscript).trim();
                  setInputText(combined);
                } else {
                  addWorkFlowLog('startMic - WARNING: onresult fired but no transcript found');
                }
              };
              
              recognition.onerror = (event: any) => {
                addWorkFlowLog(`startMic - Native recognition onerror: error="${event.error}", message="${event.message || 'N/A'}"`);
                const errorMsg = `Speech recognition error: ${event.error}. Please try again.`;
                setSpeechRecognitionError(errorMsg);
                dangerToaster(errorMsg);
                
                // Don't auto-restart on certain errors
                if (event.error === 'not-allowed' || event.error === 'no-speech') {
                  addWorkFlowLog('startMic - Critical error, not auto-restarting');
                  micEnabledRef.current = false;
                }
              };
              
              recognition.onend = () => {
                addWorkFlowLog('startMic - Native recognition onend event');
                
                // Check if we got any results before ending
                const hasResults = finalTranscript || interimTranscript;
                if (!hasResults) {
                  addWorkFlowLog('startMic - WARNING: Recognition ended without any results. This may indicate audio capture issue.');
                }
                
                // Auto-restart if mic is still enabled and we're in continuous mode
                if (micEnabledRef.current && recognition.continuous) {
                  setTimeout(() => {
                    try {
                      addWorkFlowLog('startMic - Attempting to restart native recognition...');
                      recognition.start();
                      addWorkFlowLog('startMic - Native recognition restarted successfully');
                    } catch (e: any) {
                      addWorkFlowLog(`startMic - Error restarting native recognition: ${e?.message || e}`);
                      // If restart fails, try to reinitialize
                      if (e?.message?.includes('already started') || e?.message?.includes('aborted')) {
                        addWorkFlowLog('startMic - Recognition may be in bad state, will need manual restart');
                      }
                    }
                  }, 500); // Increased delay for Android
                } else {
                  addWorkFlowLog('startMic - Not auto-restarting (micEnabled: ' + micEnabledRef.current + ', continuous: ' + recognition.continuous + ')');
                }
              };
              
              recognition.start();
              addWorkFlowLog('startMic - Native SpeechRecognition started directly');
              setSpeechRecognitionError(null);
              
              // Store recognition instance for cleanup
              (window as any).__androidRecognition = recognition;
              
              return; // Exit early, using native API
            } catch (nativeError: any) {
              addWorkFlowLog(`startMic - Failed to use native API, falling back to library: ${nativeError?.message || nativeError}`);
            }
          }
        }
        
        const options: any = {
          language: language,
          continuous: isAndroid ? true : false, // Android may need continuous mode
          interimResults: true, // Important for real-time updates
        };
        
        addWorkFlowLog(`startMic - Starting speech recognition (continuous: ${options.continuous}, language: ${options.language}, isAndroid: ${isAndroid})`);
        SpeechRecognition.startListening(options);
        setSpeechRecognitionError(null);
        addWorkFlowLog('startMic - Speech recognition started successfully');
        
        // Monitor for transcript updates on Android
        if (isAndroid) {
          const checkInterval = setInterval(() => {
            if (!listening) {
              clearInterval(checkInterval);
              addWorkFlowLog('startMic - Speech recognition stopped');
            } else {
              // Log if we're listening but no transcripts are coming
              if (finalTranscript === '' && interimTranscript === '') {
                addWorkFlowLog('startMic - WARNING: Listening but no transcripts received yet (Android)');
              } else {
                clearInterval(checkInterval); // Stop checking once we get transcripts
              }
            }
          }, 2000);
          
          // Clear interval after 10 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
          }, 10000);
        }
      } catch (error: any) {
        console.error('Error starting speech recognition:', error);
        addWorkFlowLog(`startMic - ERROR: ${error?.message || error}`);
        const errorMsg = error?.message || 'Failed to start speech recognition. Please check microphone permissions.';
        setSpeechRecognitionError(errorMsg);
        dangerToaster(errorMsg);
      }
    } else {
      addWorkFlowLog('startMic - Speech recognition not supported');
    }
  };

  const stopMic = () => {
    micEnabledRef.current = false;
    
    // Stop native Android recognition if it exists
    if ((window as any).__androidRecognition) {
      try {
        (window as any).__androidRecognition.stop();
        (window as any).__androidRecognition = null;
        addWorkFlowLog('stopMic - Stopped native Android recognition');
      } catch (error) {
        console.error('Error stopping native recognition:', error);
      }
    }
    
    if (browserSupportsSpeechRecognition) {
      try {
        SpeechRecognition.stopListening();
        addWorkFlowLog('stopMic - Stopped library speech recognition');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };

  /* ================= ASK ================= */
  const handleAsk = (query: string, audioReadOut: boolean = false) => {
    addWorkFlowLog(`handleAsk called - query: "${query.substring(0, 50)}...", audioReadOut: ${audioReadOut}`);
    if (!query.trim()) {
      addWorkFlowLog('handleAsk - Query is empty, returning');
      return;
    }

    addWorkFlowLog('handleAsk - Stopping mic');
    stopMic();
    setAiResponseLoading(true);
    lastFinalRef.current = "";
    addWorkFlowLog('handleAsk - Set loading state to true');

    // Create a unique message ID for this response
    const messageId = (Date.now() + 1).toString();
    addWorkFlowLog(`handleAsk - Created messageId: ${messageId}`);
    currentAudioMessageIdRef.current = audioReadOut ? messageId : null;

    // If audio readout is enabled, create a new audio element for this message
    let messageAudioRef: HTMLAudioElement | null = null;
    if (audioReadOut) {
      addWorkFlowLog('handleAsk - Creating audio element for audioReadout');
      messageAudioRef = new Audio();
      // Initialize audio state immediately
      setMessageAudioStates(prev => ({
        ...prev,
        [messageId]: { playing: false, paused: false, audioRef: messageAudioRef }
      }));
      addWorkFlowLog(`handleAsk - Audio element created for messageId: ${messageId}`);
      console.log('Created audio element for message with audioReadout:', messageId);
    }

    // Clear previous audio (only if not per-message audio)
    if (!audioReadOut) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    // Check MediaSource support (iOS Safari has limited support)
    addWorkFlowLog(`handleAsk - Checking MediaSource support (isIOS: ${isIOS})`);
    const mediaSourceSupported = typeof MediaSource !== 'undefined';
    addWorkFlowLog(`handleAsk - MediaSource supported: ${mediaSourceSupported}`);
    
    // For iOS, use blob-based approach instead of MediaSource
    const useBlobFallback = isIOS || !mediaSourceSupported;
    addWorkFlowLog(`handleAsk - Using blob fallback: ${useBlobFallback}`);
    
    let mediaSource: MediaSource | null = null;
    const audioQueue: ArrayBuffer[] = [];
    const audioChunks: ArrayBuffer[] = []; // For iOS blob fallback
    let sourceBufferReady = false;

    if (!useBlobFallback) {
      // Use MediaSource for non-iOS devices
      addWorkFlowLog('handleAsk - Creating MediaSource instance');
      try {
        mediaSource = new MediaSource();
        addWorkFlowLog(`handleAsk - MediaSource created successfully. readyState: ${mediaSource.readyState} (0=closed, 1=open, 2=ended)`);
        (mediaSourceRef as any).current = mediaSource;
      } catch (error: any) {
        const errorMsg = `Failed to create MediaSource: ${error?.message || error}`;
        addWorkFlowLog(`handleAsk - ERROR creating MediaSource: ${errorMsg}`);
        setSpeechRecognitionError(errorMsg);
        dangerToaster(errorMsg);
        setAiResponseLoading(false);
        return;
      }
    } else {
      addWorkFlowLog('handleAsk - Skipping MediaSource (using blob fallback for iOS)');
      (mediaSourceRef as any).current = null;
    }

    // Setup MediaSource only if not using blob fallback
    if (mediaSource && !useBlobFallback) {
      // Add error handlers for MediaSource
      mediaSource.addEventListener("error", (event) => {
        const errorMsg = `MediaSource error: ${mediaSource!.readyState}`;
        addWorkFlowLog(`MediaSource - ERROR event: ${errorMsg}`);
        console.error("MediaSource error:", event, mediaSource!.readyState);
        setSpeechRecognitionError(errorMsg);
        dangerToaster(errorMsg);
      });

      mediaSource.addEventListener("sourceended", () => {
        addWorkFlowLog('MediaSource - sourceended event fired');
      });

      mediaSource.addEventListener("sourceclose", () => {
        addWorkFlowLog('MediaSource - sourceclose event fired');
      });

      // Set timeout to detect if sourceopen never fires
      let sourceOpenTimeout: NodeJS.Timeout | null = null;
      sourceOpenTimeout = setTimeout(() => {
        if (!sourceBufferReady) {
          const errorMsg = 'MediaSource sourceopen event did not fire. Please try again.';
          addWorkFlowLog(`MediaSource - TIMEOUT: ${errorMsg}`);
          setSpeechRecognitionError(errorMsg);
          dangerToaster(errorMsg);
        }
      }, 5000); // 5 second timeout

      mediaSource.addEventListener("sourceopen", () => {
        addWorkFlowLog('MediaSource - sourceopen event fired');
        if (sourceOpenTimeout) {
          clearTimeout(sourceOpenTimeout);
          sourceOpenTimeout = null;
        }
        
        try {
          // Try different MIME types for better browser compatibility
          addWorkFlowLog('MediaSource - Checking supported MIME types...');
          let mimeType = "audio/mpeg";
          const mpegSupported = MediaSource.isTypeSupported("audio/mpeg");
          const mp4Supported = MediaSource.isTypeSupported("audio/mp4");
          const webmSupported = MediaSource.isTypeSupported("audio/webm");
          
          addWorkFlowLog(`MediaSource - MIME type support: mpeg=${mpegSupported}, mp4=${mp4Supported}, webm=${webmSupported}`);
          
          if (!mpegSupported) {
            // Try alternative formats
            if (mp4Supported) {
              mimeType = "audio/mp4";
            } else if (webmSupported) {
              mimeType = "audio/webm";
            } else {
              const errorMsg = "MediaSource: No supported audio format found on this device.";
              console.warn(errorMsg);
              addWorkFlowLog(`MediaSource - ERROR: ${errorMsg}`);
              setSpeechRecognitionError(errorMsg);
              dangerToaster(errorMsg);
              return;
            }
          }

          addWorkFlowLog(`MediaSource - Using MIME type: ${mimeType}`);
          (sourceBufferRef as any).current = mediaSource!.addSourceBuffer(mimeType);
          sourceBufferReady = true;
          addWorkFlowLog('MediaSource - SourceBuffer created and ready');

          // Process queued audio chunks
          const processQueue = () => {
            if (audioQueue.length > 0 && sourceBufferReady) {
              const chunk = audioQueue.shift();
              if (chunk) {
                appendAudio(chunk);
                // Process next chunk after a small delay
                setTimeout(processQueue, 10);
              }
            }
          };
          processQueue();
        } catch (error: any) {
          const errorMsg = `Error creating source buffer: ${error?.message || error}`;
          console.error(errorMsg, error);
          addWorkFlowLog(`MediaSource - ERROR in sourceopen handler: ${errorMsg}`);
          setSpeechRecognitionError(errorMsg);
          dangerToaster(errorMsg);
        }
      });

      // Use message-specific audio ref if audioReadOut is enabled
      const targetAudioRef = audioReadOut && messageAudioRef ? messageAudioRef : audioRef.current;
      addWorkFlowLog(`handleAsk - Creating object URL for MediaSource (audioReadOut: ${audioReadOut})`);
      try {
        const objectURL = URL.createObjectURL(mediaSource);
        targetAudioRef.src = objectURL;
        addWorkFlowLog(`handleAsk - Set audio source URL: ${objectURL.substring(0, 50)}...`);
        
        // Log MediaSource state after setting src
        setTimeout(() => {
          addWorkFlowLog(`handleAsk - MediaSource readyState after setting src: ${mediaSource!.readyState} (0=closed, 1=open, 2=ended)`);
        }, 100);
      } catch (error: any) {
        const errorMsg = `Failed to create object URL: ${error?.message || error}`;
        addWorkFlowLog(`handleAsk - ERROR creating object URL: ${errorMsg}`);
        setSpeechRecognitionError(errorMsg);
        dangerToaster(errorMsg);
        setAiResponseLoading(false);
        return;
      }
    } else {
      addWorkFlowLog('handleAsk - Skipping MediaSource setup (using blob fallback)');
    }

    // Create WebSocket connection with iOS-specific handling
    let ws: WebSocket | null = null;
    let connectionTimeout: NodeJS.Timeout | null = null;
    let hasReceivedData = false;

    try {
      // iOS Safari requires WebSocket to be created in response to user interaction
      // This should already be the case since handleAsk is called from a button click
      addWorkFlowLog(`Creating WebSocket connection... (isIOS: ${isIOS}, isMobile: ${isMobile})`);
      console.log('Creating WebSocket connection...', { isIOS, isMobile });
      
      ws = new WebSocket("wss://padai.app/services/ws/vectorchat");
      ws.binaryType = "arraybuffer";
      (wsRef as any).current = ws;
      addWorkFlowLog(`WebSocket created - readyState: ${ws.readyState} (CONNECTING=${WebSocket.CONNECTING})`);

      // Set connection timeout for iOS (30 seconds)
      addWorkFlowLog('WebSocket - Setting connection timeout (30s)');
      connectionTimeout = setTimeout(() => {
        if (ws && ws.readyState === WebSocket.CONNECTING) {
          addWorkFlowLog('WebSocket - Connection timeout!');
          console.error('WebSocket connection timeout', { readyState: ws.readyState, isIOS });
          ws.close();
          setAiResponseLoading(false);
          const errorMsg = isIOS
            ? 'Connection timeout on iOS. Please check your internet connection and try again.'
            : 'Connection timeout. Please check your internet connection and try again.';
          setSpeechRecognitionError(errorMsg);
          dangerToaster(errorMsg);
        }
      }, 30000);

      // Log WebSocket state changes for debugging
      const logState = () => {
        if (ws) {
          console.log('WebSocket state:', {
            readyState: ws.readyState,
            CONNECTING: WebSocket.CONNECTING,
            OPEN: WebSocket.OPEN,
            CLOSING: WebSocket.CLOSING,
            CLOSED: WebSocket.CLOSED,
            isIOS
          });
        }
      };
      
      // Log initial state
      setTimeout(logState, 100);

      let aiText = "";

      ws.onopen = () => {
        addWorkFlowLog('WebSocket - onopen event fired! Connection established');
        console.log('WebSocket connected successfully', { isIOS, isMobile });
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
          addWorkFlowLog('WebSocket - Cleared connection timeout');
        }
        try {
          const messagePayload = { text: query + "" + memoryTranscript, language, voice };
          addWorkFlowLog(`WebSocket - Sending message (length: ${messagePayload.text.length})`);
          ws?.send(JSON.stringify(messagePayload));
          addWorkFlowLog('WebSocket - Message sent successfully');
          console.log('Message sent to WebSocket', { messageLength: messagePayload.text.length, isIOS });
        } catch (error) {
          addWorkFlowLog(`WebSocket - Error sending message: ${error}`);
          console.error('Error sending message to WebSocket:', error, { isIOS });
          setAiResponseLoading(false);
          const errorMsg = isIOS
            ? 'Failed to send message on iOS. Please try again.'
            : 'Failed to send message. Please try again.';
          setSpeechRecognitionError(errorMsg);
          dangerToaster(errorMsg);
        }
      };

      ws.onmessage = (event: any) => {
        hasReceivedData = true;
        setAiResponseLoading(false);
        const dataType = typeof event.data;
        const isString = typeof event.data === "string";
        const isArrayBuffer = event.data instanceof ArrayBuffer;
        addWorkFlowLog(`WebSocket - onmessage received! Type: ${dataType}, isString: ${isString}, isArrayBuffer: ${isArrayBuffer}`);
        console.log('WebSocket message received', { 
          dataType, 
          isString,
          isArrayBuffer,
          isIOS 
        });

        if (typeof event.data === "string") {
          const textChunk = event.data.replace("text:", "");
          aiText += textChunk;
          addWorkFlowLog(`WebSocket - Text chunk received (chunk: ${textChunk.length} chars, total: ${aiText.length} chars)`);
          console.log('Text chunk received', { chunkLength: textChunk.length, totalLength: aiText.length, isIOS });

          updateLastAIReply({
            id: messageId,
            text: aiText,
            isUser: false,
            timestamp: new Date(),
            type: 'ai',
            hasAudioReadout: audioReadOut,
            audioId: audioReadOut ? messageId : undefined
          });

          // ✅ persistent transcript (never cleared)
          setMemoryTranscript(prev => prev + textChunk);
        } else {
          // if user want audio read out then append audio to the source buffer
          if (audioReadOut) {
            addWorkFlowLog(`WebSocket - Binary audio data received (audioReadOut: true, useBlobFallback: ${useBlobFallback}, sourceBufferReady: ${sourceBufferReady})`);
            
            if (useBlobFallback) {
              // iOS: Collect audio chunks for blob playback
              addWorkFlowLog(`WebSocket - Collecting audio chunk for blob (chunk size: ${event.data.byteLength} bytes, total chunks: ${audioChunks.length + 1})`);
              audioChunks.push(event.data);
            } else {
              // Non-iOS: Use MediaSource streaming
              // Queue audio if sourceBuffer not ready, otherwise append directly
              if (sourceBufferReady && (sourceBufferRef as any).current) {
                addWorkFlowLog('WebSocket - Appending audio directly to sourceBuffer');
                appendAudio(event.data);
              } else {
                addWorkFlowLog(`WebSocket - Queuing audio (queue length: ${audioQueue.length})`);
                audioQueue.push(event.data);
              }
            }
          } else {
            addWorkFlowLog('WebSocket - Binary data received but audioReadOut is false, ignoring');
          }
        }
      };

      ws.onerror = (error: Event) => {
        addWorkFlowLog(`WebSocket - onerror event fired! Error: ${error}`);
        console.error('WebSocket error:', error);
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
        setAiResponseLoading(false);
        const errorMsg = isIOS 
          ? 'WebSocket connection failed on iOS. Please check your internet connection and try again.'
          : 'WebSocket connection error. Please try again.';
        setSpeechRecognitionError(errorMsg);
        dangerToaster(errorMsg);
      };

      ws.onclose = (event: CloseEvent) => {
        addWorkFlowLog(`WebSocket - onclose event fired! Code: ${event.code}, Reason: ${event.reason}, hasReceivedData: ${hasReceivedData}`);
        console.log('WebSocket closed:', event.code, event.reason);
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
        setAiResponseLoading(false);

        // If connection closed without receiving data and it wasn't a normal closure, show error
        if (!hasReceivedData && event.code !== 1000 && event.code !== 1001) {
          addWorkFlowLog(`WebSocket - Closed without receiving data! Code: ${event.code}`);
          const errorMsg = isIOS
            ? 'Connection closed unexpectedly on iOS. Please check your internet connection.'
            : 'Connection closed unexpectedly. Please try again.';
          setSpeechRecognitionError(errorMsg);
          dangerToaster(errorMsg);
        } else {
          addWorkFlowLog('WebSocket - Closed normally or after receiving data');
        }

        if (!audioReadOut) {
          addWorkFlowLog('WebSocket onclose - Handling non-audio message');
          
          // iOS blob fallback: Combine chunks and play as blob
          if (useBlobFallback && audioChunks.length > 0) {
            addWorkFlowLog(`WebSocket onclose - Using blob fallback for regular audio (${audioChunks.length} chunks)`);
            try {
              // Combine all audio chunks into a single blob
              const totalSize = audioChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
              addWorkFlowLog(`WebSocket onclose - Combining ${audioChunks.length} chunks (total size: ${totalSize} bytes)`);
              
              const combinedArray = new Uint8Array(totalSize);
              let offset = 0;
              for (const chunk of audioChunks) {
                combinedArray.set(new Uint8Array(chunk), offset);
                offset += chunk.byteLength;
              }
              
              // Create blob and play
              const blob = new Blob([combinedArray], { type: 'audio/mpeg' });
              const blobURL = URL.createObjectURL(blob);
              addWorkFlowLog(`WebSocket onclose - Created blob URL: ${blobURL.substring(0, 50)}...`);
              
              audioRef.current.src = blobURL;
              addWorkFlowLog('WebSocket onclose - Set audio source to blob URL');
              
              // Play audio
              audioRef.current.play().then(() => {
                addWorkFlowLog('WebSocket onclose - Blob audio playing successfully');
                setPlayingAudio(true);
                
                // Cleanup blob URL when audio ends
                audioRef.current.onended = () => {
                  URL.revokeObjectURL(blobURL);
                  addWorkFlowLog('WebSocket onclose - Blob audio ended, URL revoked');
                  setPlayingAudio(false);
                  setAudioPaused(false);
                  if (browserSupportsSpeechRecognition && micEnabledRef.current) {
                    resetTranscript();
                    setTimeout(() => {
                      startMic();
                    }, isMobile ? 500 : 100);
                  }
                };
              }).catch((error: any) => {
                addWorkFlowLog(`WebSocket onclose - Error playing blob audio: ${error}`);
                console.error("Error playing blob audio:", error);
                const errorMsg = 'Failed to play audio on iOS.';
                setSpeechRecognitionError(errorMsg);
                dangerToaster(errorMsg);
              });
            } catch (error: any) {
              const errorMsg = `Error creating blob audio: ${error?.message || error}`;
              addWorkFlowLog(`WebSocket onclose - ERROR creating blob: ${errorMsg}`);
              console.error("Error creating blob audio:", error);
              setSpeechRecognitionError(errorMsg);
              dangerToaster(errorMsg);
            }
            return; // Exit early for blob fallback
          }
          
          // MediaSource path for non-iOS
          // Original behavior for non-audio messages
          const finishAndPlay = () => {
            addWorkFlowLog('finishAndPlay - Starting');
            const sourceBuffer = (sourceBufferRef as any).current;
            const mediaSource = (mediaSourceRef as any).current;

            if (sourceBuffer && sourceBuffer.updating) {
              addWorkFlowLog('finishAndPlay - SourceBuffer updating, waiting...');
              sourceBuffer.addEventListener("updateend", finishAndPlay, { once: true });
              return;
            }

            if (mediaSource && mediaSource.readyState === "open") {
              try {
                addWorkFlowLog('finishAndPlay - Ending MediaSource stream');
                mediaSource.endOfStream();
              } catch (error) {
                addWorkFlowLog(`finishAndPlay - Error ending stream: ${error}`);
                console.error("Error ending stream:", error);
              }
            }

            let lastLoggedState = -1;
            let retryCount = 0;
            const MAX_RETRIES = 2;
            const tryPlay = () => {
              const audio = audioRef.current;
              
              // Check if max retries reached
              if (retryCount >= MAX_RETRIES) {
                addWorkFlowLog(`tryPlay - Max retries (${MAX_RETRIES}) reached. Failed to play audio.`);
                const errorMsg = 'Failed to play audio after multiple attempts. Please try again.';
                setSpeechRecognitionError(errorMsg);
                dangerToaster(errorMsg);
                return;
              }
              
              // Only log when state changes
              if (audio.readyState !== lastLoggedState) {
                addWorkFlowLog(`tryPlay - Audio readyState: ${audio.readyState} (retry: ${retryCount}/${MAX_RETRIES})`);
                lastLoggedState = audio.readyState;
              }
              retryCount++;
              
              if (audio.readyState >= 2) {
                audio.play().then(() => {
                  addWorkFlowLog('tryPlay - Audio playing successfully');
                  setPlayingAudio(true);
                }).catch((error) => {
                  addWorkFlowLog(`tryPlay - Error playing audio: ${error} (retry: ${retryCount}/${MAX_RETRIES})`);
                  console.error("Error playing audio:", error);
                  if (retryCount < MAX_RETRIES) {
                    setTimeout(tryPlay, 500);
                  } else {
                    addWorkFlowLog(`tryPlay - Max retries reached. Failed to play audio.`);
                    const errorMsg = 'Failed to play audio after multiple attempts. Please try again.';
                    setSpeechRecognitionError(errorMsg);
                    dangerToaster(errorMsg);
                  }
                });
              } else {
                if (retryCount < MAX_RETRIES) {
                  setTimeout(tryPlay, 100);
                } else {
                  addWorkFlowLog(`tryPlay - Max retries reached. Audio not ready (state: ${audio.readyState}).`);
                  const errorMsg = 'Audio not ready after multiple attempts. Please try again.';
                  setSpeechRecognitionError(errorMsg);
                  dangerToaster(errorMsg);
                }
              }
            };

            setTimeout(tryPlay, 100);
          };

          setTimeout(finishAndPlay, 100);

        audioRef.current.onended = () => {
          setPlayingAudio(false);
          setAudioPaused(false);
        if (browserSupportsSpeechRecognition && micEnabledRef.current) {
          resetTranscript();
          // Small delay for mobile browsers
          setTimeout(() => {
            startMic();
          }, isMobile ? 500 : 100);
        }
        };
      } else {
        addWorkFlowLog('WebSocket onclose - Handling audioReadout message');
        
        // iOS blob fallback: Combine chunks and play as blob
        if (useBlobFallback && audioChunks.length > 0) {
          addWorkFlowLog(`WebSocket onclose - Using blob fallback (${audioChunks.length} chunks)`);
          try {
            // Combine all audio chunks into a single blob
            const totalSize = audioChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
            addWorkFlowLog(`WebSocket onclose - Combining ${audioChunks.length} chunks (total size: ${totalSize} bytes)`);
            
            const combinedArray = new Uint8Array(totalSize);
            let offset = 0;
            for (const chunk of audioChunks) {
              combinedArray.set(new Uint8Array(chunk), offset);
              offset += chunk.byteLength;
            }
            
            // Create blob and play
            const blob = new Blob([combinedArray], { type: 'audio/mpeg' });
            const blobURL = URL.createObjectURL(blob);
            addWorkFlowLog(`WebSocket onclose - Created blob URL: ${blobURL.substring(0, 50)}...`);
            
            if (messageAudioRef) {
              messageAudioRef.src = blobURL;
              addWorkFlowLog('WebSocket onclose - Set audio source to blob URL');
              
              // Play audio
              messageAudioRef.play().then(() => {
                addWorkFlowLog(`WebSocket onclose - Blob audio playing successfully for messageId: ${messageId}`);
                setMessageAudioStates(prev => ({
                  ...prev,
                  [messageId]: { playing: true, paused: false, audioRef: messageAudioRef }
                }));
                
                // Cleanup blob URL when audio ends
                messageAudioRef.onended = () => {
                  URL.revokeObjectURL(blobURL);
                  addWorkFlowLog('WebSocket onclose - Blob audio ended, URL revoked');
                };
              }).catch((error: any) => {
                addWorkFlowLog(`WebSocket onclose - Error playing blob audio: ${error}`);
                console.error("Error playing blob audio:", error);
                const errorMsg = 'Failed to play audio on iOS.';
                setSpeechRecognitionError(errorMsg);
                dangerToaster(errorMsg);
              });
            } else {
              addWorkFlowLog('WebSocket onclose - messageAudioRef is null, cannot play blob audio');
            }
          } catch (error: any) {
            const errorMsg = `Error creating blob audio: ${error?.message || error}`;
            addWorkFlowLog(`WebSocket onclose - ERROR creating blob: ${errorMsg}`);
            console.error("Error creating blob audio:", error);
            setSpeechRecognitionError(errorMsg);
            dangerToaster(errorMsg);
          }
          return; // Exit early for blob fallback
        }
        
        // MediaSource path for non-iOS
        // Audio readout enabled - handle per-message audio
        const finishAndPlay = () => {
          addWorkFlowLog('finishAndPlay (audioReadout) - Starting');
          const sourceBuffer = (sourceBufferRef as any).current;
          const mediaSource = (mediaSourceRef as any).current;

          if (sourceBuffer && sourceBuffer.updating) {
            addWorkFlowLog('finishAndPlay (audioReadout) - SourceBuffer updating, waiting...');
            sourceBuffer.addEventListener("updateend", finishAndPlay, { once: true });
            return;
          }

          if (mediaSource && mediaSource.readyState === "open") {
            try {
              addWorkFlowLog('finishAndPlay (audioReadout) - Ending MediaSource stream');
              mediaSource.endOfStream();
            } catch (error) {
              addWorkFlowLog(`finishAndPlay (audioReadout) - Error ending stream: ${error}`);
              console.error("Error ending stream:", error);
            }
          }

          let lastLoggedStateAudioReadout = -1;
          let retryCountAudioReadout = 0;
          const MAX_RETRIES_AUDIO_READOUT = 2;
          const tryPlay = () => {
            if (messageAudioRef) {
              // Check if max retries reached
              if (retryCountAudioReadout >= MAX_RETRIES_AUDIO_READOUT) {
                addWorkFlowLog(`tryPlay (audioReadout) - Max retries (${MAX_RETRIES_AUDIO_READOUT}) reached. Failed to play audio.`);
                const errorMsg = 'Failed to play audio readout after multiple attempts.';
                setSpeechRecognitionError(errorMsg);
                dangerToaster(errorMsg);
                return;
              }
              
              // Only log when state changes
              if (messageAudioRef.readyState !== lastLoggedStateAudioReadout) {
                addWorkFlowLog(`tryPlay (audioReadout) - Audio readyState: ${messageAudioRef.readyState} (retry: ${retryCountAudioReadout}/${MAX_RETRIES_AUDIO_READOUT})`);
                lastLoggedStateAudioReadout = messageAudioRef.readyState;
              }
              retryCountAudioReadout++;
              
              // Check if audio has enough data to play
              if (messageAudioRef.readyState >= 2) { // HAVE_CURRENT_DATA or higher
                messageAudioRef.play().then(() => {
                  addWorkFlowLog(`tryPlay (audioReadout) - Audio playing successfully for messageId: ${messageId}`);
                  console.log('Audio readout started playing for message:', messageId);
                  setMessageAudioStates(prev => ({
                    ...prev,
                    [messageId]: { playing: true, paused: false, audioRef: messageAudioRef }
                  }));
                }).catch((error: any) => {
                  addWorkFlowLog(`tryPlay (audioReadout) - Error playing audio: ${error} (retry: ${retryCountAudioReadout}/${MAX_RETRIES_AUDIO_READOUT})`);
                  console.error("Error playing audio readout:", error);
                  if (retryCountAudioReadout < MAX_RETRIES_AUDIO_READOUT) {
                    setTimeout(tryPlay, 500);
                  } else {
                    addWorkFlowLog(`tryPlay (audioReadout) - Max retries reached. Failed to play audio.`);
                    const errorMsg = 'Failed to play audio readout after multiple attempts.';
                    setSpeechRecognitionError(errorMsg);
                    dangerToaster(errorMsg);
                  }
                });
              } else {
                if (retryCountAudioReadout < MAX_RETRIES_AUDIO_READOUT) {
                  setTimeout(tryPlay, 100);
                } else {
                  addWorkFlowLog(`tryPlay (audioReadout) - Max retries reached. Audio not ready (state: ${messageAudioRef.readyState}).`);
                  const errorMsg = 'Audio readout not ready after multiple attempts.';
                  setSpeechRecognitionError(errorMsg);
                  dangerToaster(errorMsg);
                }
              }
            } else {
              addWorkFlowLog('tryPlay (audioReadout) - messageAudioRef is null!');
            }
          };

          // Start trying to play after a short delay
          setTimeout(tryPlay, 200);
        };

        // Wait a bit for any remaining audio chunks to be processed
        setTimeout(finishAndPlay, 200);

        if (messageAudioRef) {
          messageAudioRef.onended = () => {
            addWorkFlowLog(`Audio readout - onended event for messageId: ${messageId}`);
            console.log('Audio readout finished for message:', messageId);
            setMessageAudioStates(prev => ({
              ...prev,
              [messageId]: { playing: false, paused: false, audioRef: messageAudioRef }
            }));
          };
          
          messageAudioRef.onerror = (error) => {
            addWorkFlowLog(`Audio readout - onerror event for messageId: ${messageId}, error: ${error}`);
            console.error('Audio readout error:', error);
            setMessageAudioStates(prev => ({
              ...prev,
              [messageId]: { playing: false, paused: false, audioRef: messageAudioRef }
            }));
          };
        }
      }
      };

    } catch (error: any) {
      addWorkFlowLog(`ERROR - Failed to create WebSocket: ${error.message || error}`);
      console.error('Error creating WebSocket:', error);
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
      setAiResponseLoading(false);
      const errorMsg = isIOS
        ? 'Failed to create WebSocket connection on iOS. Please check your internet connection and try again.'
        : 'Failed to create WebSocket connection. Please try again.';
      setSpeechRecognitionError(errorMsg);
      dangerToaster(errorMsg);
    }
  };

  /* ---------------- AUDIO ---------------- */
  const appendAudio = (data: ArrayBuffer) => {
    const sourceBuffer = (sourceBufferRef as any).current;
    if (!sourceBuffer) {
      addWorkFlowLog('appendAudio - SourceBuffer not ready');
      console.warn("SourceBuffer not ready");
      return;
    }

    const append = () => {
      if (!sourceBuffer || sourceBuffer.updating) {
        setTimeout(append, 25);
      } else {
        try {
          addWorkFlowLog(`appendAudio - Appending buffer (size: ${data.byteLength} bytes)`);
          sourceBuffer.appendBuffer(new Uint8Array(data));
        } catch (error) {
          addWorkFlowLog(`appendAudio - Error appending buffer: ${error}`);
          console.error("Error appending audio buffer:", error);
        }
      }
    };
    append();
  };

  /* ================= AUDIO CONTROLS ================= */
  const toggleAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.paused
      ? audioRef.current.play()
      : audioRef.current.pause();

    setAudioPaused(!audioPaused);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRemoveSelectedText = (messageId: string) => {
    setMessages(messages?.filter(msg => msg.id !== messageId) || []);
    removeSelectedText(messageId);
  };

  const handleChipClick = (chipText: string) => {
    if (chipText === 'Clear') {
      clearChat();
      setInputText('');
      setMemoryTranscript('');
      lastFinalRef.current = "";
      (wsRef as any).current?.close();
      audioRef.current.pause();
      setPlayingAudio(false);
      setAiResponseLoading(false);
      if (browserSupportsSpeechRecognition) {
        resetTranscript();
      }
    } else {
      handleSendMessage(chipText);
    }
  };

  const handleVoiceToggle = async () => {
    // Clear any previous errors
    setSpeechRecognitionError(null);
    
    if (!browserSupportsSpeechRecognition) {
      setSpeechToTextBrowserSupported(false);
      const errorMsg = 'Speech recognition is not supported in your browser';
      setSpeechRecognitionError(errorMsg);
      dangerToaster(errorMsg);
      return;
    }

    // Request microphone permission on mobile
    if (isMobile && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error: any) {
        console.error('Microphone permission denied:', error);
        const errorMsg = 'Microphone permission is required for speech recognition. Please enable it in your browser settings.';
        setSpeechRecognitionError(errorMsg);
        dangerToaster('Microphone permission is required for speech recognition');
        return;
      }
    }

    if (listening) {
      try {
        SpeechRecognition.stopListening();
        setSpeechRecognitionError(null);
      } catch (error: any) {
        console.error('Error stopping speech recognition:', error);
        const errorMsg = 'Error stopping speech recognition. Please try again.';
        setSpeechRecognitionError(errorMsg);
      }
    } else {
      try {
        // Request microphone permission on mobile (especially important for Android)
        const isAndroid = isMobile && !isIOS;
        if (isMobile && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          addWorkFlowLog(`handleVoiceToggle - Requesting microphone permission (isAndroid: ${isAndroid})`);
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            addWorkFlowLog('handleVoiceToggle - Microphone permission granted');
          } catch (error: any) {
            console.error('Microphone permission denied:', error);
            addWorkFlowLog(`handleVoiceToggle - Microphone permission denied: ${error?.message || error}`);
            const errorMsg = 'Microphone permission is required. Please enable it in your browser settings.';
            setSpeechRecognitionError(errorMsg);
            dangerToaster(errorMsg);
            return;
          }
        }
        
        // Mobile browsers need different options
        // For Android, try continuous mode as it may work better for capturing audio
        const options: any = {
          language: language,
          continuous: isAndroid ? true : false, // Android may need continuous mode to capture audio
          interimResults: true, // Important for real-time updates
        };
        
        // For Android, add a small delay and try to access native API directly
        if (isAndroid) {
          addWorkFlowLog(`handleVoiceToggle - Android detected, adding delay before starting`);
          await new Promise(resolve => setTimeout(resolve, 500)); // Increased delay for Android
          
          // Try to access native SpeechRecognition API for better Android support
          const SpeechRecognitionNative = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          if (SpeechRecognitionNative) {
            addWorkFlowLog('handleVoiceToggle - Native SpeechRecognition API available');
            try {
              const recognition = new SpeechRecognitionNative();
              recognition.continuous = true;
              recognition.interimResults = true;
              recognition.lang = language;
              recognition.maxAlternatives = 1;
              
              // Add comprehensive event handlers for debugging
              recognition.onstart = () => {
                addWorkFlowLog('handleVoiceToggle - Native recognition onstart event');
                // Verify microphone access
                navigator.mediaDevices.getUserMedia({ audio: true })
                  .then(stream => {
                    addWorkFlowLog('handleVoiceToggle - Microphone stream active, tracks: ' + stream.getAudioTracks().length);
                    // Don't stop the stream, let recognition use it
                  })
                  .catch(err => {
                    addWorkFlowLog(`handleVoiceToggle - WARNING: Could not verify microphone stream: ${err.message}`);
                  });
              };
              
              recognition.onaudiostart = () => {
                addWorkFlowLog('handleVoiceToggle - Native recognition onaudiostart - Audio capture started');
              };
              
              recognition.onaudioend = () => {
                addWorkFlowLog('handleVoiceToggle - Native recognition onaudioend - Audio capture ended');
              };
              
              recognition.onsoundstart = () => {
                addWorkFlowLog('handleVoiceToggle - Native recognition onsoundstart - Sound detected');
              };
              
              recognition.onsoundend = () => {
                addWorkFlowLog('handleVoiceToggle - Native recognition onsoundend - Sound ended');
              };
              
              recognition.onspeechstart = () => {
                addWorkFlowLog('handleVoiceToggle - Native recognition onspeechstart - Speech detected');
              };
              
              recognition.onspeechend = () => {
                addWorkFlowLog('handleVoiceToggle - Native recognition onspeechend - Speech ended');
              };
              
              recognition.onnomatch = () => {
                addWorkFlowLog('handleVoiceToggle - Native recognition onnomatch - No speech match found');
              };
              
              recognition.onresult = (event: any) => {
                addWorkFlowLog(`handleVoiceToggle - Native recognition onresult event (resultIndex: ${event.resultIndex}, results.length: ${event.results.length})`);
                let interimTranscript = '';
                let finalTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                  const result = event.results[i];
                  const transcript = result[0].transcript;
                  const confidence = result[0].confidence;
                  addWorkFlowLog(`handleVoiceToggle - Result ${i}: transcript="${transcript}", isFinal=${result.isFinal}, confidence=${confidence}`);
                  
                  if (result.isFinal) {
                    finalTranscript += transcript + ' ';
                  } else {
                    interimTranscript += transcript + ' ';
                  }
                }
                
                if (finalTranscript || interimTranscript) {
                  addWorkFlowLog(`handleVoiceToggle - Native recognition transcript: final="${finalTranscript.trim()}", interim="${interimTranscript.trim()}"`);
                  const combined = (finalTranscript + interimTranscript).trim();
                  setInputText(combined);
                } else {
                  addWorkFlowLog('handleVoiceToggle - WARNING: onresult fired but no transcript found');
                }
              };
              
              recognition.onerror = (event: any) => {
                addWorkFlowLog(`handleVoiceToggle - Native recognition onerror: error="${event.error}", message="${event.message || 'N/A'}"`);
                const errorMsg = `Speech recognition error: ${event.error}. Please try again.`;
                setSpeechRecognitionError(errorMsg);
                dangerToaster(errorMsg);
                
                // Don't auto-restart on certain errors
                if (event.error === 'not-allowed' || event.error === 'no-speech') {
                  addWorkFlowLog('handleVoiceToggle - Critical error, not auto-restarting');
                  micEnabledRef.current = false;
                }
              };
              
              recognition.onend = () => {
                addWorkFlowLog('handleVoiceToggle - Native recognition onend event');
                
                // Check if we got any results before ending
                const hasResults = finalTranscript || interimTranscript;
                if (!hasResults) {
                  addWorkFlowLog('handleVoiceToggle - WARNING: Recognition ended without any results. This may indicate audio capture issue.');
                }
                
                // Auto-restart if mic is still enabled and we're in continuous mode
                if (micEnabledRef.current && recognition.continuous) {
                  setTimeout(() => {
                    try {
                      addWorkFlowLog('handleVoiceToggle - Attempting to restart native recognition...');
                      recognition.start();
                      addWorkFlowLog('handleVoiceToggle - Native recognition restarted successfully');
                    } catch (e: any) {
                      addWorkFlowLog(`handleVoiceToggle - Error restarting native recognition: ${e?.message || e}`);
                      // If restart fails, try to reinitialize
                      if (e?.message?.includes('already started') || e?.message?.includes('aborted')) {
                        addWorkFlowLog('handleVoiceToggle - Recognition may be in bad state, will need manual restart');
                      }
                    }
                  }, 500); // Increased delay for Android
                } else {
                  addWorkFlowLog('handleVoiceToggle - Not auto-restarting (micEnabled: ' + micEnabledRef.current + ', continuous: ' + recognition.continuous + ')');
                }
              };
              
              recognition.start();
              addWorkFlowLog('handleVoiceToggle - Native SpeechRecognition started directly');
              setSpeechRecognitionError(null);
              
              // Store recognition instance for cleanup
              (window as any).__androidRecognition = recognition;
              
              return; // Exit early, using native API
            } catch (nativeError: any) {
              addWorkFlowLog(`handleVoiceToggle - Failed to use native API, falling back to library: ${nativeError?.message || nativeError}`);
            }
          }
        }
        
        addWorkFlowLog(`handleVoiceToggle - Starting speech recognition (continuous: ${options.continuous}, language: ${options.language}, isAndroid: ${isAndroid})`);
        SpeechRecognition.startListening(options);
        setSpeechRecognitionError(null);
        addWorkFlowLog('handleVoiceToggle - Speech recognition started successfully');
        
        // Monitor for transcript updates on Android
        if (isAndroid) {
          const checkInterval = setInterval(() => {
            if (!listening) {
              clearInterval(checkInterval);
              addWorkFlowLog('handleVoiceToggle - Speech recognition stopped');
            } else {
              // Log if we're listening but no transcripts are coming
              if (finalTranscript === '' && interimTranscript === '') {
                addWorkFlowLog('handleVoiceToggle - WARNING: Listening but no transcripts received yet (Android)');
              } else {
                clearInterval(checkInterval); // Stop checking once we get transcripts
              }
            }
          }, 2000);
          
          // Clear interval after 10 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
          }, 10000);
        }
      } catch (error: any) {
        console.error('Error starting speech recognition:', error);
        addWorkFlowLog(`handleVoiceToggle - ERROR: ${error?.message || error}`);
        const errorMsg = error?.message || 'Failed to start speech recognition. Please check your microphone permissions and try again.';
        setSpeechRecognitionError(errorMsg);
        dangerToaster(errorMsg);
      }
    }
  };

  const handleTextareaFocus = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    }
  };

  if (!isCustomSheetOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="custom-modal-backdrop" onClick={handleClose} />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`custom-sheet-modal ${isExpanded ? 'expanded' : 'collapsed'} ${isInitialAppear ? 'initial-appear' : ''}`}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-handle" />
          {speechRecognitionError && (
            <div className="speech-recognition-error-banner">
              <IonText className="error-text">{speechRecognitionError}</IonText>
              <IonButton
                fill="clear"
                size="small"
                onClick={() => setSpeechRecognitionError(null)}
                className="error-close-button"
              >
                <IonIcon icon={close} />
              </IonButton>
            </div>
          )}
          <div className="modal-actions">
            <IonButton
              fill="clear"
              onClick={() => {
                clearChat();
                setInputText('');
                setMemoryTranscript('');
                lastFinalRef.current = "";
                (wsRef as any).current?.close();
                audioRef.current.pause();
                setPlayingAudio(false);
                setAiResponseLoading(false);
                if (browserSupportsSpeechRecognition) {
                  resetTranscript();
                }
              }}
              className="clear-button"
            >
              <IonIcon icon={trashOutline} />
            </IonButton>
            <IonButton
              fill="clear"
              onClick={handleExpand}
              className="expand-button"
            >
              <IonIcon icon={isExpanded ? contract : expand} />
            </IonButton>
            <IonButton
              fill="clear"
              onClick={handleClose}
              className="close-button"
            >
              <IonIcon icon={close} />
            </IonButton>
          </div>
        </div>

        {/* Content */}
        <div className="modal-content">
          <IonContent className="chat-content">
            <div className="messages-container">
              {messages && messages.length > 0 && messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.type === 'user' ? 'user-message' : message.type === 'selected-text' ? 'selected-text-message' : 'ai-message'}`}
                >
                  {message.type === 'selected-text' ? (
                    <div className="selected-text-container">
                      <div className="selected-text-header">
                        <span className="selected-text-label">Selected Text</span>
                        <IonButton
                          fill="clear"
                          size="small"
                          onClick={() => handleRemoveSelectedText(message.id)}
                          className="remove-selected-button"
                        >
                          <IonIcon icon={close} />
                        </IonButton>
                      </div>
                      <div className="selected-text-content">
                        {message.isSelectedTextHTML ? <div dangerouslySetInnerHTML={{ __html: message.text }} /> : <IonText>{message.text}</IonText>}
                      </div>
                      <div className="message-time">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="message-bubble">
                      {message.type !== 'ai' && <IonText>{message.text}</IonText>}
                      {message.type == 'ai' && (
                        <div dangerouslySetInnerHTML={{ __html: message.text }} />
                      )}
                      <div className="message-time">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      {/* Audio readout video and controls for AI messages */}
                      {message.type === 'ai' && message.hasAudioReadout && message.audioId && (
                        <AudioReadoutControls
                          messageId={message.audioId}
                          audioState={messageAudioStates[message.audioId]}
                          onTogglePlayPause={(messageId) => {
                            const audioState = messageAudioStates[messageId];
                            const audioRef = audioState?.audioRef;

                            if (audioRef) {
                              if (audioState?.playing && !audioState.paused) {
                                audioRef.pause();
                                setMessageAudioStates(prev => ({
                                  ...prev,
                                  [messageId]: { ...prev[messageId], paused: true }
                                }));
                              } else {
                                audioRef.play().then(() => {
                                  setMessageAudioStates(prev => ({
                                    ...prev,
                                    [messageId]: { ...prev[messageId], playing: true, paused: false }
                                  }));
                                }).catch(() => { });
                              }
                            }
                          }}
                          videoRefs={videoRefs}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
              {aiResponseLoading && (
                <div className="message ai-message-loading">
                  <div className="message-bubble">
                    <IonText>Thinking...</IonText>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </IonContent>

          {/* Workflow Log Section */}
          <div className="workflow-log-section">
            <div 
              className="workflow-log-header"
              onClick={() => setShowWorkFlowLog(!showWorkFlowLog)}
            >
              <IonText className="workflow-log-title">
                Workflow Log {workFlow.length > 0 && `(${workFlow.length})`}
              </IonText>
              <div className="workflow-log-actions">
                {workFlow.length > 0 && (
                  <IonButton
                    fill="clear"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setWorkFlow([]);
                    }}
                    className="workflow-clear-button"
                  >
                    <IonIcon icon={trashOutline} />
                  </IonButton>
                )}
                <IonIcon 
                  icon={showWorkFlowLog ? contract : expand} 
                  className="workflow-toggle-icon"
                />
              </div>
            </div>
            {showWorkFlowLog && (
              <div className="workflow-log-container" ref={workFlowRef}>
                {workFlow.length === 0 ? (
                  <IonText className="workflow-log-empty">No logs yet. Actions will appear here.</IonText>
                ) : (
                  workFlow.map((log, index) => (
                    <div key={index} className="workflow-log-item">
                      <IonText className="workflow-log-text">{log}</IonText>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Speech to text browser supported */}
          {!speechToTextBrowserSupported && (
            <div className="speech-to-text-browser-supported">
              <IonText>Speech to text is not supported in your browser</IonText>
            </div>
          )}

          {/* Input Area */}
          <div className="input-area">
            <div className="input-area-content">
              <IonTextarea
                value={inputText}
                onIonInput={(e) => setInputText(e.detail.value!)}
                onKeyDown={handleKeyPress}
                onFocus={handleTextareaFocus}
                placeholder="Ask anything"
                className="message-input"
                rows={1}
                autoGrow={true}
              />
              {/* <div className='input-area-buttons'>
                <IonButton
                  fill="solid"
                  onClick={() => { handleTextareaFocus(); handleSendMessage() }}
                  disabled={!inputText.trim()}
                  className="send-button"
                >
                  <IonIcon icon={send} />
                </IonButton>
              </div> */}
            </div>
            {/* Chip Buttons Row */}
            <div className="chips-row">
              <div className="display-flex">
                <IonButton
                  className={`voice-chip ${listening ? 'listening' : ''}`}
                  onClick={handleVoiceToggle}
                  style={
                    {
                      padding: '0px',
                      borderRadius: '16px'
                    }}
                >
                  {listening ? (
                    <img
                      src={audioIcon}
                      alt="Listening"
                      className="audio-wave-gif"
                    />
                  ) : (
                    <IonIcon icon={mic} />
                  )}
                  <IonText>Voice</IonText>
                  {/* {listening && (
                  <>
                    <span className="voice-wave wave-1"></span>
                    <span className="voice-wave wave-2"></span>
                    <span className="voice-wave wave-3"></span>
                  </>
                )} */}
                </IonButton>
                {predefinedChips.filter(chip => chip.text == 'Translate').map((chip, index) => (
                  <IonChip
                    key={index}
                    className={`action-chip ${chip.text === 'Clear' ? 'clear-chip' : ''}`}
                    onClick={() => handleChipClick(chip.text)}
                  >
                    <IonIcon icon={chip.icon} />
                    {chip.text !== 'Clear' && <IonText>{chip.text}</IonText>}
                  </IonChip>
                ))}

              </div>

              <div className="action-chips">

                <IonButton
                  fill="solid"
                  onClick={() => { handleTextareaFocus(); handleSendMessage() }}
                  disabled={!inputText.trim()}
                  className="send-button"
                >
                  <IonIcon icon={arrowUp} />
                </IonButton>
                <IonButton
                  fill="outline"
                  onClick={() => { handleTextareaFocus(); handleSendMessage('', true) }}
                  disabled={!inputText.trim()}
                  className="send-button"
                >
                  <IonIcon icon={cloudUploadOutline} />
                </IonButton>
                {/* {predefinedChips.map((chip, index) => (
                  <IonChip
                    key={index}
                    className={`action-chip ${chip.text === 'Clear' ? 'clear-chip' : ''}`}
                    onClick={() => handleChipClick(chip.text)}
                  >
                    <IonIcon icon={chip.icon} />
                    {chip.text !== 'Clear' && <IonText>{chip.text}</IonText>}
                  </IonChip>
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomSheetModal;

