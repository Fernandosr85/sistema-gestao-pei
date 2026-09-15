import type { Student, StudentStatus } from '@/types';

/** A student is never deleted: leaving the school is a status change that keeps the history. */
export const studentStatusOptions: Array<{ value: StudentStatus; label: string }> = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'transferido', label: 'Transferido' },
  { value: 'trancado', label: 'Trancado' },
];

export const studentStatusLabel = (status: StudentStatus): string =>
  studentStatusOptions.find((option) => option.value === status)?.label ?? status;

/** Same grades offered by the new-student form. */
export const studentGrades = ['2º Ano EF', '3º Ano EF', '4º Ano EF', '5º Ano EF'];

export const supportLevelOptions: Array<{ value: Student['nivelSuporte']; label: string }> = [
  { value: 'baixo', label: 'Baixo' },
  { value: 'medio', label: 'Médio' },
  { value: 'alto', label: 'Alto' },
];
