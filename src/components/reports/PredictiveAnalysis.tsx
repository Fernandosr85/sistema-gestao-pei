import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, ChevronDown, ChevronUp, TrendingUp, Users, Lightbulb, AlertCircle, AlertTriangle } from 'lucide-react';
import DemoDataNotice from '@/components/DemoDataNotice';

const projectionData = [
  { month: 'Jan', historico: 2, projecao: null },
  { month: 'Fev', historico: 3, projecao: null },
  { month: 'Mar', historico: 3.5, projecao: null },
  { month: 'Abr', historico: 4, projecao: null },
  { month: 'Mai', historico: 5, projecao: null },
  { month: 'Jun', historico: 6, projecao: null },
  { month: 'Jul', historico: 7, projecao: null },
  { month: 'Ago', historico: 8, projecao: null },
  { month: 'Set', historico: null, projecao: 8 },
  { month: 'Out', historico: null, projecao: 9 },
  { month: 'Nov', historico: null, projecao: 9.5 },
  { month: 'Dez', historico: null, projecao: 10 },
];

interface AreaProgressoProps {
  nome: string;
  atual: number;
  projetado: number;
  risco: 'baixo' | 'médio' | 'alto';
}

interface TabButtonProps {
  ativo: boolean;
  onClick: () => void;
  icone: React.ReactNode;
  texto: string;
  badge?: string;
  alerta?: boolean;
}

interface MiniGraficoProps {
  titulo: string;
  valor: string;
  tendencia: 'positiva' | 'neutra' | 'negativa';
}

interface CenarioCardProps {
  titulo: string;
  objetivos: string;
  probabilidade: string;
  cor: 'warning' | 'primary' | 'success';
  destaque?: boolean;
}

