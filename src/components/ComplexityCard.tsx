import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface BadgeItem {
  label: string;
  count: number;
  variant: 'default' | 'destructive' | 'secondary' | 'outline';
}

interface ProgressItem {
  label: string;
  value: number;
  color: string;
}

interface ComplexityCardProps {
  title: string;
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  items: BadgeItem[] | ProgressItem[];
  type: 'badges' | 'progress';
}

const ComplexityCard = ({
  title,
  icon: Icon,
  bgColor,
  borderColor,
  items,
  type,
}: ComplexityCardProps) => {
  return (
    <Card className={`${bgColor} border-l-4 ${borderColor} shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <Icon className="h-6 w-6 text-foreground" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {type === 'badges' &&
          (items as BadgeItem[]).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <Badge variant={item.variant} className="font-bold">
                {item.count} CASOS
              </Badge>
            </div>
          ))}

        {type === 'progress' &&
          (items as ProgressItem[]).map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                <span className="text-sm font-bold text-foreground">{item.value}%</span>
              </div>
              <Progress 
                value={item.value} 
                className="h-2"
              />
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default ComplexityCard;
