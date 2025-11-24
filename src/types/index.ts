export interface Student {
  id: string;
  nomeCompleto: string;
  dataNascimento: string;
  idade: number;
  matriculaSESI: string;
  serie: string;
  turma: string;
  diagnostico: string;
  nivelSuporte: 'baixo' | 'medio' | 'alto';
  professorResponsavel: string;
  progresso: number;
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

export interface Observation {
  id: string;
  studentId: string;
  studentName: string;
  data: string;
  periodo: 'manha' | 'tarde';
  duracao: number;
  observador: string;
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
