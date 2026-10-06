# Backlog de correções — uma etapa por sessão

Cada etapa é uma sessão separada do Claude Code, com commit e verificação própria.
Não começar a seguinte antes de `npm run lint`, `npm run typecheck`, `npm test` e
`npm run build` passarem na anterior.

> **Corrigido em 03/10/2026:** este cabeçalho listava **três** comandos — ficou sem `npm test`
> desde que a suíte nasceu, em 18/09, enquanto o CLAUDE.md e o README já diziam quatro. Vigésimo
> item da mesma classe do achado 18, e o primeiro achado pela regra nova: saiu de cruzar as
> afirmações dos três arquivos sobre o que o CI roda (achado 19), não de reler este arquivo.

Origem: auditoria estática do commit `4c22d53` (Claude) + auditoria complementar (Codex).

---

## Achados

Defeitos cuja gravidade vai além do controle em que apareceram. É material para o artigo:
cada item registra o que acontecia, como foi confirmado e o que ainda está aberto.

### 1. Vazamento de dados de saúde entre estudantes (Etapas 2 e 4)

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

**Terceira e quarta aparições, na Etapa 4.** Depois do Editar Cadastro e do Histórico, a mesma
classe de defeito apareceu mais duas vezes: primeiro em três telas do estudante que as duas
correções anteriores não alcançaram, com dado de saúde fixo atribuído a qualquer estudante;
depois num painel de gestão, com o nome do aluno.

| Onda | Etapa e commit | Telas | O que aparecia |
|---|---|---|---|
| 1 | Etapa 2, `2fb404d` | `EditarCadastroDialog`; card "Perfil de Saúde" da ficha | para qualquer estudante: médico, CID-10, medicação e alergias de Ana Carolina |
| 2 | Etapa 2, `338ed54` | `StudentHistoryDialog`, `VerPEIDialog`, `AnexosDialog`, `ObservationDetailDialog`, `PresentationModeDialog` | para qualquer estudante: laudos, médica, diagnóstico com CID, turma e nome da mãe |
| 3 | Etapa 4, `e43150f` | ficha, card "Necessidades Específicas"; `StudentPerformanceDialog`; `NovaObservacaoDialog` | para qualquer estudante: o diagnóstico "Transtorno Global do Desenvolvimento" e a necessidade "Comunicação alternativa visual"; "Redução de 60% nas crises de ansiedade" e "Uso autônomo da prancha de CAA" como conquistas; e três "observações anteriores relacionadas", uma sobre uso de prancha de comunicação |
| 4 | Etapa 4, `9273891` | Gestão, Visão Geral: cartão "Crises Hoje" e linha do tempo | "Pedro, 9h - Ansiedade" e "Intercorrência: Pedro (crise)": o quadro de saúde mental de um aluno nomeado, num painel de gestão |

Nenhuma das três telas da onda 3 tinha aviso de exemplo cobrindo o conteúdo. A ficha tem um
aviso na página, mas ele pertence ao cartão de comparativo ilustrativo, não aos de
necessidades nem à linha do tempo.

**Como foi confirmado:** no navegador, antes da correção, criei no store uma aluna de teste
com diagnóstico **"Dislexia"**. Na ficha dela, o cartão de saúde mostrava "Dislexia", vindo
do cadastro, e o cartão ao lado dizia "Tipo: Transtorno Global do Desenvolvimento" e
"Recursos: Comunicação alternativa visual". O Desempenho listava as crises de ansiedade, e a
Nova Observação mostrava três observações anteriores — de uma aluna que não tinha nenhuma
observação registrada. Depois da correção, nenhum dos cinco textos aparece, e o cartão de
necessidades mostra só o nível de suporte do cadastro.

**Por que voltou.** Cada onda foi encontrada por busca de texto a partir da anterior. A busca
da onda 2 procurou nome da médica, matrícula, CID, turma e nome da estudante — os termos da
onda 1. "Transtorno Global do Desenvolvimento" não contém nenhum deles, nem "prancha de CAA",
nem "crises de ansiedade". A onda 3 só apareceu porque a busca mudou de natureza: em vez dos
termos do defeito anterior, um vocabulário clínico (transtorno, diagnóstico, laudo, CID,
comunicação alternativa, terapia e afins). E mesmo essa primeira varredura não achou as crises
de ansiedade: foi uma segunda, com termos de saúde mental e comportamento, que as encontrou.

**O que isso não garante.** Varredura por vocabulário acha o que usa as palavras procuradas.
Um dado de saúde escrito sem nenhuma delas continua podendo estar em alguma tela. O que muda a
garantia não é uma busca melhor, é a Etapa 4 terminar: quando tudo o que a ficha e os diálogos
do estudante mostram vier do registro dele ou de um cenário explicitamente nomeado, deixa de
haver texto fixo para atribuir a alguém. A Etapa 4 terminou sem chegar lá, e a Etapa 9 chegou:
ver **Fechado na Etapa 9**, abaixo. Até ela, Desempenho, Apresentação, Ver PEI e Detalhe da
observação mostravam conteúdo fixo sob o nome do estudante, com aviso.

**Critério, decidido pelo autor na Etapa 4: o que decide é a atribuição a uma pessoa
nomeada.** Não é ser fictício, e não é ter aviso de exemplo. Dois casos que ficaram para
decisão mostram a distinção:

| Caso | Onde | Atribuído a pessoa nomeada? | Decisão |
|---|---|---|---|
| Prancha de CAA como estratégia pedagógica | Ver PEI, Apresentação, Detalhe da observação, exemplos de Anexos | não: recurso de comunicação descrito genericamente, em tela com aviso | **fica** — é conteúdo ilustrativo do domínio, da mesma natureza da legislação e do manual |
| "Licença Médica" e "Licença Maternidade" | aba Equipe da Gestão | sim: Prof. Ricardo Alves e Dra. Paula Costa | **sai** — vira "Afastamento", que diz o mesmo para a gestão sem o motivo médico |

A aba Equipe tem aviso de dados fictícios, e ele cobre os afastamentos. Não mudou a decisão:
sob o critério, o aviso é irrelevante.

**Quarta onda — a mais grave até aqui.** Na Visão Geral da Gestão, o cartão "Crises Hoje"
dizia **"Pedro, 9h - Ansiedade"**, e a linha do tempo, **"Intercorrência: Pedro (crise)"**. As
três primeiras ondas exibiam dado de saúde fixo sob o nome de *qualquer* estudante que
estivesse aberto. Esta **nomeia a pessoa e o quadro de saúde mental na mesma linha**, num
**painel de gestão**, a tela em que coordenação e direção acompanham a escola inteira. O seed
tem um aluno chamado Pedro Oliveira Costa. A Visão Geral tinha aviso de dados fictícios desde a
Etapa 2, e sob o critério acima isso não muda nada. Corrigido em `9273891`, junto com as
licenças: o cartão diz "1 registro, às 9h", e a linha do tempo, "Intercorrência registrada".

**O par que é o achado metodológico mais forte desta série: a leitura completa não pegou; a
busca por vocabulário pegou em um minuto.** A mesma linha, no mesmo arquivo, passou por dois
métodos:

| Método | Quando | O que cobriu | Resultado |
|---|---|---|---|
| Leitura de `VisaoGeralContent.tsx`, linha a linha | 14/09/2026, 19h44, Etapa 2 | as linhas 70 a 374, o fim de um arquivo de 374 linhas, com "Pedro, 9h - Ansiedade" na linha 160 | **não pegou** |
| Busca por vocabulário do domínio (saúde, afastamento, saúde mental), sem ler os arquivos | 16/09/2026, 10h32, Etapa 4 | as telas de gestão | **pegou**, um minuto depois de a regra ser formulada |

- **A leitura.** Aconteceu na busca por ações sem destino da Etapa 2, um minuto depois do
  commit que pôs o aviso de dados fictícios na Gestão (`e80a93d`, 19h43). O trecho lido ia da
  linha 70 ao fim do arquivo e continha a linha 160; ela não foi apontada. A leitura olhava para
  o que a tarefa pedia. (O registro do commit `cc83fc5` dizia "lido inteiro"; o transcript mostra
  a leitura a partir da linha 70.)
- **A busca.** O autor formulou a regra da varredura por vocabulário numa mensagem de
  16/09/2026, às 10h31. A varredura seguinte, com termos de saúde, afastamento e saúde mental
  ("licença", "atestado", "estresse", "ansiedade", "depress", "laudo", "transtorno" e afins),
  devolveu a linha às 10h32. A correção entrou às 10h35 (`9273891`), três minutos depois, na
  mesma sessão; a regra entrou no CLAUDE.md às 10h36 (`7faa8f2`). A regra se pagou antes de
  ser versionada.
- **O que o par mostra.** Ler tudo não substitui procurar pelo domínio. A leitura depende do
  que a tarefa do momento manda olhar; a busca por vocabulário não depende de atenção nem de
  objetivo, e devolve a linha porque ela contém a palavra. A busca, por sua vez, só vale se
  casar o que procura — ver o achado 7, em que varreduras por vocabulário deixaram de ver as
  formas acentuadas por defeito da própria ferramenta.
- **Ficaram, por não serem atribuídos a ninguém:** "2 professoras [...] com histórico de
  afastamentos por estresse" e "Afastamentos médicos" nos riscos, e as especialidades clínicas
  do profissional em Meu Perfil.

> **Destaque — o ciclo fecha no mesmo arquivo: a correção tirou o diagnóstico e manteve a
> pessoa vinculada a ele.**
>
> `VerPEIDialog.tsx` é o mesmo diálogo da onda 2. Até `338ed54`, ele exibia para qualquer
> estudante o diagnóstico de Ana Carolina Souza, "TEA Nível 1 (F84.0)". O `338ed54` removeu o
> diagnóstico e deixou, quatro vezes (identificação e histórico), "Profª Marina Santos" como
> responsável pelo plano — na demonstração, a professora regente exatamente daquela aluna. O
> nome não estava na lista de termos da busca da onda 2 (nome da médica, matrícula, CID, turma e
> nome da estudante), e ficou. De `338ed54` a `bd93507`, o diálogo mostrou, sob "Aluno: <nome do
> estudante aberto> · PEI 2024 - 4º Trimestre · ✅ Ativo", a professora de outra aluna e um
> perfil fixo com "Interação social limitada" e "Comunicação verbal reduzida". Corrigido em
> `bd93507`: "Professor(a) regente" no lugar do nome, e o nome do estudante só aparece para dizer
> que o plano não é dele.
>
> Dois achados da série acontecem aqui, no mesmo arquivo:
> - **Achado 6 — corrigir a instância, não a classe.** A correção tirou o dado que a busca
>   apontou e manteve a pessoa vinculada a ele.
> - **Achado 7 — lista de termos em vez de vocabulário.** A busca procurou os termos do caso já
>   conhecido, e o nome da professora não era um deles.
>
> Não veio de varredura. Nenhuma lista incluía nomes de professores nos diálogos da ficha, e a
> busca de nomes do commit 7 cobria só a Gestão. Apareceu na leitura do arquivo para corrigir o
> cabeçalho do Ver PEI, com a tarefa já sendo atribuição a pessoa nomeada.

> **Quinta onda — a varredura por efeito não cobre o que não tem efeito (Etapa 5).** Dois
> casos, uma causa só, achados ao remover código morto:
>
> - `CoordinationDashboard.tsx`, importado por arquivo nenhum: **"Formação sobre TEA para
>   Prof. Ana Costa"** — pessoa nomeada e condição de saúde na mesma linha, a forma exata da
>   quarta onda —, mais "Revisar PEI de Maria Silva", "Agendar reunião com família João
>   Santos", "TDAH: 4", "TEA: 5" e dez percentuais fixos sem aviso.
> - `dadosAnalisePreditiva`, em `mockData.ts`, export que nunca foi importado: "João Silva",
>   um diagnóstico, e o vocabulário de "Predição", "probabilidade" e "confiança" que
>   `0c2be34` reescreveu nas telas vivas da Etapa 4.
>
> Nenhum dos dois renderizava. Por isso **nenhuma verificação por efeito os alcançou**: as
> varreduras das Etapas 1 a 4 conferiam no navegador, e o que não tem tela não aparece no
> navegador. Mas código não renderizado continua sendo **código publicado**: os dois estavam
> legíveis no repositório público desde `a031785`, o primeiro commit, de 24/11/2025.
>
> Removidos em `06542d6` (o arquivo) e em `1c84b6f` (o export). O conteúdo segue documentável
> por hash depois de apagado, porque o git guarda o blob:
> `0a1762ebfede302feee3b07177f1e74ee200cecf` para o `CoordinationDashboard`.
>
> **A lição de método:** "verifique o efeito, não a presença do código" é regra desta série e
> continua certa. O limite dela é que ela só cobre o que tem efeito. Para código sem tela, a
> varredura tem de ser no texto do repositório, e o critério de alcance é o grafo de imports,
> não a navegação.

**Fechado na Etapa 9.** Ver PEI, Detalhe da observação, Apresentação e Desempenho ficaram até lá
com conteúdo fixo de exemplo sob o nome do estudante — todos com aviso de que o conteúdo não era
dele e sem dado de saúde; o Ver PEI identificava outra pessoa da demonstração até `bd93507`. A
Etapa 4 terminou sem trocá-los porque o que mostravam — PEI, trimestres, presença, conquistas —
não tinha registro de origem no modelo. Com a entidade PEI, as quatro passaram a ler os registros
do estudante aberto, e o que o modelo não tem saiu da tela em vez de virar número fixo com aviso.

**Sexta onda, na Etapa 9 — e o pior caso da série, por uma razão nova: AUTORIA FALSA.**

O detalhe da observação (`ObservationDetailDialog`) trazia dois blocos que nenhuma onda anterior
tinha:

- **"Observações Adicionais"**, três parágrafos de avaliação pedagógica sobre a criança —
  "Esta manhã foi particularmente produtiva…", "Recomendo manter a comunicação próxima com a
  família…" — **assinados com o nome do observador da observação aberta**, que é o campo real do
  registro. Quem lesse a tela via um texto atribuído, nominalmente, a uma professora que não o
  escreveu.
- **"Notificações Enviadas"**, com horário de leitura e uma **resposta da família entre aspas**:
  *"Obrigada pelo retorno! Vamos implementar o timer em casa também."* Fala inventada, posta na
  boca da mãe de uma criança, com data e hora.

**Por que é pior que as cinco ondas anteriores.** Nelas o defeito era dado de uma pessoa exibido
sob o nome de outra: errado, grave com dado de saúde, e ainda assim um erro de **atribuição de
registro**. Aqui o registro não existia em lugar nenhum — foi **inventado e assinado**. A
diferença importa para o que o sistema afirma: um prontuário trocado diz a coisa errada sobre
uma criança; um texto assinado diz que **uma profissional avaliou e uma mãe respondeu**, e
nenhuma das duas disse nada. Num sistema de educação inclusiva, esse texto é o tipo de coisa que
entra em reunião, em relatório e em decisão sobre a vida escolar de alguém.

**Por que sobreviveu a cinco varreduras.** Todas procuraram o que já tinha acontecido: dado de
saúde, nome de estudante, vocabulário clínico, números sem origem. Nenhuma procurou **texto
assinado** — a classe só ficou visível quando a tela foi reescrita para ler o registro, e o que
sobrava sem fonte ficou óbvio. É a lição do achado 7 outra vez: a busca pela lista do que já se
viu não alcança a forma seguinte.

Corrigido em `25828fe`, junto com o resto do que o diálogo inventava, e com asserção nominal dos
doze trechos que não podem voltar.

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

**Dois casos novos, na Etapa 9, no mesmo ponto cego: o que só existe depois de uma interação.**
O botão de fechar de todo diálogo tinha nome acessível **"Close"**, em inglês, numa página
`lang="pt-BR"` (3.1.2 e 4.1.2); o botão de fechar do toast não tinha nome **nenhum**, só o
ícone (4.1.2, e contra a regra de botão só-de-ícone do CLAUDE.md). Os dois estavam no primitivo
compartilhado, desde o template, e atravessaram as oito etapas anteriores — inclusive a Etapa 3,
que levou o axe a zero em todas as rotas.

Não é falha do axe: diálogo e toast **não estão montados** enquanto ninguém interage, e a
varredura mediu rota a rota. É o mesmo limite registrado acima — "só vê o que está montado" —,
agora com a consequência medida no tempo: oito etapas. E alcança também o arreio de superfície,
que mede as mesmas 23 rotas sem interagir, e por isso deu zero nos dois commits que corrigiram
isso. **Nenhum dos dois métodos automatizados deste repositório vê conteúdo que só existe depois
de um clique.** O que viu foi a leitura do texto do diálogo aberto no navegador, durante outra
verificação.

Corrigidos em `ccb2fce`, com asserção nos dois lugares onde eles existem e duas mutações. A
pendência 3 abre o trabalho de estender o arreio a diálogos.

**A formulação que fica, e ela é mais ampla do que "o axe não viu".** Não é limite de uma
ferramenta: é limite de **todo o aparato automatizado deste repositório**. O axe mede rota a
rota; o arreio de superfície mede as mesmas 23 rotas; o `jsx-a11y` lê código e não sabe o que
monta. Diálogo e toast **só existem depois de uma interação**, e nenhum dos três chega lá. Foi
por isso que dois defeitos de nome acessível atravessaram oito etapas e a verificação que levou
o axe a zero.

**É o argumento mais forte a favor dos nove testes manuais, que continuam pendentes** (ver
"Pendências abertas", item 1). A lista M1 a M9 existe porque teclado e leitor de tela reais
cobrem o que o automatizado não cobre; o par "Close"/toast mostra que a lacuna não é teórica e
não é pequena — são dois defeitos de WCAG 4.1.2 e 3.1.2 em componentes que aparecem em toda a
aplicação, achados por leitura de tela aberta, não por varredura. Enquanto os nove não forem
executados, o que o repositório pode afirmar sobre acessibilidade vale **para o que está montado
sem interação**, e não para o sistema inteiro.

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

**Caso 2: as setas do modo apresentação nunca funcionaram.** `PresentationModeDialog` tinha,
em 2026, doze slides fixos e botões "Anterior" e "Próximo" (na Etapa 9 o número passou a vir do
plano: são 8 para a estudante 1). Nenhuma tecla trocava de slide: não havia
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

### 6. Correção que introduz o defeito adjacente (Etapas 0 a 4)

**Qualificação:** a mesma forma de erro, quatro vezes nesta série, sempre com uma correção ou
uma verificação que acertou a camada que tocou e errou a vizinha, onde o comportamento de
fato estava. Em todos os casos, a checagem confirmou a presença do que foi feito, e não o
efeito observável. Os quatro nasceram no patch da Etapa 0 (`441a31e`), que o autor registra
como erro seu; a idade foi o último a aparecer, e é o que motivou este registro.

| Caso | O que a correção ou a checagem acertou | Onde estava o defeito | Como apareceu | Corrigido em |
|---|---|---|---|---|
| Idade | a idade deixou de ser guardada e passou a ser calculada da data de nascimento, em `calculateAge` (`441a31e`) | a mesma função lia a data com `new Date('AAAA-MM-DD')`, meia-noite em UTC: a idade subia na véspera do aniversário | varredura por qualquer `new Date(...)` com um argumento, depois de corrigir outras três leituras em UTC | `a0d36cf`, Etapa 4 |
| Typecheck vazio | o script `typecheck` existia e passava em silêncio (`441a31e`) | rodava `tsc --noEmit` contra o `tsconfig.json` raiz, que tem `"files": []`: checava zero arquivos | ao apontar para `tsconfig.app.json`, surgiram 15 erros de tipo | `c43bdc1`, Etapa 0, ainda no PR #1 |
| Aviso não renderizado | o `DemoDataNotice` foi importado em `PredictiveAnalysis` e a validação achou a palavra no arquivo | a substituição do patch procurava um `CardContent` com classe que o arquivo não tinha, então o aviso nunca apareceu na tela | conferência no navegador, não no código | `451abef`, Etapa 1, no PR #2 |
| Contraste só nos tokens | os tokens `--brand-*` foram medidos e passavam, e o CLAUDE.md passou a dizer "os valores atuais foram medidos e passam" | os componentes pintavam com cores fixas do Tailwind, fora dos tokens: 47 falhas de contraste em quatro rotas; e uma das razões anotadas estava errada (`--brand-yellow`: 6,19:1 escrito, 5,08:1 medido) | varredura do axe rota a rota, com a cor computada | `5a72ea7`, Etapa 3 |

**Um caso a mais, da própria Etapa 4, que não nasceu de correção.** Na visão Dia da Agenda, a
comparação entre semanas mostrava "+100%" sempre que a semana anterior não tinha atendimento
— no total e em cada tipo, qualquer que fosse o número da semana atual. Dois commits desta
etapa passaram perto do selo sem vê-lo. O `a0d36cf` corrigiu as datas das semanas e registrou
o resultado como "3 → 2, −33%, com Atendimento Família 0 → 1"; ao lado desse "0 → 1", o código
daquele commit calcula o selo "+100%", e a mensagem transcreve a linha sem ele. O `9cbeb7d`
criou o estado "sem base de comparação" para os cartões do mês, no topo do mesmo arquivo. O
selo apareceu no commit 7 (`7039784`), ao reler a Agenda para pôr o aviso, e passou a dizer
"sem base". Mesma forma: a checagem conferiu o número que tinha sido corrigido, e não o que
estava ao lado dele.

**E o ciclo do Ver PEI** (achado 1, destaque): a correção da onda 2 (`338ed54`) tirou o
diagnóstico de Ana Carolina do diálogo e deixou a professora regente dela como responsável pelo
plano de qualquer estudante, até `bd93507`. A instância saiu; a pessoa vinculada a ela ficou.

**O padrão.** Nenhum dos quatro é descuido na parte corrigida: a idade passou mesmo a ser
calculada, o script de tipo existia, o aviso estava importado, os tokens passavam. O defeito
estava a um passo de distância — na leitura da entrada, no alvo do comando, no ponto de
renderização, no uso real da cor —, e a verificação parou no passo que tinha sido tocado.

**O que desmontou cada um foi medir o efeito, de fora:** a idade exibida com o relógio na
véspera, a contagem de arquivos checados, o aviso visível na tela, a cor computada no
navegador. Essa é a regra que as Etapas 3 e 4 foram deixando no CLAUDE.md — contraste medido
da cor computada, estouro medido por `scrollWidth`, dado sensível procurado por vocabulário —,
e este achado é a razão comum a todas: **a checagem tem de olhar para onde o usuário olha, não
para onde o código foi alterado.**

---

### 7. Resultado parcial que parece completo: a varredura que não vê o que procura (Etapas 1 a 4)

**Qualificação:** o autor classificou este como o achado mais importante da série, porque
reclassifica resultados anteriores. O achado 1 mostra que a busca por vocabulário pega o que a
leitura não pega; este mostra que a busca também precisa ser verificada.

> **O modo de falha não foi zero. Foi resultado parcial que parece completo.**
>
> Nenhuma das buscas afetadas devolveu zero. Todas devolveram parte do que deviam, e a parte que
> faltava era a das formas acentuadas. Um zero por defeito da ferramenta chama atenção: quem
> procura um termo que sabe existir e não acha desconfia. Uma saída com resultados não chama:
> lê-se como a lista completa, e nada nela distingue "não há mais" de "a busca não vê o resto".
> Foi por isso que as buscas passaram.
>
> A primeira formulação deste achado, na conversa, dizia o contrário — "31 varreduras retornaram
> zero por defeito da ferramenta". O número era meu, contado errado (ver **O número 31**), e o
> modo de falha também estava errado. O controle positivo da regra do CLAUDE.md pega os dois: um
> termo que se sabe existir e falta na saída denuncia tanto o zero quanto o parcial.

**O defeito, em duas formas.** No shell das sessões (Git Bash no Windows, com `LANG` vazio), o
`grep` trabalha com bytes, e letra acentuada tem dois bytes em UTF-8.
1. **Classe entre colchetes:** `[áa]` casa o "a" e nunca o "á".
2. **`-i` com letra acentuada:** só letras ASCII trocam de caixa. `grep -i "licença"` casa
   "Licença" e não casa "LICENÇA".

Acento escrito fora de colchete, na caixa em que está no texto, casa normalmente.

| Comando | Resultado |
|---|---|
| `printf 'eficácia' \| grep -cE "efic[áa]cia"` | 0 |
| `printf 'João' \| grep -cE "\bJo[ãa]o\b"` | 0 |
| `printf 'eficácia' \| LC_ALL=C.UTF-8 grep -cE "efic[áa]cia"` | 1 |
| `printf 'LICENÇA' \| grep -ci "licença"` | 0 |
| `printf 'LICENÇA' \| LC_ALL=C.UTF-8 grep -ci "licença"` | 1 |

