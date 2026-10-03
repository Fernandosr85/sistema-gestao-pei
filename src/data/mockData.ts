import { Student, Observation, Assessment, Atendimento } from '@/types';
import type { Pei, PeiGoal, PeiGoalNote, PeiRevision } from '@/types/pei';

export const mockStudents: Student[] = [
  {
    id: '1',
    nomeCompleto: 'Maria Silva Santos',
    dataNascimento: '2016-03-15',
    matricula: 'MAT-2024-001',
    serie: '3º Ano EF',
    turma: 'A',
    diagnostico: 'TEA - Nível 1',
    nivelSuporte: 'medio',
    professorResponsavel: 'Profª. Ana Beatriz',
    status: 'ativo',
    dataCadastro: '2024-02-15',
    responsavel: {
      nome: 'Joana Silva',
      parentesco: 'Mãe',
      telefone: '(11) 90000-0001',
      email: 'responsavel1@example.org',
    },
    comunicacao: {
      compreensaoFala: 'Compreende comandos simples',
      palavrasConhecidas: 'mamãe, papai, água, comer, banho, dormir, escola, brincar',
    },
    comportamento: {
      comportamentosDesafiadores: 'Dificuldade em aguardar sua vez, pode se frustrar facilmente',
      estrategiasAcalmar: 'Contagem regressiva, uso de cartões de comunicação, música calma',
      situacoesEstresse: 'Mudanças na rotina, ambientes barulhentos',
    },
  },
  {
    id: '2',
    nomeCompleto: 'Pedro Oliveira Costa',
    dataNascimento: '2015-08-22',
    matricula: 'MAT-2024-002',
    serie: '4º Ano EF',
    turma: 'B',
    diagnostico: 'TEA - Nível 2',
    nivelSuporte: 'alto',
    professorResponsavel: 'Prof. Carlos Lima',
    status: 'ativo',
    dataCadastro: '2024-01-20',
    responsavel: {
      nome: 'Carlos Oliveira',
      parentesco: 'Pai',
      telefone: '(11) 90000-0002',
      email: 'responsavel2@example.org',
    },
  },
  {
    id: '3',
    nomeCompleto: 'Ana Carolina Souza',
    dataNascimento: '2016-11-10',
    matricula: 'MAT-2024-003',
    serie: '2º Ano EF',
    turma: 'C',
    diagnostico: 'TEA - Nível 1',
    nivelSuporte: 'baixo',
    professorResponsavel: 'Profª. Marina Santos',
    status: 'ativo',
    dataCadastro: '2024-03-10',
    responsavel: {
      nome: 'Mariana Souza',
      parentesco: 'Mãe',
      telefone: '(11) 90000-0003',
      email: 'responsavel3@example.org',
    },
  },
  {
    id: '4',
    nomeCompleto: 'Lucas Ferreira Lima',
    dataNascimento: '2014-05-18',
    matricula: 'MAT-2024-004',
    serie: '5º Ano EF',
    turma: 'A',
    diagnostico: 'TEA - Nível 1',
    nivelSuporte: 'baixo',
    professorResponsavel: 'Prof. Roberto Silva',
    status: 'ativo',
    dataCadastro: '2024-02-01',
    responsavel: {
      nome: 'Patricia Ferreira',
      parentesco: 'Mãe',
      telefone: '(11) 90000-0004',
      email: 'responsavel4@example.org',
    },
  },
];

export const mockObservations: Observation[] = [
  {
    kind: 'structured',
    id: 'obs-1',
    studentId: '1',
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
    date: '2025-11-01',
    assessor: 'Profª. Ana Beatriz',
    kind: 'quarterly',
    quarter: 4,
    objectives: [
      {
        // Ligado à meta do PEI: o título mora na meta, e aqui fica a medição desta data.
        goalId: 'pei-goal-1',
        status: 'inProgress',
        progress: 60,
        notes: 'Reconhece palavras familiares com apoio de pictogramas.',
      },
    ],
    languageArts: {
      reading: 3,
      writing: 2,
      speaking: 4,
      notes: 'Melhora na compreensão de comandos simples.',
    },
    socioEmotional: {
      recognizesEmotions: true,
      managesFrustration: false,
      asksForHelp: true,
    },
    summary: {
      achievements: 'Ampliou o vocabulário funcional e passou a pedir ajuda com cartões de comunicação durante as atividades em grupo.',
      challenges: 'Transições entre atividades ainda geram frustração, principalmente quando a mudança acontece sem aviso prévio.',
      nextSteps: 'Manter avisos visuais antes das transições e revisar o objetivo de leitura com a família na próxima reunião.',
    },
  },
];

