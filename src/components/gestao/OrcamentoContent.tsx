import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const OrcamentoContent = () => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Gestão &gt; Orçamento
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Gestão Orçamentária em Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta seção irá conter:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
            <li>Resumo Financeiro (orçamento total, executado, projetado)</li>
            <li>Execução por Categoria (distribuição do orçamento)</li>
            <li>Gastos Mensais (gráfico de evolução)</li>
            <li>Próximos Gastos Previstos</li>
            <li>Controle de Aprovações (solicitações pendentes)</li>
            <li>Comparativo com Outras Unidades</li>
            <li>Planejamento 2025</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrcamentoContent;
