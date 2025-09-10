import React from 'react';
import { PlusIcon, UserIcon, PlayIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { mockClients } from '../../data/mockData';
import Table from '../../components/Table';
import StatCard from '../../components/StatCard';
import PageHeader from '../../components/PageHeader';
import { useTourContext } from '../../components/tour/TourProvider';

const Clients: React.FC = () => {
  const { startTour } = useTourContext();

  const handleStartTour = () => {
    startTour('tour-criar-cliente');
  };

  return (
    <div className="flex-1 p-6">
      <PageHeader
        title="Clientes"
        subtitle="Gerencie seus clientes de agricultura e agronegócio"
        actions={[
          {
            type: 'button',
            text: 'Tour: Criar Cliente',
            icon: PlayIcon,
            onClick: handleStartTour,
            className: 'bg-secondary hover:bg-secondary-dark text-white'
          },
          {
            type: 'link',
            text: 'Novo Cliente',
            icon: PlusIcon,
            to: '/clients/create',
            testId: 'novo-cliente-btn',
            className: 'bg-primary hover:bg-primary-dark text-white'
          }
        ]}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total de Clientes"
          value={mockClients.length}
          icon={UserIcon}
          iconBgColor="bg-secondary-lightest"
          iconColor="text-secondary-dark"
        />
        <StatCard
          title="Agricultura"
          value={mockClients.filter(c => c.type === 'agriculture').length}
          icon={UserIcon}
          iconBgColor="bg-primary-lightest"
          iconColor="text-primary-dark"
        />
        <StatCard
          title="Agronegócio"
          value={mockClients.filter(c => c.type === 'agribusiness').length}
          icon={UserIcon}
          iconBgColor="bg-secondary"
          iconColor="text-white"
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          title="Lista de Clientes"
          columns={[
            { key: 'name', label: 'Cliente' },
            {
              key: 'type',
              label: 'Tipo',
              render: (_, row) => row.type === 'agriculture' ? 'Agricultura' : 'Agronegócio'
            },
            { key: 'document', label: 'Documento' },
            { key: 'phone', label: 'Contato' },
            { 
              key: 'actions', 
              label: 'Ações',
              render: (_, row) => (
                <Link
                  to={`/clients/edit/${row.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Editar
                </Link>
              )
            }
          ]}
          data={mockClients}
        />
      </div>
    </div>
  );
};

export default Clients;
