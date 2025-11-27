import { useState } from 'react';
import { Calendar, CalendarDays, List, Plus, Filter, CalendarClock, FileWarning, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatCard from '@/components/StatCard';
import { NovoAtendimentoDialog } from '@/components/NovoAtendimentoDialog';
import { DetalhesAtendimentoDialog } from '@/components/DetalhesAtendimentoDialog';

// Mock data
const mockAtendimentos = [
  {
    id: 1,
    aluno: 'Ana Carolina Souza',
    tipo: 'Reunião Pedagógica',
    data: '2025-11-28',
    horarioInicio: '14:00',
    horarioFim: '15:00',
    status: 'agendado',
    profissionais: ['Profª. Marina Santos', 'Coordenação'],
    local: 'Sala de Coordenação',
    objetivos: 'Discutir progresso do PEI e ajustes necessários',
  },
  {
    id: 2,
    aluno: 'Pedro Henrique Silva',
    tipo: 'Avaliação',
    data: '2025-11-29',
    horarioInicio: '10:00',
    horarioFim: '11:30',
    status: 'agendado',
    profissionais: ['Psicopedagogo', 'Prof. de Apoio'],
    local: 'Sala AEE',
    objetivos: 'Avaliação trimestral de objetivos do PEI',
  },
  {
    id: 3,
    aluno: 'Maria Julia Santos',
    tipo: 'Atendimento Família',
    data: '2025-11-30',
    horarioInicio: '16:00',
    horarioFim: '17:00',
    status: 'agendado',
    profissionais: ['Profª. Ana Beatriz', 'Família'],
    local: 'Online',
    objetivos: 'Alinhamento de estratégias casa-escola',
  },
  {
    id: 4,
    aluno: 'Lucas Martins Costa',
    tipo: 'Multidisciplinar',
    data: '2025-12-02',
    horarioInicio: '13:00',
    horarioFim: '14:30',
    status: 'agendado',
    profissionais: ['Coordenação', 'Professores', 'Psicopedagogo', 'Família'],
    local: 'Sala de Reuniões',
    objetivos: 'Revisão geral do caso e definição de novas metas',
  },
  {
    id: 5,
    aluno: 'Ana Carolina Souza',
    tipo: 'Reunião Pedagógica',
    data: '2025-11-25',
    horarioInicio: '14:00',
    horarioFim: '15:00',
    status: 'realizado',
    profissionais: ['Profª. Marina Santos', 'Coordenação'],
    local: 'Sala de Coordenação',
    objetivos: 'Discussão sobre transições',
    ata: '',
  },
];

const tipoColors = {
  'Reunião Pedagógica': 'bg-blue-500',
  'Avaliação': 'bg-green-500',
  'Atendimento Família': 'bg-orange-500',
  'Multidisciplinar': 'bg-purple-500',
  'Outros': 'bg-gray-500',
};

const statusBadgeVariant = {
  agendado: 'default',
  realizado: 'secondary',
  cancelado: 'destructive',
  remarcado: 'outline',
} as const;

const AgendaAtendimentos = () => {
  const [novoAtendimentoOpen, setNovoAtendimentoOpen] = useState(false);
  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [selectedAtendimento, setSelectedAtendimento] = useState<any>(null);
  const [filtroAluno, setFiltroAluno] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const handleAtendimentoClick = (atendimento: any) => {
    setSelectedAtendimento(atendimento);
    setDetalhesOpen(true);
  };

  const proximosSete = mockAtendimentos.filter(a => {
    const today = new Date();
    const atendimentoDate = new Date(a.data);
    const diffTime = atendimentoDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7 && a.status === 'agendado';
  }).length;

  const pendentesRegistro = mockAtendimentos.filter(a => 
    a.status === 'realizado' && !a.ata
  ).length;

  const filteredAtendimentos = mockAtendimentos.filter(atendimento => {
    if (filtroAluno !== 'todos' && atendimento.aluno !== filtroAluno) return false;
    if (filtroTipo !== 'todos' && atendimento.tipo !== filtroTipo) return false;
    if (filtroStatus !== 'todos' && atendimento.status !== filtroStatus) return false;
    return true;
  });

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
          value={mockAtendimentos.length}
          icon={CalendarRange}
          description="+12% vs. mês anterior"
          trend={{ value: 12, isPositive: true }}
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
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Aluno</label>
            <Select value={filtroAluno} onValueChange={setFiltroAluno}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os alunos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os alunos</SelectItem>
                <SelectItem value="Ana Carolina Souza">Ana Carolina Souza</SelectItem>
                <SelectItem value="Pedro Henrique Silva">Pedro Henrique Silva</SelectItem>
                <SelectItem value="Maria Julia Santos">Maria Julia Santos</SelectItem>
                <SelectItem value="Lucas Martins Costa">Lucas Martins Costa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Tipo</label>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="Reunião Pedagógica">Reunião Pedagógica</SelectItem>
                <SelectItem value="Avaliação">Avaliação</SelectItem>
                <SelectItem value="Atendimento Família">Atendimento Família</SelectItem>
                <SelectItem value="Multidisciplinar">Multidisciplinar</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
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
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-4">
          <TabsTrigger value="mes" className="gap-2">
            <Calendar className="h-4 w-4" />
            Mês
          </TabsTrigger>
          <TabsTrigger value="semana" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Semana
          </TabsTrigger>
          <TabsTrigger value="lista" className="gap-2">
            <List className="h-4 w-4" />
            Lista
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mes" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Visualização de calendário mensal em desenvolvimento</p>
                <p className="text-sm mt-2">Use a visualização em Lista para ver todos os atendimentos</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semana" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-12">
                <CalendarDays className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Visualização de calendário semanal em desenvolvimento</p>
                <p className="text-sm mt-2">Use a visualização em Lista para ver todos os atendimentos</p>
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
              <Card 
                key={atendimento.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleAtendimentoClick(atendimento)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-1 h-16 rounded-full ${tipoColors[atendimento.tipo as keyof typeof tipoColors]}`} />
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
                            {new Date(atendimento.data).toLocaleDateString('pt-BR')}
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
        />
      )}
    </div>
  );
};

export default AgendaAtendimentos;
