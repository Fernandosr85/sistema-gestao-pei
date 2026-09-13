import DemoDataNotice from '@/components/DemoDataNotice';
import { BarChart3, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type BenchmarkStatus = 'success' | 'warning' | 'error';

interface BenchmarkItem {
  indicador: string;
  escola: { value: number; status: BenchmarkStatus };
  regional: number;
  rede: number;
}

const BenchmarkingTable = () => {
  const benchmarks: BenchmarkItem[] = [
    {
      indicador: 'Taxa Implementação PEI',
      escola: { value: 88, status: 'warning' },
      regional: 85,
      rede: 90
    },
    {
      indicador: 'Progressão Estudantes',
      escola: { value: 82, status: 'success' },
      regional: 75,
      rede: 78
    },
    {
      indicador: 'Formação Docente (h/ano)',
      escola: { value: 52, status: 'success' },
      regional: 45,
      rede: 48
    },
    {
      indicador: 'Satisfação Famílias',
      escola: { value: 91, status: 'success' },
      regional: 87,
      rede: 88
    },
    {
      indicador: 'Inclusão Social',
      escola: { value: 65, status: 'warning' },
      regional: 68,
      rede: 72
    },
    {
      indicador: 'Tempo Resposta (dias)',
      escola: { value: 3.2, status: 'success' },
      regional: 4.1,
      rede: 3.8
    },
    {
      indicador: 'Recursos por Aluno',
      escola: { value: 2.3, status: 'success' },
      regional: 2.1,
      rede: 2.2
    },
    {
      indicador: 'Evasão Alunos PEI (%)',
      escola: { value: 2, status: 'success' },
      regional: 3.5,
      rede: 3
    }
  ];

  const getStatusEmoji = (status?: 'success' | 'warning' | 'error') => {
    if (!status) return '';
    switch (status) {
      case 'success': return '✅';
      case 'warning': return '🟡';
      case 'error': return '🔴';
    }
  };

  const formatValue = (value: number, indicador: string) => {
    if (indicador.includes('h/ano')) return `${value}h`;
    if (indicador.includes('dias')) return value;
    if (indicador.includes('Recursos')) return value.toFixed(1);
    return `${value}%`;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          COMPARATIVOS E BENCHMARKING
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DemoDataNotice
          subject="Os indicadores comparativos e o ranking"
          detail="Nenhuma escola real foi medida ou classificada."
          className="mb-6"
        />
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Comparar com:</span>
          <Button variant="outline" size="sm">
            🏫 Minha Escola
          </Button>
          <Button variant="outline" size="sm">
            🌆 Regional SP
          </Button>
          <Button variant="outline" size="sm">
            🌍 Rede
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">INDICADOR</TableHead>
                <TableHead className="text-center font-bold">Escola</TableHead>
                <TableHead className="text-center font-bold">Region.</TableHead>
                <TableHead className="text-center font-bold">Rede</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benchmarks.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.indicador}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold">{formatValue(item.escola.value, item.indicador)}</span>
                    {item.escola.status && <span className="ml-1">{getStatusEmoji(item.escola.status)}</span>}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {formatValue(item.regional, item.indicador)}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {formatValue(item.rede, item.indicador)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Card className="bg-primary/5 border-primary/20 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-3">💡 INSIGHTS DO BENCHMARKING:</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-success mb-1">✅ Sua escola está ACIMA da média em:</div>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li>Progressão dos estudantes (+4 pp regional, +4 pp rede)</li>
                      <li>Formação docente (+7h regional, +4h rede)</li>
                      <li>Satisfação das famílias (+4 pp regional, +3 pp rede)</li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-medium text-warning mb-1">🟡 Áreas para melhoria:</div>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li>Inclusão social (-3 pp regional, -7 pp rede)</li>
                      <li>Taxa implementação PEI (-2 pp rede)</li>
                    </ul>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-background rounded-lg mt-3">
                    <Award className="h-4 w-4 text-warning mt-0.5" />
                    <div className="text-xs">
                      <span className="font-medium">🎯 Recomendação:</span>
                      <span className="text-muted-foreground"> Implementar boas práticas da Escola Exemplo B (líder em inclusão social: 89%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Ver Ranking Completo
          </Button>
          <Button variant="outline" className="flex-1">
            Boas Práticas
          </Button>
          <Button variant="outline" className="flex-1">
            Solicitar Consultoria
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BenchmarkingTable;
