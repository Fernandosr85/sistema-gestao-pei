# Sistema de Gestão PEI

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

Interface para gestão de **Planos Educacionais Individualizados (PEI)** na educação inclusiva:
cadastro de estudantes, registro de observações, agenda de atendimentos, painel de gestão,
biblioteca de recursos adaptados e referências do marco legal brasileiro.

> ## ⚠️ Estado do projeto: protótipo de interface
>
> Este repositório contém **apenas o frontend**, operando sobre dados fictícios estáticos
> (`src/data/`). Não há backend, banco de dados, autenticação, controle de acesso nem
> persistência: **nada do que você preencher na interface é salvo**.
>
> Os indicadores, projeções, comparativos e valores orçamentários exibidos são **exemplos
> ilustrativos fixos no código**. Nenhum modelo estatístico ou de machine learning é
> executado, e nenhuma escola real foi medida.
>
> O sistema **não está pronto para receber dados reais de estudantes**. Ver
> [Antes de usar com dados reais](#antes-de-usar-com-dados-reais).

---

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Começando](#começando)
- [Adaptando para sua instituição](#adaptando-para-sua-instituição)
- [O que está implementado](#o-que-está-implementado)
- [Antes de usar com dados reais](#antes-de-usar-com-dados-reais)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Contribuindo](#contribuindo)
- [Documentação técnica](#documentação-técnica)
- [Licença](#licença)

---

## Funcionalidades

Telas navegáveis do protótipo:

- **Dashboard** — visão inicial com atalhos e listagens
- **Alunos** — listagem, filtros por diagnóstico, perfil detalhado, modo apresentação
- **Observações** — registro estruturado por áreas (comunicação, social, comportamento)
- **Agenda de atendimentos** — calendário em visões mês/semana/dia/lista
- **Gestão** — visão geral, alertas e riscos, análise de complexidade, relatórios, equipe, orçamento
- **Biblioteca de recursos** — catálogo de materiais adaptados com busca e filtros
- **Marco legal** — LDB 9.394/96, LBI 13.146/2015, Lei 12.764/2012, Decreto 7.611/2011
- **Manual de procedimentos** — fluxo de identificação, PEI, equipe, protocolos e avaliação

---

## Tecnologias

React 18 · TypeScript · Vite 5 · Tailwind CSS · shadcn/ui (Radix) · React Router ·
React Hook Form + Zod · Recharts · React Big Calendar · Lucide

---

## Começando

**Pré-requisitos:** Node.js 18+ e npm.

```bash
git clone https://github.com/Fernandosr85/sistema-gestao-pei.git
cd sistema-gestao-pei
npm install
npm run dev
```

A aplicação sobe em `http://localhost:8080`.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | ESLint (deve terminar com 0 erros) |
| `npm run typecheck` | Checagem de tipos sem emitir arquivos |

### Variáveis de ambiente

Opcionais no estado atual — o protótipo roda sem nenhuma. Copie `.env.example` para `.env`
quando for integrar um backend. Apenas variáveis `VITE_*` chegam ao bundle do navegador,
portanto **nunca** coloque segredos ali.

### Deploy

`npm run build` gera arquivos estáticos em `dist/`, servíveis por qualquer host estático
(Vercel, Netlify, GitHub Pages, Nginx). Não há dependência de plataforma específica.

---

## Adaptando para sua instituição

Todo o conteúdo específico de uma instituição está em **um único arquivo**:
[`src/config/institution.ts`](src/config/institution.ts).

```ts
export const institution = {
  name: "Instituição de Ensino",
  shortName: "PEI",
  enrollmentLabel: "Matrícula",
  enrollmentPrefix: "MAT",
  networkLabel: "Rede",
  units: [{ id: "unit-1", name: "Unidade 1" }],
  // ...
};
```

A paleta de cores fica em `src/index.css`, nas variáveis `--brand-*`. Os valores padrão
foram escolhidos para atingir contraste **≥ 4,5:1 com texto branco (WCAG 2.1 AA)** — ao
trocá-los pelas cores da sua instituição, verifique o contraste novamente.

`DEMO_MODE` (no mesmo arquivo) controla os avisos de "dados fictícios" exibidos nas telas
analíticas. Ele só deve ser desligado quando as telas passarem a consumir dados reais.

---

## O que está implementado

| Área | Situação |
|---|---|
| Navegação e layout | ✅ Funcional |
| Listagens, filtros e busca de alunos | ✅ Funcional (sobre dados fictícios) |
| Formulários com validação (Zod) | ⚠️ Validam, mas **descartam** o resultado |
| Cadastro/edição persistente | ❌ Não implementado |
| Autenticação, perfis e permissões | ❌ Não implementado |
| Backend e banco de dados | ❌ Não implementado |
| Exportação PDF/Excel/Word | ❌ Não implementado |
| Sincronização Google Calendar / Outlook | ❌ Apenas a interface; o OAuth é simulado |
| Notificações | ❌ Apenas a interface |
| Análise preditiva / benchmarking | ❌ Números fixos no código, sem modelo |
| Testes automatizados | ❌ Não implementados |

Muitos botões das telas são afordâncias visuais sem ação associada. Isso está mapeado e
faz parte do backlog.

---

## Antes de usar com dados reais

O sistema lida com dados de **crianças e adolescentes**, incluindo diagnósticos e
informações de saúde — dados pessoais sensíveis sob a
[LGPD (Lei 13.709/2018)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm).
Nenhum registro real deve ser inserido antes de, no mínimo:

1. Base legal documentada para cada operação de tratamento, com demonstração do melhor
   interesse da criança e do adolescente
2. Minimização dos campos sensíveis efetivamente coletados
3. Autenticação e autorização por perfil, com escopo por escola e por estudante
4. Criptografia em trânsito e em repouso
5. Registro de acesso (logs de auditoria)
6. Política de retenção e exclusão
7. Fluxo de atendimento aos direitos do titular (acesso, correção, eliminação, portabilidade)

Os dados de demonstração usam nomes fictícios, o domínio reservado `example.org` e números
de telefone não discáveis. **Não versione dados reais neste repositório.**

---

## Estrutura do projeto

```
sistema-gestao-pei/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/         # Componentes React
│   │   ├── ui/             # Primitivos shadcn/ui
│   │   ├── gestao/         # Abas do painel de gestão
│   │   └── reports/        # Gráficos e painéis de relatório
│   ├── config/
│   │   └── institution.ts  # Configuração da instituição (ponto único)
│   ├── data/               # Dados fictícios de demonstração
│   ├── hooks/
│   ├── lib/
│   ├── pages/              # Dashboard, Students, Observations, Gestao,
│   │                       # ResourceLibrary, Legislation, Manual,
│   │                       # AgendaAtendimentos, MinhaAgenda, NotFound
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── docs/                   # Documentação técnica
├── .env.example
├── LICENSE
└── package.json
```

---

## Contribuindo

Contribuições são bem-vindas, especialmente em acessibilidade, persistência de dados e
testes.

1. Fork
2. `git checkout -b feature/minha-contribuicao`
3. Garanta que `npm run lint`, `npm run typecheck` e `npm run build` passam
4. Commit (`Add:`, `Fix:`, `Update:`, `Docs:`, `Refactor:`, `Test:`)
5. Abra um Pull Request

Ver [docs/GUIA_DE_CONTRIBUICAO.md](docs/GUIA_DE_CONTRIBUICAO.md).

---

## Documentação técnica

- [Arquitetura do sistema](docs/ARQUITETURA_DO_SISTEMA.md)
- [Guia de componentes](docs/GUIA_DE_COMPONENTES.md)
- [Referência de integrações](docs/API_REFERENCE.md)
- [Guia de contribuição](docs/GUIA_DE_CONTRIBUICAO.md)
- [Nota de implementação: sincronização de calendário](docs/calendar-sync-implementation.md)

---

## Licença

MIT — ver [LICENSE](LICENSE).

---

Desenvolvido para a educação inclusiva no Brasil.
