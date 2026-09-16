import { useId, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateAge } from '@/lib/date';
import { studentGrades, studentStatusOptions, supportLevelOptions } from '@/lib/student';
import { describeSaveLocation } from '@/store/saveFeedback';
import { useDemoStore } from '@/store/useDemoStore';
import type { Student, StudentStatus } from '@/types';

interface EditarCadastroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
}

interface StudentFormValues {
  nomeCompleto: string;
  dataNascimento: string;
  status: StudentStatus;
  matricula: string;
  serie: string;
  turma: string;
  professorResponsavel: string;
  diagnostico: string;
  nivelSuporte: Student['nivelSuporte'];
  responsavelNome: string;
  responsavelParentesco: string;
  responsavelTelefone: string;
  responsavelEmail: string;
}

const toFormValues = (student: Student): StudentFormValues => ({
  nomeCompleto: student.nomeCompleto,
  dataNascimento: student.dataNascimento,
  status: student.status,
  matricula: student.matricula,
  serie: student.serie,
  turma: student.turma,
  professorResponsavel: student.professorResponsavel,
  diagnostico: student.diagnostico,
  nivelSuporte: student.nivelSuporte,
  responsavelNome: student.responsavel.nome,
  responsavelParentesco: student.responsavel.parentesco,
  responsavelTelefone: student.responsavel.telefone,
  responsavelEmail: student.responsavel.email,
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EditarCadastroDialog({ open, onOpenChange, student }: EditarCadastroDialogProps) {
  // A new key on every opening remounts the form from the student being viewed. The content
  // unmounting at close is not enough: it stays mounted until the exit animation ends.
  const [opening, setOpening] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setOpening((count) => count + 1);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <EditarCadastroForm key={opening} student={student} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

interface EditarCadastroFormProps {
  student: Student;
  onClose: () => void;
}

function EditarCadastroForm({ student, onClose }: EditarCadastroFormProps) {
  const { dispatch } = useDemoStore();
  const { toast } = useToast();
  const idPrefix = useId();
  const [values, setValues] = useState<StudentFormValues>(() => toFormValues(student));
  const [errors, setErrors] = useState<string[]>([]);

  const fieldId = (name: string) => `${idPrefix}-${name}`;
  const setValue = <K extends keyof StudentFormValues>(key: K, value: StudentFormValues[K]) =>
    setValues((previous) => ({ ...previous, [key]: value }));

  const grades = studentGrades.includes(student.serie) ? studentGrades : [student.serie, ...studentGrades];
  const initials = student.nomeCompleto.split(' ').map((part) => part[0]).join('').slice(0, 2);

  const handleSave = () => {
    const nomeCompleto = values.nomeCompleto.trim();
    const matricula = values.matricula.trim();
    const turma = values.turma.trim();
    const professorResponsavel = values.professorResponsavel.trim();
    const diagnostico = values.diagnostico.trim();
    const responsavel = {
      nome: values.responsavelNome.trim(),
      parentesco: values.responsavelParentesco.trim(),
      telefone: values.responsavelTelefone.trim(),
      email: values.responsavelEmail.trim(),
    };

    const problems: string[] = [];
    if (nomeCompleto.length < 3) problems.push('Dados pessoais: informe o nome completo.');
    if (!values.dataNascimento) problems.push('Dados pessoais: informe a data de nascimento.');
    if (!diagnostico) problems.push('Saúde: informe o diagnóstico.');
    if (responsavel.nome.length < 3) problems.push('Família: informe o nome do responsável.');
    if (!responsavel.parentesco) problems.push('Família: informe o parentesco.');
    if (responsavel.telefone.length < 10) problems.push('Família: informe o telefone com DDD.');
    if (!EMAIL_PATTERN.test(responsavel.email)) problems.push('Família: informe um e-mail válido.');
    if (!matricula) problems.push('Acadêmico: informe a matrícula.');
    if (!values.serie) problems.push('Acadêmico: selecione a série.');
    if (!turma) problems.push('Acadêmico: informe a turma.');
    if (!professorResponsavel) problems.push('Acadêmico: informe o professor responsável.');

    if (problems.length > 0) {
      setErrors(problems);
      return;
    }

    const updated: Student = {
      ...student,
      nomeCompleto,
      dataNascimento: values.dataNascimento,
      status: values.status,
      matricula,
      serie: values.serie,
      turma,
      professorResponsavel,
      diagnostico,
      nivelSuporte: values.nivelSuporte,
      responsavel,
    };
    const result = dispatch({ type: 'student/update', student: updated });
    toast({
      title: 'Cadastro atualizado',
      description: `${updated.nomeCompleto}. ${describeSaveLocation(result)}`,
    });
    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Editar Cadastro - {student.nomeCompleto}</DialogTitle>
        <DialogDescription>Campos marcados com * são obrigatórios.</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="pessoais" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="saude">Saúde</TabsTrigger>
          <TabsTrigger value="familia">Família</TabsTrigger>
          <TabsTrigger value="academico">Acadêmico</TabsTrigger>
        </TabsList>

        <TabsContent value="pessoais" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor={fieldId('nome')}>Nome Completo *</Label>
            <Input
              id={fieldId('nome')}
              value={values.nomeCompleto}
              onChange={(event) => setValue('nomeCompleto', event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={fieldId('nascimento')}>Data de Nascimento *</Label>
              <Input
                id={fieldId('nascimento')}
                type="date"
                value={values.dataNascimento}
                onChange={(event) => setValue('dataNascimento', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">Idade</p>
              <p className="flex h-10 items-center text-sm text-muted-foreground">
                {values.dataNascimento ? `${calculateAge(values.dataNascimento)} anos` : 'Informe a data de nascimento'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p id={fieldId('status')} className="text-sm font-medium leading-none">Status</p>
            <RadioGroup
              value={values.status}
              onValueChange={(value) => setValue('status', value as StudentStatus)}
              aria-labelledby={fieldId('status')}
            >
              {studentStatusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={fieldId(`status-${option.value}`)} />
                  <Label htmlFor={fieldId(`status-${option.value}`)}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              Nenhum aluno é excluído: quem deixa a escola muda de status e mantém o histórico.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">Foto do Aluno</p>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled aria-describedby="foto-aluno-indisponivel">
                    <Camera className="w-4 h-4 mr-2" />
                    Alterar Foto
                  </Button>
                  <Button variant="outline" size="sm" disabled aria-describedby="foto-aluno-indisponivel">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover
                  </Button>
                </div>
                <p id="foto-aluno-indisponivel" className="text-xs text-muted-foreground">
                  Fotos não são armazenadas neste protótipo.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saude" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor={fieldId('diagnostico')}>Diagnóstico *</Label>
            <Input
              id={fieldId('diagnostico')}
              placeholder="Ex: TEA Nível 2"
              value={values.diagnostico}
              onChange={(event) => setValue('diagnostico', event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={fieldId('nivel-suporte')}>Nível de Suporte *</Label>
            <Select
              value={values.nivelSuporte}
              onValueChange={(value) => setValue('nivelSuporte', value as Student['nivelSuporte'])}
            >
              <SelectTrigger id={fieldId('nivel-suporte')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supportLevelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-muted-foreground">
            Medicação, alergias e médico responsável não são registrados neste sistema.
          </p>

          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">Laudo</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled aria-describedby="laudo-indisponivel">📄 Ver Documento</Button>
              <Button variant="outline" size="sm" disabled aria-describedby="laudo-indisponivel">📎 Anexar Novo</Button>
            </div>
            <p id="laudo-indisponivel" className="text-xs text-muted-foreground">
              Documentos não são armazenados neste protótipo.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="familia" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={fieldId('responsavel-nome')}>Nome do Responsável *</Label>
              <Input
                id={fieldId('responsavel-nome')}
                value={values.responsavelNome}
                onChange={(event) => setValue('responsavelNome', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={fieldId('responsavel-parentesco')}>Parentesco *</Label>
              <Input
                id={fieldId('responsavel-parentesco')}
                placeholder="Ex: Mãe, Pai, Avó"
                value={values.responsavelParentesco}
                onChange={(event) => setValue('responsavelParentesco', event.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={fieldId('responsavel-telefone')}>Telefone *</Label>
              <Input
                id={fieldId('responsavel-telefone')}
                placeholder="(00) 00000-0000"
                value={values.responsavelTelefone}
                onChange={(event) => setValue('responsavelTelefone', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={fieldId('responsavel-email')}>E-mail *</Label>
              <Input
                id={fieldId('responsavel-email')}
                type="email"
                value={values.responsavelEmail}
                onChange={(event) => setValue('responsavelEmail', event.target.value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="academico" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor={fieldId('matricula')}>Matrícula *</Label>
            <Input
              id={fieldId('matricula')}
              value={values.matricula}
              onChange={(event) => setValue('matricula', event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={fieldId('serie')}>Série *</Label>
              <Select value={values.serie} onValueChange={(value) => setValue('serie', value)}>
                <SelectTrigger id={fieldId('serie')}>
                  <SelectValue placeholder="Selecione a série" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={fieldId('turma')}>Turma *</Label>
              <Input
                id={fieldId('turma')}
                value={values.turma}
                onChange={(event) => setValue('turma', event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={fieldId('professor')}>Professor(a) Responsável *</Label>
            <Input
              id={fieldId('professor')}
              value={values.professorResponsavel}
              onChange={(event) => setValue('professorResponsavel', event.target.value)}
            />
          </div>
        </TabsContent>
      </Tabs>

      {errors.length > 0 && (
        <div role="alert" className="rounded-md border border-destructive/50 p-3 text-sm text-destructive">
          <ul className="list-disc space-y-1 pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </div>
    </>
  );
}
