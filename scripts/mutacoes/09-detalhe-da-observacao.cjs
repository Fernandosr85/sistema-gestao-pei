const { rodar } = require('./comum.cjs');

/* Etapa 9 — o detalhe da observação — 3 mutações. Era `mutar15.cjs` no scratchpad da sessão. */
// Mutações do detalhe da observação (Etapa 9).

const MUTACOES = [
  {
    nome: 'as metas citadas passam a ser todas as metas do sistema',
    arq: 'src/lib/pei.ts',
    de: '  return state.peiGoals.filter((goal) => goalIds.has(goal.id));',
    para: '  return state.peiGoals;',
  },
  {
    nome: 'a busca ignora o tipo da evidência (observação casa com avaliação de mesmo id)',
    arq: 'src/lib/pei.ts',
    de: '      .filter((note) => note.source?.kind === kind && note.source.id === id)',
    para: '      .filter((note) => note.source?.id === id)',
  },
  {
    nome: 'o diálogo volta a afirmar local e horário que a observação não tem',
    arq: 'src/components/ObservationDetailDialog.tsx',
    de: '                    <strong>Período:</strong> {observation.periodo === \'manha\' ? \'Manhã\' : \'Tarde\'} ·{\' \'}\n                    {observation.duracao} minutos',
    para: '                    <strong>Horário:</strong> 08:30 - 10:30 · Sala de Aula Regular',
  },
];

module.exports = { MUTACOES, TITULO: "Etapa 9 — o detalhe da observação" };

if (require.main === module) {
  process.exit(rodar(MUTACOES, "Etapa 9 — o detalhe da observação") === 0 ? 0 : 1);
}
