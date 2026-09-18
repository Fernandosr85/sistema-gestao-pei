import type { ResourceFavorite } from '@/types/resource';
import type { DemoState, DemoStateV1, DemoStateV2, DiscardedCounts } from '@/types/store';
import { migrateV1ToV2, migrateV2ToV3 } from './migrations';
import {
  appointmentSchema,
  assessmentSchema,
  favoriteSchema,
  observationSchema,
  resourceSchema,
  reviewSchema,
  studentSchema,
} from './schemas';

const STORAGE_KEY = 'pei-demo-store';
const STORAGE_VERSION = 3;

interface StoredEnvelope {
  version: number;
  savedAt: string;
  state: unknown;
}

export type LoadResult =
  | { status: 'loaded'; state: DemoState; migratedFrom?: number; discarded?: DiscardedCounts }
  | { status: 'empty' }
  | { status: 'discarded' }
  | { status: 'unavailable' };

const isRecordList = (value: unknown): value is Array<{ id: string }> =>
  Array.isArray(value) &&
  value.every((item) => typeof item === 'object' && item !== null && typeof (item as { id?: unknown }).id === 'string');

const isDemoStateV1 = (value: unknown): value is DemoStateV1 => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as { students?: unknown; observations?: unknown };
  return (
    isRecordList(candidate.students) &&
    isRecordList(candidate.observations) &&
    candidate.observations.every((item) => {
      const kind = (item as { kind?: unknown }).kind;
      return kind === 'structured' || kind === 'quick';
    })
  );
};

const isDemoStateV2 = (value: unknown): value is DemoStateV2 =>
  isDemoStateV1(value) &&
  ['appointments', 'assessments', 'resources', 'reviews'].every((key) =>
    isRecordList((value as unknown as Record<string, unknown>)[key]),
  );

const isFavoriteList = (value: unknown): value is ResourceFavorite[] =>
  Array.isArray(value) &&
  value.every((item) => {
    if (typeof item !== 'object' || item === null) return false;
    const candidate = item as { resourceId?: unknown; addedAt?: unknown };
    return typeof candidate.resourceId === 'string' && typeof candidate.addedAt === 'string';
  });

const isDemoStateV3 = (value: unknown): value is DemoState =>
  isDemoStateV2(value) && isFavoriteList((value as unknown as Record<string, unknown>).favorites);

/** Keeps the records that match the declared shape and counts the ones dropped. */
const keepValid = <T>(list: unknown[], schema: { safeParse: (value: unknown) => { success: boolean; data?: unknown } }): { kept: T[]; dropped: number } => {
  const kept: T[] = [];
  let dropped = 0;
  for (const item of list) {
    const parsed = schema.safeParse(item);
    if (parsed.success) kept.push(parsed.data as T);
    else dropped += 1;
  }
  return { kept, dropped };
};

/**
 * Drops every stored record that does not match its declared shape, and then every record
 * left pointing at one that was dropped.
 *
 * Discarding the record and not the whole state is a decision: one damaged record should not
 * cost everything the person typed. The price is dangling references, which the cascade below
 * removes, and silent data loss, which the count prevents — the notice says how many went and
 * from where. "Descartei 3 observações" and "sumiram 3 observações" are different things, and
 * only the count separates them.
 */
const validateState = (state: DemoState): { state: DemoState; discarded: DiscardedCounts } => {
  const students = keepValid<DemoState['students'][number]>(state.students, studentSchema);
  const observations = keepValid<DemoState['observations'][number]>(state.observations, observationSchema);
  const appointments = keepValid<DemoState['appointments'][number]>(state.appointments, appointmentSchema);
  const assessments = keepValid<DemoState['assessments'][number]>(state.assessments, assessmentSchema);
  const resources = keepValid<DemoState['resources'][number]>(state.resources, resourceSchema);
  const reviews = keepValid<DemoState['reviews'][number]>(state.reviews, reviewSchema);
  const favorites = keepValid<DemoState['favorites'][number]>(state.favorites, favoriteSchema);

  const studentIds = new Set(students.kept.map((student) => student.id));
  const resourceIds = new Set(resources.kept.map((resource) => resource.id));

  const byStudent = <T extends { studentId: string }>(items: T[]) => items.filter((item) => studentIds.has(item.studentId));
  const byResource = <T extends { resourceId: string }>(items: T[]) => items.filter((item) => resourceIds.has(item.resourceId));

  const observationsKept = byStudent(observations.kept);
  const appointmentsKept = byStudent(appointments.kept);
  const assessmentsKept = byStudent(assessments.kept);
  const reviewsKept = byResource(reviews.kept);
  const favoritesKept = byResource(favorites.kept);

  return {
    state: {
      students: students.kept,
      observations: observationsKept,
      appointments: appointmentsKept,
      assessments: assessmentsKept,
      resources: resources.kept,
      reviews: reviewsKept,
      favorites: favoritesKept,
    },
    discarded: {
      students: students.dropped,
      observations: observations.dropped + (observations.kept.length - observationsKept.length),
      appointments: appointments.dropped + (appointments.kept.length - appointmentsKept.length),
      assessments: assessments.dropped + (assessments.kept.length - assessmentsKept.length),
      resources: resources.dropped,
      reviews: reviews.dropped + (reviews.kept.length - reviewsKept.length),
      favorites: favorites.dropped + (favorites.kept.length - favoritesKept.length),
    },
  };
};

const totalDiscarded = (counts: DiscardedCounts): number =>
  Object.values(counts).reduce((total, count) => total + count, 0);

/** Wraps a loaded state in the shape check, keeping the count only when something was dropped. */
const loaded = (state: DemoState, migratedFrom?: number): LoadResult => {
  const checked = validateState(state);
  const discarded = totalDiscarded(checked.discarded) > 0 ? checked.discarded : undefined;
  return { status: 'loaded', state: checked.state, migratedFrom, discarded };
};

/**
 * Callers must only use this module when DEMO_MODE is on.
 *
 * The version is explicit so a legitimate older record is never mistaken for a
 * damaged current one: versions 1 and 2 are migrated one step at a time, and
 * anything else that does not match its declared shape is discarded.
 */
export const loadState = (): LoadResult => {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return { status: 'unavailable' };
  }
  if (raw === null) return { status: 'empty' };

  try {
    const envelope = JSON.parse(raw) as Partial<StoredEnvelope>;
    const stored = envelope.state;
    if (envelope.version === STORAGE_VERSION && isDemoStateV3(stored)) {
      return loaded(stored);
    }
    if (envelope.version === 2 && isDemoStateV2(stored)) {
      return loaded(migrateV2ToV3(stored), 2);
    }
    if (envelope.version === 1 && isDemoStateV1(stored)) {
      return loaded(migrateV2ToV3(migrateV1ToV2(stored)), 1);
    }
  } catch {
    // Unparseable JSON is treated like data from an unknown version.
  }
  return { status: 'discarded' };
};

export const saveState = (state: DemoState): boolean => {
  const envelope: StoredEnvelope = {
    version: STORAGE_VERSION,
    savedAt: new Date().toISOString(),
    state,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    return true;
  } catch {
    return false;
  }
};

export const clearState = (): boolean => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
};
