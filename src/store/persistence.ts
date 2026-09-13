import type { DemoState, DemoStateV1 } from '@/types/store';
import { migrateV1ToV2 } from './migrations';

const STORAGE_KEY = 'pei-demo-store';
const STORAGE_VERSION = 2;

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

const isDemoStateV2 = (value: unknown): value is DemoState =>
  isDemoStateV1(value) &&
  ['appointments', 'assessments', 'resources', 'reviews'].every((key) =>
    isRecordList((value as unknown as Record<string, unknown>)[key]),
  );

/**
 * Callers must only use this module when DEMO_MODE is on.
 *
 * The version is explicit so a legitimate version 1 record is never mistaken for
 * a damaged version 2 one: version 1 is migrated, anything else that does not
 * match its declared shape is discarded.
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
    if (envelope.version === STORAGE_VERSION && isDemoStateV2(stored)) {
      return { status: 'loaded', state: stored };
    }
    if (envelope.version === 1 && isDemoStateV1(stored)) {
      return { status: 'loaded', state: migrateV1ToV2(stored), migratedFrom: 1 };
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
