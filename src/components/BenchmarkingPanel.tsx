import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Target, Users, CheckCircle2 } from "lucide-react";

interface BenchmarkingPanelProps {
  studentName: string;
  diagnosis: string;
  diagnosisLevel?: string;
}

export const BenchmarkingPanel = ({ studentName, diagnosis, diagnosisLevel }: BenchmarkingPanelProps) => {
  const firstName = studentName.split(" ")[0];
  const networkSize = 378;
  const similarCases = 234;

  const strategies = [
    {
      name: "Timer visual",
      effectiveness: 92,
      improvement: 34,
      implemented: false,
    },
    {
      name: "Rotina com pictogramas",
      effectiveness: 89,
      improvement: 28,
      implemented: true,
    },
    {
      name: "Cantinho da calma",
      effectiveness: 87,
      improvement: 31,
      implemented: true,
    },
  ];

  const benchmarks = [
    {
      area: "Comunicação",
      studentScore: 78,
      networkAverage: 65,
      status: "above" as const,
    },
    {
      area: "Socialização",
      studentScore: 45,
      networkAverage: 58,
      status: "below" as const,
    },
    {
      area: "Autonomia",
      studentScore: 62,
      networkAverage: 60,
      status: "equal" as const,
    },
  ];

  const getStatusIcon = (status: "above" | "below" | "equal") => {
    switch (status) {
      case "above":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "below":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "equal":
        return <span className="text-sm">≈</span>;
    }
  };

  const notImplementedStrategy = strategies.find(s => !s.implemented);

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Insights Baseados em Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Network Analysis */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Target className="h-4 w-4" />
            ANÁLISE: Alunos com {diagnosis} {diagnosisLevel} na Rede SESI ({networkSize} alunos)
          </div>

          {/* Strategies with Highest Success */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-3">
              <h4 className="font-semibold text-sm mb-3">Estratégias com Maior Sucesso:</h4>
              
              {strategies.map((strategy, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {index + 1}. {strategy.name}
                      </span>
                      {strategy.implemented && (
                        <Badge variant="secondary" className="text-xs">
                          Implementado
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-medium text-primary">
                      {strategy.effectiveness}% eficácia
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span>Melhoria média: +{strategy.improvement}%</span>
                  </div>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-xs"
                  >
                    {strategy.implemented ? "Ver implementação" : "Ver casos de sucesso"} →
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommendation Alert */}
          {notImplementedStrategy && (
            <Card className="border-yellow-600/50 bg-yellow-50/50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">ATENÇÃO:</p>
                    <p className="text-sm text-muted-foreground">
                      {firstName} ainda não usa {notImplementedStrategy.name.toLowerCase()}.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Baseado em {similarCases} casos similares, há {notImplementedStrategy.effectiveness}% de chance de melhoria.
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-2"
                      variant="default"
                    >
                      Implementar {notImplementedStrategy.name}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Benchmarking Section */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            BENCHMARKING:
          </h4>
          <p className="text-xs text-muted-foreground">
            {firstName} vs. Média SESI ({diagnosis} {diagnosisLevel}):
          </p>

          <div className="space-y-4">
            {benchmarks.map((benchmark, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{benchmark.area}:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {benchmark.studentScore}% vs. {benchmark.networkAverage}%
                    </span>
                    {getStatusIcon(benchmark.status)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Progress 
                      value={benchmark.studentScore} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Insight Box */}
          <Card className="bg-blue-50/50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-2">
                <div className="text-2xl">💡</div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    {firstName} está acima da média em comunicação! Foco agora em 
                    socialização pode trazer melhores resultados.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ethics Notice */}
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Ética e Privacidade:</p>
            <ul className="space-y-0.5 ml-4 list-disc">
              <li>Dados 100% anonimizados</li>
              <li>Apenas estatísticas agregadas</li>
              <li>Consentimento explícito para participar</li>
              <li>Opt-out a qualquer momento</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
