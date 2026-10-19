import type { ReactNode } from 'react';

/*
 * Legenda de gráfico com o MARCADOR DE COR fora da árvore de acessibilidade.
 *
 * A legenda padrão do Recharts desenha cada item como um `<svg>` de 14 px seguido do rótulo
 * (`DefaultLegendContent`, com `<Surface>` de props fixos). Esse `<svg>` não tem `role` nem nome, e
 * o Chrome o expõe como imagem sem nome — medido na Etapa 15, 5 deles na rota dos relatórios e 4 na
 * do orçamento. Ele fica FORA do `<svg>` do gráfico, num `<ul>` irmão, e por isso sobrevive ao
 * `aria-hidden` que a Etapa 15 pôs no desenho (Pendência 8).
 *
 * Como o `<svg>` do ícone é montado dentro da biblioteca, não há prop que lhe acrescente
 * `aria-hidden`: o caminho é `content`, que substitui o conteúdo da legenda inteiro. Aqui o
 * marcador é um `<span>` colorido com `aria-hidden="true"` — decorativo, como já eram os
 * indicadores de cor das legendas escritas à mão deste projeto (`InterventionDonut`,
 * `AgendaAtendimentos`) — e **o rótulo fica**, porque é ele que carrega o significado.
 *
 * O formato do marcador segue o do ícone que ele substitui, para a legenda continuar legível do
 * mesmo jeito: série tracejada ganha linha tracejada, `iconType="line"` ganha linha, o resto ganha
 * quadradinho.
 *
 * Os props são todos opcionais porque quem os injeta é o Recharts, em tempo de execução, ao clonar
 * o elemento passado em `content` — e não o código que escreve `<Legend content={<ChartLegend />} />`.
 */

interface ItemDaLegenda {
  value?: string | number;
  color?: string;
  dataKey?: string | number;
  /** O objeto da série, de onde saem o traçado e a cor do traço. */
  payload?: { strokeDasharray?: string | number; stroke?: string };
}

/*
 * A cor do marcador, e por que isto não é só `item.color`.
 *
 * O Recharts entrega em `color` o que a série usa para pintar — e a área do gráfico de progresso
 * usa `fill="url(#colorProgresso)"`, um gradiente definido no `<defs>` do próprio SVG. Dentro do
 * SVG o ícone padrão resolve essa referência; num `<span>` fora dele, `background-color: url(…)` é
 * inválido e o marcador fica INVISÍVEL. Medido: `rgba(0, 0, 0, 0)` no primeiro item da legenda do
 * progresso, até esta função existir.
 *
 * A cadeia, em ordem: a cor da série, quando é cor mesmo; a primeira parada do gradiente, quando é
 * referência a um; o traço da série; e, em último caso, a cor do texto.
 */
const corDoMarcador = (item: ItemDaLegenda): string => {
  const cor = item.color;
  if (cor && !cor.startsWith('url(') && cor !== 'none') return cor;

  const id = cor?.match(/^url\(#(.+)\)$/)?.[1];
  if (id && typeof document !== 'undefined') {
    const parada = document.getElementById(id)?.querySelector('stop');
    const corDaParada = parada?.getAttribute('stop-color');
    if (corDaParada) return corDaParada;
  }

  const traco = item.payload?.stroke;
  if (traco && traco !== 'none') return traco;

  return 'currentColor';
};

interface ChartLegendProps {
  payload?: ItemDaLegenda[];
  formatter?: (value: string | number | undefined, entry: ItemDaLegenda, index: number) => ReactNode;
  iconType?: string;
}

const ChartLegend = ({ payload = [], formatter, iconType }: ChartLegendProps) => (
  <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
    {payload.map((item, indice) => {
      const tracejada = Boolean(item.payload?.strokeDasharray);
      const cor = corDoMarcador(item);
      const corDaSerie = item.color && !item.color.startsWith('url(') && item.color !== 'none'
        ? item.color
        : undefined;
      return (
        <li key={`${String(item.dataKey ?? item.value ?? 'serie')}-${indice}`} className="flex items-center gap-2">
          {tracejada ? (
            <span
              aria-hidden="true"
              className="inline-block w-4 border-t-2 border-dashed"
              style={{ borderColor: cor }}
            />
          ) : (
            <span
              aria-hidden="true"
              className={iconType === 'line' ? 'inline-block h-0.5 w-4' : 'inline-block h-3 w-3 rounded-sm'}
              style={{ backgroundColor: cor }}
            />
          )}
          {/*
            * O RÓTULO usa a cor da série só quando ela é cor mesmo, e herda a cor do texto quando
            * não é. É o que a legenda padrão do Recharts já fazia — ela também escreve
            * `color: url(…)`, que o navegador ignora —, e manter isso é não mexer no visual de
            * quem enxerga enquanto se conserta o que a árvore expõe. Medido: o rótulo da área do
            * progresso continua em `rgb(28, 28, 28)`.
            */}
          <span style={corDaSerie ? { color: corDaSerie } : undefined}>
            {formatter ? formatter(item.value, item, indice) : item.value}
          </span>
        </li>
      );
    })}
  </ul>
);

export default ChartLegend;
