import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const generateCalendarData = () => {
  const data = [];
  const startDate = new Date(2024, 10, 1); // November 2024
  
  for (let i = 0; i < 30; i++) {
    const count = Math.floor(Math.random() * 6); // 0-5 observações
    data.push({
      date: new Date(2024, 10, i + 1),
      count,
    });
  }
  return data;
};

const getColorForCount = (count: number) => {
  if (count === 0) return 'bg-muted';
  if (count <= 2) return 'bg-success/30';
  if (count <= 4) return 'bg-success/60';
  return 'bg-success';
};

const ObservationHeatmap = () => {
  const data = generateCalendarData();
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">FREQUÊNCIA DE OBSERVAÇÕES</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-2 text-xs font-medium text-muted-foreground">
            {weekDays.map((day) => (
              <div key={day} className="text-center">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <TooltipProvider>
            <div className="grid grid-cols-7 gap-2">
              {data.map((item, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <div
                      className={`
                        aspect-square rounded border-2 border-border 
                        ${getColorForCount(item.count)} 
                        hover:ring-2 hover:ring-primary 
                        cursor-pointer transition-all duration-200
                        flex items-center justify-center
                        text-xs font-semibold
                      `}
                    >
                      {item.date.getDate()}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">
                      {item.date.toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'short' 
                      })}
                    </p>
                    <p className="text-sm">
                      {item.count} observação{item.count !== 1 ? 'ões' : ''}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4">
            <span>Menos</span>
            <div className="flex gap-1">
              <div className="w-6 h-6 rounded bg-muted border border-border"></div>
              <div className="w-6 h-6 rounded bg-success/30 border border-border"></div>
              <div className="w-6 h-6 rounded bg-success/60 border border-border"></div>
              <div className="w-6 h-6 rounded bg-success border border-border"></div>
            </div>
            <span>Mais</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ObservationHeatmap;
