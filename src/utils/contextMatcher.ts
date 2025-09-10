import { knowledgeBase } from '../data/knowledgeBase';
import type { PageContext, KnowledgeBaseItem } from '../types';

export const matchKeywords = (
  message: string,
  context: PageContext | null
): string => {
  const lowerMessage = message.toLowerCase();
  
  // Determina qual seção da base de conhecimento usar
  let relevantKnowledge: KnowledgeBaseItem;
  
  if (context?.pageType === 'clients') {
    relevantKnowledge = knowledgeBase.clients;
  } else if (context?.pageType === 'operations') {
    relevantKnowledge = knowledgeBase.operations;
  } else {
    relevantKnowledge = knowledgeBase.global;
  }

  // Procura por correspondências exatas primeiro
  for (const [key, response] of Object.entries(relevantKnowledge.responses)) {
    if (lowerMessage.includes(key.toLowerCase())) {
      return response;
    }
  }

  // Procura por palavras-chave
  const hasKeyword = relevantKnowledge.keywords.some(keyword =>
    lowerMessage.includes(keyword.toLowerCase())
  );

  if (hasKeyword) {
    // Retorna uma resposta contextual baseada na página
    if (context?.pageType === 'clients') {
      return 'Estou aqui para te ajudar com clientes! Posso te guiar para criar um novo cliente ou explicar os tipos disponíveis. O que precisa?';
    } else if (context?.pageType === 'operations') {
      return 'Posso te ajudar com operações! Quer aprender a criar uma nova operação ou entender os status? Posso te guiar passo a passo!';
    }
  }

  // Saudações
  if (['oi', 'olá', 'hello', 'ola'].some(greeting => lowerMessage.includes(greeting))) {
    return knowledgeBase.global.responses.saudacao;
  }

  // Tour
  if (['tour', 'guia', 'tutorial'].some(word => lowerMessage.includes(word))) {
    return knowledgeBase.global.responses.tour;
  }

  // Ajuda
  if (['ajuda', 'help', 'socorro'].some(word => lowerMessage.includes(word))) {
    return knowledgeBase.global.responses.ajuda;
  }

  // Fallback
  return knowledgeBase.global.responses.fallback;
};

export const getQuickActions = (context: PageContext | null): string[] => {
  if (context?.pageType === 'clients') {
    return knowledgeBase.clients.quickActions;
  } else if (context?.pageType === 'operations') {
    return knowledgeBase.operations.quickActions;
  }
  
  return knowledgeBase.global.quickActions;
};
