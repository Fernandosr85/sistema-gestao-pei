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
| Indicadores do Dashboard, da Agenda, da ficha do aluno e da Biblioteca | ✅ Calculados dos registros do navegador, em `src/lib/metrics.ts`; sem registro no período anterior, a variação diz "sem base de comparação" |
| Painel de Gestão | ❌ Cenário ilustrativo nomeado (*Escola Ilustrativa*), fixo no código e separado dos registros, com aviso acima das abas e em cada uma |
| Desempenho e Modo Apresentação do estudante | ❌ Exemplos fixos, iguais para qualquer estudante, com aviso; o progresso calculado está na ficha |
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
Na Etapa 4, todo número que descreve os registros passou a ser calculado, e o que não tinha
registro de origem virou cenário nomeado ou saiu — os números estão em [Números](#números).
Gestão, desempenho, apresentação e PEI continuam com conteúdo fixo de demonstração, agora com
aviso em todas essas telas. O histórico acadêmico não tem modelo de dados e diz isso na tela.

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

Vitest + jsdom + Testing Library. `npm test` roda no CI entre o `typecheck` e o `build`.

| Arquivo | Testes | O que trava |
|---|---:|---|
| `src/store/persistence.test.ts` | 14 | envelope do localStorage, migrações v1→v3, descarte de registro inválido e cascata de órfãos |
| `src/lib/metrics.test.ts` | 19 | os seletores de métrica corrigidos nas Etapas 4 e 5 |
| `src/lib/date.test.ts` | 13 | data local, idade na véspera e no dia do aniversário, e o dia anterior que o fuso produzia |
| `src/store/reducer.test.ts` | 12 | as ações do store, inclusive a que não deve tocar nas coleções vinculadas |
| `src/test/rotas.test.ts` | 5 | todo destino de `Link`/`navigate()` resolve para uma rota declarada |
| `src/test/fluxo.test.tsx` | 4 | cadastro de aluno e registro de observação até a listagem, na árvore React inteira |
| `src/test/arreio.test.ts` | 3 | o andaime: que a suíte discrimina, e que jsdom não calcula layout |

**O risco, com o número absoluto: são 70 testes, cobrindo as correções das Etapas 1 a 6. O
restante do código não tem teste.** Não há porcentagem de cobertura aqui, de propósito:
cobertura mede linha executada, e linha executada não é defeito travado.

Três decisões que dizem o que a suíte significa:

- **Teste de defeito corrigido assevera o valor errado antigo.** `calculateAge` é comparado com
  a conta que produzia o defeito, `periodChange` com o `+100%` inventado. Assim "o teste passa"
  significa "o defeito não voltou", e não "o código rodou".
- **Nenhum teste foi aceito antes de reprovar.** O defeito que cada um diz pegar foi plantado no
  código de produção e a suíte teve de reprovar: **27 mutações, todas acusadas na verificação
  final.** Uma delas revelou defeito no próprio teste, e está registrada no backlog.
- **O fuso é fixado no config** (`TZ=America/Sao_Paulo`), porque o CI roda em UTC, onde os
  defeitos de data não existem — a suíte de datas passava lá sem exercitar um caso sequer.

Regressão de tela **não** está na suíte: jsdom não calcula layout, e isso foi medido (na aba
Orçamento, 28 dos 79 elementos semânticos e 13 dos 96 números só ficam de fora da contagem
porque o navegador calcula layout). Continua no arreio de
[`scripts/fotografia.js`](scripts/fotografia.js), conduzido à mão, por decisão registrada no
backlog e não por esquecimento.

### Limites conhecidos

- **Diálogos de exemplo sob o nome do estudante.**Desempenho, Modo Apresentação, Ver PEI e
  Detalhe da observação ainda mostram conteúdo fixo, igual para qualquer estudante. O
  Desempenho de uma aluna pode dizer 85% enquanto a ficha dela, calculada, diz 60%. Trocar por
  dado real depende da entidade PEI. Os quatro dizem na tela que o conteúdo não é do estudante
  aberto; o Ver PEI passou a dizer em `bd93507`, e deixou de mostrar o nome do aluno com "Ativo"
  no cabeçalho.
- **O cenário de Gestão é inventado**, com nome e aviso. A coerência interna dele só foi
  tratada onde havia contradição à vista.
- **Cores de gráfico fora dos tokens.** Sobram 12 literais hexadecimais, em eixos e séries de
  gráfico. Passam no contraste. O número de classes de cor fixa depende da regra de contagem
  — 147 pela estreita, 164 pela larga —, e está registrado com a regra no backlog.
- **17 arquivos acima de 400 linhas.** A convenção pede quebrá-los em commits de refatoração
  dedicados; fazer isso na etapa de limpeza destruiria a prova de regressão. Inventariados no
  backlog, com o número de linhas de cada um.
- **Os esquemas de validação e os tipos são duas declarações do mesmo formato**, mantidas em
  acordo pelo compilador. Uma fonte só, com o tipo derivado do esquema, é o desenho certo e
  está registrado para quando a entidade PEI for modelada.
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

Contribuições são bem-vindas, especialmente em acessibilidade, persistência de dados e
testes.

1. Fork
2. `git checkout -b feature/minha-contribuicao`
3. Garanta que `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` passam
   — e, se a alteração corrige um defeito, que existe um teste que **reprova** sem a correção
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
