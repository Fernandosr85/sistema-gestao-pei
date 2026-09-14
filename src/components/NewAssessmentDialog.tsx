import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, Send } from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DEMO_USER_NAME } from '@/config/institution';
import {
  assessmentKindOptions,
  objectiveStatusOptions,
  performanceLevelOptions,
  READING_OBJECTIVE_TITLE,
  SUMMARY_MIN_LENGTH,
} from '@/lib/assessment';
import { toLocalISODate } from '@/lib/date';
import { createId } from '@/lib/id';
import { describeSaveLocation } from '@/store/saveFeedback';
import { useDemoStore } from '@/store/useDemoStore';
import type { Assessment, AssessmentKind, AssessmentObjectiveStatus, PerformanceLevel } from '@/types';

interface NewAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Quarter = '1' | '2' | '3' | '4';

const QUARTERS: Quarter[] = ['1', '2', '3', '4'];

const EMPTY_SOCIO_EMOTIONAL: Assessment['socioEmotional'] = {
  recognizesEmotions: false,
  managesFrustration: false,
  asksForHelp: false,
};

export function NewAssessmentDialog({ open, onOpenChange }: NewAssessmentDialogProps) {
  const navigate = useNavigate();
  const { state, dispatch } = useDemoStore();
  const [kind, setKind] = useState<AssessmentKind>('quarterly');
  const [studentId, setStudentId] = useState('');
  const [assessmentDate, setAssessmentDate] = useState<Date>();
  const [quarter, setQuarter] = useState<Quarter>('1');
  const [objectiveStatus, setObjectiveStatus] = useState<AssessmentObjectiveStatus>('inProgress');
  const [progress, setProgress] = useState([50]);
  const [objectiveNotes, setObjectiveNotes] = useState('');
  const [reading, setReading] = useState<PerformanceLevel>(3);
  const [writing, setWriting] = useState<PerformanceLevel>(3);
  const [speaking, setSpeaking] = useState<PerformanceLevel>(4);
  const [languageNotes, setLanguageNotes] = useState('');
  const [socioEmotional, setSocioEmotional] = useState(EMPTY_SOCIO_EMOTIONAL);
  const [achievements, setAchievements] = useState('');
  const [challenges, setChallenges] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  // Each opening starts an empty assessment.
  useEffect(() => {
    if (!open) return;
    setKind('quarterly');
    setStudentId('');
    setAssessmentDate(undefined);
    setQuarter('1');
    setObjectiveStatus('inProgress');
    setProgress([50]);
    setObjectiveNotes('');
    setReading(3);
    setWriting(3);
    setSpeaking(4);
    setLanguageNotes('');
    setSocioEmotional(EMPTY_SOCIO_EMOTIONAL);
    setAchievements('');
    setChallenges('');
    setNextSteps('');
    setErrors([]);
  }, [open]);

  const toggleSocioEmotional = (key: keyof Assessment['socioEmotional']) => {
    setSocioEmotional((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleFinalize = () => {
    const student = state.students.find((item) => item.id === studentId);
    const problems: string[] = [];
    if (!student) problems.push('Básicas: selecione o estudante.');
    if (!assessmentDate) problems.push('Básicas: selecione a data da avaliação.');
    const summaryFields: Array<[string, string]> = [
      ['principais conquistas', achievements],
      ['desafios persistentes', challenges],
      ['próximos passos', nextSteps],
    ];
    for (const [label, value] of summaryFields) {
      const length = value.trim().length;
      if (length < SUMMARY_MIN_LENGTH) {
        problems.push(`Síntese: ${label} pede no mínimo ${SUMMARY_MIN_LENGTH} caracteres (há ${length}).`);
      }
    }

    if (problems.length > 0 || !student || !assessmentDate) {
      setErrors(problems);
      return;
    }

    const assessment: Assessment = {
      id: createId('avl'),
      studentId: student.id,
      studentName: student.nomeCompleto,
      date: toLocalISODate(assessmentDate),
      assessor: DEMO_USER_NAME,
      kind,
      ...(kind === 'quarterly' ? { quarter: Number(quarter) as Assessment['quarter'] } : {}),
      objectives: [
        {
          title: READING_OBJECTIVE_TITLE,
          status: objectiveStatus,
          progress: progress[0],
          notes: objectiveNotes.trim(),
        },
      ],
      languageArts: { reading, writing, speaking, notes: languageNotes.trim() },
      socioEmotional,
      summary: {
        achievements: achievements.trim(),
        challenges: challenges.trim(),
        nextSteps: nextSteps.trim(),
      },
    };
    const result = dispatch({ type: 'assessment/add', assessment });
    toast.success('Avaliação finalizada', {
      description: `${student.nomeCompleto}. ${describeSaveLocation(result)}`,
      action: { label: 'Ver na ficha', onClick: () => navigate(`/alunos/${student.id}`) },
    });
    onOpenChange(false);
  };

  const renderLevelSelect = (
    id: string,
    label: string,
    value: PerformanceLevel,
    onChange: (level: PerformanceLevel) => void,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={String(value)} onValueChange={(next) => onChange(Number(next) as PerformanceLevel)}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {performanceLevelOptions.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.value} - {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderSummaryField = (id: string, label: string, placeholder: string, value: string, onChange: (text: string) => void) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} *</Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        className="min-h-[100px]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={`${id}-contador`}
      />
      <p id={`${id}-contador`} className="text-xs text-muted-foreground text-right">
        {value.trim().length}/{SUMMARY_MIN_LENGTH} caracteres mínimos
      </p>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Avaliação</DialogTitle>
          <DialogDescription>
            Preencha os dados da avaliação do estudante
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básicas</TabsTrigger>
            <TabsTrigger value="objectives">Objetivos</TabsTrigger>
            <TabsTrigger value="performance">Desempenho</TabsTrigger>
            <TabsTrigger value="summary">Síntese</TabsTrigger>
          </TabsList>

          {/* SEÇÃO 1: Informações Básicas */}
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-3">
              <Label>Tipo de Avaliação</Label>
              <RadioGroup value={kind} onValueChange={(value) => setKind(value as AssessmentKind)}>
                {assessmentKindOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`tipo-avaliacao-${option.value}`} />
                    <Label htmlFor={`tipo-avaliacao-${option.value}`} className="font-normal cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avaliacao-estudante">Estudante *</Label>
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger id="avaliacao-estudante">
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

              <div className="space-y-2">
                <Label>Data da Avaliação *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !assessmentDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {assessmentDate ? formatDate(assessmentDate, "PPP", { locale: ptBR }) : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={assessmentDate}
                      onSelect={setAssessmentDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {kind === 'quarterly' && (
              <div className="space-y-2">
                <Label>Trimestre</Label>
                <RadioGroup value={quarter} onValueChange={(value) => setQuarter(value as Quarter)} className="flex gap-4">
                  {QUARTERS.map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={`tri${value}`} />
                      <Label htmlFor={`tri${value}`} className="font-normal cursor-pointer">{value}º</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </TabsContent>

          {/* SEÇÃO 2: Objetivos do PEI */}
          <TabsContent value="objectives" className="space-y-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-semibold">Objetivo 1: {READING_OBJECTIVE_TITLE}</h4>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <RadioGroup
                    value={objectiveStatus}
                    onValueChange={(value) => setObjectiveStatus(value as AssessmentObjectiveStatus)}
                  >
                    {objectiveStatusOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`obj1-${option.value}`} />
                        <Label htmlFor={`obj1-${option.value}`} className="font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Progresso: {progress[0]}%</Label>
                  <Slider
                    value={progress}
                    onValueChange={setProgress}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="obj1-observacoes">Observações</Label>
                  <Textarea
                    id="obj1-observacoes"
                    placeholder="Descreva as observações sobre este objetivo"
                    value={objectiveNotes}
                    onChange={(event) => setObjectiveNotes(event.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* SEÇÃO 3: Desempenho por Área */}
          <TabsContent value="performance" className="space-y-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-semibold">Língua Portuguesa</h4>
                <div className="grid grid-cols-3 gap-4">
                  {renderLevelSelect('nivel-leitura', 'Leitura', reading, setReading)}
                  {renderLevelSelect('nivel-escrita', 'Escrita', writing, setWriting)}
                  {renderLevelSelect('nivel-oralidade', 'Oralidade', speaking, setSpeaking)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portugues-observacoes">Observações</Label>
                  <Textarea
                    id="portugues-observacoes"
                    placeholder="Observações sobre Língua Portuguesa"
                    value={languageNotes}
                    onChange={(event) => setLanguageNotes(event.target.value)}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-semibold">Habilidades Socioemocionais</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="mb-2 block">Autorregulação emocional</Label>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="recognizes"
                          checked={socioEmotional.recognizesEmotions}
                          onCheckedChange={() => toggleSocioEmotional('recognizesEmotions')}
                        />
                        <Label htmlFor="recognizes" className="font-normal cursor-pointer">
                          Reconhece emoções
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="manages"
                          checked={socioEmotional.managesFrustration}
                          onCheckedChange={() => toggleSocioEmotional('managesFrustration')}
                        />
                        <Label htmlFor="manages" className="font-normal cursor-pointer">
                          Gerencia frustrações
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="asks-help"
                          checked={socioEmotional.asksForHelp}
                          onCheckedChange={() => toggleSocioEmotional('asksForHelp')}
                        />
                        <Label htmlFor="asks-help" className="font-normal cursor-pointer">
                          Pede ajuda adequadamente
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* SEÇÃO 4: Síntese */}
          <TabsContent value="summary" className="space-y-4">
            <div className="space-y-4">
              {renderSummaryField(
                'sintese-conquistas',
                'Principais conquistas do trimestre',
                `Descreva as principais conquistas (mínimo ${SUMMARY_MIN_LENGTH} caracteres)`,
                achievements,
                setAchievements,
              )}
              {renderSummaryField(
                'sintese-desafios',
                'Desafios persistentes',
                `Descreva os desafios persistentes (mínimo ${SUMMARY_MIN_LENGTH} caracteres)`,
                challenges,
                setChallenges,
              )}
              {renderSummaryField(
                'sintese-proximos-passos',
                'Próximos passos / Revisão do PEI',
                `Descreva os próximos passos (mínimo ${SUMMARY_MIN_LENGTH} caracteres)`,
                nextSteps,
                setNextSteps,
              )}
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

        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t">
          <p id="avaliacao-rascunho-indisponivel" className="mr-auto text-xs text-muted-foreground">
            Rascunhos ainda não são gravados.
          </p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="outline" disabled aria-describedby="avaliacao-rascunho-indisponivel" className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Rascunho
          </Button>
          <Button onClick={handleFinalize} className="gap-2">
            <Send className="h-4 w-4" />
            Finalizar Avaliação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
