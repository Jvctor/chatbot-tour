
# Chatbot Tour - Sistema de Tours Contextuais com React, TypeScript e Vite

Este projeto implementa um sistema de tours guiados e chatbot inteligente para aplicações React, com foco em contexto de página e experiência do usuário.

## Sumário
- [Decisões Técnicas e Arquiteturais](#decisões-técnicas-e-arquiteturais)
- [Como o sistema contextual funciona](#como-o-sistema-contextual-funciona)
- [Como adicionar novos tours/contextos](#como-adicionar-novos-tourscontextos)
- [Instruções para executar o projeto](#instruções-para-executar-o-projeto)

---

## Decisões Técnicas e Arquiteturais

- **Stack:** React + TypeScript + Vite + Zustand (gerenciamento de estado) + TailwindCSS.
- **Arquitetura modular:**
  - `src/components/chatbot/` - Componentes do chatbot e janela de chat.
  - `src/components/tour/` - Componentes do sistema de tour guiado.
  - `src/data/knowledgeBase.ts` - Base de conhecimento contextual e lógica de intenções.
  - `src/data/tours.ts` - Definição dos tours e seus passos.
  - `src/hooks/` - Hooks customizados para contexto e chat inteligente.
  - `src/stores/` - Zustand stores para chat e tour.
- **Lazy loading:** Tours são carregados sob demanda para otimizar performance.
- **Contexto de página:** O sistema detecta a rota/página atual e ajusta sugestões, respostas e tours.
- **Testabilidade:** Componentes e lógica separados para fácil manutenção e testes.

## Como o sistema contextual funciona

O sistema utiliza uma base de conhecimento (`knowledgeBase.ts`) e lógica de processamento de mensagens para:

1. **Detectar contexto:**
  - O hook `useContext` identifica a página atual e define o contexto (ex: `clients`, `operations`).
  - O contexto é salvo no Zustand store e usado pelo chatbot e pelo tour.

2. **Processamento de mensagens:**
  - O `IntelligentChatProcessor` analisa a mensagem do usuário, identifica intenção, entidades e contexto.
  - Utiliza padrões, sinônimos e pesos de contexto para sugerir ações e respostas.
  - Se a mensagem for ambígua, sugere opções de desambiguação.

3. **Sugestão de tours e ações:**
  - O chatbot sugere tours relevantes conforme o contexto e intenção detectada.
  - O usuário pode iniciar um tour digitando comandos ou clicando em botões.

4. **Execução do tour:**
  - O tour é definido em `src/data/tours.ts` como uma lista de passos (steps), cada um com seletor, título, descrição e ação.
  - O componente `TourOverlay` destaca elementos na tela e orienta o usuário passo a passo.
  - O tour pode ser iniciado via chat ou botões nas páginas.

## Como adicionar novos tours/contextos

### 1. Adicionar um novo tour

1. Edite o arquivo `src/data/tours.ts` e adicione um novo objeto à lista `tours`:
  ```ts
  {
    id: 'tour-exemplo',
    name: 'Nome do Tour',
    description: 'Descrição do tour',
    context: ['clients'], // ou 'operations', etc
    steps: [
     {
      id: 'step-1',
      selector: '[data-testid="elemento"]',
      title: 'Título do passo',
      description: 'Descrição do passo',
      position: 'bottom',
      action: 'click' // ou 'input', 'navigate'
     },
     // ...outros passos
    ]
  }
  ```
2. Adicione botões ou comandos para iniciar o tour, se desejar, nas páginas ou no chatbot.

### 2. Adicionar novo contexto ou respostas

1. Edite `src/data/knowledgeBase.ts`:
  - Adicione um novo bloco em `knowledgeBase` para o contexto desejado (ex: `clients`, `operations`).
  - Defina `keywords`, `responses`, `tours` e `quickActions`.
  - Adicione sinônimos e padrões de intenção se necessário.

2. Para lógica de desambiguação, edite `contextualLogic.ambiguousKeywords`.

## Instruções para executar o projeto

1. **Pré-requisitos:**
  - Node.js 18+
  - npm 9+

2. **Instale as dependências:**
  ```sh
  npm install
  ```

3. **Execute o projeto em modo desenvolvimento:**
  ```sh
  npm run dev
  ```
  O app estará disponível em `http://localhost:5173`.

4. **Build para produção:**
  ```sh
  npm run build
  ```

5. **Outros comandos úteis:**
  - `npm run lint` — Lint do código
  - `npm run preview` — Preview do build

---
