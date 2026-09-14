import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, LineChart } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Lightbulb, AlertCircle, CheckCircle2 } from 'lucide-react';

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

const dadosPorArea = {
  comunicacao: {
    nome: 'Comunicação',
    dados: [
      { mes: 'Jan', valor: 3, meta: 2 },
      { mes: 'Fev', valor: 4, meta: 3 },
      { mes: 'Mar', valor: 5, meta: 4 },
      { mes: 'Abr', valor: 6, meta: 5 },
      { mes: 'Mai', valor: 7, meta: 6 },
      { mes: 'Jun', valor: 7, meta: 6 },
    ],
    atual: 7,
    total: 10,
    meta: 6,
    cor: 'hsl(var(--chart-2))',
    status: 'excelente'
  },
  alfabetizacao: {
    nome: 'Alfabetização',
    dados: [
      { mes: 'Jan', valor: 1, meta: 2 },
      { mes: 'Fev', valor: 1, meta: 3 },
      { mes: 'Mar', valor: 2, meta: 4 },
      { mes: 'Abr', valor: 2, meta: 5 },
      { mes: 'Mai', valor: 3, meta: 5 },
      { mes: 'Jun', valor: 3, meta: 5 },
    ],
    atual: 3,
    total: 8,
    meta: 5,
    cor: 'hsl(var(--destructive))',
    status: 'atencao'
  },
  matematica: {
    nome: 'Matemática',
    dados: [
      { mes: 'Jan', valor: 2, meta: 2 },
      { mes: 'Fev', valor: 3, meta: 3 },
      { mes: 'Mar', valor: 4, meta: 4 },
      { mes: 'Abr', valor: 4, meta: 5 },
      { mes: 'Mai', valor: 5, meta: 5 },
      { mes: 'Jun', valor: 5, meta: 5 },
    ],
    atual: 5,
    total: 9,
    meta: 5,
    cor: 'hsl(var(--primary))',
    status: 'adequado'
  },
  socializacao: {
    nome: 'Socialização',
    dados: [
      { mes: 'Jan', valor: 1, meta: 1 },
      { mes: 'Fev', valor: 2, meta: 2 },
      { mes: 'Mar', valor: 2, meta: 3 },
      { mes: 'Abr', valor: 3, meta: 3 },
      { mes: 'Mai', valor: 4, meta: 4 },
      { mes: 'Jun', valor: 4, meta: 4 },
    ],
    atual: 4,
    total: 7,
    meta: 4,
    cor: 'hsl(var(--chart-4))',
    status: 'adequado'
  },
  autonomia: {
    nome: 'Autonomia',
    dados: [
      { mes: 'Jan', valor: 4, meta: 3 },
      { mes: 'Fev', valor: 5, meta: 4 },
      { mes: 'Mar', valor: 6, meta: 5 },
      { mes: 'Abr', valor: 7, meta: 6 },
      { mes: 'Mai', valor: 8, meta: 6 },
      { mes: 'Jun', valor: 8, meta: 6 },
    ],
    atual: 8,
    total: 10,
    meta: 6,
    cor: 'hsl(var(--chart-3))',
    status: 'excelente'
  }
};

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
  const [areaSelecionada, setAreaSelecionada] = useState<string | null>(null);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">PROGRESSO GERAL</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Acompanhamento dos objetivos do PEI ao longo do ano letivo
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
        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="geral">📊 Visão Geral</TabsTrigger>
            <TabsTrigger value="areas">📈 Por Áreas</TabsTrigger>
          </TabsList>

          {/* TAB 1: VISÃO GERAL */}
          <TabsContent value="geral">
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
              formatter={(value: number | string, name: string) => {
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

        {/* Leitura ilustrativa: frase montada por regra fixa sobre os dados de exemplo */}
        <div className="mt-4 p-4 bg-accent rounded-lg border border-border">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                💡 Leitura ilustrativa — regra fixa, nenhum modelo é executado
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
          </TabsContent>

          {/* TAB 2: POR ÁREAS */}
          <TabsContent value="areas">
            {/* Grid de mini-cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Object.entries(dadosPorArea).map(([key, area]) => (
                <MiniCardArea
                  key={key}
                  area={area}
                  onClick={() => setAreaSelecionada(key)}
                  ativo={areaSelecionada === key}
                />
              ))}
            </div>

            {/* Gráfico detalhado da área selecionada */}
            {areaSelecionada && (
              <GraficoAreaDetalhado 
                area={dadosPorArea[areaSelecionada as keyof typeof dadosPorArea]} 
              />
            )}

            {!areaSelecionada && (
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Clique em uma área acima para ver os detalhes</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// ==================== COMPONENTES AUXILIARES ====================

interface AreaDataPoint {
  mes: string;
  valor: number;
  meta: number;
}

interface AreaData {
  nome: string;
  dados: AreaDataPoint[];
  atual: number;
  meta: number;
  total: number;
  cor: string;
  status: string;
}

function MiniCardArea({
  area,
  onClick,
  ativo,
}: {
  area: AreaData;
  onClick: () => void;
  ativo: boolean;
}) {
  const getStatusIcon = () => {
    if (area.status === 'excelente') return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (area.status === 'atencao') return <AlertCircle className="w-4 h-4 text-red-600" />;
    return <TrendingUp className="w-4 h-4 text-primary" />;
  };

  const getStatusBadge = () => {
    if (area.status === 'excelente') return <Badge className="bg-green-600 hover:bg-green-700">🎯 Excelente</Badge>;
    if (area.status === 'atencao') return <Badge variant="destructive">⚠️ Atenção</Badge>;
    return <Badge className="bg-primary hover:bg-primary/90">✓ Adequado</Badge>;
  };

  const percentual = Math.round((area.atual / area.total) * 100);

  return (
    <div 
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all
        hover:shadow-lg hover:scale-105
        ${ativo ? 'border-primary bg-accent shadow-md' : 'border-border bg-card'}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm text-foreground">{area.nome}</h4>
        {getStatusIcon()}
      </div>

      {/* Mini sparkline */}
      <div className="h-12 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={area.dados}>
            <Line 
              type="monotone" 
              dataKey="valor" 
              stroke={area.cor} 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Estatísticas */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold" style={{ color: area.cor }}>
          {area.atual}/{area.total}
        </span>
        <span className="text-sm text-muted-foreground">{percentual}%</span>
      </div>

      {getStatusBadge()}
    </div>
  );
}

function GraficoAreaDetalhado({ area }: { area: AreaData }) {
  const percentual = Math.round((area.atual / area.total) * 100);
  const diferenca = area.atual - area.meta;

  return (
    <div 
      className="mt-6 bg-white rounded-lg shadow-md overflow-hidden"
      style={{ borderLeft: `8px solid ${area.cor}` }}
    >
      {/* Header com gradiente sutil */}
      <div 
        className="p-6 pb-4"
        style={{ 
          background: `linear-gradient(to right, ${area.cor}08, transparent)` 
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{area.nome}</h3>
            <p className="text-sm text-gray-600">Análise detalhada de progresso</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold" style={{ color: area.cor }}>
              {percentual}%
            </p>
            <p className="text-sm text-gray-600">de conclusão</p>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="px-6 pb-4">

        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={area.dados} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${area.nome}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={area.cor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={area.cor} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="mes" 
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              domain={[0, area.total]}
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            
            <Area
              type="monotone"
              dataKey="valor"
              fill={`url(#gradient-${area.nome})`}
              stroke="none"
            />
            
            <Line
              type="monotone"
              dataKey="meta"
              stroke="#9CA3AF"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Meta"
            />
            
            <Line 
              type="monotone" 
              dataKey="valor" 
              stroke={area.cor} 
              strokeWidth={3}
              dot={{ fill: area.cor, r: 4 }}
              name="Progresso"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Métricas detalhadas */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Objetivos totais</p>
            <p className="text-2xl font-bold text-gray-900">{area.total}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Alcançados</p>
            <p className="text-2xl font-bold" style={{ color: area.cor }}>
              {area.atual}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Meta atual</p>
            <p className="text-2xl font-bold text-gray-700">{area.meta}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Diferença</p>
            <p className={`text-2xl font-bold ${diferenca >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {diferenca >= 0 ? '+' : ''}{diferenca}
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div 
        className="mx-6 mb-6 p-4 rounded-lg border"
        style={{ 
          backgroundColor: `${area.cor}08`,
          borderColor: `${area.cor}40`
        }}
      >
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" style={{ color: area.cor }} />
          Leitura ilustrativa — regra fixa, nenhum modelo é executado
        </h4>
        <p className="text-sm text-gray-700">
          {diferenca >= 0 
            ? `Parabéns! O aluno está ${Math.abs(diferenca)} objetivo(s) acima da meta em ${area.nome}. Continue com as estratégias atuais.`
            : `O aluno está ${Math.abs(diferenca)} objetivo(s) abaixo da meta em ${area.nome}. Considere intensificar as intervenções nesta área.`
          }
        </p>
      </div>
    </div>
  );
}

export default ProgressChart;
