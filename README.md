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
> Este repositório contém **apenas o frontend**, operando sobre dados fictícios
> (`src/data/`). Não há backend, banco de dados, autenticação nem controle de acesso. Em
> modo demonstração, o que é cadastrado ou editado na interface (alunos, observações,
> atendimentos, avaliações, recursos, comentários e favoritos) fica **só no localStorage
> do navegador em uso**, sem criptografia. Os controles sem função mapeados no backlog
> aparecem desabilitados, com o motivo na tela, ou foram removidos.
>
> Os indicadores, projeções, comparativos e valores orçamentários exibidos são **exemplos
> ilustrativos fixos no código**. Nenhum modelo estatístico ou de machine learning é
> executado, e nenhuma escola real foi medida.
>
> **Por que o Dashboard e a Agenda mostram zero "neste mês".** Os registros de exemplo
> têm datas fixas de novembro e dezembro de 2025, e as contagens por período são calculadas
> a partir dessas datas e do dia de hoje. Fora daqueles meses, "Observações registradas neste
> mês" e "Atendimentos neste mês" dão 0, e a variação diz "sem base de comparação". Não é
> defeito: as datas ficaram fixas de propósito, para os números serem reproduzíveis. O que
> for cadastrado na interface com data do mês corrente entra na contagem normalmente.
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
- [Acessibilidade](#acessibilidade)
- [Antes de usar com dados reais](#antes-de-usar-com-dados-reais)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Contribuindo](#contribuindo)
- [Documentação técnica](#documentação-técnica)
- [Licença](#licença)

---

## Funcionalidades

Telas navegáveis do protótipo:

- **Dashboard** — visão inicial com atalhos, listagens e relatório imprimível do estudante ou da turma
- **Alunos** — listagem, filtros por diagnóstico, cadastro, edição, ficha detalhada, modo apresentação
- **Observações** — registro estruturado por áreas (comunicação, social, comportamento)
- **Agenda de atendimentos** — calendário em visões mês/semana/dia/lista, com remarcação, cancelamento e ata
- **Gestão** — visão geral, alertas e riscos, análise de complexidade, relatórios, equipe, orçamento (conteúdo fixo de demonstração)
- **Biblioteca de recursos** — catálogo de materiais adaptados com busca, filtros, ordenação e favoritos deste navegador
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
| `npm run lint` | ESLint, com as regras de acessibilidade do `jsx-a11y` como erro (deve terminar com 0 erros) |
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
analíticas **e** a gravação local. Ligado, os registros criados na interface ficam no
localStorage do navegador, com aviso permanente e o botão "Restaurar dados de
demonstração". Desligado, o store roda só em memória e não toca no localStorage. Ele só
deve ser desligado quando as telas passarem a consumir dados reais de um backend.

O formato gravado é versionado (`src/store/persistence.ts`) e está na versão 3. Dados das
versões 1 e 2 são migrados na primeira leitura, um passo de cada vez e sem perda; dados de
versão desconhecida ou ilegíveis são descartados, com aviso na tela.

---

## O que está implementado

| Área | Situação |
|---|---|
| Navegação e layout | ✅ Funcional |
| Listagens, filtros e busca de alunos | ✅ Funcional (dados fictícios e cadastros locais) |
| Cadastro e edição de alunos; observações e avaliações pedagógicas; atendimentos com remarcação, cancelamento e ata; recursos, comentários e favoritos da biblioteca | ⚠️ Grava só no localStorage do navegador, em modo demonstração. Nada é excluído: o aluno muda de status e o atendimento é cancelado |
| Relatório do estudante e da turma | ⚠️ Montado com os registros do navegador; imprime ou salva como PDF pela janela de impressão do navegador |
| Edição e exclusão de observações | ❌ Não implementadas; os controles aparecem desabilitados, com o motivo |
| PEI (metas, revisões, histórico) | ❌ Não há entidade PEI: o Ver PEI é um exemplo fixo, com aviso e ações desabilitadas |
| Histórico acadêmico do estudante | ❌ Não implementado; o diálogo informa que não há histórico registrado |
| Anexos, fotos e documentos | ❌ Não são armazenados; a tela de anexos é um exemplo, com aviso e ações desabilitadas |
| Preferências de acessibilidade (Configurações → Acessibilidade) | ✅ Funcional: alto contraste, tamanho da fonte, reduzir animações, destacar o foco e alvos maiores, aplicados na hora e guardados neste navegador |
| Perfil, Minha Agenda e as demais abas de Configurações | ❌ Ilustrativos: nada é salvo e os controles aparecem desabilitados |
| Autenticação, perfis e permissões | ❌ Não implementado |
| Backend e banco de dados | ❌ Não implementado |
| Exportação de arquivo (PDF gerado pela aplicação, Excel, Word) | ❌ Não implementada |
| Sincronização Google Calendar / Outlook | ❌ Não implementada; os controles aparecem desabilitados, com o motivo |
| Notificações | ❌ Não implementadas; os controles aparecem desabilitados |
| Análise preditiva / benchmarking | ❌ Números fixos no código, sem modelo |
| Testes automatizados | ❌ Não implementados |

Na Etapa 2 do [backlog](BACKLOG-CLAUDE-CODE.md), cada controle sem ação foi implementado,
desabilitado com o motivo na tela ou removido. Na Etapa 3, o sistema foi levado a zero
violação automatizada de WCAG 2.1 AA — os números estão em [Acessibilidade](#acessibilidade).
Gestão, desempenho, apresentação e PEI continuam mostrando conteúdo fixo de demonstração, e
nem toda tela desse tipo tem aviso ainda (ver Etapa 4 do backlog). O histórico acadêmico não
tem modelo de dados e diz isso na tela.

---

## Acessibilidade

A meta é **WCAG 2.1 nível AA**. A Etapa 3 do [backlog](BACKLOG-CLAUDE-CODE.md) foi dedicada
a isso, e estes são os números, medidos nas dezessete rotas do sistema antes do primeiro
commit da etapa e depois do último:

| Medida | Antes | Depois |
|---|---:|---:|
| **Violações do axe-core (WCAG 2.1 A e AA)** | **124** | **0** |
| — contraste de cor (1.4.3) | 47 | 0 |
| — barra de progresso sem nome (4.1.2) | 62 | 0 |
| — botão sem nome (4.1.2) | 14 | 0 |
| — link sem nome (2.4.4) | 1 | 0 |
| **Avisos do `eslint-plugin-jsx-a11y`** | **8** | **0** |
| Controles operáveis só por mouse | 5 | 0 |
| Gráficos sem nome nem equivalente textual | 12 | 0 |
| Diálogos sem descrição | 10 | 0 |
| Rotas com salto de nível de título | 12 de 17 | 0 |
| Rotas com rolagem horizontal em 320 px | 6 de 17 | 0 |
| Lugares com status carregado só por emoji | 6 | 0 |
| Linhas com emoji em título, aba ou rótulo | 98 | 0 |

O que isso significa na prática:

- **Teclado.** Nenhum controle depende do mouse. A matriz de riscos, os cartões de área do
  gráfico de progresso e as estrelas de avaliação eram acionáveis só por clique.
- **Leitor de tela.** Todo controle tem nome; os diálogos anunciam título e descrição; a
  troca de slide na apresentação move o foco e é anunciada; os doze gráficos têm nome e
  tabela equivalente, aberta por um `<details>`.
- **Sem depender de cor, posição ou hover.** O status que era só emoji virou palavra, e o
  calendário de observações virou tabela com a contagem escrita em cada célula.
- **Contraste.** Todas as cores saem de tokens no bloco `--brand-*` do `src/index.css`, com
  a razão medida no navegador anotada ao lado.
- **Refluxo e zoom.** Nenhuma rota exige rolagem horizontal em 320 px, nem com zoom de
  200%, nem com as duas coisas somadas à preferência de fonte "muito grande" — a condição
  real de quem tem baixa visão, que a norma não exige testar e em que dez rotas falhavam.

### Preferências de acessibilidade

Em **Configurações → Acessibilidade** há cinco preferências que funcionam de verdade: alto
contraste, tamanho da fonte, reduzir animações, destacar o foco do teclado e aumentar o
tamanho dos botões. Elas são aplicadas na hora, ficam guardadas **neste navegador**, na
chave `pei-a11y-preferences`, e não dependem de conta nem saem daqui. Reduzir animações
também respeita a preferência do sistema operacional.

Leitor de tela, navegação por voz, descrição de imagens em áudio e ampliação da página não
ficam ali: são recursos do sistema operacional, da tecnologia assistiva ou do próprio
navegador. A tela diz isso, em vez de oferecer um controle que não faria nada.

### Limites conhecidos

- **Uma violação de contraste por rota é falso positivo.** O axe não lê gradiente e acusa o
  nome do usuário no cabeçalho em 1,04:1; o gradiente real vai de 10,65:1 a 5,96:1 contra
  branco.
- **Os números acima são só de verificação automatizada.** Dos cinco controles que só
  funcionavam no mouse, o lint encontrou um e o axe nenhum — o achado 2 do backlog registra
  a medida disso. A navegação completa por teclado e a leitura com leitor de tela real **ainda
  não foram testadas**: os nove testes estão em "Pendências abertas" no backlog.
- **165 classes de cor fixa e 12 literais hexadecimais** continuam fora dos tokens, em cores
  que passam no contraste. Estão registradas na Etapa 5 do backlog.

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

O armazenamento local do modo demonstração **não atende a nenhum desses requisitos**: os
registros ficam em texto puro no localStorage, legíveis por qualquer pessoa com acesso ao
navegador, e somem quando os dados do site são limpos.

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
│   │                       # AgendaAtendimentos, MinhaAgenda, PrintableReport, NotFound
│   ├── store/              # Store de demonstração (reducer + localStorage em DEMO_MODE)
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
