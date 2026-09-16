import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import DemoDataNotice from '@/components/DemoDataNotice';

interface Risco {
  id: string;
  titulo: string;
  categoria: 'Gestão de Pessoas' | 'Conformidade' | 'Financeiro' | 'Operacional';
  probabilidade: number; // 0-100
  impacto: 'Baixo' | 'Médio' | 'Alto';
  descricao: string;
  impactosDetalhados: string[];
  mitigacoesPropostas: string[];
  custoMitigacao: number;
  custoNaoMitigar: number;
  status: 'Identificado' | 'Em monitoramento' | 'Em mitigação' | 'Resolvido' | 'Aceito';
  responsavel: string;
  prazo: string;
  atualizado: string;
}

const mockRiscos: Risco[] = [
  {
    id: 'R1',
    titulo: 'Alta Rotatividade Prof. de Apoio',
    categoria: 'Gestão de Pessoas',
    probabilidade: 85,
    impacto: 'Alto',
    descricao: '2 dos 3 contratos vencem em Janeiro/2025. Histórico: 60% não renovam (salário baixo)',
    impactosDetalhados: [
      'Interrupção atendimento de 8 alunos',
      'Sobrecarga professores regulares (+40%)',
      'Queda qualidade ensino',
      'Insatisfação famílias'
    ],
    mitigacoesPropostas: [
      'Iniciar processo seletivo AGORA',
      'Negociar aumento salarial 10-15%',
      'Oferecer plano de carreira claro',
      'Melhorar condições de trabalho'
    ],
    custoMitigacao: 18000,
    custoNaoMitigar: 60000,
    status: 'Em monitoramento',
    responsavel: 'Diretora Paula',
    prazo: '31/12/2024',
    atualizado: '25/11/2024 às 08:30'
  },
  {
    id: 'R2',
    titulo: 'Não Conformidade BNCC-EE',
    categoria: 'Conformidade',
    probabilidade: 65,
    impacto: 'Alto',
    descricao: 'Adaptações curriculares de 4 alunos não seguem 100% as diretrizes da Base Nacional Comum Curricular para Educação Especial',
    impactosDetalhados: [
      'Multa de R$ 50.000 se auditoria detectar',
      'Descredenciamento temporário do programa',
      'Perda de reputação institucional',
      'Prejuízo pedagógico aos alunos'
    ],
    mitigacoesPropostas: [
      'Revisar todos os PEIs em 30 dias',
      'Contratar consultoria especializada BNCC-EE',
      'Capacitar equipe em normativas atuais',
      'Implementar checklist de conformidade mensal'
    ],
    custoMitigacao: 12000,
    custoNaoMitigar: 50000,
    status: 'Identificado',
    responsavel: 'Coord. Pedagógica',
    prazo: '15/01/2025',
    atualizado: '23/11/2024 às 14:20'
  },
  {
    id: 'R3',
    titulo: 'Sobrecarga Equipe Pedagógica',
    categoria: 'Gestão de Pessoas',
    probabilidade: 75,
    impacto: 'Médio',
    descricao: '2 professoras estão com carga de trabalho acima de 90%. Histórico de afastamentos por estresse em março/2024',
    impactosDetalhados: [
      'Afastamentos médicos (histórico comprovado)',
      'Queda na qualidade do atendimento',
      'Aumento de turnover',
      'Custos com substituições emergenciais'
    ],
    mitigacoesPropostas: [
      'Redistribuir 2 alunos PEI entre equipe',
      'Contratar professor de apoio adicional',
      'Liberar de tarefas administrativas',
      'Oferecer suporte psicológico'
    ],
    custoMitigacao: 8000,
    custoNaoMitigar: 25000,
    status: 'Em mitigação',
    responsavel: 'RH + Coordenação',
    prazo: '10/12/2024',
    atualizado: '24/11/2024 às 16:45'
  },
  {
    id: 'R4',
    titulo: 'Equipamentos TEA Obsoletos',
    categoria: 'Operacional',
    probabilidade: 50,
    impacto: 'Médio',
    descricao: 'Tablets e softwares de comunicação aumentativa com 3+ anos de uso. Lentidão prejudica terapias',
    impactosDetalhados: [
      'Frustração dos alunos TEA',
      'Redução da eficácia terapêutica',
      'Reclamações das famílias',
      'Perda de dados por falhas técnicas'
    ],
    mitigacoesPropostas: [
      'Orçar renovação completa (5 tablets + 3 softwares)',
      'Solicitar verba extraordinária',
      'Considerar locação ao invés de compra',
      'Implementar plano de renovação tecnológica trienal'
    ],
    custoMitigacao: 15000,
    custoNaoMitigar: 5000,
    status: 'Em monitoramento',
    responsavel: 'Coord. Tecnologia',
    prazo: '28/02/2025',
    atualizado: '20/11/2024 às 10:15'
  },
  {
    id: 'R5',
    titulo: 'Orçamento 2025 Insuficiente',
    categoria: 'Financeiro',
    probabilidade: 40,
    impacto: 'Médio',
    descricao: 'Proposta de orçamento 2025 (R$ 145k) pode ser cortada em 20% pela diretoria regional devido a contenção de custos',
    impactosDetalhados: [
      'Impossibilidade de contratar novo prof. apoio',
      'Cancelamento de formações planejadas',
      'Redução na compra de materiais adaptados',
      'Comprometimento da qualidade do programa'
    ],
    mitigacoesPropostas: [
      'Preparar justificativa técnica robusta',
      'Apresentar ROI do programa PEI',
      'Buscar parcerias/doações para materiais',
      'Priorizar gastos essenciais vs. desejáveis'
    ],
    custoMitigacao: 3000,
    custoNaoMitigar: 29000,
    status: 'Em monitoramento',
    responsavel: 'Diretora Paula',
    prazo: '30/11/2024',
    atualizado: '22/11/2024 às 09:00'
  },
  {
    id: 'R6',
    titulo: 'Falta de Materiais Adaptados',
    categoria: 'Operacional',
    probabilidade: 25,
    impacto: 'Baixo',
    descricao: 'Estoque de materiais sensoriais e adaptados está 70% completo, mas há risco de falta se houver aumento de matrículas TEA no 1º semestre',
    impactosDetalhados: [
      'Atraso no início de atendimentos',
      'Improvisação pedagógica',
      'Experiência subótima para novos alunos'
    ],
    mitigacoesPropostas: [
      'Manter estoque de segurança de 3 meses',
      'Estabelecer fornecedor alternativo',
      'Criar lista de materiais de baixo custo DIY'
    ],
    custoMitigacao: 2500,
    custoNaoMitigar: 1500,
    status: 'Aceito',
    responsavel: 'Coord. Materiais',
    prazo: '31/03/2025',
    atualizado: '18/11/2024 às 13:30'
  }
];

