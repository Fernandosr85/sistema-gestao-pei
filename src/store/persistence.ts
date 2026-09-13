import type { DemoState } from '@/types/store';

const STORAGE_KEY = 'pei-demo-store';
const STORAGE_VERSION = 1;

interface StoredEnvelope {
  version: number;
  savedAt: string;
  state: DemoState;
}

export type LoadResult =
  | { status: 'loaded'; state: DemoState }
  | { status: 'empty' }
  | { status: 'discarded' }
  | { status: 'unavailable' };

const isRecordList = (value: unknown): value is Array<{ id: string }> =>
  Array.isArray(value) &&
  value.every((item) => typeof item === 'object' && item !== null && typeof (item as { id?: unknown }).id === 'string');

const isDemoState = (value: unknown): value is DemoState => {
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

/** Callers must only use this module when DEMO_MODE is on. */
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
    if (envelope.version === STORAGE_VERSION && isDemoState(envelope.state)) {
      return { status: 'loaded', state: envelope.state };
    }
  } catch {
    // Unparseable JSON is treated like data from an incompatible version.
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
