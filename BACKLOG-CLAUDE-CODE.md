# Backlog de correções — uma etapa por sessão

Cada etapa é uma sessão separada do Claude Code, com commit e verificação própria.
Não começar a seguinte antes de `npm run lint`, `npm run typecheck` e `npm run build`
passarem na anterior.

Origem: auditoria estática do commit `4c22d53` (Claude) + auditoria complementar (Codex).

---

## Achados

Defeitos cuja gravidade vai além do controle em que apareceram. É material para o artigo:
cada item registra o que acontecia, como foi confirmado e o que ainda está aberto.

### 1. Vazamento de dados de saúde entre estudantes (Etapa 2)

**Qualificação:** o defeito não era um formulário mal inicializado, e sim a exibição dos
dados de saúde de uma estudante na ficha de outros. Os dados eram fictícios. Com dados
reais, seria incidente de segurança com dado pessoal sensível (LGPD, art. 5º, II) de
crianças e adolescentes (art. 14), a ser comunicado à ANPD e aos titulares (art. 48).

**Onde:** o mesmo padrão apareceu em sete telas: texto fixo de uma estudante fictícia, Ana
Carolina Souza, exibido sob o nome de qualquer estudante. Cinco dessas telas mostravam dado
de saúde.

| Tela | O que aparecia para qualquer estudante | Dado de saúde | Aviso de exemplo |
|---|---|---|---|
| `EditarCadastroDialog` | nome, nascimento, matrícula, médico responsável ("Dra. Ana Paulita") e CID-10 F84.0 nos campos | sim | não |
| `StudentDetail`, card "Perfil de Saúde" | "Medicina: Ana Paulita", "Restrições/Alergias: Nenhuma" e "Último Laudo: 01/02/2024" | sim | não |
| `StudentHistoryDialog` | "Laudo médico atualizado (TEA Nível 1)" e "Médica: Dra. Ana Paulita", além de matrícula, turma e um evento dela | sim | não |
| `VerPEIDialog` | diagnóstico "TEA Nível 1 (F84.0)" na identificação do PEI | sim | sim |
| `AnexosDialog` | os laudos "Laudo_TEA_Atualizado.pdf", da Dra. Ana Paulita, e "Laudo_Neurologico_2023.pdf" | sim | sim |
| `ObservationDetailDialog` | matrícula, turma e nome da mãe dela em qualquer observação | não | não |
| `PresentationModeDialog` | turma e uma conquista citando "Ana" | não | não |

O inventário da Etapa 2 só tinha o `EditarCadastroDialog`. O card da ficha apareceu durante a
correção desse diálogo. As outras cinco telas apareceram numa busca pelo mesmo texto fixo:
nome da médica, matrícula, CID, turma e nome da estudante.

**Como foi confirmado:** no navegador, antes da correção, abri o Editar Cadastro em
`/alunos/1` (Maria Silva Santos) e em `/alunos/2` (Pedro Oliveira Costa). Nos dois casos, ele
trouxe matrícula, médico e CID de Ana Carolina. Depois da correção, cada diálogo abre com os
dados do próprio estudante, sem nenhum campo de saúde fora do modelo. As outras cinco telas
foram conferidas no navegador depois do segundo commit de correção.

**Correção, em dois commits:**
- **`2fb404d`:**
  - o Editar Cadastro passou a ser controlado a partir do estudante da ficha, com chave nova
    a cada abertura;
  - medicação, alergias, médico e CID saíram do formulário e da ficha, por minimização. O
    modelo `Student` nunca teve esses campos; eles eram texto fixo na interface.
- **`Fix:` que fecha a Etapa 2:**
  - **Histórico:** todo o conteúdo fixo saiu. Como não existe modelo de histórico acadêmico,
    o diálogo diz "Sem histórico registrado para este estudante".
  - **Ver PEI:** saiu o diagnóstico com CID.
  - **Anexos:** saíram os dois laudos, e a aba informa que nenhum laudo foi anexado.
  - **Detalhe da observação:** turma e matrícula passam a vir do estudante da observação.
    Saíram o nome da mãe e o nome "Maria" do texto fixo, e o diálogo ganhou aviso de
    conteúdo de exemplo.
  - **Apresentação:** saíram a turma e o nome na conquista, e o diálogo ganhou aviso de
    conteúdo de exemplo.

**Regra adotada:** o aviso de dados fictícios justifica número inventado, mas não justifica
exibir prontuário de terceiro. Dado de saúde fixo sai mesmo de tela que tem aviso.

A remontagem a cada abertura importa. No teste, com o painel do navegador oculto, a
animação de saída não terminou e o conteúdo fechado continuou montado. O diálogo reabriu
com o estado anterior. Um formulário que depende da desmontagem para limpar o estado pode
exibir dados de uma abertura na seguinte.

**Ainda aberto:** Ver PEI, Detalhe da observação e Apresentação continuam com conteúdo fixo de
exemplo, agora com aviso e sem dado de saúde nem identificação de outra estudante. A troca
por dados reais está na Etapa 4 e, no caso do PEI, na Etapa 9.

---

### 2. O que a verificação automatizada de acessibilidade não vê (Etapa 3)

**Qualificação:** as duas ferramentas padrão do mercado, juntas, encontraram **um** dos cinco
controles inalcançáveis por teclado corrigidos no commit 2 da Etapa 3. Um projeto que
tratasse "lint limpo + axe limpo" como critério de aceite teria declarado a tela acessível
com quatro controles que o teclado não alcança. O achado não é sobre as ferramentas serem
ruins — elas acham o que outro método não acha —, é sobre o que cada método enxerga.

**Os cinco controles e o que cada ferramenta pegou:**

| Controle | Como estava | `jsx-a11y` | `axe-core` | Por quê |
|---|---|---|---|---|
| Matriz de riscos, 9 células (`gestao/AlertasRiscosContent`) | `<Badge onClick>` | não | não | `Badge` é componente, não elemento; o lint só casa nome de elemento |
| Cartões de área (`reports/ProgressChart`) | `<div onClick>` | **sim** | não | único caso escrito como elemento do DOM literal |
| Estrelas de avaliação (`ResourceDetailModal`) | `<button>` só com SVG | não | não | é `<button>` de verdade; o defeito era nome e estado ausentes, dentro de um diálogo fechado |
| Cartão da agenda (`pages/AgendaAtendimentos`) | `<Card onClick>` | não | não | `Card` é componente |
| Legenda do donut (`reports/InterventionDonut`) | `<div>` com `cursor-pointer` | não | não | afordância só visual, sem handler de clique: não há o que detectar |

