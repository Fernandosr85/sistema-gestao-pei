import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download } from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useDemoStore } from '@/store/useDemoStore';

interface GenerateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateReportDialog({ open, onOpenChange }: GenerateReportDialogProps) {
  const { state } = useDemoStore();
  const [reportType, setReportType] = useState('individual');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [complexity, setComplexity] = useState('all');
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleGenerate = () => {
    if (!startDate || !endDate) {
      toast.error('Por favor, selecione o período');
      return;
    }
    
    if (reportType === 'individual' && !selectedStudent) {
      toast.error('Por favor, selecione um estudante');
      return;
    }

    toast.success('Relatório gerado com sucesso!', {
      description: `O relatório será baixado em formato ${exportFormat.toUpperCase()}`
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerar Relatório</DialogTitle>
          <DialogDescription>
            Selecione o tipo de relatório e os filtros desejados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tipo de Relatório */}
          <div className="space-y-3">
            <Label>Tipo de Relatório</Label>
            <RadioGroup value={reportType} onValueChange={setReportType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual" className="font-normal cursor-pointer">
                  Relatório Individual do Estudante
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="class" id="class" />
                <Label htmlFor="class" className="font-normal cursor-pointer">
                  Relatório da Turma
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pei" id="pei" />
                <Label htmlFor="pei" className="font-normal cursor-pointer">
                  Relatório de Implementação do PEI
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="evolution" id="evolution" />
                <Label htmlFor="evolution" className="font-normal cursor-pointer">
                  Relatório de Evolução Trimestral
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="accessibility" id="accessibility" />
                <Label htmlFor="accessibility" className="font-normal cursor-pointer">
                  Relatório de Acessibilidade e Recursos
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-2 gap-4">
            {/* Período */}
            <div className="space-y-2">
              <Label>Data Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? formatDate(startDate, "PPP", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? formatDate(endDate, "PPP", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Estudante */}
          {reportType === 'individual' && (
            <div className="space-y-2">
              <Label>Estudante</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estudante" />
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
          )}

          {/* Turma */}
          <div className="space-y-2">
            <Label>Turma</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="1ano-a">1º Ano A</SelectItem>
                <SelectItem value="2ano-b">2º Ano B</SelectItem>
                <SelectItem value="3ano-c">3º Ano C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Complexidade */}
          <div className="space-y-2">
            <Label>Tipo de Complexidade</Label>
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="health">Saúde</SelectItem>
                <SelectItem value="educational">Educacional</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Formato de Exportação */}
          <div className="space-y-2">
            <Label>Formato de Exportação</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="word">Word</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleGenerate} className="gap-2">
            <Download className="h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
