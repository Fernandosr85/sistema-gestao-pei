import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Target, Loader2 } from 'lucide-react';

const milestones = [
  {
    objetivo: 'Autonomia para ir ao banheiro',
    data: 'Mar/24',
    progresso: 100,
    status: 'completo',
  },
  {
    objetivo: 'Leitura de palavras simples',
    data: 'Ago/24',
    progresso: 100,
    status: 'completo',
  },
  {
    objetivo: 'Resolução de contas simples',
    data: null,
    progresso: 45,
    status: 'em_progresso',
  },
  {
    objetivo: 'Interação em grupo',
    data: null,
    progresso: 30,
    status: 'em_progresso',
  },
];

const MilestonesCard = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">MARCOS ALCANÇADOS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {milestones.map((milestone, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-start gap-3">
              {milestone.status === 'completo' ? (
                <CheckCircle2 className="h-6 w-6 text-success mt-0.5 flex-shrink-0" />
              ) : milestone.status === 'em_progresso' ? (
                <Loader2 className="h-6 w-6 text-warning mt-0.5 flex-shrink-0" />
              ) : (
                <Target className="h-6 w-6 text-destructive mt-0.5 flex-shrink-0" />
              )}
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {milestone.objetivo}
                    </p>
                    {milestone.data && (
                      <p className="text-xs text-muted-foreground">
                        ({milestone.data})
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {milestone.progresso}%
                  </span>
                </div>
                
                {milestone.progresso < 100 && (
                  <Progress value={milestone.progresso} className="h-2" />
                )}
              </div>
            </div>
            
            {idx < milestones.length - 1 && (
              <div className="border-b border-border ml-9"></div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MilestonesCard;
