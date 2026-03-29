# Guia de Contribuição

## Objetivo

Este guia define boas práticas para contribuir com o projeto **Sistema de Gestão PEI**.

## Stack do Projeto

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- TanStack Query
- React Hook Form
- Zod

## Pré-requisitos

- Node.js 18+
- npm
- Git

## Configuração do Ambiente

```bash
git clone https://github.com/Fernandosr85/sistema-gestao-pei.git
cd sistema-gestao-pei
npm install
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:8080
```

## Estrutura Recomendada de Trabalho

### 1. Crie uma branch

Use nomes objetivos para a branch, por exemplo:

```bash
git checkout -b feat/novo-relatorio
```

ou

```bash
git checkout -b fix/correcao-dashboard
```

### 2. Faça alterações pequenas e claras

Prefira mudanças focadas:
- um componente
- um fluxo
- uma correção específica
- uma melhoria de documentação

### 3. Mantenha a padronização

- Use TypeScript em todos os novos módulos
- Reaproveite componentes existentes
- Padronize o estilo com Tailwind CSS
- Mantenha nomenclatura consistente
- Evite duplicação de código

## Boas Práticas de Desenvolvimento

### Componentes
- Criar componentes reutilizáveis
- Evitar componentes muito grandes
- Separar UI e regras de negócio quando fizer sentido
- Preferir composição

### Tipagem
- Declarar interfaces e tipos de forma explícita
- Centralizar tipos compartilhados em `src/types/`
- Evitar uso desnecessário de `any`

### Formulários
- Utilizar `React Hook Form`
- Validar dados com `Zod`
- Padronizar mensagens de erro

### Estado e Dados
- Organizar chamadas assíncronas com `TanStack Query`
- Manter mock data isolado enquanto não houver backend real
- Preparar código para futura integração com API

### Estilo
- Utilizar classes utilitárias do Tailwind
- Reaproveitar base do Shadcn/ui
- Preservar consistência visual entre módulos

## Organização de Pastas

```text
src/pages/         # Rotas e páginas
src/components/    # Componentes reutilizáveis
src/data/          # Dados mock
src/types/         # Interfaces TypeScript
src/hooks/         # Hooks customizados
src/lib/           # Helpers e utilitários
docs/              # Documentação
```

## Sugestão de Convenção de Commit

```text
feat: adiciona gráfico de progresso do aluno
fix: corrige filtro de observações
docs: atualiza guia de componentes
refactor: reorganiza tipos de agenda
style: ajusta espaçamento do dashboard
```

## Checklist Antes de Enviar

- [ ] O código compila corretamente
- [ ] A funcionalidade foi testada localmente
- [ ] Não há erros óbvios de tipagem
- [ ] O estilo segue o padrão do projeto
- [ ] A documentação foi atualizada, quando necessário
- [ ] Não há código morto ou comentários desnecessários

## Pull Request

Ao abrir um PR:

- descreva o objetivo da mudança
- informe o impacto no sistema
- liste telas ou módulos afetados
- inclua capturas de tela, quando fizer sentido
- mencione dependências ou pontos pendentes

## Observações

A documentação original menciona boas práticas e workflow, mas não detalha um processo formal de contribuição.  
Por isso, este guia organiza um fluxo recomendado para uso no GitHub sem inventar regras específicas do time.
