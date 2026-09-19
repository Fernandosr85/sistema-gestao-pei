# Fotografia de superfície

Prova de regressão para etapas que **removem** código. Nasceu na Etapa 5, que apaga
arquivos, e é uma ampliação da fotografia de números usada no commit 2 da Etapa 4.

## Por que quatro medidas e não uma

A fotografia da Etapa 4 era a sequência de números do texto renderizado. Provou o que
precisava provar lá — que uma refatoração não mexeu em nenhum indicador. Para uma etapa
que remove código, é estreita demais: dá para apagar um botão, um nome acessível ou uma
parada de tabulação sem mexer em número nenhum.

| Medida | O que pega |
|---|---|
| `a11y` | árvore reduzida a `papel│nome│estado`, em ordem de documento — controle removido, renomeado ou sem nome |
| `numeros` | sequência de números do texto renderizado — a medida da Etapa 4 |
| `foco` | ordem de tabulação, com o nome acessível de cada parada — regressão de foco |
| `titulos` | `document.title` e o esqueleto de headings — hierarquia quebrada por remoção |

Cada medida vira um hash por superfície. As superfícies são as 13 rotas reais, os 3
redirecionamentos, a rota curinga e as 6 abas de Gestão — 23 ao todo.

Os redirecionamentos entram de propósito: são eles que provam que `/relatorios`,
`/analise-complexidade` e `/analise` continuam respondendo depois que os imports órfãos
saem de `App.tsx`.

## A regra

- Commit que **só remove** código: diferença **zero** nas quatro medidas, em todas as
  superfícies. Não "diferença pequena" — zero.
- Commit que **corrige**: declara antes qual superfície e qual medida podem mexer, e por
  quanto. O que mexer além do declarado é regressão.

## Como rodar

Com `npm run dev` no ar e a aplicação aberta, cole o conteúdo de `fotografia.js` no
console (ou `eval(await (await fetch('/scripts/fotografia.js')).text())`), e então:

```js
await __foto.controles()   // 1. a ferramenta enxerga?
await __foto.estavel()     // 2. repete? e não depende da ordem?
const antes = (await __foto.estavel()).foto
// ... troca de commit, recarrega a página, cola de novo ...
__foto.comparar(antes, await __foto.tudo())
```

Deixe o `localStorage` vazio antes de começar: a fotografia mede o que o store contém. E
fixe a largura da janela, a mesma nas duas pontas: a medida `numeros` inclui os rótulos de
eixo dos gráficos, e o Recharts escolhe quantos cabem conforme o espaço. A largura entra na
fotografia, e `comparar` recusa comparação entre larguras diferentes em vez de devolver uma
lista de superfícies que parece regressão.

## Os dois controles, e por que nenhum é opcional

**`__foto.controles()` — a ferramenta enxerga?** Quebra de propósito uma coisa de cada
tipo e confere que a medida correspondente acusa: renomeia um botão (`a11y`), muda um
número (`numeros`), tira um link da ordem de tabulação (`foco`), rebaixa um heading
(`titulos`). Uma comparação que sempre devolve "igual" não é evidência de que nada mudou;
pode ser a ferramenta que não vê. É o achado 7 aplicado ao próprio instrumento.

**`__foto.estavel()` — a fotografia se repete, e não depende da ordem?** Três passagens.
Duas na ordem normal: se discordam, a comparação entre commits mede ruído, não código. A
terceira com as superfícies em **ordem inversa**: se discorda das outras duas, alguma coisa
sobrevive de uma superfície para a seguinte, e a fotografia passa a depender de quantas
vezes foi chamada antes.

Este segundo controle pegou o primeiro defeito do próprio arreio: entrar numa rota em que já
se está não dispara render, e a primeira leitura de `/` saía do render anterior ao
congelamento do relógio. Daí a rota neutra entre uma superfície e a seguinte.

## O que fica de fora da medição, e por quê

O Recharts mantém um `span#recharts_measurement_span` fora do `#root`, em `y = -20000`, com o
último rótulo que mediu. Tem layout, entra no `innerText` e virava número na medida
`numeros`. Como o Orçamento é a última superfície, a passagem que capturou a primeira linha
de base não o via, e toda passagem posterior o via: **25 superfícies acusaram diferença num
commit que não tinha mexido em nenhuma delas.**

A regra que resolve é de classe, não de instância: descarta-se **qualquer filho direto do
`body` estacionado fora da tela** (caixa inteiramente acima ou à esquerda por mais de
1000 px). Vale para a próxima biblioteca que pendurar rascunho no `body`, sem precisar
descobrir o nome dela antes. Medido nos dois sentidos: com a regra ligada, a rota inexistente
mede `404`; com ela desligada, mede `404 20` — o `20` é o "R$ 20k" do gráfico do Orçamento.

**A passagem em ordem inversa não pega este caso, e isso foi medido.** Em qualquer ordem o
rascunho acaba guardando algum rótulo, e as três passagens concordam. Ela pega outra coisa:
resíduo cujo *conteúdo* depende de qual superfície veio antes — estado no documento, portal
que não desmonta, foco preso. As duas coberturas são diferentes e nenhuma substitui a outra.

## O relógio

Várias telas chamam `new Date()`. Sem congelar, a fotografia mede o calendário. O arreio
substitui `window.Date` por uma subclasse de instante fixo (padrão `2026-03-17T09:00-03:00`)
antes de qualquer medida, e `__foto.soltarRelogio()` devolve o original.

## O que ele não cobre

Diálogos. São 15, alcançáveis por caminhos diferentes, e dirigi-los de forma genérica
custaria mais do que vale nesta etapa: nenhum commit da Etapa 5 remove diálogo. Se uma
etapa futura mexer neles, o arreio precisa crescer antes.

## Por que a suíte de testes não substitui isto (Etapa 7)

A Etapa 7 trouxe `npm test` (Vitest + jsdom), e **as quatro medidas deste arreio não migram
para lá**. O motivo é medido, não estimado: as quatro dependem de `checkVisibility`,
`innerText` e `getBoundingClientRect`, e jsdom não calcula layout. Na aba Orçamento, 28 dos 79
elementos semânticos e 13 dos 96 números só ficam de fora da contagem porque o navegador
calcula layout e o Radix mantém montado o conteúdo das abas fechadas. Em jsdom essas medidas
não ficariam piores — mediriam outra coisa.

Rodar o arreio num navegador headless no CI também ficou de fora, por decisão registrada no
backlog: o valor dele é o hash que muda, e hash que muda diz *que* algo mudou, não *o quê*.
Como portão automático, reprovaria o build a cada mudança legítima de interface — e portão que
reprova com razão o tempo todo é portão que se aprende a ignorar. Este instrumento funciona
porque é conduzido: quem roda declara antes qual superfície pode mover, e por quê.