**Quantas buscas, e o que cada uma deixou de ver.** O transcript das Etapas 0 a 4 tem 364
comandos Bash distintos com `grep`. Em 10, o padrão tem classe de caractere acentuada; em 3, `-i`
com letra acentuada escrita no padrão. Cada padrão foi testado de novo. Três das 10 funcionaram
por coincidência de bytes: duas usam faixas como `[A-Za-z_À-ú]`, que cobrem o segundo byte da
letra, e uma é a classe de emojis da Etapa 3, que casou corretamente no teste. As outras foram
refeitas com regex Unicode, no commit vigente na hora, e comparadas com o que o `grep` daquele
ambiente efetivamente casava:

| Quando (horário de Brasília) | Busca | Commit vigente | Linhas que a busca correta acha | Linhas que o `grep` casou | O que não viu |
|---|---|---|---:|---:|---|
| 13/09, 15h47, Etapa 1 | vocabulário de IA e predição: `intelig[eê]n`, `predi[cçt]`, `confian[cç]a`, `acur[aá]cia`, `precis[aã]o`, `efic[aá]cia` | `85fb601` | 20 | 15 | "% eficácia" e "taxas de eficácia" no `BenchmarkingPanel`; "eficácia terapêutica" nos riscos |
| 14/09, 19h38 e 19h40, Etapa 2 | nome próprio de pessoa real: `cecy\|patr[ií]cia` | `f756b12` | 7 | 7 | nada: "cecy" casava o nome completo |
| 16/09, 10h32, Etapa 4 | saúde nas telas de gestão, com `-i` e acento no padrão | `a0d36cf` | 36 | 36 | nada: não havia forma acentuada em caixa alta |
| 16/09, 11h20, Etapa 4, commit 7 | nomes de aluno no cenário de Gestão: `Jo[ãa]o`, `Patr[ií]cia` (a listagem de nomes de 11h07, com classes de maiúsculas e minúsculas acentuadas, tinha o mesmo alvo e não foi refeita à parte) | `7039784` | 14 | 12 | "João", duas vezes, em Gestão > Relatórios |
| 16/09, 11h10, Etapa 4, commit 7 | vocabulário: `prev[êe]`, `confian[çc]a`, `intelig[êe]ncia` | `7039784` | 60 | 58 | "prevê-se" e "percentuais de confiança" no `PredictiveAnalysis` |
| 16/09, 19h02, depois do merge | primeira passada do vocabulário de previsão | — | — | — | pega antes do commit, como descrito abaixo |

As outras duas buscas com `-i` e acento foram uma varredura de saúde só na aba Equipe (16/09,
8h31), contida na de 10h32, e uma consulta ao próprio BACKLOG. O que as buscas não viram foi
corrigido em `0c2be34`, exceto "eficácia terapêutica", que descreve a consequência de um risco e
ficou pelo critério daquele commit.

**O número 31.** Numa mensagem de andamento desta sessão, falei em 31 buscas afetadas. A contagem
incluía corpos de heredoc com colchetes e entradas duplicadas do log, e contava comandos, não
buscas. Não é o número de buscas afetadas; o número é o da tabela acima.

**O que isto reclassifica.**
- **A limpeza de "IA" da Etapa 1 fica registrada como incompleta, por duas causas separadas.**
  A lista de termos foi dada pelo autor na mensagem de 13/09/2026, 15h45 — "IA, Inteligência,
  predi, confiança, algoritmo, machine learning, preciso, acurácia, eficácia" —, e o `grep` foi
  montado por mim a partir dela, com os colchetes acentuados.
  - **Causa menor, a ferramenta.** A busca devolveu 15 das 20 linhas que devia. "Confiança IA"
    foi pega pela outra parte do mesmo comando, `\bIA\b`; as três linhas de "eficácia" não
    foram, e "% eficácia" continuou na ficha do aluno até `0c2be34`.
  - **Causa maior, a lista.** "prevê-se", "Probabilidade", "chance de melhoria", "Encontramos
    156 casos similares" e "taxa de sucesso" não contêm nenhum termo da lista, com ou sem acento
    ("prevê-se" tem acento, mas "predi" não o casaria de qualquer forma). Nenhuma ferramenta os
    acharia com aquela lista. O autor registra esta causa como sua. É a do achado 1: procurar
    pelos termos já conhecidos em vez do vocabulário do domínio.
  - **A mesma causa, fora do `grep` e fora da Etapa 1:** a busca da onda 2 (`338ed54`) procurou
    os termos do caso conhecido e não o nome da professora regente da aluna, que ficou no Ver
    PEI até `bd93507`. Ver o destaque no achado 1.
- **O "8 → 0" de nomes na tabela da Etapa 4** só vale a partir de `0c2be34`.
- **As varreduras de dado de saúde por vocabulário não perderam nada.** As da terceira onda do
  achado 1 não usaram classe acentuada nem `-i` com acento; a da quarta onda usou `-i` com
  acento e, refeita no commit vigente, casou as mesmas 36 linhas.

**Como foi pega.** Na primeira varredura do `Fix:` `0c2be34`, a linha 83 do `BenchmarkingPanel`
apareceu — por conter "probabilidades" — e a linha 112, "% eficácia", não. Uma linha que se
sabia existir e faltava na saída foi o sinal. A varredura foi refeita em Node, com regex
Unicode, e a de nomes também: foi aí que "João" apareceu.

**Consequência para os registros.** O README e o BACKLOG da Etapa 4 diziam que o cenário de
Gestão não nomeava aluno. Até `0c2be34`, não era verdade. A tabela de resultado da Etapa 4
passa a dizer isso.

**Regra, aprovada pelo autor e no CLAUDE.md**, em "Verificação obrigatória", com o texto dele:
toda varredura inclui um controle positivo, uma ocorrência que se sabe existir e precisa aparecer
na saída; classe de caractere com acento não casa a letra acentuada neste ambiente, e o caminho é
script com regex Unicode; e `grep -i` não muda a caixa de letra acentuada, o que vale para
qualquer busca por termo em maiúsculas em código escrito em português. É a forma do achado 6
aplicada à ferramenta de verificação: a checagem confirmou que o comando rodou, não que ele
casava.

**Como a recontagem foi verificada.** O script de reexecução também errou duas vezes antes de
valer: a primeira emulação do `grep` quebrava o `\b` e as classes, e a segunda comparava com um
objeto em vez de uma expressão, casando quase tudo. Os controles que desmontaram os dois erros
foram casos conhecidos: "Patricia", sem acento, tinha de casar; "eficácia" e "LICENÇA", não.

**Mesma família, sem `grep` nenhum: o `TS6192` (Etapa 6).** A sonda de identificadores sem uso
da Etapa 5 filtrava a saída do compilador por `TS6133|TS6196`. O TypeScript emite um terceiro
código para o caso de **toda** a declaração de import estar sem uso, `TS6192`, e ele não estava
na lista. Três declarações escaparam — `Tabs` em `ObservationDetailDialog`, `Select` em
`PresentationModeDialog` e `Dialog` em `StudentDetail` —, e a Etapa 5 registrou "32 -> 2" quando
o certo era "32 -> 5". Corrigido na tabela da Etapa 5 e removidas em `0605cf4`.

Não é defeito de ferramenta: o compilador reportou os três. É a mesma causa de sempre, **lista
em vez de classe** — a busca cobriu os códigos que eu conhecia, e não a classe "identificador
declarado e não lido". Vale a regra do achado 1 aplicada a saída de ferramenta: filtrar por
categoria, não por enumeração do que já se viu.

**E uma afirmação minha que caiu junto.** Registrei na Etapa 5 que os dois `_props` de
`ui/calendar.tsx` "precisariam de `argsIgnorePattern`". Errado por duas razões, as duas
medidas: `argsIgnorePattern` é opção do ESLint e não do `tsc`; e a isenção do prefixo `_` no
`tsc` vale para **parâmetro**, não para elemento rest em desestruturação. Testado lado a lado:
`(_param: number) => 1` não é acusado, `({ ..._rest }) => 2` é acusado com `TS6133`. A correção
não era padrão de ignore nenhum: era apagar a desestruturação inútil.

**Quarta forma registrada neste achado — as duas do `grep`, o `TS6192` e esta —, na Etapa 9: a
lista fixa dentro de um controle.** O `CONTROLE: a semente inteira passa nos esquemas`, escrito
na Etapa 7 para garantir que o estado de demonstração atravessa a validação de forma do
carregamento, enumerava **sete coleções pelo nome**. Na v4 a
semente passou a ter onze: as quatro do PEI entraram e o controle continuaria verde sem olhar
para nenhuma delas — e um esquema de PEI com defeito descartaria o plano inteiro a cada recarga,
em silêncio, que é exatamente o que esse controle existe para impedir.

Foi pego no dia em que teria falhado, e não por perspicácia: a v4 obrigou a trocar `gravar(3,`
por `gravar(4,` em sete testes, este entre eles, e a lista de sete coleções estava na linha
seguinte. Agora o controle enumera `Object.keys(semente())` e exige 11. É a mesma causa dos
casos acima — **lista em vez de classe** —, pela primeira vez dentro de um instrumento de
verificação em vez de dentro de uma busca. O instrumento que confere o estado inteiro precisava
perguntar ao estado quantas coleções ele tem, em vez de carregar a resposta de quando foi
escrito.

**Quinta forma, na sessão de fechamento (03/10/2026): uma regra de verificação escrita para o
instrumento conhecido em vez da classe.** A regra invertida da Etapa 9 — "zero inesperado é falha
de verificação, não sucesso" — nomeava a fotografia de superfície, e vivia na seção daquela etapa
sem nunca ter entrado no CLAUDE.md (conferido em 03/10). Quando o zero veio de um painel
de PR (`checks: 0 passando, 0 falhando, 0 pendentes`, lido segundos depois de criar o PR), a regra
não foi aplicada: o enunciado falava de outro instrumento, e o agente afirmou três vezes que o
repositório não tinha CI enquanto 36 execuções verdes estavam no GitHub (achado 19). **É a mesma
causa dos quatro casos acima** — lista em vez de classe —, agora na camada que devia proteger
contra ela: a regra. Generalizada por decisão do autor para "zero é ausência de resultado, não
resultado de ausência", valendo para qualquer instrumento.

---

### 8. O instrumento que não media o que dizia medir (Etapa 5)

Dois defeitos do arreio de regressão, os dois achados em uso, e nenhum deles no código do
aplicativo. Ficam registrados porque a etapa inteira depende do instrumento: uma fotografia
errada teria produzido caça a bug em código correto, ou pior, um "está tudo igual" falso.

**Primeiro — o rascunho que a biblioteca pendura no `body`.** O Recharts mantém um
`span#recharts_measurement_span` fora do `#root`, em `y = -20000`, guardando o último rótulo
que mediu. Tem layout, entra no `innerText` e virava número na medida `numeros`. Como o
Orçamento é a última superfície da lista, a passagem que capturou a linha de base não o via e
toda passagem posterior via: **25 superfícies acusaram diferença num commit que não tinha
tocado em nenhuma delas.**

O que separou instrumento de código foi um teste isolado: guardar a alteração, voltar a
árvore ao commit anterior, conferir pelo módulo servido que era mesmo o estado antigo, e
medir de novo. **As mesmas 25 diferenças apareceram.** O que mudou não era o código.

**Segundo — a largura da janela.** A medida `numeros` inclui os rótulos de eixo dos gráficos
("R$ 0k", "R$ 150k", "R$ 300k"), e o Recharts escolhe quantos cabem conforme o espaço. A
fotografia depende da largura, e isso não estava escrito. Apareceu quando a medição migrou
para uma aba que tinha ficado em 743 px dos testes de axe. Corrigido do mesmo jeito: a
largura entra na fotografia, e a comparação entre larguras diferentes é **recusada**, em vez
de devolver uma lista de superfícies que se lê como regressão.

**A forma comum aos dois:** o instrumento produzia um número que parecia resultado. É a mesma
família do achado 7 — resultado parcial que parece completo —, agora do lado de quem mede.

> **Destaque — o terceiro caso, e o mais perto de passar (Etapa 6): a flag que não liga.**
>
> `--strict` na linha de comando **não anula** um `"noImplicitAny": false` escrito no
> `tsconfig`. O `tsconfig.app.json` declarava `strict`, `noImplicitAny`, `noUnusedLocals` e
> `noUnusedParameters` como `false`, explicitamente. Acrescentar `"strict": true` sem apagar
> essas linhas não liga nada.
>
> **Sem esse achado, a Etapa 6 teria terminado com o typecheck verde, a flag "ligada" no
> arquivo e nenhuma verificação nova.** Seria o typecheck vazio da Etapa 0 outra vez — aquele
> que rodava sobre nenhum arquivo e passava —, por outro mecanismo, dois meses depois. A
> mesma forma: uma verificação que não verifica, e cuja saída é indistinguível da saída de uma
> que verifica.
>
> **O que revelou foi o CONTROLE POSITIVO FALHANDO.** Plantei três erros que as flags deviam
> pegar; dois foram acusados e o do `any` implícito, não. Se eu tivesse aceitado o verde do
> `npm run typecheck` como resposta, não haveria nada a notar. O controle positivo não serviu
> para confirmar o que eu já achava — serviu para derrubar.
>
> Daí a regra que entrou no CLAUDE.md nesta etapa: ao ligar uma opção de compilador ou de
> lint, o controle positivo é sobre a **opção**, não sobre o código. Cada um dos quatro lotes
> da Etapa 6 plantou o erro que a sua flag devia pegar, depois de gravá-la no `tsconfig`.

> **Destaque — o quarto caso, e o terceiro mecanismo da mesma forma (Etapa 7): o fuso.**
>
> A suíte de datas nasceu verde: 12 asserções, 12 passando. As comparações com a conta
> defeituosa antiga, porém, estavam dentro de `if (offset > 0)` — e o defeito só existe a oeste
> de Greenwich, porque é ali que `new Date('2025-11-19')`, lido como UTC, cai no dia 18. A
> máquina de desenvolvimento é UTC−3, onde o defeito existe. **O CI roda em UTC, onde ele não
> existe.** Lá a condicional é falsa, nenhuma comparação executa, e a suíte escrita para travar
> o defeito de data entraria no repositório sem exercitar um caso sequer.
>
> Medido, rodando com `TZ=UTC`: **12 asserções verdes, 0 casos exercitados.** A correção é o
> pino no `vitest.config.ts` (`env: { TZ: 'America/Sao_Paulo' }`), as condicionais apagadas e um
> teste que trava o próprio pino (`getTimezoneOffset()` igual a 180, `new Date('2025-11-19')`
> caindo no dia 18). Conferido depois com `TZ=UTC` por fora: o pino vence a variável de
> ambiente, e a suíte dá o mesmo resultado nos dois ambientes.
>
> É a mesma forma do typecheck vazio da Etapa 0 e da flag que não liga da Etapa 6 — verificação
> cuja saída verde é indistinguível da saída de uma verificação que verifica —, agora pelo
> terceiro mecanismo: **o ambiente em que a verificação roda**. Os dois primeiros eram a
> ferramenta configurada para não olhar; este é a ferramenta olhando onde não há o que ver.
> Daí a regra do CLAUDE.md sobre asserção dentro de condicional.

### 9. Uma correção proposta que não cobria o defeito que dizia cobrir (Etapa 5)

Achado do defeito acima, e é metodológico.

Diante do rascunho do Recharts, o autor propôs a correção de classe: acrescentar ao controle
de estabilidade uma terceira passagem com as superfícies em **ordem inversa**, exigindo
resultado idêntico, "porque dependência de ordem aparece na hora". O raciocínio é bom e a
regra é boa. **Ela não pega este defeito, e isso foi medido.**

O teste: desligar a exclusão do rascunho e rodar o controle de estabilidade. As três passagens
continuaram concordando. Em qualquer ordem o rascunho acaba guardando algum rótulo, então a
ordem não o revela. O que pega é outra regra — descartar qualquer filho direto do `body`
estacionado fora da tela —, conferida nos dois sentidos: com ela ligada a rota inexistente
mede `404`; desligada, mede `404 20`.

A passagem em ordem inversa ficou, porque cobre outra coisa: resíduo cujo **conteúdo** depende
de qual superfície veio antes. As duas coberturas são diferentes e nenhuma substitui a outra,
e o README diz isso.

**O que o achado registra** não é que a sugestão estava errada. É que uma correção proposta foi
**testada isoladamente contra o defeito que dizia cobrir**, em vez de aceita porque o
raciocínio convencia — e não sustentou. É a terceira vez nesta série que uma correção do autor
foi verificada e não se sustentou, e as três só apareceram porque alguém foi medir.

### 10. Mensagem de commit com verificação que não verificava (Etapa 5)

No commit que removeu as duplicatas sem rota, escrevi como prova: "o `App.tsx` servido pelo
Vite não tem mais `pages/Reports` nem `pages/ComplexityAnalysis`". A frase é verdadeira e
**não é prova**: o módulo servido passa pelo esbuild, que elimina import sem uso, então no
commit anterior o arquivo em disco tinha os dois imports e o módulo servido já não tinha. A
checagem não distinguia antes de depois.

Achado ao medir a linha de base no commit anterior e ver `temReports: false` onde tinha de ser
`true`. Trocada pela checagem que distingue — `/src/pages/Reports.tsx` deixa de ser servido
como módulo, com `/src/pages/Dashboard.tsx` de controle positivo —, e a mensagem foi
corrigida antes do push, com a correção registrada no próprio commit.

É o par do que já tinha acontecido na Etapa 4, quando repeti "31 varreduras retornaram zero"
como se fosse medida. Mensagem de commit com verificação falsa é pior que mensagem sem
verificação nenhuma: a segunda não afirma nada, a primeira afirma o que não checou.

**O achado evitou a própria repetição, uma etapa depois.** No lote 4 da Etapa 6 eu ia conferir
o módulo servido procurando `SectorProps` — e a busca deu `false`, porque o esbuild apaga
import e anotação de tipo. Era exatamente a mesma checagem inválida: daria `false` nos dois
estados, antes e depois. Troquei por `?? 0`, que sobrevive à compilação, e a checagem passou a
distinguir.

É a primeira vez nesta série que um achado anterior **evitou** a repetição em vez de explicá-la
depois. Vale registrar porque é o que se espera de um registro de achados: que a segunda vez
custe menos que a primeira.

### 11. A verificação com defeito antes do código (Etapa 7)

Três casos da mesma etapa, nenhum deles no aplicativo. Ficam registrados porque uma etapa de
testes é uma etapa inteira de ferramentas de verificação: se o defeito está nelas, tudo o que
elas dizem passa a não valer.

**Antes dos outros dois — o controle que não foi plantado, no planejamento.** Ao propor a varredura de
rotas na Parte B, rodei-a, deu 0 órfãos, e plantei um destino quebrado para conferir: continuou
dando 0. O `replace` mirava `navigate('/alunos/novo')` em `Students.tsx`, que usa `<Link>` — o
trecho não existia no arquivo escolhido, a quebra nunca entrou, e eu li o zero como confirmação.
É a mesma família do controle positivo incidental do `useSidebar` (achado 7): o controle que não
está lá, e cuja ausência se parece com aprovação. A regra que entrou no CLAUDE.md por causa
disto é que o controle plantado precisa **asseverar que a quebra foi plantada**, contando as
ocorrências e exigindo exatamente uma.

**Primeiro — a mutação achou defeito no TESTE, não no código.** O teste do grafo de rotas lê o
código-fonte e exige que todo destino de `<Link>`/`navigate()` resolva para uma `<Route>`
declarada. Passava, com controle próprio de que enxergava rotas e destinos de verdade. Ao
plantar a mutação — apagar `<Route path="/alunos/novo">` de `App.tsx` —, **a suíte continuou
passando**. A regra de casamento deixava segmento literal casar segmento de parâmetro, então
`/alunos/novo` passava a resolver contra `/alunos/:id` e nada ficava órfão. No aplicativo, esse
destino abriria a ficha do estudante com `id = "novo"`.

O teste existia exatamente para pegar essa classe de erro: rota de navegação apagada. Sem a
mutação, ele teria ficado no repositório dando falso negativo para o único defeito que era sua
função detectar, e o verde dele seria lido como cobertura. **É o caso que justifica a camada 2
inteira** — a de plantar o defeito no código de produção e exigir que a suíte reprove. Camada
1 (a suíte roda e o vazio reprova) e camada 3 (asserções de falsificação dentro de cada
arquivo) não pegariam isto: as duas olham para o teste a partir do teste.

Corrigido: segmento literal só casa segmento literal igual; segmento de parâmetro do destino só
casa segmento de parâmetro da rota. Com um teste de controle que fixa a distinção. Medido
depois, com o teste de rotas rodando sozinho: apagar `/alunos/novo`, `/observacoes/nova` ou
`/alunos/:id` do `App.tsx` reprova nos três casos.

**Segundo — o código de saída lido depois de um cano.** O controle da camada 1 pergunta se a
suíte reprova quando não encontra teste nenhum. Rodei `npm test | tail` e li `$?`: **zero**,
que é a saída do `tail`, não a do `npm`. Quase registrei "o controle não funciona" e segui.
Medido de novo sem cano: zero teste encontrado devolve 1, e o controle funciona.

**A forma comum.** É a mesma família do achado 8 e do achado 10: o que falhou foi o
instrumento, antes do código, e em todos os casos a saída do instrumento defeituoso era
indistinguível da saída correta. A diferença aqui é o custo: numa etapa de testes, instrumento
defeituoso não produz um número errado — produz uma suíte inteira que ninguém tem motivo para
desconfiar.

#### A asserção de casamento único se pagou três vezes na mesma etapa

As duas coisas abaixo são o mesmo caso visto de dois ângulos, e por isso ficam juntas.

**A recontagem, 18 → 27.** Relatei ao autor "18 mutações, 17 acusadas" ao fechar o lote 5. Os
scripts ficaram guardados, e recontar por eles dá **27** — 4 na persistência e migrações, 3 nas
datas, 6 nos seletores, 5 no reducer, 3 nas rotas e 6 no fluxo. Uma das entradas que eu contava
(`toLocalISODate` de volta ao `toISOString`) estava marcada `extra: true` e o laço a pulava:
nunca rodou. A regra de contagem, que faltava, é: **entrada de mutação que foi plantada e
executada, contada por script.** Sem a regra, o número não era medida — e não era reproduzível
nem por mim.

**A mutação da rota abortando por indentação.** Na reexecução final contra a árvore pronta, a
mutação que apaga `<Route path="/alunos/novo">` casou **zero** vezes: o padrão do script tinha
12 espaços e o `App.tsx` tem 10. Era o mesmo trecho que, no lote 5, tinha revelado o defeito do
teste — ou seja, o resultado mais importante da etapa vinha de um script cuja entrada, nessa
forma, não casava nada. A asserção de `n !== 1` transformou isso em **"mutação NÃO plantada"**
em vez de um resultado. Refeita com o padrão correto e com duas rotas a mais, as três são
acusadas, com o teste de rotas rodando sozinho.

**A conta da etapa, então:** a mesma regra apareceu três vezes, duas pela ausência e uma pela
presença.

1. **No planejamento**, sem a asserção: o `replace` mirou arquivo errado, a quebra nunca entrou,
   e o zero da varredura foi lido como confirmação.
2. **No lote 5**, sem ela: a contagem das mutações virou um número que eu não conseguia
   reproduzir, e o script da rota carregava um padrão que não casava.
3. **No fechamento**, com ela: o abort impediu que "nada foi alterado, a suíte passou" virasse
   "o teste não pega".

Uma regra de três linhas que custa um `if` por script e pagou três vezes em uma etapa não é
disciplina: é a diferença entre registro e ficção. **E uma quarta vez, na Parte B da Etapa 8**,
fora de mutação: o medidor que conta destinos de navegação nasceu cego (o regex exigia dois
espaços onde havia um) e devolveu "2 sítios, 13 capturados" — números impossíveis. Foi o
controle plantado junto dele, com a asserção de que a quebra aparece, que disse "o medidor está
cego" antes de o número ser usado.

