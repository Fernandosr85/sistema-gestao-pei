const { rodar } = require('./comum.cjs');

/* Etapa 9 — a Minha Agenda — 4 mutações. Era `mutar16.cjs` no scratchpad da sessão. */
// Mutações da Minha Agenda (Etapa 9, opção a').

const MUTACOES = [
  {
    nome: 'o bloco de atrasados some, e com ele os agendados de data passada',
    arq: 'src/pages/MinhaAgenda.tsx',
    de: '  const atrasados = state.appointments\n    .filter((appointment) => isOpenAppointment(appointment.status) && !idsProximos.has(appointment.id))\n    .sort(maisRecentePrimeiro);',
    para: '  const atrasados: Atendimento[] = [];',
  },
  {
    nome: 'o nome do estudante volta a ser texto, em vez de resolvido pelo id',
    arq: 'src/pages/MinhaAgenda.tsx',
    de: '      <span className="font-medium">Estudante:</span> {studentNameOf(state, appointment.studentId)}',
    para: '      <span className="font-medium">Estudante:</span> Maria',
  },
  {
    nome: 'o tipo do atendimento volta a aparecer como identificador',
    arq: 'src/pages/MinhaAgenda.tsx',
    de: '      <Badge variant="outline">{appointmentTypeLabel(appointment.tipo)}</Badge>',
    para: '      <Badge variant="outline">{appointment.tipo}</Badge>',
  },
  {
    nome: 'o bloco dos próximos 7 dias passa a trazer todos os futuros',
    arq: 'src/pages/MinhaAgenda.tsx',
    de: '  const seteDias = upcomingAppointmentsWithin(state, agora, 7);',
    para: '  const seteDias = upcomingAppointments(state, agora);',
  },
];

module.exports = { MUTACOES, TITULO: "Etapa 9 — a Minha Agenda" };

if (require.main === module) {
  process.exit(rodar(MUTACOES, "Etapa 9 — a Minha Agenda") === 0 ? 0 : 1);
}