- **`eslint-plugin-jsx-a11y` (estático):** 1 de 5. Não atravessa abstração de componente. É o
  mesmo ponto cego da varredura de `<Button>` da Etapa 2, que também só via o componente com
  esse nome exato.
- **`axe-core` (em execução):** 0 de 5. Ele julga a árvore de acessibilidade do que existe na
  página. Um `<div>` com handler de clique é, para ele, um `<div>`: não há regra que diga
  "isto deveria ser um controle". E só vê o que está montado — dos cinco, dois estavam dentro
  de diálogo fechado ou de aba não selecionada.
- **Leitura do código:** 5 de 5. Os cinco saíram de uma busca por handler de clique em
  elemento não interativo, cruzada com a lista de arquivos que alguma rota monta.

**Erro na direção contrária.** Na primeira varredura, o axe acusou contraste de 1,04:1 em
"Usuário de demonstração", no cabeçalho, com branco sobre `#f8fafc`. O cabeçalho é um
gradiente, que o axe não sabe ler: ele desistiu do elemento e usou o fundo da página. O
gradiente vai de 10,65:1 a 5,96:1 contra branco, os dois acima de 4,5:1. Aceitar o veredito
teria produzido uma correção desnecessária numa cor que já passava.

**A configuração também precisa ser auditada.** A primeira execução do `jsx-a11y` marcou 100
avisos. Desses, **85 eram falsos**, todos da regra `label-has-for`, que o preset `recommended`
desliga de propósito: ela está obsoleta desde a versão 6.1, foi substituída por
`label-has-associated-control` e exige aninhamento **e** `htmlFor` ao mesmo tempo, então
acusava rótulos corretos. O erro era meu: a função que rebaixava a severidade das regras para
aviso reescrevia também as regras desligadas. Depois de preservar o `off`, sobraram 8 avisos
reais.

Isso importa para a medida da etapa. O número que vale, 8 no início e 6 depois do commit 2,
só significa alguma coisa porque a configuração foi depurada antes de virar linha de base.
Uma contagem tirada da primeira execução teria registrado uma queda de 100 para 91 sem
nenhuma relação com acessibilidade.

**Conclusão para o artigo:** as três formas de verificação usadas aqui são complementares e
nenhuma substitui a outra. O estático acha o que está escrito de forma reconhecível; o
dinâmico acha o que a árvore de acessibilidade mostra, e só do que está montado; a leitura do
código acha intenção. E falta a quarta, que nenhuma das três cobre: ativação por teclado e
leitor de tela reais, que ficam em lista de teste manual porque a ferramenta de navegador da
sessão não ativa `<button>` por Enter ou Space.

---

### 3. Correção de acessibilidade revelando defeito funcional (Etapa 3)

**Qualificação:** não são dois incidentes soltos, é um padrão. Implementar o equivalente
acessível obriga a exercitar o caminho que o mouse encobria — e é aí que o defeito aparece.
Aconteceu duas vezes na mesma etapa, em telas e por motivos diferentes.

**Caso 1: o calendário mostrava as contagens sob o dia da semana errado.**
`ObservationHeatmap` desenhava um cabeçalho fixo de Dom a Sáb e, abaixo, uma grade de sete
colunas que começava o mês sempre na primeira coluna. A série é de novembro de 2024, e **1º
de novembro de 2024 foi uma sexta-feira**: o mês inteiro aparecia deslocado em cinco colunas.
Quem lesse "3 observações" numa coluna pensaria estar lendo uma quarta-feira.

- **Por que passou:** a contagem só existia no tooltip de hover. Não havia número escrito na
  tela para conferir contra o cabeçalho, e um deslocamento de coluna não tem sintoma visível
  quando não há nada a comparar.
- **Como apareceu:** o item 2 mandava trocar a grade de `<div>` por tabela. Escrever a
  contagem em cada célula, e dar ao dia da semana o papel de cabeçalho de coluna, obrigou a
  alinhar o dia 1 com o dia da semana real. O desalinhamento apareceu na primeira renderização.

**Caso 2: as setas do modo apresentação nunca funcionaram.** `PresentationModeDialog` tem
doze slides e botões "Anterior" e "Próximo". Nenhuma tecla trocava de slide: não havia
handler de teclado no componente, só `onClick` nos botões.

- **Por que passou:** com o mouse, a apresentação funciona inteira. Ninguém que a usasse
  clicando notaria a ausência — e uma apresentação para reunião com família é exatamente o
  uso em que a pessoa espera avançar pelo teclado, longe do notebook.
- **Como apareceu:** o item 6 pedia que a troca de slide movesse o foco e fosse anunciada.
  Para mover o foco era preciso saber quando o slide muda pelo teclado, e a pergunta "o que
  acontece quando o usuário aperta a seta?" não tinha resposta no código.

**Nenhuma revisão pegou os dois.** A auditoria estática do Claude, a complementar do Codex e
a leitura do autor olham para o código, onde `DEMO_COUNTS.map((count, i) => ...)` parece
correto e onde a ausência de um handler não é uma linha escrita em lugar nenhum. Defeito de
omissão não aparece em varredura: não há o que casar.

**Conclusão para o artigo:** tornar a informação acessível é, antes de tudo, torná-la
explícita, e tornar um controle acessível é enumerar as formas de acioná-lo. Um dado que só
existe como cor, posição ou hover não pode ser conferido por ninguém; um caminho de interação
que só existe no mouse não pode ser testado pelos outros. Nos dois casos a acessibilidade não
foi um custo pago depois da funcionalidade: foi o que mostrou que a funcionalidade estava
errada.

---

### 4. Cor de categoria produzida por acidente (Etapa 3)

**Qualificação:** funcionava, e qualquer categoria nova quebraria em silêncio. É o tipo de
código que passa em revisão porque a tela está certa.

**O que acontecia:** em `pages/AgendaAtendimentos`, a cor de cada tipo de atendimento no
calendário saía de uma classe do Tailwind desmontada com duas substituições de texto:

```js
backgroundColor: tipoColors[tipo].replace('bg-', '').replace('-500', '')
```

De `'bg-blue-500'` sobrava `'blue'` — que é uma **cor nomeada do CSS**, e por isso pintava.
Mas a cor nomeada não é a do Tailwind, então o calendário **nunca** mostrou a mesma cor da
legenda ao lado. Medido no navegador:

| Classe | Cor do Tailwind, na legenda | Cor nomeada, no calendário |
|---|---|---|
| `bg-blue-500` | `rgb(59, 130, 246)` | `rgb(0, 0, 255)` |
| `bg-green-500` | `rgb(34, 197, 94)` | `rgb(0, 128, 0)` |
| `bg-orange-500` | `rgb(249, 115, 22)` | `rgb(255, 165, 0)` |
| `bg-gray-500` | `rgb(107, 114, 128)` | `rgb(128, 128, 128)` |

