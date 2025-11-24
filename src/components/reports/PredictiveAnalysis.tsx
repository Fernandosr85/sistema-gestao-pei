import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';

const projectionData = [
  { month: 'Jan', historico: 2, projecao: null },
  { month: 'Fev', historico: 3, projecao: null },
  { month: 'Mar', historico: 3.5, projecao: null },
  { month: 'Abr', historico: 4, projecao: null },
  { month: 'Mai', historico: 5, projecao: null },
  { month: 'Jun', historico: 6, projecao: null },
  { month: 'Jul', historico: 7, projecao: null },
  { month: 'Ago', historico: 8, projecao: null },
  { month: 'Set', historico: null, projecao: 8 },
  { month: 'Out', historico: null, projecao: 9 },
  { month: 'Nov', historico: null, projecao: 9.5 },
  { month: 'Dez', historico: null, projecao: 10 },
];

const comparisonData = [
  { categoria: 'Leitura', aluno: 8, turma: 6.5 },
  { categoria: 'Escrita', aluno: 6, turma: 7 },
  { categoria: 'Matemática', aluno: 9, turma: 7.5 },
  { categoria: 'Ciências', aluno: 7, turma: 6 },
];

const correlationData = [
  { tempo: 20, resultado: 6.5 },
  { tempo: 35, resultado: 7.2 },
  { tempo: 45, resultado: 8.1 },
  { tempo: 50, resultado: 8.5 },
  { tempo: 60, resultado: 9.0 },
  { tempo: 70, resultado: 9.5 },
];

const PredictiveAnalysis = () => {
  return (
    <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-info/5">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          ANÁLISE PREDITIVA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Texto explicativo */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          Com base nos dados dos últimos 6 meses, prevê-se que o aluno João Silva alcance o objetivo de 
          "leitura fluente de textos curtos" em aproximadamente 4 meses, mantendo o ritmo atual de evolução.
        </p>

        {/* Grid de mini-gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Projeção Temporal */}
          <div className="bg-card rounded-lg p-4 shadow">
            <h4 className="text-xs font-semibold mb-3 text-center">Projeção Temporal</h4>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  domain={[0, 10]} 
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="historico" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="projecao" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Evolução vs Turma */}
          <div className="bg-card rounded-lg p-4 shadow">
            <h4 className="text-xs font-semibold mb-3 text-center">Evolução vs. Turma</h4>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="categoria" 
                  tick={{ fontSize: 9 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  domain={[0, 10]}
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip />
                <Bar dataKey="aluno" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="turma" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tempo Investido */}
          <div className="bg-card rounded-lg p-4 shadow">
            <h4 className="text-xs font-semibold mb-3 text-center">Tempo Investido</h4>
            <ResponsiveContainer width="100%" height={150}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  dataKey="tempo" 
                  name="Tempo (min)"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  type="number" 
                  dataKey="resultado" 
                  name="Resultado"
                  domain={[0, 10]}
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter 
                  data={correlationData} 
                  fill="hsl(var(--success))"
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recomendação IA */}
        <div className="bg-warning/10 border-l-4 border-warning rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-warning-foreground mb-1">
                Recomendação IA:
              </p>
              <p className="text-sm text-muted-foreground">
                Intensificar atividades de leitura em dupla para acelerar progressão em 30%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveAnalysis;
