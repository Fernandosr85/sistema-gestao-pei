import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BarChart3, AlertTriangle, TrendingUp, FileText, Users, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ComplexityAnalysisContent from '@/components/gestao/ComplexityAnalysisContent';
import ReportsContent from '@/components/gestao/ReportsContent';
import VisaoGeralContent from '@/components/gestao/VisaoGeralContent';
import AlertasRiscosContent from '@/components/gestao/AlertasRiscosContent';
import EquipeContent from '@/components/gestao/EquipeContent';
import OrcamentoContent from '@/components/gestao/OrcamentoContent';

const Gestao = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab') || 'visao-geral';
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground">🏫 Painel de Gestão - SESI SP</h1>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          <p className="text-muted-foreground">
            Bom dia! Sistema integrado de gestão educacional inclusiva
          </p>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-6">
            <TabsTrigger value="visao-geral" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="alertas" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertas e Riscos
            </TabsTrigger>
            <TabsTrigger value="analise" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Análise
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="gap-2">
              <FileText className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="equipe" className="gap-2">
              <Users className="h-4 w-4" />
              Equipe
            </TabsTrigger>
            <TabsTrigger value="orcamento" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Orçamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="mt-0">
            <VisaoGeralContent />
          </TabsContent>

          <TabsContent value="alertas" className="mt-0">
            <AlertasRiscosContent />
          </TabsContent>

          <TabsContent value="analise" className="mt-0">
            <ComplexityAnalysisContent />
          </TabsContent>

          <TabsContent value="relatorios" className="mt-0">
            <ReportsContent />
          </TabsContent>

          <TabsContent value="equipe" className="mt-0">
            <EquipeContent />
          </TabsContent>

          <TabsContent value="orcamento" className="mt-0">
            <OrcamentoContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Gestao;
