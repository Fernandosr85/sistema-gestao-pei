import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const VisaoGeralContent = () => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Gestão &gt; Visão Geral
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Dashboard Executivo em Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta seção irá conter:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
            <li>Alertas Críticos (PEIs vencidos, professores em sobrecarga, famílias sem resposta)</li>
            <li>Indicadores do Dia (presença PEI, crises/intercorrências, pendências administrativas)</li>
            <li>Prioridades da Semana (tarefas com checkboxes funcionais)</li>
            <li>Linha do Tempo de Hoje (eventos e compromissos)</li>
            <li>Notificações Recentes</li>
            <li>Desempenho da Escola (KPIs principais)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisaoGeralContent;
