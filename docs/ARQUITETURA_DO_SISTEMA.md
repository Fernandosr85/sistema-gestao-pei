# Arquitetura do Sistema

## Visão Geral

O **Sistema de Gestão PEI** é uma aplicação web voltada para a gestão de educação inclusiva em qualquer instituição de ensino. A instituição é configurada em `src/config/institution.ts`. A solução centraliza informações de estudantes com necessidades educacionais especiais, permitindo acompanhamento pedagógico, registros de observações, agenda de atendimentos, relatórios e apoio à conformidade legal.

## Objetivos do Sistema

- Centralizar dados dos estudantes
- Registrar observações pedagógicas e comportamentais
- Organizar atendimentos multidisciplinares
- Gerar relatórios e análises
- Apoiar a conformidade com a legislação brasileira
- Facilitar análise de complexidade e distribuição de carga
- Disponibilizar biblioteca de recursos pedagógicos adaptados

## Stack Principal

| Tecnologia | Versão | Finalidade |
|---|---:|---|
| React | 18.3.1 | Interface de usuário |
| TypeScript | 5.5.3 | Tipagem estática |
| Vite | 5.4.x | Build e desenvolvimento |
| Tailwind CSS | 3.4.x | Estilização utilitária |
| Shadcn/ui | - | Componentes reutilizáveis |
| Recharts | 2.15.x | Gráficos e visualizações |
| React Big Calendar | 1.19.x | Calendário |
| React Router DOM | 6.30.x | Roteamento |
| TanStack Query | 5.x | Estado assíncrono |
| React Hook Form | 7.x | Formulários |
| Zod | 3.x | Validação |
| Lucide React | 0.462.x | Ícones |

## Padrão Arquitetural

A aplicação segue o modelo **SPA (Single Page Application)** com **roteamento client-side**.  
No estado atual, os dados são fornecidos por **mock data**, mas a interface foi preparada para futura integração com backend real, sem dependência de um provedor específico.

## Estrutura de Diretórios

```text
src/
├─ pages/                 # Páginas e rotas
├─ components/            # Componentes reutilizáveis
├─ components/ui/         # Base Shadcn/ui
├─ components/gestao/     # Componentes do painel de gestão
├─ components/reports/    # Relatórios e gráficos
├─ data/                  # Dados mock
├─ types/                 # Interfaces e tipos TypeScript
├─ hooks/                 # Hooks customizados
├─ lib/                   # Utilitários
docs/                     # Documentação complementar
```

## Estrutura Funcional

### Módulos principais

- **Dashboard**
- **Gestão de Alunos**
- **Sistema de Observações**
- **Agenda de Atendimentos**
- **Painel de Gestão**
- **Relatórios Inteligentes**
- **Biblioteca de Recursos**
- **Marco Legal**
- **Manual de Procedimentos**

## Rotas da Aplicação

| Rota | Página | Descrição |
|---|---|---|
| `/` | Dashboard | KPIs e ações rápidas |
| `/alunos` | Students | Lista e busca de alunos |
| `/alunos/novo` | NewStudent | Cadastro de aluno |
| `/alunos/:id` | StudentDetail | Perfil detalhado |
| `/observacoes` | Observations | Lista de observações |
| `/observacoes/nova` | NewObservation | Novo registro |
| `/agenda` | AgendaAtendimentos | Calendário de atendimentos |
| `/gestao` | Gestao | Painel administrativo |
| `/relatorios` | Reports | Relatórios inteligentes |
| `/recursos` | ResourceLibrary | Biblioteca pedagógica |
| `/legislacao` | Legislation | Marco legal |
| `/manual` | Manual | Procedimentos de inclusão |
| `/minha-agenda` | MinhaAgenda | Agenda pessoal |
| `/complexidade` | ComplexityAnalysis | Análise de complexidade |

## Tipos e Interfaces

As principais entidades do sistema incluem:

- `Student`
- `Observation`
- `Assessment`
- `Meeting`
- `Professional`
- `Resource`
- `ResourceReview`
- `Badge`
- `CalendarConnection`

## Integrações Planejadas

| Integração | Status | Descrição |
|---|---|---|
| Backend de persistência | Planejado | Banco, autenticação e storage |
| Google Calendar | UI pronta | Sincronização bidirecional |
| Microsoft Outlook | UI pronta | Sincronização bidirecional |
| Geração de PDF | Planejado | Exportação de relatórios |
| Geração de Excel | Planejado | Exportação de planilhas |
| Email / Push Notifications | UI pronta | Sistema de notificações |

## Roadmap

### Fase 1
- Integração com banco de dados
- Sistema de autenticação e login
- CRUD real de alunos e observações

### Fase 2
- OAuth com Google Calendar e Outlook
- Geração de relatórios PDF/Excel
- Sistema de notificações push

### Fase 3
- Análise preditiva com IA
- App mobile (PWA)
- Integração com sistemas acadêmicos da instituição

## Observações

Este documento foi estruturado para uso em repositório GitHub.  
Para detalhes operacionais e funcionais, consulte os demais arquivos da documentação.