**Quinta e sexta vez, as duas na Etapa 9, e as duas pela mesma causa.** Na mutação do Ver PEI, a
âncora tinha dois espaços a mais: o bloco que ela mirava estava dentro do retorno antecipado. Na
mutação do botão de fechar, a âncora terminava em `\n` e o `ui/toast.tsx` é **CRLF** — o
repositório tem `core.autocrlf=true`, então o conteúdo versionado é LF e a cópia de trabalho no
Windows é CRLF, arquivo a arquivo. Nos dois casos a asserção abortou com "casou 0 vezes", e nos
dois a correção foi a mesma: **ler a âncora do arquivo em vez de escrevê-la de memória.**

Regra de contagem das seis: ocorrências registradas aqui e no achado 7 em que a asserção de
casamento único impediu um resultado falso — três na Etapa 7, uma na Etapa 8 e duas na Etapa 9.

### 12. Uma etapa verificando outra, nos dois sentidos (Etapa 8)

Dois casos da mesma etapa, espelhados. No primeiro, o investimento de uma etapa anterior pegou
defeito numa posterior. No segundo, uma etapa posterior achou buraco no instrumento de uma
anterior. Nenhum dos dois foi procurado.

**A prop `future` que o strict reprovou.** O commit 1 ligou `v7_startTransition` e
`v7_relativeSplatPath` no react-router 6, pela prop `future` do `BrowserRouter`. Ao subir para o
7, o typecheck reprovou: *"Property 'future' does not exist on type 'BrowserRouterProps'"*. No
7 os dois comportamentos são o padrão e a prop não existe mais. **Sem o strict da Etapa 6, ela
ficaria no `BrowserRouter` ignorada em silêncio, afirmando uma configuração que não acontece** —
e o código continuaria dizendo, a quem o lesse, que o roteador tinha flags ligadas. **É a
primeira vez na série que o investimento de uma etapa pegou defeito numa etapa posterior sem
ninguém procurar.**

**O `<Navigate>` que a suíte da Etapa 7 não via.** Ao medir o gatilho do open redirect, achou-se
que a varredura de rotas nunca contou `<Navigate to=>`. Contrafactual medido com o teste de rotas
da Etapa 7 e a suíte **inteira**: um redirecionamento apontando para `/gestao-antiga?tab=relatorios`
— rota que não existe — **passava com os 70 verdes**. Com a guarda de `321ab87`, reprova. **É a
primeira vez que uma etapa posterior encontrou buraco na suíte, e não no código.**

**A correção do autor, sobre o que valida uma suíte.** O autor tinha dito que o major passar com
os 70 verdes seria a validação da Etapa 7. Corrigiu-se: *não é. Verde não valida suíte; reprovar
quando deve, sim, e isso foram as mutações.* No upgrade do router, quem pegou alguma coisa foi o
typecheck, e os 70 verdes não disseram nada — nem sobre o router, nem sobre o `<Navigate>` que
eles não viam. A validação da suíte continua sendo o que ela reprova quando se planta o defeito.

### 13. A ferramenta de resolução de dependências quebrando por dentro (Etapa 8)

`npm install -D vitest@4.1.11`, no npm 11.5.2 da máquina:

```
npm error Cannot read properties of null (reading 'edgesOut')
    at #loadPeerSet (@npmcli/arborist/lib/arborist/build-ideal-tree.js:1314)
```

**Não foi conflito — seria um `ERESOLVE`. Foi defeito da ferramenta.** Pelo log, o gatilho é um
peer **opcional** de um pacote de **teste**: o `@testing-library/jest-dom` 7.0.1 declara
`vitest >= 0.32`, o que faz o npm avaliar `vitest@*` (o 5.0.1) e seguir os peers opcionais dele
(`@vitest/browser-playwright`, `@vitejs/devtools-*`), até encontrar um nó nulo. Trocar a faixa no
`package.json` e rodar `npm install` quebrou igual. O lockfile ficou intacto nas duas vezes.

O contorno aprovado foi separar quem gera o lockfile de quem instala a partir dele:

1. **Gerar** com o npm 11.19.1, fixado na versão exata: `npx -y npm@11.19.1 install`, com a faixa
   já trocada no `package.json`.
2. **Conferir o diff** do lockfile por alcançabilidade (achado 14 e o procedimento na Etapa 8).
3. **Instalar** com o npm da máquina, que não o gerou: `rm -rf node_modules && npm ci`. O lock
   tinha de provar que instala com um npm diferente do que o escreveu — e o `npm ci` também
   monta árvore, então poderia ter passado pela mesma resolução de peers. Não passou.
4. **A prova final é o CI do PR**, que roda `npm ci` com o npm do setup-node — um terceiro npm.

O 11.19.1 ainda avisou que os scripts de instalação de `@swc/core` e `esbuild` não estavam
cobertos pela política `allowScripts` dele. É mais uma razão para o `node_modules` final não vir
do npm que gerou o lock.

**E um número do próprio npm que não é o que parece.** O `npm ci` daqui relatou `added 600
packages`; o do CI, `added 541`. O lock tem **600 entradas**, e no disco ficaram **539** nesta
máquina — exatamente as instaláveis em `win32-x64` — e 541 no CI, as de `linux-x64-glibc`. Os
dois números do CI batem; o local, não: o `added 600` do npm 11.5.2 conta entradas do lock, e
não o que escreveu. A regra de contagem, então, é: **entradas do lock presentes no disco**, e
não a linha que o npm imprime. Os binários de plataforma (`@esbuild/win32-x64`,
`@rollup/rollup-win32-*`, `@swc/core-win32-x64-msvc`) explicam a diferença entre as duas
máquinas, e foram conferidos um a um.

Parece a família dos achados 8, 10 e 11 — a ferramenta falhando antes do código —, mas é do tipo
oposto, e a diferença importa. Naqueles, o instrumento devolveu saída **plausível e errada**, e o
perigo era ela ser lida como resultado. Aqui a ferramenta **quebrou alto**: não houve lockfile
meio escrito, nem árvore que parecesse certa. Falha barulhenta custa uma sessão; a silenciosa
custa o registro.

### 14. Condição de verificação escrita pelo nome em vez da propriedade (Etapa 8)

Para o commit do `vitest`, o autor escreveu a condição: *o diff do `package-lock.json` fica
restrito ao subtree do vitest (vitest e @vitest/\*). Se aparecer pacote fora desse subtree, pare.*

Medido: **18 caminhos fora de `vitest`/`@vitest/*`**. O trabalho parou, como a condição mandava.
Os 18 aparecem porque o lockfile é achatado: as dependências do próprio vitest moram em
`node_modules/<nome>`, não dentro de `vitest/`. **Nenhuma major do vitest caberia na condição
lida pelo nome.** A propriedade que importava era outra — *nada fora do fechamento de
dependências do vitest muda* —, e ela foi medida por alcançabilidade, com controle nos dois
sentidos: os 18 são exclusivos do vitest, nenhum é compartilhado, e nenhuma das 37 dependências
do aplicativo mudou.

O autor aceitou a leitura por subgrafo e registrou o erro como seu: **definiu a verificação pelo
nome dos caminhos, e não pela propriedade que queria garantir.** É a mesma família do achado 7 —
a varredura que procura pelas palavras do caso conhecido em vez da categoria —, agora numa regra
que o próprio autor redigiu. E a condição literal, se tivesse sido aplicada sem medir, teria
reprovado todo upgrade possível; se tivesse sido reinterpretada por quem executava, teria
deixado de ser verificação. Parar e medir a propriedade foi o que a manteve como verificação.

---

### 15. Um achado anterior prevenindo um caso que ainda não existia (Etapa 9)

**Qualificação:** é a primeira vez na série que um achado já registrado impediu um defeito que
nunca chegou a existir. As quatro ondas do achado 1 foram registradas depois do fato: cada uma
começou com dado fictício aparecendo sob o nome de um estudante e seguiu com uma busca pelo mesmo
padrão em outras telas. Aqui não há ocorrência para corrigir, porque o código que a produziria
não foi escrito.

**A decisão.** A `migrateV3ToV4` acrescenta as quatro coleções do PEI ao estado já gravado no
navegador de quem usou o sistema. O precedente da casa era a `migrateV1ToV2`, que preencheu as
coleções novas com as fixtures de demonstração, as mesmas que um navegador novo recebe. Seguir o
precedente teria escrito, nesse estado gravado, um PEI completo atribuído ao estudante de `id`
'1': perfil, pontos fortes, desafios, estilo de aprendizagem, adaptações curriculares e
necessidade de apoio humano. Um PEI é um documento que **afirma coisas sobre uma criança
nomeada**, e isso é a classe do achado 1 — conteúdo fictício exibido como se fosse o registro
daquele estudante —, com a diferença de que a origem seria a migração, e não texto fixo numa
tela. As quatro coleções entram vazias. Navegador novo continua recebendo o PEI da semente,
porque ali não há registro de ninguém para contaminar.

**O precedente não foi corrigido, e isso fica registrado.** A `migrateV1ToV2` carrega a mesma
classe de risco em forma mais leve: os atendimentos e as avaliações que ela injeta também
apontam para estudante por `id`, e quem tiver renomeado o estudante '1' — o cadastro é editável
— passaria a ver esses registros atribuídos ao nome novo. A diferença entre os dois casos é o
peso do que o registro afirma — data e tipo de um atendimento contra perfil e necessidades de uma
criança —, não a existência do risco. Mexer na v1->v2 agora mudaria o resultado de uma migração
que ainda pode rodar sobre estado gravado na versão 1: **é decisão do autor, e está aberta.**

**O que o caso mostra sobre a forma do registro.** O achado 1 só pôde agir aqui porque está
escrito como classe — "dado fictício atribuído a estudante nomeado" — e não como a lista das
sete telas em que apareceu. Registro escrito pela lista do que já aconteceu não alcança o caso
seguinte. É a distinção do achado 7 vista do outro lado: lá a lista deixou passar o que a busca
devia achar; aqui a classe pegou o que ninguém tinha procurado.

**A gravidade não é a mesma, e é isso que decidiu.** O autor determinou em 02/10/2026 que a
`migrateV1ToV2` **não** será mexida, aceitando a leitura da classe de risco: atendimento e
avaliação injetados são registros de rotina — data, tipo, profissionais —, enquanto um PEI é
documento que afirma coisas sobre uma criança nomeada: perfil, desafios, necessidade de apoio.
Mudar o resultado de uma migração que ainda pode rodar sobre estado v1 real custa mais do que o
risco que ela carrega. **Fica aberta, com a diferença de gravidade registrada**, e não como
dívida esquecida: se um dia a v1 deixar de poder rodar, o custo muda e a decisão pode mudar com
ele.

A distinção vale como critério, e não só para este caso: a mesma classe de defeito pede respostas
diferentes conforme **o que o registro afirma sobre a pessoa**. É o critério que já estava no
achado 1 — "o que decide é ser atribuído a pessoa nomeada" — com um segundo eixo: quanto o
registro afirma.

---

### 16. A declaração escrita pelos chamadores, e não pelos montadores (Etapa 9)

**Qualificação:** o defeito está no mecanismo que existe para proteger contra ele. A regra
invertida desta etapa manda declarar, antes do commit, quais superfícies e quais medidas vão
mexer; a declaração é a verificação. Ela saiu errada pela causa do achado 7 — enumerar o que já
se conhece em vez de perguntar pela classe.

**O que aconteceu.** O commit que trocou a fonte do progresso declarou movimento de `numeros` em
**duas** superfícies, `/alunos` e `/alunos/1`. Mexeu em **três**: `/` também, porque o Dashboard
monta o mesmo `StudentCard` da listagem. A declaração foi escrita a partir dos sítios que **chamam
o seletor** `studentProgress` — dois arquivos, achados por busca — e não dos sítios que **montam o
componente** que o chama, que são três rotas. Medido número a número depois: 60 -> 50 em `/` e
`/alunos`, e em `/alunos/1` o 60 -> 50 mais o "1" de "Revisões do PEI: 1" entrando; nada além do
previsto no conteúdo, só uma superfície a mais do que o previsto na lista.

**A regra que fica, ditada pelo autor:** *declare pelos montadores do componente, não pelos
chamadores do seletor.* Está no CLAUDE.md, no bloco de verificação.

**O que o caso mostra sobre a regra invertida.** Declarar duas e mexer três expôs o **método**, e
não só o número. Se a declaração tivesse listado as três — por sorte, ou por eu ter aberto o
Dashboard antes —, o commit passaria com a declaração batendo com a medida, e o raciocínio
errado continuaria em uso para a próxima tela. Foi a diferença entre o declarado e o medido que
tornou visível *como* a lista tinha sido montada. Uma verificação que só compara números não
acha isso; uma que compara a **previsão** com a medida, acha.

**É a família do achado 7** — lista em vez de classe — e, como o achado 14, numa regra escrita
por quem verifica, não numa busca no código: lá a condição do lockfile foi definida pelo nome dos
caminhos em vez da propriedade; aqui a declaração foi definida pela lista de chamadores em vez da
classe "rotas que montam este componente".

---

### 17. A semente plausível que não discriminava (Etapa 9)

**Qualificação:** quatro vezes na mesma etapa uma mutação deixou de reprovar, e nas quatro o
buraco não estava no teste — estava nos **dados** de teste. A camada 2 (mutação) existe para
dizer se a suíte reprova quando deve; o que ela disse aqui foi outra coisa, e mais fina: que a
suíte não tinha com o que reprovar.

| Mutação que passou | Por que a fixture não distinguia | O que foi acrescentado |
|---|---|---|
| média dos objetivos → **máximo** | `avl-1` tem **um** objetivo, e com um só média, máximo e mínimo dão o mesmo número | casos com dois e três objetivos, onde as três contas se separam |
| metas **do plano** → todas as metas do sistema | a semente tem **um** plano, e todas as metas são dele | um segundo plano, de outro estudante, gravado pelo `localStorage` |
| `kind` da evidência ignorado | nenhum id se repete entre coleções: `obs-1` e `avl-1` nunca colidem | o mesmo id `'x'` numa observação e numa avaliação, com metas diferentes |
| janela de **7 dias** → todos os futuros | o teste tinha **um** atendimento futuro | um segundo, daqui a 30 dias, que separa os dois blocos |

**A regra que fica:** quando a mutação de uma regra não reprova, a primeira pergunta é se os
dados de teste distinguem o certo do errado — antes de concluir que falta asserção, e muito
antes de concluir que a mutação é inofensiva.

**A atribuição, registrada pelo autor.** O desenho da semente foi aprovado por ele em várias
etapas, e em nenhuma delas alguém notou que **plausível e discriminante são propriedades
diferentes**. Uma fixture plausível é feita para parecer um caso real: uma avaliação com um
objetivo, um plano por estudante, ids que não colidem, uma agenda curta. Uma fixture
discriminante é feita para que implementações erradas divirjam da certa. As duas intenções não
se opõem, mas também não se implicam — e a segunda nunca tinha sido pedida, porque até a Etapa 7
não havia suíte, e até a Etapa 9 as mutações caíam em código cujo comportamento a semente já
separava.

**Por que não apareceu antes.** As 30 mutações anteriores miravam persistência, migração,
seletores de data e grafo de rotas: código em que um registro basta para distinguir o certo do
errado. As 43 desta etapa miram **agregação e filtragem** — média, janela, pertencimento,
tipo —, e agregação só se verifica com mais de um elemento. A classe do defeito mudou com a
classe do código.

---

### 18. O registro envelhece em silêncio (varredura de coerência, 03/10/2026)

**Qualificação:** nove etapas de registro nunca tinham sido lidas de ponta a ponta procurando
contradição. A varredura — pedida pelo autor como sessão de fechamento — leu as 2.633 linhas do
BACKLOG e as 589 do README **medindo cada número que dava para medir**. São **20 itens
distintos**, enumerados um a um abaixo. Nenhum deles é defeito de código: são defeitos do registro
sobre o código.

**A regra de contagem (decisão do autor, 03/10/2026): nesta tabela o item é a unidade e a classe
é o rótulo.** Item que cai em duas classes conta **uma vez**, com as duas classes citadas. O que
se mede é quantas incoerências existiam, não quantas vezes elas se encaixam em classes — contar
por classe faz o total crescer com a granularidade da taxonomia, que é o oposto de uma medida.

| Classe | Rótulos | O pior exemplo |
|---|---:|---|
| README e BACKLOG se contradizendo | 5 | o README dizia "o formato gravado está na **versão 3**" com a tabela do próprio README dizendo v4, 300 linhas abaixo |
| Afirmação que ficou falsa — resultado, premissa ou condição | 12 | "as setas do modo apresentação… **doze slides**", quando o número passou a vir do plano |
| Número sem a regra que o produz | 5 | "165 classes de cor fixa", que a Etapa 5 já tinha declarado irreproduzível e o README repetia |
| Pendência resolvida com o registro intacto | 3 | "As três chaves acentuadas que ficaram, e por quê", resolvidas na v4 e ainda escritas no presente |

Os rótulos somam **25** em **20 itens**: cinco itens carregam dois rótulos, e estão marcados com
**(2)** na lista.

### Os 20 itens, um a um

| # | Item | Classe(s) | Corrigido em |
|---:|---|---|---|
| 1 | README: "o formato gravado está na versão 3", com a tabela do próprio README em v4 | contradição | `1110e22` |
| 2 | README: "Gestão, desempenho e apresentação continuam com conteúdo fixo", contra a tabela de implementação do mesmo arquivo | contradição | `1110e22` |
| 3 | README: "165 classes de cor fixa", número que a Etapa 5 já declarara sem método **(2)** | contradição + número sem regra | `1110e22` |
| 4 | README sem os dois defeitos de acessibilidade em aberto que a Pendência 2 registra | contradição | `1110e22` |
| 5 | CLAUDE.md: escopo da suíte sem as cinco telas da Etapa 9, que o README já incluía | contradição | `1110e22` |
| 6 | Achado 1: "ainda mostram conteúdo fixo", apontando para a seção "Ainda aberto" renomeada para "Fechado na Etapa 9" | afirmação falsa | `310f195` |
| 7 | Achado 3: "o modo apresentação tem doze slides" | afirmação falsa | `310f195` |
| 8 | Etapa 4, em dois lugares: a ressalva do critério de aceite, com o Desempenho em 85% e a ficha em 60% **(2)** | afirmação falsa + pendência resolvida | `310f195` |
| 9 | Etapa 5: "As três chaves acentuadas que ficaram, e por quê" **(2)** | afirmação falsa + pendência resolvida | `310f195` |
| 10 | Etapa 5: o inventário "17 arquivos acima de 400 linhas", certo no total e errado em quatro linhas **(2)** | afirmação falsa + número sem regra | `310f195` |
| 11 | Etapa 7: "as 18 mutações desta etapa", que o achado 11 do mesmo arquivo já corrigira para 27 | afirmação falsa | `310f195` |
| 12 | Etapa 9: o item de plano "o sistema não possui entidade PEI", já executado | afirmação falsa | `310f195` |
| 13 | Etapa 9: "junto vai o `z.infer`", contra "O que a etapa NÃO fez" 120 linhas abaixo | afirmação falsa | `310f195` |
| 14 | Etapa 6 e README: o ponteiro do `z.infer` mandando esperar "quando a entidade PEI for modelada" **(2)** | afirmação falsa + pendência resolvida | `310f195` |
| 15 | README: "os doze gráficos têm nome e tabela equivalente", sem a regra que produz o doze | número sem regra | `4242e80` |
| 16 | Etapa 3: 98 e 97 linhas de emoji — dois números para a mesma correção, nenhum com regra | número sem regra | `4242e80` |
| 17 | "73 mutações, todas acusadas", sem dizer quantas um leitor consegue reproduzir | número sem regra | `4242e80` |
| 18 | Pendência 2: o calendário em inglês atribuído à visão **Lista**, quando são as visões Mês e Dia | afirmação falsa (premissa) | `02ae26e` |
| 19 | Etapa 8: o gatilho da segunda escada escrito pelo nome do pacote, e por isso inaplicável | afirmação falsa (condição) | `02ae26e` |
| 20 | **A linha 4 deste arquivo**: o cabeçalho pedia `lint`, `typecheck` e `build` antes da etapa seguinte, sem `npm test`, desde que a suíte nasceu em 18/09 | afirmação falsa | `b611cc7` |

**Os cinco itens com dois rótulos** são o 3 (contradição entre documentos **e** número sem
regra), o 8, o 9 e o 14 (afirmação falsa **e** pendência resolvida com o registro intacto) e o 10
(afirmação falsa **e** número sem regra). Nenhum outro item desta lista cabe em mais de uma
classe.

### O fecho do próprio achado 18

**Esta seção afirmou "vinte itens" por um dia, e o vinte não tinha regra.** Quem escreveu foi o
agente, no commit `33c06ec`, dentro do achado criado para a classe "número sem a regra que o
produz" — e o número não saía da tabela: as quatro classes somavam 22 rótulos, e nem o 20 nem o 22
se podia reproduzir sem uma regra dizendo se a unidade é o item ou o rótulo. **Os dois números
estavam errados por motivos diferentes:** o 22 conta rótulos, e cresce se alguém refinar a
taxonomia sem que nenhuma incoerência nova exista; o 20 não vinha de contagem nenhuma. A
enumeração de 03/10/2026, com a regra escrita, contou **19**.

**E a ironia é útil: o total voltou a 20.** O item do cabeçalho deste arquivo — `lint`,
`typecheck` e `build` sem `npm test` — entrou na enumeração por decisão do autor e levou a conta
de 19 a 20. **É o número que estava escrito aqui quando ele não vinha de contagem nenhuma, e agora
vem:** mesmo valor, origem diferente. A diferença entre os dois 20 é tudo o que este achado
defende — um era afirmação, o outro é resultado de uma regra que qualquer leitor reaplica
(20 itens, 25 rótulos, 5 itens de rótulo duplo, 25 − 5 = 20). Um número certo por acaso e um
número certo por método são indistinguíveis no texto e opostos como prova; é a mesma lição do
inventário dos arquivos acima de 400 linhas, que ficou em 17 por coincidência enquanto quatro
linhas mudavam por baixo.

**E o modo como apareceu corrige a regra deste achado.** Não foi revisão do texto: foi ao **usar**
o registro para outra coisa — somar a tabela para escrever o corpo do PR #16 — que a incoerência
saiu. A regra corrigida está no fim desta seção, em "A regra corrigida: releitura com uso".

**O intervalo entre escrever e envelhecer foi de horas**, não de etapas — o mesmo que aconteceu
com "reescrevê-las é trabalho possível" na Pendência 4, escrita e desfeita no mesmo dia. O achado
18 não é sobre registro antigo: é sobre registro que ninguém reprova.

**Os dois achados dentro do achado.**

1. **O número corrigido num lugar e intacto no outro.** A recontagem "18 → 27 mutações" entrou no
   achado 11 na própria Etapa 7, e o parágrafo da Etapa 7 que dizia "as 18 mutações desta etapa"
   ficou como estava — no mesmo arquivo, a 1.300 linhas de distância. Corrigir onde o erro foi
   discutido não corrige onde ele foi escrito.
2. **O número que ninguém conseguia reproduzir.** "73 mutações, todas acusadas" era o número mais
   citado da série, e os scripts que o produziam viviam no diretório temporário das sessões. A
   varredura foi procurá-los: **27 não existem mais** — os da Etapa 7 foram embora com o
   scratchpad daquela sessão. O que sobrou foi versionado em `scripts/mutacoes/`, e o que se
   perdeu está escrito lá.

**O mecanismo, que é o que interessa para o artigo.** Nenhum dos vinte veio de descuido
isolado:
todos vêm da mesma assimetria. Quando uma etapa muda o código, ela escreve o registro **novo** —
a seção dela, a tabela de resultado, o achado. O registro **velho** fica, e continua afirmando no
presente um estado que deixou de existir. A série inteira tem verificação para o código (quatro
comandos, arreio, mutação, controle positivo) e **não tinha nenhuma para o registro**. O texto é
a única coisa aqui que ninguém reprovava.

**A assimetria tem um sinal, e ele estava visível.** Toda vez que a Etapa 9 fechou uma pendência,
o texto que a descrevia continuou no presente — "mantém", "ainda mostram", "não possui". O tempo
verbal é o indício: registro escrito no presente sobre um estado que a etapa seguinte muda vira
afirmação falsa sem que ninguém toque nele.

**A regra que fica, no CLAUDE.md:** ao fechar uma etapa, reler **com uso** o que ela tocou nos
dois arquivos e medir de novo os números que ela move — e escrever estado datado em vez de
presente. A varredura inteira custou uma sessão; cada item dela custaria minutos se tivesse sido
feito na etapa que o produziu. O "com uso" é correção posterior, e a subseção seguinte diz de onde
ela veio.

### A regra corrigida: releitura com uso (03/10/2026)

