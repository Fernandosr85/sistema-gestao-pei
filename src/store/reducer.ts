import type { Atendimento } from '@/types';
import type { DemoAction, DemoState } from '@/types/store';
import { createSeedState } from './seed';

export const demoReducer = (state: DemoState, action: DemoAction): DemoState => {
  switch (action.type) {
    case 'student/add':
      return { ...state, students: [action.student, ...state.students] };
    case 'observation/add':
      return { ...state, observations: [action.observation, ...state.observations] };
    case 'appointment/add':
      return { ...state, appointments: [action.appointment, ...state.appointments] };
    case 'appointment/markDone':
      return {
        ...state,
        appointments: state.appointments.map(
          (appointment): Atendimento =>
            appointment.id === action.id ? { ...appointment, status: 'realizado' } : appointment,
        ),
      };
    case 'appointment/saveMinutes':
      return {
        ...state,
        appointments: state.appointments.map(
          (appointment): Atendimento =>
            appointment.id === action.id ? { ...appointment, ata: action.minutes } : appointment,
        ),
      };
    case 'assessment/add':
      return { ...state, assessments: [action.assessment, ...state.assessments] };
    case 'resource/add':
      return { ...state, resources: [action.resource, ...state.resources] };
    case 'review/add':
      return { ...state, reviews: [action.review, ...state.reviews] };
    case 'demo/reset':
      return createSeedState();
    default: {
      const unhandled: never = action;
      return unhandled;
    }
  }
};
