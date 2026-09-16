import type { Atendimento } from '@/types';
import type { DemoState } from '@/types/store';
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

/** Atendimentos já realizados que ainda não têm ata registrada. */
export const appointmentsWithoutMinutes = (state: DemoState): number =>
  state.appointments.filter((appointment) => appointment.status === 'realizado' && !appointment.ata).length;
