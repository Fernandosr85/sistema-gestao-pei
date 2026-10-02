import type { AssessmentObjective } from '@/types';
import type { PeiGoal } from '@/types/pei';

/**
 * Título do objetivo medido numa avaliação: vem da META quando a avaliação aponta para ela, e do
 * próprio registro quando é objetivo solto, de antes de o PEI existir. Nunca dos dois — é o
 * princípio do `studentNameOf` da Etapa 5, e a forma do tipo `AssessmentObjective` o garante.
 *
 * Meta ausente devolve texto explícito, como `studentNameOf` faz com estudante ausente: a ligação
 * é fraca de propósito (a nota e a medição valem sem ela), então a tela tem de tolerar o vazio.
 */
export const objectiveTitle = (objective: AssessmentObjective, goals: PeiGoal[]): string =>
  objective.goalId === undefined
    ? objective.title
    : (goals.find((goal) => goal.id === objective.goalId)?.title ?? 'Meta não encontrada');
