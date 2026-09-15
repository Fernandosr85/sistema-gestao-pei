import { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { classOptions } from '@/lib/report';
import type { ReportKind } from '@/lib/report';
import { useDemoStore } from '@/store/useDemoStore';

interface GenerateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateReportDialog({ open, onOpenChange }: GenerateReportDialogProps) {
  const navigate = useNavigate();
  const { state } = useDemoStore();
  const idPrefix = useId();
  const [reportKind, setReportKind] = useState<ReportKind>('student');
  const [studentId, setStudentId] = useState('');
  const [classKey, setClassKey] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  // Each opening starts a fresh selection.
  useEffect(() => {
    if (!open) return;
    setReportKind('student');
    setStudentId('');
    setClassKey('');
    setStartDate('');
    setEndDate('');
    setErrors([]);
  }, [open]);

  const classes = classOptions(state.students);
  const fieldId = (name: string) => `${idPrefix}-${name}`;

  const handleGenerate = () => {
    const problems: string[] = [];
    if (reportKind === 'student' && !state.students.some((student) => student.id === studentId)) {
      problems.push('Selecione o estudante.');
    }
    if (reportKind === 'class' && !classes.some((option) => option.key === classKey)) {
      problems.push('Selecione a turma.');
    }
    if (startDate && endDate && endDate < startDate) {
      problems.push('A data final precisa ser igual ou posterior à data inicial.');
    }
    if (problems.length > 0) {
      setErrors(problems);
      return;
    }

    const params = new URLSearchParams({ kind: reportKind });
    if (reportKind === 'student') params.set('student', studentId);
    else params.set('class', classKey);
    if (startDate) params.set('from', startDate);
    if (endDate) params.set('to', endDate);
    onOpenChange(false);
    navigate(`/relatorio?${params.toString()}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerar Relatório</DialogTitle>
          <DialogDescription>
            O relatório é montado com os registros deste navegador e abre numa página pronta para impressão.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tipo de Relatório */}
          <div className="space-y-3">
            <p id={fieldId('tipo')} className="text-sm font-medium leading-none">
              Tipo de Relatório
            </p>
            <RadioGroup
              value={reportKind}
              onValueChange={(value) => {
                setReportKind(value as ReportKind);
                setErrors([]);
              }}
              aria-labelledby={fieldId('tipo')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id={fieldId('tipo-estudante')} />
                <Label htmlFor={fieldId('tipo-estudante')} className="font-normal cursor-pointer">
                  Relatório individual do estudante
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="class" id={fieldId('tipo-turma')} />
                <Label htmlFor={fieldId('tipo-turma')} className="font-normal cursor-pointer">
                  Relatório da turma
                </Label>
              </div>
            </RadioGroup>
          </div>

          {reportKind === 'student' ? (
            <div className="space-y-2">
              <Label htmlFor={fieldId('estudante')}>Estudante *</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger id={fieldId('estudante')}>
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
          ) : (
            <div className="space-y-2">
              <Label htmlFor={fieldId('turma')}>Turma *</Label>
              <Select value={classKey} onValueChange={setClassKey}>
                <SelectTrigger id={fieldId('turma')}>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Período */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={fieldId('inicio')}>Data inicial</Label>
                <Input
                  id={fieldId('inicio')}
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  aria-describedby={fieldId('periodo-ajuda')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={fieldId('fim')}>Data final</Label>
                <Input
                  id={fieldId('fim')}
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  aria-describedby={fieldId('periodo-ajuda')}
                />
              </div>
            </div>
            <p id={fieldId('periodo-ajuda')} className="text-xs text-muted-foreground">
              Deixe em branco para incluir todo o período registrado.
            </p>
          </div>

          {/* Formato */}
          <div className="space-y-1 rounded-md border p-3">
            <p className="text-sm font-medium">Formato</p>
            <p className="text-sm text-muted-foreground">
              Imprimir ou salvar como PDF pelo navegador. Na janela de impressão, escolha a impressora ou a opção de
              salvar como PDF.
            </p>
          </div>
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
          <Button onClick={handleGenerate} className="gap-2">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Gerar relatório
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
