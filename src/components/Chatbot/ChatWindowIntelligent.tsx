import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTourStore } from '../../stores/tourStore';
import { useChatStore } from '../../stores/chatStore';
import type { UseIntelligentChatReturn } from '../../hooks/useIntelligentChat';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  chatHook?: UseIntelligentChatReturn;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatHook }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { toggleChat } = useChatStore();
  const { startTour } = useTourStore();

  // Se temos o hook inteligente, usamos ele
  const {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    suggestions,
    needsDisambiguation,
    disambiguationOptions,
    handleDisambiguation,
    sessionStats
  } = chatHook || {
    messages: [],
    isTyping: false,
    sendMessage: async () => {},
    clearChat: () => {},
    suggestions: [],
    needsDisambiguation: false,
    disambiguationOptions: [],
    handleDisambiguation: () => {},
    sessionStats: { currentContext: 'global', messageCount: 0, lastConfidence: 0, currentPage: '/' }
  };

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Foco no input quando abre
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const message = inputValue.trim();
    setInputValue('');
    
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-secondary text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            🤖
          </div>
          <div>
            <h3 className="font-semibold">Assistente Virtual</h3>
            <p className="text-xs opacity-75">
              {sessionStats.currentContext} • {sessionStats.messageCount} msgs
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={clearChat}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Limpar conversa"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
          <button
            onClick={toggleChat}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Fechar chat"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-gray-500"
          >
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              🤖
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Disambiguation Options */}
      {needsDisambiguation && disambiguationOptions.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-xs text-gray-600 mb-2">🤔 Escolha uma opção:</p>
          <div className="flex flex-wrap gap-1">
            {disambiguationOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleDisambiguation(option.action)}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && !needsDisambiguation && (
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-xs text-gray-600 mb-2">💡 Sugestões:</p>
          <div className="flex flex-wrap gap-1">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-3 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </div>
        
        {/* Context indicator */}
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <span>
            {sessionStats.lastConfidence > 0 && (
              <span className="ml-1">
                ({Math.round(sessionStats.lastConfidence * 100)}% confiança)
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
