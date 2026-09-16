import { useEffect, useId, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { DEMO_USER_NAME, institution } from '@/config/institution';
import { todayLocalISO } from '@/lib/date';
import { createId } from '@/lib/id';
import { describeSaveLocation } from '@/store/saveFeedback';
import { useDemoStore } from '@/store/useDemoStore';
import type { DiagnosisType, EducationLevel, Resource, ResourceType, SubjectType } from '@/types/resource';

interface ContributeResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FULL_DESCRIPTION_MIN_LENGTH = 200;

const typeOptions: Array<{ label: string; value: ResourceType }> = [
  { label: 'Material Impresso (PDF/DOC)', value: 'material-impresso' },
  { label: 'Vídeo Tutorial', value: 'video' },
  { label: 'Jogo Educacional', value: 'jogo' },
  { label: 'Aplicativo/Software', value: 'aplicativo' },
  { label: 'Prancha de CAA', value: 'prancha-caa' },
  { label: 'Sequência Didática', value: 'sequencia-didatica' },
  { label: 'Avaliação Adaptada', value: 'avaliacao-adaptada' },
  { label: 'Roteiro Visual', value: 'roteiro-visual' },
  { label: 'História Social', value: 'historia-social' },
  { label: 'Outro', value: 'outro' },
];

const ALL_DIAGNOSES: DiagnosisType[] = [
  'TEA',
  'TDAH',
  'Dislexia',
  'Discalculia',
  'Deficiência Intelectual',
  'Síndrome de Down',
  'Deficiência Visual',
  'Deficiência Auditiva',
  'Paralisia Cerebral',
  'Superdotação',
  'Outros',
];

const diagnosisOptions: Array<{ label: string; values: DiagnosisType[] }> = [
  { label: 'TEA', values: ['TEA'] },
  { label: 'TDAH', values: ['TDAH'] },
  { label: 'Dislexia', values: ['Dislexia'] },
  { label: 'Discalculia', values: ['Discalculia'] },
  { label: 'Deficiência Intelectual', values: ['Deficiência Intelectual'] },
  { label: 'Síndrome de Down', values: ['Síndrome de Down'] },
  { label: 'Deficiência Visual', values: ['Deficiência Visual'] },
  { label: 'Deficiência Auditiva', values: ['Deficiência Auditiva'] },
  { label: 'Todos (recurso universal)', values: ALL_DIAGNOSES },
];

const subjectOptions: Array<{ label: string; value: SubjectType }> = [
  { label: 'Língua Portuguesa', value: 'Língua Portuguesa' },
  { label: 'Matemática', value: 'Matemática' },
  { label: 'Ciências', value: 'Ciências da Natureza' },
  { label: 'Geografia', value: 'Geografia' },
  { label: 'História', value: 'História' },
  { label: 'Arte', value: 'Arte' },
  { label: 'Educação Física', value: 'Educação Física' },
  { label: 'Habilidades Socioemocionais', value: 'Habilidades Socioemocionais' },
];

/** Only the levels the resource stores: a school year chosen here would be discarded on save. */
const levelOptions: Array<{ label: string; value: EducationLevel }> = [
  { label: 'Educação Infantil', value: 'Educação Infantil' },
  { label: 'Fundamental 1', value: 'Fundamental 1' },
  { label: 'Fundamental 2', value: 'Fundamental 2' },
  { label: 'Ensino Médio', value: 'Ensino Médio' },
  { label: 'EJA', value: 'EJA' },
];

const termOptions = [
  {
    key: 'confirmAuthorship',
    label: 'Confirmo que sou o autor deste material ou tenho autorização para compartilhá-lo',
    problem: 'Etapa 4: confirme que é o autor do material ou tem autorização para compartilhá-lo.',
  },
  {
    key: 'allowUsage',
    label: 'Autorizo o uso deste recurso por outros professores da instituição para fins educacionais',
    problem: 'Etapa 4: autorize o uso do recurso por outros professores.',
  },
  {
    key: 'acknowledgeNoModeration',
    label: 'Compreendo que, nesta versão de demonstração, o recurso vai direto para a biblioteca deste navegador, sem moderação',
    problem: 'Etapa 4: confirme que entendeu que o recurso não passa por moderação.',
  },
  {
    key: 'acceptTerms',
    label: 'Li e aceito os Termos de Uso da Biblioteca',
    problem: 'Etapa 4: aceite os Termos de Uso da Biblioteca.',
  },
] as const;

const EMPTY_FORM = {
  title: '',
  shortDescription: '',
  fullDescription: '',
  type: '',
  diagnoses: [] as string[],
  subjects: [] as string[],
  educationLevels: [] as string[],
  confirmAuthorship: false,
  allowUsage: false,
  acknowledgeNoModeration: false,
  acceptTerms: false,
};

const unique = <T,>(values: T[]): T[] => Array.from(new Set(values));

export function ContributeResourceDialog({ open, onOpenChange }: ContributeResourceDialogProps) {
  const { dispatch } = useDemoStore();
  // Option names as ids would repeat the library filter ids behind the dialog, and a label click would reach the filter.
  const fieldId = useId();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<string[]>([]);

  // Each opening starts a fresh contribution.
  useEffect(() => {
    if (!open) return;
    setStep(1);
    setFormData(EMPTY_FORM);
    setErrors([]);
  }, [open]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const type = typeOptions.find((option) => option.label === formData.type)?.value;
    const diagnoses = unique(
      diagnosisOptions.filter((option) => formData.diagnoses.includes(option.label)).flatMap((option) => option.values),
    );
    const subjects = unique(
      subjectOptions.filter((option) => formData.subjects.includes(option.label)).map((option) => option.value),
    );
    const educationLevels = unique(
      levelOptions.filter((option) => formData.educationLevels.includes(option.label)).map((option) => option.value),
    );
    const fullDescriptionLength = formData.fullDescription.trim().length;

    const problems: string[] = [];
    if (!formData.title.trim()) problems.push('Etapa 1: informe o título do recurso.');
    if (!formData.shortDescription.trim()) problems.push('Etapa 1: informe a descrição breve.');
    if (fullDescriptionLength < FULL_DESCRIPTION_MIN_LENGTH) {
      problems.push(
        `Etapa 1: a descrição completa pede no mínimo ${FULL_DESCRIPTION_MIN_LENGTH} caracteres (há ${fullDescriptionLength}).`,
      );
    }
    if (!type) problems.push('Etapa 2: escolha o tipo de recurso.');
    if (diagnoses.length === 0) problems.push('Etapa 2: marque ao menos um diagnóstico.');
    if (subjects.length === 0) problems.push('Etapa 2: marque ao menos um componente curricular.');
    if (educationLevels.length === 0) problems.push('Etapa 2: marque ao menos um nível de ensino.');
    for (const term of termOptions) {
      if (!formData[term.key]) problems.push(term.problem);
    }

    if (problems.length > 0 || !type) {
      setErrors(problems);
      return;
    }

    const resource: Resource = {
      id: createId('res'),
      title: formData.title.trim(),
      description: formData.shortDescription.trim(),
      fullDescription: formData.fullDescription.trim(),
      type,
      thumbnailUrl: '/placeholder.svg',
      fileUrl: '',
      diagnoses,
      subjects,
      educationLevels,
      rating: 0,
      reviewCount: 0,
      downloadCount: 0,
      favoriteCount: 0,
      author: { name: DEMO_USER_NAME, school: institution.name },
      createdAt: todayLocalISO(),
      isNew: true,
      isFeatured: false,
      tags: [...diagnoses.slice(0, 2), ...subjects.slice(0, 1)],
      isLocalContribution: true,
    };
    const result = dispatch({ type: 'resource/add', resource });
    toast.success('Recurso adicionado à biblioteca', {
      description: `Contribuição local, sem moderação e sem arquivo. ${describeSaveLocation(result)}`,
    });
    onOpenChange(false);
  };

  const toggleDiagnosis = (diagnosis: string) => {
    setFormData(prev => ({
      ...prev,
      diagnoses: prev.diagnoses.includes(diagnosis)
        ? prev.diagnoses.filter(d => d !== diagnosis)
        : [...prev.diagnoses, diagnosis]
    }));
  };

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const toggleEducationLevel = (level: string) => {
    setFormData(prev => ({
      ...prev,
      educationLevels: prev.educationLevels.includes(level)
        ? prev.educationLevels.filter(l => l !== level)
        : [...prev.educationLevels, level]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">Contribuir com Novo Recurso</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Etapa {step} de 4: {step === 1 ? 'Informações Básicas' : step === 2 ? 'Categorização' : step === 3 ? 'Upload de Arquivos' : 'Revisão e Submissão'}
              </p>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título do Recurso *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Jogo de memória com pictogramas..."
                      maxLength={80}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.title.length}/80 caracteres
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="shortDescription">Descrição Breve *</Label>
                    <Textarea
                      id="shortDescription"
                      placeholder="Descreva em poucas palavras..."
                      maxLength={200}
                      rows={3}
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.shortDescription.length}/200 caracteres
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="fullDescription">Descrição Completa *</Label>
                    <Textarea
                      id="fullDescription"
                      placeholder="Inclua: objetivos, como usar, materiais necessários, dicas de implementação..."
                      rows={8}
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Mínimo {FULL_DESCRIPTION_MIN_LENGTH} caracteres ({formData.fullDescription.trim().length} até agora)
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label>Tipo de Recurso *</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      className="mt-2"
                    >
                      {typeOptions.map(({ label }, index) => (
                        <div key={label} className="flex items-center space-x-2">
                          <RadioGroupItem value={label} id={`${fieldId}-type-${index}`} />
                          <Label htmlFor={`${fieldId}-type-${index}`} className="font-normal cursor-pointer">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Diagnósticos Aplicáveis *</Label>
                    <div className="mt-2 space-y-2">
                      {diagnosisOptions.map(({ label }, index) => (
                        <div key={label} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${fieldId}-diagnosis-${index}`}
                            checked={formData.diagnoses.includes(label)}
                            onCheckedChange={() => toggleDiagnosis(label)}
                          />
                          <Label htmlFor={`${fieldId}-diagnosis-${index}`} className="font-normal cursor-pointer">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Componentes Curriculares *</Label>
                    <div className="mt-2 space-y-2">
                      {subjectOptions.map(({ label }, index) => (
                        <div key={label} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${fieldId}-subject-${index}`}
                            checked={formData.subjects.includes(label)}
                            onCheckedChange={() => toggleSubject(label)}
                          />
                          <Label htmlFor={`${fieldId}-subject-${index}`} className="font-normal cursor-pointer">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Nível de Ensino *</Label>
                    <div className="mt-2 space-y-2">
                      {levelOptions.map(({ label }, index) => (
                        <div key={label} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${fieldId}-level-${index}`}
                            checked={formData.educationLevels.includes(label)}
                            onCheckedChange={() => toggleEducationLevel(label)}
                          />
                          <Label htmlFor={`${fieldId}-level-${index}`} className="font-normal cursor-pointer">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <p id="envio-arquivos-indisponivel" className="rounded-md border p-3 text-sm text-muted-foreground">
                    O envio de arquivos ainda não está disponível nesta versão: o recurso é salvo sem arquivo.
                  </p>

                  <div>
                    <Label>Arquivo Principal</Label>
                    <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center opacity-60">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">Envio de arquivos indisponível</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        📄 Formatos aceitos: PDF, DOC, DOCX, PPT, PPTX, ZIP
                      </p>
                      <p className="text-xs text-muted-foreground">Tamanho máx: 50MB</p>
                    </div>
                  </div>

                  <div>
                    <Label>Imagem de Capa/Thumbnail</Label>
                    <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center opacity-60">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">Envio de arquivos indisponível</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        📷 Formatos aceitos: JPG, PNG
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tamanho recomendado: 1200x675px | Máx: 5MB
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Vídeo Demonstrativo (opcional)</Label>
                    <Input
                      placeholder="Insira link do YouTube/Vimeo"
                      className="mt-2"
                      disabled
                      aria-describedby="envio-arquivos-indisponivel"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-semibold mb-2">Preview do Seu Recurso</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Título:</strong> {formData.title || 'Não informado'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Tipo:</strong> {formData.type || 'Não informado'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Diagnósticos:</strong> {formData.diagnoses.join(', ') || 'Não informado'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Termos e Condições</h3>
                    <p className="text-xs text-muted-foreground">Todos os itens são obrigatórios.</p>
                    <div className="space-y-2">
                      {termOptions.map((term) => (
                        <div key={term.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${fieldId}-${term.key}`}
                            checked={formData[term.key]}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({ ...prev, [term.key]: checked === true }))
                            }
                          />
                          <Label htmlFor={`${fieldId}-${term.key}`} className="font-normal cursor-pointer text-sm">
                            {term.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
                    <h4 className="font-semibold text-sm mb-2">Nesta versão de demonstração:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• O recurso aparece na biblioteca deste navegador, marcado como contribuição local</li>
                      <li>• Não há moderação, envio de arquivos nem notificação por e-mail</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {errors.length > 0 && (
              <div role="alert" className="mt-6 rounded-md border border-destructive/50 p-3 text-sm text-destructive">
                <ul className="list-disc space-y-1 pl-5">
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                ← Voltar
              </Button>
              {step < 4 ? (
                <Button onClick={handleNext}>
                  Próximo →
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Adicionar à biblioteca (local)
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
