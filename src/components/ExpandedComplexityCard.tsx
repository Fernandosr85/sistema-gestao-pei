import { LucideIcon, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface HealthDetail {
  label: string;
  count: number;
  comPEI?: string;
  comMedicacao?: number;
  nivel1?: number;
  nivel2?: number;
  nivel3?: number;
  comApoio?: string;
  comAdaptacoes?: string;
  usandoCAA?: number;
  status: 'error' | 'warning' | 'success';
}

interface EducationalDetail {
  label: string;
  value: number;
  abaixoMeta: number;
  naMeta: number;
  acimaMeta: number;
  status: 'error' | 'warning' | 'success';
}

interface SocialDetail {
  label: string;
  value: number;
  baixa?: number;
  media?: number;
  alta?: number;
  naoVerbal?: number;
  verbalLimitada?: number;
  usaCAA?: number;
  crisesFrequentes?: number;
  crisesOcasionais?: number;
  status: 'error' | 'warning' | 'success';
}

interface ExpandedComplexityCardProps {
  title: string;
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  type: 'health' | 'educational' | 'social';
  items: HealthDetail[] | EducationalDetail[] | SocialDetail[];
}

const ExpandedComplexityCard = ({
  title,
  icon: Icon,
  bgColor,
  borderColor,
  type,
  items
}: ExpandedComplexityCardProps) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const getStatusColor = (status: 'error' | 'warning' | 'success') => {
    switch (status) {
      case 'error': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'success': return 'text-success';
    }
  };

  const getStatusBadge = (status: 'error' | 'warning' | 'success') => {
    switch (status) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'success': return '🟢';
    }
  };

  return (
    <Card className={`${bgColor} border-l-4 ${borderColor} shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <Icon className="h-6 w-6 text-foreground" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {type === 'health' && (items as HealthDetail[]).map((item, index) => (
          <Collapsible key={index} open={expandedItems.includes(index)} onOpenChange={() => toggleItem(index)}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      {expandedItems.includes(index) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-bold">
                    {item.count} CASOS
                  </Badge>
                  <span>{getStatusBadge(item.status)}</span>
                </div>
              </div>

              <CollapsibleContent className="pl-4 space-y-1 text-xs text-muted-foreground">
                {item.comPEI && <div>├─ Com PEI: {item.comPEI}</div>}
                {item.comMedicacao && <div>├─ Com medicação: {item.comMedicacao} alunos</div>}
                {item.nivel1 !== undefined && (
                  <>
                    <div>├─ Nível 1 (leve): {item.nivel1}</div>
                    <div>├─ Nível 2 (moderado): {item.nivel2}</div>
                    <div>├─ Nível 3 (severo): {item.nivel3}</div>
                    <div>├─ Com apoio humano: {item.comApoio}</div>
                  </>
                )}
                {item.comAdaptacoes && <div>├─ Com adaptações: {item.comAdaptacoes}</div>}
                {item.usandoCAA !== undefined && <div>├─ Usando CAA: {item.usandoCAA} alunos</div>}
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}

        {type === 'educational' && (items as EducationalDetail[]).map((item, index) => (
          <Collapsible key={index} open={expandedItems.includes(index)} onOpenChange={() => toggleItem(index)}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      {expandedItems.includes(index) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${getStatusColor(item.status)}`}>{item.value}%</span>
                  <span>{getStatusBadge(item.status)}</span>
                </div>
              </div>
              <Progress value={item.value} className="h-2" />

              <CollapsibleContent className="pl-4 space-y-1 text-xs text-muted-foreground">
                <div>├─ Abaixo da meta: {item.abaixoMeta} alunos</div>
                <div>├─ Na meta: {item.naMeta} alunos</div>
                <div>├─ Acima da meta: {item.acimaMeta} alunos</div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}

        {type === 'social' && (items as SocialDetail[]).map((item, index) => (
          <Collapsible key={index} open={expandedItems.includes(index)} onOpenChange={() => toggleItem(index)}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      {expandedItems.includes(index) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${getStatusColor(item.status)}`}>{item.value}%</span>
                  <span>{getStatusBadge(item.status)}</span>
                </div>
              </div>
              <Progress value={item.value} className="h-2" />

              <CollapsibleContent className="pl-4 space-y-1 text-xs text-muted-foreground">
                {item.baixa !== undefined && (
                  <>
                    <div>├─ Baixa integração: {item.baixa} alunos</div>
                    <div>├─ Média integração: {item.media} alunos</div>
                    <div>├─ Alta integração: {item.alta} alunos</div>
                  </>
                )}
                {item.naoVerbal !== undefined && (
                  <>
                    <div>├─ Não verbal: {item.naoVerbal} alunos</div>
                    <div>├─ Verbal limitada: {item.verbalLimitada} alunos</div>
                    <div>├─ Usa CAA: {item.usaCAA} alunos</div>
                  </>
                )}
                {item.crisesFrequentes !== undefined && (
                  <>
                    <div>├─ Crises frequentes: {item.crisesFrequentes} alunos</div>
                    <div>├─ Crises ocasionais: {item.crisesOcasionais} alunos</div>
                  </>
                )}
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">
              {type === 'health' ? 'TENDÊNCIA ANUAL' : type === 'educational' ? 'EVOLUÇÃO TRIMESTRAL' : 'EVOLUÇÃO SEMESTRAL'}
            </span>
          </div>
          <div className="h-24 bg-muted/30 rounded flex items-center justify-center text-xs text-muted-foreground">
            [Gráfico de {type === 'health' ? 'linha' : 'comparativo'} mostrando evolução]
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpandedComplexityCard;