const PredictiveAnalysis = () => {
  const [expandido, setExpandido] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('projecao');

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">PROJEÇÃO ILUSTRATIVA</CardTitle>
              <p className="text-primary-foreground/90 text-sm mt-1">
                Maquete de interface • Nenhum modelo preditivo é executado
              </p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpandido(!expandido)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            {expandido ? (
              <>
                Recolher <ChevronUp className="ml-2 w-4 h-4" />
              </>
            ) : (
              <>
                Ver análise completa <ChevronDown className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Resumo - Sempre visível */}
        <div className="mb-6">
          <p className="text-foreground mb-4">
            Com base nos dados dos últimos <strong>3 meses</strong>, prevê-se que o 
            aluno <strong>João Silva</strong> alcance o objetivo de
            <strong className="text-primary"> "leitura fluente de textos curtos"</strong> em 
            aproximadamente <strong>4 meses</strong>, mantendo o ritmo atual de evolução.
          </p>

          {/* Mini-gráficos resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MiniGrafico 
              titulo="Projeção Temporal"
              valor="4 meses"
              tendencia="positiva"
            />
            <MiniGrafico 
              titulo="Evolução vs. Turma"
              valor="Acima da média"
              tendencia="positiva"
            />
            <MiniGrafico 
              titulo="Confiança IA"
              valor="87%"
              tendencia="positiva"
            />
          </div>
        </div>

        {/* Área expansível */}
        {expandido && (
          <div className="border-t border-border pt-6">
            {/* Navegação por tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-2">
              <TabButton
                ativo={abaAtiva === 'projecao'}
                onClick={() => setAbaAtiva('projecao')}
                icone={<TrendingUp className="w-4 h-4" />}
                texto="Projeção Detalhada"
                badge="3"
              />
              <TabButton
                ativo={abaAtiva === 'casos'}
                onClick={() => setAbaAtiva('casos')}
                icone={<Users className="w-4 h-4" />}
                texto="Casos Similares"
                badge="156"
              />
              <TabButton
                ativo={abaAtiva === 'estrategias'}
                onClick={() => setAbaAtiva('estrategias')}
                icone={<Lightbulb className="w-4 h-4" />}
                texto="Estratégias"
                badge="8"
              />
              <TabButton
                ativo={abaAtiva === 'alertas'}
                onClick={() => setAbaAtiva('alertas')}
                icone={<AlertCircle className="w-4 h-4" />}
                texto="Alertas"
                badge="2"
                alerta
              />
            </div>

            {/* Conteúdo das tabs */}
            {abaAtiva === 'projecao' && <ProjecaoDetalhada />}
            {abaAtiva === 'casos' && <CasosSimilaresDetalhado />}
            {abaAtiva === 'estrategias' && <EstrategiasIA />}
            {abaAtiva === 'alertas' && <AlertasIA />}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ==================== COMPONENTES AUXILIARES ====================

function TabButton({ ativo, onClick, icone, texto, badge, alerta }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
        ${ativo 
          ? 'bg-primary text-primary-foreground shadow-md' 
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }
      `}
    >
      {icone}
      <span className="text-sm">{texto}</span>
      {badge && (
        <Badge 
          variant={alerta ? "destructive" : "secondary"}
          className={`ml-1 ${ativo ? 'bg-primary-foreground/20 text-primary-foreground border-0' : ''}`}
        >
          {badge}
        </Badge>
      )}
    </button>
  );
}

function MiniGrafico({ titulo, valor, tendencia }: MiniGraficoProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 border border-border">
      <p className="text-xs text-muted-foreground mb-2">{titulo}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-xl font-bold text-primary">{valor}</p>
        {tendencia === 'positiva' && (
          <TrendingUp className="w-4 h-4 text-success" />
        )}
      </div>
      {/* Mini gráfico visual */}
      <div className="mt-3 h-8 flex items-end gap-1">
        {[40, 50, 45, 60, 70, 75, 80].map((altura, idx) => (
          <div 
            key={idx}
            className="flex-1 bg-primary/30 rounded-t"
            style={{ height: `${altura}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// ==================== CONTEÚDO DAS ABAS ====================

function ProjecaoDetalhada() {
  return (
    <div className="space-y-6">
      {/* Card de Projeção Geral */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border-2 border-primary/20">
        <h3 className="text-lg font-bold text-foreground mb-4">
          📊 Projeção de Progresso - Fim do Ano Letivo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Situação Atual</p>
            <p className="text-3xl font-bold text-primary">6/12</p>
            <p className="text-xs text-muted-foreground">objetivos alcançados</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Projeção Dezembro</p>
            <p className="text-3xl font-bold text-success">10/12</p>
            <p className="text-xs text-muted-foreground">
              +4 objetivos esperados
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Confiança IA</p>
            <p className="text-3xl font-bold text-primary">87%</p>
            <p className="text-xs text-muted-foreground">baseado em 156 casos</p>
          </div>
        </div>

        {/* Barra de progresso visual */}
        <div className="relative h-8 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-primary transition-all duration-500"
            style={{ width: '50%' }}
          />
          <div 
            className="absolute h-full bg-success/50 transition-all duration-500"
            style={{ width: '83%', left: '0%' }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
            Atual: 50% → Projeção: 83%
          </span>
        </div>
      </div>

      {/* Projeção por Área */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">
          Projeção por Área de Desenvolvimento
        </h4>
        
        <div className="space-y-3">
          <AreaProgresso 
            nome="Comunicação"
            atual={70}
            projetado={85}
            risco="baixo"
          />
          <AreaProgresso 
            nome="Alfabetização"
            atual={35}
            projetado={50}
            risco="alto"
          />
          <AreaProgresso 
            nome="Matemática"
            atual={55}
            projetado={75}
            risco="baixo"
          />
          <AreaProgresso 
            nome="Socialização"
            atual={45}
            projetado={65}
            risco="médio"
          />
          <AreaProgresso 
            nome="Autonomia"
            atual={80}
            projetado={90}
            risco="baixo"
          />
        </div>
      </div>

      {/* Cenários Alternativos */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">Cenários Alternativos</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CenarioCard
            titulo="Cenário Conservador"
            objetivos="8/12"
            probabilidade="15%"
            cor="warning"
          />
          <CenarioCard
            titulo="Cenário Esperado"
            objetivos="10/12"
            probabilidade="87%"
            cor="primary"
            destaque
          />
          <CenarioCard
            titulo="Cenário Otimista"
            objetivos="11/12"
            probabilidade="35%"
            cor="success"
          />
        </div>
      </div>
    </div>
  );
}

function AreaProgresso({ nome, atual, projetado, risco }: AreaProgressoProps) {
  const riscoVariant = risco === 'baixo' ? 'default' : risco === 'médio' ? 'secondary' : 'destructive';

  return (
    <div className="bg-card rounded-lg p-4 border border-border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-foreground">{nome}</h5>
        <Badge variant={riscoVariant}>
          Risco {risco}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Atual: {atual}%</span>
          <span className="text-success font-semibold">Projeção: {projetado}%</span>
        </div>
        
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-primary"
            style={{ width: `${atual}%` }}
          />
          <div 
            className="absolute h-full bg-success/40"
            style={{ width: `${projetado}%` }}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3 text-success" />
          Ganho esperado: +{projetado - atual}%
        </div>
      </div>
    </div>
  );
}

function CenarioCard({ titulo, objetivos, probabilidade, cor, destaque }: CenarioCardProps) {
  const cores = {
    warning: 'bg-[hsl(var(--alert-warning-bg))] border-[hsl(var(--alert-warning-border))]',
    primary: 'bg-primary/5 border-primary/30',
    success: 'bg-success/5 border-success/30'
  };

  return (
    <div 
      className={`
        rounded-lg p-4 border-2 ${cores[cor]}
        ${destaque ? 'ring-2 ring-primary shadow-lg' : ''}
      `}
    >
      <h5 className="font-semibold text-foreground mb-2">{titulo}</h5>
      <p className="text-3xl font-bold text-foreground mb-1">{objetivos}</p>
      <p className="text-sm text-muted-foreground mb-3">objetivos alcançados</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Probabilidade:</span>
        <span className="text-sm font-bold text-foreground">{probabilidade}</span>
      </div>
      {destaque && (
        <Badge className="mt-3 w-full justify-center bg-primary">
          ⭐ Mais provável
        </Badge>
      )}
    </div>
  );
}

function CasosSimilaresDetalhado() {
  return (
    <div className="space-y-4">
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <p className="text-sm text-foreground">
          📊 Encontramos <strong>156 casos similares</strong> na rede (dados fictícios) (2021-2024) 
          com perfil próximo ao de João Silva. Veja os 3 casos mais relevantes:
        </p>
      </div>

      {/* Cards de casos */}
      {[1, 2, 3].map((num) => (
        <div key={num} className="bg-card rounded-lg p-5 border-2 border-border hover:border-primary/40 transition-all">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
              <span className="text-xl font-bold">9{num}%</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-bold text-foreground">Caso #{num} - Escola Exemplo A</h5>
                {num === 1 && (
                  <Badge className="bg-primary">⭐ Mais similar</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                TEA Nível 2 • 9 anos • Ano letivo 2023
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Resultado alcançado</p>
              <p className="text-2xl font-bold text-success">92%</p>
              <p className="text-xs text-muted-foreground">11/12 objetivos</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Tempo decorrido</p>
              <p className="text-2xl font-bold text-primary">4 meses</p>
              <p className="text-xs text-muted-foreground">para resultados</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-foreground mb-2">
              ✅ Estratégias que funcionaram:
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-success/10">Rotina visual</Badge>
              <Badge variant="outline" className="bg-success/10">Reforço positivo</Badge>
              <Badge variant="outline" className="bg-success/10">Parceria família</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Ver PEI completo
            </Button>
            <Button size="sm" className="flex-1 bg-primary">
              Aplicar estratégias
            </Button>
          </div>
        </div>
      ))}

      <Button variant="outline" className="w-full">
        Ver todos os 156 casos similares
      </Button>
    </div>
  );
}

function EstrategiasIA() {
  const estrategias = [
    {
      nome: "Método Fônico Multissensorial",
      area: "Alfabetização",
      sucesso: 89,
      prioridade: "alta"
    },
    {
      nome: "Zona de Descompressão + Timer Visual",
      area: "Regulação Emocional",
      sucesso: 94,
      prioridade: "alta"
    },
    {
      nome: "Grupos Estruturados (2-3 alunos)",
      area: "Socialização",
      sucesso: 82,
      prioridade: "média"
    }
  ];

  return (
    <div className="space-y-4">
      {estrategias.map((estrategia, idx) => (
        <div key={idx} className="bg-card rounded-lg p-5 border-2 border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{estrategia.area}</Badge>
                <Badge 
                  variant={estrategia.prioridade === "alta" ? "destructive" : "secondary"}
                >
                  Prioridade {estrategia.prioridade}
                </Badge>
              </div>
              <h5 className="font-bold text-foreground text-lg">{estrategia.nome}</h5>
            </div>
            <div className="text-right ml-4">
              <p className="text-3xl font-bold text-success">{estrategia.sucesso}%</p>
              <p className="text-xs text-muted-foreground">taxa de sucesso</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Implementação</p>
              <p className="font-semibold text-sm text-foreground">3-4 semanas</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Custo</p>
              <p className="font-semibold text-sm text-foreground">Baixo</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Casos na rede</p>
              <p className="font-semibold text-sm text-foreground">67 escolas</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Ver guia completo
            </Button>
            <Button size="sm" className="flex-1 bg-primary">
              Adicionar ao PEI
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AlertasIA() {
  return (
    <div className="space-y-4">
      {/* Alerta urgente */}
      <div className="bg-[hsl(var(--alert-critical-bg))] rounded-lg p-5 border-2 border-[hsl(var(--alert-critical-border))]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--alert-critical-icon))] flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="destructive">URGENTE</Badge>
              <Badge variant="outline">Alfabetização</Badge>
            </div>
            <h5 className="font-bold text-[hsl(var(--alert-critical-text))] mb-2">
              Progresso 25% abaixo do esperado
            </h5>
            <p className="text-sm text-[hsl(var(--alert-critical-text))] mb-4">
              João está significativamente abaixo da projeção em leitura. 
              Intervenção recomendada nas próximas 2 semanas.
            </p>

            {/* Métrica visual */}
            <div className="bg-card rounded-lg p-3 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Esperado: 60%</span>
                <span className="text-[hsl(var(--alert-critical-icon))] font-semibold">Atual: 35%</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div className="absolute h-full bg-[hsl(var(--alert-critical-icon))]" style={{ width: '35%' }} />
                <div className="absolute h-full bg-[hsl(var(--alert-critical-icon))]/20" style={{ width: '60%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-[hsl(var(--alert-critical-text))]">Ações recomendadas:</p>
              {[
                "Implementar método fônico intensivo",
                "Agendar reunião com coordenação",
                "Solicitar avaliação fonoaudiológica"
              ].map((acao, idx) => (
                <label key={idx} className="flex items-center gap-3 p-2 bg-card rounded hover:bg-muted/50 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-foreground">{acao}</span>
                </label>
              ))}
            </div>

            <Button className="w-full mt-4 bg-[hsl(var(--alert-critical-icon))] hover:bg-[hsl(var(--alert-critical-border))] text-white">
              Criar plano de intervenção
            </Button>
          </div>
        </div>
      </div>

      {/* Alerta de atenção */}
      <div className="bg-[hsl(var(--alert-warning-bg))] rounded-lg p-5 border-2 border-[hsl(var(--alert-warning-border))]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--alert-warning-icon))] flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-[hsl(var(--alert-warning-icon))] text-white border-0">ATENÇÃO</Badge>
              <Badge variant="outline">Socialização</Badge>
            </div>
            <h5 className="font-bold text-[hsl(var(--alert-warning-text))] mb-2">
              Regressão em interações sociais
            </h5>
            <p className="text-sm text-[hsl(var(--alert-warning-text))] mb-3">
              Redução de 30% no tempo de interação nas últimas 3 semanas. 
              Investigar possíveis causas.
            </p>
            <Button variant="outline" className="w-full border-[hsl(var(--alert-warning-border))]">
              Ver detalhes e ações
            </Button>
          </div>
        </div>
      </div>

      {/* Oportunidade */}
      <div className="bg-success/5 rounded-lg p-5 border-2 border-success/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-success text-white border-0">OPORTUNIDADE</Badge>
              <Badge variant="outline">Autonomia</Badge>
            </div>
            <h5 className="font-bold text-foreground mb-2">
              🎉 Progresso acima do esperado!
            </h5>
            <p className="text-sm text-muted-foreground mb-3">
              João superou expectativas em autonomia (+15%). Considere aumentar 
              complexidade dos objetivos.
            </p>
            <Button variant="outline" className="w-full">
              Revisar objetivos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictiveAnalysis;
