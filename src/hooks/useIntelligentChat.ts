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

  // Mensagem de boas-vindas inicial com comportamento específico por página
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = getWelcomeMessageForPage(location.pathname);
      setMessages([welcomeMessage]);
      setSuggestions(getPageSpecificSuggestions(location.pathname));
    }
  }, [location.pathname, messages.length]);

  // Atualiza sugestões quando muda de página
  useEffect(() => {
    setSuggestions(getPageSpecificSuggestions(location.pathname));
  }, [location.pathname]);

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

// Funções auxiliares para contexto específico por página
function getPageType(pathname: string): 'clients' | 'operations' | 'dashboard' {
  if (pathname.includes('/clients')) return 'clients';
  if (pathname.includes('/operations')) return 'operations';
  return 'dashboard';
}

function getWelcomeMessageForPage(pathname: string): ChatMessage {
  const pageType = getPageType(pathname);
  
  const welcomeMessages = {
    clients: {
      content: '👋 Olá! Estou aqui para te ajudar com **clientes**!\n\n🎯 **Posso te ajudar com:**\n• Como criar um cliente?\n• Diferença entre tipos de cliente\n• Campos obrigatórios\n• Tour completo de criação\n\n💬 **Digite sua dúvida ou escolha uma das sugestões!**',
      suggestions: ['Como criar um cliente?', 'Diferença entre tipos?', 'Campos obrigatórios']
    },
    operations: {
      content: '👋 Olá! Estou aqui para te ajudar com **operações**!\n\n🎯 **Posso te ajudar com:**\n• Como preencher formulário?\n• Status das operações\n• Modalidades disponíveis\n• Tour completo do processo\n\n💬 **Digite sua dúvida ou escolha uma das sugestões!**',
      suggestions: ['Como preencher formulário?', 'Status das operações', 'Modalidades disponíveis']
    },
    dashboard: {
      content: '👋 Olá! Sou seu assistente virtual!\n\n🎯 **Posso te ajudar com:**\n• Navegação no sistema\n• Criação de clientes\n• Gestão de operações\n• Tours guiados\n\n💬 **O que você gostaria de fazer?**',
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
    '/clients': ['Como criar um cliente?', 'Diferença entre tipos?', 'Campos obrigatórios'],
    '/clients/create': ['Escolher tipo de cliente', 'Validar dados', 'Tour passo a passo'],
    '/clients/edit': ['Quais campos posso editar?', 'Como salvar alterações', 'Cancelar edição'],
    
    '/operations': ['Como preencher formulário?', 'Status das operações', 'Modalidades disponíveis'],
    '/operations/create': ['Selecionar cliente', 'Definir valor', 'Escolher modalidade'],
    '/operations/edit': ['Como alterar dados?', 'Reenviar operação', 'Cancelar operação'],
    
    '/': ['Tour do sistema', 'Criar cliente', 'Nova operação'],
    '/dashboard': ['Visão geral', 'Próximos passos', 'Estatísticas']
  };

  // Busca sugestões específicas da rota exata primeiro
  if (suggestionMap[pathname as keyof typeof suggestionMap]) {
    return suggestionMap[pathname as keyof typeof suggestionMap];
  }

  // Fallback para sugestões gerais do tipo de página
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
      'Como editar cliente existente'
    ],
    '/clients/create': [
      'Escolhendo o tipo correto',
      'Preenchendo dados obrigatórios', 
      'Validação de documentos',
      'Salvando o cliente'
    ],
    '/operations': [
      'Como solicitar crédito?',
      'Status das operações'
     ],
    '/operations/create': [
      'Selecionando cliente existente',
      'Definindo tipo de operação',
      'Calculando valores',
      'Enviando para análise'
    ]
  };

  return helpMap[pathname] || [
    'Como navegar no sistema?',
    'Funcionalidades disponíveis',
    'Tours guiados'
  ];
}