A primeira redação desta regra, escrita em `33c06ec`, dizia "reler o que a etapa tocou e medir de
novo os números que ela move". **Não basta, e este caso é a prova:** o par "vinte itens" / 22
rótulos atravessou duas leituras antes de aparecer, e nas duas a tabela esteve na tela.

1. **Quando foi escrito** (`33c06ec`): a tabela e o total saíram no mesmo commit, e a soma das
   quatro linhas nunca foi feita. **Escrever não é conferir.**
2. **Numa releitura do mesmo dia** (`1125ba3`): a seção foi reaberta e lida para citar o achado 18
   dentro da Pendência 4 — a tabela esteve à vista, com o total três linhas acima dela, e nada
   saltou. **Ler não é conferir.**
3. **Na terceira vez**, quando a tabela teve de ser **reproduzida** no corpo do PR #16, a soma foi
   feita porque o resumo precisava do número — e os 22 apareceram na hora.

**A dedução, do agente, registrada por ordem do autor:** um registro não se mostra incoerente ao
ser **relido**; mostra-se ao ser **usado**. Releitura compara o texto com a lembrança de quem o
escreveu, e a lembrança concorda com o texto porque veio dele. Uso obriga a produzir um número
**novo** a partir do registro, e duas afirmações incompatíveis não cabem no mesmo resultado.

**A regra passa a ser reler COM USO:** somar as tabelas, cruzar os números entre os três arquivos
(README, BACKLOG, CLAUDE.md) e refazer pelo menos uma conta. São três operações com resultado
verificável, em vez de "leitura atenta" — atenção não tem critério de reprovação, conta tem. É a
mesma troca que as quatro verificações fizeram pelo código, e que o achado 8 pagou para aprender
no instrumento: medir o efeito, não inspecionar a presença.

### O commit a caminho, e o merge que não esperou (03/10/2026)

**O autor registra o erro de método como seu, com estas palavras: disse que esperaria o aviso do
agente para mesclar, e mesclou antes.** O PR #16 foi mesclado em `3f56c7d` com oito commits,
`36c5f81` a `1125ba3`, enquanto o nono — `b11bbbc`, a enumeração (19 itens naquele dia, 20 depois
de o item do cabeçalho entrar) e a regra de contagem — ainda estava nas quatro verificações. Ele ficou em `pendencias/fechamento`, fora do
`main`, e o **PR #17 existe por causa disso**.

**A consequência, medida:** no intervalo entre o merge e o PR #17, o `main` afirmou "vinte itens"
com uma tabela somando 22 rótulos — exatamente a incoerência que esta seção descreve, agora na
ramificação principal. O corpo do PR #16 ganhou nota dizendo o que entrou e o que não entrou, para
um PR mesclado não descrever o que não mesclou.

**O agente teve a sua parte, e ela fica registrada para a próxima vez:** sabia que o autor
mesclaria ao receber o aviso e não disse que havia commit a caminho. A regra prática que sai daí é
simples — quem avisa "terminei" avisa também o que ainda está em verificação.

### 19. A verificação que existia e foi declarada inexistente (03/10/2026)

**Qualificação:** três vezes numa sessão o agente relatou ao autor que "o repositório não tem CI;
a verificação é local" — ao abrir o PR #16, o #17 e o #18. **É falso, e sempre foi.** Medido em
03/10/2026, com o repositório de volta a público:

| Medida | Resultado |
|---|---|
| Execuções do workflow `verify` | **36, todas `success`**, de 13/09 a 03/10/2026 |
| Execuções canceladas, falhadas ou puladas | **0** |
| Os três PRs do dia | check `verify` **passando**: PR #16 em 1m27s, #17 em 57s, #18 em 1m33s |
| Dias sem execução | só os dias sem `push`: 20–21/09 e 23/09–01/10, com o `main` parado entre o PR #13 e o PR #14 |

**A origem do erro, medida.** O painel de PR do aplicativo devolveu
`checks: { available: true, passing: 0, failing: 0, pending: 0 }` segundos depois de o PR ser
criado — antes de a execução ser registrada. **"Zero checks conhecidos neste instante" virou "não
há CI neste repositório".** O painel não mentiu: ele respondeu sobre o instante em que foi
perguntado. A inferência mentiu, e bastava um comando — `gh run list` ou `gh pr checks` — para
matá-la.

**A classe do defeito: zero lido como ausência, sem controle positivo.** É irmão do achado 7 (a
varredura que não vê o que procura), do achado 8 (o instrumento que não media o que dizia medir) e
sobretudo **da regra invertida da Etapa 9: "zero inesperado é falha de verificação, não
sucesso"**. A regra existia e não foi aplicada — e o motivo está na subseção "O par", abaixo.

> **Conferido antes de afirmar, em 03/10/2026, e a primeira redação deste parágrafo estava errada:**
> ela dizia que a regra invertida "está escrita no CLAUDE.md". **Não estava.** A busca por "zero
> inesperado", "zero é suspeito" e "falha de verificação" nos três arquivos devolve o BACKLOG
> (Etapa 9 e Pendência 3) e **nenhuma linha do CLAUDE.md**. A regra vivia na seção de uma etapa e
> nas instruções daquela sessão, não no arquivo de instruções permanentes — o que torna o caso
> pior e mais simples: ela não deixou de ser aplicada por estar mal enunciada num lugar
> permanente; ela não estava num lugar permanente. Entrou no CLAUDE.md agora, generalizada, pela
> primeira vez.

**O agravante: o próprio registro contradizia a afirmação, em duas linhas do README.** A tabela de
comandos diz, do `npm test`, "é o que o CI roda" (`README.md:107`), e a seção da suíte diz
"`npm test` roda no CI entre o `typecheck` e o `build`" (`README.md:400`). **Uma das três
operações da regra "reler com uso" — cruzar as afirmações entre os três arquivos — derrubava a
afirmação no primeiro cruzamento.** A regra foi escrita na mesma sessão em que a afirmação falsa
foi repetida três vezes, e não foi aplicada a ela: foi aplicada ao texto do registro, não à fala
do agente sobre o estado do repositório.

**A hipótese era do autor, e ele registra que era sua.** Ele propôs interrupção silenciosa por
limite de minutos do Actions em repositório privado no plano gratuito, e pediu que, se
confirmasse, ficasse registrada como achado 18 aplicado a ferramenta. **Caiu na medição, junto com
a do agente:** eram 36 execuções, todas `success`. As duas hipóteses erravam na mesma direção —
supunham que a verificação tinha deixado de existir, uma por cobrança e outra por leitura de
painel — e nenhuma das duas tinha medido antes de supor. O que distingue as duas é só isto: a do
autor foi proposta **como hipótese, com a ordem de medir antes de registrar**; a do agente saiu
como **afirmação de estado**, três vezes, sem medição nenhuma. **Não houve interrupção**: as 36
execuções são contínuas e cobrem todos os eventos de `push` e `pull_request` do período,
incluindo os três PRs de hoje e as mesclagens do `main`. Fica dito o que **não** foi medido: a
conta de minutos consumidos, porque o endpoint de cobrança do Actions exige escopo `user`, que
esta autenticação não tem. A refutação é por execução observada, não por saldo.

**E o achado 18 aplicado a ferramenta aconteceu de outra forma.** Não foi a verificação que parou
em silêncio: foi a **existência** dela que passou dois PRs declarada como inexistente, num relato
que o autor leu e não tinha como conferir sem abrir o GitHub. O defeito mudou de lugar — do
registro escrito para o relato falado —, e a parte do mecanismo que se mantém é a mesma: ninguém
reprova o que o agente afirma.

#### O que o "CI verde" cobriu, por período

Medido pelo histórico do `.github/workflows/ci.yml`:

| Período | Passos do CI | O que "CI verde" significava |
|---|---|---|
| 13/09 a 18/09 (`441a31e`) | `npm ci`, `lint`, `typecheck`, `build` | **três** das quatro verificações |
| de 18/09 em diante (`c152869`) | os mesmos **mais `npm test`** | as **quatro** |

`npm test` entrou no CI em `c152869`, o commit de andaime da suíte da Etapa 7 — o mesmo que
instalou o controle de que zero teste coletado reprova. Então o "CI verde" dos PRs #1 a #11 cobre
três verificações, **e isso não é defeito**: a suíte não existia. Do PR #12 em diante cobre as
quatro. A afirmação "as quatro verificações" vale no CI a partir da Etapa 7; antes dela, valia
só na máquina.

#### O painel About do GitHub, medido em 03/10/2026

Linha de base, porque é superfície **fora do git**:

| Campo | Estado medido |
|---|---|
| Visibilidade | pública |
| Descrição | "Protótipo de sistema de gestão de Planos Educacionais Individualizados (PEI) para educação inclusiva. React + TypeScript. Dados de demonstração fictícios." — sem vínculo institucional, e dizendo que os dados são fictícios |
| Tópicos | 12, todos temáticos ou técnicos (`accessibility`, `brazil`, `education`, `educational-management`, `educational-platform`, `inclusive-education`, `react`, `shadcn-ui`, `special-education`, `student-tracking`, `tailwind-css`, `typescript`); nenhum institucional |
| Homepage | **vazia** |

**Nenhuma verificação deste repositório alcança esses três campos.** As quatro rodam sobre o
código; a varredura institucional lê `src`, `docs` e `index.html`. Descrição, tópicos e homepage
vivem no GitHub, não no clone, e por isso só existem no registro como medição datada — quem
conferir isto em dezembro não tem commit para comparar, tem esta tabela.

#### O par: a regra existia e não foi aplicada

**A regra que mataria esta afirmação existia desde a Etapa 9** — "zero inesperado é falha de
verificação, não sucesso" — e não foi aplicada, por duas razões que se somam e que foram medidas
em 03/10/2026:

1. **Estava escrita para um instrumento, não para a classe.** O enunciado falava da fotografia de
   superfície; o caso de hoje era um painel de PR, e nada nele dizia que os dois são o mesmo
   problema. Enumerar o instrumento conhecido em vez da classe é o que faz a regra deixar de
   alcançar o caso seguinte — **quinta forma** registrada do achado 7, depois de duas no `grep`,
   uma no `TS6192` e uma num controle da suíte, e a primeira dentro de uma regra de verificação.
2. **E não estava no arquivo de instruções permanentes.** Buscadas as três formulações nos três
   arquivos, a regra aparece no BACKLOG — na Etapa 9 e na Pendência 3 — e **em nenhuma linha do
   CLAUDE.md**. Era regra de etapa, não regra do projeto: nasceu amarrada a um instrumento e ao
   contexto de uma sessão, e as duas amarras impediram que alcançasse o caso seguinte. Entra no
   CLAUDE.md agora, generalizada, pela primeira vez.

**A generalização, por decisão do autor (03/10/2026), com as palavras dele:** *"Zero é ausência de
resultado, não resultado de ausência. Antes de afirmar que algo não existe — verificação,
ocorrência, execução — rode o comando que o lista e confirme com controle positivo. Vale para
qualquer instrumento, não só para a fotografia."* Está no CLAUDE.md nessa forma.

#### O vigésimo item, que entrou na enumeração

Cruzar os três arquivos sobre o que o CI roda derrubou mais uma afirmação, e ela estava na
**linha 4 deste arquivo**: o cabeçalho do backlog pedia `lint`, `typecheck` e `build` antes de
começar a etapa seguinte, **sem `npm test`** — redação de antes de 18/09 que sobreviveu à Etapa 7
e a cinco etapas depois dela, enquanto o CLAUDE.md e o README diziam quatro. Corrigido no mesmo
commit deste achado, com a nota de data no lugar.

É o vigésimo item da classe do achado 18 e o primeiro achado **pela** regra do achado 18 corrigida:
não apareceu numa releitura do cabeçalho — apareceu ao cruzar arquivos para medir outra coisa.
**Por decisão do autor entrou na enumeração como item 20**, que passa de 19 a 20 itens e de 24 a
25 rótulos — e devolve ao total o mesmo número que a seção já tinha afirmado sem regra, agora com
ela (ver "O fecho do próprio achado 18").

**A regra que sai do achado, no CLAUDE.md:** antes de afirmar que uma verificação não existe, rode
o comando que a lista. Zero num painel é "nada conhecido ainda", não "nada existe" — e afirmação
sobre o estado do repositório se cruza com o registro antes de sair, que é a mesma operação da
releitura com uso.

---

## Pendências abertas

Trabalho de uma etapa já mesclada que ficou sem fazer. Cada item diz o que falta, o que a
etapa pode afirmar sem ele e o que **não** pode.

> **Ordem decidida pelo autor em 02/10/2026: os nove testes manuais vêm DEPOIS da Etapa 9.**
> A Etapa 9 mexe nas telas que os nove cobrem — Desempenho, Apresentação, Ver PEI, Detalhe da
> observação, matriz de riscos, relatórios. Executá-los no estado final mede uma vez, e o que
> for medido vale para o sistema que fica. Antes, mediria o estado que a etapa seguinte vai
> desfazer, e os nove teriam de ser refeitos.
>
> **A ordem inversa esteve registrada aqui no mesmo dia, e está substituída.** O argumento era:
> eles são a única verificação que ninguém executou, e medir depois de uma mudança grande deixa
> qualquer achado com duas causas candidatas. Fica citado porque ordem escrita e ordem praticada
> não podem divergir — quem ler a Pendência 1 daqui a um mês precisa saber que a ordem mudou e
> por quê, em vez de encontrar um registro que descreve uma prática que não aconteceu.
>
> A diferença entre os dois argumentos é o que se protege. O primeiro protege a atribuição de
> causa de um achado novo; o segundo evita medir duas vezes a mesma coisa. Com os nove ainda não
> executados, não há linha de base a preservar — não existe medição anterior para um achado novo
> contradizer —, então o custo de refazer pesa mais. A regra geral da série continua valendo onde
> ela se aplica: não deixar o instrumento e o objeto se moverem juntos. Aqui o instrumento são
> teclado e leitor de tela, que a Etapa 9 não altera.

### 1. Verificação por teclado e leitor de tela (Etapa 3) — não feita

**Estado em 16/09/2026:** a Etapa 3 foi mesclada no PR #4 **sem** que os nove testes abaixo
fossem executados. A verificação por teclado e por leitor de tela real continua não feita.

**O que a medida da etapa cobre.** Os números "124 violações para 0" e "8 avisos para 0" vêm
**só de verificação automatizada** — `axe-core` rota a rota e `eslint-plugin-jsx-a11y` — mais
a leitura do código. Eles sustentam que todo controle entra na ordem de foco, tem nome
acessível e expõe estado, e que nenhuma informação depende só de cor ou hover.

**O que ela não cobre.** Que cada controle responde à tecla, que o foco não fica preso, e que
o leitor de tela anuncia o que a árvore de acessibilidade promete. A ferramenta de navegador
das sessões não aciona `<button>` por Enter nem por Espaço, então nada disso foi observado.
O achado 2 mostra por que a diferença importa: dos cinco controles que só funcionavam no
mouse, a verificação automatizada viu um.

Enquanto os testes não forem feitos, o critério de aceite da Etapa 3 — "navegar o sistema
inteiro só com teclado, sem ficar preso nem encontrar controle inalcançável" — está
**cumprido pela metade**.

> **A tabela foi atualizada pela Etapa 9**, que mexeu nas telas de M3, M5 e M9. O M5 esperava
> "Slide 3 de 12": o 12 era o número de slides do exemplo fixo, e agora a apresentação é montada
> do plano — são 8 para a estudante 1, e o nome da região inclui o título do slide. Era este o
> motivo de executar os nove DEPOIS da etapa: o esperado muda com a tela.

| | Onde | Sequência | Esperado |
|---|---|---|---|
| M1 | `/gestao?tab=alertas`, matriz de riscos | Tab até um risco, Enter; de novo, Espaço | O detalhe expande e recolhe; o foco fica no botão |
| M2 | `/biblioteca-recursos` → Ver → "Sua nota" | Tab até a 1ª estrela, Espaço, seta direita duas vezes | Marca 1 e chega a 3; o texto ao lado diz "3 de 5" |
| M3 | `/gestao?tab=relatorios` → aba "Por Áreas" | Tab até o nome da área, Enter | O painel de detalhe abre |
| M4 | Mesma tela, calendário de observações | Tab atravessando o bloco | O foco pula a tabela inteira, sem parar em célula |
| M5 | `/alunos/1` → Modo Apresentação → Iniciar | Setas direita e esquerda; depois Esc | Anda e volta de slide, o leitor anuncia "Slide 3 de 8: Reconhecer e ler palavras do vocabulário funcional", e Esc fecha |
| M6 | Configurações → Acessibilidade | Espaço em Alto contraste, fechar, F5 | Continua aplicado depois de recarregar |
| M7 | Windows → Acessibilidade → Efeitos visuais, desligar animação; F5 | — | As transições somem sem marcar nada no app |
| M8 | Leitor de tela em `/alunos` e num diálogo (o Ver PEI serve) | Leitura sequencial, e Tab até o botão de fechar | Os títulos não começam com o nome de um emoji; o diálogo anuncia título e descrição; **o botão de fechar é anunciado como "Fechar"**, não "Close" |
| M9 | `/gestao?tab=relatorios`, "Ver os dados do gráfico em tabela" | Tab até o resumo, Enter | A tabela abre e é lida com cabeçalho de linha e de coluna |

O M5 tem uma armadilha de teste já verificada: duas setas com menos de ~400 ms entre elas
parecem não funcionar. É artefato da automação, não do app.

**O M8 ganhou o botão de fechar em 03/10/2026**, por decisão do autor. O nome acessível dele era
"Close", em inglês, numa página `lang="pt-BR"`, e foi corrigido em `ccb2fce` — mas **só um
leitor de tela prova o que ele anuncia**. É o mesmo argumento do achado 2: o que só existe depois
de uma interação não é alcançado por nenhuma verificação automatizada deste repositório, e o M8 é
o único teste da lista que chega lá.

**Para fechar:** executar os nove, registrar aqui o resultado de cada um (passou, falhou e
como) e a data. Falha vira item de correção, e a pendência só sai deste bloco quando os nove
passarem.

### 2. Dois defeitos de acessibilidade achados depois do merge (Etapa 3) — não corrigidos

Achados durante a verificação da Etapa 4 e deixados para a Etapa 3 por decisão do autor.
Nenhum foi corrigido. **Os dois foram remedidos em 03/10/2026, na varredura de coerência**, e um
deles muda de descrição.

- **Datas do calendário da Agenda em inglês.** O registro de 16/09/2026 dizia: "em
  `/agenda-atendimentos`, a visão **Lista** mostra 'Tue Nov 25', '2:00 pm' e '11/25/2025'. Visto
  de passagem; a causa não foi investigada." **Remedido: o defeito existe, a tela é outra, e a
  causa agora está medida.**
  - A visão **Lista** não é do `react-big-calendar`: é uma lista de cartões própria, e está toda
    em português ("28/11/2025", "14:00 - 15:00", "Reunião Pedagógica"). A atribuição estava
    errada.
  - Quem mostra inglês são as visões do calendário: **Mês** escreve "October 2026" e "Sun Mon
    Tue Wed Thu Fri Sat"; **Dia** escreve o intervalo como "10/03/2026 – 10/04/2026", que é
    MM/DD/YYYY. Os rótulos de botão estão em português porque são passados à mão pela prop
    `messages`; o que vem do `localizer` está em inglês.
  - **A causa, medida:** o `AgendaAtendimentos.tsx` importa `moment/locale/pt-br` e chama
    `moment.locale('pt-br')` — e o módulo `moment` que a página carrega responde
    `locale() === 'en'`, com `['en']` como única locale registrada, enquanto
    `moment_locale_pt-br.js` **é baixado** pelo navegador. Medido no console, pelo mesmo módulo
    que o aplicativo usa. O mecanismo exato (interoperação entre o `moment` CommonJS e o módulo
    de locale, sob o pré-empacotamento do Vite) **não foi investigado** e não é afirmado aqui.
  - **Por que nenhuma verificação pegou:** é texto que só aparece depois de trocar de aba, e o
    axe e o arreio medem rota a rota sem interagir (achado 2). E a atribuição errada à "visão
    Lista" sobreviveu dois anos de registro porque ninguém voltou a abrir a tela.
- **Selo "ATENÇÃO" com contraste 3,15:1.** Em Gestão > Relatórios, "Ver detalhes do exemplo" →
  subtab "Alertas", o selo tem texto branco sobre `--alert-warning-icon` (`#D97706`): 3,15:1,
  medido pelo axe em 16/09/2026 (1.4.3 pede 4,5:1). O selo é de `645280f`. A medida da Etapa 3
  deu 0 nessa rota porque o selo só aparece depois de dois cliques. **Conferido em 03/10/2026:
  intacto** — `reports/PredictiveAnalysis.tsx:565` continua com
  `bg-[hsl(var(--alert-warning-icon))] text-white`, e o token continua `32 95% 44%`.

**O que a Etapa 3 pode afirmar sem eles:** o "124 violações para 0" vale para o que aparece nas
rotas sem interação. **O que não pode:** que todo conteúdo alcançável por clique foi medido.

**Para fechar:** corrigir os dois, com o contraste remedido da cor computada e o calendário
conferido nas três visões. Nenhum dos dois tem correção escrita ainda, e o do calendário precisa
antes de uma decisão: consertar a locale do `moment` ou trocar o localizador por um que já seja
usado no projeto (o `date-fns` já está instalado e o `ptBR` dele já é importado nesta mesma
tela).

### 3. O arreio de superfície não alcança diálogo (Etapa 9) — trabalho próprio, depois da etapa

**Estado em 02/10/2026:** `scripts/fotografia.js` mede 23 superfícies **sem interagir**. Diálogo,
toast, menu e aba de diálogo só existem depois de um clique, e nenhum deles entra na medida.

**O que isso significa na prática.** Nos commits da Etapa 9 que mudaram o Ver PEI e o botão de
fechar, a fotografia deu zero — e o zero não era evidência de nada, porque o instrumento não
chega ao objeto. A regra invertida da etapa ("zero é suspeito no commit que devia mudar a tela")
só se aplica onde o arreio alcança; onde não alcança, o que vale é dizer isso em voz alta e pôr a
prova em outro lugar: teste de árvore (`src/test/verpei.test.tsx`, `progresso.test.tsx`) e
navegador.

**Por que não foi feito junto.** Estender o arreio no mesmo commit que muda a tela moveria
instrumento e objeto ao mesmo tempo — a regra que a Etapa 5 pagou para aprender (achado 8).
Decisão do autor em 02/10/2026: é trabalho próprio, depois da Etapa 9.

**O que ele precisa ter**, para não repetir os defeitos do arreio original: abrir o diálogo pelo
controle que o abre (não por estado interno), medir as quatro medidas com o diálogo montado,
percorrer as abas, fechar, e ter **controle próprio** — uma quebra plantada dentro do diálogo que
a medida tem de acusar. Sem esse controle, um arreio de diálogo que devolve "zero" não vale mais
que o silêncio de agora.

**O que a etapa pode afirmar sem ele:** que as telas de diálogo fazem o que os testes de árvore
asseveram, em jsdom, e o que foi lido no navegador. **O que não pode:** que nenhum detalhe de
acessibilidade, foco ou número regrediu dentro de um diálogo entre dois commits.

### 4. As 27 mutações da Etapa 7 não serão reescritas — decisão do autor, 03/10/2026

**Estado em 03/10/2026:** 47 das 74 mutações da série estão em `scripts/mutacoes/` e reproduzem o
resultado registrado — 47 plantadas, 47 acusadas, medido pelo `executar.cjs`. As 27 da Etapa 7 —
persistência e migrações (4), datas (3), seletores (6), reducer (5), rotas (3) e fluxo (6) —
viviam no diretório temporário daquela sessão e não sobreviveram a ela. O resultado delas está
registrado aqui e nas mensagens dos commits de 18/09/2026; a reprodução, não.

**Decisão do autor: não reescrever — e o motivo é o registro, não o trabalho.** Reescrevê-las a
partir dos testes de hoje produz mutações que casam com o que o teste **faz hoje**, não com o
defeito que ele existia para pegar em 18/09. Seriam 27 mutações novas com aparência de
reconstituição, e isso é pior que 27 declaradas perdidas: o leitor veria o 74 inteiro como
reproduzível quando parte dele seria medida de outubro vestida com a data de setembro. **Está
escrito aqui para ninguém reabrir isto achando que é só trabalho braçal.**

