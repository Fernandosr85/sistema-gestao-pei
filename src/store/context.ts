import { createContext } from 'react';
import type { DemoStore } from '@/types/store';

export const DemoStoreContext = createContext<DemoStore | null>(null);
