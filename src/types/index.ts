export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: PageContext;
}

export interface PageContext {
  route: string;
  pageType: 'clients' | 'operations' | 'dashboard';
  availableActions: string[];
  relevantHelp: string[];
}

export interface TourStep {
  id: string;
  selector: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'input' | 'navigate';
  validation?: () => boolean;
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  context: string[];
  steps: TourStep[];
}
export interface Client {
  id: string;
  name: string;
  email: string;
  type: 'agriculture' | 'agribusiness';
  document: string;
  phone: string;
}

export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

export interface TableProps {
  title: string;
  columns: TableColumn[];
  data: any[];
  keyField?: string;
  className?: string;
}

export interface OperationData {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  amount: number;
  status: 'draft' | 'sent' | 'analyzing' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface KnowledgeBaseItem {
  keywords: string[];
  responses: Record<string, string>;
  tours: string[];
  quickActions: string[];
  synonyms?: Record<string, string[]>;
}

export interface ContextualResponse {
  question: string;
  contexts: Record<string, string>;
  options?: Array<{
    text: string;
    action: string;
    context?: string;
  }>;
}

export interface IntentPattern {
  intent: string;
  keywords: string[];
  confidence: number;
  context?: string;
}

export interface ContextualLogic {
  pageContext: Record<string, string>;
  ambiguousKeywords: Record<string, ContextualResponse>;
  routePatterns: Record<string, string[]>;
}

export interface SessionContext {
  currentPage: string;
  conversationHistory: ChatMessage[];
  userIntent?: string;
  lastAction?: string;
  confidence?: number;
}

export interface KnowledgeBase {
  global: KnowledgeBaseItem;
  clients: KnowledgeBaseItem;
  operations: KnowledgeBaseItem;
  contextualLogic: ContextualLogic;
  intentMatching: {
    patterns: IntentPattern[];
    confidenceThreshold: number;
  };
  sessionManagement: {
    rememberContext: boolean;
    maxHistorySize: number;
    contextWeights: Record<string, number>;
  };
}