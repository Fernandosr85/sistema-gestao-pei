import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar, Clock, User, FileText, Target,
  TrendingUp, TrendingDown, Wrench, CheckCircle2,
  AlertCircle, Edit, FileDown, Mail, Trash2,
} from 'lucide-react';
import DemoDataNotice from '@/components/DemoDataNotice';
import { formatLocalDate } from '@/lib/date';
import { classLabelOf } from '@/lib/report';
import { studentNameOf } from '@/lib/metrics';
import { goalsCitingSource, peiGoalAreaLabel } from '@/lib/pei';
import { useDemoStore } from '@/store/useDemoStore';
import { StructuredObservation } from '@/types';

interface ObservationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  observation: StructuredObservation | null;
}

/**
 * O detalhe de uma observação registrada.
 *
 * O QUE ESTE DIÁLOGO INVENTAVA, até a Etapa 9: horário e local fixos; "Objetivo PEI #3" e "#7",
 * que não existiam em lugar nenhum; blocos de DETALHAMENTO com números ("3 conversas
 * espontâneas", "+200% em relação à semana passada"), transições com horário e duração, gatilhos
 * identificados e um plano de ação em três prazos; contexto e horário por índice de
 * comportamento; três evidências anexadas; um texto de "Observações Adicionais" ASSINADO pelo
 * observador; notificações enviadas com horário de leitura e uma RESPOSTA DA FAMÍLIA entre
 * aspas; e metadados de criação e edição. Nada disso estava no registro.
 *
 * Os dois últimos são a classe do achado 1 na forma mais direta: texto fictício atribuído, com
 * nome, a quem não escreveu — uma professora e uma mãe.
 *
 * O QUE FICA: o que a observação tem. E uma ligação que agora existe de verdade: as metas do PEI
 * cujas notas citam esta observação como evidência (`PeiGoalNote.source`), percorrida ao
 * contrário. "Relacionado a" deixou de ser enfeite e passou a ser o grafo do registro.
 */
