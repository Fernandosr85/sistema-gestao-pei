import { Users, FileText, GraduationCap, TrendingUp, Target, AlertTriangle, Heart, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import DemoDataNotice from '@/components/DemoDataNotice';
import { illustrativeScenario } from '@/config/institution';
import { scenarioAlerts } from '@/data/scenarioAlerts';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  sublabel: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  status: 'success' | 'warning' | 'error' | 'neutral';
}

const MetricCard = ({ icon, value, label, sublabel, trend, trendValue, status }: MetricCardProps) => {
  const statusColors = {
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  const trendIcons = {
    up: '↗️',
    down: '↘️',
    neutral: '→'
  };

  return (
    <Card className="bg-card hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
        <div className="text-sm font-medium text-foreground mb-1">{label}</div>
        <div className="text-xs text-muted-foreground mb-2">{sublabel}</div>
        <div className={`flex items-center gap-1 text-xs font-medium ${statusColors[status]}`}>
          <span>{trendIcons[trend]}</span>
          <span>{trendValue}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const ExecutiveSummary = () => {
  // Contados da mesma lista que o painel de alertas mostra logo abaixo, na mesma aba. Eram
  // "17 alertas ativos, 5 críticos", digitados, ao lado de uma lista com 5 e 2.
  const criticalAlerts = scenarioAlerts.filter((alert) => alert.type === 'critical').length;
  const metrics = [
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      value: illustrativeScenario.studentsWithPei,
      label: 'ALUNOS',
      sublabel: 'com PEI',
      trend: 'up' as const,
      trendValue: '+3 mês',
      status: 'success' as const
    },
    {
      icon: <FileText className="h-5 w-5 text-primary" />,
      value: '88%',
      label: 'PEIs',
      sublabel: 'em implementação',
      trend: 'down' as const,
      trendValue: '🟡 -7% meta',
      status: 'warning' as const
    },
    {
      icon: <GraduationCap className="h-5 w-5 text-primary" />,
      value: '52h/ano',
      label: 'PROF.',
      sublabel: 'formação',
      trend: 'up' as const,
      trendValue: '✅ +30%',
      status: 'success' as const
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      value: '8.2',
      label: 'ÍNDICE',
      sublabel: 'inclusão',
      trend: 'up' as const,
      trendValue: '✅ +0.5',
      status: 'success' as const
    },
    {
      icon: <Target className="h-5 w-5 text-primary" />,
      value: 312,
      label: 'OBJETO',
      sublabel: 'alcançad.',
      trend: 'up' as const,
      trendValue: '✅ +18%',
      status: 'success' as const
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-primary" />,
      value: scenarioAlerts.length,
      label: 'ALERT',
      sublabel: 'ativos',
      trend: 'neutral' as const,
      trendValue: `🔴 ${criticalAlerts} crít`,
      status: 'error' as const
    },
    {
      icon: <Heart className="h-5 w-5 text-primary" />,
      value: '91%',
      label: 'FAMÍLIAS',
      sublabel: 'satisfeitas',
      trend: 'up' as const,
      trendValue: '✅ +4%',
      status: 'success' as const
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      value: '82%',
      label: 'PROGR',
      sublabel: 'alunos',
      trend: 'up' as const,
      trendValue: '✅ +4%',
      status: 'success' as const
    }
  ];

  return (
    <Card className="bg-card/50 border-2 border-primary/20 shadow-lg mb-8">
      <CardContent className="p-6">
        <DemoDataNotice
          subject="Os indicadores deste resumo"
          detail="Eles não derivam dos alunos cadastrados no sistema."
          className="mb-6"
        />
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              RESUMO EXECUTIVO - SNAPSHOT ATUAL
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          {/* Os dois indicadores que a Visão Geral também mostra, lá com outro nome e outra medida. */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Valores fixos de demonstração.</p>
            <p>
              PEIs em implementação: dos PEIs ativos, quantos têm as adaptações previstas em
              execução. Não é a parcela de PEIs com objetivos alcançados, da Visão Geral.
            </p>
            <p>
              Famílias satisfeitas: percentual das famílias que se declararam satisfeitas. Não é a
              nota média de 1 a 5, da Visão Geral.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutiveSummary;
