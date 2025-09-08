import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, UserIcon, PlayIcon } from '@heroicons/react/24/outline';
import { mockClients } from '../data/mockData';
import Table from '../components/Table';
import StatCard from '../components/StatCard';

const Clients: React.FC = () => {
  
  const getClientTypeLabel = (type: string) => {
    return type === 'agriculture' ? 'Agricultura' : 'Agronegócio';
  };

  const getClientTypeColor = (type: string) => {
    return type === 'agriculture' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            👥 Clientes
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus clientes de agricultura e agronegócio
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <PlayIcon className="w-5 h-5" />
            <span>Tour: Criar Cliente</span>
          </button>
          <Link
            to="/clients/create"
            data-testid="novo-cliente-btn"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Novo Cliente</span>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total de Clientes"
          value={mockClients.length}
          icon={UserIcon}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Agricultura"
          value={mockClients.filter(c => c.type === 'agriculture').length}
          icon={UserIcon}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Agronegócio"
          value={mockClients.filter(c => c.type === 'agribusiness').length}
          icon={UserIcon}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          title="Lista de Clientes"
          columns={[
            { key: 'name', label: 'Cliente' },
            { key: 'type', label: 'Tipo' },
            { key: 'document', label: 'Documento' },
            { key: 'phone', label: 'Contato' },
          ]}
          data={mockClients}
        />
      </div>
    </div>
  );
};

export default Clients;
