import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Camera, Video, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DEMO_USER_NAME } from '@/config/institution';
import { currentLocalTime, todayLocalISO } from '@/lib/date';
import { createId } from '@/lib/id';
import {
  quickObservationContextOptions,
  quickObservationToneOptions,
  quickObservationTopicOptions,
} from '@/lib/observation';
import { describeSaveLocation } from '@/store/saveFeedback';
import { useDemoStore } from '@/store/useDemoStore';
import type {
  QuickObservation,
  QuickObservationContext,
  QuickObservationTone,
  QuickObservationTopic,
} from '@/types';

const DESCRIPTION_MAX_LENGTH = 500;

interface NovaObservacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
}

export function NovaObservacaoDialog({ open, onOpenChange, studentId, studentName }: NovaObservacaoDialogProps) {
  const { dispatch } = useDemoStore();
  const { toast } = useToast();
  const [date, setDate] = useState(todayLocalISO);
  const [time, setTime] = useState(currentLocalTime);
  const [context, setContext] = useState<QuickObservationContext>('classroom');
  const [topics, setTopics] = useState<QuickObservationTopic[]>([]);
  const [tone, setTone] = useState<QuickObservationTone>('positive');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Each opening starts a fresh record with the current local date and time.
  useEffect(() => {
    if (!open) return;
    setDate(todayLocalISO());
    setTime(currentLocalTime());
    setContext('classroom');
    setTopics([]);
    setTone('positive');
    setDescription('');
    setError('');
  }, [open]);

  const toggleTopic = (topic: QuickObservationTopic) => {
    setTopics((current) =>
      current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]
    );
  };

  const handlePublish = () => {
    const trimmedDescription = description.trim();
    if (!date || !time) {
      setError('Informe a data e a hora da observação.');
      return;
    }
    if (!trimmedDescription) {
      setError('Descreva a observação antes de publicar.');
      return;
    }

    const observation: QuickObservation = {
      kind: 'quick',
      id: createId('obs'),
      studentId,
      data: date,
      time,
      observador: DEMO_USER_NAME,
      context,
      topics,
      tone,
      description: trimmedDescription,
    };
    const result = dispatch({ type: 'observation/add', observation });
    toast({
      title: 'Observação publicada',
      description: `Registro de ${studentName} adicionado às observações. ${describeSaveLocation(result)}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Nova Observação - {studentName}</DialogTitle>
          <DialogDescription>
            Registre o que foi observado, com data, local e tipo. O registro fica salvo neste
            navegador.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input id="data" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora">Hora</Label>
              <Input id="hora" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Local/Contexto</Label>
            <RadioGroup value={context} onValueChange={(value) => setContext(value as QuickObservationContext)}>
              {quickObservationContextOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`contexto-${option.value}`} />
                  <Label htmlFor={`contexto-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Relacionado a</Label>
            <div className="space-y-2">
              {quickObservationTopicOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tema-${option.value}`}
                    checked={topics.includes(option.value)}
                    onCheckedChange={() => toggleTopic(option.value)}
                  />
                  <Label htmlFor={`tema-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Observação</Label>
            <RadioGroup value={tone} onValueChange={(value) => setTone(value as QuickObservationTone)}>
              {quickObservationToneOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`tipo-${option.value}`} />
                  <Label htmlFor={`tipo-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva a observação de forma clara e objetiva..."
              rows={6}
              maxLength={DESCRIPTION_MAX_LENGTH}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              aria-describedby="descricao-contador"
            />
            <p id="descricao-contador" className="text-xs text-muted-foreground text-right">
              {description.length}/{DESCRIPTION_MAX_LENGTH} caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label>Anexar evidências</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled aria-describedby="evidencias-indisponiveis">
                <Camera className="w-4 h-4 mr-2" />
                Foto
              </Button>
              <Button variant="outline" size="sm" disabled aria-describedby="evidencias-indisponiveis">
                <Video className="w-4 h-4 mr-2" />
                Vídeo
              </Button>
              <Button variant="outline" size="sm" disabled aria-describedby="evidencias-indisponiveis">
                <FileText className="w-4 h-4 mr-2" />
                Documento
              </Button>
            </div>
            <p id="evidencias-indisponiveis" className="text-xs text-muted-foreground">
              Anexos não são armazenados neste protótipo.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Notificar</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="notif-familia" checked={false} disabled aria-describedby="notificar-indisponivel" />
                <Label htmlFor="notif-familia">Família</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="notif-coord" checked={false} disabled aria-describedby="notificar-indisponivel" />
                <Label htmlFor="notif-coord">Coordenação</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="notif-apoio" checked={false} disabled aria-describedby="notificar-indisponivel" />
                <Label htmlFor="notif-apoio">Profissional de apoio</Label>
              </div>
            </div>
            <p id="notificar-indisponivel" className="text-xs text-muted-foreground">
              Nenhuma notificação é enviada neste protótipo.
            </p>
          </div>

          {/*
            * Saiu o bloco "Observações anteriores relacionadas (3)": três observações fixas,
            * uma delas sobre uso de prancha de comunicação, apresentadas como histórico do
            * estudante deste diálogo, qualquer que fosse ele.
            */}
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 mt-6 pt-6 border-t">
          <p id="rascunho-indisponivel" className="mr-auto text-xs text-muted-foreground">
            Rascunhos ainda não são gravados.
          </p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="outline" disabled aria-describedby="rascunho-indisponivel">
            Salvar como Rascunho
          </Button>
          <Button onClick={handlePublish}>
            Publicar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
