import type { Assessment, Atendimento } from '@/types';
import type { DemoState } from '@/types/store';
import type { Badge, ResourceReview } from '@/types/resource';
import { isOpenAppointment } from '@/lib/appointment';
import { toLocalISODate } from '@/lib/date';

/**
 * Seletores de métrica compartilhados (Etapa 4 do BACKLOG).
 *
 * Um número que aparece em mais de uma tela sai daqui, para não ter duas contas que divergem.
 * Três regras valem para tudo neste arquivo:
 *
 * - **Funções puras sobre o estado.** Nada aqui lê o store nem o relógio por conta própria.
 * - **A data de referência chega por parâmetro.** Nenhuma função chama `new Date()` sem
 *   argumento; quem chama decide o "hoje", e o mesmo cálculo pode ser refeito para outra data.
 * - **Data de registro é `YYYY-MM-DD` local e se compara como texto.** Nunca
 *   `new Date('YYYY-MM-DD')`: essa forma é lida como meia-noite em UTC, e no Brasil cai no dia
 *   anterior a partir das 21h.
 */

/** Intervalo de datas `YYYY-MM-DD`, inclusivo nas duas pontas. Vazio significa sem limite. */
export interface DatePeriod {
  start: string;
  end: string;
}

/** Registros são datados `YYYY-MM-DD`, então comparar o texto segue o calendário. */
export const isWithinPeriod = (date: string, { start, end }: DatePeriod): boolean =>
  (!start || date >= start) && (!end || date <= end);

export interface StudentCounts {
  total: number;
  active: number;
}

export const studentCounts = (state: DemoState): StudentCounts => ({
  total: state.students.length,
  active: state.students.filter((student) => student.status === 'ativo').length,
});

const byDateAndTime = (a: Atendimento, b: Atendimento): number =>
  `${a.data} ${a.horarioInicio}`.localeCompare(`${b.data} ${b.horarioInicio}`);

/** Atendimentos ainda por acontecer, de hoje em diante, em ordem de data e horário. */
export const upcomingAppointments = (state: DemoState, reference: Date): Atendimento[] => {
  const today = toLocalISODate(reference);
  return state.appointments
    .filter((appointment) => isOpenAppointment(appointment.status) && appointment.data >= today)
    .sort(byDateAndTime);
};

/** Os atendimentos por acontecer entre hoje e hoje mais `days` dias, inclusive. */
export const upcomingAppointmentsWithin = (
  state: DemoState,
  reference: Date,
  days: number,
): Atendimento[] => {
  const until = toLocalISODate(
    new Date(reference.getFullYear(), reference.getMonth(), reference.getDate() + days),
  );
  return upcomingAppointments(state, reference).filter((appointment) => appointment.data <= until);
};

/**
 * A semana, de domingo a sábado, que contém a data de referência, e a anterior.
 *
 * Devolve datas `YYYY-MM-DD`, e não objetos `Date`: comparar um `Date` com hora do dia contra
 * `new Date('YYYY-MM-DD')` fazia o atendimento de domingo sumir das duas semanas.
 */
export const weekPeriod = (reference: Date): DatePeriod => {
  const start = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate() - reference.getDay());
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  return { start: toLocalISODate(start), end: toLocalISODate(end) };
};

export const previousWeekPeriod = (reference: Date): DatePeriod =>
  weekPeriod(new Date(reference.getFullYear(), reference.getMonth(), reference.getDate() - 7));

/** O mês-calendário que contém a data de referência, do dia 1 ao último dia. */
export const monthPeriod = (reference: Date): DatePeriod => ({
  start: toLocalISODate(new Date(reference.getFullYear(), reference.getMonth(), 1)),
  end: toLocalISODate(new Date(reference.getFullYear(), reference.getMonth() + 1, 0)),
});

export const previousMonthPeriod = (reference: Date): DatePeriod =>
  monthPeriod(new Date(reference.getFullYear(), reference.getMonth() - 1, 1));

export const observationsInPeriod = (state: DemoState, period: DatePeriod): number =>
  state.observations.filter((observation) => isWithinPeriod(observation.data, period)).length;

/** Todos os atendimentos com data no período, inclusive cancelados, que continuam na agenda. */
export const appointmentsInPeriod = (state: DemoState, period: DatePeriod): number =>
  state.appointments.filter((appointment) => isWithinPeriod(appointment.data, period)).length;