**A premissa está medida, não suposta** (03/10/2026). Quatro dos seis arquivos de teste da
Etapa 7 mudaram depois dela: `src/store/persistence.test.ts` +227/−10 (`448fa6b`, Etapa 9),
`src/test/rotas.test.ts` +108/−6 (`321ab87`, Etapa 8), `src/lib/metrics.test.ts` +68/−19
(`ac477e1`, Etapa 9) e `src/test/fluxo.test.tsx` +8/−0 (`ccb2fce`); só `date.test.ts` e
`reducer.test.ts` estão como ficaram. E o alvo também se moveu: quando as seis mutações dos
seletores foram plantadas, `studentProgress` tinha 11 linhas e lia a avaliação mais recente; hoje
tem 4 e lê as metas do PEI vigente, e a conta antiga vive em `assessmentProgress`. Uma mutação
escrita hoje contra `studentProgress` planta defeito em código da Etapa 9 — não é a mutação de
setembro com outro nome de arquivo, é outra mutação.

**E não há artefato de onde recuperar as originais.** Os 22 transcritos de sessão desta máquina
foram varridos em 03/10/2026: nenhum é a sessão da Etapa 7 — dois citam "Etapa 7" uma vez cada
(um é o plano deste backlog sendo lido, o outro é de projeto alheio) e o terceiro é a sessão de
fechamento. Perdido aqui significa perdido, não "em outro lugar".

**O que o repositório pode afirmar sem elas:** que 47 mutações plantadas em código de produção são
acusadas pela suíte, hoje, por quem rodar `node scripts/mutacoes/executar.cjs`; e que as 27 foram
acusadas quando foram plantadas, pelo registro da Etapa 7 — testemunho, não reprodução. **O que
não pode:** que o 74 seja reproduzível. É **47 reproduzíveis e 27 atestadas**, e os dois números
não se somam numa afirmação só.

**Isto é o achado 18 dentro da sessão que o escreveu.** O commit `d83d8ba` e o README dos scripts
diziam "reescrevê-las é trabalho possível, e fica como pendência" — escrito horas antes da
decisão, no mesmo dia. A mensagem do commit fica como está, porque história não se reescreve; o
texto vivo foi corrigido e esta pendência registra a substituição, como a Pendência 1 faz com a
ordem dos testes manuais. O prazo do achado 18 não se mede em etapas: mede-se no tempo entre
escrever e decidir, e aqui foram horas.

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

**Estado em 16/09/2026:** ✅ mesclada no PR #4, a partir do `a9fe84f`, em nove commits de
código e cinco de documentação — **com uma pendência aberta**: os nove testes de teclado e
leitor de tela não foram executados (ver **Pendências abertas**, item 1). A medida abaixo
cobre só verificação automatizada. Os oito itens do inventário
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
| `cfc0fec` Docs | Medida da etapa; `jsx-a11y` de aviso para erro |
| `86a9e06` Docs | Achado 5 e a captura de tela como não-evidência |

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
Também continuam fora dos tokens as classes de cor fixa e os 12 literais hexadecimais que
**passam** no contraste, tratados na Etapa 5. O número "165" que estava aqui não sai de
nenhuma regra escrita, e a recontagem da Etapa 5 dá 153 ou 170 conforme a regra — ver "A
regra de contagem das cores, e os três números", lá.


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
     > **Os dois números, 98 e 97, não vêm da mesma contagem** (varredura de coerência,
     > 03/10/2026). A tabela de resultado da etapa diz 98 e este item diz 97, e nenhum dos dois
     > traz a regra que o produz — ninguém consegue dizer hoje se a diferença de 1 é uma linha
     > contada em dois lugares, um caso de triagem ou um erro de contagem. Fica registrado como
     > número sem método: o que se pode afirmar é que o resultado medido depois foi **zero**, e
     > esse zero tem regra (busca por emoji em título, aba, `DialogTitle` e `Label`).
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
   - **Ainda fora dos tokens:** classes de cor fixa e 12 literais hexadecimais, em cores
     que **passam** no contraste — eixos e séries de gráfico, principalmente. Não são falha
     AA, mas continuam violando a invariante 1. O "165" registrado aqui foi recontado na
     Etapa 5 e não é reproduzível: 153 pela regra estreita, 170 pela larga. Os 12
     hexadecimais conferem, e continuam nos gráficos.
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
manual, que **não foi feito**: a ferramenta de navegador da sessão não aciona `<button>` por
Enter ou Espaço, e os nove testes ficaram como pendência aberta. O que dá para afirmar sem
eles é que todo controle entra na ordem de foco, tem nome e expõe estado.

### Lista de teste manual

Movida para **Pendências abertas**, item 1, no topo deste arquivo: os nove testes não foram
executados antes do merge.

---

## Etapa 4 — Números coerentes

**Estado em 16/09/2026:** mesclada no PR #5 (`885a196`), em oito commits de código e três de
documentação, a partir do `6875c1a`. Depois do merge, quatro commits na branch
`etapa-4/vocabulario-e-alertas`, ainda fora da `main`: `0c2be34` e `bd93507`, de correção, e
`d959540` e este, de documentação. A regra da etapa: número que
descreve os registros se calcula a partir deles, em `src/lib/metrics.ts`; número que não tem
registro de origem vira cenário com nome próprio, com aviso, ou sai. As decisões D1 a D6 são
do autor e estão no plano aprovado; os commits citam cada uma onde ela se aplica.

| Commit | O que faz |
|---|---|
| `52a7b54` Docs | Pendência aberta: os testes manuais da Etapa 3 não foram feitos |
| `e43150f` Fix | Terceira onda do achado 1: dado de saúde fixo na ficha, no Desempenho e na Nova Observação |
| `06eed98` Refactor | `src/lib/metrics.ts` com os seletores que já existiam, sem mudar número |
| `a0d36cf` Fix | Datas lidas em UTC que mudavam números à noite, aos domingos e na véspera de aniversário |
| `9273891` Fix | Licenças de profissionais nomeados e a quarta onda do achado 1 |
| `7faa8f2` Docs | Achado 6 e a regra da varredura por vocabulário no CLAUDE.md |
| `9cbeb7d` Fix | Contagens do mês e variações calculadas, com "sem base de comparação" (D2) |
| `46ae545` Fix | Ficha: progresso calculado das avaliações (D3) e campos inventados fora |
| `6c502da` Fix | Biblioteca: nota das avaliações (D4), downloads fora (D5), badges por contribuição |
| `7039784` Fix | Gestão como cenário nomeado (D1), o 88% (D6), avisos, ranking fora, "+100%" da Agenda |
| `cc83fc5` Docs | Medida da etapa, quarta onda do achado 1, caso a mais do achado 6, README |
| `0c2be34` Fix | Depois do merge: vocabulário de inferência sobre dado fixo, contagens que contradiziam a lista ao lado, "João" |
| `d959540` Docs | Depois do merge: o par leitura × busca no achado 1, achado 7, pendências realocadas, correções dos registros |
| `bd93507` Fix | Depois do merge: o Ver PEI deixa de atribuir o plano de exemplo ao estudante aberto |
| este `Docs:` | Depois do merge: regra do controle positivo no CLAUDE.md, recontagem e reexecução do achado 7, série do calendário atribuída |

### Resultado da etapa

Medido no navegador antes e depois de cada commit, com o relógio emulado quando o defeito
dependia de data ou hora. Os detalhes de cada linha estão na mensagem do commit.

| Medida | Antes | Depois |
|---|---:|---:|
| **Dado de saúde fixo atribuído a estudante ou a pessoa nomeada** | **9** | **0** |
| — sob o nome de qualquer estudante: ficha, Desempenho, Nova Observação | 5 | 0 |
| — de pessoa nomeada, na Gestão: duas licenças, "Pedro, 9h - Ansiedade", "Pedro (crise)" | 4 | 0 |
| Afirmações falsas de funcionalidade na ficha ("Acesso controlado por perfil", "Histórico completo") | 2 | 0 |
| **Números digitados apresentados como medida** | | |
| — tendências sem base (Dashboard ↑12% e ↑8%; Agenda +12%) | 3 | 0 |
| — selos "+100%" sem semana anterior na Agenda (visão Dia em 25/11/2025) | 3 | 0 |
| — números sem entidade de origem ("12 relatórios pendentes", "21" anexos) | 2 | 0 |
| Cartões "este mês" que contavam registros de qualquer data | 2 | 0 |
| Leituras de data em UTC (Agenda: 7 dias e semanas; detalhe da observação; `calculateAge`) | 4 | 0 |
| "Próximos 7 dias", Dashboard × Agenda, às 21h30 de 24/11/2025 | 3 × 4 | 3 × 3 |
| Alunos com progresso exibido sem ter avaliação | 3 de 4 | 0 |
| Campos e selos inventados na ficha, iguais para qualquer estudante | 13 | 0 |
| Recursos com nota e contagem da fixture, e não das avaliações | 6 de 6 | 0 |
| Cards de recurso com número de download | 6 | 0 |
| Estatísticas sem origem no detalhe do recurso ("Favoritado por", "Taxa de satisfação", "18 escolas", "acharam útil") | 4 | 0 |
| Números fixos em Meus Recursos (12 publicados, 1.234 downloads, 4,7, 234 favoritados) | 4 | 0 |
| Badges conquistadas com zero contribuições | 4 | 0 |
| Ranking de pessoas fictícias apresentado como classificação real | 1 | 0 |
| Pessoas do seed dentro do cenário de Gestão | 4 | 0 |
| Alunos e famílias nomeados no cenário de Gestão | 8 | 0, só a partir de `0c2be34` |
| Indicadores da Gestão com o mesmo nome e valor ou veredicto diferente (88%; satisfação) | 2 | 0 |
| Telas com número sem aviso de dados fictícios (Dashboard, Agenda, Desempenho, Biblioteca) | 4 | 0 |

**Correção desta tabela.** No fechamento da etapa (`cc83fc5`), a linha dos nomes dizia "8 → 0".
Ficou "João", sem sobrenome, em dois textos de Gestão > Relatórios — o mesmo aluno do exemplo
que era "João Silva". A varredura de nomes do commit 7 não casava "João" (achado 7). O zero só
vale a partir de `0c2be34`.

**Depois do merge, em `0c2be34`.** Medido no texto renderizado de Gestão > Relatórios (com os
quatro subtabs do exemplo abertos), de Gestão > Análise e da ficha do Pedro:

| Medida | Antes | Depois |
|---|---:|---:|
| Termos de inferência sobre número fixo, distintos, fora de frase de negação — Relatórios | 11, mais "significativamente" e "João" no subtab Alertas | 0 |
| — Análise ("efetividade", "insights") | 2 | 0 |
| — ficha do aluno ("eficácia", "probabilidade", "baseado em", "casos similares", "chance") | 5 | 0 |
| Números ou leituras que contradiziam o que está ao lado (17 alertas, 5 críticos, 156 casos, 8 estratégias, "melhor desempenho nas terças") | 5 | 0 |

O que sobra desses termos na tela é negação: "nenhum modelo preditivo é executado", "nenhuma
eficácia foi medida", "nenhum tem probabilidade calculada". Critério e classificação das 305
linhas da varredura estão na mensagem do commit.

Os 13 campos e selos da ficha: ano letivo, turno e professor(a) de apoio; composição e
observações da família; os cinco itens do "Histórico" (pendências, ingresso, primeiro PEI,
revisões, progressões); "Última atualização"; e os selos "Desempenho em dia" e "Documentação
em dia". Os 8 nomes da Gestão: os alunos "Ana Silva", "Pedro Santos", "Maria Costa", "João
Silva", "Maria Oliveira" e "Pedro Costa", e as famílias "Silva" e "Costa". As 4 pessoas do
seed: Profª. Ana Beatriz, Prof. Carlos Lima, Dra. Maria Fernandes e Dr. João Santos.

**O que o número não diz.**
- **O critério de aceite está cumprido com uma ressalva.** Os indicadores calculados do aluno
  saem de seletores de `metrics.ts`: o progresso aparece igual no card e na ficha, e as
  contagens da ficha e do relatório vêm dos mesmos registros (o relatório, no período
  escolhido). Mas Desempenho, Apresentação, Ver PEI e Detalhe da observação ainda
  mostravam números fixos sob o nome do estudante: o Desempenho da Maria dizia 85% no 4º
  trimestre, e a ficha, 60%. Trocar por dado real dependia da entidade PEI, e o autor aceitou a
  ressalva. **Resolvido na Etapa 9**, com as quatro telas lendo o registro: a ressalva sai, e o
  85% deixou de existir.
- **Conferido em 16/09/2026, depois do merge: três dos quatro diziam na tela que o conteúdo não
  é do estudante aberto; o Ver PEI não dizia. Corrigido em `bd93507`, a pedido do autor — era o
  pior dos quatro justamente por nomear.**
  - Desempenho: "São os mesmos para qualquer estudante e não vêm das avaliações registradas",
    no aviso, e "igual para qualquer estudante", na descrição.
  - Apresentação: "Só o nome vem da ficha: os slides não usam os registros do estudante."
  - Detalhe da observação: o aviso diz quais partes são exemplo e quais "vêm da observação
    registrada".
  - Ver PEI: o aviso chama os dados de "exemplos estáticos" e diz que o sistema não tem registro
    de PEI, mas não diz que o conteúdo não é do estudante. O cabeçalho mostra "Aluno: Pedro
    Oliveira Costa", "PEI 2024 - 4º Trimestre" e "Ativo", e a descrição fala em "plano do
    estudante". O registro de `cc83fc5` dizia que os quatro tinham esse aviso; não era verdade
    para o Ver PEI. Além disso, a responsável do plano, quatro vezes, era "Profª Marina Santos",
    na demonstração a regente de outra aluna.
  - Ver PEI, depois de `bd93507`, medido nas fichas de Pedro e de Maria: título "— exemplo";
    descrição "o mesmo para qualquer estudante: não é o plano de <nome>"; aviso "nada deste plano
    vem do registro de <nome>"; sem "Aluno:" e sem selo de status no cabeçalho; "Professor(a)
    regente" no lugar do nome da professora. O nome do estudante só aparece nas duas frases que
    negam que o plano seja dele.
- **Zero "neste mês" é resultado, não defeito** (D2). As observações e os atendimentos do seed
  são de novembro e dezembro de 2025. O README e os avisos do Dashboard e da Agenda dizem isso.
- **O cenário de Gestão continua inventado**, agora com nome e separado dos registros (D1).
  Coerência interna do cenário só foi tratada onde havia contradição à vista: o 88% e a
  satisfação.

### O que ainda falta

Encontrado durante a etapa e deixado de fora, de propósito, com o destino que o autor deu a
cada item depois do merge:
- ~~**Vocabulário de previsão sobre dado estático.**~~ **Corrigido em `0c2be34`**, por decisão
  do autor: reescrever o texto, sem remover as telas, com varredura por vocabulário. A
  varredura com `grep` falhava em classe acentuada (achado 7) e foi refeita em Node.
- ~~**"17 alertas ativos, 5 críticos" contra a lista de 5 e 2.**~~ **Corrigido em `0c2be34`**:
  o resumo conta da mesma lista. No mesmo commit, as abas "Casos Similares 156" e "Estratégias
  8" do `PredictiveAnalysis`, sobre listas de 3, e a leitura "melhor desempenho nas terças"
  ao lado de um calendário com zero observação às terças. Fica, fora da Gestão e com aviso,
  "Taxa média de sucesso: 88%" no `MeuPerfilDialog`.
- **Tabela do Orçamento sem foco em largura estreita** (`scrollable-region-focusable`, 2.1.1):
  **Etapa 5, item 12**, por decisão do autor.
- **Calendário da Agenda em inglês:** **Pendências abertas, item 2 (Etapa 3)**, por decisão do
  autor, junto do selo "ATENÇÃO" de 3,15:1 achado na verificação de `0c2be34`.
- ~~**Ver PEI sem dizer que o conteúdo não é do estudante aberto.**~~ **Corrigido em
  `bd93507`**, por decisão do autor. Ver **O que o número não diz**.
- **Dado ilustrativo implausível, não bug: a série fixa do calendário de observações.** Em
  Gestão > Relatórios, novembro de 2024 tem zero observação em todas as terças e quartas e 23
  observações nos fins de semana. A série não corresponde a um calendário escolar. O autor a
  escreveu na Etapa 0 (`441a31e`) para substituir o `Math.random()`, que mudava os números a
  cada renderização, e registra que escolheu os números sem pensar no padrão semanal que eles
  desenhavam. Visto na verificação de `0c2be34`. Registrado é suficiente, por decisão do autor;
  sem correção.
- **Código morto novo:** `mockProfessionals` ficou sem uso (Etapa 5, item 11).

### Inventário e plano original

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

**Datas lidas em UTC — confirmado e corrigido no commit 3.** `new Date('AAAA-MM-DD')` é
meia-noite em UTC, e em `America/Sao_Paulo` (UTC−3) isso é 21h do dia anterior. Quatro lugares
faziam essa leitura:

| Onde | Efeito | Antes | Depois |
|---|---|---|---|
| Agenda, "Próximos 7 dias" | a partir das 21h, deixa de contar os atendimentos de hoje e passa a contar os do oitavo dia, divergindo do Dashboard | relógio 24/11/2025 21h30: Dashboard 3, Agenda **4**; relógio 28/11/2025 21h30: Dashboard 4, Agenda **3** | 3 e 3; 4 e 4 |
| Agenda, visão de dia, comparação entre semanas | o atendimento de domingo some das duas semanas, porque a semana guardava a hora do relógio e a data do atendimento caía no sábado às 21h | relógio no domingo 30/11/2025 10h: "Total Geral 3 → **1**, −67%", sem a linha de Atendimento Família | "3 → 2, −33%", com "Atendimento Família 0 → 1" |
| Detalhe da observação, cinco datas | a observação de 19/11/2025 aparece como 18/11 | 18/11/2025 | 19/11/2025 |
| `calculateAge`, em `src/lib/date.ts` | a idade sobe na véspera do aniversário | nascida em 15/03/2016, relógio em 14/03/2026: **10 anos** | 9 anos em 14/03; 10 anos em 15/03 |

- **Como foi confirmado.** A divergência dos "Próximos 7 dias" foi primeiro verificada em
  Node, rodando as duas fórmulas copiadas do código com `TZ=America/Sao_Paulo`. Depois, no
  navegador, cujo fuso é `America/Sao_Paulo`, com o relógio emulado: `window.Date` substituído
  por uma subclasse que devolve um instante fixo quando chamada sem argumento, e a rota
  renderizada de novo. Às 10h do mesmo dia, os dois números batiam — o controle. As quatro
  linhas da tabela foram medidas assim, antes e depois, com o servidor reiniciado e o módulo
  servido conferido.
- **O de `calculateAge` não estava no inventário.** Apareceu numa varredura por qualquer
  `new Date(...)` com um argumento só, feita depois de corrigir os três conhecidos. É a função
  que o CLAUDE.md manda usar para toda idade.
- **Regra adotada, escrita no topo de `src/lib/metrics.ts`:** data de registro se compara como
  texto `YYYY-MM-DD`; para exibir, `formatLocalDate`; para calcular, `parseLocalDate`. Nunca
  `new Date('AAAA-MM-DD')`.
- **Por que nenhum teste de dia pegou:** os quatro defeitos dependem de hora da noite, de
  domingo ou de véspera de aniversário. Com o relógio real, às 8h de uma quarta-feira, as dez
  rotas medidas mostram exatamente os mesmos números antes e depois da correção.

**Critério de aceite:** nenhum indicador de aluno aparece com dois valores diferentes em
telas diferentes. **Estado em 2026-09:** cumprido com uma ressalva — os diálogos de exemplo
mostravam números fixos sob o nome do estudante, e os quatro diziam na tela que o conteúdo não
era dele (três desde a Etapa 4, o Ver PEI desde `bd93507`). **Estado depois da Etapa 9:
cumprido sem ressalva**, porque os quatro passaram a ler o registro do estudante aberto.

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
      `docs/calendar-sync-implementation.md`; **na Etapa 10c o arquivo foi removido e a citação
      saiu da tela junto** — o nome certo deixou de existir, e o defeito do nome errado com ele;
    - `MeuPerfilDialog.tsx:413` tem `Progress value={310}`, fora da escala de 0 a 100;
    - `VisaoGeralContent.tsx:37` usa a chave de objeto `MÉDIA`, com acento;
    - `VisaoGeralContent` e `MeuPerfilDialog` põem `Badge` (um `<div>`) dentro de `<p>`, e o
      React acusa aninhamento inválido;
    - ~~`ObservationDetailDialog` formata a data com `new Date('AAAA-MM-DD')`, que é UTC: a
      observação de 19/11/2025 aparece como 18/11/2025 no Brasil;~~ corrigido na Etapa 4
      (`a0d36cf`);
    - em `AgendaAtendimentos`, as visões de semana e de dia passam `view` ao
      `react-big-calendar` sem `onView`, e o console avisa;
    - `App.tsx`, `StudentDetail`, `ObservationDetailDialog`, `StudentHistoryDialog`,
      `PresentationModeDialog`, `MeuPerfilDialog`, `AgendaAtendimentos` e `Dashboard` têm
      imports sem uso anteriores à Etapa 2.
11. `mockProfessionals`, em `mockData.ts`, ficou sem nenhum uso na Etapa 4 (`7039784`), quando
    a aba Equipe da Gestão deixou de repetir os profissionais do seed.
12. ~~Tabela "Aprovações Pendentes" da aba Orçamento: abaixo de ~800 px transborda num
    contêiner com rolagem que não recebe foco, e o axe acusa `scrollable-region-focusable`
    (2.1.1).~~ ✅ corrigido em `536b374`. Não havia instâncias a conferir nas outras tabelas:
    o contêiner é do wrapper compartilhado `ui/table.tsx`, e uma correção lá cobre todas. É o
    achado 6 lido do lado certo — corrigir a classe, não a instância.

**Critério de aceite:** build não encolhe em funcionalidade; nenhum arquivo morto. ✅ atendido:
nenhum arquivo inalcançável além da declaração de tipo do Vite, e a fotografia de superfície
deu diferença zero do primeiro ao último commit.

### Resultado da etapa

Medido no repositório e no navegador, antes do primeiro commit e depois do último. Os
detalhes de cada linha estão na mensagem do commit correspondente.

| Medida | Antes | Depois |
|---|---:|---:|
| **Arquivos em `src/` inalcançáveis a partir de `main.tsx`** | **25** | **1** |
| — importados por ninguém (`CoordinationDashboard`, `NavigationBar`, `ComplexityCard`, `NavLink`) | 4 | 0 |
| — importados por `App.tsx` mas sem rota (`pages/Reports`, `pages/ComplexityAnalysis`) | 2 | 0 |
| — alcançáveis só pelos anteriores (`reports/ActionPanel`) | 1 | 0 |
| — componentes de `ui/` sem uso fora de `ui/`, mais `hooks/use-mobile` | 21 | 0 |
| — o que resta: `vite-env.d.ts`, declaração de tipo puxada pelo tsconfig, não por import | 1 | 1 |
| Arquivos em `src/` | 155 | 127 |
| Linhas de código removidas (líquido) | — | −3.464 |
| `dependencies` no `package.json` | 51 | 37 |
| `index.js` do bundle, em bytes | 1.000.212 | 971.582 |
| Avisos de react-refresh aceitos no lint | 7 | 4 |
| `QueryClientProvider` montado sem nenhuma query | 1 | 0 |
| Exports mortos em `mockData.ts` (`mockProfessionals`, `dadosAnalisePreditiva`) | 2 | 0 |
| Estado sem interface em `ResourceLibrary` | 4 | 0 |
| Identificadores sem uso (`tsc --noUnusedLocals --noUnusedParameters`) | 32 | 5¹ |
| **Coleções que guardavam cópia do nome do estudante** | **3** | **0** |
| — **atendimentos escondidos pelo filtro por aluno, com nome gravado desatualizado** | **todos** | **0** |
| Violação `scrollable-region-focusable` em 320 px (Orçamento, Benchmarking) | 1 | 0 |
| Defeitos pequenos da Etapa 2 (caminho de doc, `value={310}`, `Badge` em `<p>`, `view` sem `onView`) | 4 | 0 |
| Selo com significado só no emoji, achado ao editar uma das linhas acima | 1 | 0 |
| Chaves de objeto com acento (medido pela AST, não por regex) | 4 | 3 |
| Classes de cor fixa fora dos tokens (regra larga; ver abaixo) | 170 | 164 |
| Literais hexadecimais fora dos tokens | 12 | 12 |
| Arquivos acima de 400 linhas | 19 | 17 |

