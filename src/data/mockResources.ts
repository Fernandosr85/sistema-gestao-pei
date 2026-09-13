import { Resource, ResourceReview, Badge } from '@/types/resource';

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Atividade de Leitura com Pictogramas',
    description: 'Material adaptado para desenvolvimento de leitura com suporte visual usando pictogramas coloridos.',
    fullDescription: `Este recurso foi desenvolvido para auxiliar alunos com TEA no processo de alfabetização, utilizando pictogramas como apoio visual. O material inclui 15 páginas com atividades progressivas que associam palavras a imagens de forma contextualizada.
    
**Como usar:**
1. Imprima o material em papel couché
2. Plastifique para maior durabilidade
3. Apresente as pranchas de forma gradual
4. Permita que o aluno manipule e associe livremente
5. Reforce positivamente cada conquista

**Adaptações possíveis:**
- Pode ser usado com diferentes níveis de complexidade
- Permite personalização com fotos da família/contexto do aluno
- Funciona bem em conjunto com comunicação alternativa`,
    type: 'material-impresso',
    thumbnailUrl: '/placeholder.svg',
    fileUrl: '#',
    diagnoses: ['TEA', 'Deficiência Intelectual'],
    subjects: ['Língua Portuguesa'],
    educationLevels: ['Fundamental 1'],
    rating: 4.8,
    reviewCount: 47,
    downloadCount: 234,
    favoriteCount: 67,
    author: {
      name: 'Prof. Ana Silva',
      school: 'Escola Exemplo A'
    },
    createdAt: '2024-11-15',
    isNew: true,
    isFeatured: true,
    tags: ['TEA', 'Português', 'EF1'],
    objectives: [
      'Desenvolver reconhecimento de palavras',
      'Associar imagem-palavra',
      'Ampliar vocabulário funcional'
    ],
    materials: [
      'Arquivo PDF com 15 páginas',
      'Prancha de pictogramas colorida',
      'Guia do professor'
    ],
    tips: [
      'Imprimir em papel couché para maior durabilidade',
      'Plastificar para reutilização',
      'Pode ser adaptado para diferentes níveis'
    ]
  },
  {
    id: '2',
    title: 'Jogo de Memória Matemático Adaptado',
    description: 'Jogo de memória com números e quantidades em tamanhos aumentados e cores contrastantes.',
    fullDescription: 'Jogo educativo para trabalhar conceitos matemáticos básicos através de associação número-quantidade.',
    type: 'jogo',
    thumbnailUrl: '/placeholder.svg',
    fileUrl: '#',
    diagnoses: ['TDAH', 'Discalculia', 'Deficiência Visual'],
    subjects: ['Matemática'],
    educationLevels: ['Educação Infantil', 'Fundamental 1'],
    rating: 4.9,
    reviewCount: 62,
    downloadCount: 412,
    favoriteCount: 98,
    author: {
      name: 'Prof. Carlos Mendes',
      school: 'Escola Exemplo B'
    },
    createdAt: '2024-11-10',
    isNew: true,
    isFeatured: true,
    tags: ['TDAH', 'Matemática', 'Jogo'],
    objectives: [
      'Reconhecer números de 1 a 10',
      'Associar número à quantidade',
      'Desenvolver concentração e memória'
    ],
    materials: [
      '40 cartas em PDF para impressão',
      'Guia com variações do jogo',
      'Folha de registro de progressão'
    ]
  },
  {
    id: '3',
    title: 'Rotina Visual para Sala de Aula',
    description: 'Sequência visual da rotina escolar com pictogramas editáveis para personalização.',
    fullDescription: 'Sistema de rotina visual completo para organização do dia escolar.',
    type: 'roteiro-visual',
    thumbnailUrl: '/placeholder.svg',
    fileUrl: '#',
    diagnoses: ['TEA', 'TDAH'],
    subjects: ['Atividades de Vida Diária'],
    educationLevels: ['Educação Infantil', 'Fundamental 1', 'Fundamental 2'],
    rating: 4.7,
    reviewCount: 89,
    downloadCount: 567,
    favoriteCount: 134,
    author: {
      name: 'Prof. Marina Costa',
      school: 'Escola Exemplo C'
    },
    createdAt: '2024-11-05',
    isNew: false,
    isFeatured: true,
    tags: ['TEA', 'Rotina', 'Visual'],
    objectives: [
      'Promover previsibilidade',
      'Reduzir ansiedade',
      'Desenvolver autonomia'
    ]
  },
  {
    id: '4',
    title: 'Vídeo Tutorial: Comunicação Alternativa',
    description: 'Tutorial passo a passo para implementar sistema de CAA em sala de aula.',
    fullDescription: 'Vídeo educativo de 25 minutos explicando como implementar comunicação alternativa.',
    type: 'video',
    thumbnailUrl: '/placeholder.svg',
    fileUrl: '#',
    diagnoses: ['TEA', 'Paralisia Cerebral', 'Deficiência Auditiva'],
    subjects: ['Habilidades Socioemocionais'],
    educationLevels: ['Educação Infantil', 'Fundamental 1'],
    rating: 4.6,
    reviewCount: 34,
    downloadCount: 189,
    favoriteCount: 45,
    author: {
      name: 'Prof. Juliana Freitas',
      school: 'Escola Exemplo D'
    },
    createdAt: '2024-10-28',
    isNew: false,
    isFeatured: false,
    tags: ['CAA', 'Vídeo', 'Tutorial']
  },
  {
    id: '5',
    title: 'Avaliação Adaptada de Ciências',
    description: 'Prova de ciências com questões visuais, múltipla escolha adaptada e suporte de imagens.',
    fullDescription: 'Avaliação completamente adaptada para alunos com diferentes necessidades.',
    type: 'avaliacao-adaptada',
    thumbnailUrl: '/placeholder.svg',
    fileUrl: '#',
    diagnoses: ['Dislexia', 'Deficiência Intelectual', 'TEA'],
    subjects: ['Ciências da Natureza'],
    educationLevels: ['Fundamental 1'],
    rating: 4.5,
    reviewCount: 28,
    downloadCount: 156,
    favoriteCount: 38,
    author: {
      name: 'Prof. Roberto Lima',
      school: 'Escola Exemplo E'
    },
    createdAt: '2024-10-20',
    isNew: false,
    isFeatured: false,
    tags: ['Avaliação', 'Ciências', 'Adaptada']
  },
  {
    id: '6',
    title: 'História Social: Indo ao Dentista',
    description: 'História social ilustrada para preparar alunos com TEA para consulta odontológica.',
    fullDescription: 'Material preparatório para reduzir ansiedade em situações novas.',
    type: 'historia-social',
    thumbnailUrl: '/placeholder.svg',
    fileUrl: '#',
    diagnoses: ['TEA'],
    subjects: ['Habilidades Socioemocionais', 'Atividades de Vida Diária'],
    educationLevels: ['Educação Infantil', 'Fundamental 1'],
    rating: 4.9,
    reviewCount: 52,
    downloadCount: 298,
    favoriteCount: 76,
    author: {
      name: 'Prof. Patricia Santos',
      school: 'Escola Exemplo F'
    },
    createdAt: '2024-10-15',
    isNew: false,
    isFeatured: true,
    tags: ['História Social', 'TEA', 'Autonomia']
  }
];

