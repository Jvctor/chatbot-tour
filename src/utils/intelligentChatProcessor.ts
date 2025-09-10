import { knowledgeBase } from '../data/knowledgeBase';
import type { SessionContext } from '../types';

export class IntelligentChatProcessor {
  private sessionContext: SessionContext = {
    currentPage: '/',
    conversationHistory: [],
    confidence: 0
  };

  /**
   * Processa a mensagem do usuário de forma inteligente
   */
  public processMessage(
    userMessage: string, 
    currentRoute: string = '/'
  ): {
    response: string;
    confidence: number;
    suggestedActions?: string[];
    needsDisambiguation?: boolean;
    options?: Array<{text: string; action: string}>;
  } {
    // Atualiza contexto da sessão
    this.updateSessionContext(userMessage, currentRoute);

    // 1. Análise de intenção
    const intentAnalysis = this.analyzeIntent(userMessage);
    
    // 2. Processamento contextual
    const contextualResponse = this.getContextualResponse(userMessage, intentAnalysis);
    
    // 3. Verifica se precisa de desambiguação
    if (contextualResponse.needsDisambiguation) {
      return {
        response: contextualResponse.response,
        confidence: intentAnalysis.confidence,
        needsDisambiguation: true,
        options: contextualResponse.options
      };
    }

    // 4. Gera resposta final com sugestões
    const finalResponse = this.generateResponse(userMessage, intentAnalysis);
    
    return {
      response: finalResponse.response,
      confidence: intentAnalysis.confidence,
      suggestedActions: finalResponse.suggestedActions
    };
  }

