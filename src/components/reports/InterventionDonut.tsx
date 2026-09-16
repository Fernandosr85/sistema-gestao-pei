import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';

/*
 * As cores vêm dos tokens da marca, que são medidos. Como valor literal, três delas
 * reprovavam ao pintar a porcentagem da legenda sobre o branco: 3,95:1 no roxo, 1,92:1 no
 * amarelo e 3,59:1 no cinza.
 */
const data = [
  { name: 'Adaptações Curriculares', value: 23, color: 'hsl(var(--brand-red))' },
  { name: 'Apoio Individualizado', value: 25, color: 'hsl(var(--brand-purple))' },
  { name: 'Recursos Tec. Assistiva', value: 18, color: 'hsl(var(--brand-blue))' },
  { name: 'Material Adaptado', value: 20, color: 'hsl(var(--brand-yellow))' },
  { name: 'Suporte Especializado', value: 14, color: 'hsl(var(--brand-gray))' },
];

interface ActiveShapeProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
}

const renderActiveShape = (props: ActiveShapeProps) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const InterventionDonut = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">TIPOS DE INTERVENÇÃO</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/*
            * Gráfico. O equivalente textual é a própria legenda ao lado, que já traz nome e
            * porcentagem de cada fatia — por isso aqui basta o nome acessível, sem tabela.
            */}
          <div
            className="flex justify-center"
            role="img"
            aria-label="Gráfico de rosca dos tipos de intervenção, com a porcentagem de cada um. Os mesmos valores estão na lista ao lado."
          >
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  activeIndex={activeIndex ?? undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-all"
                    />
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
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legendas customizadas */}
          <div className="space-y-3">
            {data.map((item, index) => (
              /*
               * Sai o `cursor-pointer`: a legenda nunca teve clique. O realce por hover
               * continua, porque é só reforço visual — nome e porcentagem já estão em
               * texto aqui, então nada da legenda depende do mouse.
               */
              <div
                key={index}
                className={`
                  flex items-center gap-3 p-3 rounded-lg
                  transition-all duration-200 border
                  ${activeIndex === index 
                    ? 'bg-accent border-primary shadow-md scale-105' 
                    : 'bg-card border-border hover:bg-accent/50'
                  }
                `}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* Indicador de cor */}
                <div 
                  className="w-4 h-4 rounded flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                
                {/* Texto e porcentagem */}
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
                  <span 
                    className="text-lg font-bold ml-2"
                    style={{ color: item.color }}
                  >
                    {item.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-sm text-muted-foreground">
            Total de intervenções ativas: <strong className="text-foreground">100%</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterventionDonut;
