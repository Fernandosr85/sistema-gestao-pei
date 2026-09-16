import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Target, Users, CheckCircle2 } from "lucide-react";
import DemoDataNotice from '@/components/DemoDataNotice';

interface BenchmarkingPanelProps {
  studentName: string;
  diagnosis: string;
  diagnosisLevel?: string;
}

export const BenchmarkingPanel = ({ studentName, diagnosis, diagnosisLevel }: BenchmarkingPanelProps) => {
  const firstName = studentName.split(" ")[0];

  /*
   * Saíram a "coorte" de 378 alunos, os 234 "casos similares", a eficácia e a melhoria média de
   * cada estratégia e a "chance de melhoria" de 92%: alegações de análise sobre números fixos,
   * que o CLAUDE.md proíbe. O comparativo com a média da rede fica, como exemplo com aviso.
   */

  const strategies = [
    {
      name: "Timer visual",
      implemented: false,
    },
    {
      name: "Rotina com pictogramas",
      implemented: true,
    },
    {
      name: "Cantinho da calma",
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
          Comparativo ilustrativo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <DemoDataNotice
          subject="As estratégias, a média da rede e o comparativo desta seção"
          detail="Os números são fixos no código e não mudam conforme o aluno exibido. Não há base de casos nem medida de eficácia."
        />
        {/* Network Analysis */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Target className="h-4 w-4" />
            EXEMPLO: estratégias para alunos com {diagnosis} {diagnosisLevel}
          </div>

          {/* Strategies with Highest Success */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-3">
              <h4 className="font-semibold text-sm mb-3">Estratégias de exemplo:</h4>
              
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
                  </div>
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
            {firstName} vs. Média da rede ({diagnosis} {diagnosisLevel}):
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

          {/* Leitura do comparativo */}
          <Card className="bg-blue-50/50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-2">
                <div className="text-2xl">💡</div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Nestes números de exemplo, {firstName} aparece acima da média da rede em
                    comunicação e abaixo em socialização.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requirements for a real implementation */}
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">
              Requisitos para um benchmarking real (ainda não implementados):
            </p>
            <ul className="space-y-0.5 ml-4 list-disc">
              <li>Base de dados governada, com coorte e período definidos</li>
              <li>Anonimização verificável e controle de divulgação estatística</li>
              <li>Base legal registrada por operação de tratamento (LGPD)</li>
              <li>Tamanho mínimo de grupo antes de exibir qualquer comparação</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
