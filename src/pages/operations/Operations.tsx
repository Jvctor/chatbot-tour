import React from 'react';
import { mockOperations } from '../../data/mockData';
import { PlusIcon, DocumentTextIcon, ClockIcon, CheckCircleIcon, PlayIcon } from '@heroicons/react/24/outline';
import Table from '../../components/Table';
import StatCard from '../../components/StatCard';
import PageHeader from '../../components/PageHeader';
import { formatDate } from '../../utils/mask';

const Operations: React.FC = () => {
  const formatStatus = (status: string) => {
    const statusMap = {
      'approved': 'Aprovado',
      'analyzing': 'Em Análise',
      'sent': 'Enviado'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <div className="flex-1 p-6">
      <PageHeader
        title="Operações"
        subtitle="Gerencie operações de crédito rural"
        actions={[
          {
            type: 'button',
            text: 'Tour: Criar Operação',
            icon: PlayIcon,
            className: 'bg-secondary hover:bg-secondary-dark text-white'
          },
          {
            type: 'link',
            text: 'Nova Operação',
            icon: PlusIcon,
            to: '/operations/create',
            testId: 'nova-operacao-btn',
            className: 'bg-primary hover:bg-primary-dark text-white'
          }
        ]}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6">
        <StatCard
          title="Total"
          value={mockOperations.length}
          icon={DocumentTextIcon}
          iconBgColor="bg-secondary-lightest"
          iconColor="text-secondary-dark"
        />
        <StatCard
          title="Em Análise"
          value={mockOperations.filter(o => o.status === 'analyzing').length}
          icon={ClockIcon}
          iconBgColor="bg-primary-lightest"
          iconColor="text-primary-dark"
        />
        <StatCard
          title="Aprovadas"
          value={mockOperations.filter(op => op.status === 'approved').length}
          icon={CheckCircleIcon}
          iconBgColor="bg-secondary"
          iconColor="text-white"
        />
        <StatCard
          title="Volume Total"
          value={mockOperations.reduce((sum, op) => sum + op.amount, 0)}
          icon={DocumentTextIcon}
          iconBgColor="bg-secondary"
          iconColor="text-white"
          isCurrency={true}
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          title="Lista de Operações"
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'clientName', label: 'Cliente' },
            { key: 'type', label: 'Tipo' },
            { 
              key: 'amount', 
              label: 'Valor',
              render: (value) => `R$ ${(value as number).toLocaleString('pt-BR')}`
            },
            { 
              key: 'status', 
              label: 'Status',
              render: (value) => formatStatus(value as string)
            },
            { 
              key: 'createdAt', 
              label: 'Data',
              render: (value) => formatDate(value as Date)
            },
          ]}
          data={mockOperations}
        />
      </div>
    </div>
  );
};

export default Operations;
