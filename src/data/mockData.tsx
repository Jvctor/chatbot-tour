import type { Client, OperationData } from "../types";

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    type: 'agriculture',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    document: '123.456.789-01',
  },
  {
    id: '2',
    name: 'Fazenda Santa Clara LTDA',
    type: 'agribusiness',
    email: 'contato@santaclara.com.br',
    phone: '(11) 88888-8888',
    document: '12.345.678/0001-90',
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    type: 'agriculture',
    email: 'maria@email.com',
    phone: '(11) 77777-7777',
    document: '987.654.321-09',
  }
];

export const mockOperations: OperationData[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'João Silva',
    type: 'Custeio Agrícola',
    amount: 50000,
    status: 'approved',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Fazenda Santa Clara LTDA',
    type: 'Investimento Rural',
    amount: 250000,
    status: 'approved',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'Maria Oliveira',
    type: 'Custeio Agrícola',
    amount: 30000,
    status: 'sent',
    createdAt: new Date('2024-03-10'),
  }
];