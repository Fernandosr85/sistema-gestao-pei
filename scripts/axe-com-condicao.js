/*
 * Medição do axe com CONDIÇÃO DECLARADA e N PASSADAS.
 *
 * Cole este arquivo no console do navegador, com a aplicação aberta, e chame
 * `await __axe.medir('/gestao?tab=relatorios')`. Ele devolve uma linha de resultado que **sempre**
 * diz sob qual condição mediu e quantas vezes:
 *
 *     10 passadas, condição "setores do gráfico presentes + 400 ms sem mutação",
 *     resultado idêntico em 10/10: svg-img-alt(5)
 *
 * POR QUE ISSO EXISTE (achado 23). A medição anterior era **uma passada com espera fixa**, e o
 * resultado dela variava: na rota dos relatórios, `svg-img-alt(5)` aparecia ou não conforme a
 * espera caísse antes ou depois do fim da animação do gráfico de rosca — que termina entre 3,2 s e
 * 4,2 s, medido. Com espera de 2,6 s o resultado foi ZERO em 10 de 10 passadas; com espera pelo
 * objeto, violação em 10 de 10. **O mesmo mecanismo que fazia a violação aparecer na segunda
 * passada a fazia estar ausente na primeira** — e a primeira é a que virou número no registro.
 *
 * A REGRA: resultado de instrumento não determinístico exige N passadas e condição declarada.
 * Resultado que varia entre passadas não é resultado, é **faixa**, e sai daqui como faixa.
 *
 * AS CONDIÇÕES, e por que o marcador é o objeto e não o tempo nem o silêncio:
 *
 *   tempo      — espera fixa. Mede onde o relógio cair: na rota dos relatórios, 2,6 s cai ANTES
 *                dos setores existirem, e o zero é subcontagem.
 *   silêncio   — espera a subárvore parar de mutar. Mede ANTES de o gráfico começar, quando a
 *                subárvore ainda está quieta: medido 471 ms de "quieto" numa passada que não viu
 *                nada, contra 2 359 ms em outra que viu.
 *   objeto     — espera o elemento que só existe depois de o gráfico estar pintado, e só então
 *                espera o silêncio. É a condição que usamos. Na rota dos relatórios o marcador é
 *                `path.recharts-sector`, os setores da rosca, que carregam o rótulo do dado no
 *                atributo `name` ("Adaptações Curriculares", "Apoio Individualizado", …).
 *
 * Rota sem gráfico não precisa do marcador: `medir` aceita `{ marcador: null }` e cai no silêncio,
 * que para essas rotas é suficiente — medido em `/` e `/observacoes`, que não têm nenhum gráfico
 * do Recharts (0 setores, 0 curvas, 0 barras) e dão ZERO em 5 de 5 passadas.
 *
 * Dependências: `axe.min.js` (de `/node_modules/axe-core/`) e, para navegar entre rotas sem
 * recarregar, o `__foto.ir` de `scripts/fotografia.js`. Os dois são colados no console antes.
 */
(() => {
  const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
  const MARCADOR_PADRAO = 'path.recharts-sector';
  const QUIETO_MS = 400;
  const LIMITE_MS = 15000;

  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  const irPara = async (rota) => {
    if (!rota) return;
    if (window.__foto?.ir) await window.__foto.ir(rota);
    else if (location.pathname + location.search !== rota) {
      history.pushState({}, '', rota);
      dispatchEvent(new PopStateEvent('popstate'));
      await esperar(300);
    }
  };

  /** Espera o OBJETO (marcador) e depois o silêncio. Devolve quanto esperou, para ir ao registro. */
  const esperarCondicao = async (marcador) => {
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
    return {
      marcadorEm,
      total: Math.round(performance.now() - t0),
      atingida: marcador ? !!document.querySelector(marcador) : true,
    };
  };

  const umaPassada = async (rota, marcador) => {
    await irPara(rota);
    const espera = await esperarCondicao(marcador);
    const resultado = await window.axe.run(document, { runOnly: { type: 'tag', values: TAGS } });
    const regras = resultado.violations
      .map((v) => `${v.id}(${v.nodes.length})`)
      .sort()
      .join(',');
    return { regras: regras || 'ZERO', espera };
  };

  /**
   * Mede uma rota N vezes sob a condição declarada.
   * @param {string} rota
   * @param {{ passadas?: number, marcador?: string|null, nomeDaCondicao?: string }} opcoes
   */
  const medir = async (rota, opcoes = {}) => {
    const passadas = opcoes.passadas ?? 10;
    const marcador = opcoes.marcador === undefined ? MARCADOR_PADRAO : opcoes.marcador;
    const nomeDaCondicao = opcoes.nomeDaCondicao
      ?? (marcador
        ? `${marcador} presente + ${QUIETO_MS} ms sem mutação`
        : `${QUIETO_MS} ms sem mutação (rota sem gráfico)`);

    const resultados = [];
    for (let i = 0; i < passadas; i += 1) resultados.push(await umaPassada(rota, marcador));

    const distintos = [...new Set(resultados.map((r) => r.regras))];
    const identico = distintos.length === 1;
    const contagem = distintos
      .map((d) => `${d} em ${resultados.filter((r) => r.regras === d).length}/${passadas}`)
      .join(' | ');
    const esperas = resultados.map((r) => r.espera.total);
    const naoAtingiram = resultados.filter((r) => !r.espera.atingida).length;

    const linha = identico
      ? `${passadas} passadas, condição "${nomeDaCondicao}", resultado idêntico em ${passadas}/${passadas}: ${distintos[0]}`
      : `${passadas} passadas, condição "${nomeDaCondicao}", resultado NÃO idêntico — é FAIXA: ${contagem}`;

    console.log(`${rota} :: ${linha}`);
    if (naoAtingiram) console.warn(`  ATENÇÃO: a condição não foi atingida em ${naoAtingiram}/${passadas} passadas — o resultado delas não vale.`);
    console.log(`  espera por passada, ms: ${esperas.join(', ')}`);

    return { rota, condicao: nomeDaCondicao, passadas, identico, resultados: resultados.map((r) => r.regras), linha, esperas, naoAtingiram };
  };

  /** Controle positivo do próprio instrumento: planta uma violação e exige que ela apareça. */
  const controle = async () => {
    const alvo = document.createElement('div');
    alvo.innerHTML = '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">';
    document.body.appendChild(alvo);
    const comControle = await umaPassada(null, null);
    alvo.remove();
    const semControle = await umaPassada(null, null);
    const acusou = /image-alt/.test(comControle.regras);
    console.log(`controle plantado (img sem alt): ${acusou ? 'ACUSADO' : 'NÃO ACUSADO — o instrumento não está medindo'}`);
    console.log(`  com controle: ${comControle.regras}`);
    console.log(`  sem controle: ${semControle.regras}`);
    return { acusou, comControle: comControle.regras, semControle: semControle.regras };
  };

  window.__axe = { medir, controle, umaPassada, TAGS, MARCADOR_PADRAO, QUIETO_MS };
  return 'axe com condição pronto: __axe.controle() antes, __axe.medir(rota) depois';
})();
