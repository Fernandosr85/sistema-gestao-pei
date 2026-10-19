/*
 * A CONDIÇÃO DE PRONTO, num lugar só.
 *
 * Cole este arquivo no console ANTES de `fotografia.js` e de `axe-com-condicao.js`. Os dois
 * passaram a usar esta condição, e nenhum tem critério próprio de prontidão.
 *
 * POR QUE EXISTE (achado 26). Até a Etapa 15 o projeto tinha DUAS definições de "pronto" ao mesmo
 * tempo: o axe esperava o objeto do gráfico (condição medida, achado 23), e o arreio esperava
 * 260 ms de relógio — herdado da Etapa 5, quando nenhuma medida dependia de gráfico. Com isso, a
 * captura `a11y` das três superfícies com Recharts era tirada ANTES de o gráfico existir: medido na
 * Etapa 15, 0 setores no instante da fotografia e 5 dois segundos e meio depois. Instrumento com
 * critério próprio de prontidão produz resultado que não se compara com o dos outros.
 *
 * A CONDIÇÃO, e as quatro partes dela:
 *
 *   1. OBJETO, onde há objeto. Nas superfícies com gráfico, espera o elemento que só existe depois
 *      de o gráfico estar pintado — e não um tempo. Qual elemento depende do gráfico, e está em
 *      `MARCADORES`. Medido na Etapa 15: só TRÊS das 23 superfícies têm gráfico do Recharts.
 *   2. SILÊNCIO: 400 ms sem mutação na subárvore principal. Sozinho ele mede ANTES de a coisa
 *      começar (medido: 471 ms de "quieto" numa passada cega contra 2 359 ms numa que viu), e é por
 *      isso que vem DEPOIS do objeto, nunca no lugar dele.
 *   3. SEM TRANSIÇÃO: liga `data-a11y-motion="reduzido"` no elemento raiz enquanto mede, e restaura
 *      depois. O CSS do projeto zera transição e animação (medido em `1e-05s`), e a animação do
 *      Recharts consulta a mesma preferência desde a Etapa 14. Isto fecha o segundo modo de falha,
 *      o do `color-contrast`, que aparece DURANTE a transição de cor e decai para zero (58, 34, 0
 *      nós). Sem isto, a faixa não fechava nem com 1 500 ms de espera.
 *   4. FONTES: `document.fonts.ready`. Trocar a fonte depois de pintar muda cor medida.
 *
 * UMA CONDIÇÃO PARA A CAPTURA INTEIRA, e não uma por medida. As quatro medidas do arreio saem do
 * MESMO instante (`medir()` lê o documento uma vez), então não há onde pendurar condições
 * diferentes sem partir a captura em quatro. E não é preciso: `numeros` e `titulos` medem texto
 * renderizado, e os rótulos de eixo do Recharts não são animados — eles já estavam presentes com
 * 260 ms. Esperar o objeto não tira nada dessas duas; só acrescenta o que faltava à `a11y`. Se um
 * dia uma medida precisar de condição própria, ela entra aqui, com o nome e o motivo, e não no
 * instrumento que a chama.
 */
(() => {
  const QUIETO_MS = 400;
  const LIMITE_MS = 15000;
  const ATRIBUTO_DE_MOVIMENTO = 'data-a11y-motion';

  /*
   * O marcador por superfície. A chave é a superfície como os instrumentos a nomeiam — inclusive o
   * redirecionamento `/relatorios`, que cai na mesma tela de `/gestao?tab=relatorios`.
   *
   * Superfície que não está aqui não tem gráfico, e a condição cai no silêncio. Isso é medição, não
   * suposição: na Etapa 15 as 23 superfícies foram varridas contando elementos pintados do Recharts
   * (setor, barra, curva, área, polígono) e só estas três devolveram algo.
   */
  const MARCADORES = {
    '/gestao?tab=relatorios': 'path.recharts-sector',
    '/relatorios': 'path.recharts-sector',
    '/gestao?tab=orcamento': '.recharts-bar-rectangle',
  };

  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  const marcadorDe = (rota) => (rota && Object.prototype.hasOwnProperty.call(MARCADORES, rota) ? MARCADORES[rota] : null);

  /** Liga o movimento reduzido e devolve como restaurar o estado anterior. */
  const semTransicao = () => {
    const raiz = document.documentElement;
    const antes = raiz.getAttribute(ATRIBUTO_DE_MOVIMENTO);
    raiz.setAttribute(ATRIBUTO_DE_MOVIMENTO, 'reduzido');
    return () => (antes === null ? raiz.removeAttribute(ATRIBUTO_DE_MOVIMENTO) : raiz.setAttribute(ATRIBUTO_DE_MOVIMENTO, antes));
  };

  const esperarFontes = async () => {
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Espera a condição de pronto e devolve o que foi esperado, para ir ao registro.
   *
   * @param {{ rota?: string|null, marcador?: string|null, semMovimento?: boolean }} opcoes
   *   `marcador` ausente usa o da rota; `marcador: null` força o caminho sem objeto.
   * @returns {Promise<{marcador: string|null, marcadorEm: number|null, total: number,
   *   atingida: boolean, fontesProntas: boolean, silencioEm: number}>}
   */
  const esperarPronto = async (opcoes = {}) => {
    const marcador = opcoes.marcador === undefined ? marcadorDe(opcoes.rota) : opcoes.marcador;
    const t0 = performance.now();

    let marcadorEm = null;
    if (marcador) {
      while (performance.now() - t0 < LIMITE_MS && !document.querySelector(marcador)) await esperar(60);
      marcadorEm = Math.round(performance.now() - t0);
    }

    const alvo = document.querySelector('main') || document.body;
    let ultima = performance.now();
    const obs = new MutationObserver(() => { ultima = performance.now(); });
    obs.observe(alvo, { childList: true, subtree: true, attributes: true });
    while (performance.now() - t0 < LIMITE_MS && performance.now() - ultima < QUIETO_MS) await esperar(80);
    obs.disconnect();
    const silencioEm = Math.round(performance.now() - t0);

    const fontesProntas = await esperarFontes();

    return {
      marcador,
      marcadorEm,
      silencioEm,
      total: Math.round(performance.now() - t0),
      atingida: marcador ? !!document.querySelector(marcador) : true,
      fontesProntas,
    };
  };

  window.__pronto = {
    esperar: esperarPronto,
    marcadorDe,
    semTransicao,
    esperarFontes,
    MARCADORES,
    QUIETO_MS,
    LIMITE_MS,
    ATRIBUTO_DE_MOVIMENTO,
  };
  return 'condição de pronto carregada: objeto onde há objeto, silêncio, sem transição, fontes';
})();
