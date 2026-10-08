# CLAUDE.md

Instruções permanentes para trabalho neste repositório. Leia antes de qualquer alteração.

## O que é este projeto

Protótipo de frontend para gestão de Planos Educacionais Individualizados (PEI) na
educação inclusiva brasileira. React 18 + TypeScript + Vite + Tailwind + shadcn/ui.
Sem backend e sem autenticação. Os dados iniciais vêm de `src/data/`; em modo demonstração
(`DEMO_MODE`), o que é cadastrado na interface fica no localStorage via `src/store/`.

O sistema lida com um domínio sensível: crianças e adolescentes com deficiência,
diagnósticos e dados de saúde. Isso governa várias regras abaixo.

## Verificação obrigatória

Nenhuma alteração é considerada pronta antes de as quatro passarem:

```bash
npm run lint        # 0 erros. 4 warnings react-refresh em src/components/ui/ são aceitos.
npm run typecheck   # silêncio
npm test            # 131 testes, 15 arquivos. Zero teste encontrado reprova.
npm run build       # conclui
```

Rode as quatro antes de cada commit. Se uma quebrar, conserte antes de seguir — não
acumule.

**Zero é ausência de resultado, não resultado de ausência.** Antes de afirmar que algo não
existe — verificação, ocorrência, execução — rode o comando que o lista e confirme com controle
positivo. Vale para **qualquer instrumento**, não só para a fotografia: a regra nasceu na Etapa 9
para a fotografia de superfície, ficou amarrada a esse instrumento, nunca entrou aqui, e não
alcançou o painel de PR — onde `0 passando, 0 falhando, 0 pendentes` foi lido como "não há CI"
com 36 execuções verdes no GitHub (achado 19; é o achado 7 numa regra de verificação, enumerar o
conhecido em vez da classe).

**Documento tem duas saídas: descrever o que existe, ou sair.** Controle inerte tem três —
implementar, desabilitar com explicação visível, ou remover —, e por isso a Etapa 2 pôde deixar
botão desabilitado na tela. Texto não tem a do meio: aviso dizendo que o documento ao lado é falso
é o botão inerte com etiqueta, e saiu do README na Etapa 10f. Documento anterior a uma decisão se
corrige linha a linha ou se remove inteiro; o histórico preserva.

**O escopo de uma varredura é parte do resultado dela, e isso inclui o vocabulário.** Diga onde procurou, junto do que achou:
varredura cujo escopo não está declarado não distingue "não há ocorrências" de "não procuramos
ali". As quatro verificações leem `src/`; a fotografia mede rotas; a busca institucional é a única
que entra em `docs/`, e só por dois termos — foi assim que 152 linhas de afirmação falsa viveram
nove etapas em `docs/API_REFERENCE.md` (achado 20). Vocabulário de prontidão ("pronto",
"implementado", "funcional") não acha afirmação **estrutural** falsa: "TanStack Query 5.x" numa
tabela de stack de um projeto que não a instala é falso e não casa nenhuma dessas palavras.

Toda varredura inclui um controle positivo: uma ocorrência que se sabe existir e que precisa
aparecer na saída. Varredura sem controle positivo não produz evidência — um zero pode ser
defeito da ferramenta. Classes de caractere com acento ([áa]) não casam a letra acentuada
neste ambiente; use script com regex Unicode. grep -i não muda o caso de letra acentuada:
'licença' não casa 'LICENÇA'. Vale para qualquer busca por termo em maiúsculas em código
escrito em português.

Controle positivo incidental não serve: ele pode desaparecer com a própria mudança que está
sendo verificada — foi o que aconteceu com o `useSidebar` da busca institucional. Plante o
controle: insira a ocorrência num arquivo de teste, confirme que o comando a encontra, e só
então confie no zero.

O controle plantado precisa **asseverar que a quebra foi plantada**, não só executar a
substituição. Na Etapa 7 um `replace` mirou um trecho que não existia no arquivo escolhido: a
quebra nunca entrou, a varredura continuou devolvendo zero, e o zero foi lido como "a
varredura funciona". Conte as ocorrências, exija exatamente uma, e só então rode.

Todo número registrado vem acompanhado da regra que o produz. Número sem regra de contagem
não é medida e não deve ser repetido.

Ao declarar, antes de um commit, quais telas vão mudar: **liste os sítios que MONTAM o
componente, não os que CHAMAM o seletor.** O mesmo cartão aparece em mais de uma rota, e a
declaração escrita pela busca do seletor deixa de fora as rotas que o montam por dentro de
outro componente. Declaração incompleta reprova o commit mesmo quando o conteúdo medido está
certo: o que ela verifica é o raciocínio, não só o número.

