import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../components/PageHeader';
import { maskCPF, maskCNPJ, maskPhone } from '../../utils/mask';
import Notification from '../../components/Notification';

const CreateClient: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'agriculture' as 'agriculture' | 'agribusiness',
    document: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === 'document') {
      if (formData.type === 'agriculture') {
        maskedValue = maskCPF(value);
      } else {
        maskedValue = maskCNPJ(value);
      }
    }
    if (name === 'phone') {
      maskedValue = maskPhone(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: maskedValue
    }));
  };


  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        navigate('/clients');
      }, 1800);
    }, 1000);
  };

  const isFormValid = formData.name && formData.document && formData.email && formData.phone;

  return (
    <div className="p-6">
      {showNotification && (
        <Notification
          message="Cliente criado com sucesso!"
          type="success"
          onClose={() => setShowNotification(false)}
        />
      )}
      <PageHeader
        title="Novo Cliente"
        subtitle="Preencha os dados para cadastrar um novo cliente"
        variant="simple"
        actions={[
          {
            type: 'link',
            icon: ArrowLeftIcon,
            to: '/clients',
            text: 'Voltar'
          }
        ]}
      />
      <div className="px-6">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                data-testid="client-name-input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Digite o nome completo do cliente"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cliente *
                </label>
                <select
                  id="type"
                  name="type"
                  data-testid="client-type-select"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="agriculture">Agricultura (Pessoa Física)</option>
                  <option value="agribusiness">Agronegócio (Empresa)</option>
                </select>
              </div>
              <div>
                <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.type === 'agriculture' ? 'CPF *' : 'CNPJ *'}
                </label>
                <input
                  type="text"
                  id="document"
                  name="document"
                  data-testid="client-document-input"
                  value={formData.document}
                  onChange={handleInputChange}
                  placeholder={formData.type === 'agriculture' ? '000.000.000-00' : '00.000.000/0000-00'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@exemplo.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                data-testid="save-client-btn"
                disabled={!isFormValid}
                className="bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors text-sm"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClient;
