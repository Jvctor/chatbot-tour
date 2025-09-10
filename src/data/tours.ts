import type { Tour } from '../types';

export const tours: Tour[] = [
  {
    id: 'tour-criar-cliente',
    name: 'Como criar um cliente',
    description: 'Aprenda a cadastrar um novo cliente passo a passo',
    context: ['clients'],
    steps: [
      {
        id: 'step-1',
        selector: '[data-testid="novo-cliente-btn"]',
        title: 'Botão Novo Cliente',
        description: 'Clique no botão "Novo Cliente" para começar o cadastro',
        position: 'bottom',
        action: 'click',
      },
      {
        id: 'step-2',
        selector: '[data-testid="client-name-input"]',
        title: 'Nome do Cliente',
        description: 'Digite o nome completo do cliente',
        position: 'bottom',
        action: 'input',
      },
      {
        id: 'step-3',
        selector: '[data-testid="client-type-select"]',
        title: 'Tipo de Cliente',
        description: 'Selecione entre Agricultura ou Agronegócio',
        position: 'bottom',
        action: 'click',
      },
      {
        id: 'step-4',
        selector: '[data-testid="client-document-input"]',
        title: 'Documento',
        description: 'Informe CPF (Agricultura) ou CNPJ (Agronegócio)',
        position: 'bottom',
        action: 'input',
      },
      {
        id: 'step-5',
        selector: '[data-testid="client-email-input"]',
        title: 'Email',
        description: 'Digite o email do cliente',
        position: 'bottom',
        action: 'input',
      },
       {
        id: 'step-6',
        selector: '[data-testid="client-phone-input"]',
        title: 'Telefone',
        description: 'Digite o telefone do cliente',
        position: 'bottom',
        action: 'input',
      },
      {
        id: 'step-7',
        selector: '[data-testid="save-client-btn"]',
        title: 'Salvar Cliente',
        description: 'Clique em "Salvar" para finalizar o cadastro',
        position: 'top',
        action: 'click',
      }
    ]
  },
  {
    id: 'tour-nova-operacao',
    name: 'Como criar uma operação',
    description: 'Aprenda a criar uma nova operação de crédito',
    context: ['operations'],
    steps: [
      {
        id: 'step-1',
        selector: '[data-testid="nova-operacao-btn"]',
        title: 'Nova Operação',
        description: 'Clique em "Nova Operação" para começar',
        position: 'bottom',
        action: 'click',
      },
      {
        id: 'step-2',
        selector: '[data-testid="select-client"]',
        title: 'Selecionar Cliente',
        description: 'Escolha o cliente para esta operação',
        position: 'bottom',
        action: 'click',
      },
      {
        id: 'step-3',
        selector: '[data-testid="operation-type"]',
        title: 'Tipo de Operação',
        description: 'Selecione o tipo de crédito desejado',
        position: 'bottom',
        action: 'click',
      },
      {
        id: 'step-4',
        selector: '[data-testid="operation-amount"]',
        title: 'Valor',
        description: 'Digite o valor da operação',
        position: 'bottom',
        action: 'input',
      },
      {
        id: 'step-5',
        selector: '[data-testid="submit-operation"]',
        title: 'Enviar Operação',
        description: 'Clique em "Enviar" para submeter a operação',
        position: 'top',
        action: 'click',
      }
    ]
  }
];
