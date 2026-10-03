import type { AppointmentType, Student } from '@/types';
import type { DemoState, DemoStateV1, DemoStateV2, DemoStateV3 } from '@/types/store';
import { createSeedState } from './seed';

/** Key written by version 1, before the accent was removed from `Student`. */
const LEGACY_CALMING_STRATEGIES_KEY = 'estratégiasAcalmar';

const renameLegacyCalmingStrategies = (student: Student): Student => {
  const behavior = student.comportamento as Record<string, string> | undefined;
  if (!behavior || !(LEGACY_CALMING_STRATEGIES_KEY in behavior)) return student;

  return {
    ...student,
    comportamento: {
      comportamentosDesafiadores: behavior.comportamentosDesafiadores ?? '',
      estrategiasAcalmar: behavior.estrategiasAcalmar ?? behavior[LEGACY_CALMING_STRATEGIES_KEY] ?? '',
      situacoesEstresse: behavior.situacoesEstresse ?? '',
    },
  };
};

/**
 * Version 1 stored only students and observations. Keeps every stored record,
 * fixes the legacy key and adds the collections that did not exist yet from the
 * demo fixtures, the same ones a fresh browser starts with.
 */
export const migrateV1ToV2 = (state: DemoStateV1): DemoStateV2 => {
  const seed = createSeedState();
  return {
    students: state.students.map(renameLegacyCalmingStrategies),
    observations: state.observations,
    appointments: seed.appointments,
    assessments: seed.assessments,
    resources: seed.resources,
    reviews: seed.reviews,
  };
};

/**
 * Version 2 had no favorites. Keeps every stored record as it was and starts
 * with no favorites, the same as a fresh browser.
 */
export const migrateV2ToV3 = (state: DemoStateV2): DemoStateV3 => ({
  students: state.students,
  observations: state.observations,
  appointments: state.appointments,
  assessments: state.assessments,
  resources: state.resources,
  reviews: state.reviews,
  favorites: [],
});

/**
 * Rótulo acentuado gravado até a v3 -> identificador da v4. O valor era, ao mesmo tempo, texto
 * de tela, chave do mapa de cores, campo do modelo e dado no localStorage de quem usou; separar
 * identificador de rótulo é o que exige esta migração.
 */
const LEGACY_APPOINTMENT_TYPES: Record<string, AppointmentType> = {
  'Reunião Pedagógica': 'pedagogicalMeeting',
  'Avaliação': 'assessment',
  'Atendimento Família': 'familyMeeting',
  Multidisciplinar: 'multidisciplinary',
  Outros: 'other',
};

const renameLegacyAppointmentType = (tipo: string): AppointmentType | null =>
  LEGACY_APPOINTMENT_TYPES[tipo] ?? (Object.values(LEGACY_APPOINTMENT_TYPES).includes(tipo as AppointmentType) ? (tipo as AppointmentType) : null);

/**
 * Version 3 had no PEI. Duas coisas acontecem aqui, e as duas sem perda:
 *
 * 1. O `tipo` de cada atendimento passa de rótulo acentuado a identificador. Um tipo que não
 *    esteja na tabela vira `other`, porque descartar o atendimento inteiro por causa do rótulo
 *    perderia data, profissionais e ata — o registro vale mais que a etiqueta.
 * 2. As quatro coleções do PEI entram VAZIAS, e aqui a v4 se afasta do que a v1->v2 fez: lá as
 *    coleções novas vinham das fixtures de demonstração. Um PEI é um documento atribuído a uma
 *    criança nomeada; injetar um plano fictício nos dados de alguém seria pior que lista vazia.
 *    Navegador novo continua recebendo o PEI da semente.
 */
export const migrateV3ToV4 = (state: DemoStateV3): DemoState => ({
  students: state.students,
  observations: state.observations,
  appointments: state.appointments.map((appointment) => ({
    ...appointment,
    tipo: renameLegacyAppointmentType(appointment.tipo) ?? 'other',
  })),
  assessments: state.assessments,
  resources: state.resources,
  reviews: state.reviews,
  favorites: state.favorites,
  peis: [],
  peiGoals: [],
  peiGoalNotes: [],
  peiRevisions: [],
});