E bastava uma categoria com nome composto, como `'bg-light-blue-500'`, ou um tom fora do
500, para sobrar uma string que o CSS ignora: o evento ficaria sem cor, sem erro no console
e sem falha em nenhuma verificação.

**Como apareceu:** a conversão das cores fixas em tokens, feita por contraste. Trocar
`'bg-blue-500'` por `'bg-brand-blue'` fez as duas substituições devolverem `'bg-brand-blue'`,
uma string sem sentido para `backgroundColor`, e o TypeScript acusou na hora que o novo objeto
não tinha `.replace`.

**Correção:** uma tabela só por tipo, com a classe e o valor CSS derivados do mesmo token, em
vez de três formas diferentes de dizer a mesma cor — duas tabelas paralelas e uma terceira
derivada por manipulação de string.

**Conclusão para o artigo:** três representações da mesma informação, mantidas à mão, é um
convite à divergência. Aqui elas já tinham divergido, e ninguém tinha visto porque o resultado
ainda era uma cor.

---

### 5. O que passa em cada teste isolado e falha na combinação (Etapa 3)

**Qualificação:** a norma pede duas coisas separadas — refluxo em 320 px de largura (1.4.10)
e texto redimensionável até 200% (1.4.4) — e o sistema passou nas duas. **Combinadas**, dez
das dezessete rotas falhavam. A combinação não é exigida por nenhum critério, e é a condição
real de uso de quem tem baixa visão: tela pequena **e** fonte ampliada, ao mesmo tempo.

**Os números:**

| Condição | Rotas sem rolagem horizontal |
|---|---|
| 320 px, texto padrão | 17 de 17 |
| 640 px, equivalente a 200% de zoom num desktop de 1280 | 17 de 17 |
| 320 px **com** a preferência de fonte "muito grande" | 7 de 17 |

Em 320 px com a fonte a 125%, a largura útil equivale a 256 px. O estouro ia de 2 px a
75 px, e as causas eram duas, nenhuma visível nos testes isolados: rótulo de botão que não
quebra linha, porque o componente traz `whitespace-nowrap`, e palavra longa que não quebra,
como um título de tela ou "R$ 850.000,00" em corpo grande, empurrando a linha flex que a
contém.

**A correção precisou de uma distinção fina.** `overflow-wrap: break-word` não resolve:
ele quebra a palavra na hora de desenhar, mas não entra no cálculo da largura mínima do
elemento, então a linha flex continua reservando o espaço da palavra inteira. Só
`overflow-wrap: anywhere` afeta a largura mínima. As duas regras valem apenas para quem
escolheu aumentar a fonte, porque no tamanho padrão o `whitespace-nowrap` do botão é
desejável.

**O teste só existiu porque a preferência foi implementada.** A combinação não era testável
antes do commit 6 da etapa, que criou o controle de tamanho de fonte. Implementar o recurso
de acessibilidade produziu o cenário de teste que revelou o defeito — o mesmo movimento do
achado 3, por outro caminho: lá, tornar a informação explícita expôs um erro de dados; aqui,
dar à pessoa o controle sobre a apresentação expôs um limite do layout.

**Conclusão para o artigo:** critérios de acessibilidade são verificados um a um, e as
pessoas usam o sistema com vários ajustes ligados ao mesmo tempo. Uma bateria que testa cada
critério isoladamente e declara conformidade não descreve a experiência de quem depende
deles. Vale testar as combinações que os próprios recursos de acessibilidade do produto
tornam possíveis.

---

## Etapa 0 — Aplicar o patch da auditoria ✅ pré-pronto

Já feito e verificado externamente. Aplicar, não refazer.

```bash
git checkout -b fix/auditoria
git apply correcoes-auditoria.patch
git rm "Sistema PEI SESI SP_ Gestão Inclusiva.pptx" bun.lock bun.lockb package-lock.json
npm install
npm run lint && npm run typecheck && npm run build
```

**Critério de aceite:** as três verificações passam e este comando não retorna nada:

```bash
grep -rniIE "sesi|lovable" src docs index.html | grep -viE "useSidebar"
```

A exclusão é explícita de propósito. `useSidebar` (shadcn) contém `seSi` e é o único
falso positivo conhecido. Não trocar por `-w`: o hífen conta como separador, então
`--sesi-blue` ainda casaria, mas `matriculaSESI` (o campo do tipo `Student`) passaria
despercebido. No commit-base `4c22d53` o comando retorna 103 linhas, 11 delas com
`matriculaSESI`; com `-w`, só 1 dessas 11 aparece.

---

## Etapa 1 — Store de demonstração (destrava tudo)

**Problema:** `NewStudent.tsx` e `NewObservation.tsx` validam com Zod, descartam o
resultado, mostram sucesso e navegam. `NovoAtendimentoDialog`, `NewAssessmentDialog`,
`NovaObservacaoDialog`, `ContributeResourceDialog` e `ResourceDetailModal` fazem o mesmo.
O usuário acredita que salvou. Nada existe ao voltar.

**Decisão a confirmar com o autor antes de começar:** store local (Context + reducer,
com hidratação opcional de localStorage) ou backend real. A recomendação é store local —
é o passo intermediário correto e não exige infraestrutura.

**Escopo:**
1. `src/store/` com um provider único sobre `students`, `observations`, `meetings`,
   `assessments`, `resources`, `reviews`, inicializado a partir de `src/data/`.
2. Cada formulário passa a gravar no store e o registro criado aparece imediatamente na
   listagem correspondente.
3. Toast de sucesso só depois da gravação efetiva.
4. Se houver persistência em localStorage: aviso visível de que os dados ficam no
   navegador e não servem para dados reais; botão de reset.

**Critério de aceite:** cadastrar um aluno, voltar para `/alunos` e vê-lo na lista.
Idem para observação, atendimento e avaliação. Nenhum `console.log` no lugar de gravação.

---

## Etapa 2 — Controles inertes

**Problema:** dezenas de botões, selects e checkboxes são afordância visual sem ação. O
relatório do Codex traz o inventário completo com `arquivo:linha`, agrupado em A (sem
handler/sem rota), B (valor descartado) e C (estado atualizado mas não usado).

**Regra por controle — escolher uma:**
- implementar contra o store da Etapa 1;
- desabilitar com `disabled` **e** texto visível explicando por quê;
- remover.

Não deixar nenhum na categoria "parece que funciona".

