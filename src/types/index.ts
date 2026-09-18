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
  studentName: string;
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

export interface Assessment {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  assessor: string;
  kind: AssessmentKind;
  quarter?: 1 | 2 | 3 | 4;
  objectives: Array<{
    title: string;
    status: AssessmentObjectiveStatus;
    progress: number;
    notes: string;
  }>;
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

export type AppointmentType = 'Reunião Pedagógica' | 'Avaliação' | 'Atendimento Família' | 'Multidisciplinar' | 'Outros';

export type AppointmentStatus = 'agendado' | 'remarcado' | 'realizado' | 'cancelado';

export interface Atendimento {
  id: string;
  studentId: string;
  aluno: string;
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
