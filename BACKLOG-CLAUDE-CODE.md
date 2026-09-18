# Backlog de correções — uma etapa por sessão

Cada etapa é uma sessão separada do Claude Code, com commit e verificação própria.
Não começar a seguinte antes de `npm run lint`, `npm run typecheck` e `npm run build`
passarem na anterior.

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
haver texto fixo para atribuir a alguém. A Etapa 4 terminou sem chegar lá: Desempenho,
Apresentação, Ver PEI e Detalhe da observação ainda mostram conteúdo fixo sob o nome do
estudante, com aviso (ver **Ainda aberto**, abaixo).

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

**Ainda aberto:** Ver PEI, Detalhe da observação, Apresentação e Desempenho continuam com
conteúdo fixo de exemplo sob o nome do estudante, todos com aviso de que o conteúdo não é dele e
sem dado de saúde. O Ver PEI identificava outra pessoa da demonstração até `bd93507`. A Etapa 4
terminou sem trocá-los: o que mostram — PEI, trimestres, presença, conquistas — não tem registro
de origem no modelo. Ficam para a Etapa 9, com a entidade PEI.

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

---

## Pendências abertas

Trabalho de uma etapa já mesclada que ficou sem fazer. Cada item diz o que falta, o que a
etapa pode afirmar sem ele e o que **não** pode.

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

**Para fechar:** executar os nove, registrar aqui o resultado de cada um (passou, falhou e
como) e a data. Falha vira item de correção, e a pendência só sai deste bloco quando os nove
passarem.

### 2. Dois defeitos de acessibilidade achados depois do merge (Etapa 3) — não corrigidos

Achados durante a verificação da Etapa 4 e deixados para a Etapa 3 por decisão do autor.
Nenhum foi corrigido.

- **Calendário da Agenda em inglês.** Em `/agenda-atendimentos`, a visão Lista mostra "Tue Nov
  25", "2:00 pm" e "11/25/2025". A página tem `lang="pt-BR"`, e o leitor de tela lê esses trechos
  com pronúncia portuguesa (3.1.1 e 3.1.2). Visto de passagem; a causa não foi investigada.
- **Selo "ATENÇÃO" com contraste 3,15:1.** Em Gestão > Relatórios, "Ver detalhes do exemplo" →
  subtab "Alertas", o selo tem texto branco sobre `--alert-warning-icon` (`#db7706`): 3,15:1,
  medido pelo axe em 16/09/2026 (1.4.3 pede 4,5:1). O selo é de `645280f`. A medida da Etapa 3
  deu 0 nessa rota porque o selo só aparece depois de dois cliques.

**O que a Etapa 3 pode afirmar sem eles:** o "124 violações para 0" vale para o que aparece nas
rotas sem interação. **O que não pode:** que todo conteúdo alcançável por clique foi medido.

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
  mostram números fixos sob o nome do estudante: o Desempenho da Maria diz 85% no 4º
  trimestre, e a ficha, 60%. Trocar por dado real depende da entidade PEI (Etapa 9), e o autor
  aceitou a ressalva.
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
telas diferentes. **Estado:** cumprido com uma ressalva, descrita em **O que o número não diz**,
no topo desta etapa: os diálogos de exemplo ainda mostram números fixos sob o nome do
estudante. Os quatro dizem na tela que o conteúdo não é dele: três desde a Etapa 4, e o Ver PEI
desde `bd93507`.

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
| Identificadores sem uso (`tsc --noUnusedLocals --noUnusedParameters`) | 32 | 2 |
| **Coleções que guardavam cópia do nome do estudante** | **3** | **0** |
| Violação `scrollable-region-focusable` em 320 px (Orçamento, Benchmarking) | 1 | 0 |
| Defeitos pequenos da Etapa 2 (caminho de doc, `value={310}`, `Badge` em `<p>`, `view` sem `onView`) | 4 | 0 |
| Selo com significado só no emoji, achado ao editar uma das linhas acima | 1 | 0 |
| Chaves de objeto com acento (medido pela AST, não por regex) | 4 | 3 |
| Classes de cor fixa fora dos tokens (regra larga; ver abaixo) | 170 | 164 |
| Literais hexadecimais fora dos tokens | 12 | 12 |
| Arquivos acima de 400 linhas | 19 | 17 |

**Os dois `_props` que sobram** são parâmetros deliberadamente prefixados com `_` em
`ui/calendar.tsx`, componente do shadcn. Não são defeito.

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

### As três chaves acentuadas que ficaram, e por quê

`AgendaAtendimentos.tsx:47-49` mantém `'Reunião Pedagógica'`, `'Avaliação'` e
`'Atendimento Família'` como chaves de objeto, contra a convenção. **Não é esquecimento.**

Esses valores são o tipo `AppointmentType`: são campo do modelo (`Atendimento.tipo`), texto
que aparece na tela, chave do mapa de cores **e dado gravado no `localStorage` de quem já
usou o sistema**. Trocá-los é mudança de modelo com migração de versão do store para v4, em 4
arquivos e 8 pontos.

Decisão do autor: **vão para a Etapa 9, com a entidade PEI.** Migração v4 no meio de uma etapa
de limpeza misturaria remoção com mudança de modelo e contaminaria a prova ponta a ponta.

### O inventário dos 17 arquivos acima de 400 linhas

O BACKLOG listava 6 arquivos, com números defasados. São 17, depois da remoção de
`ui/sidebar.tsx`. A convenção do CLAUDE.md manda quebrá-los em commits de refatoração
dedicados; quebrar 17 dentro desta etapa destruiria a prova de regressão, porque cada quebra
move a fotografia por motivo legítimo. Ficam registrados com o número de hoje:

| Arquivo | Linhas | | Arquivo | Linhas |
|---|---:|---|---|---:|
| `MeuPerfilDialog.tsx` | 817 | | `ContributeResourceDialog.tsx` | 494 |
| `AgendaAtendimentos.tsx` | 770 | | `StudentDetail.tsx` | 492 |
| `Manual.tsx` | 640 | | `ObservationDetailDialog.tsx` | 479 |
| `NewStudent.tsx` | 610 | | `OrcamentoContent.tsx` | 459 |
| `PredictiveAnalysis.tsx` | 604 | | `NewAssessmentDialog.tsx` | 454 |
| `ProgressChart.tsx` | 593 | | `MinhaAgenda.tsx` | 446 |
| `AlertasRiscosContent.tsx` | 575 | | `EquipeContent.tsx` | 412 |
| `ConfiguracoesDialog.tsx` | 574 | | `NovoAtendimentoDialog.tsx` | 411 |
| `NewObservation.tsx` | 511 | | | |

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

---

## Fora de escopo até decisão do autor

- Backend real, autenticação, RBAC
- Integração OAuth com Google/Outlook
- Exportação de arquivos gerados pela aplicação (PDF, Excel, Word). O relatório da Etapa 2
  é impresso pelo navegador, que também salva como PDF; a aplicação não gera arquivo.
- Qualquer análise preditiva de verdade (exigiria dataset governado e validação; hoje há
  4 alunos fictícios)

Enquanto não existirem, o README e as telas devem continuar dizendo que não existem.
