import type { AppointmentStatus, AppointmentType } from '@/types';

/** Single list shared by the new-appointment form and the agenda type filter. */
export const appointmentTypes: AppointmentType[] = [
  'pedagogicalMeeting',
  'assessment',
  'familyMeeting',
  'multidisciplinary',
  'other',
];

/**
 * Os rótulos em português, separados do identificador na v4. Os textos são os mesmos que estavam
 * no modelo até a v3, então a tela não muda ao renomear o dado.
 */
const appointmentTypeLabels: Record<AppointmentType, string> = {
  pedagogicalMeeting: 'Reunião Pedagógica',
  assessment: 'Avaliação',
  familyMeeting: 'Atendimento Família',
  multidisciplinary: 'Multidisciplinar',
  other: 'Outros',
};

export const appointmentTypeLabel = (type: AppointmentType): string => appointmentTypeLabels[type];

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
