import React, { useState, useRef, useEffect } from 'react';
import { IonButton, IonIcon, IonContent, IonTextarea, IonText, IonChip } from '@ionic/react';
import { close, expand, contract, mic, send, bulbOutline, languageOutline, closeOutline } from 'ionicons/icons';
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
}

interface CustomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: string;
  selectedText?: string;
}
const CustomSheetModal: React.FC<CustomSheetModalProps> = ({ isOpen, onClose, trigger, selectedText }) => {
  const wsRef = useRef(null);
  const chatRef = useRef(null);
  const audioRef = useRef(new Audio());

  const [playingAudio, setPlayingAudio] = useState(false);
  const [audioPaused, setAudioPaused] = useState(false);

  const { dangerToaster } = useToaster();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCustomSheetOpen, setIsCustomSheetOpen] = useState(false);
  const [isInitialAppear, setIsInitialAppear] = useState(false);
  const [messages, setMessages] = useState<Message[]>();
  const [inputText, setInputText] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiResponseLoading, setAiResponseLoading] = useState(false);

  // Speech Recognition
  const { finalTranscript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

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
    }

    return () => {
      document.body.style.overflow = 'unset';
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsExpanded(false);
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

  const handleSendMessage = async (defaultText: string = '') => {
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

      handleAsk(promptText);
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

  /* ================= ASK ================= */
  const handleAsk = (query: string) => {
    if (!query.trim()) return;


    resetTranscript();
    setAiResponseLoading(true);

    const ws = new WebSocket("wss://padai.app/services/ws/vectorchat");
    (wsRef as any).current = ws;

    let aiText = "";

    ws.onopen = () => ws.send(JSON.stringify({ text: query }));

    ws.onmessage = (e) => {
      setAiResponseLoading(false);
      if (typeof e.data === "string") {
        aiText += e.data.replace("text:", "");
        // setMessages((m) => {
        //   const last = m[m.length - 1];
        //   if (last?.role === "ai") {
        //     return [...m.slice(0, -1), { role: "ai", text: aiText }];
        //   }
        //   return [...m, { role: "ai", text: aiText }];
        // })


        updateLastAIReply({
          id: (Date.now() + 1).toString(),
          text: aiText,
          isUser: false,
          timestamp: new Date(),
          type: 'ai'
        });
      }
    };

    ws.onclose = () => {
      playTTS();
    };

  };

  /* ================= AUDIO CONTROLS ================= */
  const playTTS = () => {
    audioRef.current.src =
      "https://d1rb72t9cnnyis.cloudfront.net/common/AI+Buddy+Teaching.mp4";
    audioRef.current.play();
    setPlayingAudio(true);
    setAudioPaused(false);

    audioRef.current.onended = () => {
      setPlayingAudio(false);
      setAudioPaused(false);
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    };
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
      if (browserSupportsSpeechRecognition) {
        resetTranscript();
      }
    } else {
      handleSendMessage(chipText);
    }
  };

  const handleVoiceToggle = () => {
    if (!browserSupportsSpeechRecognition) {
      dangerToaster('Speech recognition is not supported in your browser');
      return;
    }
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
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
          <div className="modal-actions">
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
              <div className='input-area-buttons'>
                <IonButton
                  fill="solid"
                  onClick={() => { handleTextareaFocus(); handleSendMessage() }}
                  disabled={!inputText.trim()}
                  className="send-button"
                >
                  <IonIcon icon={send} />
                </IonButton>
              </div>
            </div>
            {/* Chip Buttons Row */}
            <div className="chips-row">
              <IonChip
                className={`voice-chip ${listening ? 'listening' : ''}`}
                onClick={handleVoiceToggle}
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
              </IonChip>
              <div className="action-chips">
                {predefinedChips.map((chip, index) => (
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomSheetModal;
