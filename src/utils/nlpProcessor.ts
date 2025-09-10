import type { PageContext } from '../types';

export interface ProcessedMessage {
  intent: string;
  entities: string[];
  confidence: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  context?: string;
}

// Sinônimos e variações para melhor compreensão
const synonyms: Record<string, string[]> = {
  'criar': ['fazer', 'adicionar', 'cadastrar', 'registrar', 'inserir', 'novo'],
  'cliente': ['pessoa', 'usuário', 'contato', 'perfil'],
  'operação': ['transação', 'processo', 'procedimento', 'ação'],
  'ajuda': ['socorro', 'auxílio', 'suporte', 'apoio', 'assistência'],
  'tour': ['guia', 'tutorial', 'walkthrough', 'passo a passo', 'explicação'],
  'problema': ['erro', 'falha', 'bug', 'defeito', 'dificuldade'],
  'como': ['de que forma', 'de que maneira', 'qual o jeito'],
  'onde': ['em que local', 'aonde', 'qual lugar'],
  'quando': ['em que momento', 'que horas', 'que dia']
};

// Padrões de intenção mais sofisticados
const intentPatterns: Record<string, RegExp[]> = {
  'greeting': [
    /^(oi|olá|hello|boa tarde|bom dia|boa noite)/i,
    /(tchau|até mais|flw|bye)/i
  ],
  'help_request': [
    /(preciso|quero|gostaria).*(ajuda|socorro|auxílio)/i,
    /(como|onde|quando).*(faz|fazer|criar|encontrar)/i,
    /não sei como/i,
    /está (difícil|complicado)/i
  ],
  'create_client': [
    /(criar|fazer|adicionar|cadastrar).*(cliente|pessoa)/i,
    /(novo|nova).*(cliente|cadastro)/i,
    /como.*(cadastr|cri).*(cliente)/i
  ],
  'create_operation': [
    /(criar|fazer|nova).*(operação|transação)/i,
    /como.*(faz|criar).*(operação)/i,
    /(processo|procedimento).*(operação)/i
  ],
  'tour_request': [
    /(tour|guia|tutorial|passo a passo)/i,
    /(ensina|explica|mostra).*(como)/i,
    /não (sei|entendo|conheço)/i
  ],
  'problem_report': [
    /(problema|erro|bug|não funciona|deu errado)/i,
    /(travou|quebrou|parou)/i,
    /não (consegui|consigo)/i
  ],
  'question': [
    /^(o que|qual|como|quando|onde|por que|porque)/i,
    /\?$/,
    /(pode|poderia).*(explicar|dizer|falar)/i
  ],
  'compliment': [
    /(obrigad|valeu|muito bom|excelente|perfeito)/i,
    /(gostei|adorei|legal|bacana)/i
  ],
  'complaint': [
    /(ruim|péssimo|horrível|não gostei)/i,
    /(lento|devagar|demorado)/i,
    /(complicado|difícil|confuso)/i
  ]
};

// Extração de entidades simples
const entityPatterns: Record<string, RegExp> = {
  'client_type': /(agricultura|agronegócio|empresarial|pessoa física)/i,
  'operation_status': /(rascunho|enviado|análise|aprovado|rejeitado)/i,
  'page_reference': /(clientes|operações|dashboard|página inicial)/i,
  'number': /\d+/g,
  'email': /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
};

// Normaliza sinônimos
function normalizeSynonyms(text: string): string {
  let normalized = text.toLowerCase();
  
  for (const [canonical, variants] of Object.entries(synonyms)) {
    for (const variant of variants) {
      const regex = new RegExp(`\\b${variant}\\b`, 'gi');
      normalized = normalized.replace(regex, canonical);
    }
  }
  
  return normalized;
}