export const mockAppointments: Atendimento[] = [
  {
    id: 'atd-1',
    studentId: '3',
    tipo: 'pedagogicalMeeting',
    data: '2025-11-28',
    horarioInicio: '14:00',
    horarioFim: '15:00',
    status: 'agendado',
    profissionais: ['Profª. Marina Santos', 'Coordenação'],
    local: 'Sala de Coordenação',
    objetivos: 'Discutir progresso do PEI e ajustes necessários',
  },
  {
    id: 'atd-2',
    studentId: '2',
    tipo: 'assessment',
    data: '2025-11-29',
    horarioInicio: '10:00',
    horarioFim: '11:30',
    status: 'agendado',
    profissionais: ['Psicopedagogo', 'Prof. de Apoio'],
    local: 'Sala AEE',
    objetivos: 'Avaliação trimestral de objetivos do PEI',
  },
  {
    id: 'atd-3',
    studentId: '1',
    tipo: 'familyMeeting',
    data: '2025-11-30',
    horarioInicio: '16:00',
    horarioFim: '17:00',
    status: 'agendado',
    profissionais: ['Profª. Ana Beatriz', 'Família'],
    local: 'Online',
    objetivos: 'Alinhamento de estratégias casa-escola',
  },
  {
    id: 'atd-4',
    studentId: '4',
    tipo: 'multidisciplinary',
    data: '2025-12-02',
    horarioInicio: '13:00',
    horarioFim: '14:30',
    status: 'agendado',
    profissionais: ['Coordenação', 'Professores', 'Psicopedagogo', 'Família'],
    local: 'Sala de Reuniões',
    objetivos: 'Revisão geral do caso e definição de novas metas',
  },
  {
    id: 'atd-5',
    studentId: '3',
    tipo: 'pedagogicalMeeting',
    data: '2025-11-25',
    horarioInicio: '14:00',
    horarioFim: '15:00',
    status: 'realizado',
    profissionais: ['Profª. Marina Santos', 'Coordenação'],
    local: 'Sala de Coordenação',
    objetivos: 'Discussão sobre transições',
    ata: '',
  },
];

/*
 * O PEI de demonstração. Decisão do autor: um plano completo para um estudante e nenhum para os
 * outros — exercita os dois estados, e vazio é o que a maioria das escolas vê no primeiro dia.
 *
 * A estrutura segue as seis partes do manual (`src/pages/Manual.tsx`, seção 2); nenhum campo aqui
 * é exigência legal, e a regra está em `src/types/pei.ts`. Conteúdo coerente com o que já existe
 * nas fixtures: a observação `obs-1` aponta transições como desafio, e a avaliação `avl-1` mede a
 * meta de leitura em 60%.
 */
