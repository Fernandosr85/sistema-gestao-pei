interface ChartDataTableProps {
  /** Descreve a tabela para quem usa leitor de tela. Não aparece na tela. */
  caption: string;
  /** Cabeçalhos das colunas. O primeiro rotula a linha. */
  columns: string[];
  /** Uma linha por ponto do gráfico, na mesma ordem das colunas. */
  rows: (string | number)[][];
  /** Texto do controle que abre a tabela. */
  summary?: string;
}

/**
 * Equivalente textual de um gráfico, exigido pela invariante 4 do CLAUDE.md.
 *
 * Fica recolhido, para não duplicar a tela de quem lê o gráfico, mas é um `<details>`
 * nativo: entra na ordem de foco, abre pelo teclado e é anunciado pelo leitor de tela
 * sem nenhum script. O gráfico ao lado leva `role="img"` e um nome, o que o transforma
 * numa folha da árvore de acessibilidade — sem isso, o leitor percorre dezenas de
 * caminhos e rótulos de eixo soltos do SVG.
 */
const ChartDataTable = ({ caption, columns, rows, summary }: ChartDataTableProps) => (
  <details className="mt-4">
    <summary className="cursor-pointer text-sm text-muted-foreground">
      {summary ?? 'Ver os dados do gráfico em tabela'}
    </summary>
    <div className="mt-2 overflow-x-auto">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border">
            {columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={`py-2 font-medium ${index === 0 ? 'text-left' : 'text-right'}`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={String(row[0])} className="border-b border-border/50">
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={index} scope="row" className="py-2 text-left font-normal">
                    {cell}
                  </th>
                ) : (
                  <td key={index} className="py-2 text-right tabular-nums">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </details>
);

export default ChartDataTable;
