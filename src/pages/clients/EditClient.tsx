import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { mockClients } from '../../data/mockData';
import Notification from '../../components/Notification';
import { maskCPF, maskCNPJ, maskPhone } from '../../utils/mask';

const EditClient: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: '',
    type: 'agriculture' as 'agriculture' | 'agribusiness',
    document: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [clientNotFound, setClientNotFound] = useState(false);

  useEffect(() => {
    const client = mockClients.find(c => c.id === id);
    
    if (client) {
      setFormData({
        name: client.name,
        type: client.type,
        document: client.document,
        email: client.email,
        phone: client.phone,
      });
    } else {
      setClientNotFound(true);
    }
    setLoading(false);
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (clientNotFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 pb-0">
          <div className="flex items-center space-x-4 mb-6">
            <Link
              to="/clients"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Cliente não encontrado
              </h1>
              <p className="text-gray-600 mt-1">
                O cliente que você está tentando editar não existe.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showNotification && (
        <Notification
          message="Cliente atualizado com sucesso!"
          type="success"
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className="p-6 pb-0">
        <div className="flex items-center space-x-4 mb-6">
          <Link
            to="/clients"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Editar Cliente
            </h1>
            <p className="text-gray-600 mt-1">
              Atualize os dados do cliente
            </p>
          </div>
        </div>
      </div>
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
                Atualizar Cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditClient;
