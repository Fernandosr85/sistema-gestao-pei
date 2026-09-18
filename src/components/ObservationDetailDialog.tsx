import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Clock, MapPin, User, FileText, Target, 
  TrendingUp, TrendingDown, Wrench, CheckCircle2, 
  AlertCircle, Camera, Video, Bell,
  Edit, FileDown, Mail, Trash2
} from 'lucide-react';
import DemoDataNotice from '@/components/DemoDataNotice';
import { formatLocalDate } from '@/lib/date';
import { classLabelOf } from '@/lib/report';
import { studentNameOf } from '@/lib/metrics';
import { useDemoStore } from '@/store/useDemoStore';
import { StructuredObservation } from '@/types';

interface ObservationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  observation: StructuredObservation | null;
}

export function ObservationDetailDialog({ open, onOpenChange, observation }: ObservationDetailDialogProps) {
  const { state } = useDemoStore();
  if (!observation) return null;

  // Class and enrollment come from the observed student; they used to be another student's, fixed in the code.
  const student = state.students.find((item) => item.id === observation.studentId);

  const situacoes = observation.comunicacao.situacoes.filter((item) => item.contexto.trim() || item.resposta.trim());
  const interacoes = observation.habilidadesSociais.interacoes.filter((item) => item.tipo.trim() || item.descricao.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Detalhes da Observação
          </DialogTitle>
          <DialogDescription>
            Registro completo da observação, com identificação do estudante, descrição e
            metadados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h2 className="text-xl font-bold">{studentNameOf(state, observation.studentId)}</h2>
            {student && (
              <p className="text-sm text-muted-foreground">
                {classLabelOf(student)} | Matrícula: {student.matricula}
              </p>
            )}
          </div>

          <DemoDataNotice
            subject="O horário, o local, os objetivos do PEI, os detalhamentos, as comparações, as evidências, as observações adicionais, as notificações e os metadados deste detalhe"
            detail="Vêm da observação registrada só a data, a duração, o observador, as situações de comunicação, as interações sociais, o resumo e os comportamentos listados."
          />

          {/* General Information */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <h3 className="font-semibold text-lg mb-4">Informações Gerais</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Data:</strong> {formatLocalDate(observation.data)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Horário:</strong> 08:30 - 10:30 ({observation.duracao} minutos)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Local:</strong> Sala de Aula Regular
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Observador:</strong> {observation.observador}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <strong>Relacionado a:</strong>
                    <ul className="list-disc list-inside mt-1 text-muted-foreground">
                      <li>Objetivo PEI #3: Melhorar transições entre atividades</li>
                      <li>Objetivo PEI #7: Aumentar participação em atividades coletivas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication and social skills, as recorded */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Comunicação e habilidades sociais registradas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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

          {/* Detailed Observation */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Observação Detalhada</h3>

              {/* Pontos Fortes */}
              <div className="p-4 border-l-4 border-success bg-success/5 rounded-r-lg space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <h4 className="font-semibold text-success">Pontos Fortes</h4>
                </div>
                <p className="font-medium">{observation.resumo.pontoForte}</p>
                
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-semibold">DETALHAMENTO:</p>
                  <p className="text-sm text-muted-foreground">
                    Demonstrou progresso significativo na comunicação verbal durante toda a manhã:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                    <li>Iniciou 3 conversas espontâneas com colegas</li>
                    <li>Respondeu a todas as perguntas feitas pela professora</li>
                    <li>Usou frases completas (5-7 palavras em média)</li>
                    <li>Manteve contato visual durante as interações</li>
                  </ul>

                  <div className="mt-3 p-3 bg-background rounded">
                    <p className="text-sm font-semibold mb-1">COMPARAÇÃO:</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span>• Semana passada: 1 interação verbal espontânea</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>• Esta semana: 3 interações verbais espontâneas</span>
                      </div>
                      <div className="flex items-center gap-2 text-success font-semibold">
                        <TrendingUp className="h-4 w-4" />
                        <span>Crescimento: +200%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desafios */}
              <div className="p-4 border-l-4 border-warning bg-warning/5 rounded-r-lg space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-warning" />
                  <h4 className="font-semibold text-warning">Desafios</h4>
                </div>
                <p className="font-medium">{observation.resumo.desafio}</p>
                
                <div className="mt-3 space-y-3">
                  <p className="text-sm font-semibold">DETALHAMENTO:</p>
                  <p className="text-sm text-muted-foreground">
                    Apresentou resistência em 2 das 4 transições:
                  </p>

                  <div className="space-y-3">
                    <div className="p-3 bg-background rounded">
                      <p className="text-sm font-semibold mb-2">TRANSIÇÃO 1: Arte → Matemática (09:15)</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 space-y-1">
                        <li>Comportamento: Recusou-se a guardar materiais</li>
                        <li>Duração da resistência: 8 minutos</li>
                        <li>Estratégia usada: Aviso verbal + contagem regressiva</li>
                        <li>Resultado: Aceitou após negociação (mais 2 minutos)</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-background rounded">
                      <p className="text-sm font-semibold mb-2">TRANSIÇÃO 2: Matemática → Recreio (10:00)</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 space-y-1">
                        <li>Comportamento: Dificuldade em interromper atividade</li>
                        <li>Duração: 5 minutos</li>
                        <li>Estratégia usada: Timer visual</li>
                        <li>Resultado: Tranquila após ver o timer</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 bg-background rounded">
                    <p className="text-sm font-semibold mb-1">GATILHOS IDENTIFICADOS:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                      <li>Atividades muito envolventes (arte, jogos)</li>
                      <li>Mudanças abruptas sem aviso prévio</li>
                      <li>Falta de suporte visual (timer, agenda)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Ajustes */}
              <div className="p-4 border-l-4 border-info bg-info/5 rounded-r-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-info" />
                  <h4 className="font-semibold text-info">Ajustes e Estratégias</h4>
                </div>
                <p className="font-medium">{observation.resumo.ajustesNecessarios}</p>
                
                <div className="mt-3 space-y-3">
                  <p className="text-sm font-semibold">PLANO DE AÇÃO:</p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-background rounded">
                      <p className="text-sm font-semibold mb-2">IMEDIATO (Esta semana):</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          Criar timer visual para transições
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          Estabelecer rotina de avisos (5 min, 2 min, agora)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          Usar prancha de CAA com sequência visual
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 bg-background rounded">
                      <p className="text-sm font-semibold mb-2">CURTO PRAZO (2-4 semanas):</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-muted-foreground rounded" />
                          Treinar o uso independente do timer
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-muted-foreground rounded" />
                          Criar história social sobre transições
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-muted-foreground rounded" />
                          Implementar sistema de recompensa
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 bg-background rounded">
                      <p className="text-sm font-semibold mb-2">RECURSOS NECESSÁRIOS:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                        <li>Timer visual (relógio de areia ou digital)</li>
                        <li>Prancha de rotina com pictogramas</li>
                        <li>História social impressa</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comportamentos Observados */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Comportamentos Observados</h3>

              {observation.comportamento.positivos.map((comportamento, idx) => (
                <div key={idx} className="p-4 bg-success/5 border border-success/20 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <p className="font-medium">{comportamento}</p>
                  </div>
                  <div className="ml-7 space-y-2 text-sm text-muted-foreground">
                    <p><strong>📍 Contexto:</strong> {idx === 0 ? 'Fila para o bebedouro' : 'Pintura com tinta guache'}</p>
                    <p><strong>⏰ Horário:</strong> {idx === 0 ? '09:45' : '08:45 - 09:15 (30 minutos)'}</p>
                    <p>
                      <strong>📝 Observação:</strong> {idx === 0 
                        ? 'Aguardou pacientemente por 3 minutos sem necessidade de intervenção. Manteve-se calma e não tentou furar a fila como em observações anteriores.'
                        : 'Participou ativamente da atividade de pintura. Mostrou criatividade ao escolher cores e compartilhou materiais com os colegas sem resistência.'}
                    </p>
                  </div>
                </div>
              ))}

              {observation.comportamento.desafiadores.map((comportamento, idx) => (
                <div key={idx} className="p-4 bg-warning/5 border border-warning/20 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    <p className="font-medium">{comportamento}</p>
                  </div>
                  <div className="ml-7 space-y-2 text-sm text-muted-foreground">
                    <p><strong>📍 Contexto:</strong> Final da atividade livre</p>
                    <p><strong>⏰ Horário:</strong> 09:15</p>
                    <p><strong>📝 Observação:</strong> Ao ser solicitada a guardar os blocos de montar, inicialmente recusou e disse "ainda não acabei".</p>
                    
                    <div className="mt-3 p-3 bg-background rounded">
                      <p className="font-semibold mb-2">🔄 Intervenção realizada:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>A professora ofereceu aviso prévio: "Mais 2 minutos"</li>
                        <li>Usou timer visual</li>
                        <li>Negociou: "Vamos guardar juntas?"</li>
                        <li>Aceitou após os 2 minutos</li>
                      </ol>
                      <p className="mt-2"><strong>⏱️ Tempo de resistência:</strong> 8 minutos</p>
                      <p><strong>✅ Resultado:</strong> Guardou com ajuda verbal</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Evidências */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Evidências Anexadas (3)</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center space-y-2">
                  <div className="w-full aspect-square bg-muted rounded flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">Trabalho de arte</p>
                </div>
                <div className="p-4 border rounded-lg text-center space-y-2">
                  <div className="w-full aspect-square bg-muted rounded flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">Registro da atividade</p>
                </div>
                <div className="p-4 border rounded-lg text-center space-y-2">
                  <div className="w-full aspect-square bg-muted rounded flex items-center justify-center">
                    <Video className="h-8 w-8 text-muted-foreground" />
                    <span className="absolute text-xs">▶️ 1:30</span>
                  </div>
                  <p className="text-sm font-medium">Transição difícil</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações Adicionais */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Observações Adicionais</h3>
              <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground space-y-2">
                <p>
                  Esta manhã foi particularmente produtiva, com avanços
                  significativos na comunicação e engajamento nas atividades propostas.
                </p>
                <p>
                  A questão das transições continua sendo um desafio, mas as estratégias de negociação 
                  e avisos prévios têm se mostrado eficazes. A implementação de suportes visuais 
                  permanentes deve ajudar a reduzir essas dificuldades.
                </p>
                <p>
                  Recomendo manter a comunicação próxima com a família para alinhar estratégias 
                  e garantir continuidade em casa.
                </p>
                <p className="pt-2 font-medium text-foreground">- {observation.observador}</p>
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <h3 className="font-semibold text-lg mb-4">Notificações Enviadas</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                  <Bell className="h-5 w-5 text-success mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">Família - {formatLocalDate(observation.data)} 10:45</p>
                    <p className="text-muted-foreground">Status: Visualizado às 11:30</p>
                    <p className="mt-2 p-2 bg-background rounded">
                      💬 Resposta: "Obrigada pelo retorno! Vamos implementar o timer em casa também."
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">Coordenação Pedagógica - {formatLocalDate(observation.data)} 10:45</p>
                    <p className="text-muted-foreground">Status: Visualizado às 14:20</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadados */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Metadados</h3>
              <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <p><strong>Criado em:</strong> {formatLocalDate(observation.data)} 10:35</p>
                <p><strong>Última edição:</strong> {formatLocalDate(observation.data)} 10:40</p>
                <p><strong>Editado por:</strong> {observation.observador}</p>
                <p><strong>Visibilidade:</strong> Equipe pedagógica + Família</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button variant="outline" size="sm" disabled aria-describedby="observacao-acoes-indisponiveis">
              <Edit className="h-4 w-4 mr-2" />
              Editar Observação
            </Button>
            <Button variant="outline" size="sm" disabled aria-describedby="observacao-acoes-indisponiveis">
              <FileDown className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline" size="sm" disabled aria-describedby="observacao-acoes-indisponiveis">
              <Mail className="h-4 w-4 mr-2" />
              Reenviar Notificação
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              disabled
              aria-describedby="observacao-acoes-indisponiveis"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
            <p id="observacao-acoes-indisponiveis" className="w-full text-xs text-muted-foreground">
              Editar, excluir, exportar e reenviar notificação não estão disponíveis neste protótipo. Nenhuma
              observação é excluída.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
