import type { Atendimento, AtendimentoEvent } from '@/types';
import { useState, useMemo } from 'react';
import { Calendar, CalendarDays, List, Plus, Filter, CalendarClock, FileWarning, CalendarRange, CalendarCheck, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Calendar as BigCalendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/pt-br';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import StatCard from '@/components/StatCard';
import { NovoAtendimentoDialog } from '@/components/NovoAtendimentoDialog';
import { DetalhesAtendimentoDialog } from '@/components/DetalhesAtendimentoDialog';
import { appointmentTypes } from '@/lib/appointment';
import { formatLocalDate } from '@/lib/date';
import {
  appointmentsInPeriod,
  appointmentsWithoutMinutes,
  isWithinPeriod,
  monthPeriod,
  periodChange,
  previousMonthPeriod,
  previousWeekPeriod,
  upcomingAppointmentsWithin,
  weekPeriod,
} from '@/lib/metrics';
import { useDemoStore } from '@/store/useDemoStore';

/*
 * Uma tabela só por tipo de atendimento, com a classe e o valor CSS derivados do mesmo
 * token. Antes eram duas tabelas com cores fixas do Tailwind, e uma terceira forma
 * improvisada: `bg-blue-500`.replace('bg-','').replace('-500','') virava a cor nomeada
 * "blue" no estilo do calendário. Todas as cores fixas reprovavam no contraste contra o
 * texto branco, entre 1,9:1 e 3,8:1.
 */
const tipoColors = {
  'Reunião Pedagógica': { classe: 'bg-brand-blue', css: 'hsl(var(--brand-blue))' },
  'Avaliação': { classe: 'bg-brand-green', css: 'hsl(var(--brand-green))' },
  'Atendimento Família': { classe: 'bg-brand-orange', css: 'hsl(var(--brand-orange))' },
  'Multidisciplinar': { classe: 'bg-brand-purple', css: 'hsl(var(--brand-purple))' },
  'Outros': { classe: 'bg-brand-gray', css: 'hsl(var(--brand-gray))' },
};

const statusBadgeVariant = {
  agendado: 'default',
  realizado: 'secondary',
  cancelado: 'destructive',
  remarcado: 'outline',
} as const;

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const diaEMes: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };

