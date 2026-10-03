const { rodar } = require('./comum.cjs');

/* Etapa 9 — a tela Ver PEI — 10 mutações. Era `mutar10.cjs` no scratchpad da sessão. */
// Mutações da tela Ver PEI (Etapa 9, commit das telas). Cada uma é um defeito que a suíte
// precisa acusar; a asserção de casamento único impede que uma substituição que não entrou
// seja lida como "a suíte pegou".

const MUTACOES = [
  {
    nome: 'activePeiOf ignora o estudante: o plano de um aparece para todos (achado 1)',
    arq: 'src/lib/pei.ts',
    de: '  state.peis.find((pei) => pei.studentId === studentId && pei.status === \'active\');',
    para: '  state.peis.find((pei) => pei.status === \'active\');',
  },
  {
    nome: 'activePeiOf ignora o status: plano encerrado volta a ser vigente',
    arq: 'src/lib/pei.ts',
    de: '  state.peis.find((pei) => pei.studentId === studentId && pei.status === \'active\');',
    para: '  state.peis.find((pei) => pei.studentId === studentId);',
  },
  {
    nome: 'plano sem meta passa a valer 0% em vez de "sem meta"',
    arq: 'src/lib/pei.ts',
    de: '  goals.length === 0 ? undefined : Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length);',
    para: '  Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / Math.max(goals.length, 1));',
  },
  {
    nome: 'a média exclui as metas não iniciadas e infla o progresso',
    arq: 'src/lib/pei.ts',
    de: '  goals.length === 0 ? undefined : Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length);',
    para: '  goals.length === 0 ? undefined : Math.round(goals.filter((goal) => goal.status !== \'notStarted\').reduce((sum, goal) => sum + goal.progress, 0) / goals.filter((goal) => goal.status !== \'notStarted\').length);',
  },
  {
    nome: 'evidência ausente devolve o identificador cru em vez de texto explícito',
    arq: 'src/lib/pei.ts',
    de: '    : \'Atendimento não encontrado no registro\';',
    para: '    : source.id;',
  },
  {
    nome: 'o agrupamento mantém as áreas vazias',
    arq: 'src/lib/pei.ts',
    de: '    .filter((group) => group.goals.length > 0);',
    para: '    .filter(() => true);',
  },
  {
    nome: 'notesOfGoal ignora a meta: a nota de uma aparece em todas',
    arq: 'src/lib/pei.ts',
    de: '  state.peiGoalNotes.filter((note) => note.goalId === goalId).sort((a, b) => b.date.localeCompare(a.date));',
    para: '  state.peiGoalNotes.slice().sort((a, b) => b.date.localeCompare(a.date));',
  },
  {
    nome: 'os atendimentos com a família ignoram o tipo e trazem a agenda inteira do estudante',
    arq: 'src/lib/pei.ts',
    de: '    .filter((appointment) => appointment.studentId === studentId && appointment.tipo === \'familyMeeting\')',
    para: '    .filter((appointment) => appointment.studentId === studentId)',
  },
  {
    nome: 'o rótulo do progresso volta a ser genérico ("Progresso Atual")',
    arq: 'src/components/VerPEIDialog.tsx',
    de: '                <CardTitle className="text-base">Progresso nas metas do PEI</CardTitle>',
    para: '                <CardTitle className="text-base">Progresso Atual</CardTitle>',
  },
  {
    nome: 'estudante sem plano vigente recebe 0% em vez de "Sem PEI vigente"',
    arq: 'src/components/VerPEIDialog.tsx',
    de: '              <CardTitle className="text-base">Sem PEI vigente</CardTitle>',
    para: '              <CardTitle className="text-base">Progresso nas metas do PEI: 0%</CardTitle>',
  },
];

module.exports = { MUTACOES, TITULO: "Etapa 9 — a tela Ver PEI" };

if (require.main === module) {
  process.exit(rodar(MUTACOES, "Etapa 9 — a tela Ver PEI") === 0 ? 0 : 1);
}
