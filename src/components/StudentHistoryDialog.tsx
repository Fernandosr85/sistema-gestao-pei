import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Award, Users, Activity, Calendar, 
  Image, Video, Download, School, FileCheck, Stethoscope 
} from 'lucide-react';

const timelineEvents = [
  {
    month: 'NOVEMBRO',
    year: '2024',
    current: true,
    events: [
      {
        date: '21/11',
        type: 'observation',
        icon: FileText,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        title: 'Observação: Ótima participação em atividade',
        description: 'em grupo de ciências',
      },
      {
        date: '15/11',
        type: 'assessment',
        icon: FileCheck,
        color: 'text-success',
        bgColor: 'bg-success/10',
        title: 'Avaliação trimestral do PEI realizada',
        description: 'Progresso geral: 85%',
        hasLink: true,
      },
      {
        date: '05/11',
        type: 'achievement',
        icon: Award,
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        title: 'Conquista desbloqueada: Leitura independente!',
        attachments: '📷 2 fotos, 🎥 1 vídeo',
      },
    ],
  },
  {
    month: 'OUTUBRO',
    year: '2024',
    current: false,
    events: [
      {
        date: '30/10',
        type: 'pei',
        icon: FileText,
        color: 'text-info',
        bgColor: 'bg-info/10',
        title: 'PEI revisado e atualizado',
        description: 'Novos objetivos adicionados',
        hasLink: true,
      },
      {
        date: '18/10',
        type: 'meeting',
        icon: Users,
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        title: 'Reunião com família realizada',
        description: 'Pauta: Progressos em matemática\nParticipantes: Mãe, Prof. Marina, Coord.',
        hasLink: true,
      },
      {
        date: '10/10',
        type: 'medical',
        icon: Stethoscope,
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        title: 'Laudo médico atualizado (TEA Nível 1)',
        description: 'Médica: Dra. Ana Paulita',
        hasLink: true,
      },
    ],
  },
  {
    month: 'SETEMBRO',
    year: '2024',
    current: false,
    events: [
      {
        date: '25/09',
        type: 'event',
        icon: Activity,
        color: 'text-success',
        bgColor: 'bg-success/10',
        title: 'Evento: Feira de Ciências',
        description: 'Ana participou com projeto sobre plantas',
        attachments: '📷 Ver fotos',
      },
      {
        date: '20/09',
        type: 'assessment',
        icon: FileCheck,
        color: 'text-success',
        bgColor: 'bg-success/10',
        title: 'Avaliação de Matemática adaptada',
        description: 'Nota: 8.5/10 ✅',
        hasLink: true,
      },
      {
        date: '05/09',
        type: 'observation',
        icon: FileText,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        title: 'Início do uso da prancha de CAA',
        description: 'Primeiras tentativas com sucesso',
      },
    ],
  },
  {
    month: 'DEZEMBRO',
    year: '2023',
    current: false,
    events: [
      {
        date: '15/12',
        type: 'pei',
        icon: FileText,
        color: 'text-info',
        bgColor: 'bg-info/10',
        title: 'Primeiro PEI elaborado',
        description: '15 objetivos definidos',
        hasLink: true,
      },
    ],
  },
  {
    month: 'MARÇO',
    year: '2023',
    current: false,
    events: [
      {
        date: '05/03',
        type: 'enrollment',
        icon: School,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        title: 'Ingresso no SESI',
        description: 'Matrícula: SESI2024003\nTurma: 2º Ano EF - Turma C',
        hasLink: true,
      },
    ],
  },
];

const stats = {
  total: 127,
  observations: 68,
  assessments: 24,
  meetings: 12,
  documents: 15,
  achievements: 8,
};

interface StudentHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
}

export const StudentHistoryDialog = ({ open, onOpenChange, studentName }: StudentHistoryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">HISTÓRICO ACADÊMICO - {studentName.toUpperCase()}</DialogTitle>
        </DialogHeader>

        {/* Filtros */}
        <div className="flex gap-3 mb-6">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os anos</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              <SelectItem value="tri1">1º Trimestre</SelectItem>
              <SelectItem value="tri2">2º Trimestre</SelectItem>
              <SelectItem value="tri3">3º Trimestre</SelectItem>
              <SelectItem value="tri4">4º Trimestre</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Evento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="observation">Observações</SelectItem>
              <SelectItem value="assessment">Avaliações</SelectItem>
              <SelectItem value="meeting">Reuniões</SelectItem>
              <SelectItem value="achievement">Conquistas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          <h3 className="text-lg font-semibold border-b pb-2">LINHA DO TEMPO COMPLETA</h3>
          
          {timelineEvents.map((period, periodIdx) => (
            <div key={periodIdx} className="space-y-4">
              {/* Ano */}
              {(periodIdx === 0 || timelineEvents[periodIdx - 1].year !== period.year) && (
                <div className="text-2xl font-bold text-muted-foreground">{period.year}</div>
              )}

              {/* Mês */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${period.current ? 'bg-destructive' : 'bg-warning'}`} />
                  <h4 className="text-lg font-semibold">{period.month} {period.current && '(Atual)'}</h4>
                </div>

                {/* Eventos */}
                <div className="ml-6 border-l-2 border-border pl-6 space-y-4">
                  {period.events.map((event, eventIdx) => (
                    <div key={eventIdx} className="relative">
                      <div className="absolute -left-[29px] top-2">
                        <div className={`w-4 h-4 rounded-full border-2 border-background ${event.bgColor}`} />
                      </div>
                      
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${event.bgColor}`}>
                              <event.icon className={`h-5 w-5 ${event.color}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-muted-foreground">{event.date}</span>
                                {event.hasLink && (
                                  <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                    Ver detalhes →
                                  </Button>
                                )}
                              </div>
                              <h5 className="font-semibold text-sm mb-1">{event.title}</h5>
                              {event.description && (
                                <p className="text-xs text-muted-foreground whitespace-pre-line">
                                  {event.description}
                                </p>
                              )}
                              {event.attachments && (
                                <div className="mt-2">
                                  <Button variant="outline" size="sm" className="h-7 text-xs">
                                    {event.attachments}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="text-center py-4">
            <Button variant="outline">Carregar mais...</Button>
          </div>
        </div>

        {/* Estatísticas */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4">📊 ESTATÍSTICAS DO HISTÓRICO</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center text-sm">
              <div>
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total de registros</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{stats.observations}</div>
                <div className="text-xs text-muted-foreground">Observações</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{stats.assessments}</div>
                <div className="text-xs text-muted-foreground">Avaliações</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{stats.meetings}</div>
                <div className="text-xs text-muted-foreground">Reuniões</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-info">{stats.documents}</div>
                <div className="text-xs text-muted-foreground">Documentos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">{stats.achievements}</div>
                <div className="text-xs text-muted-foreground">Conquistas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar histórico completo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
