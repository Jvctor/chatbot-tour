import type { KnowledgeBase } from '../types';

export const knowledgeBase: KnowledgeBase = {
  global: {
    keywords: ['oi', 'olá', 'hello', 'help', 'ajuda', 'tour', 'guia', 'menu', 'início'],
    responses: {
      'saudacao': 'Olá! 👋 Sou seu assistente virtual. Como posso te ajudar hoje?',
      'ajuda': 'Posso te ajudar com navegação, criação de clientes, operações e muito mais! Que tal começar um tour?',
      'tour': 'Tenho vários tours disponíveis! Posso te guiar por "Criar Cliente" ou "Nova Operação". O que prefere?',
      'fallback': 'Hmm, não tenho certeza do que você quer fazer. Baseado na página atual, posso te ajudar com:\n\n🎯 Ações sugeridas:\n• Digite "criar" para ver opções de criação\n• Digite "ajuda" para orientações gerais\n• Digite "tour" para tours guiados'
    },
    tours: ['tour-geral'],
    quickActions: ['Ver tours disponíveis', 'Ajuda geral', 'Começar do início'],
    synonyms: {
      'ajuda': ['help', 'socorro', 'auxílio', 'suporte'],
      'tour': ['guia', 'tutorial', 'passo a passo', 'orientação'],
      'criar': ['novo', 'adicionar', 'cadastrar', 'registrar']
    }
  },

  clients: {
    keywords: ['cliente', 'clientes', 'agricultor', 'produtor', 'tipo cliente', 'agricultura', 'agronegócio', 'novo cliente', 'cadastro cliente'],
    responses: {
      'criar': '🎯 **Criar Cliente** - Perfeito! Para criar um cliente:\n\n1️⃣ Clique no botão "Novo Cliente"\n2️⃣ Escolha o tipo (Agricultura ou Agronegócio)\n3️⃣ Preencha os dados obrigatórios\n\n💡 **Quer que eu te guie passo a passo? Digite "tour cliente"!**',
      'como criar um cliente': '📋 **Processo de Criação de Cliente:**\n\n🔹 **Passo 1:** Clique em "Novo Cliente"\n🔹 **Passo 2:** Selecione o tipo:\n   • 🌱 Agricultura (pessoa física)\n   • 🏭 Agronegócio (empresa)\n🔹 **Passo 3:** Preencha os campos obrigatórios\n🔹 **Passo 4:** Valide e salve\n\n🚀 **Quer iniciar um tour completo? Digite "tour cliente"!**',
      'diferença entre tipos': '🔍 **Diferença entre Tipos de Cliente:**\n\n🌱 **AGRICULTURA**\n• Pessoa física (CPF)\n• Pequenos produtores rurais\n• Propriedades menores\n• Crédito rural simplificado\n\n🏭 **AGRONEGÓCIO**\n• Pessoa jurídica (CNPJ)\n• Grandes produtores\n• Empresas do setor\n• Operações de maior volume\n\n💡 **Precisa de mais detalhes sobre algum tipo?**',
      'tipo': '📋 **Tipos de Cliente:**\n\n🌱 **Agricultura** - Pessoa física, pequenos produtores\n🏭 **Agronegócio** - Empresas, grandes produtores\n\n*Qual tipo você precisa cadastrar?*',
      'formulario': '📝 **Campos do Formulário:**\n• Nome completo ✅\n• Tipo de cliente ✅\n• Documento (CPF/CNPJ) ✅\n• Email ✅\n• Telefone ✅',
      'agricultura': '🌱 **Tipo Agricultura** é para pessoas físicas e pequenos produtores rurais.',
      'agronegocio': '🏭 **Tipo Agronegócio** é para empresas e grandes produtores do setor.',
      'como editar cliente': '✏️ **Editar Cliente:**\n\n1️⃣ Vá para a lista de clientes\n2️⃣ Clique no ícone de edição\n3️⃣ Modifique os campos necessários\n4️⃣ Salve as alterações\n\n⚠️ **Atenção:** Tipo de cliente não pode ser alterado após criação.',
      'campos obrigatórios': '📋 **Campos Obrigatórios:**\n\n✅ **Nome:** Nome completo ou razão social\n✅ **Tipo:** Agricultura ou Agronegócio\n✅ **Documento:** CPF (11 dígitos) ou CNPJ (14 dígitos)\n✅ **Email:** Endereço válido para contato\n✅ **Telefone:** Número com DDD\n\n💡 **Todos os campos são necessários para prosseguir!**'
    },
    tours: ['tour-criar-cliente', 'tour-gerenciar-clientes'],
    quickActions: ['Como criar um cliente?', 'Diferença entre tipos?', 'Campos obrigatórios', 'Tour completo'],
    synonyms: {
      'criar': ['novo', 'cadastrar', 'adicionar', 'registrar'],
      'tipo': ['categoria', 'modalidade', 'perfil', 'classificação'],
      'cliente': ['usuário', 'conta', 'cadastro', 'pessoa'],
      'diferença': ['diferencial', 'distinção', 'comparação']
    }
  },

  operations: {
    keywords: ['operação', 'operações', 'nova operação', 'processo', 'crédito', 'status', 'análise', 'formulário operação'],
    responses: {
      'criar': '💼 **Nova Operação** - Excelente escolha!\n\n📋 **Processo em 4 etapas:**\n1️⃣ Tipo de Cliente\n2️⃣ Dados do Cliente\n3️⃣ Dados da Operação\n4️⃣ Confirmação\n\n🚀 **Quer um tour guiado? Digite "tour operação"!**',
      'como preencher formulário': '📝 **Como Preencher o Formulário de Operação:**\n\n🔹 **Etapa 1:** Selecione o cliente existente\n🔹 **Etapa 2:** Escolha o tipo de operação\n🔹 **Etapa 3:** Defina o valor solicitado\n🔹 **Etapa 4:** Adicione observações (opcional)\n🔹 **Etapa 5:** Revise e envie\n\n💡 **Precisa de ajuda com alguma etapa específica? Digite "tour operação" para um guia completo!**',
      'status das operações': '📊 **Status das Operações:**\n\n📝 **RASCUNHO** - Operação não enviada\n📤 **ENVIADO** - Aguardando análise\n🔍 **EM ANÁLISE** - Sendo avaliada\n✅ **APROVADO** - Crédito liberado\n❌ **REJEITADO** - Não aprovado\n\n🔄 **Você pode acompanhar em tempo real!**',
      'status': '📊 **Status das Operações:**\n\n📝 Rascunho\n📤 Enviado\n🔍 Em Análise\n✅ Aprovado\n❌ Rejeitado',
      'formulario': '📋 **Dados necessários:**\n1. Selecionar cliente\n2. Tipo de operação\n3. Valor solicitado\n4. Observações',
      'credito': '💰 **Modalidades de Crédito Rural:**\n• Custeio agrícola\n• Investimento\n• Comercialização\n• Industrialização',
      'analise': '🔍 **Processo de Análise:**\nApós envio → Em Análise → Você recebe atualizações por email → Decisão final',
      'modalidades disponíveis': '💰 **Modalidades de Crédito Disponíveis:**\n\n🌾 **CUSTEIO AGRÍCOLA**\n• Financiamento da safra\n• Compra de insumos\n• Mão de obra\n\n🏗️ **INVESTIMENTO**\n• Máquinas e equipamentos\n• Construções rurais\n• Melhoramento da propriedade\n\n📦 **COMERCIALIZAÇÃO**\n• Estocagem da produção\n• Beneficiamento\n• Transporte\n\n🏭 **INDUSTRIALIZAÇÃO**\n• Processamento agrícola\n• Agregação de valor\n\n💡 **Qual modalidade te interessa?**',
      'acompanhar análise': '👀 **Como Acompanhar a Análise:**\n\n📧 **Email:** Notificações automáticas\n📱 **Sistema:** Status em tempo real\n📊 **Dashboard:** Visão geral das operações\n⏰ **Prazo:** Até 5 dias úteis\n\n🔔 **Você será notificado de qualquer mudança!**'
    },
    tours: ['tour-nova-operacao', 'tour-acompanhar-operacoes'],
    quickActions: ['Como preencher formulário?', 'Status das operações', 'Modalidades disponíveis', 'Tour completo'],
    synonyms: {
      'criar': ['nova', 'iniciar', 'começar', 'solicitar'],
      'operação': ['processo', 'transação', 'solicitação', 'pedido'],
      'status': ['situação', 'estado', 'etapa', 'fase'],
      'formulário': ['form', 'cadastro', 'preenchimento'],
      'preencher': ['completar', 'preencer', 'inserir dados']
    }
  },

  // 🧠 SISTEMA DE CONTEXTO INTELIGENTE
  contextualLogic: {
    pageContext: {
      '/': 'global',
      '/dashboard': 'global',
      '/clients': 'clients',
      '/clients/create': 'clients',
      '/clients/edit': 'clients',
      '/operations': 'operations',
      '/operations/create': 'operations',
      '/operations/edit': 'operations'
    },
    ambiguousKeywords: {
      'criar': {
        question: '🤔 O que você gostaria de criar?',
        contexts: {
          'clients': 'Detectei que você está na área de clientes. Quer **criar um cliente**?',
          'operations': 'Você está na área de operações. Quer **criar uma operação**?',
          'global': 'Posso te ajudar a criar:'
        },
        options: [
          { text: '👤 Criar Cliente', action: 'clients.criar', context: 'clients' },
          { text: '💼 Criar Operação', action: 'operations.criar', context: 'operations' },
          { text: '🎯 Me diga mais sobre o que precisa', action: 'global.ajuda' }
        ]
      },
      'novo': {
        question: '✨ Que tipo de cadastro você quer fazer?',
        contexts: {
          'clients': 'Na área de clientes você pode criar um **novo cliente**.',
          'operations': 'Na área de operações você pode criar uma **nova operação**.',
          'global': 'Você pode criar:'
        },
        options: [
          { text: '👤 Novo Cliente', action: 'clients.criar' },
          { text: '💼 Nova Operação', action: 'operations.criar' }
        ]
      }
    },
    routePatterns: {
      'clients': ['cliente', 'cadastro', 'agricultor', 'produtor'],
      'operations': ['operação', 'crédito', 'processo', 'análise'],
      'dashboard': ['resumo', 'overview', 'geral', 'início']
    }
  },

  // 🎯 SISTEMA DE INTENÇÕES E CONFIANÇA
  intentMatching: {
    patterns: [
      // Intenções de alta confiança - Clientes
      { intent: 'create_client', keywords: ['criar cliente', 'novo cliente', 'cadastrar cliente'], confidence: 0.95, context: 'clients' },
      { intent: 'client_help', keywords: ['como criar um cliente', 'como criar cliente'], confidence: 0.95, context: 'clients' },
      { intent: 'client_types', keywords: ['diferença entre tipos', 'tipos de cliente', 'agricultura agronegócio'], confidence: 0.9, context: 'clients' },
      { intent: 'client_fields', keywords: ['campos obrigatórios', 'formulário cliente'], confidence: 0.9, context: 'clients' },
      { intent: 'edit_client', keywords: ['como editar cliente', 'editar cliente'], confidence: 0.9, context: 'clients' },
      
      // Intenções de alta confiança - Operações
      { intent: 'create_operation', keywords: ['criar operação', 'nova operação', 'solicitar crédito'], confidence: 0.95, context: 'operations' },
      { intent: 'operation_form', keywords: ['como preencher formulário', 'preencher formulário'], confidence: 0.95, context: 'operations' },
      { intent: 'operation_status', keywords: ['status das operações', 'status operação'], confidence: 0.9, context: 'operations' },
      { intent: 'credit_types', keywords: ['modalidades disponíveis', 'tipos de crédito'], confidence: 0.9, context: 'operations' },
      { intent: 'follow_analysis', keywords: ['acompanhar análise', 'acompanhar operação'], confidence: 0.9, context: 'operations' },
      
      // Intenções de média confiança
      { intent: 'help_clients', keywords: ['ajuda cliente', 'como cadastrar'], confidence: 0.7, context: 'clients' },
      { intent: 'help_operations', keywords: ['ajuda operação', 'como solicitar'], confidence: 0.7, context: 'operations' },
      
      // Intenções de baixa confiança (precisam contexto)
      { intent: 'ambiguous_create', keywords: ['criar', 'novo', 'cadastrar'], confidence: 0.4 },
      { intent: 'ambiguous_help', keywords: ['ajuda', 'como'], confidence: 0.3 },
      { intent: 'general_navigation', keywords: ['ir para', 'navegar', 'página'], confidence: 0.5 }
    ],
    confidenceThreshold: 0.6
  },

  // 💾 GERENCIAMENTO DE SESSÃO
  sessionManagement: {
    rememberContext: true,
    maxHistorySize: 10,
    contextWeights: {
      'currentPage': 0.4,      // 40% peso para página atual
      'recentMessages': 0.3,   // 30% peso para mensagens recentes
      'userIntent': 0.2,       // 20% peso para intenção detectada
      'timeContext': 0.1       // 10% peso para contexto temporal
    }
  }
};
