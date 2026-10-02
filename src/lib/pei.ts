import type { AssessmentObjective, Atendimento } from '@/types';
import type {
  Pei,
  PeiGoal,
  PeiGoalArea,
  PeiGoalNote,
  PeiGoalNoteSource,
  PeiGoalStatus,
  PeiReviewFrequency,
  PeiRevision,
  PeiStatus,
} from '@/types/pei';
import type { DemoState } from '@/types/store';
import { appointmentTypeLabel } from './appointment';
import { formatLocalDate } from './date';

/**
 * Título do objetivo medido numa avaliação: vem da META quando a avaliação aponta para ela, e do
 * próprio registro quando é objetivo solto, de antes de o PEI existir. Nunca dos dois — é o
 * princípio do `studentNameOf` da Etapa 5, e a forma do tipo `AssessmentObjective` o garante.
 *
 * Meta ausente devolve texto explícito, como `studentNameOf` faz com estudante ausente: a ligação
 * é fraca de propósito (a nota e a medição valem sem ela), então a tela tem de tolerar o vazio.
 */
export const objectiveTitle = (objective: AssessmentObjective, goals: PeiGoal[]): string =>
  objective.goalId === undefined
    ? objective.title
    : (goals.find((goal) => goal.id === objective.goalId)?.title ?? 'Meta não encontrada');

/**
 * Os rótulos das áreas, com as palavras da parte III do manual (`src/pages/Manual.tsx`): seis
 * componentes curriculares e quatro habilidades socioemocionais. A ordem das chaves é a ordem em
 * que a tela agrupa as metas, e é a do manual — não é taxonomia legal.
 */
const peiGoalAreaLabels: Record<PeiGoalArea, string> = {
  portuguese: 'Língua Portuguesa',
  math: 'Matemática',
  science: 'Ciências',
  geographyHistory: 'Geografia/História',
  arts: 'Arte',
  physicalEducation: 'Educação Física',
  selfRegulation: 'Autorregulação emocional',
  socialInteraction: 'Interação social',
  functionalCommunication: 'Comunicação funcional',
  autonomy: 'Autonomia',
};

export const peiGoalAreaLabel = (area: PeiGoalArea): string => peiGoalAreaLabels[area];

const peiGoalStatusLabels: Record<PeiGoalStatus, string> = {
  notStarted: 'Não iniciada',
  inProgress: 'Em progresso',
  achieved: 'Alcançada',
  needsReview: 'Precisa de revisão',
};

export const peiGoalStatusLabel = (status: PeiGoalStatus): string => peiGoalStatusLabels[status];

const peiStatusLabels: Record<PeiStatus, string> = {
  draft: 'Rascunho',
  active: 'Vigente',
  closed: 'Encerrado',
};

export const peiStatusLabel = (status: PeiStatus): string => peiStatusLabels[status];

const peiReviewFrequencyLabels: Record<PeiReviewFrequency, string> = {
  quarterly: 'Trimestral',
  semiannual: 'Semestral',
  annual: 'Anual',
};

export const peiReviewFrequencyLabel = (frequency: PeiReviewFrequency): string =>
  peiReviewFrequencyLabels[frequency];

/**
 * O PEI vigente do estudante, ou `undefined` quando não há.
 *
 * Decisão de produto: um vigente por estudante, com os anteriores preservados — o manual pede
 * "PEI vigente e histórico" (9.1). Sem plano vigente não existe número para exibir, e a tela diz
 * "Sem PEI vigente" em vez de 0%: zero é uma medida, e medida que ninguém fez não se mostra. É a
 * mesma regra do `studentProgress` com estudante sem avaliação.
 */
export const activePeiOf = (state: DemoState, studentId: string): Pei | undefined =>
  state.peis.find((pei) => pei.studentId === studentId && pei.status === 'active');

/** Os planos que não são o vigente, do mais recente para o mais antigo (manual 9.1). */
export const peiHistoryOf = (state: DemoState, studentId: string): Pei[] =>
  state.peis
    .filter((pei) => pei.studentId === studentId && pei.status !== 'active')
    .sort((a, b) => b.startsOn.localeCompare(a.startsOn));

