import { Student, Observation, Assessment, Meeting, Professional } from '@/types';

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
    progresso: 75,
    status: 'ativo',
    dataCadastro: '2024-02-15',
    responsavel: {
      nome: 'Joana Silva',
      parentesco: 'Mãe',
      telefone: '(11) 90000-0001',
      email: 'responsavel1@example.org',
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
    matricula: 'MAT-2024-002',
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
    progresso: 85,
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
    progresso: 82,
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

export const dadosAnalisePreditiva = {
  aluno: {
    id: 'aluno-123',
    nome: 'João Silva',
    diagnostico: 'TEA Nível 2',
    ano_escolar: '4º ano'
  },
  
  projecao: {
    confianca: 87,
    objetivos_atuais: 6,
    objetivos_totais: 12,
    objetivos_projetados_fim_ano: 10,
    meses_analise: 3,
    
    areas: [
      {
        nome: 'Comunicação',
        progresso_atual: 70,
        projecao_fim_ano: 85,
        tendencia: 'positiva',
        risco: 'baixo',
        ganho_esperado: 15
      },
      {
        nome: 'Alfabetização',
        progresso_atual: 35,
        projecao_fim_ano: 50,
        tendencia: 'lenta',
        risco: 'alto',
        ganho_esperado: 15
      },
      {
        nome: 'Matemática',
        progresso_atual: 55,
        projecao_fim_ano: 75,
        tendencia: 'positiva',
        risco: 'baixo',
        ganho_esperado: 20
      },
      {
        nome: 'Socialização',
        progresso_atual: 45,
        projecao_fim_ano: 65,
        tendencia: 'moderada',
        risco: 'médio',
        ganho_esperado: 20
      },
      {
        nome: 'Autonomia',
        progresso_atual: 80,
        projecao_fim_ano: 90,
        tendencia: 'positiva',
        risco: 'baixo',
        ganho_esperado: 10
      }
    ],
    
    cenarios: {
      conservador: {
        objetivos: 8,
        percentual: 67,
        probabilidade: 15
      },
      esperado: {
        objetivos: 10,
        percentual: 83,
        probabilidade: 87
      },
      otimista: {
        objetivos: 11,
        percentual: 92,
        probabilidade: 35
      }
    }
  },
  
  casos_similares: [
    {
      id: 1,
      similaridade: 94,
      escola: 'Escola Exemplo A',
      ano_letivo: 2023,
      resultado: {
        objetivos_alcancados: 11,
        objetivos_totais: 12,
        percentual: 92
      },
      estrategias: [
        'Rotina visual com timer',
        'Reforço positivo sistemático',
        'Parceria intensiva com família'
      ],
      tempo_resultados: '4 meses'
    },
    {
      id: 2,
      similaridade: 92,
      escola: 'Escola Exemplo B',
      ano_letivo: 2023,
      resultado: {
        objetivos_alcancados: 10,
        objetivos_totais: 12,
        percentual: 83
      },
      estrategias: [
        'Agenda visual estruturada',
        'Sistema de recompensas',
        'Comunicação aumentativa'
      ],
      tempo_resultados: '5 meses'
    },
    {
      id: 3,
      similaridade: 91,
      escola: 'Escola Exemplo C',
      ano_letivo: 2022,
      resultado: {
        objetivos_alcancados: 11,
        objetivos_totais: 12,
        percentual: 92
      },
      estrategias: [
        'Ensino estruturado TEACCH',
        'Apoio de mediador',
        'Integração sensorial'
      ],
      tempo_resultados: '4 meses'
    }
  ],
  
  estrategias_recomendadas: [
    {
      id: 1,
      nome: 'Método Fônico Multissensorial',
      area: 'Alfabetização',
      taxa_sucesso: 89,
      casos_sucesso: 67,
      casos_totais: 75,
      prioridade: 'alta',
      tempo_implementacao: '3-4 semanas',
      custo: 'baixo'
    },
    {
      id: 2,
      nome: 'Zona de Descompressão + Timer Visual',
      area: 'Regulação Emocional',
      taxa_sucesso: 94,
      casos_sucesso: 85,
      casos_totais: 90,
      prioridade: 'alta',
      tempo_implementacao: '2-3 semanas',
      custo: 'baixo'
    },
    {
      id: 3,
      nome: 'Grupos Estruturados (2-3 alunos)',
      area: 'Socialização',
      taxa_sucesso: 82,
      casos_sucesso: 58,
      casos_totais: 71,
      prioridade: 'média',
      tempo_implementacao: '4-6 semanas',
      custo: 'médio'
    }
  ],
  
  alertas: [
    {
      id: 1,
      tipo: 'urgente',
      area: 'Alfabetização',
      titulo: 'Progresso abaixo do esperado',
      metricas: {
        esperado: 60,
        atual: 35,
        diferenca: -25
      },
      acoes: [
        'Implementar método fônico intensivo',
        'Agendar reunião com coordenação',
        'Solicitar avaliação fonoaudiológica'
      ]
    },
    {
      id: 2,
      tipo: 'atencao',
      area: 'Socialização',
      titulo: 'Regressão em interações sociais',
      metricas: {
        esperado: 50,
        atual: 35,
        diferenca: -15
      },
      acoes: [
        'Investigar mudanças recentes no ambiente',
        'Aumentar oportunidades de interação estruturada',
        'Consultar equipe multidisciplinar'
      ]
    }
  ]
};
