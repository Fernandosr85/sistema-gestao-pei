export type ResourceType = 
  | 'material-impresso'
  | 'video'
  | 'jogo'
  | 'aplicativo'
  | 'prancha-caa'
  | 'sequencia-didatica'
  | 'avaliacao-adaptada'
  | 'roteiro-visual'
  | 'historia-social'
  | 'outro';

export type DiagnosisType = 
  | 'TEA'
  | 'TDAH'
  | 'Dislexia'
  | 'Discalculia'
  | 'Deficiência Intelectual'
  | 'Síndrome de Down'
  | 'Deficiência Visual'
  | 'Deficiência Auditiva'
  | 'Paralisia Cerebral'
  | 'Superdotação'
  | 'Outros';

export type SubjectType =
  | 'Língua Portuguesa'
  | 'Matemática'
  | 'Ciências da Natureza'
  | 'Geografia'
  | 'História'
  | 'Arte'
  | 'Educação Física'
  | 'Inglês'
  | 'Habilidades Socioemocionais'
  | 'Atividades de Vida Diária';

export type EducationLevel =
  | 'Educação Infantil'
  | 'Fundamental 1'
  | 'Fundamental 2'
  | 'Ensino Médio'
  | 'EJA';

export interface Resource {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  type: ResourceType;
  thumbnailUrl: string;
  fileUrl: string;
  diagnoses: DiagnosisType[];
  subjects: SubjectType[];
  educationLevels: EducationLevel[];
  rating: number;
  reviewCount: number;
  downloadCount: number;
  favoriteCount: number;
  author: {
    name: string;
    school: string;
  };
  createdAt: string;
  isNew: boolean;
  isFeatured: boolean;
  tags: string[];
  objectives?: string[];
  materials?: string[];
  tips?: string[];
  /** Added in this browser through the contribution form: no moderation and no file. */
  isLocalContribution?: boolean;
}

export interface ResourceReview {
  id: string;
  resourceId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
}

/** Resource marked as favorite in this browser. Demo mode has no user accounts, so there is no owner. */
export interface ResourceFavorite {
  resourceId: string;
  addedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}