export const mockPeis: Pei[] = [
  {
    id: 'pei-1',
    studentId: '1',
    term: '2025 - 4º Trimestre',
    startsOn: '2025-10-01',
    endsOn: '2025-12-19',
    status: 'active',
    draftedOn: '2025-09-15',
    draftedBy: 'Profª. Ana Beatriz',
    participants: ['Mãe', 'Coordenação pedagógica', 'Professora de apoio'],
    profile: {
      strengths: ['Boa memória visual', 'Interesse por atividades de arte', 'Responde a reforço positivo'],
      challenges: ['Transições entre atividades', 'Aguardar a vez em grupo', 'Ambientes barulhentos'],
      learningStyle: ['Visual', 'Precisa de rotina previsível', 'Aprende com material concreto'],
    },
    adaptations: [
      'Tempo estendido nas atividades escritas',
      'Instrução visual acompanhando a verbal',
      'Avaliação com apoio de pictogramas',
      'Ambiente com redução de estímulos sonoros',
    ],
    resources: [
      { name: 'Prancha de comunicação alternativa', available: true },
      { name: 'Fones de ouvido com redução de ruído', available: true },
      { name: 'Cantinho da calma na sala', available: false },
    ],
    humanSupport: {
      professional: 'Professora de apoio escolar',
      weeklyHours: 20,
      specializedSupport: 'AEE duas vezes por semana',
    },
    reviewFrequency: 'quarterly',
    nextReviewOn: '2025-12-12',
  },
];

export const mockPeiGoals: PeiGoal[] = [
  {
    id: 'pei-goal-1',
    peiId: 'pei-1',
    area: 'portuguese',
    title: 'Reconhecer e ler palavras do vocabulário funcional',
    description: 'Ler palavras do cotidiano escolar com apoio de pictograma, sem soletrar.',
    status: 'inProgress',
    progress: 60,
    strategies: ['Pictograma junto da palavra escrita', 'Leitura compartilhada diária'],
    nextStep: 'Frases de duas palavras',
    owner: 'Profª. Ana Beatriz',
    dueOn: '2025-12-12',
  },
  {
    id: 'pei-goal-2',
    peiId: 'pei-1',
    area: 'selfRegulation',
    title: 'Antecipar transições com apoio visual',
    description: 'Encerrar a atividade em curso após aviso visual, sem recusa.',
    status: 'inProgress',
    progress: 40,
    strategies: ['Aviso visual cinco minutos antes', 'Quadro de rotina na mesa'],
    nextStep: 'Reduzir o aviso para dois minutos',
    owner: 'Professora de apoio',
  },
  {
    id: 'pei-goal-3',
    peiId: 'pei-1',
    area: 'functionalCommunication',
    title: 'Pedir ajuda com cartão de comunicação',
    description: 'Usar o cartão para pedir ajuda em atividade de grupo.',
    status: 'achieved',
    progress: 100,
    strategies: ['Modelagem pelo adulto', 'Cartão sempre ao alcance'],
    nextStep: 'Generalizar para o recreio',
    owner: 'Professora de apoio',
  },
  {
    id: 'pei-goal-4',
    peiId: 'pei-1',
    area: 'math',
    title: 'Contar até 50 com material concreto',
    description: 'Contagem com apoio de material manipulável, em sequência.',
    status: 'notStarted',
    progress: 0,
    strategies: ['Material dourado', 'Contagem diária na rotina'],
    nextStep: 'Iniciar no 1º trimestre de 2026',
    owner: 'Profª. Ana Beatriz',
  },
];

export const mockPeiGoalNotes: PeiGoalNote[] = [
  {
    id: 'pei-note-1',
    goalId: 'pei-goal-1',
    date: '2025-11-01',
    author: 'Profª. Ana Beatriz',
    text: 'Reconheceu as palavras familiares com apoio de pictogramas na avaliação do trimestre.',
    source: { kind: 'assessment', id: 'avl-1' },
  },
  {
    id: 'pei-note-2',
    goalId: 'pei-goal-2',
    date: '2025-11-19',
    author: 'Profª. Ana Beatriz',
    text: 'Transição sem aviso gerou recusa em guardar o material; o ajuste registrado foi avisar cinco minutos antes.',
    source: { kind: 'observation', id: 'obs-1' },
  },
];

export const mockPeiRevisions: PeiRevision[] = [
  {
    id: 'pei-rev-1',
    peiId: 'pei-1',
    date: '2025-11-05',
    author: 'Coordenação pedagógica',
    participants: ['Mãe', 'Profª. Ana Beatriz', 'Professora de apoio'],
    summary:
      'Acrescentada a meta de antecipação de transições, a partir das observações de novembro. Mantidas as metas de leitura e de pedido de ajuda.',
  },
];