export function ObservationDetailDialog({ open, onOpenChange, observation }: ObservationDetailDialogProps) {
  const { state } = useDemoStore();
  if (!observation) return null;

  // Class and enrollment come from the observed student; they used to be another student's, fixed in the code.
  const student = state.students.find((item) => item.id === observation.studentId);

  const situacoes = observation.comunicacao.situacoes.filter((item) => item.contexto.trim() || item.resposta.trim());
  const interacoes = observation.habilidadesSociais.interacoes.filter((item) => item.tipo.trim() || item.descricao.trim());
  const metas = goalsCitingSource(state, 'observation', observation.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6" aria-hidden="true" />
            Detalhes da observação
          </DialogTitle>
          <DialogDescription>
            Registro completo da observação, com identificação do estudante, o que foi observado e
            as metas do PEI que a citam.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-lg bg-muted/50 p-4">
            <h2 className="text-xl font-bold">{studentNameOf(state, observation.studentId)}</h2>
            {student && (
              <p className="text-sm text-muted-foreground">
                {classLabelOf(student)} | Matrícula: {student.matricula}
              </p>
            )}
          </div>

          <DemoDataNotice
            // O componente completa com "... são exemplos estáticos": o sujeito entra no plural.
            subject="Os textos desta observação"
            detail="É o registro de demonstração, com texto fictício. Tudo o que aparece aqui foi gravado na observação ou vem das metas que a citam; o diálogo não acrescenta nada."
          />

          <Card>
            <CardContent className="space-y-3 pt-6">
              <h3 className="mb-4 text-lg font-semibold">Informações gerais</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm">
                    <strong>Data:</strong> {formatLocalDate(observation.data)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {/* Horário e local saíram: a observação registra período e duração, não hora. */}
                  <span className="text-sm">
                    <strong>Período:</strong> {observation.periodo === 'manha' ? 'Manhã' : 'Tarde'} ·{' '}
                    {observation.duracao} minutos
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm">
                    <strong>Observador:</strong> {observation.observador}
                  </span>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-start gap-2">
                  <Target className="mt-0.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <div className="text-sm">
                    <strong>Metas do PEI que citam esta observação:</strong>
                    {metas.length === 0 ? (
                      <p className="mt-1 text-muted-foreground">
                        Nenhuma meta cita esta observação como evidência.
                      </p>
                    ) : (
                      <ul className="mt-1 list-inside list-disc text-muted-foreground">
                        {metas.map((meta) => (
                          <li key={meta.id}>
                            {meta.title} ({peiGoalAreaLabel(meta.area)})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="text-lg font-semibold">Comunicação e habilidades sociais registradas</h3>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Situações de comunicação</h4>
                  {situacoes.length === 0 ? (
                    <p className="text-muted-foreground">Nenhuma situação registrada.</p>
                  ) : (
                    <ul className="space-y-2">
                      {situacoes.map((situacao, idx) => (
                        <li key={idx} className="rounded-md border p-3">
                          <p className="font-medium">{situacao.contexto}</p>
                          <p className="text-muted-foreground">{situacao.resposta}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Interações sociais</h4>
                  {interacoes.length === 0 ? (
                    <p className="text-muted-foreground">Nenhuma interação registrada.</p>
                  ) : (
                    <ul className="space-y-2">
                      {interacoes.map((interacao, idx) => (
                        <li key={idx} className="rounded-md border p-3">
                          <p className="font-medium">{interacao.tipo}</p>
                          <p className="text-muted-foreground">{interacao.descricao}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="mb-4 text-lg font-semibold">Resumo do observador</h3>

              <div className="space-y-2 rounded-r-lg border-l-4 border-success bg-success/5 p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" aria-hidden="true" />
                  <h4 className="font-semibold text-success">Ponto forte</h4>
                </div>
                <p>{observation.resumo.pontoForte}</p>
              </div>

              <div className="space-y-2 rounded-r-lg border-l-4 border-warning bg-warning/5 p-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-warning" aria-hidden="true" />
                  <h4 className="font-semibold text-warning">Desafio</h4>
                </div>
                <p>{observation.resumo.desafio}</p>
              </div>

              <div className="space-y-2 rounded-r-lg border-l-4 border-info bg-info/5 p-4">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-info" aria-hidden="true" />
                  <h4 className="font-semibold text-info">Ajustes necessários</h4>
                </div>
                <p>{observation.resumo.ajustesNecessarios}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="mb-4 text-lg font-semibold">Comportamentos observados</h3>

              {observation.comportamento.positivos.length === 0 &&
              observation.comportamento.desafiadores.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum comportamento registrado.</p>
              ) : (
                <>
                  {observation.comportamento.positivos.map((comportamento, idx) => (
                    <div
                      key={`positivo-${idx}`}
                      className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-4"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                      {/* O tipo está escrito no cabeçalho de cada bloco, não só na cor da borda. */}
                      <p>
                        <span className="sr-only">Comportamento positivo: </span>
                        {comportamento}
                      </p>
                    </div>
                  ))}
                  {observation.comportamento.desafiadores.map((comportamento, idx) => (
                    <div
                      key={`desafiador-${idx}`}
                      className="flex items-center gap-2 rounded-lg border border-warning/20 bg-warning/5 p-4"
                    >
                      <AlertCircle className="h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
                      <p>
                        <span className="sr-only">Comportamento desafiador: </span>
                        {comportamento}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3 border-t pt-4">
            <Button variant="outline" size="sm" disabled aria-describedby="observacao-acoes-indisponiveis">
              <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
              Editar observação
            </Button>
            <Button variant="outline" size="sm" disabled aria-describedby="observacao-acoes-indisponiveis">
              <FileDown className="mr-2 h-4 w-4" aria-hidden="true" />
              Exportar PDF
            </Button>
            <Button variant="outline" size="sm" disabled aria-describedby="observacao-acoes-indisponiveis">
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              Notificar a família
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              disabled
              aria-describedby="observacao-acoes-indisponiveis"
            >
              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Excluir
            </Button>
            <p id="observacao-acoes-indisponiveis" className="w-full text-xs text-muted-foreground">
              Editar, excluir, exportar e notificar não estão disponíveis neste protótipo. Nenhuma
              observação é excluída, e nenhuma notificação é enviada.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
