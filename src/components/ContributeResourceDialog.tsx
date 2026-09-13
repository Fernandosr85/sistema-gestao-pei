import { useState } from 'react';
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

interface ContributeResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContributeResourceDialog({ open, onOpenChange }: ContributeResourceDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    type: '',
    diagnoses: [] as string[],
    subjects: [] as string[],
    educationLevels: [] as string[],
    acceptTerms: false
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!formData.acceptTerms) {
      toast.error('Por favor, aceite os termos e condições');
      return;
    }
    toast.success('Recurso enviado para moderação!');
    onOpenChange(false);
    setStep(1);
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
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">📤 Contribuir com Novo Recurso</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Etapa {step} de 4: {step === 1 ? 'Informações Básicas' : step === 2 ? 'Categorização' : step === 3 ? 'Upload de Arquivos' : 'Revisão e Submissão'}
              </p>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">📋 Título do Recurso *</Label>
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
                    <Label htmlFor="shortDescription">📝 Descrição Breve *</Label>
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
                    <Label htmlFor="fullDescription">📄 Descrição Completa *</Label>
                    <Textarea
                      id="fullDescription"
                      placeholder="Inclua: objetivos, como usar, materiais necessários, dicas de implementação..."
                      rows={8}
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Mínimo 200 caracteres
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label>🎯 Tipo de Recurso *</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      className="mt-2"
                    >
                      {['Material Impresso (PDF/DOC)', 'Vídeo Tutorial', 'Jogo Educacional', 'Aplicativo/Software', 'Prancha de CAA', 'Sequência Didática', 'Avaliação Adaptada', 'Roteiro Visual', 'História Social', 'Outro'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <RadioGroupItem value={type} id={type} />
                          <Label htmlFor={type} className="font-normal cursor-pointer">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>📋 Diagnósticos Aplicáveis *</Label>
                    <div className="mt-2 space-y-2">
                      {['TEA', 'TDAH', 'Dislexia', 'Discalculia', 'Deficiência Intelectual', 'Síndrome de Down', 'Deficiência Visual', 'Deficiência Auditiva', 'Todos (recurso universal)'].map((diagnosis) => (
                        <div key={diagnosis} className="flex items-center space-x-2">
                          <Checkbox
                            id={diagnosis}
                            checked={formData.diagnoses.includes(diagnosis)}
                            onCheckedChange={() => toggleDiagnosis(diagnosis)}
                          />
                          <Label htmlFor={diagnosis} className="font-normal cursor-pointer">
                            {diagnosis}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>📚 Componentes Curriculares *</Label>
                    <div className="mt-2 space-y-2">
                      {['Língua Portuguesa', 'Matemática', 'Ciências', 'Geografia', 'História', 'Arte', 'Educação Física', 'Habilidades Socioemocionais'].map((subject) => (
                        <div key={subject} className="flex items-center space-x-2">
                          <Checkbox
                            id={subject}
                            checked={formData.subjects.includes(subject)}
                            onCheckedChange={() => toggleSubject(subject)}
                          />
                          <Label htmlFor={subject} className="font-normal cursor-pointer">
                            {subject}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>🎓 Nível de Ensino *</Label>
                    <div className="mt-2 space-y-2">
                      {['Educação Infantil', 'Fund. 1 - 1º ano', 'Fund. 1 - 2º ano', 'Fund. 1 - 3º ano', 'Fund. 1 - 4º ano', 'Fund. 1 - 5º ano', 'Fund. 2', 'Ensino Médio'].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={level}
                            checked={formData.educationLevels.includes(level)}
                            onCheckedChange={() => toggleEducationLevel(level)}
                          />
                          <Label htmlFor={level} className="font-normal cursor-pointer">
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label>📁 Arquivo Principal *</Label>
                    <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">Arraste ou clique para upload</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        📄 Formatos aceitos: PDF, DOC, DOCX, PPT, PPTX, ZIP
                      </p>
                      <p className="text-xs text-muted-foreground">Tamanho máx: 50MB</p>
                    </div>
                  </div>

                  <div>
                    <Label>🖼️ Imagem de Capa/Thumbnail *</Label>
                    <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">Arraste ou clique para upload</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        📷 Formatos aceitos: JPG, PNG
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tamanho recomendado: 1200x675px | Máx: 5MB
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>🎥 Vídeo Demonstrativo (opcional)</Label>
                    <Input
                      placeholder="Insira link do YouTube/Vimeo"
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-semibold mb-2">📋 Preview do Seu Recurso</h3>
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
                    <h3 className="font-semibold">✅ Termos e Condições</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="font-normal cursor-pointer text-sm">
                          Confirmo que sou o autor deste material ou tenho autorização para compartilhá-lo
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="usage" />
                        <Label htmlFor="usage" className="font-normal cursor-pointer text-sm">
                          Autorizo o uso deste recurso por outros professores da instituição para fins educacionais
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="moderation" />
                        <Label htmlFor="moderation" className="font-normal cursor-pointer text-sm">
                          Compreendo que o material passará por moderação antes da publicação
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="accept"
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, acceptTerms: checked as boolean })
                          }
                        />
                        <Label htmlFor="accept" className="font-normal cursor-pointer text-sm">
                          Li e aceito os Termos de Uso da Biblioteca
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
                    <h4 className="font-semibold text-sm mb-2">💡 Após a submissão:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Seu recurso será analisado pela equipe de moderação (prazo: até 5 dias úteis)</li>
                      <li>• Você receberá notificação por email</li>
                      <li>• Se aprovado, aparecerá na biblioteca</li>
                      <li>• Você poderá acompanhar estatísticas de uso</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

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
                  🚀 Enviar para Moderação
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
