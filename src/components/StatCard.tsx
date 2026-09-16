import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { PeriodChange } from '@/lib/metrics';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  /**
   * Variação em relação ao mês anterior, calculada por `periodChange`. Antes era um número
   * digitado na chamada (+12%, +8%), sem nenhum registro por trás.
   */
  trend?: PeriodChange;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
}

/** Em palavras, e não só em seta e cor: "alta de 12%" diz o mesmo para quem não vê a cor. */
const describeTrend = (trend: PeriodChange): string => {
  if (trend.kind === 'noBaseline') return 'Sem base de comparação com o mês anterior';
  if (trend.percent === 0) return 'Igual ao mês anterior';
  return trend.percent > 0
    ? `Alta de ${trend.percent}% em relação ao mês anterior`
    : `Queda de ${Math.abs(trend.percent)}% em relação ao mês anterior`;
};

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  variant = 'default' 
}: StatCardProps) => {
  const variantClasses = {
    default: 'text-primary',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
  };

  const bgVariantClasses = {
    default: 'bg-primary/10',
    primary: 'bg-primary/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    info: 'bg-info/10',
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && <p className="mt-2 text-xs text-muted-foreground">{describeTrend(trend)}</p>}
          </div>
          <div className={`${bgVariantClasses[variant]} p-4 rounded-xl`}>
            <Icon className={`h-8 w-8 ${variantClasses[variant]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
