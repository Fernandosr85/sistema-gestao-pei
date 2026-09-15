import { Activity, Brain, Users } from 'lucide-react';
import ExecutiveSummary from '@/components/ExecutiveSummary';
import ExpandedComplexityCard from '@/components/ExpandedComplexityCard';
import ResourcesPanel from '@/components/ResourcesPanel';
import QualityIndicators from '@/components/QualityIndicators';
import AlertsPanel from '@/components/AlertsPanel';
import BenchmarkingTable from '@/components/BenchmarkingTable';

const ComplexityAnalysisContent = () => {
  const healthChallenges = [
    {
      label: 'TDAH',
      count: 12,
      comPEI: '12/12 (100%)',
      comMedicacao: 8,
      status: 'error' as const
    },
    {
      label: 'Autismo',
      count: 8,
      nivel1: 3,
      nivel2: 4,
      nivel3: 1,
      comApoio: '6/8',
      status: 'warning' as const
    },
    {
      label: 'Dislexia',
      count: 6,
      comAdaptacoes: '6/6 (100%)',
      usandoCAA: 2,
      status: 'warning' as const
    }
  ];

  const educationalChallenges = [
    {
      label: 'Leitura',
      value: 45,
      abaixoMeta: 22,
      naMeta: 15,
      acimaMeta: 8,
      status: 'error' as const
    },
    {
      label: 'Matemática',
      value: 35,
      abaixoMeta: 18,
      naMeta: 20,
      acimaMeta: 7,
      status: 'warning' as const
    },
    {
      label: 'Escrita',
      value: 28,
      abaixoMeta: 25,
      naMeta: 15,
      acimaMeta: 5,
      status: 'warning' as const
    },
    {
      label: 'Ciências',
      value: 62,
      abaixoMeta: 8,
      naMeta: 22,
      acimaMeta: 15,
      status: 'success' as const
    }
  ];

  const socialChallenges = [
    {
      label: 'Socialização',
      value: 30,
      baixa: 14,
      media: 18,
      alta: 13,
      status: 'warning' as const
    },
    {
      label: 'Comunicação',
      value: 50,
      naoVerbal: 4,
      verbalLimitada: 8,
      usaCAA: 10,
      status: 'error' as const
    },
    {
      label: 'Autorregulação',
      value: 42,
      crisesFrequentes: 9,
      crisesOcasionais: 15,
      status: 'warning' as const
    },
    {
      label: 'Autonomia',
      value: 68,
      baixa: 5,
      media: 20,
      alta: 20,
      status: 'success' as const
    }
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Gestão &gt; Análise
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Análise de Complexidade Integrada
        </h2>
        <p className="text-sm text-muted-foreground">
          Dados fixos de demonstração
        </p>
      </div>

      {/* Executive Summary */}
      <ExecutiveSummary />

      {/* Expanded Complexity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExpandedComplexityCard
          title="Desafios de Saúde"
          icon={Activity}
          bgColor="bg-red-50 dark:bg-red-950/20"
          borderColor="border-l-destructive"
          type="health"
          items={healthChallenges}
        />

        <ExpandedComplexityCard
          title="Desafios Educacionais"
          icon={Brain}
          bgColor="bg-blue-50 dark:bg-blue-950/20"
          borderColor="border-l-primary"
          type="educational"
          items={educationalChallenges}
        />

        <ExpandedComplexityCard
          title="Desafios Sociais"
          icon={Users}
          bgColor="bg-green-50 dark:bg-green-950/20"
          borderColor="border-l-success"
          type="social"
          items={socialChallenges}
        />
      </div>

      {/* Resources Panel */}
      <ResourcesPanel />

      {/* Quality Indicators */}
      <QualityIndicators />

      {/* Alerts Panel */}
      <AlertsPanel />

      {/* Benchmarking */}
      <BenchmarkingTable />
    </div>
  );
};

export default ComplexityAnalysisContent;
