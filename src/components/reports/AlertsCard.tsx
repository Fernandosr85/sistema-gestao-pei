import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Lightbulb, AlertTriangle } from 'lucide-react';

const alerts = [
  {
    tipo: 'insight',
    icone: Bot,
    mensagem: 'Padrão identificado: Melhor desempenho nas terças-feiras',
    cor: 'bg-warning/10 border-warning/20 text-warning-foreground',
    iconColor: 'text-warning',
  },
  {
    tipo: 'lembrete',
    icone: Lightbulb,
    mensagem: 'Lembrar: Revisão semestral de PEI em 7 dias',
    cor: 'bg-info/10 border-info/20 text-info-foreground',
    iconColor: 'text-info',
  },
  {
    tipo: 'atencao',
    icone: AlertTriangle,
    mensagem: 'Atenção: Reunião trimestral com família agendada para 15/12',
    cor: 'bg-destructive/10 border-destructive/20 text-destructive-foreground',
    iconColor: 'text-destructive',
  },
];

const AlertsCard = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">ALERTAS E RECOMENDAÇÕES</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, idx) => {
          const Icon = alert.icone;
          return (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 ${alert.cor} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-6 w-6 ${alert.iconColor} flex-shrink-0 mt-0.5`} />
                <p className="text-sm leading-relaxed">{alert.mensagem}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AlertsCard;
