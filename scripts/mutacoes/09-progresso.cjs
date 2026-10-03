const { rodar } = require('./comum.cjs');

/* Etapa 9 — a troca de fonte do progresso do estudante — 7 mutações. Era `mutar11.cjs` no scratchpad da sessão. */
// Mutações da troca de fonte do progresso (Etapa 9). O risco específico deste commit é a troca
// silenciosa: número de uma fonte sob o rótulo da outra.

const MUTACOES = [
  {
    nome: 'o progresso volta a sair da avaliação mais recente, sob o rótulo do plano',
    arq: 'src/lib/metrics.ts',
    de: '  const pei = activePeiOf(state, studentId);\n  return pei ? peiGoalsProgress(goalsOfPei(state, pei.id)) : undefined;',
    para: '  const avaliacoes = state.assessments.filter((a) => a.studentId === studentId);\n  const ultima = avaliacoes[avaliacoes.length - 1];\n  if (!ultima || ultima.objectives.length === 0) return undefined;\n  return Math.round(ultima.objectives.reduce((s, o) => s + o.progress, 0) / ultima.objectives.length);',
  },
  {
    nome: 'estudante sem plano passa a valer 0% em vez de "Sem PEI vigente"',
    arq: 'src/lib/metrics.ts',
    de: '  return pei ? peiGoalsProgress(goalsOfPei(state, pei.id)) : undefined;',
    para: '  return pei ? (peiGoalsProgress(goalsOfPei(state, pei.id)) ?? 0) : 0;',
  },
  {
    nome: 'o rótulo do cartão volta a ser o da fonte antiga',
    arq: 'src/components/StudentCard.tsx',
    de: '            <span className="text-muted-foreground">Progresso nas metas do PEI</span>',
    para: '            <span className="text-muted-foreground">Progresso médio dos objetivos na avaliação mais recente</span>',
  },
  {
    nome: 'o vazio do cartão volta a falar de avaliação',
    arq: 'src/components/StudentCard.tsx',
    de: '              <span className="shrink-0 text-muted-foreground">Sem PEI vigente</span>',
    para: '              <span className="shrink-0 text-muted-foreground">Sem avaliação registrada</span>',
  },
  {
    nome: 'o rótulo da ficha volta a ser o da fonte antiga',
    arq: 'src/pages/StudentDetail.tsx',
    de: '                        Progresso nas metas do PEI',
    para: '                        Progresso médio dos objetivos na avaliação mais recente',
  },
  {
    nome: 'a contagem de revisões conta as do sistema inteiro, não as do plano do estudante',
    arq: 'src/lib/metrics.ts',
    de: '  const revisions = pei ? state.peiRevisions.filter((item) => item.peiId === pei.id) : [];',
    para: '  const revisions = state.peiRevisions;',
  },
  {
    nome: 'a revisão fica fora da data do último registro',
    arq: 'src/lib/metrics.ts',
    de: '    ...appointments.map((item) => item.data),\n    ...revisions.map((item) => item.date),',
    para: '    ...appointments.map((item) => item.data),',
  },
];

module.exports = { MUTACOES, TITULO: "Etapa 9 — a troca de fonte do progresso do estudante" };

if (require.main === module) {
  process.exit(rodar(MUTACOES, "Etapa 9 — a troca de fonte do progresso do estudante") === 0 ? 0 : 1);
}
