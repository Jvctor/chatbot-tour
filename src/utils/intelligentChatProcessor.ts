import { knowledgeBase } from '../data/knowledgeBase';
import type { SessionContext } from '../types';

export class IntelligentChatProcessor {
  private sessionContext: SessionContext = {
    currentPage: '/',
    conversationHistory: [],
    confidence: 0
  };

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
    this.updateSessionContext(userMessage, currentRoute);

    const intentAnalysis = this.analyzeIntent(userMessage);
    
    const contextualResponse = this.getContextualResponse(userMessage, intentAnalysis);
    
    if (contextualResponse.needsDisambiguation) {
      return {
        response: contextualResponse.response,
        confidence: intentAnalysis.confidence,
        needsDisambiguation: true,
        options: contextualResponse.options
      };
    }

    const finalResponse = this.generateResponse(userMessage, intentAnalysis);
    
    return {
      response: finalResponse.response,
      confidence: intentAnalysis.confidence,
      suggestedActions: finalResponse.suggestedActions
    };
  }

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

    for (const pattern of knowledgeBase.intentMatching.patterns) {
      let confidence = 0;
      const matchedKeywords: string[] = [];

      for (const keyword of pattern.keywords) {
        if (normalizedMessage.includes(keyword)) {
          confidence += pattern.confidence;
          matchedKeywords.push(keyword);
        }
      }

      if (pattern.context && pattern.context === currentContext) {
        confidence += 0.3; 
      }

      confidence += this.checkSynonyms(normalizedMessage, currentContext);

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

    const normalizedMessage = message.toLowerCase();
    let response = '';

    for (const [key, value] of Object.entries(contextData.responses)) {
      if (normalizedMessage.includes(key)) {
        response = value;
        break;
      }
    }

    if (!response) {
      response = this.findSimilarResponse(normalizedMessage, contextData.responses);
    }

    if (!response) {
      response = this.getContextualFallback(currentContext);
    }

    return {
      response,
      suggestedActions: this.getSuggestedActions(currentContext, intentAnalysis.intent)
    };
  }

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

  
  private getCurrentContext(): string {
    const route = this.sessionContext.currentPage;
    return knowledgeBase.contextualLogic.pageContext[route] || 'global';
  }

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


  private checkPageSpecificQuestions(message: string, context: string): number {
    const contextData = this.getContextData(context);
    if (!contextData?.responses) return 0;

    let score = 0;
    
    for (const [questionKey] of Object.entries(contextData.responses)) {
      if (questionKey.length > 5 && message.includes(questionKey)) {
        score += 0.4; 
      }
    }

    if (contextData.quickActions) {
      for (const action of contextData.quickActions) {
        if (message.toLowerCase().includes(action.toLowerCase())) {
          score += 0.3;
        }
      }
    }

    return Math.min(score, 0.5);
  }

  private getSuggestedActions(context: string, intent: string): string[] {
    const contextData = this.getContextData(context);
    const baseActions = contextData?.quickActions || [];

    const intentActions = this.getIntentBasedActions(intent);
    
    return [...new Set([...baseActions, ...intentActions])];
  }

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
      'clients': ' Área de Clientes - Posso te ajudar com:\n• Criar novo cliente\n• Tipos de cliente\n\nO que você gostaria de fazer?',
      'operations': 'Área de Operações - Estou aqui para:\n• Criar nova operação\n• Acompanhar status\n• Explicar processo\n\n*Como posso ajudar?*',
      'global': knowledgeBase.global.responses.fallback
    };

    return fallbacks[context] || fallbacks.global;
  }

  private updateSessionContext(message: string, currentRoute: string): void {
    this.sessionContext.currentPage = currentRoute;
    
    this.sessionContext.conversationHistory.push({
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    });

    const maxHistory = knowledgeBase.sessionManagement.maxHistorySize;
    if (this.sessionContext.conversationHistory.length > maxHistory) {
      this.sessionContext.conversationHistory = this.sessionContext.conversationHistory.slice(-maxHistory);
    }
  }

  public getSessionStats() {
    return {
      currentContext: this.getCurrentContext(),
      messageCount: this.sessionContext.conversationHistory.length,
      lastConfidence: this.sessionContext.confidence,
      currentPage: this.sessionContext.currentPage
    };
  }

  public calculateTypingDelay(responseText: string): number {
    const baseDelay = 1000; 
    const wordsPerSecond = 3;
    const wordCount = responseText.split(' ').length;
    
    const calculatedDelay = baseDelay + (wordCount / wordsPerSecond * 1000);
    const randomVariation = Math.random() * 500; 
    
    return Math.min(calculatedDelay + randomVariation, 4000);
  }


  public getAvatarState(isProcessing: boolean, isTyping: boolean): 'idle' | 'thinking' | 'speaking' {
    if (isProcessing) return 'thinking';
    if (isTyping) return 'speaking';
    return 'idle';
  }


  public clearSession(): void {
    this.sessionContext = {
      currentPage: '/',
      conversationHistory: [],
      confidence: 0
    };
  }
}

export const chatProcessor = new IntelligentChatProcessor();
