import { MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { studentProfileSections } from '@/lib/student';
import type { Student } from '@/types';

interface StudentProfileCardProps {
  student: Student;
}

const StudentProfileCard = ({ student }: StudentProfileCardProps) => {
  const sections = studentProfileSections(student);

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