const AlertasRiscosContent = () => {
  const [expandedRisks, setExpandedRisks] = useState<string[]>([]);

  const toggleRisk = (riskId: string) => {
    setExpandedRisks(prev =>
      prev.includes(riskId) ? prev.filter(id => id !== riskId) : [...prev, riskId]
    );
  };

  const getSeverityLevel = (probabilidade: number, impacto: string): 'critical' | 'high' | 'medium' | 'low' => {
    const impactoScore = impacto === 'Alto' ? 3 : impacto === 'Médio' ? 2 : 1;
    const probScore = probabilidade >= 70 ? 3 : probabilidade >= 40 ? 2 : 1;
    const total = impactoScore + probScore;
    
    if (total >= 6) return 'critical';
    if (total >= 5) return 'high';
    if (total >= 3) return 'medium';
    return 'low';
  };

  /*
   * Cores fixas do Tailwind davam entre 3,0:1 e 4,2:1 sobre o próprio fundo tingido,
   * abaixo do mínimo AA. Os tokens da marca são medidos e passam.
   */
  const getSeverityColor = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical': return 'bg-brand-red/10 text-brand-red border-brand-red/30';
      case 'high': return 'bg-brand-orange/10 text-brand-orange border-brand-orange/30';
      case 'medium': return 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/30';
      case 'low': return 'bg-brand-green/10 text-brand-green border-brand-green/30';
    }
  };

  const getSeverityName = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical': return 'crítica';
      case 'high': return 'alta';
      case 'medium': return 'média';
      case 'low': return 'baixa';
    }
  };

  const getProbabilityName = (probabilidade: number) =>
    probabilidade >= 70 ? 'alta' : probabilidade >= 40 ? 'média' : 'baixa';

  /**
   * Cada célula da matriz é um botão que abre o detalhe do risco lá embaixo. Antes
   * era um `Badge`, que renderiza `<div>`: o clique funcionava e o teclado não
   * chegava a nenhuma das nove células. O nome acessível começa pelo texto visível,
   * como exige o critério 2.5.3, e continua com probabilidade, impacto e severidade
   * em palavras — na grade, esses três só existiam como posição e tom de cor.
   *
   * O `aria-controls` aponta para o cartão do risco, e não para o conteúdo do
   * Collapsible: o Radix gera um id próprio para esse conteúdo e o usa no seu
   * gatilho, então sobrescrevê-lo deixava o gatilho apontando para um id inexistente.
   */
  const renderCelulaMatriz = (riscos: Risco[]) =>
    riscos.map(risco => {
      const severity = getSeverityLevel(risco.probabilidade, risco.impacto);
      return (
        <button
          key={risco.id}
          type="button"
          onClick={() => toggleRisk(risco.id)}
          aria-expanded={expandedRisks.includes(risco.id)}
          aria-controls={`risco-${risco.id}`}
          className={cn(
            badgeVariants(),
            'text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          )}
        >
          {`${risco.id} · ${getSeverityName(severity)}`}
          <span className="sr-only">
            {`. ${risco.titulo}. Probabilidade ${getProbabilityName(risco.probabilidade)},`}
            {` ${risco.probabilidade} por cento. Impacto ${risco.impacto.toLowerCase()}.`}
          </span>
        </button>
      );
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Identificado': return 'bg-brand-red/10 text-brand-red border-brand-red/30';
      case 'Em monitoramento': return 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/30';
      case 'Em mitigação': return 'bg-brand-blue/10 text-brand-blue border-brand-blue/30';
      case 'Resolvido': return 'bg-brand-green/10 text-brand-green border-brand-green/30';
      case 'Aceito': return 'bg-brand-gray/10 text-brand-gray border-brand-gray/30';
      default: return '';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Gestão de Pessoas': return 'bg-brand-purple/10 text-brand-purple border-brand-purple/30';
      case 'Conformidade': return 'bg-brand-red/10 text-brand-red border-brand-red/30';
      case 'Financeiro': return 'bg-brand-green/10 text-brand-green border-brand-green/30';
      case 'Operacional': return 'bg-brand-blue/10 text-brand-blue border-brand-blue/30';
      default: return '';
    }
  };

  const getRisksByPosition = () => {
    const positions = {
      alto_alto: [] as Risco[],
      alto_medio: [] as Risco[],
      alto_baixo: [] as Risco[],
      medio_alto: [] as Risco[],
      medio_medio: [] as Risco[],
      medio_baixo: [] as Risco[],
      baixo_alto: [] as Risco[],
      baixo_medio: [] as Risco[],
      baixo_baixo: [] as Risco[]
    };

    mockRiscos.forEach(risco => {
      const probNivel = risco.probabilidade >= 70 ? 'alto' : risco.probabilidade >= 40 ? 'medio' : 'baixo';
      const impactoNivel = risco.impacto === 'Alto' ? 'alto' : risco.impacto === 'Médio' ? 'medio' : 'baixo';
      const key = `${probNivel}_${impactoNivel}` as keyof typeof positions;
      positions[key].push(risco);
    });

    return positions;
  };

  const positions = getRisksByPosition();

  const riscosSorted = [...mockRiscos].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const severityA = getSeverityLevel(a.probabilidade, a.impacto);
    const severityB = getSeverityLevel(b.probabilidade, b.impacto);
    return severityOrder[severityA] - severityOrder[severityB];
  });

  const countBySeverity = {
    critical: riscosSorted.filter(r => getSeverityLevel(r.probabilidade, r.impacto) === 'critical').length,
    high: riscosSorted.filter(r => getSeverityLevel(r.probabilidade, r.impacto) === 'high').length,
    medium: riscosSorted.filter(r => getSeverityLevel(r.probabilidade, r.impacto) === 'medium').length,
    low: riscosSorted.filter(r => getSeverityLevel(r.probabilidade, r.impacto) === 'low').length,
  };

  const acoesImediatas = riscosSorted.filter(r => 
    getSeverityLevel(r.probabilidade, r.impacto) === 'critical' || 
    getSeverityLevel(r.probabilidade, r.impacto) === 'high'
  ).length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Gestão &gt; Alertas e Riscos
      </div>

      <DemoDataNotice
        subject="Os riscos, probabilidades, impactos e planos de mitigação"
        detail="Nenhuma avaliação de risco é calculada a partir dos registros do sistema."
      />

      {/* Resumo de Riscos */}
      <Card>
        <CardHeader>
          <CardTitle level={2} className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Resumo de Riscos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 rounded-lg bg-brand-red/10 border border-brand-red/30">
              <div className="text-3xl font-bold text-brand-red">{countBySeverity.critical}</div>
              <div className="text-sm text-brand-red">Críticos 🔴</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-brand-orange/10 border border-brand-orange/30">
              <div className="text-3xl font-bold text-brand-orange">{countBySeverity.high}</div>
              <div className="text-sm text-brand-orange">Altos 🟡</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-brand-yellow/10 border border-brand-yellow/30">
              <div className="text-3xl font-bold text-brand-yellow">{countBySeverity.medium}</div>
              <div className="text-sm text-brand-yellow">Médios ⚠️</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-brand-green/10 border border-brand-green/30">
              <div className="text-3xl font-bold text-brand-green">{countBySeverity.low}</div>
              <div className="text-sm text-brand-green">Baixos ✅</div>
            </div>
          </div>
          <div className="p-4 bg-brand-red/5 rounded-lg border border-brand-red/20">
            <p className="text-sm font-semibold text-brand-red">
              AÇÕES IMEDIATAS NECESSÁRIAS: {acoesImediatas}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Matriz de Riscos */}
      <Card>
        <CardHeader>
          <CardTitle level={2}>Matriz de Riscos (Probabilidade × Impacto)</CardTitle>
          <CardDescription>Distribuição visual dos riscos identificados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Cabeçalho da matriz */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div className="text-sm font-semibold text-muted-foreground"></div>
                <div className="text-center text-sm font-semibold text-muted-foreground">Baixo</div>
                <div className="text-center text-sm font-semibold text-muted-foreground">Médio</div>
                <div className="text-center text-sm font-semibold text-muted-foreground">Alto</div>
              </div>

              {/* Linha Alto */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div className="flex items-center text-sm font-semibold text-muted-foreground">Alto</div>
                <div className="min-h-[80px] border-2 border-brand-yellow/30 bg-brand-yellow/5 rounded-lg p-2 flex flex-wrap gap-1 content-start">
                  {renderCelulaMatriz(positions.alto_baixo)}
                </div>
                <div className="min-h-[80px] border-2 border-brand-orange/30 bg-brand-orange/5 rounded-lg p-2 flex flex-wrap gap-1 content-start">
                  {renderCelulaMatriz(positions.alto_medio)}
                </div>
                <div className="min-h-[80px] border-2 border-brand-red/30 bg-brand-red/5 rounded-lg p-2 flex flex-wrap gap-1 content-start">
                  {renderCelulaMatriz(positions.alto_alto)}
                </div>
              </div>

              {/* Linha Médio */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div className="flex items-center text-sm font-semibold text-muted-foreground">Médio</div>
                <div className="min-h-[80px] border-2 border-brand-green/30 bg-brand-green/5 rounded-lg p-2 flex flex-wrap gap-1 content-start">
                  {renderCelulaMatriz(positions.medio_baixo)}
                </div>
                <div className="min-h-[80px] border-2 border-brand-yellow/30 bg-brand-yellow/5 rounded-lg p-2 flex flex-wrap gap-1 content-start">
                  {renderCelulaMatriz(positions.medio_medio)}
                </div>
                <div className="min-h-[80px] border-2 border-brand-orange/30 bg-brand-orange/5 rounded-lg p-2 flex flex-wrap gap-1 content-start">
                  {renderCelulaMatriz(positions.medio_alto)}
                </div>
              </div>

              {/* Linha Baixo */}
              <div className="grid grid-cols-4 gap-2">
                <div className="flex items-center text-sm font-semibold text-muted-foreground">Baixo</div>
                <div className="min-h-[80px] border-2 border-brand-green/30 bg-brand-green/5 rounded-lg p-2 flex flex-wrap gap-1 content-start">
                  {renderCelulaMatriz(positions.baixo_baixo)}
                </div>
                <div className="min-h-[80px] border-2 border-brand-green/30 bg-brand-green/5 rounded-lg p-2 flex flex-wrap gap-1 content-start">
                  {renderCelulaMatriz(positions.baixo_medio)}
                </div>
                <div className="min-h-[80px] border-2 border-brand-yellow/30 bg-brand-yellow/5 rounded-lg p-2 flex flex-wrap gap-1 content-start">
                  {renderCelulaMatriz(positions.baixo_alto)}
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <p className="font-semibold mb-1">Legenda:</p>
                <p>
                  Cada risco na grade abre o detalhe correspondente na lista abaixo. A posição indica
                  probabilidade, na vertical, e impacto, na horizontal.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento de Riscos */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Detalhamento de Riscos</h2>
        {riscosSorted.map(risco => {
          const severity = getSeverityLevel(risco.probabilidade, risco.impacto);
          const isExpanded = expandedRisks.includes(risco.id);

          return (
            <Card id={`risco-${risco.id}`} key={risco.id} className={cn("border-l-4", getSeverityColor(severity).replace('bg-', 'border-l-').split(' ')[0])}>
              <Collapsible open={isExpanded} onOpenChange={() => toggleRisk(risco.id)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {/*
                          * Sem a classe de cor do getSeverityColor: as cores fixas do Tailwind
                          * usadas ali ficam entre 3,0:1 e 4,2:1 sobre o próprio fundo tingido,
                          * abaixo do mínimo AA. A cor da severidade continua na borda esquerda
                          * do cartão, e a palavra diz o resto. Os tokens saem num commit próprio.
                          */}
                        <Badge variant="outline">
                          {`Severidade ${getSeverityName(severity)}`}
                        </Badge>
                        <CardTitle className="text-lg">
                          RISCO {risco.id}: {risco.titulo.toUpperCase()}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary" className={getCategoriaColor(risco.categoria)}>
                          {risco.categoria}
                        </Badge>
                        <Badge variant="secondary" className={getStatusColor(risco.status)}>
                          {risco.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Probabilidade: {risco.probabilidade}% | Impacto: {risco.impacto}
                      </div>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`${isExpanded ? 'Recolher' : 'Expandir'} o detalhe do risco ${risco.id}, ${risco.titulo}`}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>

                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {/* Descrição */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">DESCRIÇÃO:</h4>
                      <p className="text-sm text-muted-foreground">{risco.descricao}</p>
                    </div>

                    {/* Impactos */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">IMPACTO SE OCORRER:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {risco.impactosDetalhados.map((impacto, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">{impacto}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Mitigações */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">MITIGAÇÃO RECOMENDADA:</h4>
                      <ol className="list-decimal list-inside space-y-1">
                        {risco.mitigacoesPropostas.map((mitigacao, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">{mitigacao}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Custos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold mb-1">💰 Custo de Mitigação:</p>
                        <p className="text-lg font-bold text-brand-green">
                          R$ {risco.custoMitigacao.toLocaleString('pt-BR')}/ano
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">💸 Custo se Não Mitigar:</p>
                        <p className="text-lg font-bold text-brand-red">
                          R$ {risco.custoNaoMitigar.toLocaleString('pt-BR')}+
                        </p>
                      </div>
                    </div>

                    {/* Responsável e prazo */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Responsável:</span>{' '}
                        <span className="text-muted-foreground">{risco.responsavel}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Prazo:</span>{' '}
                        <span className="text-muted-foreground">{risco.prazo}</span>
                      </div>
                    </div>

                    {/* Status e última atualização */}
                    <div className="flex items-center justify-end pt-4 border-t">
                      <div className="text-xs text-muted-foreground">
                        Atualizado em: {risco.atualizado}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AlertasRiscosContent;
