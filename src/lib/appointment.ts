import type { AppointmentStatus, AppointmentType } from '@/types';

/** Single list shared by the new-appointment form and the agenda type filter. */
export const appointmentTypes: AppointmentType[] = [
  'Reunião Pedagógica',
  'Avaliação',
  'Atendimento Família',
  'Multidisciplinar',
  'Outros',
];

/** Still ahead: scheduled, including appointments moved to a new date or time. */
export const isOpenAppointment = (status: AppointmentStatus): boolean =>
  status === 'agendado' || status === 'remarcado';

const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  agendado: 'Agendado',
  remarcado: 'Remarcado',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
};

export const appointmentStatusLabel = (status: AppointmentStatus): string => appointmentStatusLabels[status];
