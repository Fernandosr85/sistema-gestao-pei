import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  GraduationCap, 
  Brain, 
  Stethoscope, 
  FileText, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { mockProfessionals } from '@/data/mockData';
import DemoDataNotice from '@/components/DemoDataNotice';

interface TeamMember {
  id: string;
  nome: string;
  tipo: 'professor' | 'psicologo' | 'terapeuta' | 'fonoaudiologo' | 'coordenador';
  especialidade?: string;
  horasAula: number;
  estudantesPEI: number;
  coordenacao: number;
  treinamentos: number;
  totalHoras: number;
  utilizacao: number;
}

interface ContractAlert {
  id: string;
  profissional: string;
  tipo: string;
  vencimento: string;
  diasRestantes: number;
  urgencia: 'critica' | 'alta' | 'media';
}

interface Absence {
  id: string;
  profissional: string;
  tipo: 'Férias' | 'Licença Médica' | 'Licença Maternidade' | 'Afastamento';
  inicio: string;
  fim: string;
  status: 'Ativo' | 'Concluído' | 'Planejado';
}

const EquipeContent = () => {
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);

  // Mock team data with workload details
  const teamMembers: TeamMember[] = [
    {
      id: 'prof-3',
      nome: 'Profª. Ana Beatriz',
      tipo: 'professor',
      horasAula: 25,
      estudantesPEI: 4,
      coordenacao: 5,
      treinamentos: 2,
      totalHoras: 36,
      utilizacao: 90
    },
    {
      id: 'prof-4',
      nome: 'Prof. Carlos Lima',
      tipo: 'professor',
      horasAula: 20,
      estudantesPEI: 2,
      coordenacao: 0,
      treinamentos: 3,
      totalHoras: 25,
      utilizacao: 62.5
    },
    {
      id: 'prof-5',
      nome: 'Profª. Juliana Mendes',
      tipo: 'professor',
      horasAula: 30,
      estudantesPEI: 5,
      coordenacao: 3,
      treinamentos: 1,
      totalHoras: 39,
      utilizacao: 97.5
    },
    {
      id: 'prof-1',
      nome: 'Dra. Maria Fernandes',
      tipo: 'psicologo',
      especialidade: 'Psicologia Educacional',
      horasAula: 0,
      estudantesPEI: 8,
      coordenacao: 2,
      treinamentos: 2,
      totalHoras: 28,
      utilizacao: 70
    },
    {
      id: 'prof-2',
      nome: 'Dr. João Santos',
      tipo: 'terapeuta',
      especialidade: 'Terapia Ocupacional',
      horasAula: 0,
      estudantesPEI: 6,
      coordenacao: 1,
      treinamentos: 3,
      totalHoras: 26,
      utilizacao: 65
    }
  ];

  const contractAlerts: ContractAlert[] = [
    { id: '1', profissional: 'Dr. João Santos', tipo: 'Terapeuta', vencimento: '15/03/2025', diasRestantes: 15, urgencia: 'critica' },
    { id: '2', profissional: 'Profª. Ana Beatriz', tipo: 'Professor', vencimento: '30/04/2025', diasRestantes: 61, urgencia: 'alta' },
    { id: '3', profissional: 'Profª. Juliana Mendes', tipo: 'Professor', vencimento: '15/05/2025', diasRestantes: 76, urgencia: 'media' }
  ];

  const absences: Absence[] = [
    { id: '1', profissional: 'Prof. Ricardo Alves', tipo: 'Licença Médica', inicio: '10/02/2025', fim: '24/02/2025', status: 'Ativo' },
    { id: '2', profissional: 'Dra. Paula Costa', tipo: 'Licença Maternidade', inicio: '01/01/2025', fim: '01/05/2025', status: 'Ativo' },
    { id: '3', profissional: 'Prof. Carlos Lima', tipo: 'Férias', inicio: '20/01/2025', fim: '03/02/2025', status: 'Concluído' }
  ];

  const teamOverview = {
    professores: teamMembers.filter(m => m.tipo === 'professor').length,
    psicologos: teamMembers.filter(m => m.tipo === 'psicologo').length,
    terapeutas: teamMembers.filter(m => m.tipo === 'terapeuta').length,
    fonoaudiologos: teamMembers.filter(m => m.tipo === 'fonoaudiologo').length,
    coordenadores: teamMembers.filter(m => m.tipo === 'coordenador').length,
    total: teamMembers.length
  };

  const getUtilizacaoColor = (utilizacao: number) => {
    if (utilizacao >= 90) return 'text-red-600';
    if (utilizacao >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUtilizacaoBg = (utilizacao: number) => {
    if (utilizacao >= 90) return 'bg-red-100 border-red-200';
    if (utilizacao >= 75) return 'bg-yellow-100 border-yellow-200';
    return 'bg-green-100 border-green-200';
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'critica': return 'bg-red-500';
      case 'alta': return 'bg-orange-500';
      case 'media': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'professor': return <GraduationCap className="h-4 w-4" />;
      case 'psicologo': return <Brain className="h-4 w-4" />;
      case 'terapeuta': return <Stethoscope className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Gestão &gt; Equipe
      </div>

      <DemoDataNotice subject="Os profissionais, cargas de trabalho, contratos e afastamentos desta aba" />

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Professores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <span className="text-3xl font-bold">{teamOverview.professores}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Psicólogos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="text-3xl font-bold">{teamOverview.psicologos}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Terapeutas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-green-600" />
              <span className="text-3xl font-bold">{teamOverview.terapeutas}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fonoaudiólogos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <span className="text-3xl font-bold">{teamOverview.fonoaudiologos}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Coordenadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-600" />
              <span className="text-3xl font-bold">{teamOverview.coordenadores}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-3xl font-bold">{teamOverview.total}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workload Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Gestão de Carga de Trabalho
          </CardTitle>
          <CardDescription>
            Visualização da utilização de cada profissional (40h semanais = 100%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamMembers.map((member) => (
            <Collapsible
              key={member.id}
              open={expandedTeacher === member.id}
              onOpenChange={() => setExpandedTeacher(expandedTeacher === member.id ? null : member.id)}
            >
              <div className={`border rounded-lg p-4 ${getUtilizacaoBg(member.utilizacao)}`}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTipoIcon(member.tipo)}
                      <div className="text-left">
                        <p className="font-semibold">{member.nome}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {member.tipo}{member.especialidade && ` - ${member.especialidade}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getUtilizacaoColor(member.utilizacao)}`}>
                          {member.utilizacao}%
                        </p>
                        <p className="text-sm text-muted-foreground">{member.totalHoras}h/40h</p>
                      </div>
                      {expandedTeacher === member.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  <Progress value={member.utilizacao} className="mt-3" />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Horas de Aula</p>
                      <p className="text-lg font-semibold">{member.horasAula}h</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estudantes PEI</p>
                      <p className="text-lg font-semibold">{member.estudantesPEI} alunos</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Coordenação</p>
                      <p className="text-lg font-semibold">{member.coordenacao}h</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Treinamentos</p>
                      <p className="text-lg font-semibold">{member.treinamentos}h</p>
                    </div>
                  </div>

                  {member.utilizacao >= 90 && (
                    <Alert className="mt-4 border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        Profissional com carga de trabalho crítica. Considere redistribuir responsabilidades.
                      </AlertDescription>
                    </Alert>
                  )}
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Renewals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Contratações e Renovações
            </CardTitle>
            <CardDescription>Contratos a vencer nos próximos 90 dias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {contractAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-12 rounded ${getUrgenciaColor(alert.urgencia)}`} />
                  <div>
                    <p className="font-semibold">{alert.profissional}</p>
                    <p className="text-sm text-muted-foreground">{alert.tipo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{alert.vencimento}</p>
                  <p className="text-sm text-muted-foreground">{alert.diasRestantes} dias</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Absences History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Histórico de Afastamentos
            </CardTitle>
            <CardDescription>Afastamentos ativos e recentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {absences.map((absence) => (
              <div key={absence.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold">{absence.profissional}</p>
                  <p className="text-sm text-muted-foreground">{absence.tipo}</p>
                </div>
                <div className="text-right">
                  <Badge 
                    className={
                      absence.status === 'Ativo' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                      absence.status === 'Planejado' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }
                  >
                    {absence.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {absence.inicio} - {absence.fim}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EquipeContent;
