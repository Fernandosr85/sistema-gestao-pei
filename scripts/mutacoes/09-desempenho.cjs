const { rodar } = require('./comum.cjs');

/* Etapa 9 — a tela de Desempenho — 5 mutações. Era `mutar13.cjs` no scratchpad da sessão. */
// Mutações da tela de Desempenho (Etapa 9). Âncoras LIDAS dos arquivos, não escritas de memória.

const MUTACOES = [
  {
    nome: 'a série passa a mostrar as avaliações de todos os estudantes',
    arq: 'src/lib/assessment.ts',
    de: '    .filter((assessment) => assessment.studentId === studentId)\n',
    para: '',
  },
  {
    nome: 'a medição datada passa a ser a maior dos objetivos, não a média',
    arq: 'src/lib/assessment.ts',
    de: '        assessment.objectives.reduce((sum, objective) => sum + objective.progress, 0) /\n          assessment.objectives.length,',
    para: '        Math.max(...assessment.objectives.map((objective) => objective.progress)),',
  },
  {
    nome: 'o rótulo do progresso das metas vira genérico no Desempenho',
    arq: 'src/components/StudentPerformanceDialog.tsx',
    de: "                    {progresso === undefined ? 'Sem PEI vigente' : 'Progresso nas metas do PEI'}",
    para: "                    {progresso === undefined ? 'Sem PEI vigente' : 'Progresso'}",
  },
  {
    nome: 'estudante sem plano passa a ver 0/0 em vez do travessão',
    arq: 'src/components/StudentPerformanceDialog.tsx',
    de: "                    {goals.length === 0 ? '\u2014' : `${contagens.achieved}/${goals.length}`}",
    para: '                    {`${contagens.achieved}/${goals.length}` + (goals.length === 0 ? \' (0%)\' : \'\')}',
  },
  {
    nome: 'a aba curricular passa a incluir as áreas socioemocionais',
    arq: 'src/components/StudentPerformanceDialog.tsx',
    de: "const AREAS_CURRICULARES: PeiGoalArea[] = [\n  'portuguese',",
    para: "const AREAS_CURRICULARES: PeiGoalArea[] = [\n  'selfRegulation',\n  'portuguese',",
  },
];

module.exports = { MUTACOES, TITULO: "Etapa 9 — a tela de Desempenho" };

if (require.main === module) {
  process.exit(rodar(MUTACOES, "Etapa 9 — a tela de Desempenho") === 0 ? 0 : 1);
}
