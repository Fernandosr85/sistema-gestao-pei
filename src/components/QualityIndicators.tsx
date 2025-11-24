import { Star, FileText, GraduationCap, Heart, Users, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface KPI {
  id: string;
  title: string;
  icon: React.ReactNode;
  meta: number;
  realizado: number;
  anoAnterior: number;
  status: 'success' | 'warning' | 'error';
  statusText: string;
  actionText: string;
  actionLink: string;
}

const QualityIndicators = () => {
  const kpis: KPI[] = [
    {
      id: '1',
      title: 'Taxa de Implementação dos PEIs',
      icon: <FileText className="h-5 w-5" />,
      meta: 95,
      realizado: 88,
      anoAnterior: 82,
      status: 'warning',
      statusText: '🟡 Atenção - 7% abaixo da meta',
      actionText: '12 PEIs aguardando revisão urgente',
      actionLink: 'Ver PEIs pendentes →'
    },
    {
      id: '2',
      title: 'Progressão dos Estudantes',
      icon: <TrendingUp className="h-5 w-5" />,
      meta: 75,
      realizado: 82,
      anoAnterior: 78,
      status: 'success',
      statusText: '✅ Acima da meta',
      actionText: '37 alunos alcançaram todos objetivos',
      actionLink: 'Ver detalhes →'
    },
    {
      id: '3',
      title: 'Formação Docente',
      icon: <GraduationCap className="h-5 w-5" />,
      meta: 40,
      realizado: 52,
      anoAnterior: 38,
      status: 'success',
      statusText: '✅ Superando meta em 30%',
      actionText: 'Participação: 98% dos professores',
      actionLink: 'Ver certificações →'
    },
    {
      id: '4',
      title: 'Satisfação das Famílias',
      icon: <Heart className="h-5 w-5" />,
      meta: 85,
      realizado: 91,
      anoAnterior: 87,
      status: 'success',
      statusText: '✅ Excelente',
      actionText: 'NPS: 78 (Promotores)',
      actionLink: 'Ver feedbacks →'
    },
    {
      id: '5',
      title: 'Inclusão Social',
      icon: <Users className="h-5 w-5" />,
      meta: 70,
      realizado: 65,
      anoAnterior: 60,
      status: 'warning',
      statusText: '🟡 Abaixo da meta',
      actionText: 'Ação: Implementar programa de sensibilização',
      actionLink: 'Ver plano de ação →'
    },
    {
      id: '6',
      title: 'Tempo de Resposta a Demandas',
      icon: <Clock className="h-5 w-5" />,
      meta: 5,
      realizado: 3.2,
      anoAnterior: 4.8,
      status: 'success',
      statusText: '✅ Excelente tempo de resposta',
      actionText: '',
      actionLink: 'Ver demandas →'
    }
  ];

  const renderKPI = (kpi: KPI) => {
    const statusColors = {
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-destructive'
    };

    const statusBgColors = {
      success: 'bg-success/10',
      warning: 'bg-warning/10',
      error: 'bg-destructive/10'
    };

    const metaValue = kpi.id === '6' ? 100 - (kpi.realizado / kpi.meta * 100) : (kpi.realizado / kpi.meta) * 100;
    const anoAnteriorValue = kpi.id === '6' ? 100 - (kpi.anoAnterior / kpi.meta * 100) : (kpi.anoAnterior / kpi.meta) * 100;

    return (
      <Card key={kpi.id} className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              {kpi.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">{kpi.title}</h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Meta: {kpi.id === '6' ? `<${kpi.meta} dias` : kpi.id === '3' ? `${kpi.meta}h/ano` : `${kpi.meta}%`}</div>
              <Progress value={100} className="h-2 mb-1" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Realizado: {kpi.id === '6' ? `${kpi.realizado} dias` : kpi.id === '3' ? `${kpi.realizado}h` : `${kpi.realizado}%`}
              </div>
              <Progress value={Math.min(metaValue, 100)} className="h-2 mb-1" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Ano Ant: {kpi.id === '6' ? `${kpi.anoAnterior} dias` : kpi.id === '3' ? `${kpi.anoAnterior}h` : `${kpi.anoAnterior}%`}
              </div>
              <Progress value={Math.min(anoAnteriorValue, 100)} className="h-2 mb-1" />
            </div>
          </div>

          <div className={`p-3 rounded-lg ${statusBgColors[kpi.status]} mb-2`}>
            <div className={`text-sm font-medium ${statusColors[kpi.status]} mb-1`}>
              Status: {kpi.statusText}
            </div>
            {kpi.actionText && (
              <div className="text-xs text-muted-foreground">
                {kpi.actionText}
              </div>
            )}
          </div>

          <Button variant="link" size="sm" className="p-0 h-auto text-primary">
            {kpi.actionLink}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-6 w-6 text-warning" />
          INDICADORES DE QUALIDADE DA INCLUSÃO
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full mb-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              📊 Visão Geral
            </TabsTrigger>
            <TabsTrigger value="school">
              🏫 Por Escola
            </TabsTrigger>
            <TabsTrigger value="teacher">
              👨‍🏫 Por Professor
            </TabsTrigger>
            <TabsTrigger value="history">
              📅 Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                KPIs PRINCIPAIS (Comparação: Meta vs. Realizado vs. Ano Anterior)
              </h3>
            </div>
            {kpis.map(renderKPI)}
          </TabsContent>

          <TabsContent value="school">
            <div className="p-8 text-center text-muted-foreground">
              Visualização por escola em desenvolvimento
            </div>
          </TabsContent>

          <TabsContent value="teacher">
            <div className="p-8 text-center text-muted-foreground">
              Visualização por professor em desenvolvimento
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="p-8 text-center text-muted-foreground">
              Histórico de indicadores em desenvolvimento
            </div>
          </TabsContent>
        </Tabs>

        <Button className="w-full" variant="outline">
          📥 Exportar Relatório de Indicadores
        </Button>
      </CardContent>
    </Card>
  );
};

export default QualityIndicators;
