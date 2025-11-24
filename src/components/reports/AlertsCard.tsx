import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Lightbulb, AlertTriangle } from 'lucide-react';

const alerts = [
  {
    tipo: 'insight',
    icone: Bot,
    mensagem: 'Padrão identificado: Melhor desempenho nas terças-feiras',
    bgColor: 'bg-[hsl(var(--alert-warning-bg))]',
    textColor: 'text-[hsl(var(--alert-warning-text))]',
    borderColor: 'border-l-[hsl(var(--alert-warning-border))]',
    iconColor: 'text-[hsl(var(--alert-warning-icon))]',
  },
  {
    tipo: 'lembrete',
    icone: Lightbulb,
    mensagem: 'Lembrar: Revisão semestral de PEI em 7 dias',
    bgColor: 'bg-[hsl(var(--alert-info-bg))]',
    textColor: 'text-[hsl(var(--alert-info-text))]',
    borderColor: 'border-l-[hsl(var(--alert-info-border))]',
    iconColor: 'text-[hsl(var(--alert-info-icon))]',
  },
  {
    tipo: 'atencao',
    icone: AlertTriangle,
    mensagem: 'Atenção: Reunião trimestral com família agendada para 15/12',
    bgColor: 'bg-[hsl(var(--alert-critical-bg))]',
    textColor: 'text-[hsl(var(--alert-critical-text))]',
    borderColor: 'border-l-[hsl(var(--alert-critical-border))]',
    iconColor: 'text-[hsl(var(--alert-critical-icon))]',
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
              className={`p-4 rounded-lg border-l-4 ${alert.bgColor} ${alert.borderColor} ${alert.textColor} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-6 w-6 ${alert.iconColor} flex-shrink-0 mt-0.5`} />
                <p className="text-sm leading-relaxed font-medium">{alert.mensagem}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AlertsCard;
