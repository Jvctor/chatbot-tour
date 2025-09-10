import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useChatStore } from '../../stores/chatStore';
import type { UseIntelligentChatReturn } from '../../hooks/useIntelligentChat';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  chatHook: UseIntelligentChatReturn;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatHook }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { toggleChat } = useChatStore();

  // Usando apenas a implementação inteligente
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
  } = chatHook;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Usa o hook inteligente
    await sendMessage(userMessage);
  };

  const handleQuickAction = async (action: string) => {
    setInputValue(action);
    setTimeout(async () => {
      await sendMessage(action);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-96 h-96 bg-white rounded-lg shadow-xl border overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              🤖
            </div>
            <div>
              <h3 className="font-semibold">Assistente Virtual</h3>
              <p className="text-xs opacity-90 flex items-center space-x-2">
                <span>
                  {sessionStats.currentContext === 'clients' && 'Seção: Clientes'}
                  {sessionStats.currentContext === 'operations' && 'Seção: Operações'}
                  {sessionStats.currentContext === 'global' && 'Página Inicial'}
                </span>
                
                {/* Indicador de contexto */}
                <span className={`w-2 h-2 rounded-full ${
                  sessionStats.currentContext === 'clients' ? 'bg-green-400' :
                  sessionStats.currentContext === 'operations' ? 'bg-blue-400' :
                  'bg-gray-400'
                }`} />
                
                {/* Contador de mensagens */}
                {sessionStats.messageCount > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {sessionStats.messageCount}
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={clearChat}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Limpar histórico"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={toggleChat}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Fechar chat"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {/* Opções de Desambiguação */}
        {needsDisambiguation && disambiguationOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
          >
            <p className="text-sm text-blue-700 mb-2">Escolha uma opção:</p>
            <div className="space-y-1">
              {disambiguationOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleDisambiguation(option.action)}
                  className="block w-full text-left text-sm bg-white hover:bg-blue-50 border border-blue-200 rounded px-3 py-2 transition-colors"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Sugestões Contextuais */}
      {suggestions.length > 0 && !needsDisambiguation && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="flex flex-wrap gap-1">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(suggestion)}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Digite sua mensagem... (Contexto: ${sessionStats.currentContext})`}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
        
        {/* Indicador de confiança da última resposta */}
        {sessionStats.lastConfidence > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            Confiança: {Math.round(sessionStats.lastConfidence * 100)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
