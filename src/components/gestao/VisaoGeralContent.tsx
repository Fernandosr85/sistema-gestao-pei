import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DemoDataNotice from '@/components/DemoDataNotice';
import { illustrativeScenario } from '@/config/institution';
import { 
  AlertTriangle, 
  Users, 
  Phone, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Bell,
  FileText,
  Target,
  Award
} from 'lucide-react';

const VisaoGeralContent = () => {
  const [, setSearchParams] = useSearchParams();

  const priorities = [
    { id: 1, text: 'Resolver 3 PEIs vencidos', deadline: 'hoje', urgency: 'urgente' },
    { id: 2, text: 'Reunião mensal coordenadores', deadline: 'quarta, 14h', urgency: 'alta' },
    { id: 3, text: 'Aprovar orçamento 2025', deadline: 'vence sexta', urgency: 'alta' },
    { id: 4, text: 'Visita Secretaria de Educação', deadline: 'sexta, 10h', urgency: 'media' },
    { id: 5, text: 'Planejar formação dez/jan', deadline: '8 novos professores', urgency: 'media' },
  ] as const;

  /*
   * A chave identifica, o rótulo aparece na tela. Antes o mesmo valor fazia as duas coisas, e
   * a chave do mapa tinha acento — "MÉDIA" — contra a convenção de identificador ASCII. Com
   * os dois separados, a chave fica ASCII e o texto na tela continua acentuado.
   */
  const urgencies = {
    urgente: { label: 'URGENTE', className: 'bg-destructive text-destructive-foreground' },
    alta: { label: 'ALTA', className: 'bg-warning text-warning-foreground' },
    media: { label: 'MÉDIA', className: 'bg-info text-info-foreground' },
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Gestão &gt; Visão Geral
      </div>

      <DemoDataNotice
        subject="Os alertas, prioridades, indicadores e notificações desta visão geral"
        detail="O painel não nomeia alunos nem famílias; os profissionais citados são da equipe do cenário."
      />

      {/* Alertas Críticos */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle level={2} className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Alertas Críticos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* PEIs Vencidos */}
          <Alert variant="destructive">
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  {/* Saíram os nomes dos alunos: o cenário não nomeia aluno. "Pedro Santos" e
                      "Maria Costa" se confundiam com alunos da demonstração. */}
                  <p className="font-semibold mb-2">PEIs Vencidos</p>
                  <ul className="text-sm space-y-1">
                    <li>• Um PEI com 12 dias de atraso</li>
                    <li>• Um PEI com 8 dias de atraso</li>
                    <li>• Um PEI com 5 dias de atraso</li>
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Professores em Sobrecarga */}
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold mb-2 flex items-center gap-2">
                    Professores em Sobrecarga
                    <Badge variant="secondary" className="bg-warning text-warning-foreground">2</Badge>
                  </div>
                  <ul className="text-sm space-y-1">
                    {/* Os dois da aba Equipe com carga de 90% ou mais. Antes eram outros dois, um
                        deles "Profª Marina", como a professora regente de um aluno da demonstração. */}
                    <li>• Profª. Juliana Mendes - 97.5% de carga</li>
                    <li>• Profª. Helena Duarte - 90% de carga</li>
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Famílias Sem Resposta */}
          <Alert>
            <Phone className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold mb-2 flex items-center gap-2">
                    Famílias Sem Resposta
                    <Badge variant="secondary" className="bg-warning text-warning-foreground">4</Badge>
                  </div>
                  <p className="text-sm">4 famílias sem contato há mais de 15 dias</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Indicadores do Dia */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Indicadores do Dia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Presença PEI */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="h-8 w-8 text-warning" />
                <span className="text-2xl font-bold">93%</span>
              </div>
              <p className="text-sm font-medium mb-1">Presença PEI</p>
              <p className="text-xs text-muted-foreground mb-2">42/{illustrativeScenario.studentsWithPei} alunos</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Meta: 95%</span>
                  <span className="text-warning">🟡 Abaixo</span>
                </div>
                <Progress value={93} className="h-1" />
              </div>
            </CardContent>
          </Card>

          {/* Crises/Intercorrências */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-8 w-8 text-success" />
                <span className="text-2xl font-bold">1</span>
              </div>
              <p className="text-sm font-medium mb-1">Crises Hoje</p>
              {/* Saiu "Pedro, 9h - Ansiedade": crise de saúde mental atribuída a um aluno nomeado. */}
              <p className="text-xs text-muted-foreground mb-2">1 registro, às 9h</p>
              <div className="flex items-center gap-1 text-xs">
                <TrendingDown className="h-3 w-3 text-success" />
                <span className="text-success">Média: 2 eventos</span>
              </div>
            </CardContent>
          </Card>

          {/* Pendências Administrativas */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-8 w-8 text-info" />
                <span className="text-2xl font-bold">8</span>
              </div>
              <p className="text-sm font-medium mb-1">Pendências</p>
              <p className="text-xs text-muted-foreground mb-2">Tarefas administrativas</p>
              <div className="flex items-center gap-1 text-xs">
                <TrendingDown className="h-3 w-3 text-success" />
                <span className="text-success">Ontem: 12 (redução)</span>
              </div>
            </CardContent>
          </Card>

          {/* Satisfação Geral */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="h-8 w-8 text-success" />
                <span className="text-2xl font-bold">4.7</span>
              </div>
              {/* Era "Satisfação Geral": nome dos 91% da aba Análise, que medem outra coisa. */}
              <p className="text-sm font-medium mb-1">Nota das famílias</p>
              <p className="text-xs text-muted-foreground mb-2">Média de 1 a 5</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Meta: 4.5</span>
                  <span className="text-success">✅ Atingido</span>
                </div>
                <Progress value={94} className="h-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prioridades da Semana */}
        <Card>
          <CardHeader>
            <CardTitle level={2} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Prioridades da Semana
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {priorities.map((priority) => (
                <div
                  key={priority.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-background"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {priority.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={urgencies[priority.urgency].className}
                      >
                        {urgencies[priority.urgency].label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{priority.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Linha do Tempo de Hoje */}
        <Card>
          <CardHeader>
            <CardTitle level={2} className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Linha do Tempo de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '08:00', icon: Users, text: 'Reunião pedagógica - Sala 3', color: 'text-primary' },
                // Sem nome de família: "Silva" e "Costa" são sobrenomes de alunos da demonstração.
                { time: '09:30', icon: Bell, text: 'Lembrete: responder a uma família', color: 'text-warning' },
                // Era "Intercorrência: Pedro (crise)", com o nome do aluno.
                { time: '10:00', icon: AlertTriangle, text: 'Intercorrência registrada', color: 'text-destructive' },
                { time: '14:00', icon: FileText, text: 'Revisar relatório mensal', color: 'text-info' },
                { time: '15:30', icon: Users, text: 'Atendimento a uma família', color: 'text-success' },
              ].map((event, index) => (
                <div key={index} className="flex gap-3 relative">
                  {index < 4 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-border" />
                  )}
                  <div className={`rounded-full p-2 bg-background border-2 ${event.color} z-10`}>
                    <event.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-medium">{event.text}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notificações Recentes e Desempenho */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notificações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle level={2} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações Recentes
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { icon: AlertTriangle, text: 'Profª. Juliana Mendes solicitou reunião urgente', time: 'há 15 min', unread: true, color: 'text-destructive' },
                { icon: Calendar, text: 'Uma família reagendou reunião', time: 'há 2h', unread: true, color: 'text-info' },
                { icon: CheckCircle2, text: 'Nova matrícula PEI aprovada - TEA', time: 'há 4h', unread: false, color: 'text-success' },
                { icon: FileText, text: 'Relatório mensal disponível', time: 'ontem', unread: false, color: 'text-primary' },
                { icon: Bell, text: 'Lembrete: Visita Secretaria em 4 dias', time: 'ontem', unread: false, color: 'text-warning' },
              ].map((notification, index) => (
                <div 
                  key={index} 
                  className={`flex gap-3 p-3 rounded-lg border ${
                    notification.unread ? 'bg-primary/5 border-primary/20' : 'bg-background'
                  }`}
                >
                  <notification.icon className={`h-5 w-5 ${notification.color} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{notification.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                  {notification.unread && (
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Desempenho da Escola */}
        <Card>
          <CardHeader>
            <CardTitle level={2} className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Desempenho da {illustrativeScenario.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/*
              * Era "Taxa de sucesso PEI": 88%, meta de 85% e aprovado, enquanto a aba Análise mostra
              * "Taxa de Implementação dos PEIs", também 88%, com meta de 95% e em atenção. Nada no
              * cenário diz que são o mesmo indicador, então cada um ganha nome próprio e diz o que
              * mede. O mesmo com a satisfação: a nota de 1 a 5 daqui e os 91% da Análise.
              */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">PEIs com objetivos alcançados</span>
                <span className="text-sm font-bold text-success">88% ✅</span>
              </div>
              <Progress value={88} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Meta: 85%</p>
              <p className="text-xs text-muted-foreground">
                Dos PEIs revisados no ano, quantos tiveram a maior parte dos objetivos alcançada. Não é
                a implementação dos PEIs, da aba Análise.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Nota das famílias</span>
                <span className="text-sm font-bold text-success">4.7/5.0 ✅</span>
              </div>
              <Progress value={94} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Meta: 4.5</p>
              <p className="text-xs text-muted-foreground">
                Média das notas de 1 a 5 dadas pelas famílias. Não é o percentual de famílias
                satisfeitas, da aba Análise.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Conformidade legislação</span>
                <span className="text-sm font-bold text-warning">93% 🟡</span>
              </div>
              <Progress value={93} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Meta: 100%</p>
            </div>

            <Button className="w-full mt-4" variant="outline" onClick={() => setSearchParams({ tab: 'analise' })}>
              Ver análise completa na aba Análise
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisaoGeralContent;
