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
  progresso?: number;
  status: 'ativo' | 'inativo';
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
    estratégiasAcalmar: string;
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

export interface Assessment {
  id: string;
  studentId: string;
  studentName: string;
  data: string;
  avaliador: string;
  tipo: 'inicial' | 'trimestral' | 'semestral' | 'final';
  areas: {
    comunicacao: {
      receptiva: number;
      expressiva: number;
      observacoes: string;
    };
    social: {
      interacaoAdultos: number;
      interacaoPares: number;
      observacoes: string;
    };
    comportamento: {
      autorregulacao: number;
      adaptabilidade: number;
      observacoes: string;
    };
    academico: {
      atencao: number;
      participacao: number;
      observacoes: string;
    };
  };
  mediaGeral: number;
}

export interface Meeting {
  id: string;
  data: string;
  hora: string;
  studentId: string;
  studentName: string;
  participantes: string[];
  tipo: 'rotina' | 'urgente' | 'planejamento';
  status: 'agendada' | 'realizada' | 'cancelada';
  observacoes?: string;
}

export interface Professional {
  id: string;
  nome: string;
  tipo: 'professor' | 'psicologo' | 'terapeuta' | 'fonoaudiologo' | 'coordenador';
  especialidade?: string;
  estudantes: string[];
}

export interface Atendimento {
  id: number;
  aluno: string;
  tipo: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  status: 'agendado' | 'realizado' | 'cancelado';
  profissionais: string[];
  local: string;
  objetivos: string;
  ata?: string;
}

export interface AtendimentoEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Atendimento;
}
