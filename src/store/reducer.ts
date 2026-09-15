import type { Assessment, Atendimento, Observation, Student } from '@/types';
import type { DemoAction, DemoState } from '@/types/store';
import { createSeedState } from './seed';

/** Linked records keep a copy of the student's name, so an edit updates those copies too. */
const updateStudent = (state: DemoState, student: Student): DemoState => ({
  ...state,
  students: state.students.map((item) => (item.id === student.id ? student : item)),
  observations: state.observations.map(
    (observation): Observation =>
      observation.studentId === student.id ? { ...observation, studentName: student.nomeCompleto } : observation,
  ),
  appointments: state.appointments.map(
    (appointment): Atendimento =>
      appointment.studentId === student.id ? { ...appointment, aluno: student.nomeCompleto } : appointment,
  ),
  assessments: state.assessments.map(
    (assessment): Assessment =>
      assessment.studentId === student.id ? { ...assessment, studentName: student.nomeCompleto } : assessment,
  ),
});

export const demoReducer = (state: DemoState, action: DemoAction): DemoState => {
  switch (action.type) {
    case 'student/add':
      return { ...state, students: [action.student, ...state.students] };
    case 'student/update':
      return updateStudent(state, action.student);
    case 'observation/add':
      return { ...state, observations: [action.observation, ...state.observations] };
    case 'appointment/add':
      return { ...state, appointments: [action.appointment, ...state.appointments] };
    case 'appointment/update':
      return {
        ...state,
        appointments: state.appointments.map((appointment) =>
          appointment.id === action.appointment.id ? action.appointment : appointment,
        ),
      };
    case 'appointment/markDone':
      return {
        ...state,
        appointments: state.appointments.map(
          (appointment): Atendimento =>
            appointment.id === action.id ? { ...appointment, status: 'realizado' } : appointment,
        ),
      };
    case 'appointment/cancel':
      return {
        ...state,
        appointments: state.appointments.map(
          (appointment): Atendimento =>
            appointment.id === action.id ? { ...appointment, status: 'cancelado' } : appointment,
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
    case 'favorite/add':
      // One favorite per resource, even if the same action arrives twice.
      if (state.favorites.some((favorite) => favorite.resourceId === action.favorite.resourceId)) return state;
      return { ...state, favorites: [action.favorite, ...state.favorites] };
    case 'favorite/remove':
      return {
        ...state,
        favorites: state.favorites.filter((favorite) => favorite.resourceId !== action.resourceId),
      };
    case 'demo/reset':
      return createSeedState();
    default: {
      const unhandled: never = action;
      return unhandled;
    }
  }
};