¹ **Correção feita na Etapa 6.** O número registrado aqui era "2", e estava errado: a sonda
que o produziu filtrava `TS6133|TS6196` e não incluía `TS6192`, o código de "todos os imports
da declaração estão sem uso". Escaparam três declarações — `Tabs` em `ObservationDetailDialog`,
`Select` em `PresentationModeDialog` e `Dialog` em `StudentDetail` —, removidas em `0605cf4`.
Lista de códigos em vez de classe: é o achado 7, e está registrado lá.

**Os dois `_props` que sobravam** em `ui/calendar.tsx` foram removidos na Etapa 6, e o registro
de que "precisariam de `argsIgnorePattern`" estava errado — ver o achado 7.

**Os 12 hexadecimais que sobram** estão todos em gráfico: 4 em `OrcamentoContent` e 8 em
`ProgressChart`. Passam no contraste e continuam violando a invariante 1. Ficam para quando a
migração de tokens for o assunto da etapa.

### A regra de contagem das cores, e os três números

O número "165 classes de cor fixa", registrado na Etapa 3 e repetido depois, **não sai de
nenhuma regra escrita**. Recontado nesta etapa, com a regra dita:

| Regra de contagem | Antes da etapa | Depois |
|---|---:|---:|
| `bg-`, `text-`, `border-` + cor da paleta + tom | 153 | 147 |
| **165, o número registrado** | — | — |
| Todas as propriedades de cor (`bg`, `text`, `border`, `ring`, `fill`, `stroke`, `from`, `to`, `via`, `shadow`, `divide`, `outline`, `accent`, `caret`, `placeholder`, `decoration`) | 170 | 164 |

O 165 não é reproduzível por nenhuma das duas. É número sem método, e a regra que o autor
acrescentou ao CLAUDE.md nesta etapa existe por causa dele: todo número registrado vem
acompanhado da regra que o produz.

### As três chaves acentuadas que ficaram, e por quê — resolvidas na Etapa 9

> **Medido em 03/10/2026:** não ficaram mais. `AgendaAtendimentos.tsx` usa identificadores
> (`pedagogicalMeeting`, `assessment`, `familyMeeting`, `multidisciplinary`, `other`), e as três
> cadeias acentuadas sobrevivem em dois lugares, os dois de propósito: a tabela de migração da
> v4 (`store/migrations.ts`), que precisa delas para ler o que está gravado, e uma fixture de
> teste. A linha "Chaves de objeto com acento | 4 | 3" da tabela acima passa a 0 no modelo.

`AgendaAtendimentos.tsx:47-49` **mantinha** `'Reunião Pedagógica'`, `'Avaliação'` e
`'Atendimento Família'` como chaves de objeto, contra a convenção. **Não era esquecimento.**

Esses valores são o tipo `AppointmentType`: são campo do modelo (`Atendimento.tipo`), texto
que aparece na tela, chave do mapa de cores **e dado gravado no `localStorage` de quem já
usou o sistema**. Trocá-los é mudança de modelo com migração de versão do store para v4, em 4
arquivos e 8 pontos.

Decisão do autor: **vão para a Etapa 9, com a entidade PEI.** Migração v4 no meio de uma etapa
de limpeza misturaria remoção com mudança de modelo e contaminaria a prova ponta a ponta.

### O commit do nome do estudante não foi refatoração: era defeito ativo

`2c6a428` entrou na etapa como deduplicação — o nome ficava copiado em três coleções e o
reducer propagava a edição. O contrafactual medido no filtro por aluno da Agenda mostra que
era mais que isso.

Com um registro cujo nome gravado estava desatualizado, a comparação antiga, **nome contra
nome**, devolve falso: o Select oferece o nome do cadastro e o registro guarda outro. O
atendimento **não aparecia**. A comparação nova, id contra id, devolve verdadeiro.

| | nome gravado no registro | nome no cadastro | filtro mantém? |
|---|---|---|---:|
| Lógica antiga (nome × nome) | `NOME ANTIGO GRAVADO` | `Nome Atual Do Cadastro` | **não** |
| Lógica nova (id × id) | idem | idem | sim |

Não é hipótese: é a saída das duas expressões sobre o mesmo estado carregado.

**O que isso muda.** A propagação do `updateStudent` mantinha as três cópias em dia **a partir
do momento em que passou a existir** (`2fb404d`, Etapa 1). Qualquer registro gravado antes
disso, ou por qualquer caminho que não passasse por `student/update`, ficava com o nome velho
— e o filtro da Agenda deixava de mostrá-lo, sem erro, sem aviso, sem nada na tela. Um
atendimento existente sumia de uma busca por aluno.

O defeito estava **ativo e esperando alguém renomear um estudante**. A etapa de limpeza, que
não existia para caçar defeito, entregou a correção de um. Fica registrado com essa
qualificação porque muda o que a Etapa 5 entregou: não foram só remoção e deduplicação.

### O inventário dos arquivos acima de 400 linhas

O BACKLOG listava 6 arquivos, com números defasados. Eram 17 na Etapa 5, depois da remoção de
`ui/sidebar.tsx`. A convenção do CLAUDE.md manda quebrá-los em commits de refatoração
dedicados; quebrar 17 dentro daquela etapa destruiria a prova de regressão, porque cada quebra
move a fotografia por motivo legítimo.

> **Recontado em 03/10/2026, na varredura de coerência. Regra: `wc -l` acima de 400 em
> `src/`, arquivo de teste incluído.** São **16**, e o conjunto mudou — o número tinha ficado em
> 17 por coincidência. Saíram `ObservationDetailDialog` (479 → 272) e `MinhaAgenda` (446 → 217),
> as duas reescritas na Etapa 9; entrou `persistence.test.ts` (422), que cresceu com os testes
> da v4. O `PresentationModeDialog` entrou com 405 linhas **escritas na Etapa 9** e saiu no
> commit de refatoração desta sessão (318 + 137 no player), porque arquivo nascido acima do
> limite é dívida da etapa que o escreveu, não herança.

| Arquivo | Linhas | | Arquivo | Linhas |
|---|---:|---|---|---:|
| `MeuPerfilDialog.tsx` | 817 | | `StudentDetail.tsx` | 494 |
| `AgendaAtendimentos.tsx` | 770 | | `ContributeResourceDialog.tsx` | 494 |
| `Manual.tsx` | 640 | | `OrcamentoContent.tsx` | 459 |
| `NewStudent.tsx` | 610 | | `NewAssessmentDialog.tsx` | 454 |
| `PredictiveAnalysis.tsx` | 604 | | `persistence.test.ts` | 422 |
| `ProgressChart.tsx` | 593 | | `EquipeContent.tsx` | 412 |
| `AlertasRiscosContent.tsx` | 575 | | `NovoAtendimentoDialog.tsx` | 411 |
| `ConfiguracoesDialog.tsx` | 574 | | | |
| `NewObservation.tsx` | 511 | | | |

### O validador do store aceita qualquer objeto com `id`

A mesma frouxidão, com dois efeitos opostos, os dois medidos nesta etapa.

`isRecordList`, em `src/store/persistence.ts`, checa que cada registro é objeto e tem `id`
string. Nada mais: nem campo obrigatório, nem tipo de campo. `isDemoStateV1` acrescenta só o
`kind` das observações.

- **Efeito bom:** foi isso que tornou o commit `2c6a428` barato. Remover `studentName` e
  `aluno` dos tipos não invalidou nada gravado — o campo extra continua no armazenamento e é
  ignorado —, e por isso **não precisou de v4**.
- **Efeito ruim:** duas cargas sintéticas malformadas, montadas à mão para o teste de ida e
  volta, passaram pelo validador e **quebraram a tela**. Um `Student` sem `dataCadastro` derruba
  o `StudentDetail` em `formatLocalDate`; um `Assessment` sem `summary` derruba o
  `StudentAssessmentsCard`. Dado corrompido no `localStorage` de um navegador real produziria
  a mesma tela em branco, e o modo demonstração não tem fronteira de erro.

~~**Pendência, para a Etapa 6 ou 7:** validação de forma no carregamento do store.~~
✅ **Feita na Etapa 6** (`b1d14f2`): sete esquemas `zod` em `src/store/schemas.ts`, descartando
o registro e não o estado, com cascata para referência órfã e contagem por coleção na tela. O
argumento que decidiu a etapa: ligar o `strict` e deixar sem validação justamente o único ponto
por onde dado não tipado entra fecha 95% e para na parte que produziu a única tela em branco
medida.

### A prova de regressão

A etapa remove código, então a verificação principal não é "o novo funciona": é "nada deixou
de funcionar". O arreio está em `scripts/fotografia.js`, com o protocolo no README ao lado.

Quatro medidas por superfície — árvore de acessibilidade reduzida a `papel│nome│estado`,
sequência de números do texto renderizado, ordem de tabulação com o nome de cada parada, e
esqueleto de headings com o `title` —, em 23 superfícies: 13 rotas reais, os 3
redirecionamentos, a rota curinga e as 6 abas de Gestão.

**Regra:** commit que só remove produz diferença zero nas quatro medidas. Commit que corrige
declara antes qual superfície e qual medida podem mexer. Foi cumprida: dos nove commits de
código, sete deram zero e os dois que mudaram alguma coisa mudaram só o que tinham declarado.

**Prova ponta a ponta:** o estado anterior ao primeiro commit da etapa, comparado com o
estado depois da última remoção, deu **diferença zero nas 23 superfícies**.

**Prova de bundle:** para os três commits de remoção de código morto, os quatro chunks saíram
byte a byte idênticos por SHA-256 — o Rollup já não os embarcava, e é isso que separa
"apaguei código morto" de "apaguei código vivo". No commit que tirou o `QueryClientProvider`,
`index.js` encolheu 28.657 bytes e **nenhum dos 761 textos de prosa do bundle sumiu**.

---

## Etapa 6 — TypeScript estrito

Ligar em `tsconfig.json` e `tsconfig.app.json`: `strict`, `strictNullChecks`,
`noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`.

Vai gerar muitos erros. Corrigir **por arquivo**, com commit por lote — não silenciar com
`any` nem `@ts-ignore`. Se um erro revelar bug real (acesso a possivelmente `undefined`),
corrigir o bug, não o tipo.

`noUnusedLocals` e `noUnusedParameters` já estão limpos: a Etapa 5 removeu 30 identificadores
sem uso em `1c84b6f` e 2 em `54f3675`. Sobram os dois `_props` de `ui/calendar.tsx`, que são
deliberados e vão precisar de `argsIgnorePattern`.

~~**Junto vem a validação de forma no carregamento do store.**~~ ✅ feita, em `b1d14f2`. A
decisão foi descartar o registro, com cascata e contagem visível. A alternativa considerada e
recusada — fronteira de erro por rota — é remendo e não validação: esconderia a quebra em vez
de impedir que o dado ruim entre.

**Critério de aceite:** `npm run typecheck` limpo com strict ligado. ✅ atendido.

### Resultado da etapa

Medido pela linha de comando antes do primeiro commit, com as cinco flags passadas
explicitamente e sem editar nada, e de novo depois do último.

| Medida | Antes | Depois |
|---|---:|---:|
| **Erros com as cinco flags, em `tsconfig.app.json`** | **41** | **0** |
| — `noUnusedLocals` + `noUnusedParameters` | 5 | 0 |
| — `strictNullChecks` | 27 | 0 |
| — `noImplicitAny` | 8¹ | 0 |
| — o que só o `strict` traz além disso | 1 | 0 |
| Erros com as cinco flags, em `tsconfig.node.json` | 0 | 0 |
| Flags declaradas como `false` nos três `tsconfig` | 11 | 0 |
| Coleções do store validadas por forma na carga | 0 de 7 | 7 de 7 |
| Registro malformado que derruba a tela | sim | não² |

¹ Uma nona ocorrência, em `ObservationHeatmap.tsx`, era artefato de ligar `noImplicitAny`
sozinho: `() => null` alarga para `any` sem `strictNullChecks`. Com as duas ligadas, some.

² Medido: a mesma carga (semente com `dataCadastro` removido) dava tela em branco em
`/alunos/1` — 0 caractere de texto — e passa a carregar com 511, descartando o registro e
dizendo quantos.

**Distribuição dos 41.** Vinte e sete num arquivo só, `DetalhesAtendimentoDialog.tsx`; oito em
`AgendaAtendimentos.tsx`, todos vindos de `react-big-calendar` não ter tipos; três de
declaração de import sem uso; dois `_props`; um de `activeShape` do Recharts.

### Ruído e bug: a classificação, e o que ela mostrou

**Bugs de runtime que quebrariam a tela hoje: zero.** Nenhum dos 41 erros é acesso a
`undefined` que ocorra na prática — e dizer o contrário seria inflar gravidade.

**Os 27 do `DetalhesAtendimentoDialog` são armadilha latente, nem ruído nem bug.** A prop era
`Atendimento | null` e a primeira linha do corpo desreferenciava `atendimento.id` sem guarda.
Não quebra hoje porque o único ponto de chamada renderiza dentro de
`{selectedAtendimento && ...}`. O que o compilador apontou foi um **contrato que mente sobre o
próprio uso**: o componente declarava aceitar `null` e não sobrevivia a `null`.

**Os 8 do calendário são ruído com consequência:** sem tipos, `event.resource` — passado direto
ao manipulador de clique — não era checado por nada.

**Os 6 restantes são ruído puro**, e três deles eram sobra da Etapa 5 (ver achado 7).

**O bug de verdade não estava entre os 41.** A única tela em branco medida nesta série vem de
registro malformado no `localStorage`, e **nenhuma das cinco flags a pega**: o tipo declara
`dataCadastro: string` e o validador só olhava o `id`. O `strict` faz o compilador exigir os
tipos declarados em todo lugar menos no único ponto em que dado não tipado entra. Foi por isso
que a validação de forma entrou nesta etapa, e não na seguinte.

### A validação de forma no carregamento

`src/store/schemas.ts`, sete esquemas `zod` — dependência que já existia e já era usada em dois
formulários. Cada um anotado como `z.ZodType<T>`, com o tipo de `@/types` como fonte: tirar um
campo do esquema faz o compilador reprovar, o que foi medido.

**Descarta o registro, não o estado**, com cascata para referência órfã, e **a contagem por
coleção aparece na tela**. Um registro estragado não deve custar tudo o que a pessoa digitou; e
descarte silencioso é perda de dado sem aviso. "Descartei 3 observações" e "sumiram 3
observações" são coisas diferentes, e é o número que separa as duas.

**Derivar o tipo do esquema com `z.infer`** seria o desenho certo — uma fonte só, em vez de
duas mantidas em acordo pelo compilador. Reescreve `types/index.ts` inteiro. Estava registrado
para a Etapa 9, **ficou de fora dela** e hoje é etapa própria: com a v4, são onze pares
esquema/tipo em vez de sete, ou seja, a dívida cresceu.

---

## Etapa 7 — Testes

Vitest 3.2 + Testing Library + jsdom. `npm test` entra no CI entre o `typecheck` e o `build`.

### Resultado da etapa

**70 testes em 7 arquivos**, um lote por commit.

| Commit | Arquivo | Testes | O que cobre |
|---|---|---:|---|
| `c152869` | `src/test/arreio.test.ts` | 3 | o andaime: falsificação, e a medida de que jsdom não calcula layout |
| `348d77c` | `src/store/persistence.test.ts` | 14 | envelope, migrações v1→v2→v3, chave acentuada legada, descarte de registro, cascata, contagem por coleção |
| `78eeb41` | `src/lib/date.test.ts` | 13 | `parseLocalDate`, `calculateAge`, `toLocalISODate`, `formatLocalDate`, e o pino de fuso |
| `f40f9e4` | `src/lib/metrics.test.ts` | 19 | `periodChange`, períodos, `studentProgress`, `studentNameOf`, notas, `earnedBadges` |
| `8ccdc43` | `src/store/reducer.test.ts` + `src/test/rotas.test.ts` | 17 | 14 ações do reducer e o grafo de navegação |
| `4d41796` | `src/test/fluxo.test.tsx` | 4 | cadastro de aluno e registro de observação até a listagem, na árvore React inteira |

### O escopo: só o que as Etapas 1 a 6 corrigiram

Decisão do autor, com o argumento registrado porque limita o que a suíte pode afirmar.

Cobrir o código todo seria começar pelo que nunca deu defeito e terminar no meio. Cobrir o que
foi corrigido tem um critério claro — cada teste nasce de um defeito que existiu, com o valor
errado antigo asseverado — e uma dívida explícita: **o resto do código não tem teste**. Não há
porcentagem de cobertura neste registro nem no README, de propósito: cobertura mede linha
executada, e linha executada não é defeito travado. O número que vale é o absoluto, e a frase
que o acompanha é o que ficou de fora.

### As três camadas de controle positivo

1. **A suíte reprova quando não há teste.** `passWithNoTests: false` no config, medido: com o
   `include` apontando para um padrão que não casa nada, `npm test` sai com código 1.
2. **Mutação no código de produção.** Antes de aceitar cada lote, o defeito que o teste diz
   pegar é plantado no código real, a suíte tem de **reprovar**, e o arquivo volta ao original.
   > **Os scripts foram versionados em 03/10/2026, em `scripts/mutacoes/`** — decisão do autor
   > na varredura de coerência: número que um leitor não consegue reproduzir não é medida, e
   > este era o mais citado da série. **Dos 74 do conjunto, 47 estão lá.** Os 27 desta etapa
   > viviam no diretório temporário da sessão e **não sobreviveram** a ela; o resultado está
   > registrado aqui e nas mensagens dos commits, e não é reproduzível a partir do repositório.
   > **Não serão reescritos, por decisão do autor em 03/10/2026** (Pendências abertas, item 4):
   > mutação escrita a partir do teste de hoje casa com o que o teste faz hoje, não com o defeito
   > que ele pegava em 18/09 — quatro dos seis arquivos de teste mudaram desde então e o
   > `studentProgress` que seis delas atacavam foi reescrito. **47 reproduzíveis e 27 atestadas**
   > é o que o repositório pode afirmar.
   **27 mutações na etapa, todas acusadas na verificação final** — 4 na persistência e nas
   migrações, 3 nas datas, 6 nos seletores, 5 no reducer, 3 nas rotas e 6 no fluxo. Uma delas,
   a que apaga uma rota, **não** foi acusada quando foi plantada pela primeira vez, e o que ela
   revelou foi defeito no próprio teste (achado 11). Cada mutação assevera que a substituição
   casou exatamente uma vez, senão aborta: substituição que não casa é quebra que nunca foi
   plantada.
3. **Falsificação dentro de cada arquivo.** Todo teste de correção assevera também o valor
   errado antigo — `calculateAge` comparado com a conta que produzia o defeito, `periodChange`
   comparado com o `+100%` inventado —, e as varreduras asseveram que enxergam o que procuram
   antes de afirmar que não acharam nada.

### O que continua no arreio, e não virou teste

A fotografia de superfície (`scripts/fotografia.js`) **não migra** para a suíte, e o motivo é
medido, não estimado: as quatro medidas dela dependem de `checkVisibility`, `innerText` e
`getBoundingClientRect`, e jsdom não calcula layout. Na aba Orçamento, **28 dos 79 elementos
semânticos e 13 dos 96 números** só ficam de fora da contagem porque o navegador calcula layout
e o Radix mantém montado o conteúdo das abas fechadas. Em jsdom essas medidas não discriminam:
não é que ficariam piores, é que mediriam outra coisa. A conta está em `src/test/setup.ts`.

### A decisão do navegador headless: fica separada

**Playwright/Puppeteer no CI não entra nesta etapa, e não é esquecimento.** O argumento, para
quem ler depois:

- O que um headless acrescentaria aqui é a fotografia de superfície rodando sozinha. Mas o
  valor dela é o **hash que muda**, e hash que muda diz *que* algo mudou, não *o quê*. Como
  portão de CI, cada mudança legítima de interface reprovaria o build, e um portão que reprova
  por motivo legítimo com frequência é um portão que as pessoas aprendem a ignorar.
- O arreio é o instrumento mais confiável do projeto — é o que pegou o próprio defeito duas
  vezes — e ele funciona porque é **conduzido**: quem roda declara antes qual superfície pode
  mover e por quê. Automatizar tira exatamente essa parte.
- A varredura de acessibilidade com `axe-core` (vinda da Etapa 3) tem o mesmo problema mais um:
  o axe erra nas duas direções (acusou contraste 1,04:1 num gradiente que vai de 10,65:1 a
  5,96:1), então precisa de revisão humana em vez de virar critério de aprovação cego.

Decisão: **depois de a suíte existir**, avaliar headless como etapa própria, com o
custo declarado (três a quatro dependências novas, tempo de CI bem maior) e o desenho de como
evitar o portão barulhento. Não é pendência desta etapa.

### Mutação automatizada: candidata a etapa futura

As 27 mutações desta etapa foram escritas à mão, uma a uma, com o alvo escolhido pelo que o
teste diz pegar. (Este parágrafo dizia **18** até a varredura de coerência de 03/10/2026: a
recontagem por script está no achado 11 desde a própria Etapa 7, e o número velho ficou aqui
sem ninguém notar — o registro corrigido num lugar e intacto no outro.) Uma ferramenta de mutação (Stryker) geraria centenas automaticamente e mediria
quantas a suíte sobrevive — que é a medida honesta de força de suíte, no lugar da porcentagem
de cobertura. É trabalho de uma etapa inteira sozinha (configuração, tempo de execução, triagem
de mutantes equivalentes), e fica registrada como **candidata**, não como pendência: a suíte
atual não depende dela para valer o que afirma.

### A versão do Vitest, e o que a destrava

`vitest` 5 exige `vite` ^6 e o projeto está no `vite` 5.4.21 — o `npm install` reprova com
ERESOLVE. `vitest` 4 instalaria um **segundo `vite`** no `node_modules`, o que faria a suíte
rodar sobre uma resolução de módulos diferente da do aplicativo. Escolhido `vitest` 3.2.x, que
reusa o `vite` do projeto (conferido: um `vite` instalado). Nenhum `--legacy-peer-deps`. Subir
o `vite` na Etapa 8 destrava o `vitest` 5. **Resolvido na Etapa 8:** `vitest` 4.1.11 sobre `vite`
6.4.3, com um único vite — a duplicação só existia enquanto o projeto estava no vite 5.

---

## Etapa 8 — Manutenção de dependências

Só depois da Etapa 7. Todas as correções exigem versão major, e sem testes a quebra
passa por lint, typecheck e build sem ser vista.

**Critério de aceite:** `npm audit` sem advisory alta ou moderada, as quatro verificações
passando, o arreio com diferença zero no `dev` e no `preview`, e as mutações acusadas. ✅
atendido — com a prova final no CI do PR, que roda `npm ci` com o npm do setup-node.

### Resultado da etapa

Medido no início, antes do primeiro commit, e de novo depois do último.

| Medida | Antes | Depois |
|---|---:|---:|
| **Entradas no `npm audit`** | **6** | **0** |
| — alta | 1 | 0 |
| — que chega ao bundle de produção | 1 | 0 |
| `react-router-dom` | 6.30.6 | 7.18.4 |
| `vite` | 5.4.21 | 6.4.3 |
| `vitest` | 3.2.7 | 4.1.11 |
| Cópias de `vite` no `node_modules` | 1 | 1 |
| Destinos de navegação que a varredura de rotas não via | 6¹ | 0² |
| Testes | 70 em 7 arquivos | 73 em 7 arquivos |
| Mutações, acusadas de quantas plantadas | 27 de 27 | 30 de 30³ |
| Fotografia de superfície, 23 superfícies | — | diferença zero em cada commit⁴ |
| Bundle JS, bytes em `dist/assets` | 1.800.472 | 1.833.161 (+32.689)⁵ |
| Node declarado no README | 18+ | 22.13+ ou 24+⁶ |

¹ 3 destinos não literais sem nome (Header ×2, ResourcesPanel) e os 3 `<Navigate>` de
`App.tsx`, que nenhuma varredura contava. ² Os 3 não literais listados pelo nome; os 3
`<Navigate>` varridos e resolvidos. ³ Reexecutadas no `vitest` 4.1.11, com os três controles do
runner comparados à linha de base do 3.2.7 (abaixo). ⁴ No `dev` nos commits 1 a 3, e no
`preview` — o `dist/` servido — nos commits do `vite` e do `vitest`. ⁵ +55 do commit 1, +18.153
do router, +14.481 do vite, 0 do vitest. ⁶ Medido pelos 324 campos `engines` instalados; ver
abaixo.

