import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Download, Share2, Printer, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartDataTable from '@/components/ChartDataTable';
import DemoDataNotice from '@/components/DemoDataNotice';
import { PeiGoalProgressList } from '@/components/PeiGoalProgressList';
import {
  assessmentKindLabel,
  assessmentProgress,
  assessmentsOf,
  performanceLevelLabel,
} from '@/lib/assessment';
import { formatLocalDate } from '@/lib/date';
import { studentNameOf } from '@/lib/metrics';
import { activePeiOf, goalCountsByStatus, goalsOfPei, peiGoalsProgress } from '@/lib/pei';
import { useDemoStore } from '@/store/useDemoStore';
import type { PeiGoalArea } from '@/types/pei';

const NOTICE_ID = 'desempenho-dados-ficticios';

/** Áreas da parte III do manual que são componente curricular, separadas das socioemocionais. */
const AREAS_CURRICULARES: PeiGoalArea[] = [
  'portuguese',
  'math',
  'science',
  'geographyHistory',
  'arts',
  'physicalEducation',
];

const AREAS_SOCIOEMOCIONAIS: PeiGoalArea[] = [
  'selfRegulation',
  'socialInteraction',
  'functionalCommunication',
  'autonomy',
];

interface StudentPerformanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Id, não nome: desempenho é dos registros do estudante, procurados por id. */
  studentId: string;
}

/**
 * O desempenho do estudante, lido dos registros.
 *
 * O QUE ESTA TELA DIZIA ANTES (até a Etapa 9): uma curva fixa 65-72-78-85, "12/15 alcançados",
 * "94% de presença", "Bom" de integração e uma lista de objetivos inventada — tudo igual para
 * qualquer estudante, sob o nome dele em caixa alta. Na Etapa 2 saíram daqui a prancha de CAA e
 * a "redução de 60% nas crises de ansiedade" (achado 1); na Etapa 4 veio o aviso. Continuava
 * sendo exemplo.
 *
 * O QUE SAIU DE VEZ, e por quê: **presença e integração**. Não existe entidade de frequência nem
 * medida de integração neste sistema, e número sem registro de origem é invenção (invariante 2).
 * Em vez de um lugar com porcentagem fixa, a tela não mostra o que não tem.
 *
 * AS DUAS MEDIDAS DE PROGRESSO convivem aqui, cada uma com o nome do que é: a série vem das
 * AVALIAÇÕES (medição datada) e o estado corrente vem das METAS do PEI. É a distinção que a
 * Etapa 9 tornou possível — antes a mesma conta servia das duas.
 */