**Prioridade:** controles de escrita e exportação primeiro (`GenerateReportDialog`,
`AnexosDialog`, `VerPEIDialog`, `EditarCadastroDialog`), depois perfil/configurações,
depois painéis de gestão.

**Casos específicos:**
- `EditarCadastroDialog`: todos os campos são `defaultValue` não controlado e Save não
  tem handler — inicializar controlado a partir do aluno selecionado.
- `ResourceLibrary`: `selectedTypes` e `selectedLevels` nunca são lidos na filtragem;
  `sortBy` nunca ordena.
- `Reports` / `ReportsContent`: quatro filtros que nenhum gráfico consome.
- `AnexosDialog`: busca que não filtra; `currentMonth` com setter nunca chamado.
- `useCalendarSync`: começava com uma conta Google "conectada" fictícia e simulava conexão
  e sincronização com toasts de sucesso. Deve iniciar desconectado e sem nenhum sucesso
  simulado: conectar e sincronizar ficam desabilitados, com o motivo visível. Um toast como
  "Outlook conectado!" viola a invariante 3 mesmo com rótulo de simulação.

**Critério de aceite:** varredura de `<Button` sem `onClick` que não seja trigger de
Radix nem esteja dentro de `<Link>`; cada ocorrência restante justificada.

**Estado em 15/09/2026:** feita na branch `etapa-2/controles-inertes`, ainda sem PR, em seis
commits de código (`e80a93d`, `f807a04`, `c8f5e2b`, `2fb404d`, `ee41265` e `639a641`), além
dos de documentação. O store está na versão 3.

Varredura do critério de aceite, feita por script sobre `src/`, fora de `components/ui`:
- **Total:** 171 `<Button>`.
- **Justificadas:** 65 com `onClick`, 62 com `disabled`, 2 de envio de formulário, 3 com
  `asChild`, 20 dentro de gatilho Radix ou de `<Link>` e 11 dentro de `<fieldset disabled>`
  (Perfil e Configurações).
- **Restantes:** 8, todas em arquivos que nenhuma rota monta: `CoordinationDashboard.tsx`
  (2) e `reports/ActionPanel.tsx` (6), este importado só por `pages/Reports.tsx`, que não
  tem rota. Saem com a Etapa 5.

A varredura só enxerga o componente `Button`. Ficam de fora o `<button>` nativo, `div` com
`onClick` e controles como `Checkbox` e `Select`. O motivo visível dos controles
desabilitados foi conferido no navegador em cada commit, não pelo script.

---

## Etapa 3 — Acessibilidade profunda

Base já feita na Etapa 0 (menu mobile, skip link, `<main>`, contraste, nomes no header).

**Estado em 16/09/2026:** ✅ feita na branch `etapa-3/acessibilidade`, a partir do
`a9fe84f`, em nove commits de código e quatro de documentação. Os oito itens do inventário
foram revalidados contra o código depois da Etapa 2, que removeu mais de 1.200 linhas: três
mudaram de tamanho ou de natureza, um estava errado quanto ao nível do critério, e a
revalidação achou quatro defeitos que não estavam ali. O contraste, que também não estava,
virou item próprio.

| Commit | O que faz |
|---|---|
| `7bd77f7` Add | Ferramentas de verificação e plano revalidado |
| `a5a38a9` Fix | Controles que só funcionavam no mouse |
| `9005edb` Docs | Achado 2: o que a verificação automatizada não vê |
| `9ea04e1` Chore | `.claude/` no `.gitignore` |
| `3357f8d` Add | Equivalente textual dos gráficos e nome nas barras |
| `4695db5` Fix | Emoji de status e de título |
| `ab5c50c` Docs | Achado 3, o padrão, e achado 4 |
| `41ac64b` Fix | Títulos, diálogos e controles sem nome |
| `5a72ea7` Fix | Cores fixas viram tokens medidos |
| `64181a7` Docs | Achados e a regra de medir contraste |
| `f80e31b` Add | Preferências de acessibilidade |
| `79c2890` Fix | Refluxo em 320 px e zoom de 200% |

### Resultado da etapa

Medido nas dezessete rotas do sistema, antes do primeiro commit e depois do último. As
violações do axe são as de WCAG 2.1 nível A e AA; os avisos do lint são do
`eslint-plugin-jsx-a11y`, com a configuração já depurada (ver achado 2).

| Medida | Antes | Depois |
|---|---:|---:|
| **Violações do axe, somadas** | **124** | **0** |
| — contraste de cor (1.4.3) | 47 | 0 |
| — barra de progresso sem nome (4.1.2) | 62 | 0 |
| — botão sem nome (4.1.2) | 14 | 0 |
| — link sem nome (2.4.4) | 1 | 0 |
| **Avisos do `jsx-a11y`** | **8** | **0** |
| Controles operáveis só por mouse | 5 | 0 |
| Gráficos sem nome nem equivalente textual | 12 | 0 |
| Diálogos sem descrição | 10 | 0 |
| Rotas com salto de nível de título | 12 de 17 | 0 |
| Rotas com rolagem horizontal em 320 px | 6 de 17 | 0 |
| Rotas com rolagem em 320 px **e** fonte "muito grande" | 10 de 17 | 0 |
| Lugares com status carregado só por emoji | 6 | 0 |
| Linhas com emoji em título, aba ou rótulo | 98 | 0 |
| Preferências de acessibilidade que funcionam | 0 de 10 | 5, com 5 removidas |

**O que o número não diz.** Sobra uma violação de contraste por rota, sempre a mesma: o axe
não lê gradiente e acusa o "Usuário de demonstração" do cabeçalho em 1,04:1, quando o
gradiente real vai de 10,65:1 a 5,96:1 contra branco. Está no achado 2, junto do resto do
que a verificação automatizada não vê — inclusive o fato de que, dos cinco controles só
operáveis por mouse, o lint viu um e o axe não viu nenhum.

**O que ainda falta.** A navegação inteira só por teclado e a leitura por leitor de tela real
não foram verificadas nesta sessão: a ferramenta de navegador usada aqui não aciona
`<button>` por Enter ou Espaço. Os dois ficam em lista de teste manual, executada pelo autor.
Também continuam fora dos tokens 165 classes de cor fixa e 12 literais hexadecimais que
**passam** no contraste, registradas na Etapa 5.


### Ferramentas de verificação

Duas dependências de desenvolvimento, com funções distintas, aprovadas nesta etapa. O que
cada uma achou e deixou de achar está no **achado 2**, no topo deste arquivo.