| Commit | Degrau | Audit | Fotografia |
|---|---|---|---|
| `72becab` | flags do react-router 7 ligadas no 6 | 6 | zero (dev); avisos de future flag 2 → 0 |
| `97d636b` | `react-router-dom` 7.18.4 | 6 → 4 | zero (dev) |
| `321ab87` | sítios × capturados no teste de rotas | 4 | — (só teste) |
| `aca509b` | `vite` 6.4.3 | 4 → 2 | zero (dev e preview) |
| `70dee2e` | `vitest` 4.1.11 | 2 → 0 | zero (preview); build byte a byte idêntico |

**Os três controles do runner, antes e depois da troca.** Medidos no 3.2.7 **antes** de trocar,
para existir linha de base, com o mesmo script depois:

| Controle | `vitest` 3.2.7 | `vitest` 4.1.11 |
|---|---|---|
| suíte normal | saída 0, 73 passam | saída 0, 73 passam |
| zero testes coletados (`passWithNoTests: false`) | saída 1 | saída 1 |
| `TZ=UTC` de fora, com o pino no config | 73 passam | 73 passam |
| `TZ=UTC`, **sem** o pino | 3 reprovam, o do fuso incluído | 3 reprovam, o do fuso incluído |

O pino de fuso da Etapa 7 — o modo de falha silencioso mais grave que a suíte já teve — continua
vencendo a variável externa, e o teste que o trava continua acusando a ausência dele.

### O npm audit final: zero

Nenhuma advisory restante, então nenhuma a justificar. A de hidratação SSR do react-router
(GHSA-337j-9hxr-rhxg), que não se aplicava porque o projeto não faz SSR, saiu junto com a outra
no commit do router.

### O estado no início (19/09/2026): 6 entradas, 5 moderadas e 1 alta

Eram 4 em 13/09. A regra de contagem: entradas que o `npm audit` lista, uma por pacote
afetado, contadas do `npm audit --json`.

