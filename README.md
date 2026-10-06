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
> Os números que descrevem os registros — alunos ativos, observações e atendimentos por
> período, progresso do aluno, nota dos recursos — são **calculados** a partir do que está no
> navegador. O **painel de Gestão** é outra coisa: um cenário fictício com nome próprio, a
> *Escola Ilustrativa*, com 45 alunos, equipe e orçamento, separado dos alunos cadastrados. Os
> indicadores dele, as projeções, os comparativos e os valores orçamentários são **exemplos
> fixos no código**. Nenhum modelo estatístico ou de machine learning é executado, e nenhuma
> escola real foi medida.
>
> **Por que o Dashboard e a Agenda mostram zero "neste mês".** As observações e os
> atendimentos de exemplo têm datas fixas de novembro e dezembro de 2025, e as contagens por
> período são calculadas a partir dessas datas e do dia de hoje. Fora daqueles meses, as
> observações e os atendimentos "neste mês" e nos próximos 7 dias dão 0, e a variação diz "sem
> base de comparação". Não é defeito: as datas ficaram fixas de propósito, para os números
> serem reproduzíveis. O que for cadastrado na interface com data do período entra na contagem
> normalmente. O Dashboard e a Agenda repetem essa explicação num aviso na própria tela.
>
> O sistema **não está pronto para receber dados reais de estudantes**. Ver
> [Antes de usar com dados reais](#antes-de-usar-com-dados-reais).
>
> Não há servidor, não há conta e não há cadastro: o que você digitar fica no `localStorage` do
> seu navegador e some se você limpar os dados do site. A página também não busca nada de
> terceiros — nenhuma fonte, script ou folha de estilo externa. Isso é uma propriedade do
> protótipo, não uma garantia de conformidade.

---

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Começando](#começando)
- [Adaptando para sua instituição](#adaptando-para-sua-instituição)
- [O que está implementado](#o-que-está-implementado)
- [Acessibilidade](#acessibilidade)
- [Números](#números)
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
- **Gestão** — visão geral, alertas e riscos, análise de complexidade, relatórios, equipe e orçamento de uma escola fictícia, a *Escola Ilustrativa* (cenário fixo de demonstração, separado dos alunos cadastrados)
- **Biblioteca de recursos** — catálogo de materiais adaptados com busca, filtros, ordenação pela nota calculada das avaliações, favoritos e badges de contribuição deste navegador
- **Marco legal** — LDB 9.394/96, LBI 13.146/2015, Lei 12.764/2012, Decreto 7.611/2011
- **Manual de procedimentos** — fluxo de identificação, PEI, equipe, protocolos e avaliação

---

## Tecnologias

React 18 · TypeScript · Vite 6 · Tailwind CSS · shadcn/ui (Radix) · React Router ·
React Hook Form + Zod · Recharts · React Big Calendar · Lucide

---

## Começando

**Pré-requisitos:** Node.js 22.13+ ou 24+, e npm. As versões ímpares 21 e 23 não servem.
Medido pelos campos `engines` de todos os pacotes instalados: quem fixa o 22.13 são o
`jsdom` 29 e o `@testing-library/jest-dom` 7, da suíte de testes. O `package.json` declara
`"engines": { "node": "^22.13.0 || >=24.0.0" }`, a mesma faixa da medição, então o npm avisa na
instalação se a versão não servir — em vez de o erro aparecer no primeiro `npm test`.

```bash
git clone https://github.com/Fernandosr85/sistema-gestao-pei.git
cd sistema-gestao-pei
npm ci
npm run dev
```

`npm ci` instala exatamente o que está no `package-lock.json` e é o que o CI roda — `npm install`
pode atualizar o lockfile sem ninguém pedir.

A aplicação sobe em `http://localhost:8080`.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | ESLint, com as regras de acessibilidade do `jsx-a11y` como erro (deve terminar com 0 erros) |
| `npm run typecheck` | Checagem de tipos sem emitir arquivos |
| `npm test` | Suíte em Vitest + jsdom, uma passagem (é o que o CI roda) |
| `npm run test:watch` | A mesma suíte, reexecutando a cada alteração |

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

O painel de Gestão não mostra a instituição configurada, e sim um cenário fictício: o nome
e o tamanho dele ficam em `illustrativeScenario`, no mesmo arquivo. O cenário não nomeia
aluno nem família, e a equipe dele não repete nome de pessoa dos dados de demonstração.

A paleta de cores fica em `src/index.css`, nas variáveis `--brand-*`. Os valores padrão
foram escolhidos para atingir contraste **≥ 4,5:1 com texto branco (WCAG 2.1 AA)** — ao
trocá-los pelas cores da sua instituição, verifique o contraste novamente.

`DEMO_MODE` (no mesmo arquivo) controla os avisos de "dados fictícios" exibidos nas telas
analíticas **e** a gravação local. Ligado, os registros criados na interface ficam no
localStorage do navegador, com aviso permanente e o botão "Restaurar dados de
demonstração". Desligado, o store roda só em memória e não toca no localStorage. Ele só
deve ser desligado quando as telas passarem a consumir dados reais de um backend.

O formato gravado é versionado (`src/store/persistence.ts`) e está na **versão 4**. Dados das
versões 1, 2 e 3 são migrados na primeira leitura, um passo de cada vez e sem perda; dados de
versão desconhecida ou ilegíveis são descartados, com aviso na tela.

---

## O que está implementado

| Área | Situação |
|---|---|
| Navegação e layout | ✅ Funcional |
| Listagens, filtros e busca de alunos | ✅ Funcional (dados fictícios e cadastros locais) |
| Cadastro e edição de alunos; observações e avaliações pedagógicas; atendimentos com remarcação, cancelamento e ata; recursos, comentários e favoritos da biblioteca | ⚠️ Grava só no localStorage do navegador, em modo demonstração. Nada é excluído: o aluno muda de status e o atendimento é cancelado |
| Relatório do estudante e da turma | ⚠️ Montado com os registros do navegador; imprime ou salva como PDF pela janela de impressão do navegador |
| Indicadores do Dashboard, da Agenda, da ficha do aluno e da Biblioteca | ✅ Calculados dos registros do navegador, em `src/lib/metrics.ts`; sem registro no período anterior, a variação diz "sem base de comparação" |
| Painel de Gestão | ❌ Cenário ilustrativo nomeado (*Escola Ilustrativa*), fixo no código e separado dos registros, com aviso acima das abas e em cada uma |
| Desempenho do estudante | ⚠️ Lido dos registros desde a Etapa 9: série do que cada avaliação mediu, metas do PEI por área, níveis e resumo da última avaliação. Frequência e integração **não existem no modelo** e saíram da tela, em vez de aparecer como número fixo. Exportar, compartilhar e imprimir continuam desabilitados |
| Modo Apresentação do estudante | ⚠️ Montado do plano desde a Etapa 9: capa, progresso nas metas, um slide por meta, conquistas e próximos passos da última avaliação. O número de slides vem do plano. Sem PEI vigente não há apresentação, e o diálogo diz isso. Vídeo e PDF continuam não implementados |
| Detalhe da observação | ⚠️ Desde a Etapa 9 mostra só o que foi registrado, mais as metas do PEI cujas notas citam aquela observação. Saíram horário, local, plano de ação, evidências anexadas, notificações e metadados, que o modelo não tem |
| Edição e exclusão de observações | ❌ Não implementadas; os controles aparecem desabilitados, com o motivo |
| PEI (metas, revisões, histórico) | ⚠️ O PEI é entidade do modelo e o Ver PEI mostra o plano **do estudante aberto**: identificação, perfil, metas com observações e evidência, estratégias, recursos, revisões e histórico. Estudante sem plano vigente vê "Sem PEI vigente", e não 0%. Elaborar, editar e revisar pela interface não existem; esses controles ficam desabilitados, e o plano entra pelos dados de demonstração |
| Histórico acadêmico do estudante | ❌ Não implementado; o diálogo informa que não há histórico registrado |
| Anexos, fotos e documentos | ❌ Não são armazenados; a tela de anexos é um exemplo, com aviso e ações desabilitadas |
| Preferências de acessibilidade (Configurações → Acessibilidade) | ✅ Funcional: alto contraste, tamanho da fonte, reduzir animações, destacar o foco e alvos maiores, aplicados na hora e guardados neste navegador |
| Minha Agenda | ⚠️ Desde a Etapa 9 lista os atendimentos registrados, agrupados por quando acontecem — inclusive os que continuam agendados com data já passada, que não podem sumir da tela. Sem autenticação, não há como filtrar por profissional, e a tela diz isso. Agenda pessoal (aulas, formação, tarefas) não existe: é entidade nova, registrada no backlog |
| Perfil e as demais abas de Configurações | ❌ Ilustrativos: nada é salvo e os controles aparecem desabilitados |
| Autenticação, perfis e permissões | ❌ Não implementado |
| Backend e banco de dados | ❌ Não implementado |
| Exportação de arquivo (PDF gerado pela aplicação, Excel, Word) | ❌ Não implementada |
| Sincronização Google Calendar / Outlook | ❌ Não implementada; os controles aparecem desabilitados, com o motivo |
| Notificações | ❌ Não implementadas; os controles aparecem desabilitados |
| Análise preditiva / benchmarking | ❌ Números fixos no código, sem modelo |
| Testes automatizados | ✅ Suíte em Vitest + jsdom (`npm test`), cobrindo o que as Etapas 1 a 6 corrigiram, a guarda de navegação da Etapa 8 e o PEI da Etapa 9 — não o código todo. A tabela por arquivo está em [Testes automatizados](#testes-automatizados-etapa-7) |

Na Etapa 2 do [backlog](BACKLOG-CLAUDE-CODE.md), cada controle sem ação foi implementado,
desabilitado com o motivo na tela ou removido. Na Etapa 3, o sistema foi levado a zero
violação automatizada de WCAG 2.1 AA — os números estão em [Acessibilidade](#acessibilidade).
Na Etapa 4, todo número que descreve os registros passou a ser calculado, e o que não tinha
registro de origem virou cenário nomeado ou saiu — os números estão em [Números](#números).
Na Etapa 9, o PEI virou entidade do modelo e as cinco telas que mostravam exemplo sob o nome de
uma criança — Ver PEI, Desempenho, Modo Apresentação, Detalhe da observação e Minha Agenda —
passaram a ler os registros do estudante aberto. **O painel de Gestão continua sendo cenário
fixo**, com nome próprio e aviso, e o histórico acadêmico não tem modelo de dados e diz isso na
tela.

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
  tabela equivalente, aberta por um `<details>`. (Regra de contagem: instâncias de
  `ResponsiveContainer` em `src/` — 12 em 7 arquivos, conferido em 03/10/2026. Uma delas, a do
  Desempenho, só renderiza quando o estudante tem duas ou mais avaliações.)
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
- **Dois defeitos conhecidos e não corrigidos**, achados depois do merge da Etapa 3 e abertos na
  Pendência 2 do backlog: o selo "ATENÇÃO" de Gestão > Relatórios tem contraste **3,15:1** sobre
  `--alert-warning-icon` (1.4.3 pede 4,5:1), e o calendário da Agenda formata datas em inglês
  (3.1.1 e 3.1.2). Os dois só aparecem depois de clique, que é por onde a varredura não passa.
- **O que só existe depois de uma interação não é medido por método automatizado nenhum deste
  repositório** — nem o axe rota a rota, nem o arreio de superfície, nem o lint. Foi assim que
  dois botões de fechar sem nome acessível correto atravessaram oito etapas (achado 2).
- **Classes de cor fixa e 12 literais hexadecimais** continuam fora dos tokens, em cores que
  passam no contraste. O número de classes **depende da regra de contagem** — 147 pela estreita,
  164 pela larga —, e o "165" que esta seção trazia não sai de nenhuma das duas: é número sem
  método, recontado na Etapa 5 do backlog.

---

## Números

A Etapa 4 do [backlog](BACKLOG-CLAUDE-CODE.md) aplicou uma regra: número que descreve os
registros se calcula a partir deles, em `src/lib/metrics.ts`; número que não tem registro de
origem vira cenário com nome próprio, com aviso, ou sai. Medido no navegador antes e depois de
cada commit da etapa, com o relógio emulado quando o defeito dependia de data ou hora:

| Medida | Antes | Depois |
|---|---:|---:|
| **Dado de saúde fixo atribuído a estudante ou a pessoa nomeada** | **9** | **0** |
| — sob o nome de qualquer estudante: ficha, Desempenho, Nova Observação | 5 | 0 |
| — de pessoa nomeada, na Gestão: duas licenças, "Pedro, 9h - Ansiedade", "Pedro (crise)" | 4 | 0 |
| Afirmações falsas de funcionalidade na ficha | 2 | 0 |
| **Números digitados apresentados como medida** | | |
| — tendências sem base (Dashboard ↑12% e ↑8%; Agenda +12%) | 3 | 0 |
| — selos "+100%" sem semana anterior na Agenda (visão Dia em 25/11/2025) | 3 | 0 |
| — números sem entidade de origem ("12 relatórios pendentes", "21" anexos) | 2 | 0 |
| Cartões "este mês" que contavam registros de qualquer data | 2 | 0 |
| Leituras de data em UTC, que mudavam números à noite, aos domingos e na véspera de aniversário | 4 | 0 |
| "Próximos 7 dias", Dashboard × Agenda, às 21h30 de 24/11/2025 | 3 × 4 | 3 × 3 |
| Alunos com progresso exibido sem ter avaliação | 3 de 4 | 0 |
| Campos e selos inventados na ficha, iguais para qualquer estudante | 13 | 0 |
| Recursos com nota e contagem da fixture, e não das avaliações | 6 de 6 | 0 |
| Cards de recurso com número de download | 6 | 0 |
| Estatísticas sem origem no detalhe do recurso | 4 | 0 |
| Números fixos em Meus Recursos | 4 | 0 |
| Badges conquistadas com zero contribuições | 4 | 0 |
| Ranking de pessoas fictícias apresentado como classificação real | 1 | 0 |
| Pessoas dos dados de demonstração dentro do cenário de Gestão | 4 | 0 |
| Alunos e famílias nomeados no cenário de Gestão | 8 | 0¹ |
| Indicadores da Gestão com o mesmo nome e valor ou veredicto diferente | 2 | 0 |
| Telas com número sem aviso de dados fictícios | 4 | 0 |

¹ Só a partir de `0c2be34`, depois do merge da etapa: "João", sem sobrenome, ficou em dois
textos de Gestão > Relatórios, porque a varredura de nomes não casava letra acentuada (achado 7
do backlog).

Depois do merge, `0c2be34` também reescreveu o vocabulário de inferência sobre números fixos —
"prevê-se", probabilidades de cenário, "156 casos similares", "taxa de sucesso", "chance de
melhoria", "padrão identificado" — e acertou as contagens que contradiziam a lista ao lado, como
"17 alertas, 5 críticos" sobre uma lista de 5 e 2. As projeções continuam, ditas como projeções
digitadas.

O que isso significa na prática:

- **O que é do navegador é calculado.** Alunos ativos, observações e atendimentos por período,
  próximos atendimentos, progresso do aluno, último registro, nota e número de avaliações dos
  recursos e badges de contribuição saem dos registros, e mudam quando algo é cadastrado.
- **O progresso do aluno mudou de fonte na Etapa 9**, e o rótulo mudou junto: era a média dos
  objetivos da avaliação mais recente, é a média das metas do PEI vigente, e a tela diz
  "Progresso nas metas do PEI". Para a estudante 1 da demonstração, eram 60% e são 50% — os dois
  números estão certos e medem coisas diferentes; a medição datada continua na avaliação, que
  aponta para a meta. Sem plano vigente a tela diz "Sem PEI vigente", e não 0%.
- **Sem base, a tela diz "sem base".** Quando o período anterior não tem registro, não há
  porcentagem de variação para mostrar, e nenhuma é inventada.
- **O que não é do navegador tem nome.** O painel de Gestão descreve a *Escola Ilustrativa*,
  com um aviso acima das abas que mostra, ao lado dos 45 alunos do cenário, quantos alunos estão
  cadastrados de fato. O cenário não nomeia aluno nem família.
- **Datas locais.** Data de registro se compara como texto `AAAA-MM-DD`; nenhuma conta usa
  `new Date('AAAA-MM-DD')`, que é meia-noite em UTC e, no Brasil, 21h do dia anterior.

### Limpeza (Etapa 5)

A etapa seguinte removeu o que não era alcançável e resolveu duplicação. Como ela **remove**
código, a verificação principal é de regressão: uma fotografia de quatro medidas por tela —
árvore de acessibilidade, sequência de números, ordem de tabulação e esqueleto de títulos —,
em 23 superfícies, com a regra de que um commit que só remove produz **diferença zero**. O
arreio está em [`scripts/fotografia.js`](scripts/fotografia.js), com o protocolo ao lado.

| Medida | Antes | Depois |
|---|---:|---:|
| Arquivos em `src/` inalcançáveis a partir de `main.tsx` | 25 | 1¹ |
| Arquivos em `src/` | 155 | 127 |
| `dependencies` no `package.json` | 51 | 37 |
| `index.js` do bundle, em bytes | 1.000.212 | 971.582 |
| Coleções que guardavam cópia do nome do estudante | 3 | 0 |
| Identificadores sem uso | 32 | 5² |
| Violação de foco em contêiner rolável, em 320 px | 1 | 0 |

¹ `vite-env.d.ts`, declaração de tipo puxada pelo `tsconfig`, não por import.
² Corrigido na Etapa 6: o número registrado aqui era 2, e a sonda que o produziu não
filtrava o código `TS6192`. Três declarações de import sem uso escaparam. Ver o achado 7 no
backlog.

Do primeiro ao último commit da etapa, a fotografia deu **diferença zero nas 23 superfícies**.
Nos commits que só removiam código morto, os quatro arquivos do bundle saíram byte a byte
idênticos — o empacotador já não os embarcava.

**O nome do estudante deixou de ser copiado** nas observações, avaliações e atendimentos: era
guardado em três coleções e propagado a cada edição. Agora é resolvido pelo `id`.

Isso **não foi só deduplicação**. O filtro por aluno da Agenda comparava nome com nome, e um
registro cujo nome gravado estivesse desatualizado simplesmente **não aparecia** na busca por
aquele aluno — sem erro e sem aviso. Medido com as duas expressões sobre o mesmo estado: a
antiga esconde o atendimento, a nova o mantém. Era um defeito ativo, esperando alguém renomear
um estudante.

### TypeScript estrito e validação do armazenamento (Etapa 6)

`strict`, `strictNullChecks`, `noImplicitAny`, `noUnusedLocals` e `noUnusedParameters` ligados
nos três `tsconfig`. Medido antes: **41 erros**; depois: **0**.

| Medida | Antes | Depois |
|---|---:|---:|
| Erros com as cinco flags | 41 | 0 |
| Flags declaradas como `false` nos `tsconfig` | 11 | 0 |
| Coleções do store validadas por forma na carga | 0 de 7 | 7 de 7 |

**Nenhum dos 41 era bug de runtime**, e o bug de verdade não estava entre eles. A única tela em
branco medida nesta série vem de registro malformado no `localStorage` — e nenhuma flag a pega,
porque o tipo declara o campo e o validador antigo só olhava o `id`. O `strict` cobre tudo menos
o ponto por onde dado não tipado entra.

Por isso a etapa fecha esse ponto: `src/store/schemas.ts` valida a forma dos sete tipos de
registro na carga, **descarta o registro e não o estado**, remove em cascata o que ficou
apontando para um registro descartado, e **diz na tela quantos saíram e de onde**. Um registro
estragado não custa tudo o que foi digitado, e descarte silencioso seria perda de dado sem
aviso.

Medido com a semente e um campo removido: a ficha que antes abria em branco passa a carregar,
sem o registro ruim, com "Registros descartados na abertura: 1 estudante, 1 observação,
1 atendimento, 1 avaliação".

### Testes automatizados (Etapa 7)

Vitest + jsdom + Testing Library. `npm test` roda no CI entre o `typecheck` e o `build`. A
tabela é da Etapa 9, que levou a suíte de 73 para 131 testes.

| Arquivo | Testes | O que trava |
|---|---:|---|
| `src/store/persistence.test.ts` | 26 | envelope do localStorage, migrações v1→v4, descarte de registro inválido e cascata de órfãos por posse |
| `src/lib/metrics.test.ts` | 24 | os seletores de métrica das Etapas 4, 5 e 9, inclusive a troca de fonte do progresso |
| `src/lib/pei.test.ts` | 17 | plano vigente, média das metas, agrupamento por área, evidência da nota e seus elos fracos |
| `src/lib/date.test.ts` | 13 | data local, idade na véspera e no dia do aniversário, e o dia anterior que o fuso produzia |
| `src/store/reducer.test.ts` | 12 | as ações do store, inclusive a que não deve tocar nas coleções vinculadas |
| `src/test/rotas.test.ts` | 8 | todo destino de `Link`, `Navigate` e `navigate()` resolve para uma rota declarada, e nenhum destino não literal escapa da varredura |
| `src/lib/assessment.test.ts` | 7 | a medição datada da avaliação, separada do progresso corrente das metas |
| `src/test/apresentacao.test.tsx` | 4 | os slides vêm do plano, o número deles também, e sem plano não há apresentação |
| `src/test/fluxo.test.tsx` | 4 | cadastro de aluno e registro de observação até a listagem, na árvore React inteira |
| `src/test/arreio.test.ts` | 3 | o andaime: que a suíte discrimina, e que jsdom não calcula layout |
| `src/test/desempenho.test.tsx` | 3 | as duas medidas de progresso com nomes distintos, e o que saiu por não existir no modelo |
| `src/test/progresso.test.tsx` | 3 | o par número-rótulo na listagem e na ficha, com o valor da fonte antiga como falsificação |
| `src/test/verpei.test.tsx` | 3 | o plano do estudante aberto, e "Sem PEI vigente" para quem não tem |
| `src/test/minha-agenda.test.tsx` | 2 | os atendimentos do store, inclusive os agendados com data já passada |
| `src/test/observacao.test.tsx` | 2 | só o que foi registrado, e as metas que citam aquela observação |

**O risco, com o número absoluto: são 131 testes, cobrindo as correções das Etapas 1 a 6, a
guarda de navegação da Etapa 8 e as cinco telas da Etapa 9. O restante do código não tem
teste.** Não há porcentagem de cobertura aqui, de propósito:
cobertura mede linha executada, e linha executada não é defeito travado.

Três decisões que dizem o que a suíte significa:

- **Teste de defeito corrigido assevera o valor errado antigo.** `calculateAge` é comparado com
  a conta que produzia o defeito, `periodChange` com o `+100%` inventado. Assim "o teste passa"
  significa "o defeito não voltou", e não "o código rodou".
- **Nenhum teste foi aceito antes de reprovar.** O defeito que cada um diz pegar foi plantado no
  código de produção e a suíte teve de reprovar: **74 mutações, todas acusadas** — 27 da Etapa 7,
  3 da guarda de navegação da Etapa 8, 43 da Etapa 9 e 1 da varredura de coerência —,
  reexecutadas depois de trocar o runner para o `vitest` 4. Duas revelaram defeito no próprio
  teste, e quatro revelaram que os DADOS de teste não distinguiam o certo do errado: as duas
  coisas estão registradas no backlog (achados 11 e 17).
  **47 delas estão em [`scripts/mutacoes/`](scripts/mutacoes/) e qualquer pessoa reexecuta com
  `node scripts/mutacoes/executar.cjs`.** As 27 da Etapa 7 foram escritas em scripts que viviam
  no diretório temporário da sessão e não sobreviveram: o resultado delas está registrado, e
  **não é reproduzível a partir deste repositório**. Está dito assim no README dos scripts, e
  **não serão reescritas**: mutação escrita a partir do teste de hoje casa com o teste de hoje,
  não com o defeito de 18/09 (Pendências abertas, item 4, com a premissa medida). O número
  honesto é **47 reproduzíveis e 27 atestadas**, não 74 reproduzíveis.
- **O fuso é fixado no config** (`TZ=America/Sao_Paulo`), porque o CI roda em UTC, onde os
  defeitos de data não existem — a suíte de datas passava lá sem exercitar um caso sequer.

Regressão de tela **não** está na suíte: jsdom não calcula layout, e isso foi medido (na aba
Orçamento, 28 dos 79 elementos semânticos e 13 dos 96 números só ficam de fora da contagem
porque o navegador calcula layout). Continua no arreio de
[`scripts/fotografia.js`](scripts/fotografia.js), conduzido à mão, por decisão registrada no
backlog e não por esquecimento.

### Dependências (Etapa 8)

`npm audit` de **6 entradas para 0**, uma major por commit, na ordem router → vite → vitest: a
suíte que prova o router não podia estar sob a mudança que se queria verificar.

| Medida | Antes | Depois |
|---|---:|---:|
| Entradas no `npm audit` | 6 (1 alta) | 0 |
| Advisory que chega ao bundle de produção | 1 | 0 |
| `react-router-dom` / `vite` / `vitest` | 6.30.6 / 5.4.21 / 3.2.7 | 7.18.4 / 6.4.3 / 4.1.11 |
| Destinos de navegação fora do alcance da varredura de rotas | 6 | 0 |
| Mutações acusadas | 27 de 27 | 30 de 30 |
| Bundle JS, bytes | 1.800.472 | 1.833.161 |

- **Cada degrau com diferença zero na fotografia de superfície** — no servidor de
  desenvolvimento e, nos commits do vite e do vitest, também no `dist/` servido por
  `npm run preview`, porque major de bundler quebra empacotamento e "compila" não é "roda".
- **O `vite` parou no 6.4.3**, o mínimo que zera as advisories, e não no 8 que o `npm audit`
  sugere: o `fixAvailable` aponta a última versão, não a mínima. O 7 e o 8 ficam como segunda
  escada, com o acoplamento medido no backlog.
- **O advisory de open redirect do router virou teste.** Todo destino de navegação que não é
  literal tem de estar numa lista, pelo nome; um novo reprova até alguém conferir de onde ele vem.
- **O `+32.689` bytes é custo declarado**: +18.208 do router 7, +14.481 do vite 6. A causa dos
  +12.029 no chunk de gráficos não foi medida, e está registrada assim.
- **O runner foi trocado com linha de base**: os controles de zero testes e de fuso medidos no
  `vitest` 3.2.7 antes da troca, e comparados depois.

### O PEI como entidade (Etapa 9)

O sistema se chama Gestão PEI e não tinha entidade PEI: metas, revisões e histórico eram
conteúdo fixo, igual para qualquer estudante. A etapa modelou o plano, migrou o dado gravado
para a versão 4 e reescreveu as cinco telas que mostravam exemplo sob o nome de uma criança.

| Medida | Antes | Depois |
|---|---:|---:|
| Telas exibindo conteúdo fixo sob o nome do estudante | 5 | 0 |
| Nomes de estudantes escritos no código dessas telas | 20 | 0 |
| Porcentagens literais no código dessas telas | 21 | 1 |
| Seções "em desenvolvimento" nessas telas | 6 | 0 |
| Coleções do store / versão do envelope | 7 / v3 | 11 / v4 |
| Testes | 73 | 131 |
| Mutações acusadas | 30 de 30 | 73 de 73 |

As regras de contagem estão no backlog, com a medição: "nomes" e "porcentagens" são ocorrências
**fora de comentário** (os comentários citam de propósito os valores antigos), e a única
porcentagem que resta é o `width="100%"` do contêiner de um gráfico.

- **A estrutura do PEI vem do manual deste repositório, não da lei.** O marco legal obriga AEE,
  adaptações e profissional de apoio, e **não prescreve campo nenhum** de PEI. Virou invariante
  no `CLAUDE.md`: campo que vem do manual cita o manual, campo que vem da lei cita o artigo, e
  nenhum campo alega mandato legal que não existe.
- **O que o modelo não tem saiu da tela.** Presença, integração, anexos com arquivo e
  notificações não viraram número fixo com aviso em volta: a tela não mostra o que não tem, e
  diz o que falta.
- **Dois progressos, dois nomes.** "Progresso nas metas do PEI" é o estado corrente das metas;
  o que cada avaliação mediu continua na avaliação, com data. A ficha trocou de fonte — 60% pela
  avaliação, 50% pelas metas — e o rótulo trocou junto.
- **Sem PEI vigente, a tela diz isso** — não 0%, que seria uma medida que ninguém fez.

### Limites conhecidos

- **Diálogos de exemplo sob o nome do estudante — resolvido na Etapa 9.** Ver PEI, Desempenho,
  Modo Apresentação e Detalhe da observação mostravam conteúdo fixo, igual para qualquer
  estudante: o Desempenho de uma aluna dizia 85% enquanto a ficha dela, calculada, dizia 60%. Os
  quatro passaram a ler os registros do estudante aberto, ou a dizer que não há registro. O que
  não existe no modelo — frequência, integração, anexos, notificações — **saiu da tela** em vez
  de virar número fixo com aviso em volta.
- **O cenário de Gestão é inventado**, com nome e aviso. A coerência interna dele só foi
  tratada onde havia contradição à vista.
- **Cores de gráfico fora dos tokens.** Sobram 12 literais hexadecimais, em eixos e séries de
  gráfico. Passam no contraste. O número de classes de cor fixa depende da regra de contagem
  — 147 pela estreita, 164 pela larga —, e está registrado com a regra no backlog.
- **16 arquivos acima de 400 linhas** (regra: `wc -l` acima de 400 em `src/`, arquivo de teste
  incluído; recontado em 03/10/2026). A convenção pede quebrá-los em commits de refatoração
  dedicados; fazer isso na etapa de limpeza destruiria a prova de regressão. Inventariados no
  backlog, com o número de linhas de cada um e com o que mudou desde a Etapa 5.
- **Os esquemas de validação e os tipos são duas declarações do mesmo formato**, mantidas em
  acordo pelo compilador — hoje são onze pares, não sete. Uma fonte só, com o tipo derivado do
  esquema por `z.infer`, é o desenho certo; estava previsto para a etapa do PEI, ficou de fora
  dela e é etapa própria, registrada no backlog.
- **A suíte cobre o que foi corrigido, não o código todo.** Tela, diálogo e gráfico só têm a
  cobertura indireta do teste de fluxo; o resto da renderização depende do arreio, que é
  conduzido à mão. Varredura de acessibilidade automatizada no CI exigiria navegador headless e
  está avaliada, com o custo e o argumento, no backlog.

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
│   ├── test/               # Andaime da suíte, remendos de jsdom, rotas e fluxo
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── docs/                   # Documentação técnica
├── scripts/                # Arreio de fotografia de superfície (prova de regressão)
├── .env.example
├── LICENSE
└── package.json
```

---

## Contribuindo

Este projeto tem um único mantenedor e não há processo de revisão de pull requests.

O código é MIT: você pode copiar, bifurcar e adaptar para a sua escola sem pedir autorização. Se
encontrar um erro, abra uma issue — sem garantia de resposta.

Para rodar e verificar o projeto localmente, veja
[docs/DESENVOLVIMENTO.md](docs/DESENVOLVIMENTO.md).

---

## Documentação técnica

- [Arquitetura do sistema](docs/ARQUITETURA_DO_SISTEMA.md)
- [Guia de componentes](docs/GUIA_DE_COMPONENTES.md)
- [Referência de integrações](docs/API_REFERENCE.md)
- [Desenvolvimento: rodar e verificar localmente](docs/DESENVOLVIMENTO.md)

---

## Licença

MIT — ver [LICENSE](LICENSE).

---

Desenvolvido para a educação inclusiva no Brasil.
