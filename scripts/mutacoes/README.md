# Mutação: plantar o defeito e exigir que a suíte reprove

A segunda das três camadas de controle positivo da suíte (Etapa 7 do
[BACKLOG](../../BACKLOG-CLAUDE-CODE.md)). As outras duas são a suíte reprovar quando não
encontra teste nenhum (`passWithNoTests: false`) e as asserções de falsificação dentro de cada
arquivo de teste.

**Verde não valida suíte. O que valida é ela reprovar quando deve.** Cada mutação aqui planta,
no código de **produção**, o defeito que um teste diz pegar, roda `npm test` e exige vermelho.
Depois restaura o arquivo.

## Como rodar

```bash
node scripts/mutacoes/executar.cjs                # todos os lotes
node scripts/mutacoes/executar.cjs 09-ver-pei     # um lote
```

Leva cerca de 20 segundos por mutação: a suíte inteira roda a cada uma. O arquivo mutado volta
ao original mesmo quando a execução falha no meio (`finally` em `comum.cjs`); se algo
interromper o processo, `git status` mostra o arquivo sujo e `git checkout --` o devolve.

## O que cada lote cobre

| Arquivo | Mutações | Alvo |
|---|---:|---|
| `08-guarda-de-rotas.cjs` | 3 | a guarda de navegação da Etapa 8: destino não literal, `<Navigate>`, apelido de `useNavigate` |
| `09-modelo-e-migracao.cjs` | 7 | a entidade PEI, a migração v4 e a cascata de descarte por posse |
| `09-ver-pei.cjs` | 10 | a tela Ver PEI: plano do estudante, média das metas, evidência, rótulos |
| `09-progresso.cjs` | 7 | a troca de fonte do progresso, o rótulo nas duas telas e a contagem de revisões |
| `09-nome-do-fechar.cjs` | 2 | o nome acessível do fechar do diálogo e do toast |
| `09-desempenho.cjs` | 5 | a série das avaliações, as áreas e o que saiu por não existir no modelo |
| `09-apresentacao.cjs` | 6 | os slides vindos do plano, o nome da região e o foco ao abrir |
| `09-detalhe-da-observacao.cjs` | 3 | as metas que citam a observação, e o tipo da evidência |
| `09-minha-agenda.cjs` | 4 | os atendimentos do store, o bloco de atrasados e os rótulos |
| **total** | **47** | |

## A regra de contagem, e o que falta

**Uma mutação é uma entrada de lote que foi plantada e executada.** O número vale por script,
não por lembrança: foi uma recontagem por script que corrigiu "18 mutações" para 27 na Etapa 7
(achado 11 do BACKLOG).

**O conjunto da série tem 74 mutações; 47 estão aqui.** As 27 da Etapa 7 — persistência e
migrações (4), datas (3), seletores (6), reducer (5), rotas (3) e fluxo (6) — foram escritas em
scripts que viviam no diretório temporário da sessão e **não sobreviveram**: o diretório foi
limpo entre sessões. O resultado delas está registrado no BACKLOG e nas mensagens dos commits da
Etapa 7, mas **não é reproduzível a partir deste repositório**.

**Elas não serão reescritas**, por decisão do autor em 03/10/2026 (Pendências abertas, item 4, do
BACKLOG). Reescrever a partir do teste de hoje produz mutação que casa com o que o teste **faz
hoje**, não com o defeito que ele existia para pegar em 18/09/2026 — quatro dos seis arquivos de
teste daquela etapa mudaram depois dela, e o `studentProgress` que as seis mutações de seletor
atacavam foi reescrito na Etapa 9 (a conta antiga virou `assessmentProgress`). Seriam 27 mutações
novas com aparência de reconstituição, e isso é pior que 27 declaradas perdidas.

**O que este diretório afirma: 47 reproduzíveis. O que o BACKLOG atesta: 27 acusadas em
18/09/2026, sem reprodução.** Os dois números não se somam numa afirmação só.

É por isso que estes scripts estão versionados: um número que ninguém consegue reproduzir não é
medida, e era o número mais citado da série.

## Duas coisas que a mecânica não pode perder

**A asserção de casamento único.** Se a substituição não casa exatamente uma vez, a mutação
**não foi plantada**, e o verde da suíte significa "nada mudou", não "a suíte não pega". Sem a
asserção, os dois são indistinguíveis. Ela impediu resultado falso seis vezes nesta série
(achado 11): três na Etapa 7, uma na 8 e duas na 9 — uma por indentação, outra por fim de linha.

**Fim de linha fora da âncora.** As âncoras são escritas em LF. O repositório tem
`core.autocrlf=true`, então a cópia de trabalho no Windows é CRLF arquivo a arquivo, e uma
âncora com `\n` casava zero vezes. `comum.cjs` normaliza o arquivo antes de casar e devolve o
fim de linha original. Foi versionar os scripts que obrigou a resolver isso: o que era hábito de
uma máquina virou código que roda em qualquer uma.

## Quando rodar

- Ao acrescentar teste: a mutação do defeito que ele diz pegar entra junto, no mesmo commit.
- Ao trocar o runner (`vitest`), com linha de base medida **antes** da troca: verde com runner
  novo é indistinguível de verde com runner que não reprova mais nada.
- Ao mover código que alguma mutação mira: a âncora se **lê do arquivo**, nunca se escreve de
  memória.