  /**
   * 🎯 Analisa a intenção da mensagem
   */
  private analyzeIntent(message: string): {
    intent: string;
    confidence: number;
    matchedKeywords: string[];
    context: string;
  } {
    const normalizedMessage = message.toLowerCase().trim();
    const currentContext = this.getCurrentContext();
    
    let bestMatch = {
      intent: 'unknown',
      confidence: 0,
      matchedKeywords: [] as string[],
      context: currentContext
    };

    // Procura por padrões de intenção
    for (const pattern of knowledgeBase.intentMatching.patterns) {
      let confidence = 0;
      const matchedKeywords: string[] = [];

      // Verifica match de keywords
      for (const keyword of pattern.keywords) {
        if (normalizedMessage.includes(keyword)) {
          confidence += pattern.confidence;
          matchedKeywords.push(keyword);
        }
      }

      // BONUS MAIOR por contexto correto da página atual
      if (pattern.context && pattern.context === currentContext) {
        confidence += 0.3; // Aumentado de 0.2 para 0.3
      }

      // Verifica sinônimos com peso maior para contexto atual
      confidence += this.checkSynonyms(normalizedMessage, currentContext);

      // BONUS para perguntas específicas da página atual
      confidence += this.checkPageSpecificQuestions(normalizedMessage, currentContext);

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          intent: pattern.intent,
          confidence: Math.min(confidence, 1.0),
          matchedKeywords,
          context: currentContext
        };
      }
    }

    return bestMatch;
  }

  /**
   * 🔄 Processa resposta contextual
   */
  private getContextualResponse(
    message: string, 
    intentAnalysis: any
  ): {
    response: string;
    needsDisambiguation: boolean;
    options?: Array<{text: string; action: string}>;
  } {
    const normalizedMessage = message.toLowerCase().trim();
    const currentContext = this.getCurrentContext();

    // Verifica palavras ambíguas
    for (const [keyword, ambiguousConfig] of Object.entries(knowledgeBase.contextualLogic.ambiguousKeywords)) {
      if (normalizedMessage.includes(keyword) && intentAnalysis.confidence < 0.7) {
        const contextualMessage = ambiguousConfig.contexts[currentContext] || ambiguousConfig.contexts.global;
        
        return {
          response: `${ambiguousConfig.question}\n\n${contextualMessage}`,
          needsDisambiguation: true,
          options: ambiguousConfig.options
        };
      }
    }

    return {
      response: '',
      needsDisambiguation: false
    };
  }

  /**
   * 📝 Gera resposta final
   */
  private generateResponse(
    message: string, 
    intentAnalysis: any
  ): {
    response: string;
    suggestedActions: string[];
  } {
    const currentContext = this.getCurrentContext();
    const contextData = this.getContextData(currentContext);
    
    if (!contextData) {
      return {
        response: knowledgeBase.global.responses.fallback,
        suggestedActions: knowledgeBase.global.quickActions
      };
    }

    // Procura resposta específica
    const normalizedMessage = message.toLowerCase();
    let response = '';

    // Busca por match exato primeiro
    for (const [key, value] of Object.entries(contextData.responses)) {
      if (normalizedMessage.includes(key)) {
        response = value;
        break;
      }
    }

    // Se não encontrou, usa lógica de similaridade
    if (!response) {
      response = this.findSimilarResponse(normalizedMessage, contextData.responses);
    }

    // Fallback se ainda não encontrou
    if (!response) {
      response = this.getContextualFallback(currentContext);
    }

    return {
      response,
      suggestedActions: this.getSuggestedActions(currentContext, intentAnalysis.intent)
    };
  }

  /**
   * 🔍 Busca resposta similar usando keywords
   */
  private findSimilarResponse(message: string, responses: Record<string, string>): string {
    const words = message.split(' ');
    let bestMatch = '';
    let bestScore = 0;

    for (const [key, value] of Object.entries(responses)) {
      let score = 0;
      for (const word of words) {
        if (key.includes(word)) {
          score++;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = value;
      }
    }

    return bestMatch;
  }

  /**
   * 🗂️ Obtém dados do contexto atual
   */
  private getContextData(context: string) {
    switch (context) {
      case 'clients':
        return knowledgeBase.clients;
      case 'operations':
        return knowledgeBase.operations;
      default:
        return knowledgeBase.global;
    }
  }

  /**
   * 📍 Determina contexto atual baseado na rota
   */
  private getCurrentContext(): string {
    const route = this.sessionContext.currentPage;
    return knowledgeBase.contextualLogic.pageContext[route] || 'global';
  }

  /**
   * 📊 Verifica sinônimos
   */
  private checkSynonyms(message: string, context: string): number {
    const contextData = this.getContextData(context);
    if (!contextData?.synonyms) return 0;

    let score = 0;
    for (const [, synonyms] of Object.entries(contextData.synonyms)) {
      for (const synonym of synonyms) {
        if (message.includes(synonym)) {
          score += 0.1;
        }
      }
    }
    return Math.min(score, 0.3);
  }

  /**
   * 🎯 Verifica perguntas específicas da página atual
   */
  private checkPageSpecificQuestions(message: string, context: string): number {
    const contextData = this.getContextData(context);
    if (!contextData?.responses) return 0;

    let score = 0;
    
    // Verifica se a mensagem corresponde a perguntas específicas do contexto
    for (const [questionKey] of Object.entries(contextData.responses)) {
      // Perguntas específicas têm prioridade maior
      if (questionKey.length > 5 && message.includes(questionKey)) {
        score += 0.4; // Bonus alto para perguntas específicas
      }
    }

    // Bonus adicional para quickActions específicas da página
    if (contextData.quickActions) {
      for (const action of contextData.quickActions) {
        if (message.toLowerCase().includes(action.toLowerCase())) {
          score += 0.3;
        }
      }
    }

    return Math.min(score, 0.5);
  }

  /**
   * Gera ações sugeridas baseadas no contexto
   */
  private getSuggestedActions(context: string, intent: string): string[] {
    const contextData = this.getContextData(context);
    const baseActions = contextData?.quickActions || [];

    // Adiciona ações específicas baseadas na intenção
    const intentActions = this.getIntentBasedActions(intent);
    
    return [...new Set([...baseActions, ...intentActions])];
  }

  /**
   * 🔗 Ações baseadas na intenção
   */
  private getIntentBasedActions(intent: string): string[] {
    const actionMap: Record<string, string[]> = {
      'create_client': ['Iniciar tour de criação', 'Ver exemplo', 'Ajuda com formulário'],
      'create_operation': ['Guia passo a passo', 'Verificar cliente', 'Modalidades de crédito'],
      'ambiguous_create': ['Criar Cliente', 'Criar Operação', 'Ver tutoriais']
    };

    return actionMap[intent] || [];
  }

  private getContextualFallback(context: string): string {
    const fallbacks: Record<string, string> = {
      'clients': '👤 **Área de Clientes** - Posso te ajudar com:\n• Criar novo cliente\n• Tipos de cliente\n\nO que você gostaria de fazer?',
      'operations': '💼 **Área de Operações** - Estou aqui para:\n• Criar nova operação\n• Acompanhar status\n• Explicar processo\n\n*Como posso ajudar?*',
      'global': knowledgeBase.global.responses.fallback
    };

    return fallbacks[context] || fallbacks.global;
  }

  private updateSessionContext(message: string, currentRoute: string): void {
    this.sessionContext.currentPage = currentRoute;
    
    // Adiciona mensagem ao histórico
    this.sessionContext.conversationHistory.push({
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    });

    // Mantém apenas as últimas N mensagens
    const maxHistory = knowledgeBase.sessionManagement.maxHistorySize;
    if (this.sessionContext.conversationHistory.length > maxHistory) {
      this.sessionContext.conversationHistory = this.sessionContext.conversationHistory.slice(-maxHistory);
    }
  }

  /**
   * 📈 Obtém estatísticas da sessão
   */
  public getSessionStats() {
    return {
      currentContext: this.getCurrentContext(),
      messageCount: this.sessionContext.conversationHistory.length,
      lastConfidence: this.sessionContext.confidence,
      currentPage: this.sessionContext.currentPage
    };
  }

  /**
   * 🗑️ Limpa contexto da sessão
   */
  public clearSession(): void {
    this.sessionContext = {
      currentPage: '/',
      conversationHistory: [],
      confidence: 0
    };
  }
}

// Singleton para usar em toda a aplicação
export const chatProcessor = new IntelligentChatProcessor();
