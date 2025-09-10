import type { KnowledgeBase } from '../types';

export const knowledgeBase: KnowledgeBase = {
  global: {
    keywords: ['oi', 'olá', 'help', 'ajuda', 'tour', 'guia'],
    responses: {
      'saudacao': 'Olá! 👋 Sou seu assistente virtual. Como posso te ajudar hoje?',
      'ajuda': 'Posso te ajudar com navegação, criação de clientes, operações e muito mais! Que tal começar um tour?',
      'tour': 'Tenho vários tours disponíveis! Posso te guiar por "Criar Cliente" ou "Nova Operação". O que prefere?',
      'fallback': 'Desculpe, não entendi. Que tal começar um tour guiado? Digite "tour" para ver as opções!'
    },
    tours: ['tour-geral'],
    quickActions: ['Ver tours disponíveis', 'Ajuda geral', 'Começar do início']
  },

  clients: {
    keywords: ['criar', 'cliente', 'tipo', 'agricultura', 'agronegócio', 'novo', 'cadastro'],
    responses: {
      'criar cliente': 'Para criar um cliente, clique no botão "Novo Cliente" e preencha o formulário. Posso te guiar passo a passo!',
      "tipo": "Temos dois tipos: Agricultura (pessoa física/pequenos produtores) e Agronegócio (empresas/grandes produtores).",
      'formulario': 'O formulário tem campos para nome, tipo, documento, email e telefone. Todos são obrigatórios.',
      'agricultura': 'Tipo Agricultura é para pessoas físicas e pequenos produtores rurais.',
      'agronegocio': 'Tipo Agronegócio é para empresas e grandes produtores do setor.'
    },
    tours: ['tour-criar-cliente', 'tour-gerenciar-clientes'],
    quickActions: ['Novo cliente', 'Ver clientes existentes', 'Tutorial completo']
  },

  operations: {
    keywords: ['operação', 'nova', 'criar', 'formulário', 'status', 'crédito', 'análise'],
    responses: {
      'nova operacão': 'O processo tem 4 etapas: Tipo de Cliente, Dados do Cliente, Dados da Operação e Confirmação. Posso te guiar!',
      'status': 'Os status possíveis são: Rascunho, Enviado, Em Análise, Aprovado, Rejeitado.',
      'formulario': 'Primeiro selecione o cliente, depois preencha tipo de operação, valor e observações.',
      'credito': 'Oferecemos várias modalidades de crédito rural adaptadas ao seu perfil.',
      'analise': 'Após envio, a operação fica "Em Análise" e você recebe atualizações por email.'
    },
    tours: ['tour-nova-operacao', 'tour-acompanhar-operacoes'],
    quickActions: ['Nova operação', 'Ver em andamento', 'Histórico completo']
  }
};