- **`eslint-plugin-jsx-a11y`**, dentro do `npm run lint` que já existe, portanto também no
  CI. As regras entram como **aviso** (`JSX_A11Y_SEVERITY` no `eslint.config.js`) para
  servirem de lista de trabalho sem quebrar a exigência de 0 erros, e passam a **erro** no
  commit final da etapa.
  - **Linha de base, no commit 1:** 8 avisos. Eram 100 antes de preservar as regras que o
    preset desliga: `label-has-for` está obsoleta, exige aninhamento **e** `htmlFor` ao
    mesmo tempo, e sozinha gerava 85 avisos sobre rótulos corretos.
  - **Ponto cego conhecido:** a regra só enxerga elemento do DOM. Dos cinco controles
    inalcançáveis por teclado desta etapa, ela vê **um**, o `<div onClick>` do
    `ProgressChart`. Os `<Badge onClick>` da matriz de riscos e o `<Card onClick>` da agenda
    passam batido, porque são componentes. É o mesmo ponto cego da varredura de `<Button>`
    da Etapa 2: ferramenta estática não atravessa abstração de componente.
- **`axe-core`**, sem navegador headless e **fora do CI**. O Vite serve
  `/node_modules/axe-core/axe.min.js` para a página, e a varredura roda rota a rota na
  sessão, com a versão fixada no lockfile. Pega o que o lint não vê: nome acessível
  computado, contraste calculado e alvo de `aria-describedby` inexistente.
  - **Primeira varredura, na rota `/`:** duas violações, uma real e uma falso positivo. A
    real são três `Progress` sem nome acessível (`aria-progressbar-name`, grave). O falso
    positivo é "Usuário de demonstração" no cabeçalho, acusado de contraste 1,04:1 — o axe
    não lê gradiente e usou o fundo da página. O gradiente real vai de 10,65:1 a 5,96:1
    contra branco, ambos acima de 4,5:1.
  - Vale registrar os dois: uma auditoria automatizada erra nas duas direções, e tratá-la
    como veredito produziria tanto defeito não visto quanto correção desnecessária.

`jest-axe` foi descartado: exigiria `vitest`, `jsdom` e `@testing-library`, e o jsdom não
calcula layout nem contraste, que é metade do valor do axe.

### Itens

1. **Matriz de risco 3×3** ✅ feito no commit 2 (`gestao/AlertasRiscosContent.tsx:356-422`): nove badges
   clicáveis são `<div>` (o `Badge` do shadcn), sem `role`, `tabIndex` nem handler de
   teclado, e o texto é só `{id} {emoji}`. Virar `<button>` com nome descritivo;
   probabilidade/impacto/severidade como texto, não só posição na grade e tom de cor.
2. **Heatmap** ✅ feito no commit 3 (`reports/ObservationHeatmap.tsx`): 30 `<div>` com `cursor-pointer` e
   contagem só no tooltip de hover; a legenda não tem valores.
   **Decisão:** vira **tabela**, não botões. As células não têm ação nenhuma, e
   transformá-las em botão criaria controle inerte, exatamente o que a Etapa 2 passou seis
   commits eliminando. Achado junto: a grade de sete colunas começa no dia 1 sem alinhar ao
   dia da semana, então o cabeçalho Dom–Sáb está errado.
3. **Gráficos Recharts** ✅ feito no commit 3: sem nome acessível nem equivalente textual. Não são três, são
   **doze em sete arquivos montados** — `ProgressChart` (3), `MeuPerfilDialog` (3),
   `OrcamentoContent` (2), `InterventionDonut`, `PEIRadarChart`,
   `StudentPerformanceDialog` e `AgendaAtendimentos` (1 cada). Somam-se os três `Progress`
   sem nome do Dashboard, achados pelo axe.
   A legenda do donut **já** traz nome e porcentagem em texto: o que sobra lá é
   `cursor-pointer` e realce só por mouse, sem informação nova. Reclassificado como
   afordância falsa, não perda de informação.
4. **Emoji com significado** ✅ feito no commit 4. Eram 325 ocorrências em 32 arquivos, 314
   delas em arquivos montados por rota. Por natureza, e com escopo decidido pelo autor:
   - **Status carregado pelo emoji sozinho: saem e ganham texto.** É falha AA (1.4.1).
     A triagem inicial por padrão de código apontou 24 linhas; verificando **uso a uso**,
     sete delas (os `icon:` de `data/mockResources.ts`) são renderizadas junto do nome da
     conquista, então são decorativas e ficaram. Sobraram seis lugares: o comparativo do
     `BenchmarkingTable` ("adequado", "atenção", "crítico"), os três indicadores do
     `ExpandedComplexityCard`, a severidade do `AlertasRiscosContent`, o objetivo do
     `StudentPerformanceDialog` ("Alcançado", "Em progresso", "Atenção"), a conquista
     bloqueada do `MeuPerfilDialog` e o tom da observação em `lib/observation.ts`.
     Contar ocorrência de padrão não é o mesmo que contar defeito: só o uso decide.
   - **97 linhas em título, aba, `DialogTitle` e `Label`** (como "📋 Dados Pessoais"):
     **saíram**. O leitor de tela lê o nome do emoji antes do texto, o que polui a
     navegação. As 97 foram revistas uma a uma antes de aplicar.
   - **158 linhas decorativas no meio de texto corrido: ficam.** Envolver cada uma em `span`
     com `aria-hidden` seriam 158 pontos de alteração para resolver verbosidade, não
     barreira. O leitor anuncia o nome do emoji: é incômodo, não é falha. Registrado para
     ficar claro que foi escolha, e não esquecimento.
5. **Estrelas de avaliação** ✅ feito no commit 2 (`ResourceDetailModal.tsx:232-247`): cinco `<button>` só com
   SVG, sem nome, sem estado e sem `type`. Virar radiogroup rotulado com valor textual
   visível.

   Evidência de campo: durante o teste da Etapa 1, a árvore de acessibilidade do diálogo
   expôs as cinco estrelas como botões sem nome e sem estado. Não foi possível identificar
   qual estrela era qual, nem a nota selecionada, sem inspecionar o DOM. Confirma o defeito
   na prática, não só na análise estática. A ativação por teclado não foi verificada: a
   ferramenta de teste não ativa por Enter/Space nem botões com nome.
6. **Diálogos** ✅ feito no commit 5: `PresentationModeDialog` tem dois `DialogContent` e um só `DialogTitle` — é
   o modo apresentação que está sem título — e não move foco nem anuncia troca de slide.
   **Dez diálogos montados estão sem `DialogDescription`**: Anexos, Configurações,
   Contribuir, Meu Perfil, Nova Observação, Detalhe da Observação, Apresentação, Detalhe do
   Recurso, Desempenho e Ver PEI.
