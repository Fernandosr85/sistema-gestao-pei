import type { ResourceFavorite } from '@/types/resource';
import type { DemoState, DemoStateV1, DemoStateV2 } from '@/types/store';
import { migrateV1ToV2, migrateV2ToV3 } from './migrations';

const STORAGE_KEY = 'pei-demo-store';
const STORAGE_VERSION = 3;

interface StoredEnvelope {
  version: number;
  savedAt: string;
  state: unknown;
}

export type LoadResult =
  | { status: 'loaded'; state: DemoState; migratedFrom?: number }
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
      return { status: 'loaded', state: stored };
    }
    if (envelope.version === 2 && isDemoStateV2(stored)) {
      return { status: 'loaded', state: migrateV2ToV3(stored), migratedFrom: 2 };
    }
    if (envelope.version === 1 && isDemoStateV1(stored)) {
      return { status: 'loaded', state: migrateV2ToV3(migrateV1ToV2(stored)), migratedFrom: 1 };
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
