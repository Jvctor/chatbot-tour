import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { useIntelligentChat } from '../../hooks/useIntelligentChat';
import { useChatStore } from '../../stores/chatStore';
import ChatWindowIntelligent from './ChatWindowIntelligent';

const ChatWidget: React.FC = () => {
  const chatHook = useIntelligentChat();
  const { isOpen, toggleChat } = useChatStore();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <ChatWindowIntelligent chatHook={chatHook} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isOpen && (
        <motion.button
          onClick={toggleChat}
          className="bg-secondary text-white rounded-full p-3 shadow-lg transition-colors duration-200 relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
          
          {/* Indicador de mensagens */}
          {chatHook.sessionStats.messageCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {chatHook.sessionStats.messageCount > 9 ? '9+' : chatHook.sessionStats.messageCount}
            </motion.div>
          )}

          {/* Indicador de contexto */}
          <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full border-2 border-white"
               style={{ 
                 backgroundColor: 
                   chatHook.sessionStats.currentContext === 'clients' ? '#10b981' :
                   chatHook.sessionStats.currentContext === 'operations' ? '#3b82f6' : '#6b7280' 
               }}
               title={`Contexto: ${chatHook.sessionStats.currentContext}`}
          />
        </motion.button>
      )}
    </div>
  );
};

export default ChatWidget;
