import { MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Student } from '@/types';

interface StudentProfileCardProps {
  student: Student;
}

interface ProfileSection {
  title: string;
  entries: Array<{ label: string; value?: string }>;
}

/** Fields filled in the new-student form, which were saved but never displayed. */
const sectionsFor = (student: Student): ProfileSection[] => [
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

const StudentProfileCard = ({ student }: StudentProfileCardProps) => {
  const sections = sectionsFor(student)
    .map((section) => ({ ...section, entries: section.entries.filter((entry) => entry.value?.trim()) }))
    .filter((section) => section.entries.length > 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
          Comunicação, comportamento e rotina
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {sections.length === 0 ? (
          <p className="text-muted-foreground">
            Nenhuma informação de comunicação, comportamento ou rotina no cadastro deste aluno.
          </p>
        ) : (
          sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h4 className="font-semibold">{section.title}</h4>
              <dl className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {section.entries.map((entry) => (
                  <div key={entry.label}>
                    <dt className="text-muted-foreground">{entry.label}</dt>
                    <dd className="whitespace-pre-line font-medium">{entry.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default StudentProfileCard;
