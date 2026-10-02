import { Link } from 'react-router-dom';
import { CalendarDays, RefreshCw } from 'lucide-react';
import { CALENDAR_INTEGRATION_UNAVAILABLE, useCalendarSync } from '@/hooks/useCalendarSync';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DEMO_USER_NAME } from '@/config/institution';
import DemoDataNotice from '@/components/DemoDataNotice';
import { appointmentStatusLabel, appointmentTypeLabel, isOpenAppointment } from '@/lib/appointment';
import { formatLocalDate } from '@/lib/date';
import { studentNameOf, upcomingAppointments, upcomingAppointmentsWithin } from '@/lib/metrics';
import { useDemoStore } from '@/store/useDemoStore';
import type { Atendimento } from '@/types';
import type { DemoState } from '@/types/store';

/**
 * A agenda do profissional — os atendimentos registrados, lidos do store.
 *
 * O QUE ERA (até a Etapa 9): uma semana inteira de exemplo, com aulas, carga de "40h", "Tarefas
 * agendadas: 12", um dia detalhado com planejamento e materiais, e alertas que nomeavam
 * estudantes — "PEI de Maria vence sexta", "Reunião Fam. Silva", "Observações (Pedro, João,
 * Lucas)". Nada vinha do store, e a lista de alunos estava escrita no código.
 *
 * O QUE É (opção a' do backlog, decidida pelo autor): os atendimentos que existem, agrupados por
 * quando acontecem. O formulário de novo evento saiu, e com ele as visões de mês, semana, dia e
 * lista, que eram quatro formas de olhar o mesmo exemplo fixo — duas delas "em desenvolvimento".
 *
 * O QUE NÃO EXISTE, e a tela diz: agenda pessoal separada dos atendimentos (aulas, formação,
 * tarefas). Isso é entidade nova, e a decisão está registrada na Etapa 9 do backlog.
 */

const AppointmentRow = ({ appointment, state }: { appointment: Atendimento; state: DemoState }) => (
  <li className="rounded-md border p-3">
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-medium">
        {formatLocalDate(appointment.data)} · {appointment.horarioInicio}–{appointment.horarioFim}
      </span>
      <Badge variant="outline">{appointmentTypeLabel(appointment.tipo)}</Badge>
      {/* Situação em texto, não em cor: é o que distingue agendado de cancelado. */}
      <Badge variant={isOpenAppointment(appointment.status) ? 'default' : 'secondary'}>
        {appointmentStatusLabel(appointment.status)}
      </Badge>
    </div>
    <p className="mt-1 text-sm">
      <span className="font-medium">Estudante:</span> {studentNameOf(state, appointment.studentId)}
    </p>
    <p className="text-sm text-muted-foreground">{appointment.objetivos}</p>
    <p className="text-sm text-muted-foreground">
      {appointment.local} · {appointment.profissionais.join(', ')}
    </p>
  </li>
);

