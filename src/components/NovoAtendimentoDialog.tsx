import { useEffect, useId, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { appointmentTypes, isOpenAppointment } from '@/lib/appointment';
import { formatLocalDate, parseLocalDate, toLocalISODate } from '@/lib/date';
import { createId } from '@/lib/id';
import { describeSaveLocation } from '@/store/saveFeedback';
import { useDemoStore } from '@/store/useDemoStore';
import type { AppointmentType, Atendimento } from '@/types';

interface NovoAtendimentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Existing appointment: `edit` changes its details, `reschedule` its date and time. Without it, a new one is created. */
  appointment?: Atendimento;
  mode?: 'edit' | 'reschedule';
}

const profissionais = [
  'Professor regente',
  'Coordenador pedagógico',
  'Psicopedagogo',
  'Família',
  'Professor de apoio',
  'Terapeuta ocupacional',
  'Fonoaudiólogo',
];

export const NovoAtendimentoDialog = ({ open, onOpenChange, appointment, mode = 'edit' }: NovoAtendimentoDialogProps) => {
  const { state, dispatch } = useDemoStore();
  const { toast } = useToast();
  const idPrefix = useId();
  const editing = appointment ? mode : null;
  const showDetails = editing !== 'reschedule';
  const showSchedule = editing !== 'edit';
  const [studentId, setStudentId] = useState('');
  const [tipo, setTipo] = useState<AppointmentType | ''>('');
  const [date, setDate] = useState<Date>();
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  const [selectedProfissionais, setSelectedProfissionais] = useState<string[]>([]);
  const [local, setLocal] = useState('');
  const [objetivos, setObjetivos] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  // Each opening starts from the appointment being changed, or from an empty form.
  useEffect(() => {
    if (!open) return;
    setStudentId(appointment?.studentId ?? '');
    setTipo(appointment?.tipo ?? '');
    setDate(appointment ? parseLocalDate(appointment.data) ?? undefined : undefined);
    setHorarioInicio(appointment?.horarioInicio ?? '');
    setHorarioFim(appointment?.horarioFim ?? '');
    setSelectedProfissionais(appointment?.profissionais ?? []);
    setLocal(appointment?.local ?? '');
    setObjetivos(appointment?.objetivos ?? '');
    setObservacoes(appointment?.observacoes ?? '');
    setErrors([]);
  }, [open, appointment]);

  // Names already on the appointment stay listed, so editing never hides who was involved.
  const profissionalOptions = appointment
    ? Array.from(new Set([...profissionais, ...appointment.profissionais]))
    : profissionais;

  const handleProfissionalToggle = (prof: string) => {
    setSelectedProfissionais(prev =>
      prev.includes(prof) ? prev.filter(p => p !== prof) : [...prev, prof]
    );
  };

  const handleSalvar = () => {
    const student = state.students.find((item) => item.id === studentId);
    const problems: string[] = [];
    if (showDetails) {
      if (!student) problems.push('Selecione o aluno.');
      if (!tipo) problems.push('Selecione o tipo de atendimento.');
    }
    if (showSchedule) {
      if (!date) problems.push('Selecione a data.');
      if (!horarioInicio || !horarioFim) {
        problems.push('Informe o horário de início e o de fim.');
      } else if (horarioFim <= horarioInicio) {
        problems.push('O horário de fim precisa ser depois do início.');
      }
    }
    if (showDetails && !objetivos.trim()) problems.push('Descreva os objetivos do atendimento.');
    if (
      editing === 'reschedule' &&
      appointment &&
      date &&
      toLocalISODate(date) === appointment.data &&
      horarioInicio === appointment.horarioInicio &&
      horarioFim === appointment.horarioFim
    ) {
      problems.push('Escolha outra data ou outro horário para remarcar.');
    }

    if (problems.length > 0) {
      setErrors(problems);
      return;
    }

    if (editing === 'reschedule' && appointment && date) {
      const result = dispatch({
        type: 'appointment/update',
        appointment: { ...appointment, data: toLocalISODate(date), horarioInicio, horarioFim, status: 'remarcado' },
      });
      toast({
        title: 'Atendimento remarcado',
        description: `${appointment.aluno}, ${format(date, 'dd/MM/yyyy')} às ${horarioInicio}. ${describeSaveLocation(result)}`,
      });
      onOpenChange(false);
      return;
    }

    if (!student || !tipo) return;

    if (editing === 'edit' && appointment) {
      const result = dispatch({
        type: 'appointment/update',
        appointment: {
          ...appointment,
          studentId: student.id,
          aluno: student.nomeCompleto,
          tipo,
          profissionais: selectedProfissionais,
          local: local.trim() || 'A definir',
          objetivos: objetivos.trim(),
          observacoes: observacoes.trim() || undefined,
        },
      });
      toast({
        title: 'Atendimento atualizado',
        description: `${student.nomeCompleto}. ${describeSaveLocation(result)}`,
      });
      onOpenChange(false);
      return;
    }

    if (!date) return;

    const newAppointment: Atendimento = {
      id: createId('atd'),
      studentId: student.id,
      aluno: student.nomeCompleto,
      tipo,
      data: toLocalISODate(date),
      horarioInicio,
      horarioFim,
      status: 'agendado',
      profissionais: selectedProfissionais,
      local: local.trim() || 'A definir',
      objetivos: objetivos.trim(),
      ...(observacoes.trim() ? { observacoes: observacoes.trim() } : {}),
    };
    const result = dispatch({ type: 'appointment/add', appointment: newAppointment });
    toast({
      title: 'Atendimento agendado',
      description: `${student.nomeCompleto}, ${format(date, 'dd/MM/yyyy')} às ${horarioInicio}. ${describeSaveLocation(result)}`,
    });
    onOpenChange(false);
  };

  const title =
    editing === 'reschedule' ? 'Remarcar Atendimento' : editing === 'edit' ? 'Editar Atendimento' : 'Novo Atendimento';
  const description =
    editing === 'reschedule'
      ? 'Escolha a nova data e o novo horário. O atendimento passa a constar como remarcado.'
      : editing === 'edit'
        ? `Altere os dados do atendimento. ${
            appointment && isOpenAppointment(appointment.status)
              ? 'Para mudar data ou horário, use Remarcar.'
              : 'Data e horário não são alterados aqui.'
          }`
        : 'Preencha os dados para agendar um novo atendimento';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {editing === 'reschedule' && appointment && (
            <p className="rounded-md bg-muted p-3 text-sm">
              <strong>{appointment.aluno}</strong> · {appointment.tipo}
              <br />
              Data atual: {formatLocalDate(appointment.data)}, {appointment.horarioInicio} - {appointment.horarioFim}
            </p>
          )}

          {showDetails && (
            <>
              {/* Aluno */}
              <div className="space-y-2">
                <Label htmlFor="aluno">Aluno *</Label>
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger id="aluno">
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.nomeCompleto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Atendimento */}
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Atendimento *</Label>
                <Select value={tipo} onValueChange={(value) => setTipo(value as AppointmentType)}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((appointmentType) => (
                      <SelectItem key={appointmentType} value={appointmentType}>
                        {appointmentType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {showSchedule && (
            <>
              {/* Data */}
              <div className="space-y-2">
                <Label>{editing === 'reschedule' ? 'Nova data *' : 'Data *'}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP', { locale: ptBR }) : 'Selecione uma data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      defaultMonth={date}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Horários */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horario-inicio">Horário Início *</Label>
                  <Input
                    id="horario-inicio"
                    type="time"
                    value={horarioInicio}
                    onChange={(event) => setHorarioInicio(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario-fim">Horário Fim *</Label>
                  <Input
                    id="horario-fim"
                    type="time"
                    value={horarioFim}
                    onChange={(event) => setHorarioFim(event.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {showDetails && (
            <>
              {/* Profissionais Envolvidos */}
              <div className="space-y-2">
                <Label>Profissionais Envolvidos</Label>
                <div className="border rounded-md p-4 space-y-3 max-h-48 overflow-y-auto">
                  {profissionalOptions.map((prof, index) => (
                    <div key={prof} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${idPrefix}-profissional-${index}`}
                        checked={selectedProfissionais.includes(prof)}
                        onCheckedChange={() => handleProfissionalToggle(prof)}
                      />
                      <label
                        htmlFor={`${idPrefix}-profissional-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {prof}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local */}
              <div className="space-y-2">
                <Label htmlFor="local">Local</Label>
                <Input
                  id="local"
                  placeholder="Ex: Sala de coordenação, Online"
                  value={local}
                  onChange={(event) => setLocal(event.target.value)}
                />
              </div>

              {/* Objetivos */}
              <div className="space-y-2">
                <Label htmlFor="objetivos">Objetivos do Atendimento *</Label>
                <Textarea
                  id="objetivos"
                  placeholder="Descreva os objetivos e pauta deste atendimento"
                  className="min-h-24"
                  value={objetivos}
                  onChange={(event) => setObjetivos(event.target.value)}
                />
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações adicionais (opcional)"
                  className="min-h-20"
                  value={observacoes}
                  onChange={(event) => setObservacoes(event.target.value)}
                />
              </div>
            </>
          )}

          {!editing && (
            /* Lembretes */
            <div className="space-y-2">
              <Label>Enviar Lembrete</Label>
              <div className="space-y-2">
                {['1 dia antes', '2 horas antes', '30 minutos antes'].map((lembrete, index) => (
                  <div key={lembrete} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${idPrefix}-lembrete-${index}`}
                      checked={false}
                      disabled
                      aria-describedby="lembretes-indisponiveis"
                    />
                    <label
                      htmlFor={`${idPrefix}-lembrete-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {lembrete}
                    </label>
                  </div>
                ))}
              </div>
              <p id="lembretes-indisponiveis" className="text-xs text-muted-foreground">
                Lembretes não são enviados neste protótipo.
              </p>
            </div>
          )}
        </div>

        {errors.length > 0 && (
          <div role="alert" className="rounded-md border border-destructive/50 p-3 text-sm text-destructive">
            <ul className="list-disc space-y-1 pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar}>
            {editing === 'reschedule' ? 'Remarcar' : editing === 'edit' ? 'Salvar alterações' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
