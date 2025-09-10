import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { chatProcessor } from '../utils/intelligentChatProcessor';
import type { ChatMessage } from '../types';

export interface UseIntelligentChatReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  isProcessing: boolean;
  avatarState: 'idle' | 'thinking' | 'speaking';
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
  onStartTour?: (tourId: string) => void;
}

export const useIntelligentChat = (onStartTour?: (tourId: string) => void): UseIntelligentChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [needsDisambiguation, setNeedsDisambiguation] = useState(false);
  const [disambiguationOptions, setDisambiguationOptions] = useState<Array<{text: string; action: string}>>([]);
  
  const location = useLocation();

  const avatarState = chatProcessor.getAvatarState(isProcessing, isTyping);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = getWelcomeMessageForPage(location.pathname);
      setMessages([welcomeMessage]);
      setSuggestions(getPageSpecificSuggestions(location.pathname));
    }
  }, [location.pathname, messages.length]);

  useEffect(() => {
    setSuggestions(getPageSpecificSuggestions(location.pathname));
  }, [location.pathname]);

  const sendMessage = useCallback(async (userMessage: string) => {
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
    setIsProcessing(true);

    const processingDelay = 300 + Math.random() * 500;
    await new Promise(resolve => setTimeout(resolve, processingDelay));

    try {
      const result = chatProcessor.processMessage(userMessage, location.pathname);
      
      const tourCommand = detectTourCommand(userMessage, location.pathname);
      if (tourCommand && onStartTour) {
        const tourMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `🚀 Perfeito! Vou iniciar o tour "${tourCommand.name}" para você. Prepare-se para uma experiência guiada passo a passo!\n\n✨ O tour começará em instantes...`,
          timestamp: new Date(),
          context: {
            route: location.pathname,
            pageType: getPageType(location.pathname),
            availableActions: [],
            relevantHelp: []
          }
        };
        
        setMessages(prev => [...prev, tourMsg]);
        setIsProcessing(false);
        setIsTyping(false);
        
        setTimeout(() => {
          onStartTour(tourCommand.id);
        }, 1000);
        
        return;
      }
      
      setIsProcessing(false);
      
      const typingDelay = chatProcessor.calculateTypingDelay(result.response);
      
      setIsTyping(true);
      
      await new Promise(resolve => setTimeout(resolve, typingDelay));
      
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
    isProcessing,
    avatarState,
    sendMessage,
    clearChat,
    suggestions,
    needsDisambiguation,
    disambiguationOptions,
    handleDisambiguation,
    sessionStats,
    onStartTour
  };
};

function detectTourCommand(message: string, pathname: string): { id: string; name: string } | null {
  const normalizedMessage = message.toLowerCase().trim();
  
  const tourPatterns = [
    {
      patterns: ['como criar um cliente', 'criar cliente', 'tutorial cliente', 'tour cliente', 'guia cliente'],
      id: 'tour-criar-cliente',
      name: 'Como criar um cliente',
      contexts: ['/clients', '/clients/create']
    },
    {
      patterns: ['como criar operação', 'nova operação', 'tutorial operação', 'tour operação', 'guia operação', 'como preencher formulário'],
      id: 'tour-nova-operacao',
      name: 'Como criar uma operação',
      contexts: ['/operations', '/operations/create']
    },
    {
      patterns: ['tour completo', 'guia completo', 'tutorial completo', 'passo a passo'],
      id: pathname.includes('/clients') ? 'tour-criar-cliente' : 'tour-nova-operacao',
      name: pathname.includes('/clients') ? 'Como criar um cliente' : 'Como criar uma operação',
      contexts: ['/clients', '/operations', '/clients/create', '/operations/create']
    }
  ];
  
  for (const tour of tourPatterns) {
    const hasPattern = tour.patterns.some(pattern => normalizedMessage.includes(pattern));
    
    const isValidContext = tour.contexts.some(context => pathname.startsWith(context));
    
    if (hasPattern && isValidContext) {
      return { id: tour.id, name: tour.name };
    }
  }
  
  return null;
}

