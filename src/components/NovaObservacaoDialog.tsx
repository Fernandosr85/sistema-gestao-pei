import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Video, FileText, AlertCircle } from 'lucide-react';

interface NovaObservacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
}

export function NovaObservacaoDialog({ open, onOpenChange, studentName }: NovaObservacaoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">📝 Nova Observação - {studentName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">📅 Data</Label>
              <Input id="data" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora">⏰ Hora</Label>
              <Input id="hora" type="time" defaultValue={new Date().toTimeString().slice(0, 5)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>📍 Local/Contexto</Label>
            <RadioGroup defaultValue="sala">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sala" id="sala" />
                <Label htmlFor="sala">Sala de Aula</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recreio" id="recreio" />
                <Label htmlFor="recreio">Recreio</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aee" id="aee" />
                <Label htmlFor="aee">AEE</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ed-fisica" id="ed-fisica" />
                <Label htmlFor="ed-fisica">Educação Física</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outro" id="outro" />
                <Label htmlFor="outro">Outro</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>🎯 Relacionado a</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="objetivo-pei" />
                <Label htmlFor="objetivo-pei">Objetivo do PEI</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="comportamento" />
                <Label htmlFor="comportamento">Comportamento</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="aprendizagem" />
                <Label htmlFor="aprendizagem">Aprendizagem</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="socializacao" />
                <Label htmlFor="socializacao">Socialização</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="comunicacao" />
                <Label htmlFor="comunicacao">Comunicação</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>📝 Tipo de Observação</Label>
            <RadioGroup defaultValue="positiva">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="positiva" id="positiva" />
                <Label htmlFor="positiva">😊 Positiva</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutra" id="neutra" />
                <Label htmlFor="neutra">ℹ️ Neutra/Informativa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="atencao" id="atencao" />
                <Label htmlFor="atencao">⚠️ Atenção necessária</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">💬 Descrição *</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva a observação de forma clara e objetiva..."
              rows={6}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">0/500 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label>📎 Anexar evidências</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Foto
              </Button>
              <Button variant="outline" size="sm">
                <Video className="w-4 h-4 mr-2" />
                Vídeo
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Documento
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>🔔 Notificar</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="notif-familia" defaultChecked />
                <Label htmlFor="notif-familia">Família</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="notif-coord" />
                <Label htmlFor="notif-coord">Coordenação</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="notif-apoio" />
                <Label htmlFor="notif-apoio">Profissional de apoio</Label>
              </div>
            </div>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-2">💡 Observações anteriores relacionadas (3):</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 18/11 - Participação ativa em trabalho em grupo</li>
                    <li>• 15/11 - Uso espontâneo da prancha CAA</li>
                    <li>• 10/11 - Interesse em atividade de ciências</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="outline">
            Salvar como Rascunho
          </Button>
          <Button>
            Publicar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