7. **Hierarquia de headings** ✅ feito no commit 5: `NewObservation` usa `<h4>` sob `<h1>`; `VisaoGeralContent`
   abre com `<h3>`. A causa comum é o `CardTitle`, que é `<h3>` fixo: toda página cujo `<h1>`
   é seguido de Card pula o `<h2>`, o que inclui `/agenda-atendimentos`,
   `/biblioteca-recursos`, `/gestao` e `/alunos`.
   **Decisão:** `CardTitle` ganha nível configurável, retrocompatível, em vez de espalhar
   títulos de seção que ninguém pediu.
8. **Contraste e tokens de cor** ✅ feito no commit de contraste, entre o 5 e o 6. Item que
   não estava no inventário: a varredura do axe achou **47 falhas reais de 1.4.3** em quatro
   rotas, todas por cor fixa do Tailwind fora do sistema de tokens, o que também viola a
   invariante 1 do CLAUDE.md. As cores viraram token; faltavam roxo, rosa, índigo e
   verde-azulado, criados no bloco `--brand-*`.
   - As razões anotadas ao lado de cada token passaram a ser **medidas no navegador**, a
     partir da cor computada. Uma delas estava errada: `--brand-yellow` dizia 6,19:1 e media
     5,08:1. Ainda passava em AA, mas o registro mentia, e o amarelo precisou escurecer de
     30% para 27% de luminosidade para o texto sobre o fundo tingido sair de 4,46:1.
   - **Ainda fora dos tokens:** 165 classes de cor fixa e 12 literais hexadecimais, em cores
     que **passam** no contraste — eixos e séries de gráfico, principalmente. Não são falha
     AA, mas continuam violando a invariante 1. Ficam para a Etapa 5, junto da limpeza.
9. **Refluxo e zoom** ✅ feito no commit 7, e não alvo de toque. O item dizia que botões `sm` de 36 px e ícones de
   40 × 40 eram defeito de alvo de toque, mas o critério 2.5.5 (44 px) é **AAA**, e a meta
   do projeto é AA. O que é AA aqui é **1.4.10 Refluxo, em 320 px**, e **1.4.4
   Redimensionar texto, em zoom de 200%** — inclusive o rodapé da apresentação, que não
   quebra linha. O botão maior vira preferência opcional do item 9.
10. **Preferências de acessibilidade** ✅ feito no commit 6 (`ConfiguracoesDialog`, aba Acessibilidade). Alto
   contraste, aumentar o tamanho dos botões, destacar o foco do teclado, reduzir animações,
   ampliação e atalhos de teclado aparecem desabilitados desde a Etapa 2, rotulados como
   ilustrativos. Por decisão do autor, a implementação acontece aqui, e não junto dos
   controles inertes.
   - Guardadas em **chave própria do navegador**, `pei-a11y-preferences`, fora do store de
     demonstração e sem versão 4 dele. O argumento decisivo: elas precisam sobreviver quando
     o envelope do store é descartado por versão desconhecida.
   - Aplicadas **na hora**, sem passar pelo botão Salvar, sob o rótulo "Preferências deste
     navegador" — mesma decisão dos favoritos da Etapa 2.
   - Alto contraste sai por **atributo de dados sobre os tokens**. O `next-themes` já é
     dependência, usado só pelo toaster, mas não deve ser reaproveitado: arrastaria modo
     escuro, que ninguém pediu e que multiplicaria o recálculo de contraste.
   - Reduzir animações deve respeitar também `prefers-reduced-motion`.
   - Dos dez controles da aba: **implementar** alto contraste, tamanho de fonte, reduzir
     animações, destacar foco do teclado e aumentar o tamanho dos botões; **remover**
     navegação por voz, leitor de tela e descrições de áudio, que dependem do sistema
     operacional, atalhos de teclado e sua lista, que o app não tem, e ampliação, que é o
     zoom do navegador.
   - **Remover "Limpar cache"**: "Restaurar dados de demonstração" já faz isso, e dois
     controles destrutivos com nomes diferentes para a mesma ação é pior que nenhum.
   - "Tamanho da fonte" hoje está na aba **Aparência**, também desabilitada. O controle se
     muda para Acessibilidade, e Aparência ganha uma linha dizendo para onde ele foi.

### Achados da revalidação, fora do inventário original

- `pages/AgendaAtendimentos.tsx:681`: o `<Card>` inteiro tem `onClick`. Há um `<Button>`
  dentro com o mesmo handler, então o teclado alcança a ação; o clique no card é afordância
  redundante que ainda dispara o handler duas vezes quando se clica no botão. Sai o
  `onClick` do card.
- `reports/ProgressChart.tsx:372`: `<div onClick>` que abre o painel de detalhe da área.
  Controle real, só por mouse. Vira `<button>`.
- `pages/StudentDetail.tsx:104`: `<Link>` envolvendo `<Button size="icon">` só com ícone —
  link sem nome acessível (2.4.4) e `<a>` contendo `<button>`, aninhamento inválido. É o
  único dos dez botões de ícone sem nome.
- `reports/PredictiveAnalysis.tsx:178`: conjunto de abas caseiro em `<button>`, sem
  `role="tablist"` nem `aria-selected`; o estado ativo é só cor de fundo.

### Limite de verificação da sessão

A ferramenta de navegador não ativa `<button>` nativo por Enter/Space. Dá para verificar
árvore de acessibilidade (nome, papel, estado, ordem de foco, alvo de `aria-describedby`),
contraste calculado, refluxo e zoom — **não** ativação por teclado nem leitor de tela real.
Esses ficam numa lista de teste manual, executada pelo autor ao fim da etapa.

**Critério de aceite:** navegar o sistema inteiro só com teclado, sem ficar preso nem
encontrar controle inalcançável. Toda informação disponível por cor/hover também
disponível como texto.

**Estado do critério:** a segunda metade está cumprida e medida. A primeira depende do teste
manual, porque a ferramenta de navegador da sessão não aciona `<button>` por Enter ou
Espaço. A lista de teste está abaixo; o que dá para afirmar sem ela é que todo controle
entra na ordem de foco, tem nome e expõe estado.

### Lista de teste manual, a executar pelo autor

