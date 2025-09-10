import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTourStore } from '../../stores/tourStore';
import { useChatStore } from '../../stores/chatStore';
import { UseIntelligentChatReturn } from '../../hooks/useIntelligentChat';
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

  // Se temos o hook inteligente, usamos ele, senão usamos o antigo
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
    setTyping,
    clearMessages,
    toggleChat 
  } = useChatStore();
  
  const { startTour } = useTourStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Carrega as ações rápidas quando o contexto muda
  useEffect(() => {
    const loadQuickActions = async () => {
      try {
        const { getQuickActions } = await loadChatDependencies();
        setQuickActions(getQuickActions(currentContext));
      } catch (error) {
        console.error('Erro ao carregar ações rápidas:', error);
        setQuickActions([]);
      }
    };

    loadQuickActions();
  }, [currentContext]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Adiciona mensagem do usuário
    addMessage({
      type: 'user',
      content: userMessage,
      context: currentContext || undefined,
    });

    // Simula typing
    setTyping(true);

    try {
      // Lazy load das dependências do chat
      const { matchKeywords, tours } = await loadChatDependencies();

      // Simula delay para resposta
      setTimeout(() => {
        setTyping(false);
        
        // Verifica se é um comando de tour
        if (userMessage.toLowerCase().includes('tour') && 
            userMessage.toLowerCase().includes('cliente')) {
          const clientTour = tours.find(t => t.id === 'tour-criar-cliente');
          if (clientTour) {
            startTour(clientTour);
            addMessage({
              type: 'assistant',
              content: '🎯 Perfeito! Vou te guiar pelo processo de criação de cliente. O tour começará agora!',
            });
            return;
          }
        }

        if (userMessage.toLowerCase().includes('tour') && 
            userMessage.toLowerCase().includes('operação')) {
          const operationTour = tours.find(t => t.id === 'tour-nova-operacao');
          if (operationTour) {
            startTour(operationTour);
            addMessage({
              type: 'assistant',
              content: '🎯 Ótimo! Vou te guiar pelo processo de criação de operação. Vamos começar o tour!',
            });
            return;
          }
        }

        // Gera resposta contextual
        const response = matchKeywords(userMessage, currentContext);
        
        addMessage({
          type: 'assistant',
          content: response,
        });
      }, 800 + Math.random() * 1000);
    } catch (error) {
      setTyping(false);
      addMessage({
        type: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
      });
    }
  };

  const handleQuickAction = async (action: string) => {
    try {
      const { tours } = await loadChatDependencies();
      
      if (action === 'Tutorial completo' && currentContext?.pageType === 'clients') {
        const clientTour = tours.find(t => t.id === 'tour-criar-cliente');
        if (clientTour) {
          startTour(clientTour);
          addMessage({
            type: 'assistant',
            content: '🎯 Iniciando tour completo de criação de cliente!',
          });
          return;
        }
      }
      
      if (action === 'Nova operação' && currentContext?.pageType === 'operations') {
        const operationTour = tours.find(t => t.id === 'tour-nova-operacao');
        if (operationTour) {
          startTour(operationTour);
          addMessage({
            type: 'assistant',
            content: '🎯 Iniciando tour de nova operação!',
          });
          return;
        }
      }
      
      // Ação padrão - enviar como mensagem
      setInputValue(action);
      setTimeout(() => handleSendMessage(), 100);
    } catch (error) {
      console.error('Erro ao executar ação rápida:', error);
    }
  };

  return (
    <div className="w-85 h-110 bg-white rounded-lg shadow-xl border overflow-hidden flex flex-col">
      <div className="bg-primary from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              🤖
            </div>
            <div>
              <h3 className="font-semibold">Assistente Virtual</h3>
              <p className="text-xs opacity-90">
                {currentContext?.pageType === 'clients' && 'Seção: Clientes'}
                {currentContext?.pageType === 'operations' && 'Seção: Operações'}
                {/* {currentContext?.pageType === 'dashboard' && 'Página Inicial'} */}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={clearMessages}
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

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
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

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="flex flex-wrap gap-1">
            {quickActions.slice(0, 3).map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
              >
                {action}
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
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
