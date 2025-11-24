import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { subject: 'Leitura', meta: 8, atual: 9 },
  { subject: 'Escrita', meta: 7, atual: 6 },
  { subject: 'Matemática', meta: 9, atual: 8 },
  { subject: 'Ciências', meta: 8, atual: 7 },
  { subject: 'Autonomia', meta: 7, atual: 8 },
  { subject: 'Socialização', meta: 6, atual: 5 },
  { subject: 'Comunicação', meta: 8, atual: 9 },
];

const PEIRadarChart = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">OBJETIVOS DO PEI</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 10]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="line"
            />
            <Radar 
              name="Meta esperada" 
              dataKey="meta" 
              stroke="hsl(var(--muted-foreground))" 
              fill="hsl(var(--muted-foreground))" 
              fillOpacity={0.1}
              strokeDasharray="5 5"
              strokeWidth={2}
            />
            <Radar 
              name="Progresso atual" 
              dataKey="atual" 
              stroke="hsl(var(--success))" 
              fill="hsl(var(--success))" 
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PEIRadarChart;
