import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { month: 'Jan', cognitivo: 2, progressos: 1.5, estrategia: 1 },
  { month: 'Fev', cognitivo: 3, progressos: 2, estrategia: 1.5 },
  { month: 'Mar', cognitivo: 3, progressos: 2.5, estrategia: 2 },
  { month: 'Abr', cognitivo: 4, progressos: 3, estrategia: 2 },
  { month: 'Mai', cognitivo: 5, progressos: 4, estrategia: 3 },
  { month: 'Jun', cognitivo: 6, progressos: 5, estrategia: 3.5 },
  { month: 'Jul', cognitivo: 7, progressos: 6, estrategia: 4 },
  { month: 'Ago', cognitivo: 8, progressos: 6.5, estrategia: 4.5 },
  { month: 'Set', cognitivo: 8.5, progressos: 7, estrategia: 5 },
  { month: 'Out', cognitivo: 9, progressos: 7.5, estrategia: 5.5 },
  { month: 'Nov', cognitivo: 9.5, progressos: 8, estrategia: 6 },
  { month: 'Dez', cognitivo: 10, progressos: 8.5, estrategia: 6.5 },
];

const ProgressChart = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">PROGRESSO GERAL</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCognitivo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217 100% 36%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(217 100% 36%)" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              domain={[0, 10]} 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Area 
              type="monotone" 
              dataKey="cognitivo" 
              stroke="hsl(217 100% 36%)" 
              fill="url(#colorCognitivo)" 
              strokeWidth={2}
              name="Cognitivo de especialista"
            />
            <Line 
              type="monotone" 
              dataKey="progressos" 
              stroke="hsl(7 65% 49%)" 
              strokeWidth={2}
              dot={{ fill: 'hsl(7 65% 49%)', r: 4 }}
              name="Progressos"
            />
            <Line 
              type="monotone" 
              dataKey="estrategia" 
              stroke="hsl(356 88% 46%)" 
              strokeWidth={2}
              dot={{ fill: 'hsl(356 88% 46%)', r: 4 }}
              name="Mudanças da estratégia"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
