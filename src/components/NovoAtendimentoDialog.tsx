import { useState } from 'react';
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

interface NovoAtendimentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockAlunos = [
  'Ana Carolina Souza',
  'Pedro Henrique Silva',
  'Maria Julia Santos',
  'Lucas Martins Costa',
];

const tiposAtendimento = [
  'Reunião Pedagógica',
  'Avaliação Individual',
  'Atendimento com Família',
  'Reunião Multidisciplinar',
  'Acompanhamento de Objetivos',
  'Outros',
];

const profissionais = [
  'Professor regente',
  'Coordenador pedagógico',
  'Psicopedagogo',
  'Família',
  'Professor de apoio',
  'Terapeuta ocupacional',
  'Fonoaudiólogo',
];

export const NovoAtendimentoDialog = ({ open, onOpenChange }: NovoAtendimentoDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [selectedProfissionais, setSelectedProfissionais] = useState<string[]>([]);
  const [lembretes, setLembretes] = useState<string[]>([]);

  const handleProfissionalToggle = (prof: string) => {
    setSelectedProfissionais(prev =>
      prev.includes(prof) ? prev.filter(p => p !== prof) : [...prev, prof]
    );
  };

  const handleLembreteToggle = (lembrete: string) => {
    setLembretes(prev =>
      prev.includes(lembrete) ? prev.filter(l => l !== lembrete) : [...prev, lembrete]
    );
  };

  const handleSalvar = () => {
    // Implementar lógica de salvamento
    console.log('Salvando atendimento...');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Atendimento</DialogTitle>
          <DialogDescription>
            Preencha os dados para agendar um novo atendimento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Aluno */}
          <div className="space-y-2">
            <Label htmlFor="aluno">Aluno *</Label>
            <Select>
              <SelectTrigger id="aluno">
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {mockAlunos.map((aluno) => (
                  <SelectItem key={aluno} value={aluno}>
                    {aluno}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Atendimento */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Atendimento *</Label>
            <Select>
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposAtendimento.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label>Data *</Label>
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
              <Input id="horario-inicio" type="time" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horario-fim">Horário Fim *</Label>
              <Input id="horario-fim" type="time" />
            </div>
          </div>

          {/* Profissionais Envolvidos */}
          <div className="space-y-2">
            <Label>Profissionais Envolvidos</Label>
            <div className="border rounded-md p-4 space-y-3 max-h-48 overflow-y-auto">
              {profissionais.map((prof) => (
                <div key={prof} className="flex items-center space-x-2">
                  <Checkbox
                    id={prof}
                    checked={selectedProfissionais.includes(prof)}
                    onCheckedChange={() => handleProfissionalToggle(prof)}
                  />
                  <label
                    htmlFor={prof}
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
            <Input id="local" placeholder="Ex: Sala de coordenação, Online" />
          </div>

          {/* Objetivos */}
          <div className="space-y-2">
            <Label htmlFor="objetivos">Objetivos do Atendimento *</Label>
            <Textarea
              id="objetivos"
              placeholder="Descreva os objetivos e pauta deste atendimento"
              className="min-h-24"
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações adicionais (opcional)"
              className="min-h-20"
            />
          </div>

          {/* Lembretes */}
          <div className="space-y-2">
            <Label>Enviar Lembrete</Label>
            <div className="space-y-2">
              {['1 dia antes', '2 horas antes', '30 minutos antes'].map((lembrete) => (
                <div key={lembrete} className="flex items-center space-x-2">
                  <Checkbox
                    id={lembrete}
                    checked={lembretes.includes(lembrete)}
                    onCheckedChange={() => handleLembreteToggle(lembrete)}
                  />
                  <label
                    htmlFor={lembrete}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {lembrete}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
