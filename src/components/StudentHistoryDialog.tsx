import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { History } from 'lucide-react';

interface StudentHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
}

/**
 * There is no academic history model yet. The fixed timeline this dialog used to show belonged
 * to one fictitious student, medical report and doctor included, and appeared under every
 * student's name, so the dialog states that nothing is recorded instead of showing an example.
 */
export const StudentHistoryDialog = ({ open, onOpenChange, studentName }: StudentHistoryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">HISTÓRICO ACADÊMICO - {studentName.toUpperCase()}</DialogTitle>
          <DialogDescription>Sem histórico registrado para este estudante.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-6 text-center text-sm text-muted-foreground">
          <History className="h-10 w-10 opacity-50" aria-hidden="true" />
          <p>
            O sistema ainda não registra eventos de histórico acadêmico, como ingresso, revisões de PEI e
            progressões. As observações e as avaliações do estudante aparecem na ficha, e o relatório
            imprimível do Dashboard reúne observações, atendimentos e avaliações.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
