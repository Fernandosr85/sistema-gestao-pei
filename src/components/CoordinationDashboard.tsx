import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileCheck, 
  GraduationCap, 
  Wrench,
  Eye,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CoordinationDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CoordinationDashboard({ open, onOpenChange }: CoordinationDashboardProps) {
  const classData = [
    { 
      turma: 'EF1-1A', 
      total: 25, 
      comPEI: 3, 
      implementacao: 85, 
      alertas: 1, 
      alertLevel: 'warning' 
    },
    { 
      turma: 'EF1-2B', 
      total: 28, 
      comPEI: 5, 
      implementacao: 95, 
      alertas: 0, 
      alertLevel: 'success' 
    },
    { 
      turma: 'EF1-3C', 
      total: 26, 
      comPEI: 4, 
      implementacao: 70, 
      alertas: 2, 
      alertLevel: 'error' 
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Dashboard de Coordenação</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cards de Visão Geral */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Estudantes com PEI</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>TDAH:</span> <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TEA:</span> <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dislexia:</span> <span className="font-medium">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Status dos PEIs</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Implementados</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Revisão</span>
                    <span className="font-medium">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Pendentes</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Formação Docente</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground mt-1">Professores capacitados</p>
                <div className="mt-3 text-xs">
                  <div className="flex justify-between">
                    <span>Horas (mês):</span>
                    <span className="font-medium">45h</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Próxima formação:</span>
                    <span className="font-medium">15/12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recursos</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Prof. de apoio:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Salas AEE:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tec. Assistivas:</span>
                    <span className="font-medium">15</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Indicadores de Qualidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Indicadores de Qualidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Taxa de implementação PEI</span>
                    <span className="font-medium">85% ⚠️</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground">Meta: 90%</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Formação docente</span>
                    <span className="font-medium">45h/ano ✅</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-xs text-muted-foreground">Meta: 40h</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Satisfação famílias</span>
                    <span className="font-medium">88% ✅</span>
                  </div>
                  <Progress value={88} className="h-2" />
                  <p className="text-xs text-muted-foreground">Meta: 80%</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progressão dos estudantes</span>
                    <span className="font-medium">82% ✅</span>
                  </div>
                  <Progress value={82} className="h-2" />
                  <p className="text-xs text-muted-foreground">Meta: 75%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Acompanhamento */}
          <Card>
            <CardHeader>
              <CardTitle>Acompanhamento por Turma</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Turma</TableHead>
                    <TableHead>Total Alunos</TableHead>
                    <TableHead>Com PEI</TableHead>
                    <TableHead>% Implementação</TableHead>
                    <TableHead>Alertas</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classData.map((row) => (
                    <TableRow key={row.turma}>
                      <TableCell className="font-medium">{row.turma}</TableCell>
                      <TableCell>{row.total}</TableCell>
                      <TableCell>{row.comPEI}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={row.implementacao} className="h-2 w-20" />
                          <span className="text-sm">{row.implementacao}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            row.alertLevel === 'success' ? 'default' : 
                            row.alertLevel === 'warning' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {row.alertLevel === 'success' ? '🟢' : 
                           row.alertLevel === 'warning' ? '🟡' : '🔴'} {row.alertas}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Próximas Ações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Próximas Ações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Revisar PEI de Maria Silva</p>
                    <p className="text-xs text-muted-foreground">Vence em 5 dias</p>
                  </div>
                  <Badge variant="destructive">Urgente</Badge>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Agendar reunião com família João Santos</p>
                    <p className="text-xs text-muted-foreground">Atrasada</p>
                  </div>
                  <Badge variant="secondary">Atenção</Badge>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Formação sobre TEA para Prof. Ana Costa</p>
                    <p className="text-xs text-muted-foreground">Agendada 15/12</p>
                  </div>
                  <Badge>Normal</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