// Detecta intenção da mensagem
function detectIntent(text: string): { intent: string; confidence: number } {
  const normalizedText = normalizeSynonyms(text);
  
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(normalizedText)) {
        // Calcula confiança baseada na especificidade do padrão
        const confidence = 0.7 + (pattern.source.length / 100);
        return { intent, confidence: Math.min(confidence, 0.95) };
      }
    }
  }
  
  return { intent: 'unknown', confidence: 0.1 };
}

// Extrai entidades da mensagem
function extractEntities(text: string): string[] {
  const entities: string[] = [];
  
  for (const [entityType, pattern] of Object.entries(entityPatterns)) {
    const matches = text.match(pattern);
    if (matches) {
      entities.push(...matches.map(match => `${entityType}:${match}`));
    }
  }
  
  return entities;
}

// Análise de sentimento simples
function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = [
    'bom', 'ótimo', 'excelente', 'perfeito', 'legal', 'bacana', 
    'obrigado', 'valeu', 'gostei', 'adorei', 'maravilhoso'
  ];
  
  const negativeWords = [
    'ruim', 'péssimo', 'horrível', 'problema', 'erro', 'difícil',
    'complicado', 'confuso', 'lento', 'não gostei', 'odeio'
  ];
  
  const lowerText = text.toLowerCase();
  
  const positiveCount = positiveWords.reduce((count, word) => 
    count + (lowerText.includes(word) ? 1 : 0), 0
  );
  
  const negativeCount = negativeWords.reduce((count, word) => 
    count + (lowerText.includes(word) ? 1 : 0), 0
  );
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Função principal de processamento
export function processMessage(
  message: string, 
  context?: PageContext | null
): ProcessedMessage {
  const { intent, confidence } = detectIntent(message);
  const entities = extractEntities(message);
  const sentiment = analyzeSentiment(message);
  
  return {
    intent,
    entities,
    confidence,
    sentiment,
    context: context?.pageType
  };
}

// Gera variações de resposta para evitar repetição
export function generateResponseVariation(baseResponse: string, variation: number = 0): string {
  const variations: Record<string, string[]> = {
    'greeting': [
      'Olá! 👋 Como posso te ajudar hoje?',
      'Oi! 😊 Em que posso ser útil?',
      'Hey! 👋 Estou aqui para te ajudar!',
      'Olá! Pronto para te auxiliar! 🚀'
    ],
    'help_offer': [
      'Posso te ajudar com isso!',
      'Claro! Vou te auxiliar.',
      'Sem problemas! Estou aqui para isso.',
      'Perfeito! Deixa comigo.'
    ],
    'tour_intro': [
      'Vou te guiar passo a passo! 🎯',
      'Que tal um tour guiado? 🗺️',
      'Vamos fazer isso juntos! 👥',
      'Te ensino de forma prática! 💡'
    ]
  };
  
  // Identifica o tipo de resposta base
  for (const [type, options] of Object.entries(variations)) {
    if (baseResponse.includes('Olá') && type === 'greeting') {
      return options[variation % options.length];
    }
    if (baseResponse.includes('ajudar') && type === 'help_offer') {
      return options[variation % options.length];
    }
    if (baseResponse.includes('tour') && type === 'tour_intro') {
      return options[variation % options.length];
    }
  }
  
  return baseResponse;
}

export function generateContextualFollowUp(
  intent: string, 
  _context?: string
): string {
  const followUps: Record<string, string[]> = {
    'create_client': [
      'Precisa de ajuda com algum campo específico?',
      'Tem dúvida sobre os tipos de cliente?',
      'Quer que eu explique o processo detalhadamente?'
    ],
    'create_operation': [
      'Qual tipo de operação você quer criar?',
      'Já tem o cliente cadastrado?',
      'Precisa entender os status das operações?'
    ],
    'problem_report': [
      'Pode me dar mais detalhes sobre o problema?',
      'Em que tela isso aconteceu?',
      'Vou te ajudar a resolver isso!'
    ]
  };
  
  const contextual = followUps[intent];
  if (contextual) {
    return contextual[Math.floor(Math.random() * contextual.length)];
  }
  
  return '';
}
