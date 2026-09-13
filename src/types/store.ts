import type { Observation, Student } from '@/types';

export interface DemoState {
  students: Student[];
  observations: Observation[];
}

export type DemoAction =
  | { type: 'student/add'; student: Student }
  | { type: 'observation/add'; observation: Observation }
  | { type: 'demo/reset' };

/**
 * Where records created in the UI end up.
 * - `browser`: written to localStorage (demo mode).
 * - `memoryOnly`: demo mode, but the browser refused localStorage; lost on reload.
 * - `disabled`: DEMO_MODE is off; memory only, localStorage is never touched.
 */
export type PersistenceStatus = 'browser' | 'memoryOnly' | 'disabled';

export interface DemoStoreSnapshot {
  state: DemoState;
  persistence: PersistenceStatus;
  /** Data found in localStorage was unreadable or from another version and was dropped. */
  discardedStoredData: boolean;
}

export interface DispatchResult {
  persistence: PersistenceStatus;
}

export interface DemoStore {
  getSnapshot: () => DemoStoreSnapshot;
  subscribe: (listener: () => void) => () => void;
  dispatch: (action: DemoAction) => DispatchResult;
}