export const goalsOfPei = (state: DemoState, peiId: string): PeiGoal[] =>
  state.peiGoals.filter((goal) => goal.peiId === peiId);

/** Notas da meta, da mais recente para a mais antiga. */
export const notesOfGoal = (state: DemoState, goalId: string): PeiGoalNote[] =>
  state.peiGoalNotes.filter((note) => note.goalId === goalId).sort((a, b) => b.date.localeCompare(a.date));

/** Revisões do plano, da mais recente para a mais antiga. */
export const revisionsOfPei = (state: DemoState, peiId: string): PeiRevision[] =>
  state.peiRevisions.filter((revision) => revision.peiId === peiId).sort((a, b) => b.date.localeCompare(a.date));

/** Metas agrupadas por área, na ordem do manual, sem área vazia. */
export const goalsByArea = (goals: PeiGoal[]): Array<{ area: PeiGoalArea; goals: PeiGoal[] }> =>
  (Object.keys(peiGoalAreaLabels) as PeiGoalArea[])
    .map((area) => ({ area, goals: goals.filter((goal) => goal.area === area) }))
    .filter((group) => group.goals.length > 0);

/**
 * Progresso médio das metas do plano, 0 a 100. Na tela o rótulo é **"Progresso nas metas do
 * PEI"**, porque existe outro progresso no sistema — a média dos objetivos da avaliação mais
 * recente, em `studentProgress` — e os dois não medem a mesma coisa: este é o valor corrente das
 * metas, aquele é a medição de uma data. Rótulo genérico deixaria os dois indistinguíveis.
 *
 * Plano sem meta não tem média: `undefined`, nunca 0.
 */
export const peiGoalsProgress = (goals: PeiGoal[]): number | undefined =>
  goals.length === 0 ? undefined : Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length);

/** Quantas metas em cada status, para a tela não contar à mão. */
export const goalCountsByStatus = (goals: PeiGoal[]): Record<PeiGoalStatus, number> =>
  goals.reduce<Record<PeiGoalStatus, number>>(
    (counts, goal) => ({ ...counts, [goal.status]: counts[goal.status] + 1 }),
    { notStarted: 0, inProgress: 0, achieved: 0, needsReview: 0 },
  );

/**
 * De onde veio a evidência da nota, em texto.
 *
 * A ligação é FRACA de propósito: a nota é o que alguém escreveu sobre a meta e vale sem o
 * registro citado, então o carregamento preserva a nota quando a evidência é descartada (ver a
 * cascata em `store/persistence.ts`). Evidência ausente é, por isso, um resultado a exibir — e
 * não um erro a esconder nem motivo para omitir a nota.
 */
export const noteSourceLabel = (state: DemoState, source: PeiGoalNoteSource): string => {
  if (source.kind === 'observation') {
    const observation = state.observations.find((item) => item.id === source.id);
    return observation
      ? `Observação de ${formatLocalDate(observation.data)}`
      : 'Observação não encontrada no registro';
  }
  if (source.kind === 'assessment') {
    const assessment = state.assessments.find((item) => item.id === source.id);
    return assessment
      ? `Avaliação de ${formatLocalDate(assessment.date)}`
      : 'Avaliação não encontrada no registro';
  }
  const appointment = state.appointments.find((item) => item.id === source.id);
  return appointment
    ? `${appointmentTypeLabel(appointment.tipo)} de ${formatLocalDate(appointment.data)}`
    : 'Atendimento não encontrado no registro';
};

/**
 * Atendimentos com a família do estudante, do mais recente para o mais antigo. O manual trata a
 * família como coautora do plano (5.2), e o registro dessas reuniões já existe na agenda — a tela
 * do PEI lê de lá em vez de guardar uma segunda cópia.
 */
export const familyMeetingsOf = (state: DemoState, studentId: string): Atendimento[] =>
  state.appointments
    .filter((appointment) => appointment.studentId === studentId && appointment.tipo === 'familyMeeting')
    .sort((a, b) => b.data.localeCompare(a.data));

/** O atendimento que a revisão cita, quando ele existe — é onde mora a ata (ver `PeiRevision`). */
export const appointmentOf = (state: DemoState, appointmentId: string): Atendimento | undefined =>
  state.appointments.find((appointment) => appointment.id === appointmentId);
