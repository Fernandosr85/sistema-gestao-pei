import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatLocalDate } from '@/lib/date';
import { noteSourceLabel, notesOfGoal, peiGoalStatusLabel } from '@/lib/pei';
import { useDemoStore } from '@/store/useDemoStore';
import type { PeiGoal, PeiGoalStatus } from '@/types/pei';

/** Cor é reforço, nunca portadora: o status também está escrito no selo, ao lado do título. */
const borderByStatus: Record<PeiGoalStatus, string> = {
  achieved: 'border-l-success',
  inProgress: 'border-l-warning',
  needsReview: 'border-l-warning',
  notStarted: 'border-l-muted-foreground',
};

const badgeByStatus: Record<PeiGoalStatus, { className?: string; variant?: 'secondary' | 'outline' }> = {
  achieved: { className: 'bg-success' },
  inProgress: { variant: 'secondary' },
  needsReview: { className: 'bg-warning' },
  notStarted: { variant: 'outline' },
};

interface PeiGoalCardProps {
  goal: PeiGoal;
  /** Id do aviso de dados fictícios, para os controles desabilitados apontarem para ele. */
  noticeId: string;
}

/**
 * Uma meta do PEI, com as notas de acompanhamento que apontam para ela.
 *
 * Até a Etapa 9 esta parte da tela era texto fixo — "Objetivo 1: Escrever nome completo",
 * "Alcançado (100%)" e "📷 3 fotos" —, igual para qualquer estudante. Agora vem do store, e a
 * nota traz a evidência pelo registro que ela cita, não por uma cópia do conteúdo dele.
 */
export function PeiGoalCard({ goal, noticeId }: PeiGoalCardProps) {
  const { state } = useDemoStore();
  const notes = notesOfGoal(state, goal.id);
  const badge = badgeByStatus[goal.status];

  return (
    <Card className={`border-l-4 ${borderByStatus[goal.status]}`}>
      <CardContent className="space-y-3 pt-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h4 className="font-semibold">{goal.title}</h4>
          <Badge className={badge.className} variant={badge.variant}>
            {peiGoalStatusLabel(goal.status)}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">{goal.description}</p>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Progresso da meta</span>
            <span className="font-semibold">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>

        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">Estratégias:</span> {goal.strategies.join('; ')}
          </p>
          <p>
            <span className="font-medium">Próxima etapa:</span> {goal.nextStep}
          </p>
          <p>
            <span className="font-medium">Responsável:</span> {goal.owner}
          </p>
          {goal.dueOn && (
            <p>
              <span className="font-medium">Prazo:</span> {formatLocalDate(goal.dueOn)}
            </p>
          )}
        </div>

        <div className="space-y-2 border-t pt-3">
          <h5 className="text-sm font-semibold">
            Observações nesta meta{notes.length > 0 ? ` (${notes.length})` : ''}
          </h5>
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma observação registrada nesta meta.</p>
          ) : (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li key={note.id} className="rounded-md bg-muted/50 p-3 text-sm">
                  <p className="text-muted-foreground">
                    {formatLocalDate(note.date)} — {note.author}
                  </p>
                  <p>{note.text}</p>
                  {note.source && (
                    <p className="mt-1 text-muted-foreground">
                      <span className="font-medium">Evidência:</span> {noteSourceLabel(state, note.source)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
          {/*
            * Continua desabilitado: escrever nota na meta é ação que o store ainda não tem. O que
            * mudou nesta etapa é a leitura — o botão não finge mais que há o que adicionar a um
            * plano de exemplo.
            */}
          <Button variant="link" size="sm" className="h-auto p-0" disabled aria-describedby={noticeId}>
            Adicionar observação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