export const StudentPerformanceDialog = ({ open, onOpenChange, studentId }: StudentPerformanceDialogProps) => {
  const { state } = useDemoStore();
  const studentName = studentNameOf(state, studentId);
  const pei = activePeiOf(state, studentId);
  const goals = pei ? goalsOfPei(state, pei.id) : [];
  const progresso = peiGoalsProgress(goals);
  const contagens = goalCountsByStatus(goals);
  const avaliacoes = assessmentsOf(state, studentId);
  const ultima = avaliacoes[avaliacoes.length - 1];

  const serie = avaliacoes
    .map((avaliacao) => ({
      rotulo: avaliacao.quarter ? `${avaliacao.quarter}º Tri` : formatLocalDate(avaliacao.date),
      data: formatLocalDate(avaliacao.date),
      valor: assessmentProgress(avaliacao),
    }))
    .filter((ponto): ponto is { rotulo: string; data: string; valor: number } => ponto.valor !== undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Desempenho de {studentName}</DialogTitle>
          <DialogDescription>
            Montado com as avaliações registradas e as metas do PEI vigente deste estudante.
          </DialogDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" size="sm" disabled aria-describedby="desempenho-acoes-indisponiveis">
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" disabled aria-describedby="desempenho-acoes-indisponiveis">
              <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Compartilhar
            </Button>
            <Button variant="outline" size="sm" disabled aria-describedby="desempenho-acoes-indisponiveis">
              <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
              Imprimir
            </Button>
          </div>
          <p id="desempenho-acoes-indisponiveis" className="text-xs text-muted-foreground">
            Exportar, compartilhar e imprimir não estão implementados neste protótipo.
          </p>
        </DialogHeader>

        <DemoDataNotice
          id={NOTICE_ID}
          subject="As avaliações, as metas e os textos deste diálogo"
          detail={`Vêm dos registros de demonstração de ${studentName}, com conteúdo fictício. Não há registro de frequência nem medida de integração neste sistema, então esta tela não mostra nenhum dos dois.`}
        />

        <Tabs defaultValue="visao-geral" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="metas">Metas do PEI</TabsTrigger>
            <TabsTrigger value="curricular">Por área curricular</TabsTrigger>
            <TabsTrigger value="socioemocional">Socioemocionais</TabsTrigger>
            <TabsTrigger value="comparativos">Comparativos</TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="mt-6 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4 text-lg font-semibold">Progresso medido nas avaliações</h3>
                {serie.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma avaliação com objetivos medidos. A série aparece quando houver avaliação
                    registrada para este estudante.
                  </p>
                ) : (
                  <>
                    {serie.length === 1 ? (
                      <p className="text-sm">
                        Uma única avaliação registrada, de {serie[0].data}: {serie[0].valor}%. Não há
                        série para traçar com um ponto só.
                      </p>
                    ) : (
                      <div
                        role="img"
                        aria-label="Gráfico de linhas do progresso medido em cada avaliação, em porcentagem. Os mesmos números estão na tabela abaixo."
                      >
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={serie}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="rotulo" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="valor"
                              stroke="hsl(var(--primary))"
                              strokeWidth={3}
                              dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    <ChartDataTable
                      caption="Progresso médio dos objetivos medidos em cada avaliação, em porcentagem."
                      columns={['Avaliação', 'Progresso medido']}
                      rows={serie.map((ponto) => [ponto.data, `${ponto.valor}%`])}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="mb-1 text-3xl font-bold text-primary">
                    {goals.length === 0 ? '—' : `${contagens.achieved}/${goals.length}`}
                  </div>
                  <p className="text-sm text-muted-foreground">Metas alcançadas no plano vigente</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="mb-1 text-3xl font-bold text-primary">
                    {progresso === undefined ? '—' : `${progresso}%`}
                  </div>
                  {/* O mesmo seletor e o mesmo rótulo da ficha: um número, um nome, um lugar. */}
                  <p className="text-sm text-muted-foreground">
                    {progresso === undefined ? 'Sem PEI vigente' : 'Progresso nas metas do PEI'}
                  </p>
                  {progresso !== undefined && <Progress value={progresso} className="mt-2 h-2" />}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="mb-1 text-3xl font-bold text-primary">{avaliacoes.length}</div>
                  <p className="text-sm text-muted-foreground">
                    {avaliacoes.length === 1 ? 'Avaliação registrada' : 'Avaliações registradas'}
                    {ultima ? `, a última em ${formatLocalDate(ultima.date)}` : ''}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-warning" aria-hidden="true" />
                  <h3 className="text-lg font-semibold">Conquistas e próximos passos</h3>
                </div>
                {!ultima ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma avaliação registrada para este estudante.
                  </p>
                ) : (
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      {assessmentKindLabel(ultima.kind)} de {formatLocalDate(ultima.date)}, por{' '}
                      {ultima.assessor}
                    </p>
                    <p>
                      <span className="font-medium">Conquistas:</span> {ultima.summary.achievements}
                    </p>
                    <p>
                      <span className="font-medium">Desafios:</span> {ultima.summary.challenges}
                    </p>
                    <p>
                      <span className="font-medium">Próximos passos:</span> {ultima.summary.nextSteps}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metas" className="mt-6">
            <PeiGoalProgressList goals={goals} vazio="Sem PEI vigente: não há metas para medir." />
          </TabsContent>

          <TabsContent value="curricular" className="mt-6 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4 text-lg font-semibold">Língua Portuguesa, na avaliação</h3>
                {!ultima ? (
                  <p className="text-sm text-muted-foreground">Nenhuma avaliação registrada.</p>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      Níveis registrados na avaliação de {formatLocalDate(ultima.date)}.
                    </p>
                    <p>
                      <span className="font-medium">Leitura:</span>{' '}
                      {performanceLevelLabel(ultima.languageArts.reading)}
                    </p>
                    <p>
                      <span className="font-medium">Escrita:</span>{' '}
                      {performanceLevelLabel(ultima.languageArts.writing)}
                    </p>
                    <p>
                      <span className="font-medium">Fala:</span>{' '}
                      {performanceLevelLabel(ultima.languageArts.speaking)}
                    </p>
                    {ultima.languageArts.notes && (
                      <p>
                        <span className="font-medium">Observações:</span> {ultima.languageArts.notes}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <PeiGoalProgressList
              goals={goals}
              areas={AREAS_CURRICULARES}
              vazio="Nenhuma meta de componente curricular no plano vigente."
            />
          </TabsContent>

          <TabsContent value="socioemocional" className="mt-6 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4 text-lg font-semibold">Socioemocional, na avaliação</h3>
                {!ultima ? (
                  <p className="text-sm text-muted-foreground">Nenhuma avaliação registrada.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {[
                      { rotulo: 'Reconhece as próprias emoções', valor: ultima.socioEmotional.recognizesEmotions },
                      { rotulo: 'Lida com a frustração', valor: ultima.socioEmotional.managesFrustration },
                      { rotulo: 'Pede ajuda quando precisa', valor: ultima.socioEmotional.asksForHelp },
                    ].map((item) => (
                      <li key={item.rotulo} className="flex flex-wrap items-center justify-between gap-2">
                        <span>{item.rotulo}</span>
                        {/* O estado está escrito, não só na cor do selo. */}
                        <Badge variant={item.valor ? 'default' : 'outline'}>
                          {item.valor ? 'Sim, na última avaliação' : 'Ainda não, na última avaliação'}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <PeiGoalProgressList
              goals={goals}
              areas={AREAS_SOCIOEMOCIONAIS}
              vazio="Nenhuma meta socioemocional no plano vigente."
            />
          </TabsContent>

          <TabsContent value="comparativos" className="mt-6">
            <Card>
              <CardContent className="space-y-2 pt-6 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Não há comparação para mostrar.</p>
                <p>
                  Comparar este estudante com um grupo exigiria base governada, com coorte e período
                  definidos, anonimização verificável e tamanho mínimo de grupo. Nada disso existe neste
                  protótipo, e qualquer número comparativo aqui seria inventado. Os requisitos estão
                  listados na ficha do estudante, na seção de benchmarking.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
