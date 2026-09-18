import { z } from 'zod';
import type { Assessment, Atendimento, Observation, Student } from '@/types';
import type { Resource, ResourceFavorite, ResourceReview } from '@/types/resource';

/*
 * Validação de FORMA do que vem do localStorage.
 *
 * O validador antigo checava só que cada registro era objeto e tinha `id` string. Essa
 * frouxidão tem dois efeitos opostos, os dois medidos na Etapa 5: barateou a remoção do nome
 * duplicado, que não precisou de v4, e deixava passar registro malformado que quebra a tela —
 * um `Student` sem `dataCadastro` derruba a ficha em `formatLocalDate`.
 *
 * Cada esquema é anotado como `z.ZodType<T>`, com o tipo de `@/types` como fonte: se o esquema
 * deixar de produzir o tipo declarado, o compilador reprova. Derivar o tipo do esquema com
 * `z.infer` seria o desenho certo e reescreve `types/index.ts` inteiro; está registrado para a
 * Etapa 9.
 */

const nonEmpty = z.string();

export const studentSchema: z.ZodType<Student> = z.object({
  id: nonEmpty,
  nomeCompleto: nonEmpty,
  dataNascimento: nonEmpty,
  matricula: nonEmpty,
  serie: nonEmpty,
  turma: nonEmpty,
  diagnostico: nonEmpty,
  nivelSuporte: z.enum(['baixo', 'medio', 'alto']),
  professorResponsavel: nonEmpty,
  status: z.enum(['ativo', 'inativo', 'transferido', 'trancado']),
  dataCadastro: nonEmpty,
  responsavel: z.object({
    nome: nonEmpty,
    parentesco: nonEmpty,
    telefone: nonEmpty,
    email: nonEmpty,
  }),
  comunicacao: z
    .object({ compreensaoFala: nonEmpty, palavrasConhecidas: nonEmpty })
    .optional(),
  comportamento: z
    .object({
      comportamentosDesafiadores: nonEmpty,
      estrategiasAcalmar: nonEmpty,
      situacoesEstresse: nonEmpty,
    })
    .optional(),
  rotina: z
    .object({
      horarioAcordar: nonEmpty,
      horarioDormir: nonEmpty,
      comeSozinha: nonEmpty,
      usaBanheiroSozinha: nonEmpty,
      atividadesPreferidas: nonEmpty,
    })
    .optional(),
});

const observationBase = {
  id: nonEmpty,
  studentId: nonEmpty,
  data: nonEmpty,
  observador: nonEmpty,
};

export const observationSchema: z.ZodType<Observation> = z.discriminatedUnion('kind', [
  z.object({
    ...observationBase,
    kind: z.literal('structured'),
    periodo: z.enum(['manha', 'tarde']),
    duracao: z.number(),
    comunicacao: z.object({
      situacoes: z.array(z.object({ contexto: nonEmpty, resposta: nonEmpty })),
    }),
    habilidadesSociais: z.object({
      interacoes: z.array(z.object({ tipo: nonEmpty, descricao: nonEmpty })),
    }),
    comportamento: z.object({
      positivos: z.array(nonEmpty),
      desafiadores: z.array(nonEmpty),
    }),
    resumo: z.object({
      pontoForte: nonEmpty,
      desafio: nonEmpty,
      ajustesNecessarios: nonEmpty,
    }),
  }),
  z.object({
    ...observationBase,
    kind: z.literal('quick'),
    time: nonEmpty,
    context: z.enum(['classroom', 'recess', 'aee', 'physicalEducation', 'other']),
    topics: z.array(z.enum(['peiGoal', 'behavior', 'learning', 'socialization', 'communication'])),
    tone: z.enum(['positive', 'neutral', 'attention']),
    description: nonEmpty,
  }),
]);

const performanceLevel = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const assessmentSchema: z.ZodType<Assessment> = z.object({
  id: nonEmpty,
  studentId: nonEmpty,
  date: nonEmpty,
  assessor: nonEmpty,
  kind: z.enum(['diagnostic', 'formative', 'quarterly', 'socioemotional', 'accessibility']),
  quarter: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  objectives: z.array(
    z.object({
      title: nonEmpty,
      status: z.enum(['achieved', 'inProgress', 'notStarted', 'needsReview']),
      progress: z.number(),
      notes: nonEmpty,
    }),
  ),
  languageArts: z.object({
    reading: performanceLevel,
    writing: performanceLevel,
    speaking: performanceLevel,
    notes: nonEmpty,
  }),
  socioEmotional: z.object({
    recognizesEmotions: z.boolean(),
    managesFrustration: z.boolean(),
    asksForHelp: z.boolean(),
  }),
  summary: z.object({
    achievements: nonEmpty,
    challenges: nonEmpty,
    nextSteps: nonEmpty,
  }),
});

export const appointmentSchema: z.ZodType<Atendimento> = z.object({
  id: nonEmpty,
  studentId: nonEmpty,
  tipo: z.enum(['Reunião Pedagógica', 'Avaliação', 'Atendimento Família', 'Multidisciplinar', 'Outros']),
  data: nonEmpty,
  horarioInicio: nonEmpty,
  horarioFim: nonEmpty,
  status: z.enum(['agendado', 'remarcado', 'realizado', 'cancelado']),
  profissionais: z.array(nonEmpty),
  local: nonEmpty,
  objetivos: nonEmpty,
  observacoes: nonEmpty.optional(),
  ata: nonEmpty.optional(),
});

export const resourceSchema: z.ZodType<Resource> = z.object({
  id: nonEmpty,
  title: nonEmpty,
  description: nonEmpty,
  fullDescription: nonEmpty,
  type: z.enum([
    'material-impresso', 'video', 'jogo', 'aplicativo', 'prancha-caa',
    'sequencia-didatica', 'avaliacao-adaptada', 'roteiro-visual', 'historia-social', 'outro',
  ]),
  thumbnailUrl: nonEmpty,
  fileUrl: nonEmpty,
  diagnoses: z.array(z.enum([
    'TEA', 'TDAH', 'Dislexia', 'Discalculia', 'Deficiência Intelectual', 'Síndrome de Down',
    'Deficiência Visual', 'Deficiência Auditiva', 'Paralisia Cerebral', 'Superdotação', 'Outros',
  ])),
  subjects: z.array(z.enum([
    'Língua Portuguesa', 'Matemática', 'Ciências da Natureza', 'Geografia', 'História', 'Arte',
    'Educação Física', 'Inglês', 'Habilidades Socioemocionais', 'Atividades de Vida Diária',
  ])),
  educationLevels: z.array(z.enum([
    'Educação Infantil', 'Fundamental 1', 'Fundamental 2', 'Ensino Médio', 'EJA',
  ])),
  author: z.object({ name: nonEmpty, school: nonEmpty }),
  createdAt: nonEmpty,
  isNew: z.boolean(),
  isFeatured: z.boolean(),
  tags: z.array(nonEmpty),
  objectives: z.array(nonEmpty).optional(),
  materials: z.array(nonEmpty).optional(),
  tips: z.array(nonEmpty).optional(),
  isLocalContribution: z.boolean().optional(),
});

export const reviewSchema: z.ZodType<ResourceReview> = z.object({
  id: nonEmpty,
  resourceId: nonEmpty,
  author: nonEmpty,
  rating: z.number(),
  comment: nonEmpty,
  date: nonEmpty,
});

export const favoriteSchema: z.ZodType<ResourceFavorite> = z.object({
  resourceId: nonEmpty,
  addedAt: nonEmpty,
});
