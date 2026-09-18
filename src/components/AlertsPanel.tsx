import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { scenarioAlerts, type ScenarioAlert } from '@/data/scenarioAlerts';

const AlertsPanel = () => {
  // Os alertas moram em src/data/scenarioAlerts.ts, para o Resumo Executivo contar da mesma lista.
  const alerts = scenarioAlerts;

  const criticalAlerts = alerts.filter(a => a.type === 'critical');
  const warningAlerts = alerts.filter(a => a.type === 'warning');
  const infoAlerts = alerts.filter(a => a.type === 'info');

  const renderAlert = (alert: ScenarioAlert) => {
    const bgColors = {
      critical: 'bg-destructive/10 border-destructive',
      warning: 'bg-warning/10 border-warning',
      info: 'bg-primary/10 border-primary'
    };

    const icons = {
      critical: '🔴',
      warning: '🟡',
      info: '🔵'
    };

    const titles = {
      critical: 'CRÍTICO',
      warning: 'ATENÇÃO',
      info: 'INFORMAÇÃO'
    };

    return (
      <Card key={alert.id} className={`${bgColors[alert.type]} border-2 mb-4`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">{icons[alert.type]}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="font-bold">
                  {titles[alert.type]}
                </Badge>
                <span className="text-xs text-muted-foreground">- {alert.description}</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{alert.title}</h3>
              <div className="space-y-1 text-sm text-muted-foreground mb-3">
                {alert.details.map((detail, idx) => (
                  <div key={idx}>{detail}</div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          ALERTAS E AÇÕES PRIORITÁRIAS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">
              Todos ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="critical">
              Críticos ({criticalAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="warning">
              Atenção ({warningAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="info">
              Info ({infoAlerts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {alerts.map(renderAlert)}
          </TabsContent>

          <TabsContent value="critical">
            {criticalAlerts.map(renderAlert)}
          </TabsContent>

          <TabsContent value="warning">
            {warningAlerts.map(renderAlert)}
          </TabsContent>

          <TabsContent value="info">
            {infoAlerts.map(renderAlert)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
