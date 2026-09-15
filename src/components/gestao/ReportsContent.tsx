import ProgressChart from '@/components/reports/ProgressChart';
import ObservationHeatmap from '@/components/reports/ObservationHeatmap';
import MilestonesCard from '@/components/reports/MilestonesCard';
import AlertsCard from '@/components/reports/AlertsCard';
import PredictiveAnalysis from '@/components/reports/PredictiveAnalysis';
import PEIRadarChart from '@/components/reports/PEIRadarChart';
import InterventionDonut from '@/components/reports/InterventionDonut';
import DemoDataNotice from '@/components/DemoDataNotice';

const ReportsContent = () => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Gestão &gt; Relatórios
      </div>

      <DemoDataNotice
        subject="Os indicadores, gráficos, projeções e percentuais desta tela"
        detail="As leituras e recomendações exibidas são montadas por regras fixas; nenhum modelo é executado."
      />

      {/* Header */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Relatórios
            </h2>
            <p className="text-sm text-muted-foreground">
              Painéis de acompanhamento do PEI com dados de demonstração
            </p>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="space-y-6">
        {/* Progresso Geral */}
        <ProgressChart />

        {/* Frequência de Observações */}
        <ObservationHeatmap />

        {/* Marcos Alcançados */}
        <MilestonesCard />

        {/* Alertas e Recomendações */}
        <AlertsCard />

        {/* Análise Preditiva */}
        <PredictiveAnalysis />

        {/* Grid de 2 colunas para Radar e Donut */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PEIRadarChart />
          <InterventionDonut />
        </div>
      </div>

    </div>
  );
};

export default ReportsContent;
