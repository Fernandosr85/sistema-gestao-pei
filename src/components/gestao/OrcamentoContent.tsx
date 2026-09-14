import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  Calendar,
  FileText
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DemoDataNotice from '@/components/DemoDataNotice';

interface BudgetCategory {
  categoria: string;
  orcado: number;
  executado: number;
  percentual: number;
}

interface MonthlyTrend {
  mes: string;
  orcado: number;
  executado: number;
}

interface ProgrammedExpense {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  status: 'Aprovado' | 'Pendente' | 'Executado';
}

interface PendingApproval {
  id: string;
  solicitante: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  status: 'Aguardando' | 'Em Análise';
}

const OrcamentoContent = () => {
  // Annual Budget Summary
  const budgetSummary = {
    total: 850000,
    executado: 623450,
    projecaoDezembro: 812300,
    saldoFinal: 37700,
    percentualExecutado: 73.3,
    status: 'normal' as 'critical' | 'warning' | 'normal'
  };

  // Budget by Category
  const categoryData: BudgetCategory[] = [
    { categoria: 'Pessoal', orcado: 450000, executado: 342500, percentual: 76.1 },
    { categoria: 'Mat. Pedagógico', orcado: 150000, executado: 118200, percentual: 78.8 },
    { categoria: 'Formação Continuada', orcado: 80000, executado: 52300, percentual: 65.4 },
    { categoria: 'Tecnologia', orcado: 120000, executado: 87450, percentual: 72.9 },
    { categoria: 'Outros', orcado: 50000, executado: 23000, percentual: 46.0 }
  ];

  // Monthly Spending Trend
  const monthlyData: MonthlyTrend[] = [
    { mes: 'Jan', orcado: 70833, executado: 68200 },
    { mes: 'Fev', orcado: 70833, executado: 72150 },
    { mes: 'Mar', orcado: 70833, executado: 69800 },
    { mes: 'Abr', orcado: 70833, executado: 71900 },
    { mes: 'Mai', orcado: 70833, executado: 73400 },
    { mes: 'Jun', orcado: 70833, executado: 68000 },
    { mes: 'Jul', orcado: 70833, executado: 74200 },
    { mes: 'Ago', orcado: 70833, executado: 72850 },
    { mes: 'Set', orcado: 70833, executado: 71200 },
    { mes: 'Out', orcado: 70833, executado: 0 },
    { mes: 'Nov', orcado: 70833, executado: 0 },
    { mes: 'Dez', orcado: 70833, executado: 0 }
  ];

  // Programmed Expenses
  const programmedExpenses: ProgrammedExpense[] = [
    { id: '1', descricao: 'Material Didático - 4º Trimestre', categoria: 'Mat. Pedagógico', valor: 28500, data: '15/10/2024', status: 'Aprovado' },
    { id: '2', descricao: 'Capacitação Docente - ABA', categoria: 'Formação Continuada', valor: 15200, data: '20/10/2024', status: 'Aprovado' },
    { id: '3', descricao: 'Licenças Software Educacional', categoria: 'Tecnologia', valor: 12800, data: '01/11/2024', status: 'Pendente' },
    { id: '4', descricao: 'Equipamentos Sensoriais', categoria: 'Mat. Pedagógico', valor: 34600, data: '15/11/2024', status: 'Pendente' }
  ];

  // Pending Approvals
  const pendingApprovals: PendingApproval[] = [
    { id: '1', solicitante: 'Profª. Ana Beatriz', descricao: 'Livros paradidáticos adaptados', categoria: 'Mat. Pedagógico', valor: 3200, data: '25/09/2024', prioridade: 'Alta', status: 'Aguardando' },
    { id: '2', solicitante: 'Dr. João Santos', descricao: 'Material de terapia ocupacional', categoria: 'Mat. Pedagógico', valor: 5400, data: '26/09/2024', prioridade: 'Média', status: 'Em Análise' },
    { id: '3', solicitante: 'Coord. Maria Silva', descricao: 'Curso de LIBRAS para equipe', categoria: 'Formação Continuada', valor: 8900, data: '27/09/2024', prioridade: 'Média', status: 'Aguardando' },
    { id: '4', solicitante: 'Prof. Carlos Lima', descricao: 'Software de comunicação alternativa', categoria: 'Tecnologia', valor: 12500, data: '28/09/2024', prioridade: 'Alta', status: 'Em Análise' }
  ];

  // Benchmarking Data
  const benchmarkData = [
    { unidade: 'Unidade A (Nossa)', valor: 73.3, status: 'atual' },
    { unidade: 'Unidade B', valor: 68.5, status: 'normal' },
    { unidade: 'Unidade C', valor: 81.2, status: 'normal' },
    { unidade: 'Média da rede', valor: 75.8, status: 'media' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 border-red-200';
      case 'warning': return 'bg-yellow-100 border-yellow-200';
      default: return 'bg-green-100 border-green-200';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getExpenseStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprovado': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Pendente': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Executado': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Gestão &gt; Orçamento
      </div>

      <DemoDataNotice
        subject="Os valores orçamentários, percentuais de execução e projeções"
        detail="Não há razão contábil por trás destes números."
      />

      {/* Annual Budget Summary */}
      <Card className={`border-2 ${getStatusBg(budgetSummary.status)}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Resumo Orçamentário 2024
          </CardTitle>
          <CardDescription>Visão geral da execução financeira anual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Orçamento Total</p>
              <p className="text-3xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(budgetSummary.total)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Executado (até Set/24)</p>
              <p className="text-3xl font-bold text-blue-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(budgetSummary.executado)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {budgetSummary.percentualExecutado}% do orçamento
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Projeção Dezembro</p>
              <p className="text-3xl font-bold text-orange-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(budgetSummary.projecaoDezembro)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">95.6% do orçamento</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Saldo Final Previsto</p>
              <p className={`text-3xl font-bold ${getStatusColor(budgetSummary.status)}`}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(budgetSummary.saldoFinal)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {budgetSummary.saldoFinal > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm text-muted-foreground">4.4% do orçamento</span>
              </div>
            </div>
          </div>
          
          <Progress value={budgetSummary.percentualExecutado} className="mt-6" />

          {budgetSummary.percentualExecutado < 10 && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Atenção: Saldo abaixo de 10% do orçamento total. Revisar gastos programados.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Budget Execution by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Execução por Categoria
          </CardTitle>
          <CardDescription>Distribuição e utilização do orçamento por área</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <YAxis dataKey="categoria" type="category" width={150} />
              <Tooltip 
                formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
              />
              <Legend />
              <Bar dataKey="orcado" fill="#94a3b8" name="Orçado" />
              <Bar dataKey="executado" fill="#3b82f6" name="Executado" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-3">
            {categoryData.map((cat) => (
              <div key={cat.categoria} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold">{cat.categoria}</p>
                  <Progress value={cat.percentual} className="mt-2" />
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-lg">{cat.percentual}%</p>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cat.executado)} de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cat.orcado)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Spending Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tendência de Gastos Mensais
          </CardTitle>
          <CardDescription>Comparação entre orçamento planejado e gastos reais</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
              />
              <Legend />
              <Line type="monotone" dataKey="orcado" stroke="#94a3b8" name="Orçado" strokeWidth={2} />
              <Line type="monotone" dataKey="executado" stroke="#3b82f6" name="Executado" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Programmed Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Despesas Programadas
            </CardTitle>
            <CardDescription>Próximos gastos previstos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {programmedExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getExpenseStatusIcon(expense.status)}
                  <div>
                    <p className="font-semibold">{expense.descricao}</p>
                    <p className="text-sm text-muted-foreground">{expense.categoria}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.valor)}
                  </p>
                  <p className="text-sm text-muted-foreground">{expense.data}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Benchmarking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Comparativo com Outras Unidades
            </CardTitle>
            <CardDescription>Execução orçamentária - Percentual executado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {benchmarkData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${item.status === 'atual' ? 'font-bold' : ''}`}>
                    {item.unidade}
                  </span>
                  <span className={`font-semibold ${item.status === 'atual' ? 'text-blue-600' : ''}`}>
                    {item.valor}%
                  </span>
                </div>
                <Progress 
                  value={item.valor} 
                  className={item.status === 'atual' ? 'h-3' : 'h-2'}
                />
              </div>
            ))}
            <Alert className="mt-4 border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800 text-sm">
                Nossa unidade está 2.5 pontos percentuais abaixo da média da rede. Considerar aceleração de execução no 4º trimestre.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Aprovações Pendentes
          </CardTitle>
          <CardDescription>
            Solicitações aguardando análise ({pendingApprovals.length} pendentes)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Solicitante</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingApprovals.map((approval) => (
                <TableRow key={approval.id}>
                  <TableCell className="font-medium">{approval.solicitante}</TableCell>
                  <TableCell>{approval.descricao}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{approval.categoria}</TableCell>
                  <TableCell className="font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(approval.valor)}
                  </TableCell>
                  <TableCell className="text-sm">{approval.data}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(approval.prioridade)}>
                      {approval.prioridade}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
                      {approval.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Budget Planning 2025 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Planejamento Orçamentário 2025
          </CardTitle>
          <CardDescription>Projeção e planejamento para o próximo ano fiscal</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-200 bg-blue-50 mb-4">
            <AlertDescription className="text-blue-800">
              O planejamento orçamentário para 2025 deve ser iniciado até 15/10/2024. Considere os dados históricos de execução para definir metas realistas.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrcamentoContent;
