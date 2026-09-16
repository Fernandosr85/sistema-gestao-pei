import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Fixed illustrative series. Previously this used Math.random(), so the chart
 * showed different numbers on every render - the same day could report 0 and 5
 * observations seconds apart. Replace with counts derived from real
 * observations once persistence exists.
 */
const DEMO_COUNTS = [
  0, 2, 3, 1, 0, 0, 4, 2, 1, 5,
  3, 0, 0, 2, 4, 1, 3, 2, 0, 0,
  1, 5, 3, 2, 4, 0, 0, 1, 2, 3,
];

const MONTH = { year: 2024, month: 10 } as const; // novembro de 2024

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const getColorForCount = (count: number) => {
  if (count === 0) return 'bg-muted';
  if (count <= 2) return 'bg-success/30';
  if (count <= 4) return 'bg-success/60';
  return 'bg-success';
};

const describeCount = (count: number) =>
  count === 1 ? '1 observação' : `${count} observações`;

/**
 * Calendário de observações do mês.
 *
 * Era uma grade de `<div>` com a contagem apenas no tooltip de hover: quem não usa
 * mouse não tinha como saber quantas observações havia em cada dia. Virou tabela, e não
 * botões — as células nunca tiveram ação, e transformá-las em controle criaria botão
 * inerte. A contagem agora está escrita em cada célula, o cabeçalho de coluna é o dia da
 * semana e o de linha é a semana do mês.
 *
 * O cabeçalho antigo também estava errado: a grade começava no dia 1 na primeira coluna,
 * sob "Dom", sem alinhar com o dia da semana real. Agora as células vazias do começo do
 * mês são preenchidas de acordo com o calendário.
 */
const ObservationHeatmap = () => {
  const firstDay = new Date(MONTH.year, MONTH.month, 1);
  const monthLabel = firstDay.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Alinha o dia 1 com o dia da semana correto e quebra o mês em semanas de sete células.
  const cells: ({ day: number; count: number } | null)[] = [
    ...Array.from({ length: firstDay.getDay() }, () => null),
    ...DEMO_COUNTS.map((count, index) => ({ day: index + 1, count })),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = Array.from({ length: cells.length / 7 }, (_, week) =>
    cells.slice(week * 7, week * 7 + 7),
  );

  const total = DEMO_COUNTS.reduce((sum, count) => sum + count, 0);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">FREQUÊNCIA DE OBSERVAÇÕES</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-separate border-spacing-2">
              <caption className="sr-only">
                {`Observações por dia em ${monthLabel}: ${describeCount(total)} no mês.`}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="sr-only">
                    Semana
                  </th>
                  {WEEK_DAYS.map((day) => (
                    <th
                      key={day}
                      scope="col"
                      className="text-center text-xs font-medium text-muted-foreground"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, index) => (
                  <tr key={index}>
                    <th scope="row" className="sr-only">
                      {`Semana ${index + 1}`}
                    </th>
                    {week.map((cell, position) =>
                      cell === null ? (
                        <td key={position} />
                      ) : (
                        <td
                          key={position}
                          className={`
                            aspect-square rounded border-2 border-border align-middle
                            ${getColorForCount(cell.count)}
                            text-center text-xs font-semibold
                          `}
                        >
                          {/*
                            * Os dois números são visuais: lidos em sequência, o leitor diria
                            * "1 0". A célula é anunciada por uma frase só.
                            */}
                          <span aria-hidden="true" className="block">{cell.day}</span>
                          <span aria-hidden="true" className="block font-normal">{cell.count}</span>
                          <span className="sr-only">
                            {`Dia ${cell.day}, ${describeCount(cell.count)}`}
                          </span>
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap items-center gap-3 pt-4 text-xs text-muted-foreground">
            <span>Cor da célula, por faixa de contagem:</span>
            {[
              { rotulo: 'nenhuma', classe: 'bg-muted' },
              { rotulo: '1 a 2', classe: 'bg-success/30' },
              { rotulo: '3 a 4', classe: 'bg-success/60' },
              { rotulo: '5 ou mais', classe: 'bg-success' },
            ].map((faixa) => (
              <span key={faixa.rotulo} className="flex items-center gap-1">
                <span
                  aria-hidden="true"
                  className={`inline-block h-4 w-4 rounded border border-border ${faixa.classe}`}
                />
                {faixa.rotulo}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ObservationHeatmap;
