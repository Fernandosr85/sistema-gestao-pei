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
import { Input } from '@/components/ui/input';
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
import { mockStudents } from '@/data/mockData';

interface NewAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAssessmentDialog({ open, onOpenChange }: NewAssessmentDialogProps) {
  const [assessmentType, setAssessmentType] = useState('trimestral');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [assessmentDate, setAssessmentDate] = useState<Date>();
  const [trimester, setTrimester] = useState('1');
  const [progress, setProgress] = useState([50]);

  const handleSaveDraft = () => {
    toast.success('Rascunho salvo com sucesso!');
  };

  const handleFinalize = () => {
    if (!selectedStudent || !assessmentDate) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    toast.success('Avaliação finalizada!', {
      description: 'Notificação enviada para coordenação'
    });
    onOpenChange(false);
  };

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
              <RadioGroup value={assessmentType} onValueChange={setAssessmentType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="diagnostica" id="diagnostica" />
                  <Label htmlFor="diagnostica" className="font-normal cursor-pointer">
                    Avaliação Diagnóstica Inicial
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="formativa" id="formativa" />
                  <Label htmlFor="formativa" className="font-normal cursor-pointer">
                    Avaliação Formativa (Processual)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="trimestral" id="trimestral" />
                  <Label htmlFor="trimestral" className="font-normal cursor-pointer">
                    Avaliação Trimestral do PEI
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="socioemocional" id="socioemocional" />
                  <Label htmlFor="socioemocional" className="font-normal cursor-pointer">
                    Avaliação de Habilidades Socioemocionais
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recursos" id="recursos" />
                  <Label htmlFor="recursos" className="font-normal cursor-pointer">
                    Avaliação de Recursos e Acessibilidade
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estudante *</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estudante" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStudents.map((student) => (
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

            {assessmentType === 'trimestral' && (
              <div className="space-y-2">
                <Label>Trimestre</Label>
                <RadioGroup value={trimester} onValueChange={setTrimester} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="tri1" />
                    <Label htmlFor="tri1" className="font-normal cursor-pointer">1º</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="tri2" />
                    <Label htmlFor="tri2" className="font-normal cursor-pointer">2º</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="tri3" />
                    <Label htmlFor="tri3" className="font-normal cursor-pointer">3º</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="tri4" />
                    <Label htmlFor="tri4" className="font-normal cursor-pointer">4º</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </TabsContent>

          {/* SEÇÃO 2: Objetivos do PEI */}
          <TabsContent value="objectives" className="space-y-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-semibold">Objetivo 1: Desenvolver habilidades de leitura</h4>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <RadioGroup defaultValue="progress">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="achieved" id="obj1-achieved" />
                      <Label htmlFor="obj1-achieved" className="font-normal cursor-pointer">Alcançado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="progress" id="obj1-progress" />
                      <Label htmlFor="obj1-progress" className="font-normal cursor-pointer">Em progresso</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="notstarted" id="obj1-notstarted" />
                      <Label htmlFor="obj1-notstarted" className="font-normal cursor-pointer">Não iniciado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="revision" id="obj1-revision" />
                      <Label htmlFor="obj1-revision" className="font-normal cursor-pointer">Precisa revisão</Label>
                    </div>
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
                  <Label>Observações</Label>
                  <Textarea placeholder="Descreva as observações sobre este objetivo" />
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
                  <div className="space-y-2">
                    <Label>Leitura</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Insuficiente</SelectItem>
                        <SelectItem value="2">2 - Básico</SelectItem>
                        <SelectItem value="3">3 - Adequado</SelectItem>
                        <SelectItem value="4">4 - Bom</SelectItem>
                        <SelectItem value="5">5 - Excelente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Escrita</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Insuficiente</SelectItem>
                        <SelectItem value="2">2 - Básico</SelectItem>
                        <SelectItem value="3">3 - Adequado</SelectItem>
                        <SelectItem value="4">4 - Bom</SelectItem>
                        <SelectItem value="5">5 - Excelente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Oralidade</Label>
                    <Select defaultValue="4">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Insuficiente</SelectItem>
                        <SelectItem value="2">2 - Básico</SelectItem>
                        <SelectItem value="3">3 - Adequado</SelectItem>
                        <SelectItem value="4">4 - Bom</SelectItem>
                        <SelectItem value="5">5 - Excelente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea placeholder="Observações sobre Língua Portuguesa" />
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-semibold">Habilidades Socioemocionais</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="mb-2 block">Autorregulação emocional</Label>
                    <div className="space-y-2 ml-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="recognizes" />
                        <Label htmlFor="recognizes" className="font-normal cursor-pointer">
                          Reconhece emoções
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="manages" />
                        <Label htmlFor="manages" className="font-normal cursor-pointer">
                          Gerencia frustrações
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="asks-help" />
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
              <div className="space-y-2">
                <Label>Principais conquistas do trimestre *</Label>
                <Textarea 
                  placeholder="Descreva as principais conquistas (mínimo 100 caracteres)"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Desafios persistentes *</Label>
                <Textarea 
                  placeholder="Descreva os desafios persistentes (mínimo 100 caracteres)"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Próximos passos / Revisão do PEI *</Label>
                <Textarea 
                  placeholder="Descreva os próximos passos (mínimo 100 caracteres)"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
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
