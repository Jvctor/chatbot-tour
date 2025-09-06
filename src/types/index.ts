export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: PageContext;
}

export interface PageContext {
  route: string;
  pageType: 'clients' | 'operations' | 'partners';
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
