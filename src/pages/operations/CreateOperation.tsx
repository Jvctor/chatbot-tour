import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { mockClients } from '../../data/mockData';
import PageHeader from '../../components/PageHeader';
import StepProgress from '../../components/StepProgress';

const CreateOperation: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clientId: '',
    type: '',
    amount: '',
    description: '',
  });

  const operationTypes = [
    'Custeio Agrícola',
    'Investimento Rural',
    'Crédito Pecuário',
    'Financiamento de Máquinas',
    'Capital de Giro Rural'
  ];

  const steps = [
    { id: 1, label: 'Cliente' },
    { id: 2, label: 'Tipo' },
    { id: 3, label: 'Dados' },
    { id: 4, label: 'Confirmar' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simula salvamento
    console.log('Operação criada:', formData);
    
    // Simula delay e redireciona
    setTimeout(() => {
      alert('Operação criada com sucesso!');
      navigate('/operations');
    }, 1000);
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1: return formData.clientId !== '';
      case 2: return formData.type !== '';
      case 3: return formData.amount !== '' && parseFloat(formData.amount) > 0;
      case 4: return true;
      default: return false;
    }
  };

  const getSelectedClient = () => {
    return mockClients.find(c => c.id === formData.clientId);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              1. Selecionar Cliente
            </h3>
            <p className="text-gray-600">
              Escolha o cliente para esta operação de crédito
            </p>
            
            <div className="max-w-xl">
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              2. Tipo de Operação
            </h3>
            <p className="text-gray-600">
              Selecione o tipo de crédito rural desejado
            </p>
            
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              3. Dados da Operação
            </h3>
            <p className="text-gray-600">
              Informe o valor e detalhes da operação
            </p>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Valor Solicitado *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                data-testid="operation-amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
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
          </div>
        );

      case 4:
        const selectedClient = getSelectedClient();
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              4. Confirmação
            </h3>
            <p className="text-gray-600">
              Revise os dados antes de enviar a operação
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Cliente:</span>
                <p className="text-gray-900">{selectedClient?.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Tipo:</span>
                <p className="text-gray-900">{formData.type}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Valor:</span>
                <p className="text-gray-900 text-xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(parseFloat(formData.amount) || 0)}
                </p>
              </div>
              {formData.description && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Observações:</span>
                  <p className="text-gray-900">{formData.description}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
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
      <StepProgress 
        steps={steps} 
        currentStep={currentStep}
      />
      <div className=" mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            {renderStep()}
            <div className="flex justify-between pt-6 border-t mt-6">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>

              <div className="space-x-3">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isCurrentStepValid()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    type="submit"
                    data-testid="submit-operation"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Enviar Operação
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOperation;
