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
 * E O AMBIENTE, QUE É PARTE DA CONDIÇÃO (Etapa 18). As quatro partes acima são esperas, e espera
 * depende do relógio de quem mede. Navegador ESTRANGULA os temporizadores de aba em segundo plano:
 * medido nas Etapas 17 e 18, as esperas de 60–80 ms deste arquivo viraram cerca de um segundo no painel do
 * app com a aba oculta, e a varredura do axe que leva 4,5 min em primeiro plano não terminou a
 * primeira superfície em oito. O número medido lá não é o mesmo número. Por isso a condição
 * **mede o próprio relógio** (`ambiente()`) e os instrumentos **recusam** rodar quando ele está
 * estrangulado — em vez de depender de quem roda lembrar de passar
 * `--disable-background-timer-throttling` ou de deixar a aba visível.
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

  /* ---------- o ambiente, medido ---------- */

  /*
   * O LIMIAR, e de onde ele vem — MEDIDO nesta etapa, no mesmo Chrome, trocando só o que se queria
   * medir (`scripts/mutacoes/` não serve aqui porque o que varia é o navegador, não o código):
   *
   *   aba em primeiro plano ...................... mediana  21 ms   amostras 21,21,21,21,20
   *   aba oculta, SEM os sinalizadores ........... mediana 995 ms   amostras 576,1011,995,1007,990
   *   aba oculta, COM os sinalizadores ........... mediana  21 ms   amostras 21,20,22,20,21
   *
   * Cinco esperas pedidas de 20 ms em cada caso. O limiar de 200 ms fica dez vezes acima do caso
   * limpo e cinco vezes abaixo do estrangulado — fator 47 entre as duas pontas.
   *
   * E DECIDE-SE PELA MEDIANA — nem média, nem mínimo —, e as três foram medidas, nesta ordem:
   *
   *   MÉDIA, descartada: na verificação desta etapa a sonda rodou logo depois de colar os quatro
   *     instrumentos, com o laço de eventos ainda ocupado, e a média de três esperas de 20 ms deu
   *     112 ms contra os 21 ms da página parada. Nada reprovou (112 < 200), mas a margem caiu para
   *     1,8x. Laço ocupado levanta a média por tarefa longa isolada.
   *   MÍNIMO, descartado: parecia certo, porque estrangulamento levanta o PISO. Mas as amostras
   *     mostraram por que não — em aba oculta: [576, 1011, 995, 1007, 990]. A PRIMEIRA espera mede
   *     só o resto do segundo corrente, então o mínimo é um sorteio em [0, 1000]: com uma chance de
   *     cerca de uma em cinco ele cai abaixo de 200 e o detector DEIXA PASSAR o estrangulamento.
   *   MEDIANA, que é a que ficou: em primeiro plano [21, 21, 21, 21, 20] -> 21 ms; em aba oculta
   *     sem o sinalizador [576, 1011, 995, 1007, 990] -> 995 ms. Dez vezes acima do limiar de um
   *     lado e cinco vezes abaixo do outro, e imune tanto à tarefa longa isolada quanto ao resto do
   *     primeiro segundo.
   *
   * As amostras saem no resultado, para quem lê o número poder refazer a conta.
   */
  const LIMITE_ESTRANGULADO_MS = 200;
  const PEDIDO_DA_SONDA_MS = 20;
  // Para as esperas longas do próprio laço (60 e 80 ms), o limiar é relativo ao que se pediu:
  // estrangulado prende em um disparo por segundo, o que é mais de doze vezes 80 ms.
  const FATOR_DA_ESPERA_LONGA = 5;

  /**
   * Mede quanto custa de verdade uma espera pedida curta. Devolve a MEDIANA (que é o que decide), a
   * média, o mínimo e cada amostra — a distribuição é o que distingue relógio preso de laço ocupado.
   */
  const sondarRelogio = async (n = 5, pedido = PEDIDO_DA_SONDA_MS) => {
    const custos = [];
    for (let i = 0; i < n; i += 1) {
      const t = performance.now();
      await esperar(pedido);
      custos.push(performance.now() - t);
    }
    const ordenados = [...custos].sort((a, b) => a - b);
    return {
      mediana: ordenados[Math.floor(ordenados.length / 2)],
      media: custos.reduce((a, b) => a + b, 0) / custos.length,
      minimo: ordenados[0],
      amostras: custos.map((c) => Math.round(c)),
      pedido,
    };
  };

  /**
   * O ambiente de medição, medido — não declarado por quem roda.
   *
   * O QUE DECIDE É O RELÓGIO MEDIDO, NÃO A VISIBILIDADE DA ABA, e isso foi uma correção dentro
   * desta etapa: a primeira versão recusava quando `document.visibilityState !== 'visible'`, e o
   * controle mostrou que a recusa seria falsa — em aba oculta COM
   * `--disable-background-timer-throttling`, a espera de 20 ms custou 21 ms, exatamente como em
   * primeiro plano. Aba oculta é um PROGNÓSTICO de estrangulamento, não o estrangulamento; quem
   * tem a medida não decide pelo indício. A visibilidade continua saindo daqui como **aviso**,
   * porque o estrangulamento pode começar depois (foi o que aconteceu na Etapa 17, no meio da
   * passada) — e para isso a condição mede as próprias esperas, superfície por superfície.
   *
   * @returns {Promise<{estrangulado: boolean, msMediana: number, msMinimo: number, msPorEspera: number,
   *   amostrasMs: number[], pedidoMs: number, limiteMs: number, visibilidade: string,
   *   oculta: boolean, janela: string, agente: string, motivo: string|null, aviso: string|null}>}
   */
  const ambiente = async () => {
    const sonda = await sondarRelogio();
    const visibilidade = typeof document.visibilityState === 'string' ? document.visibilityState : '(desconhecida)';
    const oculta = visibilidade !== 'visible';
    const estrangulado = sonda.mediana > LIMITE_ESTRANGULADO_MS;
    return {
      estrangulado,
      msMediana: Math.round(sonda.mediana),
      msMinimo: Math.round(sonda.minimo),
      msPorEspera: Math.round(sonda.media),
      amostrasMs: sonda.amostras,
      pedidoMs: PEDIDO_DA_SONDA_MS,
      limiteMs: LIMITE_ESTRANGULADO_MS,
      visibilidade,
      oculta,
      janela: `${window.innerWidth}x${window.innerHeight}`,
      agente: navigator.userAgent,
      motivo: estrangulado
        ? `relógio estrangulado: a MEDIANA de ${sonda.amostras.length} esperas pedidas de `
          + `${PEDIDO_DA_SONDA_MS} ms foi ${Math.round(sonda.mediana)} ms (limiar `
          + `${LIMITE_ESTRANGULADO_MS} ms); amostras: ${sonda.amostras.join(', ')}`
        : null,
      aviso: oculta && !estrangulado
        ? `aba não visível (document.visibilityState = "${visibilidade}") e relógio limpo: `
          + `mediana de ${Math.round(sonda.mediana)} ms para ${PEDIDO_DA_SONDA_MS} ms pedidos. Medido `
          + 'nesta etapa: é o que acontece com --disable-background-timer-throttling ligado. Sem ele, '
          + 'a mesma aba oculta deu mediana de 995 ms — por isso a condição remede as esperas em cada superfície.'
        : null,
    };
  };

  /*
   * RECUSA, não aviso, e sem escape. Um escape (`{ permitirAmbienteRuim: true }`) devolveria ao
   * instrumento duas condições possíveis, que é exatamente o defeito do achado 26. Quem precisa
   * medir em ambiente estrangulado está medindo outro número, e esse número tem de ter outro nome.
   */
  const exigirAmbiente = async () => {
    const a = await ambiente();
    if (a.estrangulado) {
      throw new Error(`AMBIENTE RECUSADO — ${a.motivo}. `
        + 'Espera estrangulada muda a condição de pronto por um fator de quase cinquenta (medido: 21 ms '
        + 'contra 995 ms de mediana), e o número medido aqui não é comparável ao da base. Deixe a aba em primeiro '
        + 'plano, ou rode em Chrome headless com --disable-background-timer-throttling '
        + '--disable-renderer-backgrounding --disable-backgrounding-occluded-windows.');
    }
    if (a.aviso) console.warn(`ambiente: ${a.aviso}`);
    return a;
  };

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

    /*
     * AS PRÓPRIAS ESPERAS SÃO A SONDA (Etapa 18). `ambiente()` mede uma vez, antes de começar; mas o
     * estrangulamento da Etapa 17 apareceu NO MEIO da varredura, quando a aba foi para segundo
     * plano — medido: 15 de 23 superfícies e então parada. Contar o que cada volta de espera custou
     * de verdade não custa nada e cobre a passada inteira, superfície por superfície.
     */
    const custosDasVoltas = [];
    let pedidoTotal = 0;
    const esperarContando = async (ms) => {
      const t = performance.now();
      await esperar(ms);
      custosDasVoltas.push(performance.now() - t);
      pedidoTotal += ms;
    };

    let marcadorEm = null;
    if (marcador) {
      while (performance.now() - t0 < LIMITE_MS && !document.querySelector(marcador)) await esperarContando(60);
      marcadorEm = Math.round(performance.now() - t0);
    }

    const alvo = document.querySelector('main') || document.body;
    let ultima = performance.now();
    const obs = new MutationObserver(() => { ultima = performance.now(); });
    obs.observe(alvo, { childList: true, subtree: true, attributes: true });
    while (performance.now() - t0 < LIMITE_MS && performance.now() - ultima < QUIETO_MS) await esperarContando(80);
    obs.disconnect();
    const silencioEm = Math.round(performance.now() - t0);

    const voltas = custosDasVoltas.length;
    const custoMedio = voltas ? custosDasVoltas.reduce((a, b) => a + b, 0) / voltas : null;
    const pedidoMedio = voltas ? pedidoTotal / voltas : null;
    const ordenadas = [...custosDasVoltas].sort((a, b) => a - b);
    const custoMediano = voltas ? ordenadas[Math.floor(voltas / 2)] : null;
    // Pela MEDIANA, como `ambiente()`: render pesado faz UMA volta custar muito, estrangulamento faz
    // TODAS custarem muito, e a primeira volta de uma aba estrangulada mede só o resto do segundo
    // corrente. E duas condições juntas: custou muito mais do que se pediu E custou muito em
    // absoluto — a segunda porque pedido pequeno tem sobrecarga grande em proporção.
    const estrangulado = voltas > 0
      && custoMediano > FATOR_DA_ESPERA_LONGA * pedidoMedio
      && custoMediano > LIMITE_ESTRANGULADO_MS;

    const fontesProntas = await esperarFontes();

    return {
      marcador,
      marcadorEm,
      silencioEm,
      total: Math.round(performance.now() - t0),
      atingida: marcador ? !!document.querySelector(marcador) : true,
      fontesProntas,
      esperas: voltas
        ? {
          voltas,
          pedidoMedioMs: Math.round(pedidoMedio),
          custoMedianoMs: Math.round(custoMediano),
          custoMedioMs: Math.round(custoMedio),
          custoMinimoMs: Math.round(ordenadas[0]),
        }
        : null,
      estrangulado,
    };
  };

  window.__pronto = {
    esperar: esperarPronto,
    marcadorDe,
    semTransicao,
    esperarFontes,
    ambiente,
    exigirAmbiente,
    sondarRelogio,
    MARCADORES,
    QUIETO_MS,
    LIMITE_MS,
    LIMITE_ESTRANGULADO_MS,
    ATRIBUTO_DE_MOVIMENTO,
  };
  return 'condição de pronto carregada: ambiente medido, objeto onde há objeto, silêncio, sem transição, fontes';
})();
