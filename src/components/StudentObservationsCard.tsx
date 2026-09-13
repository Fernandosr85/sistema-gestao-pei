import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatLocalDate } from '@/lib/date';
import { labelFor, quickObservationToneOptions } from '@/lib/observation';
import { useDemoStore } from '@/store/useDemoStore';

interface StudentObservationsCardProps {
  studentId: string;
}

const StudentObservationsCard = ({ studentId }: StudentObservationsCardProps) => {
  const { state } = useDemoStore();
  const observations = state.observations.filter((observation) => observation.studentId === studentId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardList className="h-5 w-5 text-info" aria-hidden="true" />
          Observações do aluno
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {observations.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma observação registrada para este aluno.</p>
        ) : (
          <ul className="space-y-3">
            {observations.map((observation) => (
              <li key={observation.id} className="rounded-md border p-3">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-medium">
                    {formatLocalDate(observation.data)}
                    {observation.kind === 'quick' ? ` às ${observation.time}` : ''}
                  </span>
                  <Badge variant="outline">
                    {observation.kind === 'quick' ? 'Registro rápido' : 'Observação estruturada'}
                  </Badge>
                  {observation.kind === 'quick' && (
                    <Badge variant="outline">{labelFor(quickObservationToneOptions, observation.tone)}</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {observation.kind === 'quick'
                    ? observation.description
                    : `Ponto forte: ${observation.resumo.pontoForte}`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Por {observation.observador}</p>
              </li>
            ))}
          </ul>
        )}
        <Link to="/observacoes" className="inline-block text-primary hover:underline">
          Ver todas as observações
        </Link>
      </CardContent>
    </Card>
  );
};

export default StudentObservationsCard;
