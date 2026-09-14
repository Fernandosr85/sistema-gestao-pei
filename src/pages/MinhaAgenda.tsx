import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, FileText, ChevronLeft, ChevronRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { DEMO_USER_NAME } from '@/config/institution';

const MinhaAgenda = () => {
  const [currentMonth, setCurrentMonth] = useState('Novembro 2024');
  const [selectedView, setSelectedView] = useState('semana');
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  
  const { connections, syncStatus, triggerSync } = useCalendarSync();

  const weekEvents = {
    seg: [
      { time: '08:00-12:00', title: 'Aula 2º Ano C', type: 'aula', color: 'bg-blue-500' },
      { time: '14:00-17:00', title: 'Tempo Administrativo', type: 'admin', color: 'bg-gray-500' },
    ],
    ter: [
      { time: '08:00-12:00', title: 'Aula 2º Ano C', type: 'aula', color: 'bg-blue-500' },
      { time: '14:00-17:00', title: 'Apoio 3º Ano A', type: 'apoio', color: 'bg-green-500' },
    ],
    qua: [
      { time: '08:00-12:00', title: 'Aula 2º Ano C', type: 'aula', color: 'bg-blue-500' },
      { time: '14:00-15:00', title: 'Reunião Fam. Silva', type: 'reuniao', color: 'bg-purple-500' },
      { time: '16:00-17:00', title: 'PEI Revisão Maria', type: 'pei', color: 'bg-orange-500' },
    ],
    qui: [
      { time: '08:00-12:00', title: 'Aula 2º Ano C', type: 'aula', color: 'bg-blue-500' },
      { time: '19:00-21:00', title: 'Formação TEA', type: 'formacao', color: 'bg-yellow-500' },
    ],
    sex: [
      { time: '08:00-12:00', title: 'Aula 2º Ano C', type: 'aula', color: 'bg-blue-500' },
      { time: '14:00-17:00', title: 'Observações (Pedro, João, Lucas)', type: 'observacao', color: 'bg-cyan-500' },
    ],
  };

  const tarefasDia = [
    { id: 1, title: 'Finalizar observação de João', vence: '17h', urgente: true, concluida: false },
    { id: 2, title: 'Assinar relatório de Maria', vence: '', urgente: false, concluida: false },
    { id: 3, title: 'Responder 3 mensagens de famílias', vence: '', urgente: false, concluida: false },
    { id: 4, title: 'Planejar atividades da próxima semana', vence: '', urgente: false, concluida: false },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">📅 Minha Agenda</h1>
          <p className="text-muted-foreground">{DEMO_USER_NAME}</p>
        </div>
        <Dialog open={isNewEventDialogOpen} onOpenChange={setIsNewEventDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Evento na Agenda</DialogTitle>
              <DialogDescription>Adicione um novo compromisso, tarefa ou evento</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tipo de evento:</Label>
                <RadioGroup defaultValue="reuniao" className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aula" id="tipo1" />
                    <label htmlFor="tipo1" className="text-sm">Aula</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reuniao" id="tipo2" />
                    <label htmlFor="tipo2" className="text-sm">Reunião</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tarefa" id="tipo3" />
                    <label htmlFor="tipo3" className="text-sm">Tarefa</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="formacao" id="tipo4" />
                    <label htmlFor="tipo4" className="text-sm">Formação</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outro" id="tipo5" />
                    <label htmlFor="tipo5" className="text-sm">Outro</label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="titulo">Título *</Label>
                <Input id="titulo" placeholder="Reunião família Silva" />
              </div>

              <div>
                <Label htmlFor="data">Data *</Label>
                <Input id="data" type="date" defaultValue="2024-11-27" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hora-inicio">Horário de início</Label>
                  <Input id="hora-inicio" type="time" defaultValue="14:00" />
                </div>
                <div>
                  <Label htmlFor="hora-fim">Horário de término</Label>
                  <Input id="hora-fim" type="time" defaultValue="15:00" />
                </div>
              </div>

              <div>
                <Label>Relacionado a:</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="rel-aluno" defaultChecked />
                    <label htmlFor="rel-aluno" className="text-sm">Aluno</label>
                  </div>
                  <Select defaultValue="maria">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maria">Maria Silva</SelectItem>
                      <SelectItem value="pedro">Pedro Santos</SelectItem>
                      <SelectItem value="joao">João Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="local">Local</Label>
                <Input id="local" placeholder="Sala de Reuniões" />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" placeholder="Discutir progressos do 4º trimestre e planejar objetivos para 2025" rows={3} />
              </div>

              <div>
                <Label>Lembretes:</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="lembrete1" defaultChecked />
                    <label htmlFor="lembrete1" className="text-sm">1 dia antes (email)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="lembrete2" defaultChecked />
                    <label htmlFor="lembrete2" className="text-sm">30 min antes (push)</label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Recorrência:</Label>
                <RadioGroup defaultValue="nao-repetir" className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao-repetir" id="rec1" />
                    <label htmlFor="rec1" className="text-sm">Não repetir</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="diaria" id="rec2" />
                    <label htmlFor="rec2" className="text-sm">Diariamente</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="semanal" id="rec3" />
                    <label htmlFor="rec3" className="text-sm">Semanalmente</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mensal" id="rec4" />
                    <label htmlFor="rec4" className="text-sm">Mensalmente</label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Sincronizar com:</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sync-google" defaultChecked />
                    <label htmlFor="sync-google" className="text-sm">Google Calendar</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sync-outlook" />
                    <label htmlFor="sync-outlook" className="text-sm">Outlook</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsNewEventDialogOpen(false)}>Cancelar</Button>
                <Button onClick={() => setIsNewEventDialogOpen(false)}>Salvar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="mes">📅 Mês</TabsTrigger>
          <TabsTrigger value="semana">📋 Semana</TabsTrigger>
          <TabsTrigger value="dia">📄 Dia</TabsTrigger>
          <TabsTrigger value="lista">📊 Lista</TabsTrigger>
        </TabsList>

        {/* VISUALIZAÇÃO SEMANAL */}
        <TabsContent value="semana" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">{currentMonth}: 25/11 a 01/12/2024</h2>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {Object.entries(weekEvents).map(([dia, eventos]) => (
              <Card key={dia}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold uppercase">{dia}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {eventos.map((evento, idx) => (
                    <div key={idx} className={`p-2 rounded-lg text-white text-xs ${evento.color}`}>
                      <p className="font-semibold">{evento.time}</p>
                      <p className="mt-1">{evento.title}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumo da Semana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm mb-2">Carga total: <strong>40h</strong></p>
                <Progress value={100} className="mb-2" />
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>• Aulas: 25h (62%)</div>
                  <div>• Administrativo: 11h (28%)</div>
                  <div>• Formação: 2h (5%)</div>
                  <div>• Livre: 2h (5%)</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm mb-1">🎯 Tarefas agendadas: <strong>12</strong></p>
                  <p className="text-sm">🟢 Concluídas: 3 | 🟡 Pendentes: 8 | 🔴 Atrasadas: 1</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="font-semibold mb-2">⚠️ Alertas:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Quinta-feira com 9h de trabalho (acima do recomendado)</li>
                  <li>• PEI de Maria vence sexta (2 dias!)</li>
                  <li>• Reunião Silva sem preparação agendada</li>
                </ul>
                <div className="mt-2">
                  <Button variant="link" className="p-0" disabled aria-describedby="sugestoes-exemplo-fixo">
                    Sugestões de organização (exemplo fixo)
                  </Button>
                  <p id="sugestoes-exemplo-fixo" className="text-xs text-muted-foreground">
                    Indisponível: os alertas acima são texto de exemplo e nenhuma sugestão é calculada.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VISUALIZAÇÃO DO DIA */}
        <TabsContent value="dia" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Segunda, 25 de Novembro de 2024</CardTitle>
                  <CardDescription>Detalhes do dia</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">08:00 - 12:00</span>
                    <Badge>Aula</Badge>
                  </div>
                  <p className="font-medium">Aula 2º Ano C</p>
                  <p className="text-sm text-muted-foreground">Local: Sala 201</p>
                  <p className="text-sm text-muted-foreground">Alunos PEI: Maria, Pedro, João (3)</p>
                  <p className="text-sm text-muted-foreground">Conteúdo: Matemática - Adição até 20</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="link" size="sm" className="p-0 h-auto">Ver planejamento</Button>
                    <Button variant="link" size="sm" className="p-0 h-auto">Materiais</Button>
                  </div>
                </div>

                <div className="border-l-4 border-gray-400 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">12:00 - 13:00</span>
                    <Badge variant="secondary">Intervalo</Badge>
                  </div>
                  <p className="font-medium">Intervalo de Almoço</p>
                </div>

                <div className="border-l-4 border-gray-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">14:00 - 17:00</span>
                    <Badge variant="outline">Administrativo</Badge>
                  </div>
                  <p className="font-medium">Tempo Administrativo</p>
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">Tarefas:</p>
                    <div className="space-y-2">
                      {tarefasDia.map((tarefa) => (
                        <div key={tarefa.id} className="flex items-center gap-2">
                          <Checkbox id={`tarefa-${tarefa.id}`} checked={tarefa.concluida} />
                          <label htmlFor={`tarefa-${tarefa.id}`} className="text-sm flex-1">
                            {tarefa.title}
                            {tarefa.vence && (
                              <span className={`ml-2 ${tarefa.urgente ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>
                                (vence {tarefa.vence}) {tarefa.urgente && '⚠️'}
                              </span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">Iniciar bloco de tarefas</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔔 Próximos Compromissos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold mb-1">Hoje:</p>
                <p className="text-sm">• 14:00 - Finalizar observação João ⚠️ (3h restantes)</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Amanhã:</p>
                <p className="text-sm">• 19:00 - Formação TEA online</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Esta semana:</p>
                <p className="text-sm">• Qua 14:00 - Reunião família Silva</p>
                <p className="text-sm">• Sex - Prazo PEI Maria ⚠️</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className={`h-5 w-5 ${syncStatus.inProgress ? 'animate-spin' : ''}`} />
                Integrações e Sincronização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google Calendar Status */}
              {connections.google.connected && (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <Badge variant="default" className="bg-green-500">Sincronizado</Badge>
                    </div>
                    <p className="text-sm font-medium">Google Calendar</p>
                    <p className="text-xs text-muted-foreground">
                      {connections.google.email}
                    </p>
                    {connections.google.lastSync && (
                      <p className="text-xs text-muted-foreground">
                        Última sync: {formatDistanceToNow(new Date(connections.google.lastSync), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={triggerSync}
                    disabled={syncStatus.inProgress}
                    className="gap-2"
                  >
                    <RefreshCw className={`h-3 w-3 ${syncStatus.inProgress ? 'animate-spin' : ''}`} />
                    Sincronizar
                  </Button>
                </div>
              )}

              {/* Outlook Status */}
              {connections.outlook.connected && (
                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <Badge variant="default" className="bg-blue-500">Sincronizado</Badge>
                    </div>
                    <p className="text-sm font-medium">Outlook / Microsoft 365</p>
                    <p className="text-xs text-muted-foreground">
                      {connections.outlook.email}
                    </p>
                    {connections.outlook.lastSync && (
                      <p className="text-xs text-muted-foreground">
                        Última sync: {formatDistanceToNow(new Date(connections.outlook.lastSync), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Sync Status */}
              {syncStatus.inProgress && (
                <div className="flex items-center gap-2 text-blue-600 text-sm pt-3 border-t">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Sincronizando calendários...</span>
                </div>
              )}

              {/* Reminder Settings */}
              <div className="pt-3 border-t">
                <p className="text-sm font-medium mb-2">📧 Lembretes configurados:</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Email: 1 dia antes</p>
                  <p>• Push: 30 min antes</p>
                  <p>• SMS: Apenas urgentes</p>
                </div>
              </div>

              {/* Settings Link */}
              <Button variant="link" className="p-0 h-auto text-sm">
                ⚙️ Configurar integrações e sincronização
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OUTRAS VISUALIZAÇÕES */}
        <TabsContent value="mes">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Visualização de calendário mensal em desenvolvimento</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lista">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Visualização de lista em desenvolvimento</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MinhaAgenda;