const AgendaAtendimentos = () => {
  const [novoAtendimentoOpen, setNovoAtendimentoOpen] = useState(false);
  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [selectedAtendimento, setSelectedAtendimento] = useState<Atendimento | null>(null);
  const [filtroAluno, setFiltroAluno] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [currentView, setCurrentView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleAtendimentoClick = (atendimento: Atendimento) => {
    setSelectedAtendimento(atendimento);
    setDetalhesOpen(true);
  };

  const { state } = useDemoStore();
  const atendimentos = state.appointments;

  /*
   * Mesmo seletor do Dashboard. A conta antiga fazia `new Date(a.data)`, que é meia-noite em
   * UTC: a partir das 21h no Brasil, a Agenda deixava de contar os atendimentos de hoje e
   * passava a contar os do oitavo dia, e o número divergia do Dashboard.
   */
  const hoje = new Date();
  const proximosSete = upcomingAppointmentsWithin(state, hoje, 7).length;

  const pendentesRegistro = appointmentsWithoutMinutes(state);

  // "Este Mês" contava todos os atendimentos, de qualquer data, e mostrava "+12%" digitado.
  const atendimentosEsteMes = appointmentsInPeriod(state, monthPeriod(hoje));
  const atendimentosMesAnterior = appointmentsInPeriod(state, previousMonthPeriod(hoje));

  const filteredAtendimentos = atendimentos.filter(atendimento => {
    if (filtroAluno !== 'todos' && atendimento.aluno !== filtroAluno) return false;
    if (filtroTipo !== 'todos' && atendimento.tipo !== filtroTipo) return false;
    if (filtroStatus !== 'todos' && atendimento.status !== filtroStatus) return false;
    return true;
  });

  const calendarEvents = useMemo(() => {
    return filteredAtendimentos.map(atendimento => {
      const [year, month, day] = atendimento.data.split('-').map(Number);
      const [startHour, startMinute] = atendimento.horarioInicio.split(':').map(Number);
      const [endHour, endMinute] = atendimento.horarioFim.split(':').map(Number);
      
      return {
        id: atendimento.id,
        title: atendimento.aluno,
        start: new Date(year, month - 1, day, startHour, startMinute),
        end: new Date(year, month - 1, day, endHour, endMinute),
        resource: atendimento,
      };
    });
  }, [filteredAtendimentos]);

  const eventStyleGetter = (event: AtendimentoEvent) => {
    const tipo = event.resource.tipo;
    const color = tipoColors[tipo as keyof typeof tipoColors];

    return {
      style: {
        backgroundColor: color.css,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '0.85rem',
        padding: '2px 5px',
      }
    };
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agenda de Atendimentos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie reuniões, avaliações e atendimentos individualizados
          </p>
        </div>
        <Button onClick={() => setNovoAtendimentoOpen(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Novo Atendimento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Próximos 7 dias"
          value={proximosSete}
          icon={CalendarClock}
          description="Atendimentos agendados"
          variant="primary"
        />
        <StatCard
          title="Este Mês"
          value={atendimentosEsteMes}
          icon={CalendarRange}
          description="Com data neste mês, inclusive cancelados"
          trend={periodChange(atendimentosEsteMes, atendimentosMesAnterior)}
          variant="success"
        />
        <StatCard
          title="Pendentes de Registro"
          value={pendentesRegistro}
          icon={FileWarning}
          description="Atendimentos sem ata"
          variant="warning"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle level={2} className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            {/*
              * O gatilho do Select é um <button role="combobox">, que não é rotulável por
              * <label htmlFor>. O texto vira <span> com id, e o gatilho aponta para ele:
              * antes o leitor anunciava só "caixa de combinação".
              */}
            <span id="filtro-aluno" className="text-sm font-medium mb-2 block">Aluno</span>
            <Select value={filtroAluno} onValueChange={setFiltroAluno}>
              <SelectTrigger aria-labelledby="filtro-aluno">
                <SelectValue placeholder="Todos os alunos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os alunos</SelectItem>
                {state.students.map((student) => (
                  <SelectItem key={student.id} value={student.nomeCompleto}>
                    {student.nomeCompleto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <span id="filtro-tipo" className="text-sm font-medium mb-2 block">Tipo</span>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger aria-labelledby="filtro-tipo">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                {appointmentTypes.map((appointmentType) => (
                  <SelectItem key={appointmentType} value={appointmentType}>
                    {appointmentType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <span id="filtro-status" className="text-sm font-medium mb-2 block">Status</span>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger aria-labelledby="filtro-status">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="realizado">Realizado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
                <SelectItem value="remarcado">Remarcado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calendar/List View */}
      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 mb-4">
          <TabsTrigger value="mes" className="gap-2">
            <Calendar className="h-4 w-4" />
            Mês
          </TabsTrigger>
          <TabsTrigger value="semana" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Semana
          </TabsTrigger>
          <TabsTrigger value="dia" className="gap-2">
            <CalendarCheck className="h-4 w-4" />
            Dia
          </TabsTrigger>
          <TabsTrigger value="lista" className="gap-2">
            <List className="h-4 w-4" />
            Lista
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mes" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div style={{ height: '700px' }} className="calendar-container">
                <BigCalendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  views={['month']}
                  view={currentView}
                  onView={setCurrentView}
                  date={currentDate}
                  onNavigate={setCurrentDate}
                  onSelectEvent={(event) => handleAtendimentoClick(event.resource)}
                  eventPropGetter={eventStyleGetter}
                  messages={{
                    next: 'Próximo',
                    previous: 'Anterior',
                    today: 'Hoje',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia',
                    agenda: 'Agenda',
                    date: 'Data',
                    time: 'Hora',
                    event: 'Evento',
                    noEventsInRange: 'Não há atendimentos neste período',
                    showMore: (total) => `+ ${total} mais`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semana" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div style={{ height: '700px' }} className="calendar-container">
                <BigCalendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  views={['week']}
                  view="week"
                  date={currentDate}
                  onNavigate={setCurrentDate}
                  onSelectEvent={(event) => handleAtendimentoClick(event.resource)}
                  eventPropGetter={eventStyleGetter}
                  messages={{
                    next: 'Próximo',
                    previous: 'Anterior',
                    today: 'Hoje',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia',
                    agenda: 'Agenda',
                    date: 'Data',
                    time: 'Hora',
                    event: 'Evento',
                    noEventsInRange: 'Não há atendimentos neste período',
                    showMore: (total) => `+ ${total} mais`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dia" className="space-y-4">
          {/* Resumo Estatístico do Dia */}
          {(() => {
            const selectedDay = format(currentDate, 'yyyy-MM-dd');
            const atendimentosDoDia = filteredAtendimentos.filter(a => a.data === selectedDay);
            
            const totalAtendimentos = atendimentosDoDia.length;
            
            // Calcular duração média
            const duracaoTotal = atendimentosDoDia.reduce((acc, a) => {
              const [startHour, startMin] = a.horarioInicio.split(':').map(Number);
              const [endHour, endMin] = a.horarioFim.split(':').map(Number);
              const duracao = (endHour * 60 + endMin) - (startHour * 60 + startMin);
              return acc + duracao;
            }, 0);
            const duracaoMedia = totalAtendimentos > 0 ? Math.round(duracaoTotal / totalAtendimentos) : 0;
            
            // Distribuição por tipo
            const distribuicaoPorTipo = atendimentosDoDia.reduce((acc, a) => {
              acc[a.tipo] = (acc[a.tipo] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            // Semana atual e anterior, como datas YYYY-MM-DD comparadas por texto.
            const semanaAtual = weekPeriod(currentDate);
            const semanaAnterior = previousWeekPeriod(currentDate);

            const atendimentosSemanaAtual = filteredAtendimentos.filter(a => isWithinPeriod(a.data, semanaAtual));
            const atendimentosSemanaAnterior = filteredAtendimentos.filter(a => isWithinPeriod(a.data, semanaAnterior));

            const distribuicaoSemanaAtual = atendimentosSemanaAtual.reduce((acc, a) => {
              acc[a.tipo] = (acc[a.tipo] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            const distribuicaoSemanaAnterior = atendimentosSemanaAnterior.reduce((acc, a) => {
              acc[a.tipo] = (acc[a.tipo] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            const tiposUnicos = new Set([
              ...Object.keys(distribuicaoSemanaAtual),
              ...Object.keys(distribuicaoSemanaAnterior)
            ]);

            const comparacoes = Array.from(tiposUnicos).map(tipo => {
              const atual = distribuicaoSemanaAtual[tipo] || 0;
              const anterior = distribuicaoSemanaAnterior[tipo] || 0;
              const variacao = anterior === 0 
                ? (atual > 0 ? 100 : 0) 
                : Math.round(((atual - anterior) / anterior) * 100);
              
              return { tipo, atual, anterior, variacao };
            }).sort((a, b) => Math.abs(b.variacao) - Math.abs(a.variacao));

            return totalAtendimentos > 0 ? (
              <>
                <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CalendarCheck className="h-5 w-5" />
                      Resumo de {format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-background/60 backdrop-blur p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">Total de Atendimentos</div>
                        <div className="text-2xl font-bold">{totalAtendimentos}</div>
                      </div>
                      <div className="bg-background/60 backdrop-blur p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">Duração Média</div>
                        <div className="text-2xl font-bold">
                          {Math.floor(duracaoMedia / 60)}h {duracaoMedia % 60}min
                        </div>
                      </div>
                      <div className="bg-background/60 backdrop-blur p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground mb-1">Período de Atendimento</div>
                        <div className="text-2xl font-bold">
                          {atendimentosDoDia.length > 0 ? (
                            <>
                              {atendimentosDoDia.reduce((earliest, a) => 
                                a.horarioInicio < earliest ? a.horarioInicio : earliest, 
                                atendimentosDoDia[0].horarioInicio
                              )}
                              {' - '}
                              {atendimentosDoDia.reduce((latest, a) => 
                                a.horarioFim > latest ? a.horarioFim : latest, 
                                atendimentosDoDia[0].horarioFim
                              )}
                            </>
                          ) : '-'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-background/60 backdrop-blur p-4 rounded-lg border">
                      <div className="text-sm font-medium mb-3">Distribuição por Tipo</div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Badges */}
                        <div className="flex flex-col gap-2 justify-center">
                          {Object.entries(distribuicaoPorTipo).map(([tipo, count]) => (
                            <div key={tipo} className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: tipoColors[tipo as keyof typeof tipoColors].css,
                                }}
                              />
                              <span className="text-sm flex-1">{tipo}</span>
                              <Badge variant="secondary" className="text-xs">
                                {count} ({Math.round((count / totalAtendimentos) * 100)}%)
                              </Badge>
                            </div>
                          ))}
                        </div>
                        
                        {/* Gráfico de Donut. O equivalente textual é a lista acima, com contagem e porcentagem por tipo. */}
                        <div
                          className="h-[200px]"
                          role="img"
                          aria-label="Gráfico de rosca da distribuição de atendimentos por tipo. Os mesmos valores estão na lista acima."
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={Object.entries(distribuicaoPorTipo).map(([tipo, count]) => ({
                                  name: tipo,
                                  value: count,
                                }))}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                              >
                                {Object.keys(distribuicaoPorTipo).map((tipo) => (
                                  <Cell 
                                    key={tipo} 
                                    fill={tipoColors[tipo as keyof typeof tipoColors].css}
                                  />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--popover))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '6px',
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comparação com Semana Anterior */}
                {atendimentosSemanaAtual.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Comparação: Semana Atual vs. Semana Anterior
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Semana atual: {formatLocalDate(semanaAtual.start, diaEMes)} - {formatLocalDate(semanaAtual.end, diaEMes)} |{' '}
                        Semana anterior: {formatLocalDate(semanaAnterior.start, diaEMes)} - {formatLocalDate(semanaAnterior.end, diaEMes)}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Total Geral */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Total Geral</span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">
                                {atendimentosSemanaAnterior.length} → {atendimentosSemanaAtual.length}
                              </span>
                              {(() => {
                                const variacaoTotal = atendimentosSemanaAnterior.length === 0 
                                  ? 100 
                                  : Math.round(((atendimentosSemanaAtual.length - atendimentosSemanaAnterior.length) / atendimentosSemanaAnterior.length) * 100);
                                return (
                                  <Badge 
                                    variant={variacaoTotal > 0 ? "default" : variacaoTotal < 0 ? "destructive" : "secondary"}
                                    className="gap-1"
                                  >
                                    {variacaoTotal > 0 ? (
                                      <TrendingUp className="h-3 w-3" />
                                    ) : variacaoTotal < 0 ? (
                                      <TrendingDown className="h-3 w-3" />
                                    ) : (
                                      <Minus className="h-3 w-3" />
                                    )}
                                    {variacaoTotal > 0 ? '+' : ''}{variacaoTotal}%
                                  </Badge>
                                );
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* Por Tipo */}
                        {comparacoes.map(({ tipo, atual, anterior, variacao }) => (
                          <div key={tipo} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                            <div className="flex items-center gap-3 flex-1">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: tipoColors[tipo as keyof typeof tipoColors].css,
                                }}
                              />
                              <span className="text-sm font-medium">{tipo}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">
                                {anterior} → {atual}
                              </span>
                              <Badge 
                                variant={variacao > 0 ? "default" : variacao < 0 ? "destructive" : "secondary"}
                                className="gap-1 min-w-[70px] justify-center"
                              >
                                {variacao > 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : variacao < 0 ? (
                                  <TrendingDown className="h-3 w-3" />
                                ) : (
                                  <Minus className="h-3 w-3" />
                                )}
                                {variacao > 0 ? '+' : ''}{variacao}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : null;
          })()}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle level={2} className="text-base font-medium">Selecionar Data</CardTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(currentDate, "PPP", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarPicker
                    mode="single"
                    selected={currentDate}
                    onSelect={(date) => date && setCurrentDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div style={{ height: '700px' }} className="calendar-container">
                <BigCalendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  views={['agenda']}
                  view="agenda"
                  date={currentDate}
                  onNavigate={setCurrentDate}
                  onSelectEvent={(event) => handleAtendimentoClick(event.resource)}
                  length={1}
                  messages={{
                    next: 'Próximo',
                    previous: 'Anterior',
                    today: 'Hoje',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia',
                    agenda: 'Agenda',
                    date: 'Data',
                    time: 'Hora',
                    event: 'Evento',
                    noEventsInRange: 'Não há atendimentos neste dia',
                    showMore: (total) => `+ ${total} mais`,
                  }}
                  components={{
                    event: ({ event }) => (
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{
                            backgroundColor: tipoColors[event.resource.tipo as keyof typeof tipoColors].css,
                            color: 'white',
                            borderColor: 'transparent'
                          }}
                        >
                          {event.resource.tipo}
                        </Badge>
                        <div className="flex-1">
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-sm text-muted-foreground">{event.resource.objetivos}</div>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {event.resource.profissionais.slice(0, 3).map((prof: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {prof}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge variant={statusBadgeVariant[event.resource.status as keyof typeof statusBadgeVariant]}>
                          {event.resource.status}
                        </Badge>
                      </div>
                    ),
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lista" className="space-y-4">
          {filteredAtendimentos.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground py-8">
                  <p>Nenhum atendimento encontrado com os filtros selecionados</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredAtendimentos.map((atendimento) => (
              /*
               * O cartão tinha o mesmo `onClick` do botão "Ver detalhes" que ele contém.
               * O teclado já chegava pelo botão, então o clique no cartão só duplicava a
               * ação — e disparava o handler duas vezes quando o alvo era o próprio botão.
               */
              <Card
                key={atendimento.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-1 h-16 rounded-full ${tipoColors[atendimento.tipo as keyof typeof tipoColors].classe}`} />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-lg">{atendimento.aluno}</h3>
                          <Badge variant={statusBadgeVariant[atendimento.status as keyof typeof statusBadgeVariant]}>
                            {atendimento.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatLocalDate(atendimento.data)}
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarClock className="h-4 w-4" />
                            {atendimento.horarioInicio} - {atendimento.horarioFim}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {atendimento.tipo}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{atendimento.objetivos}</p>
                        <div className="flex flex-wrap gap-2">
                          {atendimento.profissionais.map((prof, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {prof}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => handleAtendimentoClick(atendimento)}>
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <NovoAtendimentoDialog 
        open={novoAtendimentoOpen} 
        onOpenChange={setNovoAtendimentoOpen} 
      />
      
      {selectedAtendimento && (
        <DetalhesAtendimentoDialog 
          open={detalhesOpen} 
          onOpenChange={setDetalhesOpen}
          atendimento={selectedAtendimento}
          key={selectedAtendimento.id}
        />
      )}
    </div>
  );
};

export default AgendaAtendimentos;
