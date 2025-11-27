import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const AlertasRiscosContent = () => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Gestão &gt; Alertas e Riscos
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Sistema de Alertas e Riscos em Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta seção irá conter:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
            <li>Matriz de Riscos (Grid 3x3 com eixos Probabilidade x Impacto)</li>
            <li>Detalhamento de Riscos (Cards expansíveis com descrição, impactos, mitigações)</li>
            <li>Resumo de Riscos (Estatísticas e contadores por severidade)</li>
            <li>Ferramentas de gestão de riscos institucionais</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertasRiscosContent;