/**
 * Variação entre dois períodos. Sem registro no período anterior não há base para
 * porcentagem, e isso é um resultado, não um zero: "sem base de comparação".
 */
export type PeriodChange = { kind: 'noBaseline' } | { kind: 'change'; percent: number };

export const periodChange = (current: number, previous: number): PeriodChange =>
  previous === 0
    ? { kind: 'noBaseline' }
    : { kind: 'change', percent: Math.round(((current - previous) / previous) * 100) };

/**
 * Progresso médio dos objetivos na avaliação mais recente do estudante, de 0 a 100.
 *
 * Substitui `Student.progresso`, um número guardado no cadastro que nenhuma avaliação
 * atualizava: aparecia em alunos sem avaliação nenhuma. Sem avaliação, ou sem objetivo na
 * mais recente, não há número — `undefined`, e a tela diz "Sem avaliação registrada".
 */
export const studentProgress = (state: DemoState, studentId: string): number | undefined => {
  const latest = state.assessments
    .filter((assessment) => assessment.studentId === studentId)
    .reduce<Assessment | undefined>(
      (current, assessment) => (!current || assessment.date > current.date ? assessment : current),
      undefined,
    );
  if (!latest || latest.objectives.length === 0) return undefined;
  const total = latest.objectives.reduce((sum, objective) => sum + objective.progress, 0);
  return Math.round(total / latest.objectives.length);
};

export interface StudentRecordSummary {
  observations: number;
  assessments: number;
  appointments: number;
  /** A data mais recente entre observações, avaliações e atendimentos, ou `undefined`. */
  lastRecordDate: string | undefined;
}

export const studentRecordSummary = (state: DemoState, studentId: string): StudentRecordSummary => {
  const observations = state.observations.filter((item) => item.studentId === studentId);
  const assessments = state.assessments.filter((item) => item.studentId === studentId);
  const appointments = state.appointments.filter((item) => item.studentId === studentId);
  const dates = [
    ...observations.map((item) => item.data),
    ...assessments.map((item) => item.date),
    ...appointments.map((item) => item.data),
  ];
  return {
    observations: observations.length,
    assessments: assessments.length,
    appointments: appointments.length,
    lastRecordDate: dates.length > 0 ? dates.reduce((a, b) => (b > a ? b : a)) : undefined,
  };
};

/** Nota média, com uma casa decimal, e número de avaliações. Sem avaliação, a média é `null`. */
export interface RatingSummary {
  average: number | null;
  count: number;
}

export const summarizeRatings = (reviews: ResourceReview[]): RatingSummary => {
  if (reviews.length === 0) return { average: null, count: 0 };
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return { average: Math.round((total / reviews.length) * 10) / 10, count: reviews.length };
};

/**
 * Nota de um recurso, calculada das avaliações gravadas. Substitui `rating` e `reviewCount`
 * das fixtures: o recurso 1 dizia 4,8 com 47 avaliações e tinha 3; os outros cinco diziam
 * entre 28 e 89 avaliações e não tinham nenhuma; e avaliar não mudava nada.
 */
export const resourceRating = (state: DemoState, resourceId: string): RatingSummary =>
  summarizeRatings(state.reviews.filter((review) => review.resourceId === resourceId));

/** Nota com uma casa decimal sempre, em português: "5,0" e não "5", "4,7" e não "4.7". */
export const formatRating = (average: number): string =>
  average.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Recursos contribuídos neste navegador, pelo formulário da Biblioteca. */
export const localContributionCount = (state: DemoState): number =>
  state.resources.filter((resource) => resource.isLocalContribution).length;

/** Nota de todas as avaliações dos recursos contribuídos neste navegador, juntas. */
export const localContributionsRating = (state: DemoState): RatingSummary => {
  const ids = new Set(state.resources.filter((resource) => resource.isLocalContribution).map((resource) => resource.id));
  return summarizeRatings(state.reviews.filter((review) => ids.has(review.resourceId)));
};

/** Badges cuja exigência de contribuições já foi atingida, na ordem da definição (da menor exigência para a maior). */
export const earnedBadges = (badges: Badge[], contributions: number): Badge[] =>
  badges.filter((badge) => contributions >= badge.requiredContributions);

/** Atendimentos já realizados que ainda não têm ata registrada. */
export const appointmentsWithoutMinutes = (state: DemoState): number =>
  state.appointments.filter((appointment) => appointment.status === 'realizado' && !appointment.ata).length;
