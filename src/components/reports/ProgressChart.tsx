import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Lightbulb } from 'lucide-react';

const data = [
  { mes: 'Jan', progresso_real: 2, meta_esperada: 1 },
  { mes: 'Fev', progresso_real: 3, meta_esperada: 2 },
  { mes: 'Mar', progresso_real: 3, meta_esperada: 3 },
  { mes: 'Abr', progresso_real: 4, meta_esperada: 4 },
  { mes: 'Mai', progresso_real: 5, meta_esperada: 5 },
  { mes: 'Jun', progresso_real: 6, meta_esperada: 6 },
  { mes: 'Jul', progresso_real: 7, meta_esperada: 7 },
  { mes: 'Ago', progresso_real: 8, meta_esperada: 8 },
  { mes: 'Set', progresso_real: 9, meta_esperada: 9 },
  { mes: 'Out', progresso_real: 9, meta_esperada: 10 },
  { mes: 'Nov', progresso_real: 10, meta_esperada: 11 },
  { mes: 'Dez', progresso_real: 10, meta_esperada: 12 },
];

// Calcular status do mês atual (Junho neste exemplo)
const mesAtual = 'Jun';
const dadosAtuais = data.find(d => d.mes === mesAtual);
const progressoAtual = dadosAtuais?.progresso_real || 0;
const metaAtual = dadosAtuais?.meta_esperada || 0;
const diferencaPercentual = metaAtual > 0 ? ((progressoAtual - metaAtual) / metaAtual) * 100 : 0;

const getStatus = () => {
  if (diferencaPercentual >= 10) return { 
    label: 'Acima da meta', 
    color: 'bg-green-600', 
    icon: TrendingUp 
  };
  if (diferencaPercentual >= -10) return { 
    label: 'No ritmo esperado', 
    color: 'bg-blue-600', 
    icon: Minus 
  };
  return { 
    label: 'Atenção necessária', 
    color: 'bg-red-600', 
    icon: TrendingDown 
  };
};

const status = getStatus();
const StatusIcon = status.icon;

const ProgressChart = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">PROGRESSO GERAL</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Objetivos do PEI alcançados ao longo do ano letivo
            </p>
          </div>
          
          {/* Badge de status */}
          <Badge className={`${status.color} text-white flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProgresso" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            
            <XAxis 
              dataKey="mes" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              label={{ 
                value: 'Objetivos alcançados', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '12px', fill: 'hsl(var(--muted-foreground))' }
              }}
              domain={[0, 12]}
              ticks={[0, 3, 6, 9, 12]}
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: any, name: string) => {
                if (name === 'progresso_real') return [value, 'Progresso real'];
                if (name === 'meta_esperada') return [value, 'Meta esperada'];
                return [value, name];
              }}
            />
            
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                if (value === 'progresso_real') return 'Progresso real';
                if (value === 'meta_esperada') return 'Meta esperada';
                return value;
              }}
            />
            
            {/* Área sombreada */}
            <Area
              type="monotone"
              dataKey="progresso_real"
              fill="url(#colorProgresso)"
              stroke="none"
            />
            
            {/* Linha da meta esperada (tracejada) */}
            <Line
              type="monotone"
              dataKey="meta_esperada"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            
            {/* Linha do progresso real */}
            <Line
              type="monotone"
              dataKey="progresso_real"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Estatísticas resumidas */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Objetivos totais</p>
            <p className="text-2xl font-bold text-foreground">12</p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Alcançados</p>
            <p className="text-2xl font-bold text-primary">{progressoAtual}</p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Meta atual</p>
            <p className="text-2xl font-bold text-muted-foreground">{metaAtual}</p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Diferença</p>
            <p className={`text-2xl font-bold ${
              diferencaPercentual >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {diferencaPercentual >= 0 ? '+' : ''}{diferencaPercentual.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Insights da IA */}
        <div className="mt-4 p-4 bg-accent rounded-lg border border-border">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                💡 Insight da IA
              </p>
              <p className="text-sm text-muted-foreground">
                {diferencaPercentual >= 0 
                  ? `O aluno está ${Math.abs(diferencaPercentual).toFixed(0)}% ${diferencaPercentual > 0 ? 'acima' : 'no ritmo'} da meta esperada! Continue com as estratégias atuais e considere aumentar o nível de desafio.`
                  : `O aluno está ${Math.abs(diferencaPercentual).toFixed(0)}% abaixo da meta. Recomenda-se revisar estratégias e intensificar intervenções nas áreas de maior dificuldade.`
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