const Bloco = ({
  titulo,
  vazio,
  appointments,
  state,
}: {
  titulo: string;
  vazio: string;
  appointments: Atendimento[];
  state: DemoState;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">
        {titulo} ({appointments.length})
      </CardTitle>
    </CardHeader>
    <CardContent>
      {appointments.length === 0 ? (
        <p className="text-sm text-muted-foreground">{vazio}</p>
      ) : (
        <ul className="space-y-3">
          {appointments.map((appointment) => (
            <AppointmentRow key={appointment.id} appointment={appointment} state={state} />
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

const MinhaAgenda = () => {
  const { state } = useDemoStore();
  const { connections } = useCalendarSync();

  const agora = new Date();
  const proximos = upcomingAppointments(state, agora);
  const seteDias = upcomingAppointmentsWithin(state, agora, 7);
  const idsSeteDias = new Set(seteDias.map((appointment) => appointment.id));
  const depois = proximos.filter((appointment) => !idsSeteDias.has(appointment.id));
  const maisRecentePrimeiro = (a: Atendimento, b: Atendimento) =>
    `${b.data} ${b.horarioInicio}`.localeCompare(`${a.data} ${a.horarioInicio}`);
  /*
   * ATRASADOS EXISTEM, E PRECISAM APARECER. `upcomingAppointments` só devolve de hoje em diante;
   * um atendimento ainda agendado com data passada não cairia em bloco nenhum e sumiria da tela
   * sem aviso — que é a classe de defeito da Etapa 4, o registro que existe e não é exibido. Os
   * dados de demonstração têm datas fixas em 2025 (decisão D2), então este bloco é justamente o
   * que a demonstração mostra.
   */
  const idsProximos = new Set(proximos.map((appointment) => appointment.id));
  const atrasados = state.appointments
    .filter((appointment) => isOpenAppointment(appointment.status) && !idsProximos.has(appointment.id))
    .sort(maisRecentePrimeiro);
  const encerrados = state.appointments
    .filter((appointment) => !isOpenAppointment(appointment.status))
    .sort(maisRecentePrimeiro);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Minha Agenda</h1>
          <p className="text-muted-foreground">{DEMO_USER_NAME}</p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link to="/agenda-atendimentos">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Abrir a agenda de atendimentos
          </Link>
        </Button>
      </div>

      <DemoDataNotice
        id="agenda-exemplo"
        className="mb-6"
        subject="Os atendimentos listados aqui"
        detail="São os registros de demonstração, com nomes fictícios. O sistema não tem autenticação, então não há como saber quais atendimentos são de quem abriu a tela: aparecem todos os que estão registrados."
      />

      <div className="space-y-6">
        <Bloco
          titulo="Próximos 7 dias"
          vazio="Nenhum atendimento agendado para os próximos 7 dias."
          appointments={seteDias}
          state={state}
        />
        <Bloco
          titulo="Depois"
          vazio="Nenhum atendimento agendado além dos próximos 7 dias."
          appointments={depois}
          state={state}
        />
        <Bloco
          titulo="Agendados com data já passada"
          vazio="Nenhum atendimento agendado ficou para trás."
          appointments={atrasados}
          state={state}
        />
        <Bloco
          titulo="Realizados e cancelados"
          vazio="Nenhum atendimento realizado ou cancelado registrado."
          appointments={encerrados}
          state={state}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">O que esta tela ainda não tem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {/*
              * O lugar honesto da lacuna: em vez de aulas, carga horária e tarefas de exemplo, a
              * tela nomeia o que falta. É entidade nova, e a decisão está no backlog (Etapa 9).
              */}
            <p>
              Agenda pessoal separada dos atendimentos — aulas, planejamento, formação e tarefas —
              não existe neste protótipo. Seria uma entidade nova, com decisão de produto por trás,
              e até a Etapa 8 esta tela mostrava tudo isso como exemplo fixo, com nomes de
              estudantes escritos no código.
            </p>
            <p>
              Também não há navegação por semana ou mês: o que existe é a lista dos atendimentos
              registrados, acima, e a agenda completa em{' '}
              <Link className="underline" to="/agenda-atendimentos">
                Agenda de Atendimentos
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RefreshCw className="h-5 w-5" aria-hidden="true" />
              Integrações e sincronização
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1 text-sm">
              <p>Google Calendar: {connections.google.connected ? 'conectado' : 'não conectado'}</p>
              <p>Outlook / Microsoft 365: {connections.outlook.connected ? 'conectado' : 'não conectado'}</p>
            </div>
            <p id="agenda-integracoes-indisponiveis" className="text-sm text-muted-foreground">
              {CALENDAR_INTEGRATION_UNAVAILABLE}
            </p>
            <Button
              variant="outline"
              size="sm"
              disabled
              aria-describedby="agenda-integracoes-indisponiveis"
              className="gap-2"
            >
              <RefreshCw className="h-3 w-3" aria-hidden="true" />
              Sincronizar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MinhaAgenda;
