import { mockObservations, mockStudents } from '@/data/mockData';
import type { DemoState } from '@/types/store';

/** Fresh copy of the demo fixtures, so adding records or resetting never mutates `src/data/`. */
export const createSeedState = (): DemoState =>
  structuredClone({
    students: mockStudents,
    observations: mockObservations,
  });
