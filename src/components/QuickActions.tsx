import { FileText, ClipboardCheck, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GenerateReportDialog } from './GenerateReportDialog';
import { NewAssessmentDialog } from './NewAssessmentDialog';
import { CoordinationDashboard } from './CoordinationDashboard';

const QuickActions = () => {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gerar Relatório */}
          <Button
            onClick={() => setReportDialogOpen(true)}
            className="h-auto flex-col gap-4 p-6 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
          >
            <FileText className="h-12 w-12" />
            <span className="text-lg font-semibold">Gerar Relatório</span>
          </Button>

          {/* Nova Avaliação */}
          <Button
            onClick={() => setAssessmentDialogOpen(true)}
            className="h-auto flex-col gap-4 p-6 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
          >
            <ClipboardCheck className="h-12 w-12" />
            <span className="text-lg font-semibold">Nova Avaliação</span>
          </Button>

          {/* Dashboard Coordenação */}
          <Button
            onClick={() => setDashboardOpen(true)}
            className="h-auto flex-col gap-4 p-6 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
          >
            <BarChart3 className="h-12 w-12" />
            <span className="text-lg font-semibold">Dashboard Coordenação</span>
          </Button>
        </div>
      </div>

      <GenerateReportDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen} />
      <NewAssessmentDialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen} />
      <CoordinationDashboard open={dashboardOpen} onOpenChange={setDashboardOpen} />
    </>
  );
};

export default QuickActions;