| | Onde | Sequência | Esperado |
|---|---|---|---|
| M1 | `/gestao?tab=alertas`, matriz de riscos | Tab até um risco, Enter; de novo, Espaço | O detalhe expande e recolhe; o foco fica no botão |
| M2 | `/biblioteca-recursos` → Ver → "Sua nota" | Tab até a 1ª estrela, Espaço, seta direita duas vezes | Marca 1 e chega a 3; o texto ao lado diz "3 de 5" |
| M3 | `/gestao?tab=relatorios` → aba "Por Áreas" | Tab até o nome da área, Enter | O painel de detalhe abre |
| M4 | Mesma tela, calendário de observações | Tab atravessando o bloco | O foco pula a tabela inteira, sem parar em célula |
| M5 | `/alunos/1` → Modo Apresentação → Iniciar | Setas direita e esquerda; depois Esc | Anda e volta de slide, o leitor anuncia "Slide 3 de 12", e Esc fecha |
| M6 | Configurações → Acessibilidade | Espaço em Alto contraste, fechar, F5 | Continua aplicado depois de recarregar |
| M7 | Windows → Acessibilidade → Efeitos visuais, desligar animação; F5 | — | As transições somem sem marcar nada no app |
| M8 | Leitor de tela em `/alunos` e num diálogo | Leitura sequencial | Os títulos não começam com o nome de um emoji; o diálogo anuncia título e descrição |
| M9 | `/gestao?tab=relatorios`, "Ver os dados do gráfico em tabela" | Tab até o resumo, Enter | A tabela abre e é lida com cabeçalho de linha e de coluna |

O M5 tem uma armadilha de teste já verificada: duas setas com menos de ~400 ms entre elas
parecem não funcionar. É artefato da automação, não do app.

---

## Etapa 4 — Números coerentes

**Problema:** `ExecutiveSummary` exibe 45 alunos; o Dashboard conta 4 do fixture;
`VisaoGeralContent` diz 42/45; `BenchmarkingTable` tem outro conjunto fixo. Valores
derivados armazenados (`Assessment.mediaGeral`, rating de recurso vs. reviews reais,
percentuais de orçamento) já divergem.

**Escopo:**
1. `src/lib/metrics.ts` com seletores sobre o store, recebendo data de referência.
2. Substituir literais duplicados pelos seletores.
3. Se um fixture representa deliberadamente uma "escola maior" que os 4 alunos, separá-lo
   e rotular escopo e proveniência — não misturar com contagem real do dataset.
4. Recalcular médias, ratings e percentuais a partir dos registros de origem.

**Registrado durante a Etapa 2:** conteúdo fixo que continua aparecendo como se fosse do
estudante ou como se tivesse sido medido.
- **Ficha do estudante** (`StudentDetail`):
  - ano letivo, turno, professor(a) de apoio, necessidades específicas, recursos e
    composição familiar são inventados;
  - a linha do tempo (ingresso, primeiro PEI, revisões), a "Última atualização" e o número
    de anexos (21) são fixos.
- **Desempenho e Apresentação:** conteúdo e números fixos, iguais para qualquer estudante.
  A Apresentação tem aviso de exemplo; o Desempenho, não. O Histórico deixou de mostrar
  exemplo e diz que não há histórico registrado (Achados, item 1).
- **Detalhe da observação** (`ObservationDetailDialog`): o detalhamento, a comparação
  "+200%", as transições, as notificações "Visualizado", os metadados e a frase "têm se
  mostrado eficazes" são texto fixo, exibido em qualquer observação estruturada, agora com
  aviso de exemplo.
- **Dashboard:** as tendências +12% e +8% aparecem sem `DemoDataNotice`, os "12 relatórios
  pendentes" são fixos, e o card "Observações: Este mês" conta todas as observações.
- **Agenda:** o card "Este Mês" conta todos os atendimentos e mostra "+12% vs. mês
  anterior".
- **Benchmarking e projeções** (`BenchmarkingPanel`, `PredictiveAnalysis`): "% eficácia",
  "chance de melhoria", "prevê-se", "baseado em 156 casos" e "Probabilidade".
- **Biblioteca:**
  - `rating` e `reviewCount` das fixtures não acompanham os comentários gravados;
  - a ordenação por "Mais baixados" e "Melhor avaliados" usa esses números e o
    `downloadCount` das fixtures;
  - "Meus Recursos" (publicados, downloads, avaliação média, favoritados, ranking e badges)
    é fixo;
  - no detalhe do recurso, "Favoritado por" (`favoriteCount`) não tem relação com os
    favoritos deste navegador, "Usado em 18 escolas" é inventado e "N pessoas acharam útil"
    vem das fixtures.

**Critério de aceite:** nenhum indicador de aluno aparece com dois valores diferentes em
telas diferentes.

---

## Etapa 5 — Deduplicação e limpeza

1. `Reports.tsx` / `gestao/ReportsContent.tsx` e `ComplexityAnalysis.tsx` /
   `gestao/ComplexityAnalysisContent.tsx` são quase idênticos; só as versões em `gestao/`
   estão roteadas. Manter uma implementação, remover imports órfãos de `App.tsx`.
2. `NavigationBar.tsx` e `CoordinationDashboard.tsx` nunca são renderizados.
3. 21 componentes gerados em `src/components/ui/` sem nenhum uso fora de `ui/`. Remover os
   inalcançáveis e só então analisar dependências do `package.json`.
4. Quebrar arquivos grandes tocados no caminho: `Manual.tsx` (~606), `MeuPerfilDialog.tsx`
   (~748), `AgendaAtendimentos.tsx` (~768), `ConfiguracoesDialog.tsx` (~629),
   `PredictiveAnalysis.tsx` (~616), `AlertasRiscosContent.tsx` (~536).
5. `QueryClientProvider` está montado sem nenhum `useQuery` — remover até existir API.
6. `dadosAnalisePreditiva` em `mockData.ts:218` nunca é importado.
7. Avaliar remoção de `studentName` dos registros vinculados, resolvendo pelo `studentId`
   na exibição. Hoje o nome fica copiado em três coleções: `studentName` nas observações e
   nas avaliações, e `aluno` nos atendimentos. O `student/update` (commit `2fb404d`)
   propaga o nome editado para as três. Isso mantém a coerência, mas é justamente o dado
   duplicado que gera divergência.
8. Arquivos sem uso além dos itens 1 e 2:
   - `NavLink.tsx`;
   - `reports/ActionPanel.tsx`, importado só por `pages/Reports.tsx`, que não tem rota e
     ainda tem o rodapé de alegações;
   - o formulário "Adicionar Evento" de `MinhaAgenda`, inalcançável desde a Etapa 2 porque o
     gatilho está desabilitado.
9. Estado morto em `ResourceLibrary`: `selectedTypes`, `selectedLevels` e as listas `types` e
   `levels` não têm interface nem são lidos.
