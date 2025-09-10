import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, PageContext } from '../types';

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  currentContext: PageContext | null;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  toggleChat: () => void;
  setTyping: (typing: boolean) => void;
  setContext: (context: PageContext) => void;
  clearMessages: () => void;
}

const initialMessage = {
  id: '1',
  type: 'assistant' as const,
  content: 'Olá! 👋 Sou seu assistente virtual. Como posso te ajudar hoje?',
  timestamp: new Date(),
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [initialMessage],
      isOpen: false,
      isTyping: false,
      currentContext: null,

      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      
      setTyping: (typing) => set({ isTyping: typing }),
      
      setContext: (context) => set({ currentContext: context }),
      
      clearMessages: () => set({ 
        messages: [initialMessage] 
      }),
    }),
    {
      name: 'chatbot-storage',
      partialize: (state) => ({ 
        messages: state.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.messages) {
          state.messages = state.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        }
      },
    }
  )
);
