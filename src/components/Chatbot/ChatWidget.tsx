import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftEllipsisIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContext } from '../../hooks/useContext';
import { useChatStore } from '../../stores/chatStore';
import ChatWindow from './ChatWindow';

const ChatWidget: React.FC = () => {
  useContext(); // Hook para detectar mudanças de contexto
  
  const { isOpen, toggleChat } = useChatStore();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <ChatWindow />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      <motion.button
        onClick={toggleChat}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          transition-all duration-200 relative overflow-hidden
          ${isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-600 hover:bg-blue-700'
          }
        `}
      >
        {/* Background animation */}
        <motion.div
          initial={false}
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            opacity: isHovered ? 0.8 : 1 
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
        />
        
        {/* Icon */}
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6 text-white" />
          ) : (
            <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-white" />
          )}
        </motion.div>

        {/* Notification dot */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          />
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
