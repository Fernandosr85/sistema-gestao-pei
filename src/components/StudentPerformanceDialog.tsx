import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Download, Share2, Printer, TrendingUp, Target, BookOpen, Users, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartDataTable from '@/components/ChartDataTable';

const progressData = [
  { trimestre: '1º Tri', valor: 65 },
  { trimestre: '2º Tri', valor: 72 },
  { trimestre: '3º Tri', valor: 78 },
  { trimestre: '4º Tri', valor: 85 },
];

const objectives = [
  { area: 'Língua Portuguesa', items: [
    { name: 'Ler palavras simples', progress: 80, status: 'warning' },
    { name: 'Escrever nome completo', progress: 100, status: 'success' },
    { name: 'Recontar histórias', progress: 40, status: 'danger' },
  ]},
  { area: 'Matemática', items: [
    { name: 'Contar até 50', progress: 70, status: 'warning' },
    { name: 'Somar até 10', progress: 50, status: 'warning' },
  ]},
  { area: 'Habilidades Sociais', items: [
    { name: 'Interagir com colegas', progress: 80, status: 'success' },
    { name: 'Pedir ajuda', progress: 100, status: 'success' },
  ]},
];

/*
 * Saíram "Uso autônomo da prancha de CAA" e "Redução de 60% nas crises de ansiedade":
 * uma necessidade de comunicação e um quadro de saúde mental, com número inventado,
 * exibidos como conquista de qualquer estudante que abrisse este diálogo.
 */
const achievements = [
  'Leitura independente de textos curtos',
  'Participação ativa em trabalhos em grupo',
];

interface StudentPerformanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
}

export const StudentPerformanceDialog = ({ open, onOpenChange, studentName }: StudentPerformanceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">DESEMPENHO - {studentName.toUpperCase()}</DialogTitle>
            <DialogDescription>
              Evolução por trimestre, objetivos do PEI e desempenho por matéria.
            </DialogDescription>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled aria-describedby="desempenho-acoes-indisponiveis">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm" disabled aria-describedby="desempenho-acoes-indisponiveis">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" size="sm" disabled aria-describedby="desempenho-acoes-indisponiveis">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </div>
          <p id="desempenho-acoes-indisponiveis" className="text-xs text-muted-foreground">
            Exportar, compartilhar e imprimir não estão implementados neste protótipo.
          </p>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="pei">Objetivos PEI</TabsTrigger>
            <TabsTrigger value="subjects">Por Matéria</TabsTrigger>
            <TabsTrigger value="social">Socioemocionais</TabsTrigger>
            <TabsTrigger value="compare">Comparativos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Progresso Geral no Ano */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">PROGRESSO GERAL NO ANO</h3>
                <div
                  role="img"
                  aria-label="Gráfico de linhas da evolução do desempenho por trimestre, em porcentagem. Os mesmos números estão na tabela abaixo."
                >
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="trimestre" stroke="hsl(var(--muted-foreground))" />
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

                <ChartDataTable
                  caption="Desempenho por trimestre, em porcentagem."
                  columns={['Trimestre', 'Desempenho']}
                  rows={progressData.map((ponto) => [ponto.trimestre, `${ponto.valor}%`])}
                />
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    1º Tri: 65% → 2º Tri: 72% → 3º Tri: 78% → 4º Tri: 85%
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-2 text-success">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">Crescimento: +20 pontos percentuais ✅</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métricas em Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="pt-6 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold text-primary mb-1">12/15</div>
                  <div className="text-sm text-muted-foreground mb-3">Alcançados</div>
                  <Progress value={80} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-2">80%</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-success/10 to-success/5">
                <CardContent className="pt-6 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-success" />
                  <div className="text-3xl font-bold text-success mb-1">94%</div>
                  <div className="text-sm text-muted-foreground mb-3">Presença</div>
                  <Progress value={94} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-2">Frequência</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <div className="text-3xl font-bold text-accent mb-1">Bom</div>
                  <div className="text-sm text-muted-foreground mb-3">Integração</div>
                  <Progress value={70} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-2">70%</div>
                </CardContent>
              </Card>
            </div>

            {/* Conquistas do Trimestre */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-warning" />
                  <h3 className="text-lg font-semibold">CONQUISTAS DO TRIMESTRE</h3>
                </div>
                <div className="space-y-2">
                  {achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-success/5 rounded-lg border border-success/20">
                      <span className="text-success font-bold">✅</span>
                      <span className="text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pei" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">OBJETIVOS PEI - STATUS ATUAL</h3>
                <div className="space-y-6">
                  {objectives.map((category, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold text-foreground mb-3">{category.area}:</h4>
                      <div className="space-y-3 ml-4">
                        {category.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">• {item.name}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={item.progress} className="w-24 h-2" />
                                <span className="text-sm font-semibold w-12">{item.progress}%</span>
                                <Badge 
                                  variant={
                                    item.status === 'success' ? 'default' : 
                                    item.status === 'warning' ? 'secondary' : 
                                    'destructive'
                                  }
                                  className="px-2"
                                >
                                  {item.status === 'success'
                                    ? 'Alcançado'
                                    : item.status === 'warning'
                                      ? 'Em progresso'
                                      : 'Atenção'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="mt-6">
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>Detalhamento por matéria em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>Habilidades socioemocionais em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compare" className="mt-6">
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>Análise comparativa em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
