import { useState } from 'react';
import type { ReactNode } from 'react';
import { DEMO_MODE } from '@/config/institution';
import { createDemoStore } from './createDemoStore';
import { DemoStoreContext } from './context';

interface DemoStoreProviderProps {
  children: ReactNode;
}

/**
 * Persistence is tied to DEMO_MODE, not only the notice: with it off the store
 * keeps everything in memory and never touches localStorage, so wiring a real
 * backend later cannot leave student diagnoses mirrored in plain text in the
 * browser of a shared school computer.
 */
const DemoStoreProvider = ({ children }: DemoStoreProviderProps) => {
  const [store] = useState(() => createDemoStore({ persist: DEMO_MODE }));
  return <DemoStoreContext.Provider value={store}>{children}</DemoStoreContext.Provider>;
};

export default DemoStoreProvider;
