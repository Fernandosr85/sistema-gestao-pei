import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, TrendingUp, FileText, Printer, Download } from 'lucide-react';

interface VerPEIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
}

export function VerPEIDialog({ open, onOpenChange, studentName }: VerPEIDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-2">
            <DialogTitle className="text-xl">📋 Plano Educacional Individualizado (PEI)</DialogTitle>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Aluno: {studentName}</p>
              <p>Versão: PEI 2024 - 4º Trimestre | Período: Out/2024 a Dez/2024</p>
              <Badge className="bg-success mt-1">✅ Ativo</Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="visao-geral" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="visao-geral">📊 Visão Geral</TabsTrigger>
            <TabsTrigger value="objetivos">🎯 Objetivos</TabsTrigger>
            <TabsTrigger value="estrategias">📝 Estratégias</TabsTrigger>
            <TabsTrigger value="acompanhamento">📈 Acompanhamento</TabsTrigger>
            <TabsTrigger value="historico">📋 Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Identificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Data de elaboração</p>
                    <p className="font-medium">15/09/2024</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Responsável</p>
                    <p className="font-medium">Profª Marina Santos</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Próxima revisão</p>
                    <p className="font-medium">15/12/2024</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Diagnóstico</p>
                    <p className="font-medium">TEA Nível 1 (F84.0)</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-muted-foreground">Participantes</p>
                  <p className="font-medium">Mãe, Coordenação, Prof. de Apoio</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Perfil do Aluno</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-success mb-2">Pontos Fortes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Boa memória visual</li>
                    <li>Interesse por ciências</li>
                    <li>Concentração em atividades de interesse</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-warning mb-2">Desafios:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Interação social limitada</li>
                    <li>Dificuldade com mudanças de rotina</li>
                    <li>Comunicação verbal reduzida</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-2">Estilo de Aprendizagem:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Visual</li>
                    <li>Necessita rotinas claras</li>
                    <li>Responde bem a reforço positivo</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Progresso Atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Objetivos Alcançados</span>
                    <span className="font-bold">12/15 (80%)</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Em Progresso</span>
                    <span className="font-bold">3/15 (20%)</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="objetivos" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">📚 Língua Portuguesa (5 objetivos)</h3>
              
              <Card className="border-l-4 border-l-success">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <h4 className="font-semibold">Objetivo 1: Escrever nome completo</h4>
                    </div>
                    <Badge className="bg-success">Alcançado (100%)</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Data alcance:</span> 15/10/2024</p>
                    <p><span className="font-medium">Estratégias usadas:</span> Treino diário, modelo visual</p>
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      Ver evidências: 📷 3 fotos
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-warning">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-warning" />
                      <h4 className="font-semibold">Objetivo 2: Ler palavras simples</h4>
                    </div>
                    <Badge variant="secondary">Em progresso (80%)</Badge>
                  </div>
                  <Progress value={80} className="mb-3 h-2" />
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Estratégias:</span> Flashcards, leitura compartilhada</p>
                    <p><span className="font-medium">Próxima etapa:</span> Frases curtas</p>
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      Adicionar observação
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">➕ Matemática (4 objetivos)</h3>
              
              <Card className="border-l-4 border-l-warning">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-warning" />
                      <h4 className="font-semibold">Objetivo 1: Contar até 50</h4>
                    </div>
                    <Badge variant="secondary">Em progresso (70%)</Badge>
                  </div>
                  <Progress value={70} className="mb-3 h-2" />
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Estratégias:</span> Material concreto, contagem diária</p>
                    <p><span className="font-medium">Próxima etapa:</span> Contar até 100</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">🤝 Habilidades Sociais (6 objetivos)</h3>
              
              <Card className="border-l-4 border-l-success">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <h4 className="font-semibold">Objetivo 1: Pedir ajuda</h4>
                    </div>
                    <Badge className="bg-success">Alcançado (100%)</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Data alcance:</span> 05/11/2024</p>
                    <p><span className="font-medium">Estratégias usadas:</span> Prancha CAA, modelagem</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="estrategias" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Adaptações Curriculares</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Tempo estendido para atividades</li>
                  <li>Instruções visuais e escritas</li>
                  <li>Avaliações adaptadas</li>
                  <li>Ambiente com redução de estímulos</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recursos Necessários</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span>Prancha de comunicação alternativa</span>
                    <Badge className="bg-success">✅ Disponível</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Fones de ouvido para redução de ruído</span>
                    <Badge className="bg-success">✅ Disponível</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Cantinho da calma na sala</span>
                    <Badge className="bg-success">✅ Disponível</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Apoio Humano</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="font-medium">Profissional de apoio:</span> Professor(a) de Apoio F.</p>
                <p><span className="font-medium">Horas semanais:</span> 15h</p>
                <p><span className="font-medium">Apoio especializado:</span> AEE 2x por semana</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="acompanhamento" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Frequência de Avaliação</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Avaliações trimestrais com registro contínuo de progresso</p>
                <p className="text-muted-foreground mt-2">Próxima avaliação: 15/12/2024</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reuniões com Família</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Última reunião: 18/10/2024</p>
                <p>Próxima reunião: Fevereiro/2025</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver ata da última reunião
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico" className="space-y-4 mt-6">
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="bg-success mb-2">Ativo</Badge>
                      <h4 className="font-semibold">PEI 2024 - 4º Trimestre</h4>
                      <p className="text-sm text-muted-foreground">15/09/2024 - Profª Marina Santos</p>
                    </div>
                    <Button variant="outline" size="sm">Ver documento</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">PEI 2024 - 3º Trimestre</h4>
                      <p className="text-sm text-muted-foreground">15/06/2024 - Profª Marina Santos</p>
                    </div>
                    <Button variant="outline" size="sm">Ver documento</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">PEI 2024 - 2º Trimestre</h4>
                      <p className="text-sm text-muted-foreground">15/03/2024 - Profª Marina Santos</p>
                    </div>
                    <Button variant="outline" size="sm">Ver documento</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between gap-3 mt-6 pt-6 border-t">
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">✏️ Editar PEI</Button>
            <Button>📋 Nova Revisão</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
