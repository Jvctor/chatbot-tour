import React, { useState } from 'react';
import { maskMoney } from '../../utils/mask';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { mockClients } from '../../data/mockData';

import PageHeader from '../../components/PageHeader';
import Notification from '../../components/Notification';

const CreateOperation: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientId: '',
    type: '',
    amount: '',
    description: '',
  });
  const [showNotification, setShowNotification] = useState(false);

  const operationTypes = [
    'Custeio Agrícola',
    'Investimento Rural',
    'Crédito Pecuário',
    'Financiamento de Máquinas',
    'Capital de Giro Rural'
  ];



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === 'amount') {
      maskedValue = maskMoney(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: maskedValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        navigate('/operations');
      }, 1800);
    }, 1000);
  };

  return (
    <div className="p-6">
      {showNotification && (
        <Notification
          message="Operação criada com sucesso!"
          type="success"
          onClose={() => setShowNotification(false)}
        />
      )}
      <PageHeader
        title="Nova Operação"
        subtitle="Crie uma nova operação de crédito rural"
        variant="simple"
        actions={[
          {
            type: 'link',
            icon: ArrowLeftIcon,
            to: '/operations',
            text: 'Voltar'
          }
        ]}
      />
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-3">
                Cliente *
              </label>
              <select
                id="clientId"
                name="clientId"
                data-testid="select-client"
                value={formData.clientId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione um cliente</option>
                {mockClients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.type === 'agriculture' ? 'Agricultura' : 'Agronegócio'}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Crédito *
                </label>
                <select
                  id="type"
                  name="type"
                  data-testid="operation-type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  {operationTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Solicitado *
                </label>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  data-testid="operation-amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="R$ 0,00"
                  inputMode="numeric"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Descreva o uso do crédito, garantias, etc."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="pt-6 mt-6 flex justify-end">
              <button
                type="submit"
                data-testid="submit-operation"
                className="px-4 py-2 bg-primary text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !formData.clientId ||
                  !formData.type ||
                  !formData.amount ||
                  Number(formData.amount.replace(/\D/g, '')) <= 0
                }
              >
                Enviar Operação
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOperation;
