import type { Student } from '@/types';
import type { DemoState, DemoStateV1, DemoStateV2 } from '@/types/store';
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
export const migrateV2ToV3 = (state: DemoStateV2): DemoState => ({
  students: state.students,
  observations: state.observations,
  appointments: state.appointments,
  assessments: state.assessments,
  resources: state.resources,
  reviews: state.reviews,
  favorites: [],
});