function getPageType(pathname: string): 'clients' | 'operations' | 'dashboard' {
  if (pathname.includes('/clients')) return 'clients';
  if (pathname.includes('/operations')) return 'operations';
  return 'dashboard';
}

function getWelcomeMessageForPage(pathname: string): ChatMessage {
  const pageType = getPageType(pathname);
  
  const welcomeMessages = {
    clients: {
      content: 'Olá! Estou aqui para te ajudar com clientes!\n\nPosso te ajudar com:\n• Como criar um cliente?\n• Diferença entre tipos de cliente\n• Tour completo de criação\n\nDigite sua dúvida ou escolha uma das sugestões!',
      suggestions: ['Como criar um cliente?', 'Diferença entre tipos?']
    },
    operations: {
      content: 'Olá! Estou aqui para te ajudar com operações!\n\nPosso te ajudar com:\n• Como preencher formulário?\n• Status das operações\n\n• Tour completo do processo\n\nDigite sua dúvida ou escolha uma das sugestões!',
      suggestions: ['Como preencher formulário?', 'Status das operações']
    },
    dashboard: {
      content: 'Olá! Sou seu assistente virtual!\n\nPosso te ajudar com:\n• Navegação no sistema\n• Criação de clientes\n• Gestão de operações\n• Tours guiados\n\nDigite sua dúvida ou escolha uma das sugestões!',
      suggestions: ['Tour do sistema', 'Criar cliente', 'Nova operação']
    }
  };

  const pageConfig = welcomeMessages[pageType];
  
  return {
    id: '1',
    type: 'assistant',
    content: pageConfig.content,
    timestamp: new Date(),
    context: {
      route: pathname,
      pageType: pageType,
      availableActions: getAvailableActions(pathname),
      relevantHelp: getRelevantHelp(pathname)
    }
  };
}

function getPageSpecificSuggestions(pathname: string): string[] {
  const pageType = getPageType(pathname);
  
  const suggestionMap = {
    '/clients': ['Como criar um cliente?', 'Diferença entre tipos?', 'Tour completo'],
    '/operations': ['Como preencher formulário?', 'Status das operações', 'Tour completo'],

    '/': ['Tour do sistema', 'Criar cliente', 'Nova operação'],
    '/dashboard': ['Visão geral', 'Próximos passos', 'Estatísticas']
  };

  if (suggestionMap[pathname as keyof typeof suggestionMap]) {
    return suggestionMap[pathname as keyof typeof suggestionMap];
  }

  const fallbackSuggestions = {
    clients: ['Como criar um cliente?', 'Diferença entre tipos?', 'Tour completo'],
    operations: ['Como preencher formulário?', 'Status das operações', 'Tour completo'],
    dashboard: ['Tour do sistema', 'Funcionalidades', 'Ajuda geral']
  };

  return fallbackSuggestions[pageType];
}

function getAvailableActions(pathname: string): string[] {
  const actionMap: Record<string, string[]> = {
    '/clients': ['Criar Cliente', 'Ver Lista', 'Editar Cliente', 'Tour Guiado'],
    '/operations': ['Nova Operação', 'Acompanhar Status', 'Histórico', 'Relatórios'],
  };

  return actionMap[pathname] || ['Navegar', 'Ajuda', 'Tour'];
}

function getRelevantHelp(pathname: string): string[] {
  const helpMap: Record<string, string[]> = {
    '/clients': [
      'Como criar um cliente?',
      'Diferença entre tipos de cliente',
    ],
    '/operations': [
      'Como solicitar crédito?',
      'Status das operações'
     ],
  };

  return helpMap[pathname] || [
    'Como navegar no sistema?',
    'Funcionalidades disponíveis',
    'Tours guiados'
  ];
}
