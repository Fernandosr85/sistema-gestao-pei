import type { DemoAction, DemoStore, DemoStoreSnapshot, DispatchResult } from '@/types/store';
import { clearState, loadState, saveState } from './persistence';
import { demoReducer } from './reducer';
import { createSeedState } from './seed';

interface CreateDemoStoreOptions {
  /** Pass DEMO_MODE. When false the store never reads or writes localStorage. */
  persist: boolean;
}

const createInitialSnapshot = (persist: boolean): DemoStoreSnapshot => {
  if (!persist) {
    return { state: createSeedState(), persistence: 'disabled', discardedStoredData: false };
  }

  const loaded = loadState();
  if (loaded.status === 'loaded') {
    // A migrated record is written back right away, so storage holds the current version.
    const persisted = loaded.migratedFrom === undefined || saveState(loaded.state);
    return { state: loaded.state, persistence: persisted ? 'browser' : 'memoryOnly', discardedStoredData: false };
  }
  if (loaded.status === 'discarded') {
    return {
      state: createSeedState(),
      persistence: clearState() ? 'browser' : 'memoryOnly',
      discardedStoredData: true,
    };
  }
  return {
    state: createSeedState(),
    persistence: loaded.status === 'unavailable' ? 'memoryOnly' : 'browser',
    discardedStoredData: false,
  };
};

/**
 * Small external store around a pure reducer. `dispatch` writes to localStorage
 * in the same call and reports where the record ended up, so success messages
 * are only shown after the write actually happened.
 */
export const createDemoStore = ({ persist }: CreateDemoStoreOptions): DemoStore => {
  const listeners = new Set<() => void>();
  let snapshot = createInitialSnapshot(persist);

  const dispatch = (action: DemoAction): DispatchResult => {
    const state = demoReducer(snapshot.state, action);
    let persistence = snapshot.persistence;

    if (persistence !== 'disabled') {
      const written = action.type === 'demo/reset' ? clearState() : saveState(state);
      persistence = written ? 'browser' : 'memoryOnly';
    }

    snapshot = {
      state,
      persistence,
      discardedStoredData: action.type === 'demo/reset' ? false : snapshot.discardedStoredData,
    };
    listeners.forEach((listener) => listener());
    return { persistence };
  };

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    dispatch,
  };
};
