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
  const transcriptRef = useRef(null);
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
  const { finalTranscript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

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

  // Update input text when speech recognition final transcript changes
  useEffect(() => {
    if (finalTranscript) {
      setInputText(finalTranscript);
    }
  }, [finalTranscript]);

  // Handle mobile browser speech recognition initialization
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      return;
    }

    // For mobile browsers, check if we need to request permissions
    const checkPermissions = async () => {
      if (isMobile && navigator.permissions) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          if (result.state === 'denied') {
            setSpeechToTextBrowserSupported(false);
          }
        } catch (error) {
          // Permissions API might not be available, that's okay
          console.log('Permissions API not available');
        }
      }
    };

    checkPermissions();
  }, [browserSupportsSpeechRecognition, isMobile]);

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
  const startMic = () => {
    micEnabledRef.current = true;
    if (browserSupportsSpeechRecognition) {
      try {
        // Mobile browsers need different options
        const options: any = {
          language: language,
          continuous: !isMobile, // iOS doesn't support continuous mode well
          interimResults: true,
        };
        
        // For iOS, we need to be more careful
        if (isIOS) {
          options.continuous = false;
        }
        
        SpeechRecognition.startListening(options);
        setSpeechRecognitionError(null);
      } catch (error: any) {
        console.error('Error starting speech recognition:', error);
        const errorMsg = 'Failed to start speech recognition. Please check microphone permissions.';
        setSpeechRecognitionError(errorMsg);
        dangerToaster(errorMsg);
      }
    }
  };

  const stopMic = () => {
    micEnabledRef.current = false;
    if (browserSupportsSpeechRecognition) {
      try {
        SpeechRecognition.stopListening();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };

  /* ================= ASK ================= */
  const handleAsk = (query: string, audioReadOut: boolean = false) => {
    if (!query.trim()) return;

    stopMic();
    setAiResponseLoading(true);
    lastFinalRef.current = "";

    // Create a unique message ID for this response
    const messageId = (Date.now() + 1).toString();
    currentAudioMessageIdRef.current = audioReadOut ? messageId : null;

    // If audio readout is enabled, create a new audio element for this message
    let messageAudioRef: HTMLAudioElement | null = null;
    if (audioReadOut) {
      messageAudioRef = new Audio();
      setMessageAudioStates(prev => ({
        ...prev,
        [messageId]: { playing: false, paused: false, audioRef: messageAudioRef }
      }));
    }

    // Clear previous audio (only if not per-message audio)
    if (!audioReadOut) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const mediaSource = new MediaSource();
    (mediaSourceRef as any).current = mediaSource;
    const audioQueue: ArrayBuffer[] = [];
    let sourceBufferReady = false;

    mediaSource.addEventListener("sourceopen", () => {
      try {
        // Try different MIME types for better browser compatibility
        let mimeType = "audio/mpeg";
        if (!MediaSource.isTypeSupported("audio/mpeg")) {
          // Try alternative formats
          if (MediaSource.isTypeSupported("audio/mp4")) {
            mimeType = "audio/mp4";
          } else if (MediaSource.isTypeSupported("audio/webm")) {
            mimeType = "audio/webm";
          } else {
            console.warn("MediaSource may not support the audio format");
          }
        }

        (sourceBufferRef as any).current = mediaSource.addSourceBuffer(mimeType);
        sourceBufferReady = true;

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
      } catch (error) {
        console.error("Error creating source buffer:", error);
      }
    });

    // Use message-specific audio ref if audioReadOut is enabled
    const targetAudioRef = audioReadOut && messageAudioRef ? messageAudioRef : audioRef.current;
    targetAudioRef.src = URL.createObjectURL(mediaSource);

    const ws = new WebSocket("wss://padai.app/services/ws/vectorchat");
    ws.binaryType = "arraybuffer";
    (wsRef as any).current = ws;

    let aiText = "";

    ws.onopen = () => {
      ws.send(JSON.stringify({ text: query + "" + memoryTranscript, language, voice }));
    };

    ws.onmessage = (event: any) => {
      setAiResponseLoading(false);

      if (typeof event.data === "string") {
        const textChunk = event.data.replace("text:", "");
        aiText += textChunk;

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
          // Queue audio if sourceBuffer not ready, otherwise append directly
          if (sourceBufferReady && (sourceBufferRef as any).current) {
            appendAudio(event.data);
          } else {
            audioQueue.push(event.data);
          }
        }
      }
    };

    ws.onclose = () => {
      setAiResponseLoading(false);

      if (!audioReadOut) {
        // Original behavior for non-audio messages
        const finishAndPlay = () => {
          const sourceBuffer = (sourceBufferRef as any).current;
          const mediaSource = (mediaSourceRef as any).current;

          if (sourceBuffer && sourceBuffer.updating) {
            sourceBuffer.addEventListener("updateend", finishAndPlay, { once: true });
            return;
          }

          if (mediaSource && mediaSource.readyState === "open") {
            try {
              mediaSource.endOfStream();
            } catch (error) {
              console.error("Error ending stream:", error);
            }
          }

          const tryPlay = () => {
            const audio = audioRef.current;
            if (audio.readyState >= 2) {
              audio.play().then(() => {
                setPlayingAudio(true);
              }).catch((error) => {
                console.error("Error playing audio:", error);
                setTimeout(tryPlay, 500);
              });
            } else {
              setTimeout(tryPlay, 100);
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
        // Audio readout enabled - handle per-message audio
        const finishAndPlay = () => {
          const sourceBuffer = (sourceBufferRef as any).current;
          const mediaSource = (mediaSourceRef as any).current;

          if (sourceBuffer && sourceBuffer.updating) {
            sourceBuffer.addEventListener("updateend", finishAndPlay, { once: true });
            return;
          }

          if (mediaSource && mediaSource.readyState === "open") {
            try {
              mediaSource.endOfStream();
            } catch (error) {
              console.error("Error ending stream:", error);
            }
          }

          const tryPlay = () => {
            if (messageAudioRef && messageAudioRef.readyState >= 2) {
              messageAudioRef.play().then(() => {
                setMessageAudioStates(prev => ({
                  ...prev,
                  [messageId]: { playing: true, paused: false, audioRef: messageAudioRef }
                }));
              }).catch((error) => {
                console.error("Error playing audio:", error);
                setTimeout(tryPlay, 500);
              });
            } else if (messageAudioRef) {
              setTimeout(tryPlay, 100);
            }
          };

          setTimeout(tryPlay, 100);
        };

        setTimeout(finishAndPlay, 100);

        if (messageAudioRef) {
          messageAudioRef.onended = () => {
            setMessageAudioStates(prev => ({
              ...prev,
              [messageId]: { playing: false, paused: false, audioRef: messageAudioRef }
            }));
          };
        }
      }
    };

    ws.onerror = (event: any) => {
      console.error('WebSocket error:', event);
      setSpeechRecognitionError('WebSocket error. Please check your internet connection.');
      dangerToaster('WebSocket error. Please check your internet connection.');
    };
  };

  /* ---------------- AUDIO ---------------- */
  const appendAudio = (data: ArrayBuffer) => {
    const sourceBuffer = (sourceBufferRef as any).current;
    if (!sourceBuffer) {
      console.warn("SourceBuffer not ready");
      return;
    }

    const append = () => {
      if (!sourceBuffer || sourceBuffer.updating) {
        setTimeout(append, 25);
      } else {
        try {
          sourceBuffer.appendBuffer(new Uint8Array(data));
        } catch (error) {
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
        // Mobile browsers need different options
        const options: any = {
          language: language,
          continuous: !isMobile, // iOS doesn't support continuous mode well
          interimResults: true,
        };
        
        // For iOS, we need to be more careful
        if (isIOS) {
          options.continuous = false;
        }
        
        SpeechRecognition.startListening(options);
        setSpeechRecognitionError(null);
      } catch (error: any) {
        console.error('Error starting speech recognition:', error);
        const errorMsg = error.message || 'Failed to start speech recognition. Please check your microphone permissions and try again.';
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

