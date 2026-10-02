import type { Assessment, AssessmentKind, AssessmentObjectiveStatus, PerformanceLevel } from '@/types';
import type { DemoState } from '@/types/store';

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

export const performanceLevelLabel = (level: PerformanceLevel): string =>
  performanceLevelOptions.find((option) => option.value === level)?.label ?? String(level);

/** Avaliações do estudante, da mais antiga para a mais recente — a ordem em que a série é lida. */
export const assessmentsOf = (state: DemoState, studentId: string): Assessment[] =>
  state.assessments
    .filter((assessment) => assessment.studentId === studentId)
    .sort((a, b) => a.date.localeCompare(b.date));

/**
 * Média dos objetivos medidos NAQUELA avaliação, de 0 a 100, ou `undefined` quando ela não mediu
 * objetivo nenhum.
 *
 * É a conta que o `studentProgress` fazia até a Etapa 9. Ela não foi apagada: foi posta no lugar
 * certo. Como medição datada, ela diz o que foi medido no dia e serve de série temporal; o que
 * ela não é, e era usada como se fosse, é o progresso corrente das metas do plano.
 */
export const assessmentProgress = (assessment: Assessment): number | undefined =>
  assessment.objectives.length === 0
    ? undefined
    : Math.round(
        assessment.objectives.reduce((sum, objective) => sum + objective.progress, 0) /
          assessment.objectives.length,
      );