| Pacote | Severidade | Advisories | Onde age |
|---|---|---|---|
| `vite` 5.4.21 (direto) | **alta** | GHSA-fx2h-pf6j-xcff (`server.fs.deny` em caminho alternativo no Windows), GHSA-4w7w-66w2-5vf9, GHSA-v6wh-96g9-6wx3 | servidor de desenvolvimento; não entra no `dist/` |
| `esbuild` (via `vite`) | moderada | GHSA-67mh-4wv8-2f99 | servidor de desenvolvimento |
| `react-router` / `react-router-dom` 6.30.6 | moderada ×2 | GHSA-wrjc-x8rr-h8h6 (open redirect com `\`); GHSA-337j-9hxr-rhxg (hidratação SSR) | a primeira **chega ao bundle de produção**; a segunda não se aplica |
| `vitest` / `@vitest/mocker` 3.2.7 | moderada ×2 | GHSA-82fw-gwwq-j7x9 (path traversal no mock redirect) | **novas** |

**As duas novas vieram da Etapa 7.** A etapa que trouxe a suíte de testes trouxe advisory
junto: `vitest` e `@vitest/mocker` não existiam no `node_modules` antes dela. São de
desenvolvimento e não chegam ao `dist/`, mas ficam registradas sem suavização, porque são
parte honesta do custo de adicionar ferramenta. Quem acrescenta dependência acrescenta
superfície, inclusive a dependência que serve para verificar o resto.

**E uma correção de número, pela regra de que todo número vem com a regra que o produz.**
Estava registrado aqui que "a correção só vem com `vite` 8.x". Esse número era o
`fixAvailable` do `npm audit`, que aponta a **última** versão, não a **mínima** que corrige.
O intervalo vulnerável medido é `vite <= 6.4.2`: quem zera as quatro advisories de
vite/esbuild é o **`vite` 6.4.3**, que traz `esbuild ^0.25`. Ir ao 8 custaria
`@vitejs/plugin-react-swc` 4 e `vitest` 5 no mesmo commit — três majors de uma vez, por um
número que ninguém tinha perguntado de onde vinha.

Na mesma instalação, `eslint` 9.39.5 aparece como fora de suporte e `recharts` 2.x como
branch inativa (v3). Nenhum dos dois tem advisory.

### O gatilho do open redirect: medido, continua latente

A Etapa 4 registrou que a advisory de open redirect é **latente**, e passa a valer no instante
em que um destino de navegação deixar de ser literal. As Etapas 5, 6 e 7 mexeram em rotas, então
a condição foi medida antes de subir o pacote:

```
sítios <Link to=>: 16 | capturados pela varredura da Etapa 7: 13
sítios navigate():  11 | capturados: 11
```

Os três não capturados são `to={item.path}` (Header, ×2) e `to={resource.link.to}`
(ResourcesPanel) — **os três vêm de arrays literais no próprio arquivo**. Nenhum destino vem de
entrada do usuário, de parâmetro de URL ou de texto livre do store, e os dinâmicos
(`/alunos/${id}`, `/relatorio?${params}`) têm prefixo literal, então não podem começar com `\`,
que é o vetor. **O gatilho não foi puxado.**

Mas a medição achou o buraco no instrumento: **a varredura de rotas da Etapa 7 é cega justamente
à forma que tornaria a advisory viva** — `to={variavel}` e `navigate(variavel)` não casam os
regexes dela e somem sem avisar. Por isso a asserção de "sítios × capturados" entra nesta etapa,
com os três conhecidos listados nominalmente, em vez de ficar para a Etapa 9: deixar para depois
é manter o gatilho dependendo de alguém lembrar dele.

**E o medidor nasceu cego — quarta vez da asserção de casamento único nesta série, e a mais
irônica: o instrumento feito para verificar precisou ser verificado.** O regex exigia dois
espaços onde havia um, e o medidor devolveu "2 sítios, 13 capturados", números impossíveis que
eu poderia ter lido como "nada a ver aqui". Quem disse que ele estava cego foi o controle
plantado junto dele, que planta um destino não literal e exige que o medidor acuse. Está no
achado 11, com as outras três.

**O gatilho virou teste em `321ab87`.** `src/test/rotas.test.ts` conta todo sítio de navegação
— toda abertura de `<Link` e `<Navigate`, toda chamada `navigate(` — e exige que todo sítio não
capturado esteja numa lista, pelo nome. Um quarto destino não literal reprova. Foram duas
extensões além do pedido, as duas por buraco medido: o `<Navigate>`, que nenhuma varredura
contava (achado 12), e o apelido de `useNavigate()`, que tiraria as chamadas da contagem. Cada
guarda tem mutação própria no código de produção, e o conjunto foi de 27 para 30.

### A escada, e por que nesta ordem

Quatro commits, um major por commit, e o acoplamento medido pelos intervalos declarados nos
pacotes:

| # | O quê | Tipo | Instrumento estável durante o commit |
|---|---|---|---|
| 1 | `v7_startTransition` e `v7_relativeSplatPath` ligadas no react-router 6 | comportamento, sem versão | suíte e arreio, intactos |
| 2 | `react-router-dom` 6.30.6 → 7.18.4 | major, código de aplicação | suíte e arreio, intactos |
| 3 | `vite` 5.4.21 → 6.4.3 | major, ferramenta | suíte (roda através do vite) |
| 4 | `vitest` 3.2.7 → 4.1.11 | major, o próprio runner | as 30 mutações e os controles do runner |

**Router antes do vite.** Nos commits 1 e 2 o instrumento inteiro — vite 5 + vitest 3.2,
conhecidos e verdes — fica fixo, e qualquer vermelho tem uma causa só. Na ordem inversa, a
suíte que provaria o router estaria sob a mudança que se quer verificar: é o achado 8 aplicado
antes de acontecer, em vez de explicado depois.

**`vitest` 4.1.11, não 5.** O 4.1.11 é o mínimo que corrige GHSA-82fw-gwwq-j7x9 (vulnerável até
4.1.10), aceita node 20 e 22 (o 5 exige ^22.12) e é linha mais rodada que um `5.0.1` recém-saído.
Com `vite` 6.4.3 o peer dele (`^6 || ^7 || ^8`) fica satisfeito e continua existindo **um** vite.
Isso corrige também uma afirmação da Etapa 7: o `vitest` 4 só duplicaria o vite porque o projeto
estava no vite 5; a partir do 6 a duplicação não existe.

**O arreio contra o `preview`, nos commits 3 e 4.** Major de vite quebra empacotamento, e
"compila" não é "roda": hoje o arreio mede o servidor de desenvolvimento e o `npm run build` só
prova que o build termina. Os commits 3 e 4 medem também o `dist/` servido por `npm run preview`.
Parâmetro de porta no arreio e nada mais.

### A segunda escada: `vite` 7/8, depois — não é meta abandonada

Parar no 6.4.3 zera as advisories; seguir adiante é manutenção, não segurança. O acoplamento,
medido nos `package.json` dos pacotes, é o que define o degrau seguinte:

| Pacote | Aceita |
|---|---|
| `@vitejs/plugin-react-swc` 3.11 | `vite ^4 \|\| ^5 \|\| ^6 \|\| ^7` |
| `@vitejs/plugin-react-swc` 4.3 | `vite ^4 \|\| ^5 \|\| ^6 \|\| ^7 \|\| ^8` |
| `vitest` 3.2.7 | `vite ^5 \|\| ^6 \|\| ^7` (dependência direta) |
| `vitest` 4.1.11 | `vite ^6 \|\| ^7 \|\| ^8` |
| `vitest` 5.0.1 | `vite ^6.4 \|\| ^7 \|\| ^8`, node `^22.12 \|\| ^24 \|\| >=26` |
| `vite` 7 e 8 | node `^20.19 \|\| >=22.12` |

Ou seja: **`vite` 7 cabe sem trocar mais nada** (plugin 3.11 e vitest 4.1.11 já o aceitam), e
**`vite` 8 exige o plugin 4 junto**. O CI roda node 22, que satisfaz os dois. Fica como etapa
própria, com o mesmo critério: um major por commit, arreio no `dev` e no `preview`, e as
mutações reexecutadas se o runner se mexer.

Duas ferramentas desta etapa ficam prontas para ela, e devem ser reusadas em vez de
reinventadas: o **procedimento de alcançabilidade** do lockfile (abaixo), para provar que o
diff de cada degrau não sai do fechamento de dependências do pacote atualizado; e o
**procedimento de dois npms** do achado 13, se a geração do lockfile voltar a quebrar por dentro.

**O gatilho, para isto não ficar como meta vaga.** A segunda escada **não** se abre por o 7 e o
8 existirem. Ela se abre quando uma destas duas coisas acontecer:

1. **Uma advisory nova** atingir o `vite` 6.4.x — aí a escada volta a ser segurança, e vale o
   custo de subir. **Reescrito em 03/10/2026 pela propriedade**, depois que uma advisory nova
   atingiu outro subtree e esta condição não se aplicou a nada: ver "O gatilho da segunda escada,
   reescrito pela propriedade", abaixo.
2. **O `vitest` 5 passar a valer a pena** por motivo próprio (um recurso que a suíte precise, ou
   o 4 sair de suporte). Ele exige `vite` ^6.4, que já está satisfeito, então nesse caso o
   `vitest` sobe sozinho; o `vite` 7/8 só entra se o 5 vier a exigir.

Fora desses dois casos, subir é manutenção sem medida que a justifique, e cada major custa uma
sessão de verificação. Enquanto nenhum dos dois acontecer, o estado correto é este: `vite` 6.4.3
e `vitest` 4.1.11, com o acoplamento acima registrado para quando o gatilho vier.

### O advisory do `braces`, pela cadeia do Tailwind (03/10/2026) — custo declarado

Um dia depois de a Etapa 9 fechar com o `npm audit` em zero, ele voltou a 5. **Nada mudou no
projeto**: um advisory novo foi publicado.

| Medida | Valor |
|---|---|
| Entradas | **5, todas altas** — `braces`, `chokidar`, `micromatch`, `fast-glob`, `tailwindcss` |
| Regra de contagem | a da Etapa 8: uma entrada por pacote afetado, do `npm audit --json` |
| Advisory | `GHSA-vfj7-8cjw-p6xm` — exaustão de pilha no `braces` com padrão muito aninhado |
| Caminho, medido com `npm ls braces` | `tailwindcss 3.4.19 → chokidar 3.6.0 / micromatch 4.0.8 → braces 3.0.3` |
| Chega ao bundle? | **não** — `tailwindcss` é `devDependency` e produz CSS; nada dessa cadeia é empacotado |
| `npm audit fix` sem `--force` | não muda nada: não há versão corrigida do `braces` |
| `npm audit fix --force` | instalaria **`tailwindcss` 4**, major com quebra declarada pelo próprio npm |

**Decisão do autor em 03/10/2026: custo declarado, não etapa.** É ferramenta de build, não chega
a quem usa o sistema, e não existe correção em patch — trocar por um major do Tailwind para
responder a um DoS em padrão de glob de build é pagar mais caro que o risco.

**O gatilho:** abre quando houver versão corrigida **sem major** (o `braces` ganhar correção, ou
o Tailwind 3.4.x passar a aceitar uma), **ou** quando o Tailwind 4 valer por motivo próprio. Não
abre por o 4 existir.

### O gatilho da segunda escada, reescrito pela propriedade

O gatilho registrado na Etapa 8 dizia: *"uma advisory nova atingir o `vite` 6.4.x"*. Em
03/10/2026 uma advisory nova atingiu o projeto — e **no subtree do Tailwind**. Pela letra, o
gatilho não abriu; pela propriedade que ele queria garantir — *o projeto passou a carregar risco
que a escada resolveria* —, a pergunta nem se aplicava, porque a escada do vite não resolve nada
do Tailwind.

**É o achado 14 outra vez, e o autor registra a atribuição como sua**: condição de verificação
escrita **pelo nome do pacote** em vez da propriedade. Lida pelo nome, ela só dispara para um
subtree; o resto do fechamento de dependências fica fora do radar sem que ninguém decida isso.

**A redação que fica:**

> A segunda escada (`vite` 7/8) abre quando **o projeto passar a carregar advisory alta ou
> moderada sem correção em patch** cuja remediação seja subir o `vite`, **ou** quando o
> `vitest` 5 passar a valer a pena por motivo próprio. Advisory em outro subtree é avaliada no
> subtree dela, com a mesma pergunta: existe correção sem major? Se não existir, vira custo
> declarado, com o caminho medido e o gatilho escrito.

Assim a condição passa a ser sobre **o que o projeto carrega**, e não sobre onde o problema
nasceu — e um advisory novo sempre encontra uma regra que o avalia, em vez de cair fora de todas.

**Regras:**
- Nunca `npm audit fix --force`. Uma major por commit (`Update:`), com as quatro verificações
  passando e `rm -rf node_modules && npm ci` antes delas.
- `recharts` v3 mexe nos gráficos da Etapa 3: conferir de novo nome acessível e tabela
  equivalente. Fora desta etapa — não tem advisory.
- `vite` major: conferir que o `manualChunks` da Etapa 0 continua valendo e que o bundle
  principal não volta a crescer. Medido no commit do vite: mesmos quatro chunks, principal +308
  bytes.
- Trocar o runner é ligar outra opção de verificação: **reexecutar as mutações** e os três
  controles do runner, com linha de base medida **antes** da troca. Verde com runner novo é
  indistinguível de verde com runner que não reprova mais nada.
- O diff do lockfile se confere por **alcançabilidade**, não pelo nome dos caminhos (achado 14).

### O que não entrou, e por quê

Duas coisas que eu propus, com justificativa plausível, medidas, e fora:

- **`react-router` no `manualChunks`** (commit do router). A justificativa: no 7 o código vive
  no `react-router`, e sem nomeá-lo ele cairia no chunk principal. **Plausível, medida nos dois
  lados, falsa**: com e sem a linha o bundle sai idêntico, mesmos nomes com hash de conteúdo e
  mesmos bytes — o rollup já arrasta o subtree pela reexportação. A linha foi revertida.
  Comentário que explica um efeito inexistente é pior que nenhum.
- **Um parâmetro de porta no arreio**, para medir o `preview`. Medido: `scripts/fotografia.js`
  não tem referência a origem, porta, `/src/` nem `import.meta` — tudo é relativo à página. O
  `preview` precisou de procedimento, não de código, e o procedimento está em
  `scripts/README-fotografia.md`. Mesmo motivo do `manualChunks`: parâmetro que não faz nada não
  entra.

### Custos declarados, sem ação

- **+18.208 bytes no chunk `react`** (162.860 → 181.068), do `react-router` 7. É o custo do
  major que fecha a única advisory que chegava ao bundle.
- **+14.481 bytes no JS total** do `vite` 6.4.3, dos quais **+12.029 no chunk `charts`** (83%).
  **A causa não foi medida.** Um bundler novo muda minificação, interoperação de CommonJS e
  resolução de pacote, e qualquer das três explicaria o número. Fica registrado como não medido,
  que é melhor do que explicado por palpite. Medir exigiria construir as duas versões lado a lado
  e comparar a contribuição de cada módulo.

### O procedimento de alcançabilidade do lockfile

Para provar que o diff de um lockfile não sai do fechamento de dependências do pacote
atualizado. Pelo nome dos caminhos não serve: num lockfile achatado, as dependências do pacote
moram em `node_modules/<nome>` (achado 14).

**1. Listar o que mudou**, comparando as entradas `packages` do lock do `HEAD` com as da árvore
de trabalho: caminho adicionado, removido, ou com versão, `resolved`, `integrity` ou
dependências diferentes.

**2. Para cada caminho mudado, perguntar se ele é alcançável sem o pacote.** Tira-se o nó do
pacote do grafo e percorre-se a partir da raiz; o que não for alcançado só existe por causa
dele. O caminho removido se confere no lock velho; o adicionado e o alterado, no novo.

```js
// pkgs = lock.packages; corta toda aresta que chegue ao pacote atualizado
const alcancaveisSem = (pkgs, cortado) => {
  const resolver = (de, nome) => { // regra do Node: procura node_modules subindo
    for (let base = de; ; ) {
      const alvo = (base ? base + '/' : '') + 'node_modules/' + nome;
      if (pkgs[alvo]) return alvo;
      if (!base) return null;
      const i = base.lastIndexOf('/node_modules/');
      base = i < 0 ? '' : base.slice(0, i);
    }
  };
  const vistos = new Set(['']), fila = [''];
  while (fila.length) {
    const atual = fila.shift(), e = pkgs[atual];
    const deps = { ...e.dependencies, ...e.optionalDependencies, ...e.peerDependencies,
      ...(atual === '' ? e.devDependencies : {}) };
    for (const nome of Object.keys(deps)) {
      const alvo = resolver(atual, nome);
      if (alvo && alvo !== cortado && !vistos.has(alvo)) { vistos.add(alvo); fila.push(alvo); }
    }
  }
  return vistos;
};
```

**3. Controle nos dois sentidos, antes de ler o resultado.** Um pacote que o aplicativo usa de
verdade (`react`, `vite`, `@testing-library/jest-dom`) tem de sair **alcançável**; o próprio
pacote e dependências que só ele tem (`vitest`, `@vitest/runner`, `@vitest/expect`) têm de sair
**exclusivos**. Sem os dois, "exclusivo" pode ser o medidor que não percorre nada.

**4. Conferir à parte que nenhuma dependência direta do aplicativo mudou de versão**, e que na
raiz do lock só muda a faixa do pacote atualizado.

Medido no commit do `vitest`: 26 caminhos mudados, 18 deles fora de `vitest`/`@vitest/*` pelo
nome, **os 18 exclusivos, 0 compartilhados**, nenhuma das 37 dependências do aplicativo alterada.
O trecho acima foi executado como está escrito aqui, contra o diff desse commit, e reproduz o
resultado com os dois controles passando.

### O pré-requisito de Node estava errado desde a Etapa 7

O README e o guia de contribuição — hoje `docs/DESENVOLVIMENTO.md` — diziam "Node.js 18+". Medido pelos campos `engines.node` de
todos os pacotes instalados — 324 deles têm um —, com o `semver` do próprio `node_modules`:

| Node | Pacotes que recusam |
|---|---:|
| 18.20 | 25 |
| 20.19 | 1 (`@testing-library/jest-dom` 7, `>=22`) |
| 21.7 | 16 |
| 22.12 | 2 (`jsdom` 29 e `eslint-visitor-keys` 5, `^22.13`) |
| 22.18 | 0 |
| 23.0 | 10 |
| 24, 26 | 0 |

O mínimo é **22.13, ou 24+**; as ímpares 21 e 23 não servem. Quem fixou isso foram o `jsdom` 29 e
o `@testing-library/jest-dom` 7, que entraram em `c152869`, o primeiro lote da **Etapa 7** — ou
seja, a afirmação era falsa havia uma etapa, e nenhuma verificação a pegava: o CI roda o node 22
mais recente, e o npm só avisa sobre `engines` enquanto `engine-strict` estiver desligado, que é
o padrão (conferido nesta máquina: `false`). Os dois documentos foram corrigidos, e o `package.json` passou a declarar
`engines.node` em `09a4d24`, a pedido do autor: o erro aparece na instalação e não no primeiro
`npm test`.

**A faixa declarada é a medida: `^22.13.0 || >=24.0.0`.** O primeiro commit trouxe `>=22.13`, mais
simples de ler, e o autor a trocou pela medida com o argumento que decide: `>=22.13` admite o
node 23, que **10 pacotes instalados recusam** nos próprios `engines`, então quem instalasse no 23
receberia dez avisos de pacote e nenhum do projeto. **Erro localizado vale mais que faixa
legível.** Conferida caso a caso contra a varredura, com o `semver` do próprio `node_modules`:
recusa 20.19, 21.7, 22.12, 23.0 e 23.11; aceita 22.13, 22.18, 24.0 e 26.0 — exatamente a tabela
acima.

**Medido, porque declarar só vale se o npm ler o campo:** com uma faixa plantada `>=99.0.0`,
`npm install --dry-run` emite `npm warn EBADENGINE Unsupported engine`; com a faixa real e node
22.18, não emite nada; e a mesma faixa plantada com `--engine-strict` sai com código 1. Ou seja,
o efeito padrão é AVISO, e vira erro só com `engine-strict`, que **não** foi ligado — fazer a
instalação de terceiros reprovar é decisão de política, não de registro.

---

## Etapa 9 — Decisões de produto

**Vem ANTES dos nove testes manuais** (M1 a M9, na Pendência 1), por decisão do autor em
02/10/2026: esta etapa mexe nas telas que os nove cobrem, então executá-los no estado final mede
uma vez e o resultado vale para o sistema que fica. O registro anterior dizia o contrário, e está
substituído na Pendência 1, com a razão — ordem escrita e ordem praticada não podem divergir.

Registradas durante a Etapa 2, que tratou os controles sem mudar o que o sistema modela.

1. **PEI como entidade.** ✅ **Executado** — ver "Resultado da etapa", abaixo. O texto do plano
   fica como foi escrito, no presente de quando foi escrito.

   O sistema se chamava Gestão PEI e não possuía entidade PEI. Metas, revisões e histórico eram
   conteúdo fixo, e o `VerPEIDialog` mostrava um PEI de exemplo, com aviso, igual para qualquer
   estudante.
   Editar PEI, Nova Revisão, "Adicionar observação" na meta e "Ver ata" ficam desabilitados.
   Modelar o PEI dá sentido ao nome do sistema: metas, prazos, responsáveis, revisões e
   evidências ligadas a observações, avaliações e atas de atendimento.
   - Afeta o Histórico, a Apresentação, os objetivos citados nas observações e o relatório
     imprimível.
   - Exige mudar o modelo de dados e subir a versão do store, com migração.
   - **Junto iria o `z.infer`** — e não foi: ficou de fora por tamanho, e está em "O que a
     etapa NÃO fez". A Etapa 6 criou `src/store/schemas.ts` com sete esquemas `zod`
     anotados como `z.ZodType<T>`, com os tipos de `@/types` como fonte. São duas declarações
     do mesmo formato, mantidas em acordo pelo compilador. O desenho certo é uma fonte só, com
     o tipo derivado do esquema por `z.infer`; isso reescreve `types/index.ts` inteiro e cabe
     junto da modelagem do PEI, não antes dela.
   - **Junto vai o `AppointmentType`** (`AgendaAtendimentos.tsx:47-49`): `'Reunião Pedagógica'`,
     `'Avaliação'` e `'Atendimento Família'` são chaves de objeto com acento, contra a
     convenção, e ao mesmo tempo campo do modelo, texto de tela, chave do mapa de cores e dado
     gravado no `localStorage` de quem já usou. Separar identificador de rótulo exige migração
     para a v4. Deixado fora da Etapa 5 por decisão do autor: migração de modelo no meio de uma
     etapa de limpeza misturaria remoção com mudança de modelo e contaminaria a prova de
     regressão. Não é esquecimento.

2. **Minha Agenda.** Na Etapa 2, a tela ficou como exemplo rotulado, com todas as ações
   desabilitadas. A opção preferida é a (a'): mostrar os atendimentos do store e tirar o
   formulário de evento. Antes, responder: existe agenda pessoal separada dos atendimentos
   (planejamento, formação, tarefas)? Se existir, o caminho é uma entidade nova de evento e
   tarefa, e não a (a').

### Decisões de modelo tomadas na execução (commit `448fa6b`)

Duas decisões que o plano aprovado não previa, tomadas durante a modelagem e aprovadas depois,
mais um controle que precisou ser corrigido no caminho. Ficam aqui porque quem ler o código vai
encontrar as três e não vai encontrar o motivo nelas.

**1. As coleções do PEI entram vazias na v4**, contra o precedente da v1->v2, que preencheu
coleção nova com as fixtures. Registrado no **achado 15**: é o primeiro caso da série em que um
achado anterior preveniu um defeito antes de ele existir.

**2. A cascata de descarte segue a posse; a referência fraca não leva nada.** O carregamento
descarta o registro que não passa na validação de forma e, em seguida, o que ficou órfão. Órfão
de **posse**: plano sem estudante sai e leva as metas, as notas e as revisões; meta inválida leva
só as notas dela. Já `PeiGoalNote.source` e `PeiRevision.appointmentId` apontam para a evidência
e para a ata, e são **elos fracos**: a nota cujo atendimento foi descartado fica, sem a ligação.

O motivo é de domínio, não de integridade referencial. A nota é o que um professor escreveu sobre
a meta de uma criança; a observação, a avaliação ou o atendimento citados são de onde veio a
evidência. Perder a evidência não torna o texto falso — torna o texto menos sustentado, o que é
informação diferente. Descartar a nota para não deixar apontador pendurado seria jogar fora o
conteúdo para preservar o link, e aqui o conteúdo é registro de acompanhamento de um estudante.
A regra que fica: descarta-se junto o que não existe sem o outro; o que existe sem o outro fica,
e perde só a ligação.

As duas direções estão testadas — a nota sobrevive à perda da evidência, a meta não sobrevive à
perda do plano — e duas das sete mutações do commit atacam exatamente esta fronteira: desligar a
cascata de posse e tratar o elo fraco como posse. As duas foram acusadas.

**3. Um controle antigo estava passando pela razão errada**, pego no dia em que teria falhado:
o `CONTROLE: a semente inteira passa nos esquemas` enumerava sete coleções numa lista fixa e a
semente passou a ter onze. Registrado no **achado 7**, como quarta forma da mesma causa — lista
em vez de classe —, e a primeira dentro de um instrumento de verificação.

### Resultado da etapa

Medido no `main` em `aaaf86c` (antes do primeiro commit da etapa) e no último commit dela. As
cinco telas são `VerPEIDialog`, `StudentPerformanceDialog`, `PresentationModeDialog`,
`ObservationDetailDialog` e `MinhaAgenda`. Cada número vem com a regra que o produz.

| Medida | Antes | Depois |
|---|---:|---:|
| **Telas exibindo conteúdo fixo sob o nome do estudante** | **5** | **0** |
| Nomes de estudantes escritos no código dessas telas | 20 | 0 |
| Porcentagens literais no código dessas telas | 21 | 1 |
| Seções "em desenvolvimento" nessas telas | 6 | 0 |
| Linhas nessas cinco telas | 1.942 | 1.581 |
| Slides da apresentação | 12 fixos, 8 vazios | 8, derivados do plano |
| Coleções do store | 7 | 11 |
| Versão do envelope gravado | 3 | 4 |
| Testes | 73 | 131 |
| Arquivos de teste | 7 | 15 |
| Mutações plantadas e acusadas | 30 | 73 |
| Entradas do `npm audit` | 2 | 0 |

**As regras de contagem.** "Nomes" e "porcentagens" são ocorrências no código **depois de
remover comentários**, porque os comentários desta etapa citam de propósito os valores antigos
(com eles, a contagem de porcentagens em HEAD dá 8 em vez de 1 — a diferença é a regra
funcionando). A única porcentagem que resta é `width="100%"` no contêiner do gráfico do
Desempenho: dimensão de CSS, não número exibido. "Seções em desenvolvimento" conta os textos
"…em desenvolvimento" fora de comentário. "Mutações" são defeitos plantados um a um no código de
produção, cada um com a asserção de que a substituição casou exatamente uma vez: 30 até a Etapa
8 e 43 nesta.

**O que a fotografia de superfície mediu.** Em seis dos oito commits de código a diferença
declarada foi zero e medida zero — e em quatro deles **o zero não é evidência**, porque o objeto
era um diálogo e o arreio mede 23 rotas sem interagir (pendência 3). As duas diferenças reais
foram declaradas antes: `numeros` em `/`, `/alunos` e `/alunos/1` na troca de fonte do progresso
(uma superfície a mais do que eu havia declarado — achado 16), e as quatro medidas em
`/minha-agenda`, exatamente como declarado.

**O que a etapa fez, em uma frase por tela.** O PEI virou entidade com migração v4; o Ver PEI
mostra o plano do estudante ou diz que não há; o Desempenho lê avaliações e metas, e presença e
integração saíram por não existirem no modelo; a Apresentação é montada do plano, com o número
de slides vindo dele; o detalhe da observação mostra o registro e as metas que o citam; a Minha
Agenda lista os atendimentos, inclusive os agendados com data já passada; e o progresso do
estudante mudou de fonte, com o rótulo mudando junto.

### O que a etapa NÃO fez

Ficam registrados com o que existe hoje no lugar, para que ninguém leia a etapa como "o PEI está
pronto".

- **As seis partes do manual, campo a campo.** O modelo cobre a estrutura das seis partes
  (`src/types/pei.ts`), mas cada parte do manual tem subitens que não viraram campo — níveis de
  apoio por atividade, critérios de avaliação adaptada, cronograma por objetivo. O que existe é o
  suficiente para as telas pararem de mentir, que era o escopo aprovado (patamar 1), e não a
  transcrição do manual.
- **Anexos com arquivo.** `AnexosDialog` continua dizendo que nenhum laudo está anexado, e é
  verdade: não há entidade de anexo nem armazenamento. Guardar arquivo de laudo exige decisão de
  produto e de proteção de dados que o protótipo não tem.
- **PDF do PEI.** "Baixar PDF" e "Imprimir" seguem desabilitados no Ver PEI. O relatório do
  estudante é impresso pelo navegador (Etapa 2); gerar arquivo pela aplicação está fora de escopo
  declarado no README.
- **Agenda pessoal (aulas, planejamento, formação, tarefas).** Entidade nova. **O gatilho é a
  resposta à pergunta do item 2 desta etapa**: existe, na prática da escola, agenda pessoal
  separada dos atendimentos? Enquanto a resposta não vier do autor, a Minha Agenda fica na opção
  (a') — os atendimentos do store — e **nomeia na tela** o que não tem, em vez de preencher com
  exemplo. Não é meta vaga: é uma pergunta esperando resposta.
- **`z.infer`**, que o item 1 previa junto da modelagem. Os esquemas `zod` e os tipos continuam
  sendo duas declarações do mesmo formato, agora com onze coleções em vez de sete. Ficou de fora
  por tamanho: reescreve `types/index.ts` inteiro e misturaria refatoração de tipos com mudança
  de comportamento, contra a regra do CLAUDE.md. Fica para etapa própria.

---

## Etapa 10 — README local-first, guia de desenvolvimento e a fonte servida pelo site

**Não mudou comportamento.** Três commits em `docs/local-first`: `45c0ff1` (o guia de
contribuição vira guia de desenvolvimento), `747bac5` (a fonte Inter hospedada localmente) e
`4907bd2` (o local-first declarado, a seção "Contribuindo" e o `npm ci`), mais o fechamento desta
seção.

### Resultado da etapa

| Medida | Antes | Depois |
|---|---:|---:|
| Requisições a terceiro em tempo de execução (categoria (a)) | 3 | **0** |
| Recursos de terceiro / total, servidor de desenvolvimento | 1 / 204 | **0 / 205** |
| Recursos de terceiro / total, build servido | — | **0 / 6** |
| `preconnect` para domínio de terceiro | 2 | **0** |
| `dist` inteiro, bytes | 1.917.027 | 2.137.325 |
| Transferência de fonte por visita, bytes | ~0 a 48.000 (cache do Google) | **48.556, da origem local** |
| `docs/` — arquivos | 5 | **4** |
| Linhas do guia de contribuição / desenvolvimento | 143 | **85** |

### A varredura de requisição externa, e a regra que a classifica

**A regra:** é **(a) requisição a terceiro em tempo de execução** o que faz o navegador abrir
conexão ou buscar conteúdo em host diferente da origem da página, no carregamento ou no uso; é
**(b)** o que só existe como texto — string, comentário, URL de documentação, badge — e o
navegador nunca interpreta como recurso. **O critério é o efeito medido, não a forma do literal.**

| Categoria | Antes (02/10) | Depois (04/10) |
|---|---:|---:|
| (a) | 3 — a folha `fonts.googleapis.com/css2?family=Inter` e dois `preconnect` | **0** |
| (b) em `src` e `index.html` | 0 | 0 |

**Controle positivo nas duas rodadas:** com
`<link rel="stylesheet" href="https://exemplo.invalid/x.css">` plantado, a varredura devolveu a
ocorrência; removido, voltou ao número de antes. Sem o controle, o zero final não seria evidência —
seria a ausência de evidência, que é outra coisa (achado 19).

**O que o controle negativo NÃO cobriu, e está dito em voz alta:** nenhuma medida de
comportamento **offline** foi feita. Não há, nas ferramentas desta sessão, como cortar a rede
externa e recarregar a página, e por isso **nada no repositório afirma que a página funciona
offline** — o README fala do que a página **busca**, que é o que está medido. O que se sabe: nos
dois modos, zero recurso externo foi pedido, e o único arquivo de fonte veio da origem local. O
que não se sabe: como a página se comporta com a rede cortada.

### A armadilha do nome da família — e a regra que fica

`@fontsource-variable/inter` registra a família **`'Inter Variable'`**. O `src/index.css` pedia
**`'Inter'`**. Importar o pacote e parar aí teria deixado o `index.html` limpo, a varredura em
zero e a página **renderizando em fallback** — texto no lugar, com outra fonte, **sem nenhum
sintoma visível**. O defeito não apareceria em nenhuma das quatro verificações, nem no arreio: a
fotografia mede atributos e números, não qual face o navegador escolheu.

> **A regra, que passa a ser a invariante 7 do CLAUDE.md: remover uma dependência externa e
> verificar só a remoção não verifica a substituição.** Quem troca uma peça mede as duas pontas —
> que a antiga saiu **e** que a nova está em uso, pelo efeito. Aqui: `getComputedStyle` do `body`
> resolvendo para `"Inter Variable"`, `document.fonts.check('600 16px "Inter Variable"')` em
> `true`, 1 de 7 faces em `loaded`, e o `woff2` buscado da própria origem. A medição por canvas
> (407,25 px contra 404,57 do sans-serif) confirma, mas **discrimina pouco** — a Segoe UI tem
> métrica parecida —, e por isso entra como secundária, não como prova.

### Os pesos, medidos antes de escolher o pacote

As classes do projeto pedem **400** (`font-normal`, 30 usos), **500** (`font-medium`, 143),
**600** (`font-semibold`, 221) e **700** (`font-bold`, 122), mais três `font-weight: 600` no CSS.
**Nenhum `font-light`.** A variável cobre `100 900` e serve a todos; o estático ficou
desnecessário. E o pedido ao Google carregava o peso **300**, que o projeto nunca usou — o
instrumento antigo pagava por um peso que nenhuma tela pedia.

### O custo, declarado onde ele acontece

| Onde | Variação |
|---|---|
| `dist` em disco | **+220.298 bytes** (+7 `woff2` = 218.512; CSS +2.044; `index.html` −265) |
| Transferência por visita | **+48.556 bytes** — um subconjunto (latin), escolhido pelo `unicode-range` |
| Requisições de terceiro | **−1** |
| `preconnect` de terceiro | **−2** |

Os sete subconjuntos (latin, latin-ext, greek, greek-ext, cyrillic, cyrillic-ext, vietnamese) vão
todos para o `dist`. **Os ~85 kB de cirílico, grego e vietnamita ficam em disco e nunca são
transferidos** num texto em português: é custo de repositório e de deploy, não de visita. Só
sairiam escrevendo `@font-face` à mão, duplicando o que o pacote declara — custo declarado, sem
ação.

`npm audit` continuou nas mesmas 5 entradas altas da cadeia do Tailwind: a fonte não trouxe
advisory nenhuma, e é a 38ª dependência de produção.

### A triagem das boas práticas: 1 movido, 8 descartados

O bloco "Boas Práticas de Desenvolvimento" do guia antigo foi comparado item a item com o
CLAUDE.md. **Nada voltou para `docs/DESENVOLVIMENTO.md`:** duas fontes para a mesma convenção é o
defeito que a Etapa 4 tirou dos números, em prosa.

| Item | Destino | Por quê |
|---|---|---|
| Validação por `zod` + `react-hook-form` | **movido ao CLAUDE.md** | o arquivo não citava `zod` em linha nenhuma, e o store já valida forma com `src/store/schemas.ts`: validar à mão cria um segundo vocabulário para a mesma regra |
| "Evitar componentes muito grandes" | descartado | coberto: `CLAUDE.md`, limite de ~400 linhas em commit de refatoração dedicado |
| "Evitar `any`" | descartado | coberto: "Nada de `any`. Se o tipo não existe, crie em `src/types/`" |
| "Centralizar tipos em `src/types/`" | descartado | coberto na mesma linha |
| "Separar UI e regras de negócio" | descartado | coberto pela invariante 2: métrica deriva de dataset datado via seletor compartilhado |
| "Criar componentes reutilizáveis" / "preferir composição" | descartado | genéricos; a parte verificável é "um componente por arquivo" |
| "Padronizar mensagens de erro" | descartado | genérico, sem mecanismo que reprove |
| "Tailwind / shadcn / consistência visual" | descartado | genéricos; o que o projeto cobra é a invariante 1, que prende cor de marca aos tokens `--brand-*` |
| "Declarar tipos de forma explícita" | descartado | genérico sob TypeScript estrito, ligado na Etapa 6 |

### A classe do achado desta etapa: documentação que sobrevive à decisão que descrevia

**Cinco ocorrências**, na mesma etapa, do mesmo mecanismo — e é parente do achado 18, com uma
diferença: ali o registro envelhecia porque o **código** mudava; aqui o documento sobrevive a uma
**decisão de não fazer**.

1. **O guia de contribuição** descrevia fluxo de PR, revisão e critério de aceitação num projeto
   de um mantenedor que nunca teve processo de revisão. Virou `docs/DESENVOLVIMENTO.md`, com a
   abertura dizendo o que o arquivo é.
2. **A seção "Contribuindo" do README** dizia "Contribuições são bem-vindas", com Fork e "Abra um
   Pull Request". Reescrita: um mantenedor, sem revisão de PR, código MIT para copiar e adaptar,
   issue sem garantia de resposta. A varredura do README inteiro
   (`contribu|comunidade|roadmap|pull request|fork|issue|mantenedor|colabora|bem-vind|revisão|aceita`,
   com controle plantado) achou mais quatro ocorrências, **nenhuma sobre processo**: o item do
   sumário e três menções a "badges de contribuição", que é funcionalidade do produto.
3. **`docs/calendar-sync-implementation.md`**, 482 linhas sobre um backend Supabase que o projeto
   decidiu não ter: fluxo OAuth, esquema de banco, código de *edge functions*, segurança, plano de
   teste e monitoramento. **Removido nesta etapa** (está em
   `git show 4907bd2:docs/calendar-sync-implementation.md`). Nada nele era decisão registrada.
   **E ele não só sobreviveu à decisão: contradizia-a.** A seção "Current State" listava como
   ✅ implementado um "mock OAuth flow with visual feedback" que a Etapa 2 havia desligado — hoje o
   próprio componente diz no cabeçalho que nada ali pode simular conexão ou sincronização, e os
   sete controles da aba estão `disabled`.

4. **O card "Guia de Implementação Backend"**, na aba Integrações das Configurações: o gêmeo de
   **tela** do documento removido. Ensinava a criar projeto no Google Cloud Console, registrar app
   no Azure AD, criar *edge functions* para OAuth e guardar tokens criptografados num banco —
   dentro de um sistema sem servidor, sem banco, que lida com dado de criança. **Removido na Etapa
   10d.** É a primeira ocorrência da classe **na própria tela**, e não em documento: o aviso que já
   estava lá ("Integrações não implementadas: conectar contas exige OAuth com servidor, e este
   protótipo não tem servidor") diz o que precisa ser dito, e guia de implementação não é
   informação para quem usa o sistema — é afordância de documentação para funcionalidade
   desligada.
5. **`docs/API_REFERENCE.md`** — "API Reference" num projeto sem API, o que faz do **nome** a
   mesma afirmação falsa. Triado linha a linha em 05/10/2026, e a triagem **inverteu a
   expectativa**: a pilha "descreve o que existe" tem **uma linha**, a 10 ("Frontend em React +
   TypeScript"), que o README e o `DESENVOLVIMENTO.md` já dizem. As outras **151** descrevem o que
   não existe, ou afirmam falso:

   | Trecho | Linhas | O que é |
   |---|---|---|
   | "a aplicação opera com **mock data**" e "Dados mockados localmente" | 6, 11 | **falso** desde a Etapa 4: os números vêm dos registros do navegador |
   | "Backend de persistência (ex.: Supabase, PostgreSQL + API própria)" | 15-25 | não existe, e é a última menção a Supabase como plano |
   | Google Calendar e Outlook, "Status: UI pronta" | 29-51 | os controles estão desabilitados desde a Etapa 2 |
   | "Existe um fluxo mock de OAuth gerenciado por `useCalendarSync`" | 38 | **falso**: o hook devolve estado estático e o componente proíbe simular conexão |
   | Exportação de PDF e de Excel, "Planejado" | 55-69 | não existem; o README marca ❌ |
   | Notificações por Email/Push, "Status: UI pronta" | 73-79 | controles desabilitados |
   | `useCalendarSync`: "Simular fluxo de autenticação" | 81-90 | **falso**, e é exatamente o que a Etapa 2 proibiu |
   | "Modelo Conceitual de API", com **23** endpoints REST | 92-137 | proposta; nenhum existe |
   | "Observações Importantes" e "Próximos Passos Recomendados" | 139-151 | roteiro para uma API que não há |

   **O que o documento NÃO tem**, medido por busca: nenhuma linha sobre `src/types/`, as ações do
   reducer, os seletores de `src/lib/metrics.ts`, o envelope de persistência e suas migrações, ou
   o config de instituição. **A pilha que ficaria não sustenta um arquivo** — e renomeá-lo para
   `MODELO_DE_DADOS.md` criaria um nome prometendo um modelo de dados que o conteúdo não tem, que
   é o mesmo defeito na direção oposta.

   **Proposta, para decisão do autor** — e é por isso que o arquivo **não** foi tocado na Etapa
   10d: **remover `docs/API_REFERENCE.md`**, como se fez com o desenho de calendar sync, e, se um
   documento de modelo de dados for desejado, **escrevê-lo a partir do código** em etapa própria,
   lendo `src/types/`, `src/store/` e `src/lib/`. Renomear não produz conteúdo. Enquanto a decisão
   não vier, as três afirmações falsas das linhas 6, 11 e 38 continuam vivas no repositório, e
   isto fica escrito para que ninguém as encontre sem aviso.

### A ênfase perdida: presença não é ordem de leitura (invariante 7, segundo caso)

O parágrafo local-first, como entrou em `4907bd2`, **enterrou o aviso mais forte do README**. O
texto terminava com "…não é garantia de conformidade: o sistema não está pronto para receber dados
reais de estudantes", e o resultado foi um bloco que abre com boas notícias e fecha com a
ressalva.

Medido no próprio bloco — 32 linhas em `6ac10b1`, 33 depois da correção da Etapa 10d:

| Afirmação | Linha do bloco antes | Linha do bloco depois |
|---|---:|---:|
| "não está pronto para receber dados reais de estudantes" | **29**, a penúltima | **26**, a primeira do fecho |
| "Não há servidor, não há conta e não há cadastro" | 26 | 29 |
| "não busca nada de terceiros" | 27 | 30 |

**O conteúdo não mudou; a ordem de leitura mudou** — e com ela o efeito. Quem lê de cima para
baixo encontrava três boas notícias antes da ressalva, e podia parar antes dela.

**É o segundo caso da invariante 7, e amplia a regra.** No primeiro, a verificação olhava para a
remoção e não para a substituição (a família `'Inter Variable'`). Aqui a verificação pedida — "as
duas afirmações da linha substituída estão dentro do parágrafo novo?" — **passou**, e passaria
sempre, porque pergunta por **presença**. Presença não mede posição, nem ênfase, nem o que o
leitor encontra primeiro. Ao reescrever um bloco, meça **em que linha cada afirmação cai**, não só
se ela continua lá.

A correção foi do autor, não do método, e isso está registrado como está: nenhuma das quatro
verificações, nenhum arreio e nenhuma varredura deste repositório mede ordem de leitura.

### Verificação da etapa

- As quatro, em cada commit: lint 0 erros e 4 avisos aceitos, typecheck silencioso, 131 testes em
  15 arquivos, build concluindo.
- Varredura institucional 0, com controle plantado devolvendo 2.
- `GUIA_DE_CONTRIBUICAO` sem nenhuma ocorrência no repositório.
- `calendar-sync` só nas duas notas históricas deste arquivo.
- `supabase|edge function|API_REFERENCE` **não voltou vazio**, e a varredura não foi afrouxada
  (controle plantado e removido). Fora das notas desta seção, sobraram exatamente **dois**:
  `docs/API_REFERENCE.md:17` e o link `README.md:622` ("Referência de integrações") que aponta
  para ele. Os dois existem porque a decisão sobre esse arquivo é do autor, e a proposta está
  acima, no item 5.
- **A aba Integrações, medida no navegador em 05/10, depois das duas remoções** — abrindo o
  diálogo pelo controle que o abre e a aba pela aba, com `pointerdown` porque Radix não responde a
  `click` sintético:
  - nenhuma citação a `calendar-sync`, zero elementos `<code>` no painel;
  - nenhuma ocorrência de "Guia de Implementação Backend", "edge function", "Azure AD", "Google
    Cloud Console" ou "tokens criptografados"; nenhuma de "configure:", "criar projeto",
    "registrar app" ou "armazenar tokens" — a aba deixou de ensinar a implementar qualquer coisa;
  - **o que sobrou:** o aviso de indisponibilidade e quatro cartões (Calendários, Email,
    Armazenamento, Comunicação), com os **sete** controles `disabled` intactos;
  - **layout conferido na medida, não no olho:** o contêiner ficou com 5 filhos, nenhum vazio,
    espaçamento regular de 22-23 px entre eles e **−1 px** de sobra depois do último cartão, ou
    seja, nenhum buraco onde o card saiu.

---

## Fora de escopo até decisão do autor

- Backend real, autenticação, RBAC
- Integração OAuth com Google/Outlook. **Existiu um esboço de desenho** —
  `docs/calendar-sync-implementation.md`, 482 linhas: fluxo OAuth do Google e da Microsoft,
  esquema de banco, código de *edge functions*, considerações de segurança, plano de teste e
  monitoramento, tudo sobre um backend **Supabase** que o projeto decidiu não ter. **Removido na
  Etapa 10c**; está no histórico, em `git show 4907bd2:docs/calendar-sync-implementation.md`.
  Nada dele era decisão registrada: era desenho de uma arquitetura descartada, e a seção "Current
  State" ainda listava como implementado um "mock OAuth flow with visual feedback" que a Etapa 2
  tinha desligado (o componente hoje diz, no próprio cabeçalho, que nada ali pode simular conexão
  ou sincronização).
- Exportação de arquivos gerados pela aplicação (PDF, Excel, Word). O relatório da Etapa 2
  é impresso pelo navegador, que também salva como PDF; a aplicação não gera arquivo.
- Qualquer análise preditiva de verdade (exigiria dataset governado e validação; hoje há
  4 alunos fictícios)

Enquanto não existirem, o README e as telas devem continuar dizendo que não existem.
