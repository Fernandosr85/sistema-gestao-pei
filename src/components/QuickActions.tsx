import { Users, ClipboardList, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NewAssessmentDialog } from './NewAssessmentDialog';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Novo Cadastro */}
          <Button
            onClick={() => navigate('/alunos/novo')}
            className="h-auto flex-col gap-4 p-6 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
          >
            <Users className="h-12 w-12" />
            <span className="text-lg font-semibold">Novo Cadastro</span>
          </Button>

          {/* Nova Observação */}
          <Button
            onClick={() => navigate('/observacoes/nova')}
            className="h-auto flex-col gap-4 p-6 bg-gradient-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
          >
            <ClipboardList className="h-12 w-12" />
            <span className="text-lg font-semibold">Nova Observação</span>
          </Button>

          {/* Nova Avaliação */}
          <Button
            onClick={() => setAssessmentDialogOpen(true)}
            className="h-auto flex-col gap-4 p-6 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
          >
            <ClipboardCheck className="h-12 w-12" />
            <span className="text-lg font-semibold">Nova Avaliação</span>
          </Button>
        </div>
      </div>

      <NewAssessmentDialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen} />
    </>
  );
};

export default QuickActions;