Âncora de substituição se **lê do arquivo**, nunca se escreve de memória: indentação e fim de
linha variam por arquivo (`core.autocrlf=true` deixa a cópia de trabalho em CRLF). Exija
exatamente uma ocorrência e aborte fora disso. Mutação nova entra **versionada** em
`scripts/mutacoes/`, no mesmo commit do teste que ela verifica: número que só existe no
diretório temporário de uma sessão não é medida — 27 das 74 desta série se perderam assim.
**Mutação perdida não se reescreve a partir do teste de hoje:** ela casaria com o que o teste faz
hoje, não com o defeito que ele pegava quando foi escrita, e reconstituição com data antiga é pior
que perda declarada (Pendências abertas, item 4).

**Ao fechar uma etapa, releia COM USO o que ela tocou no README e no BACKLOG, e meça de novo os
números que ela move.** Releitura atenta não reprova nada: o par "vinte itens" / 22 rótulos do
achado 18 sobreviveu a duas leituras com a tabela à vista e caiu na primeira vez que alguém fez
conta com ele. Use o registro em três operações — **some as tabelas, cruze os números entre os
três arquivos (README, BACKLOG, CLAUDE.md) e refaça pelo menos uma conta.** Um registro não se
mostra incoerente ao ser relido; mostra-se ao ser usado. **E vale para o que você afirma ao autor**, não só para
o texto do registro: o CI deste repositório existe desde 13/09/2026, com `npm test` dentro dele
desde 18/09, e foi declarado inexistente em três relatos (achado 19) — `gh run list` e
`gh pr checks` listam o que o painel ainda não sabe. O registro é a única parte deste projeto
que nenhuma verificação reprova, e envelhece em silêncio: a varredura de 03/10/2026 achou **20
itens** acumulados em nove etapas, pela regra "o item é a unidade, a classe é o rótulo" (achado 18). Escreva **estado datado** — "medido em DD/MM/AAAA", "até a Etapa N" — em vez de
presente: "mantém", "ainda mostra" e "não possui" viram afirmação falsa na etapa seguinte sem
ninguém tocar neles.

**Descrição, tópicos e homepage do GitHub não são alcançados por nenhuma verificação.** As
quatro rodam sobre o código; a varredura institucional lê `src`, `docs` e `index.html`. Esses
três campos vivem fora do clone, não têm commit para comparar e só existem no registro como
**conferência manual datada** — a última está no achado 19, medida em 03/10/2026 (descrição sem
vínculo institucional e dizendo que os dados são fictícios, 12 tópicos temáticos, homepage vazia).
Ao mexer no repositório pelo GitHub, remeça os três e registre a data.

Prova que não se consegue fazer não vale como prova. Quando a verificação de uma simplificação
falha por limite de ferramenta, desfaça a simplificação em vez de assumir equivalência.

Ao ligar uma opção de compilador ou de lint, o controle positivo é sobre a OPÇÃO, não sobre o
código: plante um erro que ela deve pegar e confirme que a verificação reprova. Verde com a
opção desligada é indistinguível de verde com o código correto.

Teste de defeito corrigido assevera também o valor errado antigo, comparando com a conta que
produzia o defeito. Assim "o teste passa" significa "o defeito não voltou", e não "o código
rodou".

Asserção dentro de condicional pode nunca executar. Teste que depende de ambiente (fuso,
locale, largura) fixa o ambiente no config e assevera incondicionalmente. Confirme que o pino
vence a variável externa.

## Testes

`npm test` roda a suíte em Vitest + jsdom (`vitest.config.ts`). Ela cobre **o que as Etapas 1
a 6 corrigiram** — persistência do store, datas, seletores de métrica, reducer, grafo de rotas
e o fluxo de cadastro até a listagem —, mais a guarda de navegação da Etapa 8 (todo destino
não literal listado pelo nome) e **as cinco telas da Etapa 9** (Ver PEI, Desempenho,
Apresentação, Detalhe da observação e Minha Agenda, cada uma montada de verdade), e não o
código todo. Arquivo sem teste não é arquivo verificado; a lista do que ficou de fora está no
README.

- O ambiente é fixado no config (`TZ=America/Sao_Paulo`), porque em UTC os defeitos de data
  não existem e a suíte passaria sem exercitar um caso sequer.
- Renderização visual não vem para cá: jsdom não calcula layout, e isso foi medido (a conta
  está em `src/test/setup.ts`). Regressão de tela continua no arreio de `scripts/fotografia.js`.
- Antes de confiar num teste novo, plante no código de produção o defeito que ele deve pegar,
  confirme que a suíte **reprova**, e restaure. Teste que nunca reprovou não provou nada.
