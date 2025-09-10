import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftEllipsisIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContext } from '../../hooks/useContext';
import { useChatStore } from '../../stores/chatStore';
import ChatWindow from './ChatWindow';

const ChatWidget: React.FC = () => {
  useContext(); 
  
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
            <ChatWindow />
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isOpen && (
        <motion.button
          onClick={toggleChat}
          className="bg-secondary  text-white rounded-full p-3 shadow-lg transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  );
};

export default ChatWidget;
