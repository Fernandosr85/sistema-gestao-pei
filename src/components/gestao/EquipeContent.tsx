import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const EquipeContent = () => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Gestão &gt; Equipe
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Gestão de Equipe em Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta seção irá conter:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
            <li>Visão Geral da Equipe (total de profissionais por categoria)</li>
            <li>Gestão de Carga de Trabalho (gráficos e análise de sobrecarga)</li>
            <li>Simulador de Redistribuição de carga</li>
            <li>Histórico de Afastamentos</li>
            <li>Contratações e Renovações (alertas de contratos a vencer)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipeContent;
