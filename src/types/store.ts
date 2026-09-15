import type { Assessment, Atendimento, Observation, Student } from '@/types';
import type { Resource, ResourceFavorite, ResourceReview } from '@/types/resource';

export interface DemoState {
  students: Student[];
  observations: Observation[];
  appointments: Atendimento[];
  assessments: Assessment[];
  resources: Resource[];
  reviews: ResourceReview[];
  /** Added in version 3. */
  favorites: ResourceFavorite[];
}

/** Shape written by version 2 of the store: every collection except favorites. */
export type DemoStateV2 = Omit<DemoState, 'favorites'>;

/** Shape written by version 1 of the store: only students and observations. */
export interface DemoStateV1 {
  students: Student[];
  observations: Observation[];
}

export type DemoAction =
  | { type: 'student/add'; student: Student }
  | { type: 'student/update'; student: Student }
  | { type: 'observation/add'; observation: Observation }
  | { type: 'appointment/add'; appointment: Atendimento }
  | { type: 'appointment/update'; appointment: Atendimento }
  | { type: 'appointment/markDone'; id: string }
  | { type: 'appointment/cancel'; id: string }
  | { type: 'appointment/saveMinutes'; id: string; minutes: string }
  | { type: 'assessment/add'; assessment: Assessment }
  | { type: 'resource/add'; resource: Resource }
  | { type: 'review/add'; review: ResourceReview }
  | { type: 'favorite/add'; favorite: ResourceFavorite }
  | { type: 'favorite/remove'; resourceId: string }
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
