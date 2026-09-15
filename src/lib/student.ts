import type { Student, StudentStatus } from '@/types';

/** A student is never deleted: leaving the school is a status change that keeps the history. */
export const studentStatusOptions: Array<{ value: StudentStatus; label: string }> = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'transferido', label: 'Transferido' },
  { value: 'trancado', label: 'Trancado' },
];

export const studentStatusLabel = (status: StudentStatus): string =>
  studentStatusOptions.find((option) => option.value === status)?.label ?? status;

/** Same grades offered by the new-student form. */
export const studentGrades = ['2º Ano EF', '3º Ano EF', '4º Ano EF', '5º Ano EF'];

export const supportLevelOptions: Array<{ value: Student['nivelSuporte']; label: string }> = [
  { value: 'baixo', label: 'Baixo' },
  { value: 'medio', label: 'Médio' },
  { value: 'alto', label: 'Alto' },
];

export const supportLevelLabel = (level: Student['nivelSuporte']): string =>
  supportLevelOptions.find((option) => option.value === level)?.label ?? level;

export interface StudentProfileSection {
  title: string;
  entries: Array<{ label: string; value: string }>;
}

/**
 * Communication, behavior and routine fields from the new-student form, leaving
 * out the empty ones. Shared by the student page and the printable report.
 */
export const studentProfileSections = (student: Student): StudentProfileSection[] => {
  const sections: Array<{ title: string; entries: Array<{ label: string; value?: string }> }> = [
    {
      title: 'Comunicação',
      entries: [
        { label: 'Compreensão da fala', value: student.comunicacao?.compreensaoFala },
        { label: 'Palavras conhecidas', value: student.comunicacao?.palavrasConhecidas },
      ],
    },
    {
      title: 'Comportamento',
      entries: [
        { label: 'Comportamentos desafiadores', value: student.comportamento?.comportamentosDesafiadores },
        { label: 'Estratégias para acalmar', value: student.comportamento?.estrategiasAcalmar },
        { label: 'Situações de estresse', value: student.comportamento?.situacoesEstresse },
      ],
    },
    {
      title: 'Rotina',
      entries: [
        { label: 'Horário de acordar', value: student.rotina?.horarioAcordar },
        { label: 'Horário de dormir', value: student.rotina?.horarioDormir },
        { label: 'Come sozinha?', value: student.rotina?.comeSozinha },
        { label: 'Usa o banheiro sozinha?', value: student.rotina?.usaBanheiroSozinha },
        { label: 'Atividades preferidas', value: student.rotina?.atividadesPreferidas },
      ],
    },
  ];

  return sections
    .map((section) => ({
      title: section.title,
      entries: section.entries.flatMap((entry) => (entry.value?.trim() ? [{ label: entry.label, value: entry.value }] : [])),
    }))
    .filter((section) => section.entries.length > 0);
};
