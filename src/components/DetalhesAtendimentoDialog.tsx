import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, Users, Target, FileText, Edit, CheckCircle, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DetalhesAtendimentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  atendimento: any;
}

const statusBadgeVariant = {
  agendado: 'default',
  realizado: 'secondary',
  cancelado: 'destructive',
  remarcado: 'outline',
} as const;

export const DetalhesAtendimentoDialog = ({ open, onOpenChange, atendimento }: DetalhesAtendimentoDialogProps) => {
  const [ata, setAta] = useState(atendimento.ata || '');
  const [isEditingAta, setIsEditingAta] = useState(false);

  const handleMarcarRealizado = () => {
    console.log('Marcando como realizado...');
    setIsEditingAta(true);
  };

  const handleSalvarAta = () => {
    console.log('Salvando ata:', ata);
    setIsEditingAta(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Atendimento</span>
            <Badge variant={statusBadgeVariant[atendimento.status as keyof typeof statusBadgeVariant]}>
              {atendimento.status}
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
            <Link to={`/alunos/${atendimento.id}`} className="text-primary hover:underline">
              {atendimento.aluno}
            </Link>
          </div>

          {/* Tipo e Horário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Data</span>
              </div>
              <p>{new Date(atendimento.data).toLocaleDateString('pt-BR', { 
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
              <p>{atendimento.horarioInicio} - {atendimento.horarioFim}</p>
            </div>
          </div>

          {/* Local e Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Local</span>
              </div>
              <p>{atendimento.local}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Tipo</span>
              </div>
              <Badge variant="outline">{atendimento.tipo}</Badge>
            </div>
          </div>

          {/* Profissionais Envolvidos */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Profissionais Envolvidos
            </h3>
            <div className="flex flex-wrap gap-2">
              {atendimento.profissionais.map((prof: string, idx: number) => (
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
              {atendimento.objetivos}
            </p>
          </div>

          {/* Ata/Resumo */}
          {(atendimento.status === 'realizado' || isEditingAta) && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Ata/Resumo da Reunião
              </h3>
              {isEditingAta || !atendimento.ata ? (
                <>
                  <Textarea
                    value={ata}
                    onChange={(e) => setAta(e.target.value)}
                    placeholder="Registre aqui o resumo do atendimento, decisões tomadas e próximos passos..."
                    className="min-h-32"
                  />
                  <Button onClick={handleSalvarAta} className="w-full">
                    Salvar Ata
                  </Button>
                </>
              ) : (
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{atendimento.ata}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setIsEditingAta(true)}
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
          {atendimento.status === 'agendado' && (
            <>
              <Button variant="default" onClick={handleMarcarRealizado}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Realizado
              </Button>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Remarcar
              </Button>
            </>
          )}
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" className="ml-auto">
            <Trash2 className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
