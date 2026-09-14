import { useContext, useSyncExternalStore } from 'react';
import { DemoStoreContext } from './context';

export const useDemoStore = () => {
  const store = useContext(DemoStoreContext);
  if (!store) {
    throw new Error('useDemoStore must be used within DemoStoreProvider.');
  }
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);
  return { ...snapshot, dispatch: store.dispatch };
};