- Remendo de jsdom fica em `src/test/lacunas-jsdom.ts`, cada um com o erro exato que evita, e
  só é importado por quem monta componente.

## Invariantes — nunca violar

### 1. Nenhum vínculo institucional no código
O repositório foi deliberadamente desvinculado de uma instituição específica. Não
reintroduza nomes, siglas, domínios de e-mail, unidades, códigos de matrícula ou paletas
de marca de nenhuma instituição real.

Tudo que é específico de uma instituição vive em `src/config/institution.ts`. Se você
precisar de um nome de escola, unidade, rótulo de matrícula ou nome de rede, leia de lá.
Se o dado necessário não existe no config, **adicione o campo ao config** — não escreva
literal no componente.

Cores de marca: variáveis `--brand-*` em `src/index.css`. Não crie tokens de cor fora
desse bloco.

### 2. Nenhum número inventado apresentado como real
Todo indicador, projeção, comparativo, ranking ou valor financeiro exibido é fixo no
código. Regras:

- Qualquer tela que mostre métrica, projeção, benchmark ou orçamento **deve** renderizar
  `<DemoDataNotice />`.
- Proibido usar as palavras "Inteligência Artificial", "modelo", "predição", "confiança
  estatística" ou equivalentes para descrever dados estáticos.
- Proibido afirmar garantias de privacidade que o código não implementa (anonimização,
  consentimento, opt-out, criptografia).
- Proibido `Math.random()` em dados exibidos — gera números que mudam a cada render.
- Ao adicionar fixtures, use nomes fictícios, domínio `example.org` e telefones
  `(11) 90000-000X` (não discáveis).

Se implementar uma métrica de verdade, ela deve derivar de um dataset datado via seletor
compartilhado — nunca de um literal duplicado em outro componente.

### 3. Nenhuma afirmação falsa de funcionalidade
O README tem uma tabela "O que está implementado" com ✅/⚠️/❌. Se você implementar ou
remover algo, **atualize a tabela no mesmo commit**. Nunca marque ✅ o que não funciona
ponta a ponta.

Em etapas de vários commits, a tabela do README pode ficar defasada entre commits
intermediários, desde que o commit final da etapa a atualize. Registre a defasagem na
mensagem do commit.

Nunca exiba toast de sucesso ("salvo", "enviado", "gerado") para uma ação que não
produziu resultado persistido ou arquivo. Ou implemente, ou desabilite o controle com
explicação visível, ou remova.

### 4. Acessibilidade é requisito, não melhoria
É um sistema de educação inclusiva. Alvo: WCAG 2.1 AA.

- Todo controle interativo precisa de nome acessível. Botão só-de-ícone exige
  `aria-label` descrevendo a ação e o objeto ("Editar aluno Maria Silva", não "Editar").
- Nada operável só por mouse. Se tem `onClick`, tem que ser `<button>`/`<a>` ou ter
  `role`, `tabIndex` e handler de teclado.
- Significado nunca por cor ou emoji sozinhos — sempre acompanhar de texto (visível ou
  `sr-only`). Emoji decorativo recebe `aria-hidden="true"`.
- Gráfico Recharts precisa de nome acessível e equivalente textual (tabela ou lista).
- Ao mudar qualquer valor HSL em `src/index.css`, recalcule o contraste. Mínimo 4,5:1
  para texto normal. Os valores atuais foram medidos e passam.
- Razão de contraste anotada em comentário não é evidência. Meça da cor computada no
  navegador, no uso real do token, e anote a medição.
- Captura de tela em viewport estreita não é evidência de estouro — o painel de ferramentas
  corta a imagem. Meça `scrollWidth` e procure texto clipado.
- Hierarquia de headings sem pular níveis.
- `lang="pt-BR"` no `index.html` — não alterar.
- A ferramenta de navegador das sessões não ativa `<button>` nativo por Enter/Space, nem
  botões com nome acessível. Ativação por teclado não pode ser verificada por ela — só a
  árvore de acessibilidade (nome, papel, estado). Não registre falha de ativação por
  teclado como defeito do app sem teste manual.

### 5. Nenhum dado real, nunca
Não versione dados reais de estudantes, responsáveis ou profissionais. Não adicione
segredos. Apenas variáveis `VITE_*` chegam ao bundle do navegador; client secrets e
tokens ficam em servidor.

Se implementar armazenamento local (localStorage/IndexedDB), a UI deve avisar
explicitamente que os dados ficam no navegador e que o modo demo não é adequado para
dados reais.

