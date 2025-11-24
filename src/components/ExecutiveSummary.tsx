import { Users, FileText, GraduationCap, TrendingUp, Target, AlertTriangle, Heart, BarChart3, RefreshCw, Download, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  const metrics = [
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      value: 45,
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
      sublabel: 'implement.',
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
      value: 17,
      label: 'ALERT',
      sublabel: 'ativos',
      trend: 'neutral' as const,
      trendValue: '🔴 5 crít',
      status: 'error' as const
    },
    {
      icon: <Heart className="h-5 w-5 text-primary" />,
      value: '91%',
      label: 'SATISF',
      sublabel: 'famílias',
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4" />
            <span>Atualizado há 5 min</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar Resumo
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Enviar Gestão
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutiveSummary;
