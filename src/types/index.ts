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