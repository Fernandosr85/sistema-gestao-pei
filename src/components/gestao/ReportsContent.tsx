import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProgressChart from '@/components/reports/ProgressChart';
import ObservationHeatmap from '@/components/reports/ObservationHeatmap';
import MilestonesCard from '@/components/reports/MilestonesCard';
import AlertsCard from '@/components/reports/AlertsCard';
import PredictiveAnalysis from '@/components/reports/PredictiveAnalysis';
import PEIRadarChart from '@/components/reports/PEIRadarChart';
import InterventionDonut from '@/components/reports/InterventionDonut';
import ActionPanel from '@/components/reports/ActionPanel';

const ReportsContent = () => {
  const [periodo, setPeriodo] = useState('anual');
  const [aluno, setAluno] = useState('todos');
  const [serie, setSerie] = useState('todas');
  const [tipoRelatorio, setTipoRelatorio] = useState('completo');

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Gestão &gt; Relatórios
      </div>

      {/* Header com filtros */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Relatórios Inteligentes
            </h2>
            <p className="text-sm text-muted-foreground">
              Decisões Baseadas em Dados
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="semestral">Semestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={aluno} onValueChange={setAluno}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Aluno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="joao">João Silva</SelectItem>
                <SelectItem value="maria">Maria Santos</SelectItem>
                <SelectItem value="pedro">Pedro Costa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serie} onValueChange={setSerie}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Série" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="1ano">1º ano</SelectItem>
                <SelectItem value="2ano">2º ano</SelectItem>
                <SelectItem value="3ano">3º ano</SelectItem>
                <SelectItem value="4ano">4º ano</SelectItem>
                <SelectItem value="5ano">5º ano</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completo">Completo</SelectItem>
                <SelectItem value="academico">Acadêmico</SelectItem>
                <SelectItem value="comportamental">Comportamental</SelectItem>
                <SelectItem value="progressao">Progressão</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda + Central (70%) */}
        <div className="lg:col-span-8 space-y-6">
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

        {/* Coluna Direita (30%) */}
        <div className="lg:col-span-4">
          <ActionPanel />
        </div>
      </div>

      {/* Rodapé - Métricas de Desempenho */}
      <div className="bg-gradient-to-b from-muted/50 to-muted rounded-lg p-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="text-4xl">⏱️</div>
              <div>
                <div className="text-3xl font-bold text-primary">70%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Economia de tempo na elaboração de relatórios
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📈</div>
              <div>
                <div className="text-3xl font-bold text-success">45%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Aumento de assertividade das intervenções
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="text-4xl">✅</div>
              <div>
                <div className="text-3xl font-bold text-success">100%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Conformidade com prazos legais
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsContent;
