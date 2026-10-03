import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Printer, Download } from 'lucide-react';
import DemoDataNotice from '@/components/DemoDataNotice';
import { PeiFollowUp } from '@/components/PeiFollowUp';
import { PeiGoalCard } from '@/components/PeiGoalCard';
import { formatLocalDate } from '@/lib/date';
import { studentNameOf } from '@/lib/metrics';
import {
  activePeiOf,
  goalCountsByStatus,
  goalsByArea,
  goalsOfPei,
  peiGoalAreaLabel,
  peiGoalsProgress,
  peiHistoryOf,
  peiStatusLabel,
} from '@/lib/pei';
import { useDemoStore } from '@/store/useDemoStore';
import type { Pei } from '@/types/pei';

const NOTICE_ID = 'pei-dados-ficticios';

const Lista = ({ itens }: { itens: string[] }) => (
  <ul className="list-inside list-disc space-y-1">
    {itens.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const CartaoDoPlano = ({ pei }: { pei: Pei }) => (
  <Card>
    <CardContent className="pt-6">
      <Badge className="mb-2" variant={pei.status === 'active' ? 'default' : 'secondary'}>
        {peiStatusLabel(pei.status)}
      </Badge>
      <h4 className="font-semibold">PEI {pei.term}</h4>
      <p className="text-sm text-muted-foreground">
        Vigência de {formatLocalDate(pei.startsOn)} a {formatLocalDate(pei.endsOn)} · elaborado em{' '}
        {formatLocalDate(pei.draftedOn)} por {pei.draftedBy}
      </p>
    </CardContent>
  </Card>
);

interface VerPEIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Id, não nome: o plano é procurado pelo estudante, e o nome é resolvido a partir dele. */
  studentId: string;
}

/**
 * O PEI do estudante, lido do store.
 *
 * O QUE ESTA TELA DIZIA ANTES. Até a Etapa 9 era um plano fixo, o mesmo para qualquer estudante:
 * perfil, objetivos com porcentagem, recursos, reuniões e histórico de três trimestres, com aviso
 * dizendo que nada daquilo era do estudante aberto. Na Etapa 2 ela foi a segunda onda do achado 1
 * — saiu o diagnóstico com CID que aparecia na identificação — e ficou honesta ao preço de não
 * mostrar PEI nenhum. Agora mostra o plano do estudante, ou diz que não há.
 *
 * ESTRUTURA. As cinco abas seguem as seis partes do manual (`src/pages/Manual.tsx`, seção 2):
 * identificação e perfil na Visão Geral, metas em Objetivos, adaptações e recursos em
 * Estratégias, avaliação e monitoramento em Acompanhamento, e o "vigente e histórico" (9.1) em
 * Histórico. Nenhum campo aqui é exigência legal; a regra está em `src/types/pei.ts`.
 */
export function VerPEIDialog({ open, onOpenChange, studentId }: VerPEIDialogProps) {
  const { state } = useDemoStore();
  const studentName = studentNameOf(state, studentId);
  const pei = activePeiOf(state, studentId);
  const history = peiHistoryOf(state, studentId);
  const goals = pei ? goalsOfPei(state, pei.id) : [];
  const progress = peiGoalsProgress(goals);
  const counts = goalCountsByStatus(goals);

  /*
   * Sem plano vigente a tela diz isso, e só isso. Não mostra 0%, que seria uma medida que ninguém
   * fez, nem a média da avaliação, que mede outra coisa. O histórico, se existir, continua
   * visível: plano encerrado é documentação (manual 9.1), não motivo para esconder a aba.
   */
  if (!pei) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Plano Educacional Individualizado (PEI)</DialogTitle>
            <DialogDescription>{studentName} não tem PEI vigente registrado.</DialogDescription>
          </DialogHeader>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sem PEI vigente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Nenhum plano com vigência aberta está registrado para este estudante. O sistema não
                exibe progresso nem metas enquanto não houver plano: número sem plano por trás seria
                invenção.
              </p>
              <p>
                Elaborar e editar PEI pela interface ainda não existe. Enquanto não existir, o plano
                entra pelos dados de demonstração.
              </p>
            </CardContent>
          </Card>

          {history.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Planos anteriores</h3>
              {history.map((anterior) => (
                <CartaoDoPlano key={anterior.id} pei={anterior} />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <div className="space-y-2">
            <DialogTitle className="text-xl">Plano Educacional Individualizado (PEI)</DialogTitle>
            <DialogDescription>
              Plano {peiStatusLabel(pei.status).toLowerCase()} de {studentName}: {pei.term}.
            </DialogDescription>
            <p className="text-sm text-muted-foreground">
              Vigência de {formatLocalDate(pei.startsOn)} a {formatLocalDate(pei.endsOn)}
            </p>
          </div>
        </DialogHeader>

        <DemoDataNotice
          id={NOTICE_ID}
          subject="Os dados deste PEI (perfil, metas, estratégias, recursos e revisões)"
          detail={`Vêm do registro de demonstração de ${studentName}, com conteúdo fictício. Editar PEI, criar revisão, adicionar observação na meta, baixar e imprimir continuam desabilitados: não há implementação por trás deles.`}
        />

        <Tabs defaultValue="visao-geral" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
            <TabsTrigger value="estrategias">Estratégias</TabsTrigger>
            <TabsTrigger value="acompanhamento">Acompanhamento</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Identificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Data de elaboração</p>
                    <p className="font-medium">{formatLocalDate(pei.draftedOn)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Responsável pela elaboração</p>
                    <p className="font-medium">{pei.draftedBy}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Próxima revisão</p>
                    <p className="font-medium">{formatLocalDate(pei.nextReviewOn)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Situação</p>
                    <p className="font-medium">{peiStatusLabel(pei.status)}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-muted-foreground">Participantes da elaboração</p>
                  <p className="font-medium">{pei.participants.join(', ')}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Perfil do estudante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="mb-2 font-semibold text-success">Pontos fortes</p>
                  <Lista itens={pei.profile.strengths} />
                </div>
                <div>
                  <p className="mb-2 font-semibold text-warning">Desafios</p>
                  <Lista itens={pei.profile.challenges} />
                </div>
                <div>
                  <p className="mb-2 font-semibold text-primary">Estilo de aprendizagem</p>
                  <Lista itens={pei.profile.learningStyle} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                {/*
                  * O rótulo diz de que o número é. Existe outro progresso no sistema — a média dos
                  * objetivos da avaliação mais recente —, e os dois não medem a mesma coisa.
                  */}
                <CardTitle className="text-base">Progresso nas metas do PEI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {progress === undefined ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma meta registrada neste plano, então não há progresso a calcular.
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Média das {goals.length} metas do plano</span>
                        <span className="font-bold">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <ul className="space-y-1 text-sm">
                      <li>Alcançadas: {counts.achieved} de {goals.length}</li>
                      <li>Em progresso: {counts.inProgress} de {goals.length}</li>
                      <li>Não iniciadas: {counts.notStarted} de {goals.length}</li>
                      <li>Precisam de revisão: {counts.needsReview} de {goals.length}</li>
                    </ul>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="objetivos" className="mt-6 space-y-6">
            {goals.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma meta registrada neste plano.</p>
            ) : (
              goalsByArea(goals).map((grupo) => (
                <div key={grupo.area} className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {peiGoalAreaLabel(grupo.area)} ({grupo.goals.length}{' '}
                    {grupo.goals.length === 1 ? 'meta' : 'metas'})
                  </h3>
                  {grupo.goals.map((goal) => (
                    <PeiGoalCard key={goal.id} goal={goal} noticeId={NOTICE_ID} />
                  ))}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="estrategias" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Adaptações curriculares</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {pei.adaptations.length === 0 ? (
                  <p className="text-muted-foreground">Nenhuma adaptação registrada.</p>
                ) : (
                  <Lista itens={pei.adaptations} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recursos necessários</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {pei.resources.length === 0 ? (
                  <p className="text-muted-foreground">Nenhum recurso registrado.</p>
                ) : (
                  <ul className="space-y-2">
                    {pei.resources.map((resource) => (
                      <li key={resource.name} className="flex flex-wrap items-center justify-between gap-2">
                        <span>{resource.name}</span>
                        {/* O estado está no texto do selo, não na cor dele. */}
                        <Badge className={resource.available ? 'bg-success' : undefined} variant={resource.available ? undefined : 'outline'}>
                          {resource.available ? 'Disponível' : 'Não disponível'}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Apoio humano</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Profissional de apoio:</span> {pei.humanSupport.professional}
                </p>
                <p>
                  <span className="font-medium">Horas semanais:</span> {pei.humanSupport.weeklyHours}h
                </p>
                <p>
                  <span className="font-medium">Apoio especializado:</span>{' '}
                  {pei.humanSupport.specializedSupport}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="acompanhamento" className="mt-6">
            <PeiFollowUp pei={pei} />
          </TabsContent>

          <TabsContent value="historico" className="mt-6 space-y-4">
            <CartaoDoPlano pei={pei} />
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum PEI anterior registrado. O manual pede que o plano vigente e o histórico fiquem
                documentados (seção 9.1); o histórico passa a existir quando um plano é encerrado e
                outro entra em vigência.
              </p>
            ) : (
              history.map((anterior) => <CartaoDoPlano key={anterior.id} pei={anterior} />)
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex flex-wrap justify-between gap-3 border-t pt-6">
          <div className="flex gap-2">
            <Button variant="outline" disabled aria-describedby={NOTICE_ID}>
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Baixar PDF
            </Button>
            <Button variant="outline" disabled aria-describedby={NOTICE_ID}>
              <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
              Imprimir
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled aria-describedby={NOTICE_ID}>
              Editar PEI
            </Button>
            <Button disabled aria-describedby={NOTICE_ID}>
              Nova revisão
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
