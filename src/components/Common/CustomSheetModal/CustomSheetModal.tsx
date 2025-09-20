import React, { useState, useRef, useEffect } from 'react';
import { IonButton, IonIcon, IonContent, IonTextarea, IonText } from '@ionic/react';
import { close, expand, contract } from 'ionicons/icons';
import './CustomSheetModal.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface CustomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: string;
  selectedText?: string;

}

const CustomSheetModal: React.FC<CustomSheetModalProps> = ({ isOpen, onClose, trigger }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');

      // Simulate AI response after a short delay
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'I received your message: "' + newMessage.text + '". This is a simulated response.',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="custom-modal-backdrop" onClick={handleClose} />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className={`custom-sheet-modal ${isExpanded ? 'expanded' : 'collapsed'}`}
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
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
                >
                  <div className="message-bubble">
                    <IonText>{message.text}</IonText>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
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