export const mockReviews: ResourceReview[] = [
  {
    id: '1',
    resourceId: '1',
    author: 'Prof. Carla',
    rating: 5,
    comment: 'Funcionou muito bem com minha turma! Os alunos com TEA adoraram as cores e pictogramas.',
    date: '2024-10-23',
    helpfulCount: 12
  },
  {
    id: '2',
    resourceId: '1',
    author: 'Prof. João',
    rating: 4,
    comment: 'Excelente recurso! Apenas precisei adaptar alguns pictogramas para meu contexto.',
    date: '2024-10-20',
    helpfulCount: 8
  },
  {
    id: '3',
    resourceId: '1',
    author: 'Prof. Fernanda',
    rating: 5,
    comment: 'Material de alta qualidade. Meus alunos progrediram significativamente na leitura.',
    date: '2024-10-18',
    helpfulCount: 15
  }
];

export const mockBadges: Badge[] = [
  {
    id: 'first-contribution',
    name: 'Primeira Contribuição',
    description: 'Compartilhou seu primeiro recurso',
    icon: '🌱',
    earnedAt: '2024-01-15'
  },
  {
    id: '10-resources',
    name: '10 Recursos Publicados',
    description: 'Contribuiu com 10 recursos para a biblioteca',
    icon: '🌟',
    earnedAt: '2024-05-20'
  },
  {
    id: 'featured-resource',
    name: 'Recurso em Destaque',
    description: 'Teve um recurso destacado pela comunidade',
    icon: '🔥',
    earnedAt: '2024-08-10'
  },
  {
    id: '1000-downloads',
    name: '1000+ Downloads',
    description: 'Seus recursos alcançaram 1000 downloads',
    icon: '💎',
    earnedAt: '2024-10-01'
  },
  {
    id: 'bronze',
    name: 'Colaborador Bronze',
    description: '5 recursos publicados',
    icon: '🥉'
  },
  {
    id: 'silver',
    name: 'Colaborador Prata',
    description: '15 recursos publicados',
    icon: '🥈'
  },
  {
    id: 'gold',
    name: 'Colaborador Ouro',
    description: '30 recursos publicados',
    icon: '🥇'
  }
];
