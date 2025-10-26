import React, { useState, useRef, useEffect } from 'react';
import { IonButton, IonIcon, IonContent, IonTextarea, IonText } from '@ionic/react';
import { close, expand, contract } from 'ionicons/icons';
import './CustomSheetModal.css';
import { useChatsStore } from '../../../services/store/chats.store';
import { useChapterStore } from '../../../services/store/chapter.store';
import { AskOpenAIAssistant } from '../../../services/homeService';
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
}

interface CustomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: string;
  selectedText?: string;
}
const CustomSheetModal: React.FC<CustomSheetModalProps> = ({ isOpen, onClose, trigger, selectedText }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCustomSheetOpen, setIsCustomSheetOpen] = useState(false);
  const [isInitialAppear, setIsInitialAppear] = useState(false);
  const [messages, setMessages] = useState<Message[]>();
  const [inputText, setInputText] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiResponseLoading, setAiResponseLoading] = useState(false);

  // chat and chapter info store
  const chapterInfo = useChapterStore((state: any) => state.chapterInfo);
  const chatInfo = useChatsStore((state: any) => state.chatInfo);
  const setIsChatOpen = useChatsStore((state: any) => state.setIsChatOpen);
  const removeSelectedText = useChatsStore((state: any) => state.removeSelectedText);
  const setAIReply = useChatsStore((state: any) => state.setAIReply);
  const setUserMessage = useChatsStore((state: any) => state.setUserMessage); 
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

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date(),
        type: 'user'
      };

      // setMessages([...messages || [], newMessage]);
      setUserMessage(newMessage);
      setInputText('');

      setAiResponseLoading(true);
      const response = await AskOpenAIAssistant({
        prompt: 'magnet', // newMessage.text,
        chapterId: 12 // chapterInfo.chapterId
      }).then((response) => {
        setAiResponseLoading(false);
        if (response.responseStatus === 'DATA_FOUND') {
          setAIReply({
            id: (Date.now() + 1).toString(),
            text: response.data.response,
            isUser: false,
            timestamp: new Date(),
            type: 'ai'
          });
        }
      }).catch((error) => {
        setAiResponseLoading(false);
        console.log(error);
      });
    }
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
                        <IonText>{message.text}</IonText>
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
            <IonTextarea
              value={inputText}
              onIonInput={(e) => setInputText(e.detail.value!)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="message-input"
              rows={1}
              autoGrow={true}
            />
            <IonButton
              fill="solid"
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="send-button"
            >
              Send
            </IonButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomSheetModal;
