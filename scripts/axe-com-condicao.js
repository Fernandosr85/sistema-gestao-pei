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
 * AS CONDIÇÕES ESTÃO EM OUTRO ARQUIVO DESDE A ETAPA 16: `scripts/condicao-de-pronto.js`, o mesmo
 * que o arreio usa. Cole aquele primeiro. O que segue abaixo é o histórico de como a condição foi
 * escolhida, porque a escolha é parte da medida.
 *
 * Por que o marcador é o objeto e não o tempo nem o silêncio:
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
 * Rota sem gráfico não precisa do marcador: `medir` aceita `{ marcador: null }` e cai no silêncio.
 * Medido na Etapa 15: das 23 superfícies, só três têm gráfico do Recharts
 * (`/gestao?tab=relatorios`, o redirecionamento `/relatorios` e `/gestao?tab=orcamento`).
 *
 * O SEGUNDO MODO DE FALHA, e a condição que o fecha (Etapa 15): `color-contrast` é o inverso de
 * `svg-img-alt` — ele existe ANTES de a pintura terminar e decai para zero (58, 34, 0 nós, medido).
 * Silêncio e espera não fechavam a faixa: com `document.fonts.ready` + 1 500 ms, `/observacoes`
 * ainda dava `color-contrast(21)` em 1 de 20 passadas. A condição que fecha não é esperar mais, é
 * **não haver transição**: ligar `data-a11y-motion="reduzido"` no elemento raiz (o CSS da Etapa 3
 * zera transição e animação, medido em `1e-05s`), esperar `document.fonts.ready`, medir e restaurar
 * o atributo. Com ela, as 23 superfícies dão ZERO em 10 de 10 passadas cada. **Na Etapa 16 isso
 * deixou de ser opcional:** enquanto era `{ semTransicao: true }`, o mesmo script tinha duas
 * condições possíveis — e duas condições possíveis é o mesmo problema de dois instrumentos com
 * critérios diferentes (achado 26).
 *
 * Dependências, na ordem: `axe.min.js` (de `/node_modules/axe-core/`),
 * `scripts/condicao-de-pronto.js` e `scripts/fotografia.js` (de onde vem o `__foto.ir`, que navega
 * sem recarregar).
 */
(() => {
  /*
   * A CONDIÇÃO DE PRONTO NÃO É DAQUI (Etapa 16). Ela mora em `scripts/condicao-de-pronto.js` e é a
   * mesma que o arreio usa. Este arquivo ficou com o que é dele: N passadas, faixa quando as
   * passadas discordam, e o controle positivo do próprio instrumento.
   */
  if (!window.__pronto) {
    throw new Error('axe-com-condicao: cole scripts/condicao-de-pronto.js antes deste arquivo');
  }

  const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
  const QUIETO_MS = window.__pronto.QUIETO_MS;

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

  /*
   * Uma passada: a condição inteira, sempre. Ela DEIXOU DE SER OPCIONAL na Etapa 16 — enquanto o
   * movimento reduzido era `{ semTransicao: true }`, o mesmo script tinha duas condições possíveis,
   * e duas condições possíveis é o mesmo problema de dois instrumentos com critérios diferentes.
   */
  const umaPassada = async (rota, marcador) => {
    const restaurar = window.__pronto.semTransicao();
    await irPara(rota);
    const espera = await window.__pronto.esperar(
      marcador === undefined ? { rota } : { rota, marcador },
    );
    const resultado = await window.axe.run(document, { runOnly: { type: 'tag', values: TAGS } });
    restaurar();
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
    // O marcador padrão é o DA ROTA, do módulo da condição: era 'path.recharts-sector' para
    // qualquer rota, o que obrigava quem media o orçamento a passar o marcador à mão.
    const marcador = opcoes.marcador === undefined ? window.__pronto.marcadorDe(rota) : opcoes.marcador;
    const nomeDaCondicao = opcoes.nomeDaCondicao
      ?? [
        marcador ? `${marcador} presente` : null,
        `${QUIETO_MS} ms sem mutação`,
        'movimento reduzido pelo atributo do app',
        'document.fonts.ready',
      ].filter(Boolean).join(' + ');

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

    const comFontes = resultados.filter((r) => r.espera.fontesProntas === true).length;
    return {
      rota, condicao: nomeDaCondicao, passadas, identico,
      resultados: resultados.map((r) => r.regras),
      linha, esperas, naoAtingiram,
      passadasComFontesProntas: comFontes,
    };
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

  window.__axe = { medir, controle, umaPassada, TAGS, QUIETO_MS };
  return 'axe com condição pronto: __axe.controle() antes, __axe.medir(rota) depois';
})();