10. Pequenos defeitos registrados na Etapa 2:
    - `CalendarIntegrations.tsx:132` cita `docs/calendar-sync.md`, mas o arquivo é
      `docs/calendar-sync-implementation.md`;
    - `MeuPerfilDialog.tsx:413` tem `Progress value={310}`, fora da escala de 0 a 100;
    - `VisaoGeralContent.tsx:37` usa a chave de objeto `MÉDIA`, com acento;
    - `VisaoGeralContent` e `MeuPerfilDialog` põem `Badge` (um `<div>`) dentro de `<p>`, e o
      React acusa aninhamento inválido;
    - `ObservationDetailDialog` formata a data com `new Date('AAAA-MM-DD')`, que é UTC: a
      observação de 19/11/2025 aparece como 18/11/2025 no Brasil;
    - em `AgendaAtendimentos`, as visões de semana e de dia passam `view` ao
      `react-big-calendar` sem `onView`, e o console avisa;
    - `App.tsx`, `StudentDetail`, `ObservationDetailDialog`, `StudentHistoryDialog`,
      `PresentationModeDialog`, `MeuPerfilDialog`, `AgendaAtendimentos` e `Dashboard` têm
      imports sem uso anteriores à Etapa 2.

**Critério de aceite:** build não encolhe em funcionalidade; nenhum arquivo morto.

---

## Etapa 6 — TypeScript estrito

Ligar em `tsconfig.json` e `tsconfig.app.json`: `strict`, `strictNullChecks`,
`noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`.

Vai gerar muitos erros. Corrigir **por arquivo**, com commit por lote — não silenciar com
`any` nem `@ts-ignore`. Se um erro revelar bug real (acesso a possivelmente `undefined`),
corrigir o bug, não o tipo.

**Critério de aceite:** `npm run typecheck` limpo com strict ligado.

---

## Etapa 7 — Testes

Vitest + Testing Library. Cobrir, no mínimo:
- seletores de métrica da Etapa 4
- `calculateAge` incluindo aniversário no mesmo dia e data inválida
- fluxo de criação de aluno e observação até aparecer na listagem
- teste de rotas: todo destino de `Link`/`navigate()` resolve para rota declarada

Adicionar `npm test` ao workflow de CI.

**Varredura de acessibilidade no CI** (vindo da Etapa 3). O `axe-core` entrou como
dependência de desenvolvimento e roda rota a rota na sessão, servido pelo Vite, **fora do
CI**. Automatizá-lo exige navegador headless — Playwright ou Puppeteer —, porque o jsdom não
calcula layout nem contraste, que é metade do valor da ferramenta. São três a quatro
dependências novas e um tempo de CI bem maior, então isso pertence a esta etapa, junto do
runner. Duas lições da Etapa 3 valem para o desenho do teste: o axe erra nas duas direções
(acusou contraste 1,04:1 num gradiente que na verdade vai de 10,65:1 a 5,96:1), e o
resultado precisa de revisão humana em vez de virar critério de aprovação cego.

---

## Etapa 8 — Manutenção de dependências

Só depois da Etapa 7. Todas as correções exigem versão major, e sem testes a quebra
passa por lint, typecheck e build sem ser vista.

**Estado em 13/09/2026** (`npm audit` sobre o lockfile regerado na Etapa 0): 4
vulnerabilidades, 1 alta e 3 moderadas.

| Pacote | Severidade | Advisories | Onde age |
|---|---|---|---|
| `vite` 5.4.21 (direto) | alta | GHSA-4w7w-66w2-5vf9, GHSA-v6wh-96g9-6wx3, GHSA-fx2h-pf6j-xcff | servidor de desenvolvimento; não entra no `dist/` |
| `esbuild` (via `vite`) | moderada | GHSA-67mh-4wv8-2f99 | servidor de desenvolvimento |
| `react-router` (via `react-router-dom`) | moderada | GHSA-wrjc-x8rr-h8h6 (open redirect com `\` em `<Link>`/`useNavigate`); GHSA-337j-9hxr-rhxg (hidratação SSR) | a primeira **chega ao bundle de produção**; a segunda não se aplica, o projeto não faz SSR |
| `react-router-dom` 6.30.6 (direto) | moderada | herdadas de `react-router` | idem |

Correção só com major: `vite` 8.x e `react-router-dom` 7.18+. Na mesma instalação,
`eslint` 9.39.5 aparece como fora de suporte e `recharts` 2.x como branch inativa (v3).

**Regras:**
- Nunca `npm audit fix --force`. Uma major por commit (`Update:`), com as três
  verificações e `npm test` passando.
- Começar por `react-router-dom`, a única advisory que chega ao bundle. Antes, verificar
  se algum destino de `Link`/`navigate()` vem de entrada do usuário ou de parâmetro de URL.
- `recharts` v3 mexe nos gráficos da Etapa 3: conferir de novo nome acessível e tabela
  equivalente.
- `vite` major: conferir que o `manualChunks` da Etapa 0 continua valendo e que o bundle
  principal não volta a crescer.

**Critério de aceite:** `npm audit` sem advisory alta ou moderada, ou cada uma que restar
registrada aqui com justificativa (dev ou bundle). As três verificações e `npm test`
passam.

---

## Etapa 9 — Decisões de produto

Registradas durante a Etapa 2, que tratou os controles sem mudar o que o sistema modela.

1. **PEI como entidade.** O sistema se chama Gestão PEI e não possui entidade PEI. Metas,
   revisões e histórico são conteúdo fixo.

   Hoje o `VerPEIDialog` mostra um PEI de exemplo, com aviso, igual para qualquer estudante.
   Editar PEI, Nova Revisão, "Adicionar observação" na meta e "Ver ata" ficam desabilitados.
   Modelar o PEI dá sentido ao nome do sistema: metas, prazos, responsáveis, revisões e
   evidências ligadas a observações, avaliações e atas de atendimento.
   - Afeta o Histórico, a Apresentação, os objetivos citados nas observações e o relatório
     imprimível.
   - Exige mudar o modelo de dados e subir a versão do store, com migração.

2. **Minha Agenda.** Na Etapa 2, a tela ficou como exemplo rotulado, com todas as ações
   desabilitadas. A opção preferida é a (a'): mostrar os atendimentos do store e tirar o
   formulário de evento. Antes, responder: existe agenda pessoal separada dos atendimentos
   (planejamento, formação, tarefas)? Se existir, o caminho é uma entidade nova de evento e
   tarefa, e não a (a').

---

## Fora de escopo até decisão do autor

- Backend real, autenticação, RBAC
- Integração OAuth com Google/Outlook
- Exportação de arquivos gerados pela aplicação (PDF, Excel, Word). O relatório da Etapa 2
  é impresso pelo navegador, que também salva como PDF; a aplicação não gera arquivo.
- Qualquer análise preditiva de verdade (exigiria dataset governado e validação; hoje há
  4 alunos fictícios)

Enquanto não existirem, o README e as telas devem continuar dizendo que não existem.
