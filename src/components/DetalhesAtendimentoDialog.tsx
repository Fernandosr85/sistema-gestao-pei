import type { Atendimento } from '@/types';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Users, Target, FileText, Edit, CheckCircle, Calendar as CalendarIcon, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NovoAtendimentoDialog } from '@/components/NovoAtendimentoDialog';
import { useToast } from '@/hooks/use-toast';
import { isOpenAppointment } from '@/lib/appointment';
import { formatLocalDate } from '@/lib/date';
import { studentNameOf } from '@/lib/metrics';
import { describeSaveLocation } from '@/store/saveFeedback';
import { useDemoStore } from '@/store/useDemoStore';

interface DetalhesAtendimentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  atendimento: Atendimento | null;
}

const statusBadgeVariant = {
  agendado: 'default',
  realizado: 'secondary',
  cancelado: 'destructive',
  remarcado: 'outline',
} as const;

export const DetalhesAtendimentoDialog = ({ open, onOpenChange, atendimento }: DetalhesAtendimentoDialogProps) => {
  const { state, dispatch } = useDemoStore();
  const { toast } = useToast();
  // The prop is the record as it was when clicked; the store has its current status and minutes.
  const current = state.appointments.find((item) => item.id === atendimento.id) ?? atendimento;
  const [ata, setAta] = useState(current.ata || '');
  const [isEditingAta, setIsEditingAta] = useState(false);
  const [ataError, setAtaError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'edit' | 'reschedule'>('edit');
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const openForm = (mode: 'edit' | 'reschedule') => {
    setFormMode(mode);
    setFormOpen(true);
  };

  const handleMarcarRealizado = () => {
    const result = dispatch({ type: 'appointment/markDone', id: current.id });
    toast({
      title: 'Atendimento marcado como realizado',
      description: `Registre a ata abaixo. ${describeSaveLocation(result)}`,
    });
    setIsEditingAta(true);
  };

  const handleSalvarAta = () => {
    const minutes = ata.trim();
    if (!minutes) {
      setAtaError('Escreva o resumo antes de salvar a ata.');
      return;
    }
    const result = dispatch({ type: 'appointment/saveMinutes', id: current.id, minutes });
    toast({ title: 'Ata salva', description: describeSaveLocation(result) });
    setAtaError('');
    setIsEditingAta(false);
  };

  const handleCancelar = () => {
    const result = dispatch({ type: 'appointment/cancel', id: current.id });
    toast({
      title: 'Atendimento cancelado',
      description: `O registro continua na agenda. ${describeSaveLocation(result)}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Atendimento</span>
            <Badge variant={statusBadgeVariant[current.status as keyof typeof statusBadgeVariant]}>
              {current.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Visualize e gerencie as informações do atendimento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações do Aluno */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Aluno
            </h3>
            <Link to={`/alunos/${current.studentId}`} className="text-primary hover:underline">
              {studentNameOf(state, current.studentId)}
            </Link>
          </div>

          {/* Tipo e Horário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Data</span>
              </div>
              <p>{formatLocalDate(current.data, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Horário</span>
              </div>
              <p>{current.horarioInicio} - {current.horarioFim}</p>
            </div>
          </div>

          {/* Local e Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Local</span>
              </div>
              <p>{current.local}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Tipo</span>
              </div>
              <Badge variant="outline">{current.tipo}</Badge>
            </div>
          </div>

          {/* Profissionais Envolvidos */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Profissionais Envolvidos
            </h3>
            <div className="flex flex-wrap gap-2">
              {current.profissionais.map((prof: string, idx: number) => (
                <Badge key={idx} variant="secondary">
                  {prof}
                </Badge>
              ))}
            </div>
          </div>

          {/* Objetivos */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Objetivos do Atendimento
            </h3>
            <p className="text-sm text-muted-foreground bg-muted p-4 rounded-md">
              {current.objetivos}
            </p>
          </div>

          {/* Ata/Resumo */}
          {(current.status === 'realizado' || isEditingAta) && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Ata/Resumo da Reunião
              </h3>
              {isEditingAta || !current.ata ? (
                <>
                  <Textarea
                    value={ata}
                    onChange={(e) => setAta(e.target.value)}
                    placeholder="Registre aqui o resumo do atendimento, decisões tomadas e próximos passos..."
                    className="min-h-32"
                    aria-label="Ata do atendimento"
                  />
                  {ataError && (
                    <p role="alert" className="text-sm text-destructive">
                      {ataError}
                    </p>
                  )}
                  <Button onClick={handleSalvarAta} className="w-full">
                    Salvar Ata
                  </Button>
                </>
              ) : (
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{current.ata}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      setAta(current.ata || '');
                      setIsEditingAta(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Ata
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          {isOpenAppointment(current.status) && (
            <>
              <Button variant="default" onClick={handleMarcarRealizado}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Realizado
              </Button>
              <Button variant="outline" onClick={() => openForm('reschedule')}>
                <CalendarIcon className="h-4 w-4 mr-2" />
                Remarcar
              </Button>
            </>
          )}
          {current.status === 'cancelado' ? (
            <p className="text-sm text-muted-foreground">
              Atendimento cancelado. O registro é mantido na agenda e não pode mais ser alterado.
            </p>
          ) : (
            <Button variant="outline" onClick={() => openForm('edit')}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          {isOpenAppointment(current.status) && (
            <Button variant="destructive" className="ml-auto" onClick={() => setConfirmCancelOpen(true)}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancelar atendimento
            </Button>
          )}
        </div>

        <NovoAtendimentoDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          appointment={current}
          mode={formMode}
        />

        <AlertDialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar este atendimento?</AlertDialogTitle>
              <AlertDialogDescription>
                {studentNameOf(state, current.studentId)}, {formatLocalDate(current.data)} às {current.horarioInicio}. O atendimento passa a
                constar como cancelado; o registro não é excluído e continua na agenda.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Voltar</AlertDialogCancel>
              <AlertDialogAction className={buttonVariants({ variant: 'destructive' })} onClick={handleCancelar}>
                Cancelar atendimento
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};
