import type { AssessmentKind, AssessmentObjectiveStatus, PerformanceLevel } from '@/types';

export const assessmentKindOptions: Array<{ value: AssessmentKind; label: string }> = [
  { value: 'diagnostic', label: 'Avaliação Diagnóstica Inicial' },
  { value: 'formative', label: 'Avaliação Formativa (Processual)' },
  { value: 'quarterly', label: 'Avaliação Trimestral do PEI' },
  { value: 'socioemotional', label: 'Avaliação de Habilidades Socioemocionais' },
  { value: 'accessibility', label: 'Avaliação de Recursos e Acessibilidade' },
];

export const objectiveStatusOptions: Array<{ value: AssessmentObjectiveStatus; label: string }> = [
  { value: 'achieved', label: 'Alcançado' },
  { value: 'inProgress', label: 'Em progresso' },
  { value: 'notStarted', label: 'Não iniciado' },
  { value: 'needsReview', label: 'Precisa revisão' },
];

export const performanceLevelOptions: Array<{ value: PerformanceLevel; label: string }> = [
  { value: 1, label: 'Insuficiente' },
  { value: 2, label: 'Básico' },
  { value: 3, label: 'Adequado' },
  { value: 4, label: 'Bom' },
  { value: 5, label: 'Excelente' },
];

/** The form evaluates one fixed PEI objective; its title is stored so the record stays readable. */
export const READING_OBJECTIVE_TITLE = 'Desenvolver habilidades de leitura';

/** Minimum length the summary fields ask for on screen. */
export const SUMMARY_MIN_LENGTH = 100;

export const assessmentKindLabel = (kind: AssessmentKind): string =>
  assessmentKindOptions.find((option) => option.value === kind)?.label ?? kind;

export const objectiveStatusLabel = (status: AssessmentObjectiveStatus): string =>
  objectiveStatusOptions.find((option) => option.value === status)?.label ?? status;
