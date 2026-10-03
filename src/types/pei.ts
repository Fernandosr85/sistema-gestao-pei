/*
 * O PEI como entidade — e de onde cada parte vem.
 *
 * A ESTRUTURA é do manual deste repositório (`src/pages/Manual.tsx`, seção 2), que organiza o
 * plano em seis partes: I Identificação, II Perfil, III Objetivos e Metas, IV Adaptações e
 * Recursos, V Estratégias, VI Avaliação e Monitoramento. O manual também fixa a revisão
 * trimestral (10.2), a família como coautora (5.2) e "PEI vigente e histórico" como documentação
 * obrigatória (9.1) — é daí que vem o versionamento, não de preferência de desenho.
 *
 * A BASE LEGAL (`src/pages/Legislation.tsx`: LDB art. 58-60, LBI art. 27-28, Lei 12.764/2012,
 * Decreto 7.611/2011, Resolução CNE/CEB 4/2009) obriga atendimento educacional especializado,
 * currículos e recursos adaptados e profissional de apoio. **Nenhuma dessas normas prescreve os
 * campos de um PEI.**
 *
 * REGRA, VÁLIDA PARA TODO CAMPO DAQUI PARA A FRENTE: nenhum campo pode alegar mandato legal que
 * não existe. Campo que vem do manual cita o manual; campo que vem da lei cita o artigo; campo
 * que é decisão de produto diz que é decisão de produto. Confundir prática institucional com
 * exigência legal faria o sistema afirmar sobre o direito de uma criança o que a lei não diz.
 */

/** Decisão de produto: um PEI vigente por estudante, com os anteriores preservados (manual 9.1). */
export type PeiStatus = 'draft' | 'active' | 'closed';

/**
 * Áreas do manual, parte III: os seis componentes curriculares que ele lista e as quatro
 * habilidades socioemocionais. Não é taxonomia legal.
 */
export type PeiGoalArea =
  | 'portuguese'
  | 'math'
  | 'science'
  | 'geographyHistory'
  | 'arts'
  | 'physicalEducation'
  | 'selfRegulation'
  | 'socialInteraction'
  | 'functionalCommunication'
  | 'autonomy';

/** Mesmo vocabulário de `AssessmentObjectiveStatus`, para a meta e a medição não divergirem. */
export type PeiGoalStatus = 'notStarted' | 'inProgress' | 'achieved' | 'needsReview';

/** O manual pede revisão trimestral (10.2); as outras cadências existem para quem adotar outra. */
export type PeiReviewFrequency = 'quarterly' | 'semiannual' | 'annual';

export interface Pei {
  id: string;
  studentId: string;
  /** Rótulo do período, como o manual organiza o plano: "2026 - 1º Trimestre". */
  term: string;
  startsOn: string;
  endsOn: string;
  status: PeiStatus;
  /** Parte I: quem elaborou, quando, e com quem — a família entre eles (manual 5.2). */
  draftedOn: string;
  draftedBy: string;
  participants: string[];
  /** Parte II: o perfil do estudante, nas três listas que o manual descreve. */
  profile: {
    strengths: string[];
    challenges: string[];
    learningStyle: string[];
  };
  /** Parte IV: adaptações de acesso, metodológicas, de avaliação e de temporalidade. */
  adaptations: string[];
  /** Parte IV: recurso e se está disponível — a tela já mostra as duas coisas. */
  resources: Array<{ name: string; available: boolean }>;
  /** Parte IV: apoio humano. A LBI art. 28 obriga profissional de apoio escolar. */
  humanSupport: {
    professional: string;
    weeklyHours: number;
    specializedSupport: string;
  };
  /** Parte VI. */
  reviewFrequency: PeiReviewFrequency;
  nextReviewOn: string;
}

/**
 * Parte III. A meta tem identidade própria: é o que a Etapa 5 ensinou com o nome do estudante —
 * dado copiado para dentro de outro registro diverge quando a origem muda.
 */
export interface PeiGoal {
  id: string;
  peiId: string;
  area: PeiGoalArea;
  title: string;
  description: string;
  status: PeiGoalStatus;
  /** Progresso corrente da meta, 0 a 100. A medição datada fica na avaliação. */
  progress: number;
  strategies: string[];
  nextStep: string;
  owner: string;
  dueOn?: string;
}

/** De onde veio a evidência. A nota aponta para o registro; não copia o conteúdo dele. */
export type PeiGoalNoteSource =
  | { kind: 'observation'; id: string }
  | { kind: 'assessment'; id: string }
  | { kind: 'appointment'; id: string };

/** O "Adicionar observação na meta" da tela do PEI, com a ligação opcional à evidência. */
export interface PeiGoalNote {
  id: string;
  goalId: string;
  date: string;
  author: string;
  text: string;
  source?: PeiGoalNoteSource;
}

/**
 * Parte VI: a revisão periódica. A ata não é campo daqui — ela vive no atendimento
 * correspondente, e `appointmentId` aponta para ele.
 */
export interface PeiRevision {
  id: string;
  peiId: string;
  date: string;
  author: string;
  participants: string[];
  summary: string;
  appointmentId?: string;
}
