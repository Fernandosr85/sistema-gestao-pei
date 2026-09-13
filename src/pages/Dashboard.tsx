import { Users, ClipboardList, FileText, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import StatCard from '@/components/StatCard';
import StudentCard from '@/components/StudentCard';
import QuickActions from '@/components/QuickActions';
import { GenerateReportDialog } from '@/components/GenerateReportDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { formatLocalDate, todayLocalISO, toLocalISODate } from '@/lib/date';
import { useDemoStore } from '@/store/useDemoStore';

const Dashboard = () => {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const { state } = useDemoStore();

  const totalStudents = state.students.length;
  const activeStudents = state.students.filter(s => s.status === 'ativo').length;
  const totalObservations = state.observations.length;

  const today = todayLocalISO();
  const now = new Date();
  const sevenDaysAhead = toLocalISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7));
  const upcomingAppointments = state.appointments
    .filter((appointment) => appointment.status === 'agendado' && appointment.data >= today)
    .sort((a, b) => `${a.data} ${a.horarioInicio}`.localeCompare(`${b.data} ${b.horarioInicio}`));
  const appointmentsNextSevenDays = upcomingAppointments.filter((appointment) => appointment.data <= sevenDaysAhead).length;

  const recentStudents = state.students.slice(0, 3);
  const nextAppointments = upcomingAppointments.slice(0, 3);

  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="brand-gradient rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-3">
            Sistema de Gestão PEI
          </h1>
          <p className="text-lg opacity-90 mb-6">
            Plano Educacional Individualizado
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setReportDialogOpen(true)}
              data-report-dialog
            >
              <FileText className="mr-2 h-5 w-5" />
              Gerar Relatório
            </Button>
            <Link to="/agenda-atendimentos">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Calendar className="mr-2 h-5 w-5" />
                Agenda de Atendimentos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Alunos Ativos"
          value={activeStudents}
          icon={Users}
          description={`${totalStudents} total`}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Observações"
          value={totalObservations}
          icon={ClipboardList}
          description="Este mês"
          trend={{ value: 8, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Atendimentos Agendados"
          value={appointmentsNextSevenDays}
          icon={Calendar}
          description="Próximos 7 dias"
          variant="warning"
        />
        <StatCard
          title="Relatórios"
          value={12}
          icon={FileText}
          description="Pendentes"
          variant="info"
        />
      </section>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Alunos Recentes</h2>
            <Link to="/alunos">
              <Button variant="ghost" size="sm">
                Ver Todos
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Próximos Atendimentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextAppointments.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum atendimento agendado a partir de hoje.</p>
              )}
              {nextAppointments.map((appointment) => (
                <div key={appointment.id} className="pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{appointment.aluno}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatLocalDate(appointment.data)} às {appointment.horarioInicio}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {appointment.tipo}
                    </Badge>
                  </div>
                  {appointment.profissionais.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {appointment.profissionais.map((profissional) => (
                        <Badge key={profissional} variant="secondary" className="text-xs">
                          {profissional}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/agenda-atendimentos">
                <Button variant="outline" size="sm" className="w-full">
                  Ver agenda completa
                </Button>
              </Link>
            </CardContent>
          </Card>

        </aside>
      </div>

      <GenerateReportDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen} />
    </div>
  );
};

export default Dashboard;
