import { mockAppointments, mockAssessments, mockObservations, mockStudents } from '@/data/mockData';
import { mockResources, mockReviews } from '@/data/mockResources';
import type { DemoState } from '@/types/store';

/** Fresh copy of the demo fixtures, so adding records or resetting never mutates `src/data/`. */
export const createSeedState = (): DemoState =>
  structuredClone({
    students: mockStudents,
    observations: mockObservations,
    appointments: mockAppointments,
    assessments: mockAssessments,
    resources: mockResources,
    reviews: mockReviews,
    // Favorites belong to the browser, so there are none to seed.
    favorites: [],
  });
