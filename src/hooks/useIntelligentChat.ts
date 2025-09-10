import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { chatProcessor } from '../utils/intelligentChatProcessor';
import type { ChatMessage } from '../types';

export interface UseIntelligentChatReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  suggestions: string[];
  needsDisambiguation: boolean;
  disambiguationOptions: Array<{text: string; action: string}>;
  handleDisambiguation: (action: string) => void;
  sessionStats: {
    currentContext: string;
    messageCount: number;
    lastConfidence: number;
    currentPage: string;
  };
}

export const useIntelligentChat = (): UseIntelligentChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [needsDisambiguation, setNeedsDisambiguation] = useState(false);
  const [disambiguationOptions, setDisambiguationOptions] = useState<Array<{text: string; action: string}>>([]);
  
  const location = useLocation();

  // Mensagem de boas-vindas inicial
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'assistant',
        content: '👋 Olá! Sou seu assistente virtual. Como posso te ajudar hoje?',
        timestamp: new Date(),
        context: {
          route: location.pathname,
          pageType: getPageType(location.pathname),
          availableActions: getAvailableActions(location.pathname),
          relevantHelp: getRelevantHelp(location.pathname)
        }
      };
      setMessages([welcomeMessage]);
      setSuggestions(getInitialSuggestions(location.pathname));
    }
  }, [location.pathname, messages.length]);

  const sendMessage = useCallback(async (userMessage: string) => {
    // Adiciona mensagem do usuário
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
      context: {
        route: location.pathname,
        pageType: getPageType(location.pathname),
        availableActions: getAvailableActions(location.pathname),
        relevantHelp: getRelevantHelp(location.pathname)
      }
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simula delay de digitação realista
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    try {
      // Processa mensagem com IA
      const result = chatProcessor.processMessage(userMessage, location.pathname);
      
      // Cria resposta do assistente
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.response,
        timestamp: new Date(),
        context: {
          route: location.pathname,
          pageType: getPageType(location.pathname),
          availableActions: result.suggestedActions || [],
          relevantHelp: getRelevantHelp(location.pathname)
        }
      };

      setMessages(prev => [...prev, assistantMsg]);
      setSuggestions(result.suggestedActions || []);
      
      // Gerencia desambiguação
      if (result.needsDisambiguation && result.options) {
        setNeedsDisambiguation(true);
        setDisambiguationOptions(result.options);
      } else {
        setNeedsDisambiguation(false);
        setDisambiguationOptions([]);
      }

    } catch (error) {
      console.error('Erro no chat:', error);
      
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Desculpe, ocorreu um erro. Tente novamente ou digite "ajuda" para orientações.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [location.pathname]);

  const handleDisambiguation = useCallback((action: string) => {
    setNeedsDisambiguation(false);
    setDisambiguationOptions([]);
    
    // Processa a ação escolhida
    sendMessage(action);
  }, [sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSuggestions([]);
    setNeedsDisambiguation(false);
    setDisambiguationOptions([]);
    chatProcessor.clearSession();
  }, []);

  const sessionStats = {
    ...chatProcessor.getSessionStats(),
    lastConfidence: chatProcessor.getSessionStats().lastConfidence || 0
  };

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    suggestions,
    needsDisambiguation,
    disambiguationOptions,
    handleDisambiguation,
    sessionStats
  };
};

// Funções auxiliares para contexto
function getPageType(pathname: string): 'clients' | 'operations' | 'dashboard' {
  if (pathname.includes('/clients')) return 'clients';
  if (pathname.includes('/operations')) return 'operations';
  return 'dashboard';
}

function getAvailableActions(pathname: string): string[] {
  const actionMap: Record<string, string[]> = {
    '/clients': ['Criar Cliente', 'Ver Lista', 'Editar Cliente', 'Tour Guiado'],
    '/clients/create': ['Preencher Formulário', 'Escolher Tipo', 'Validar Dados', 'Cancelar'],
    '/operations': ['Nova Operação', 'Acompanhar Status', 'Histórico', 'Relatórios'],
    '/operations/create': ['Selecionar Cliente', 'Definir Valor', 'Escolher Modalidade', 'Enviar']
  };

  return actionMap[pathname] || ['Navegar', 'Ajuda', 'Tour'];
}

function getRelevantHelp(pathname: string): string[] {
  const helpMap: Record<string, string[]> = {
    '/clients': [
      'Como criar um cliente?',
      'Diferença entre tipos de cliente',
      'Campos obrigatórios',
      'Como editar cliente existente'
    ],
    '/operations': [
      'Como solicitar crédito?',
      'Status das operações',
      'Modalidades disponíveis',
      'Acompanhar análise'
    ]
  };

  return helpMap[pathname] || [
    'Como navegar no sistema?',
    'Funcionalidades disponíveis',
    'Tours guiados'
  ];
}

function getInitialSuggestions(pathname: string): string[] {
  const suggestionMap: Record<string, string[]> = {
    '/clients': ['Criar novo cliente', 'Tipos de cliente'],
    '/operations': ['Nova operação', 'Acompanhar status', 'Modalidades de crédito'],
    '/': ['Tour do sistema', 'Começar criando cliente', 'Ver operações']
  };

  return suggestionMap[pathname] || ['Como posso ajudar?', 'Ver tours disponíveis', 'Funcionalidades'];
}
