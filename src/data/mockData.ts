import { Student, Observation, Assessment, Meeting, Professional } from '@/types';

export const mockStudents: Student[] = [
  {
    id: '1',
    nomeCompleto: 'Maria Silva Santos',
    dataNascimento: '2016-03-15',
    idade: 8,
    matriculaSESI: 'SESI2024001',
    serie: '3º Ano EF',
    turma: 'A',
    diagnostico: 'TEA - Nível 1',
    nivelSuporte: 'medio',
    professorResponsavel: 'Profª. Ana Beatriz',
    progresso: 75,
    status: 'ativo',
    dataCadastro: '2024-02-15',
    responsavel: {
      nome: 'Joana Silva',
      parentesco: 'Mãe',
      telefone: '(11) 98765-4321',
      email: 'joana.silva@email.com',
    },
    comunicacao: {
      compreensaoFala: 'sim-comandos-simples',
      palavrasConhecidas: 'mamãe, papai, água, comer, banho, dormir, escola, brincar',
    },
    comportamento: {
      comportamentosDesafiadores: 'Dificuldade em aguardar sua vez, pode se frustrar facilmente',
      estratégiasAcalmar: 'Contagem regressiva, uso de cartões de comunicação, música calma',
      situacoesEstresse: 'Mudanças na rotina, ambientes barulhentos',
    },
  },
  {
    id: '2',
    nomeCompleto: 'Pedro Oliveira Costa',
    dataNascimento: '2015-08-22',
    idade: 9,
    matriculaSESI: 'SESI2024002',
    serie: '4º Ano EF',
    turma: 'B',
    diagnostico: 'TEA - Nível 2',
    nivelSuporte: 'alto',
    professorResponsavel: 'Prof. Carlos Lima',
    progresso: 68,
    status: 'ativo',
    dataCadastro: '2024-01-20',
    responsavel: {
      nome: 'Carlos Oliveira',
      parentesco: 'Pai',
      telefone: '(11) 97654-3210',
      email: 'carlos.oliveira@email.com',
    },
  },
  {
    id: '3',
    nomeCompleto: 'Ana Carolina Souza',
    dataNascimento: '2016-11-10',
    idade: 8,
    matriculaSESI: 'SESI2024003',
    serie: '2º Ano EF',
    turma: 'C',
    diagnostico: 'TEA - Nível 1',
    nivelSuporte: 'baixo',
    professorResponsavel: 'Profª. Marina Santos',
    progresso: 85,
    status: 'ativo',
    dataCadastro: '2024-03-10',
    responsavel: {
      nome: 'Mariana Souza',
      parentesco: 'Mãe',
      telefone: '(11) 96543-2109',
      email: 'mariana.souza@email.com',
    },
  },
  {
    id: '4',
    nomeCompleto: 'Lucas Ferreira Lima',
    dataNascimento: '2014-05-18',
    idade: 10,
    matriculaSESI: 'SESI2024004',
    serie: '5º Ano EF',
    turma: 'A',
    diagnostico: 'TEA - Nível 1',
    nivelSuporte: 'baixo',
    professorResponsavel: 'Prof. Roberto Silva',
    progresso: 82,
    status: 'ativo',
    dataCadastro: '2024-02-01',
    responsavel: {
      nome: 'Patricia Ferreira',
      parentesco: 'Mãe',
      telefone: '(11) 95432-1098',
      email: 'patricia.ferreira@email.com',
    },
  },
];

export const mockObservations: Observation[] = [
  {
    id: 'obs-1',
    studentId: '1',
    studentName: 'Maria Silva Santos',
    data: '2025-11-19',
    periodo: 'manha',
    duracao: 120,
    observador: 'Profª. Ana Beatriz',
    comunicacao: {
      situacoes: [
        { contexto: 'Atividade em grupo', resposta: 'Pediu ajuda usando gestos' },
        { contexto: 'Hora do lanche', resposta: 'Comunicou-se verbalmente "quero água"' },
      ],
    },
    habilidadesSociais: {
      interacoes: [
        { tipo: 'Com adultos', descricao: 'Respondeu quando chamada pelo nome' },
        { tipo: 'Com colegas', descricao: 'Compartilhou material escolar' },
      ],
    },
    comportamento: {
      positivos: ['Aguardou sua vez na fila', 'Participou da atividade de arte'],
      desafiadores: ['Recusou-se a guardar os brinquedos inicialmente'],
    },
    resumo: {
      pontoForte: 'Melhor comunicação verbal durante as atividades',
      desafio: 'Dificuldade com transições entre atividades',
      ajustesNecessarios: 'Implementar avisos visuais 5 minutos antes das transições',
    },
  },
];

export const mockAssessments: Assessment[] = [
  {
    id: 'avl-1',
    studentId: '1',
    studentName: 'Maria Silva Santos',
    data: '2025-11-01',
    avaliador: 'Profª. Ana Beatriz',
    tipo: 'trimestral',
    areas: {
      comunicacao: {
        receptiva: 75,
        expressiva: 70,
        observacoes: 'Melhora significativa na compreensão de comandos simples',
      },
      social: {
        interacaoAdultos: 80,
        interacaoPares: 65,
        observacoes: 'Boa interação com adultos, ainda requer apoio com colegas',
      },
      comportamento: {
        autorregulacao: 70,
        adaptabilidade: 68,
        observacoes: 'Progresso na gestão de frustrações',
      },
      academico: {
        atencao: 75,
        participacao: 72,
        observacoes: 'Mantém atenção por períodos mais longos',
      },
    },
    mediaGeral: 72,
  },
];

export const mockMeetings: Meeting[] = [
  {
    id: 'meet-1',
    data: '2025-11-25',
    hora: '14:00',
    studentId: '1',
    studentName: 'Maria Silva Santos',
    participantes: ['Pais', 'Professora', 'Psicóloga'],
    tipo: 'rotina',
    status: 'agendada',
  },
  {
    id: 'meet-2',
    data: '2025-11-26',
    hora: '15:30',
    studentId: '2',
    studentName: 'Pedro Oliveira Costa',
    participantes: ['Pai', 'Professor', 'Terapeuta Ocupacional'],
    tipo: 'planejamento',
    status: 'agendada',
  },
];

export const mockProfessionals: Professional[] = [
  {
    id: 'prof-1',
    nome: 'Dra. Maria Fernandes',
    tipo: 'psicologo',
    especialidade: 'Psicologia Educacional',
    estudantes: ['1', '3'],
  },
  {
    id: 'prof-2',
    nome: 'Dr. João Santos',
    tipo: 'terapeuta',
    especialidade: 'Terapia Ocupacional',
    estudantes: ['2'],
  },
  {
    id: 'prof-3',
    nome: 'Profª. Ana Beatriz',
    tipo: 'professor',
    estudantes: ['1'],
  },
  {
    id: 'prof-4',
    nome: 'Prof. Carlos Lima',
    tipo: 'professor',
    estudantes: ['2'],
  },
];
