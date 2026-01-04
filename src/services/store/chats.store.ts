import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';


interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    type: 'ai' | 'user' | 'selected-text';
    isSelectedTextHTML?: boolean;
}

interface ChatInfo {
    messages: Message[];
    isChatOpen: boolean;
}


interface ChatsStore {
    chatInfo: ChatInfo;
    setIsChatOpen: (isChatOpen: boolean) => void;
    setAIReply: (message: Message) => void;
    updateLastAIReply: (message: Message) => void;
    setUserMessage: (message: Message) => void;
    setSelectedText: (text: string, isSelectedTextHTML: boolean) => void;
    removeSelectedText: (messageId: string) => void;
}
const initialState: ChatsStore = {
    chatInfo: {
        messages: [],
        isChatOpen: false,
    },
    setIsChatOpen: () => { },
    setAIReply: () => { },
    updateLastAIReply: () => { },
    setUserMessage: () => { },
    setSelectedText: (text: string, isSelectedTextHTML: boolean) => { },
    removeSelectedText: () => { },
}


export const useChatsStore = create<ChatsStore>()(
    persist(
        (set) => ({
            ...initialState,
            setIsChatOpen: (isChatOpen: boolean) => set((state: any) => ({
                ...state,
                chatInfo: {
                    ...state.chatInfo,
                    isChatOpen: isChatOpen
                }
            })),
            setAIReply: (message: Message) => set((state: any) => ({
                ...state,
                chatInfo: {
                    ...state.chatInfo,
                    messages: [...state.chatInfo.messages, message]
                }
            })),
            updateLastAIReply: (message: Message) => set((state: any) => {
                const messages = state.chatInfo.messages;
                const lastMessage = messages[messages.length - 1];
                
                // Check if last message is AI type
                if (lastMessage && lastMessage.type === 'ai') {
                    // Update the last AI message
                    return {
                        ...state,
                        chatInfo: {
                            ...state.chatInfo,
                            messages: [
                                ...messages.slice(0, -1),
                                {
                                    ...lastMessage,
                                    text: message.text
                                }
                            ]
                        }
                    };
                } else {
                    // Add new AI message
                    return {
                        ...state,
                        chatInfo: {
                            ...state.chatInfo,
                            messages: [...messages, message]
                        }
                    };
                }
            }),
            setUserMessage: (message: Message) => set((state: any) => ({
                ...state,
                chatInfo: {
                    ...state.chatInfo,
                    messages: [...state.chatInfo.messages, message]
                }
            })),
            setSelectedText: (text: string, isSelectedTextHTML: boolean = false) => set((state: any) => ({
                ...state,
                chatInfo: {
                    ...state.chatInfo,
                    messages: [...state.chatInfo.messages, {
                        id: Date.now().toString(),
                        text: text,
                        isUser: false,
                        timestamp: new Date(),
                        type: 'selected-text',
                        isSelectedTextHTML: isSelectedTextHTML
                    }]
                }
            })),
            removeSelectedText: (messageId: string) => set((state: any) => ({
                ...state,
                chatInfo: {
                    ...state.chatInfo,
                    messages: state.chatInfo.messages.filter((message: Message) => message.id !== messageId) || []
                }
            })),
        }),
        {
            name: 'chats-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // don't persist anything
                chatInfo: {
                    ...state.chatInfo,
                    messages: [] as Message[],
                    isChatOpen: false,
                },
            }),
        }
    )
)   