Ao procurar dado sensível, busque por VOCABULÁRIO do domínio (clínico, comportamental, de
saúde mental), nunca pelos termos do defeito já conhecido. Cada busca anterior desta série
usou as palavras do caso anterior, e foi assim que 'Transtorno Global do Desenvolvimento'
sobreviveu a duas varreduras.

O cenário ilustrativo da Gestão não nomeia nenhum estudante nem família, e sua equipe não
repete nome algum dos dados de demonstração. Ao editar qualquer tela de Gestão, verifique as
duas coisas.

### 6. Nenhum campo alega mandato legal que não existe
O marco legal brasileiro (LDB art. 58-60, LBI art. 27-28, Lei 12.764/2012, Decreto 7.611/2011,
Resolução CNE/CEB 4/2009) obriga atendimento educacional especializado, currículos e recursos
adaptados e profissional de apoio. **Ele não prescreve os campos de um PEI.** A estrutura do
plano — as seis partes, a revisão trimestral, a família como coautora — vem do manual deste
repositório (`src/pages/Manual.tsx`), que é prática institucional.

Ao modelar ou exibir qualquer coisa do domínio: campo que vem do manual cita o manual; campo
que vem da lei cita o artigo; campo que é decisão de produto diz que é decisão de produto.
Nunca escreva "exigido por lei", "obrigatório pela LBI" ou equivalente sem o artigo que exige.
Confundir prática institucional com exigência legal faz o sistema afirmar, sobre o direito de
uma criança, o que a lei não diz — e quem lê a tela não tem como distinguir.

### 7. Substituição se verifica pelo efeito, não pela remoção
Tirar uma dependência e conferir que ela saiu **não** verifica que o que entrou no lugar funciona.
Na Etapa 10b, `@fontsource-variable/inter` registra a família `'Inter Variable'` e o
`src/index.css` pedia `'Inter'`: a varredura de requisição externa daria zero, o `index.html`
estaria limpo, e a página renderizaria **em fallback**, sem sintoma visível. Nenhuma das quatro
verificações nem o arreio pegariam.

**E presença não é ordem.** Um aviso que continua no texto mas desce para o fim de uma lista de
boas notícias mudou de efeito sem mudar de conteúdo: na Etapa 10d, "não está pronto para receber
dados reais de estudantes" tinha caído para a penúltima linha do bloco de aviso do README, e a
verificação por presença passava. Ao reescrever um bloco, meça **em que linha cada afirmação
cai** — a mais forte primeiro.

Ao trocar uma peça — fonte, biblioteca, seletor, utilitário, endpoint —, meça **as duas pontas**:
que a antiga saiu e que a nova está **em uso**, pelo efeito. Fonte: `getComputedStyle` e
`document.fonts.check`, mais o arquivo servido pela origem. Seletor ou utilitário: o valor que ele
produz, não a presença da chamada. Medição que distingue pouco (duas fontes de métrica parecida)
entra como secundária e diz que é.

## Convenções

- Identificadores novos: inglês, ASCII, camelCase/PascalCase. Português apenas em textos
  de interface. (O modelo atual é misto — não piore, e migre quando a tarefa pedir.)
- Sem acentos em chaves de objeto.
- Valores derivados se calculam, não se armazenam. Idade vem de
  `calculateAge(dataNascimento)` em `src/lib/date.ts` — nunca de um campo salvo.
- Um componente por arquivo.
- Arquivos acima de ~400 linhas devem ser quebrados em commits de refatoração dedicados,
  nunca junto de mudança de comportamento.
- Nada de `any`. Se o tipo não existe, crie em `src/types/`.
- Validação de dado de formulário passa por `zod`, com `react-hook-form` na camada de
  formulário. O store já valida forma com esquemas `zod` (`src/store/schemas.ts`): validar à mão
  num formulário cria um segundo vocabulário para a mesma regra, que é a duplicação que a Etapa 4
  tirou dos números. Medido em 04/10/2026: `react-hook-form` em 4 arquivos, `zod` nos dois
  formulários e nos esquemas do store.
- Sem dependência de plataforma de hospedagem específica. `npm run build` gera estático.

## Commits

Prefixos: `Add:`, `Fix:`, `Update:`, `Docs:`, `Style:`, `Refactor:`, `Test:`.
Um commit por etapa concluída e verificada. Não misture refatoração com mudança de
comportamento.

Antes de commitar numa branch que já tem PR aberto, confira o estado do PR. Se já foi mesclado,
saia para uma branch nova a partir do main atualizado.

## O que perguntar antes de fazer

Não decida sozinho, pergunte:

- Escolher entre store local de demonstração e backend real
- Remover uma tela ou funcionalidade inteira
- Adicionar dependência nova
- Trocar a paleta de cores
- Mudar o modelo de dados de `Student` de forma incompatível
