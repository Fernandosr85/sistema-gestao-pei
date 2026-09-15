# Backlog de correções — uma etapa por sessão

Cada etapa é uma sessão separada do Claude Code, com commit e verificação própria.
Não começar a seguinte antes de `npm run lint`, `npm run typecheck` e `npm run build`
passarem na anterior.

Origem: auditoria estática do commit `4c22d53` (Claude) + auditoria complementar (Codex).

---

## Achados

Defeitos cuja gravidade vai além do controle em que apareceram. É material para o artigo:
cada item registra o que acontecia, como foi confirmado e o que ainda está aberto.

### 1. Vazamento de dados de saúde entre estudantes (Etapa 2, commit `2fb404d`)

**Qualificação:** o defeito não era um formulário mal inicializado, e sim a exibição dos
dados de saúde de uma estudante na ficha de outros. Os dados eram fictícios. Com dados
reais, seria incidente de segurança com dado pessoal sensível (LGPD, art. 5º, II) de
crianças e adolescentes (art. 14), a ser comunicado à ANPD e aos titulares (art. 48).

**Onde:**
- **`EditarCadastroDialog`:** todos os campos eram `defaultValue` fixo de Ana Carolina
  Souza. O título mostrava o nome do estudante aberto, mas os campos traziam os dados
  dela: nome, nascimento, matrícula MAT-2024-003, médico responsável ("Dra. Ana Paulita")
  e CID-10 F84.0.
- **`StudentDetail`, card "Perfil de Saúde":** mostrava "Medicina: Ana Paulita",
  "Restrições/Alergias: Nenhuma" e "Último Laudo: 01/02/2024" para todos os estudantes.
  Essa segunda tela não constava de nenhum inventário, nem no do Codex nem no da Etapa 2;
  apareceu durante a correção do diálogo.

**Como foi confirmado:** no navegador, antes da correção, abri o diálogo em `/alunos/1`
(Maria Silva Santos) e em `/alunos/2` (Pedro Oliveira Costa). Nos dois casos, ele trouxe
matrícula, médico e CID de Ana Carolina. Depois da correção, cada diálogo abre com os dados
do próprio estudante, sem nenhum campo de saúde fora do modelo.

**Correção:**
- **Formulário:** passou a ser controlado a partir do estudante da ficha, com chave nova a
  cada abertura.
- **Campos de saúde:** medicação, alergias, médico e CID saíram do formulário e da ficha,
  por minimização. O modelo `Student` nunca teve esses campos; eles eram texto fixo na
  interface.

A remontagem a cada abertura importa. No teste, com o painel do navegador oculto, a
animação de saída não terminou e o conteúdo fechado continuou montado. O diálogo reabriu
com o estado anterior. Um formulário que depende da desmontagem para limpar o estado pode
exibir dados de uma abertura na seguinte.

**Ainda aberto:** o mesmo padrão continua em telas ilustrativas, com texto fixo de Ana
Carolina exibido sob o nome de qualquer estudante:
- **Histórico, laudo:** `StudentHistoryDialog.tsx:74-75` mostra "Laudo médico atualizado
  (TEA Nível 1)" e "Médica: Dra. Ana Paulita" no histórico de todos. É dado de saúde, sem
  aviso de exemplo.
- **Histórico, demais eventos:** `StudentHistoryDialog.tsx:91` e `:142` mostram a
  participação dela na feira de ciências, a matrícula e a turma.
- **Ver PEI:** `VerPEIDialog.tsx:67` mostra o diagnóstico com CID (F84.0), sob aviso de PEI
  de exemplo.
- **Detalhe da observação:** `ObservationDetailDialog.tsx:40` e `:393` mostram a matrícula,
  a turma e o nome da mãe dela em qualquer observação.
- **Apresentação:** `PresentationModeDialog.tsx:57` e `:127` mostram a turma e uma conquista
  dela na apresentação de qualquer estudante.
- **Anexos:** `AnexosDialog.tsx:26` lista um laudo assinado pela mesma médica, sob aviso de
  exemplo.

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

---

## Etapa 3 — Acessibilidade profunda

Base já feita na Etapa 0 (menu mobile, skip link, `<main>`, contraste, nomes no header).
Falta:

1. **Matriz de risco 3×3** (`gestao/AlertasRiscosContent.tsx:365,478`): badges clicáveis
   são `<span>`, inalcançáveis por teclado. Virar `<button>` com nome descritivo;
   probabilidade/impacto/severidade como texto, não só posição na grade e tom de cor.
2. **Heatmap** (`reports/ObservationHeatmap.tsx`): dias são `<div>` não focáveis com
   contagem só em tooltip de hover. Virar botões focáveis com nome "12 de novembro, 3
   observações", ou tabela equivalente. Legenda precisa de valores.
3. **Gráficos Recharts** (`ProgressChart`, `PEIRadarChart`, `InterventionDonut`): sem
   nome acessível nem tabela equivalente. Donut tem realce só por mouse e legenda
   customizada não focável.
4. **Emoji com significado** (`BenchmarkingTable`, `ExecutiveSummary`, `VerPEIDialog`):
   `✅🟡🔴` carregam status sozinhos. Acrescentar texto; `aria-hidden` nos decorativos.
5. **Estrelas de avaliação** (`ResourceDetailModal.tsx:225-242`): cinco botões só com SVG,
   sem nome nem estado. Virar radiogroup rotulado com valor textual visível.

   Evidência de campo: durante o teste da Etapa 1, a árvore de acessibilidade do diálogo
   expôs as cinco estrelas como botões sem nome e sem estado. Não foi possível identificar
   qual estrela era qual, nem a nota selecionada, sem inspecionar o DOM. Confirma o defeito
   na prática, não só na análise estática. A ativação por teclado não foi verificada: a
   ferramenta de teste não ativa por Enter/Space nem botões com nome.
6. **Diálogos**: `PresentationModeDialog` não tem `DialogTitle` no modo apresentação e
   não move foco nem anuncia troca de slide. Outros diálogos sem `DialogDescription`.
7. **Hierarquia de headings**: `NewObservation` usa `<h4>` sob `<h1>`; `VisaoGeralContent`
   abre com `<h3>`. Corrigir os outlines de todas as rotas.
8. **Alvos de toque**: botões `sm` com 36 px e ícones 40×40. Rodapé de apresentação não
   quebra linha. Testar em 320 px e zoom 200%.

**Critério de aceite:** navegar o sistema inteiro só com teclado, sem ficar preso nem
encontrar controle inalcançável. Toda informação disponível por cor/hover também
disponível como texto.

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

## Fora de escopo até decisão do autor

- Backend real, autenticação, RBAC
- Integração OAuth com Google/Outlook
- Exportação PDF/Excel/Word
- Qualquer análise preditiva de verdade (exigiria dataset governado e validação; hoje há
  4 alunos fictícios)

Enquanto não existirem, o README e as telas devem continuar dizendo que não existem.
