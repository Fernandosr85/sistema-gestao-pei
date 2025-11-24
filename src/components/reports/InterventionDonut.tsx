import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Adaptações Curriculares', value: 23, color: 'hsl(356 88% 46%)' },
  { name: 'Apoio Individualizado', value: 25, color: 'hsl(271 91% 65%)' },
  { name: 'Recursos Tec. Assistiva', value: 18, color: 'hsl(217 100% 36%)' },
  { name: 'Material Adaptado', value: 20, color: 'hsl(42 88% 52%)' },
  { name: 'Suporte Especializado', value: 14, color: 'hsl(0 0% 53%)' },
];

const InterventionDonut = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">TIPOS DE INTERVENÇÃO</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value) => `${value}%`}
            />
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-sm">
                  {value} ({entry.payload.value}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InterventionDonut;
