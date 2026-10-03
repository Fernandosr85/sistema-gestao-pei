import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { goalsByArea, peiGoalAreaLabel, peiGoalStatusLabel } from '@/lib/pei';
import type { PeiGoal, PeiGoalArea } from '@/types/pei';

interface PeiGoalProgressListProps {
  goals: PeiGoal[];
  /** Restringe às áreas desta lista. Sem ela, mostra todas as áreas do plano. */
  areas?: PeiGoalArea[];
  /** O que dizer quando não sobra meta nenhuma — a ausência tem nome, e não é 0%. */
  vazio: string;
}

/**
 * As metas do plano com o progresso corrente, agrupadas por área.
 *
 * Até a Etapa 9 esta lista era fixa no Desempenho — "Ler palavras simples 80%", "Escrever nome
 * completo 100%" —, igual para qualquer estudante, e não tinha relação com o Ver PEI ao lado.
 * Agora as duas telas leem as mesmas metas: a diferença entre elas é o que cada uma mostra em
 * volta, não o dado.
 */
export function PeiGoalProgressList({ goals, areas, vazio }: PeiGoalProgressListProps) {
  const selecionadas = areas ? goals.filter((goal) => areas.includes(goal.area)) : goals;
  const grupos = goalsByArea(selecionadas);

  if (grupos.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">{vazio}</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {grupos.map((grupo) => (
          <div key={grupo.area}>
            <h3 className="mb-3 font-semibold">{peiGoalAreaLabel(grupo.area)}</h3>
            <div className="space-y-3">
              {grupo.goals.map((goal) => (
                <div key={goal.id} className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span>{goal.title}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={goal.progress} className="h-2 w-24" />
                      <span className="w-12 text-right font-semibold">{goal.progress}%</span>
                      {/* O status em texto, ao lado da barra: cor e comprimento não bastam. */}
                      <Badge variant={goal.status === 'achieved' ? 'default' : 'secondary'}>
                        {peiGoalStatusLabel(goal.status)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Responsável: {goal.owner}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
