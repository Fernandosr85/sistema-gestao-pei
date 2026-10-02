import {
  mockAppointments,
  mockAssessments,
  mockObservations,
  mockPeiGoalNotes,
  mockPeiGoals,
  mockPeiRevisions,
  mockPeis,
  mockStudents,
} from '@/data/mockData';
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
    // Um PEI completo para o estudante 1 e nenhum para os outros: os dois estados existem.
    peis: mockPeis,
    peiGoals: mockPeiGoals,
    peiGoalNotes: mockPeiGoalNotes,
    peiRevisions: mockPeiRevisions,
  });
