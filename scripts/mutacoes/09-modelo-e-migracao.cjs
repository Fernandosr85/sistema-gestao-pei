const { rodar } = require('./comum.cjs');

/* Etapa 9 — o PEI como entidade e a migração v4 — 7 mutações. Era `mutar9.cjs` no scratchpad da sessão. */

const MUTACOES = [
  {
    nome: 'a migração v4 não renomeia o tipo do atendimento',
    arq: 'src/store/migrations.ts',
    de: '  appointments: state.appointments.map((appointment) => ({\n    ...appointment,\n    tipo: renameLegacyAppointmentType(appointment.tipo) ?? \'other\',\n  })),',
    para: '  appointments: state.appointments as unknown as DemoState[\'appointments\'],',
  },
  {
    nome: 'tipo desconhecido passa a DESCARTAR o atendimento em vez de virar other',
    arq: 'src/store/migrations.ts',
    de: '    tipo: renameLegacyAppointmentType(appointment.tipo) ?? \'other\',',
    para: '    tipo: renameLegacyAppointmentType(appointment.tipo) as AppointmentType,',
  },
  {
    nome: 'a v4 injeta o PEI da semente nos dados de quem migrou',
    arq: 'src/store/migrations.ts',
    de: '  peis: [],\n  peiGoals: [],\n  peiGoalNotes: [],\n  peiRevisions: [],\n});',
    para: '  peis: createSeedState().peis,\n  peiGoals: createSeedState().peiGoals,\n  peiGoalNotes: createSeedState().peiGoalNotes,\n  peiRevisions: createSeedState().peiRevisions,\n});',
  },
  {
    nome: 'a cascata deixa meta sem plano no estado',
    arq: 'src/store/persistence.ts',
    de: '  const peiGoalsKept = peiGoals.kept.filter((goal) => peiIds.has(goal.peiId));',
    para: '  const peiGoalsKept = peiGoals.kept;',
  },
  {
    nome: 'a cascata passa a descartar nota por evidência ausente (referência fraca tratada como posse)',
    arq: 'src/store/persistence.ts',
    de: '  const peiGoalNotesKept = peiGoalNotes.kept.filter((note) => goalIds.has(note.goalId));',
    para: '  const observationIds = new Set(observationsKept.map((item) => item.id));\n  const peiGoalNotesKept = peiGoalNotes.kept.filter(\n    (note) => goalIds.has(note.goalId) && (note.source?.kind !== \'observation\' || observationIds.has(note.source.id)),\n  );',
  },
  {
    nome: 'o título do objetivo volta a sair da avaliação, não da meta',
    arq: 'src/lib/pei.ts',
    de: '  objective.goalId === undefined\n    ? objective.title\n    : (goals.find((goal) => goal.id === objective.goalId)?.title ?? \'Meta não encontrada\');',
    para: '  objective.title ?? \'Meta não encontrada\';',
  },
  {
    nome: 'a versão gravada continua 3, com o estado da v4 dentro',
    arq: 'src/store/persistence.ts',
    de: 'const STORAGE_VERSION = 4;',
    para: 'const STORAGE_VERSION = 3;',
  },
];

module.exports = { MUTACOES, TITULO: "Etapa 9 — o PEI como entidade e a migração v4" };

if (require.main === module) {
  process.exit(rodar(MUTACOES, "Etapa 9 — o PEI como entidade e a migração v4") === 0 ? 0 : 1);
}
