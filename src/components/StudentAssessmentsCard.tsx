import { ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { assessmentKindLabel, objectiveStatusLabel } from '@/lib/assessment';
import { formatLocalDate } from '@/lib/date';
import { useDemoStore } from '@/store/useDemoStore';

interface StudentAssessmentsCardProps {
  studentId: string;
}

const StudentAssessmentsCard = ({ studentId }: StudentAssessmentsCardProps) => {
  const { state } = useDemoStore();
  const assessments = state.assessments.filter((assessment) => assessment.studentId === studentId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardCheck className="h-5 w-5 text-success" aria-hidden="true" />
          Avaliações do aluno
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {assessments.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma avaliação registrada para este aluno.</p>
        ) : (
          <ul className="space-y-3">
            {assessments.map((assessment) => (
              <li key={assessment.id} className="rounded-md border p-3">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-medium">{formatLocalDate(assessment.date)}</span>
                  <Badge variant="outline">
                    {assessmentKindLabel(assessment.kind)}
                    {assessment.quarter ? ` · ${assessment.quarter}º trimestre` : ''}
                  </Badge>
                </div>
                {assessment.objectives.map((objective) => (
                  <p key={objective.title} className="text-muted-foreground">
                    {objective.title}: {objective.progress}% ({objectiveStatusLabel(objective.status)})
                  </p>
                ))}
                <p className="mt-1 line-clamp-2 text-muted-foreground">
                  Conquistas: {assessment.summary.achievements}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Por {assessment.assessor}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentAssessmentsCard;
