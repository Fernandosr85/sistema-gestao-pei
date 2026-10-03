export type StudentStatus = 'ativo' | 'inativo' | 'transferido' | 'trancado';

export interface Student {
  id: string;
  nomeCompleto: string;
  dataNascimento: string;
  matricula: string;
  serie: string;
  turma: string;
  diagnostico: string;
  nivelSuporte: 'baixo' | 'medio' | 'alto';
  professorResponsavel: string;
  status: StudentStatus;
  dataCadastro: string;
  responsavel: {
    nome: string;
    parentesco: string;
    telefone: string;
    email: string;
  };
  comunicacao?: {
    compreensaoFala: string;
    palavrasConhecidas: string;
  };
  comportamento?: {
    comportamentosDesafiadores: string;
    estrategiasAcalmar: string;
    situacoesEstresse: string;
  };
  rotina?: {
    horarioAcordar: string;
    horarioDormir: string;
    comeSozinha: string;
    usaBanheiroSozinha: string;
    atividadesPreferidas: string;
  };
}

interface ObservationBase {
  id: string;
  studentId: string;
  data: string;
  observador: string;
}

export interface StructuredObservation extends ObservationBase {
  kind: 'structured';
  periodo: 'manha' | 'tarde';
  duracao: number;
  comunicacao: {
    situacoes: Array<{
      contexto: string;
      resposta: string;
    }>;
  };
  habilidadesSociais: {
    interacoes: Array<{
      tipo: string;
      descricao: string;
    }>;
  };
  comportamento: {
    positivos: string[];
    desafiadores: string[];
  };
  resumo: {
    pontoForte: string;
    desafio: string;
    ajustesNecessarios: string;
  };
}

export type QuickObservationContext = 'classroom' | 'recess' | 'aee' | 'physicalEducation' | 'other';

export type QuickObservationTopic = 'peiGoal' | 'behavior' | 'learning' | 'socialization' | 'communication';

export type QuickObservationTone = 'positive' | 'neutral' | 'attention';

export interface QuickObservation extends ObservationBase {
  kind: 'quick';
  time: string;
  context: QuickObservationContext;
  topics: QuickObservationTopic[];
  tone: QuickObservationTone;
  description: string;
}

export type Observation = StructuredObservation | QuickObservation;

export type AssessmentKind = 'diagnostic' | 'formative' | 'quarterly' | 'socioemotional' | 'accessibility';

export type AssessmentObjectiveStatus = 'achieved' | 'inProgress' | 'notStarted' | 'needsReview';

export type PerformanceLevel = 1 | 2 | 3 | 4 | 5;

/*
 * O objetivo medido numa avaliação, em duas formas, e nunca nas duas ao mesmo tempo:
 *
 * - LIGADO a uma meta do PEI (`goalId`): o título mora na meta, e a avaliação guarda só a
 *   medição daquela data. É o princípio do nome do estudante na Etapa 5 — título copiado para
 *   dentro da avaliação divergiria quando a meta fosse renomeada.
 * - SOLTO (`title`): o que existia antes de o PEI ser modelado, e o que a tela de nova avaliação
 *   ainda cria enquanto não liga à meta. Migrado como está, sem inventar PEI nenhum para ele.
 *
 * `progress` não duplica o da meta: aqui é a medição naquela data; na meta é o valor corrente.
 */
export type AssessmentObjective =
  | {
      goalId: string;
      title?: undefined;
      status: AssessmentObjectiveStatus;
      progress: number;
      notes: string;
    }
  | {
      goalId?: undefined;
      title: string;
      status: AssessmentObjectiveStatus;
      progress: number;
      notes: string;
    };

export interface Assessment {
  id: string;
  studentId: string;
  date: string;
  assessor: string;
  kind: AssessmentKind;
  quarter?: 1 | 2 | 3 | 4;
  objectives: AssessmentObjective[];
  languageArts: {
    reading: PerformanceLevel;
    writing: PerformanceLevel;
    speaking: PerformanceLevel;
    notes: string;
  };
  socioEmotional: {
    recognizesEmotions: boolean;
    managesFrustration: boolean;
    asksForHelp: boolean;
  };
  summary: {
    achievements: string;
    challenges: string;
    nextSteps: string;
  };
}

/*
 * Identificador, não rótulo. Até a v3 os valores eram 'Reunião Pedagógica', 'Avaliação' e
 * 'Atendimento Família': texto de tela servindo de chave de objeto, com acento, contra a
 * convenção do projeto — e gravado no localStorage de quem usou. A v4 renomeia o dado gravado; os
 * rótulos em português ficam em `src/lib/appointment.ts`, e a tela não muda.
 */
export type AppointmentType =
  | 'pedagogicalMeeting'
  | 'assessment'
  | 'familyMeeting'
  | 'multidisciplinary'
  | 'other';

export type AppointmentStatus = 'agendado' | 'remarcado' | 'realizado' | 'cancelado';

export interface Atendimento {
  id: string;
  studentId: string;
  tipo: AppointmentType;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  status: AppointmentStatus;
  profissionais: string[];
  local: string;
  objetivos: string;
  observacoes?: string;
  ata?: string;
}

export interface AtendimentoEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Atendimento;
}
