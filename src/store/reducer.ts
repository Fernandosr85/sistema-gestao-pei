import type { DemoAction, DemoState } from '@/types/store';
import { createSeedState } from './seed';

export const demoReducer = (state: DemoState, action: DemoAction): DemoState => {
  switch (action.type) {
    case 'student/add':
      return { ...state, students: [action.student, ...state.students] };
    case 'observation/add':
      return { ...state, observations: [action.observation, ...state.observations] };
    case 'demo/reset':
      return createSeedState();
    default: {
      const unhandled: never = action;
      return unhandled;
    }
  }
};
