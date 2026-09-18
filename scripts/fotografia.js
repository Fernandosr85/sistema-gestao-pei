/*
 * Fotografia de superfície — prova de regressão para etapas que REMOVEM código.
 *
 * Cole este arquivo inteiro no console do navegador, com a aplicação aberta, e chame
 * `await __foto.tudo()`. O retorno é um JSON com quatro hashes por superfície.
 *
 * A regra: um commit que só remove código tem de produzir DIFERENÇA ZERO nas quatro
 * medidas, em todas as superfícies. Um commit que corrige alguma coisa declara antes
 * qual superfície e qual medida podem mexer, e por quanto.
 *
 * Antes de confiar na comparação, rode `await __foto.controles()`. Ele quebra de
 * propósito uma coisa de cada tipo e confere que a medida correspondente acusa. Uma
 * comparação que sempre devolve "igual" pode ser a ferramenta que não enxerga, e não
 * o código que não mudou.
 *
 * Sem dependência: JavaScript puro, roda no console.
 */
(() => {
  const RELOGIO_PADRAO = '2026-03-17T09:00:00-03:00';

  /* ---------- utilidades ---------- */

  // FNV-1a de 32 bits. Serve para comparar, não para segurança.
  const hash = (texto) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < texto.length; i += 1) {
      h ^= texto.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  };

  const visivel = (el) => {
    if (el.checkVisibility) return el.checkVisibility({ checkVisibilityCSS: true });
    return el.getClientRects().length > 0;
  };

  const limpar = (texto) => (texto || '').replace(/\s+/g, ' ').trim();

  // Nome acessível, aproximado: cobre o que este projeto usa.
  const nomeAcessivel = (el) => {
    const rotulado = el.getAttribute('aria-labelledby');
    if (rotulado) {
      const partes = rotulado
        .split(/\s+/)
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .map((alvo) => limpar(alvo.textContent));
      if (partes.length) return partes.join(' ');
    }
    const rotulo = el.getAttribute('aria-label');
    if (rotulo) return limpar(rotulo);
    if (el.tagName === 'IMG') return limpar(el.getAttribute('alt') || '');
    if (el.id) {
      const label = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (label) return limpar(label.textContent);
    }
    const proprio = el.closest('label');
    if (proprio && el !== proprio) return limpar(proprio.textContent);
    const titulo = el.getAttribute('title');
    if (titulo) return limpar(titulo);
    const texto = limpar(el.innerText || el.textContent);
    return texto.slice(0, 120);
  };

  const PAPEL_IMPLICITO = {
    A: 'link', BUTTON: 'button', INPUT: 'input', SELECT: 'combobox', TEXTAREA: 'textbox',
    H1: 'heading1', H2: 'heading2', H3: 'heading3', H4: 'heading4', H5: 'heading5', H6: 'heading6',
    IMG: 'img', TABLE: 'table', TH: 'columnheader', NAV: 'navigation', MAIN: 'main',
    DIALOG: 'dialog', PROGRESS: 'progressbar', SUMMARY: 'summary', LABEL: 'label',
  };

  const papel = (el) => {
    const explicito = el.getAttribute('role');
    if (explicito) return explicito;
    if (el.tagName === 'INPUT') return `input:${el.getAttribute('type') || 'text'}`;
    if (el.tagName === 'A') return el.hasAttribute('href') ? 'link' : 'a';
    return PAPEL_IMPLICITO[el.tagName] || el.tagName.toLowerCase();
  };

  const estado = (el) => {
    const partes = [];
    for (const attr of ['aria-expanded', 'aria-selected', 'aria-checked', 'aria-current', 'aria-pressed', 'aria-disabled', 'data-state']) {
      const v = el.getAttribute(attr);
      if (v !== null) partes.push(`${attr}=${v}`);
    }
    if (el.disabled) partes.push('disabled');
    if (el.hasAttribute('hidden')) partes.push('hidden');
    return partes.join(',');
  };

  const SELETOR_SEMANTICO = [
    '[role]', 'a', 'button', 'input', 'select', 'textarea',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'img', 'table', 'th', 'dialog', 'progress', 'summary', 'label', 'nav', 'main',
  ].join(',');

  const FOCAVEL = [
    'a[href]', 'button', 'input', 'select', 'textarea', '[tabindex]', 'summary', '[contenteditable="true"]',
  ].join(',');

  /* ---------- o que não é interface ---------- */

  // Biblioteca que pendura rascunho no <body>, fora do #root, estacionado fora da tela.
  // O Recharts mantém um span#recharts_measurement_span em y = -20000 com o último rótulo
  // que mediu: tem layout, entra no innerText e vira número na fotografia. Não é interface e
  // não pertence a nenhuma tela — e, por guardar "o último", contamina toda medição posterior
  // à primeira.
  //
  // A regra aqui é de classe, não de instância: em vez do id conhecido, descarta-se qualquer
  // filho direto do body estacionado fora da tela. Vale para a próxima biblioteca que fizer o
  // mesmo, sem precisar descobrir o nome dela antes.
  const FORA_DA_TELA = -1000;
  const estacionadoForaDaTela = (el) => {
    const r = el.getBoundingClientRect();
    return r.bottom < FORA_DA_TELA || r.right < FORA_DA_TELA;
  };

  // Blocos que contam: a raiz da aplicação e os portais (diálogos e toasts do Radix são
  // filhos diretos do body), menos rascunho de biblioteca, script e style.
  const blocos = () =>
    [...document.body.children].filter(
      (el) => el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE' && !estacionadoForaDaTela(el),
    );

  const buscar = (seletor) => blocos().flatMap((b) => [
    ...(b.matches(seletor) ? [b] : []),
    ...b.querySelectorAll(seletor),
  ]);

  /* ---------- as quatro medidas ---------- */

  // 1. Árvore de acessibilidade reduzida a papel|nome|estado, em ordem de documento.
  const medidaA11y = () =>
    buscar(SELETOR_SEMANTICO)
      .filter(visivel)
      .map((el) => `${papel(el)}|${nomeAcessivel(el)}|${estado(el)}`)
      .join('\n');

  // 2. Sequência de números do texto renderizado. É a fotografia usada na Etapa 4.
  const medidaNumeros = () =>
    (blocos().map((el) => el.innerText || '').join('\n').match(/\d+(?:[.,]\d+)*/g) || []).join(' ');

  // 3. Ordem de tabulação: o que recebe foco e com que nome.
  const medidaFoco = () =>
    buscar(FOCAVEL)
      .filter((el) => visivel(el) && !el.disabled && el.getAttribute('tabindex') !== '-1')
      .map((el) => `${el.tagName.toLowerCase()}[${el.getAttribute('tabindex') ?? ''}]|${nomeAcessivel(el)}`)
      .join('\n');

  // 4. Esqueleto de títulos e título do documento.
  const medidaTitulos = () =>
    [`title=${document.title}`]
      .concat(
        buscar('h1,h2,h3,h4,h5,h6')
          .filter(visivel)
          .map((el) => `${el.tagName}:${limpar(el.innerText)}`),
      )
      .join('\n');

  const medir = () => ({
    a11y: medidaA11y(),
    numeros: medidaNumeros(),
    foco: medidaFoco(),
    titulos: medidaTitulos(),
  });

  const hashes = () => {
    const bruto = medir();
    return Object.fromEntries(Object.entries(bruto).map(([k, v]) => [k, hash(v)]));
  };

  /* ---------- relógio fixo ---------- */

  // Sem isto a fotografia mede o calendário: várias telas chamam new Date().
  let DateReal = null;
  const congelarRelogio = (iso = RELOGIO_PADRAO) => {
    if (!DateReal) DateReal = window.Date;
    const fixo = new DateReal(iso).getTime();
    class DateFixo extends DateReal {
      constructor(...args) {
        if (args.length === 0) super(fixo);
        else super(...args);
      }
      static now() { return fixo; }
    }
    window.Date = DateFixo;
  };
  const soltarRelogio = () => { if (DateReal) window.Date = DateReal; };

  /* ---------- navegação ---------- */

  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
  // requestAnimationFrame não dispara em aba oculta, e a fotografia precisa rodar
  // com o painel escondido. A espera é por tempo, não por quadro.
  const assentar = () => esperar(260);

  const empurrar = (caminho) => {
    window.history.pushState({}, '', caminho);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Rota neutra entre uma superfície e a seguinte. Sem ela, entrar numa rota em que
  // já se está não re-renderiza, e a medida sai do render anterior — foi assim que a
  // primeira leitura de '/' saiu com o relógio real, antes de ser congelado.
  const NEUTRA = '/__fotografia__';

  const ir = async (caminho) => {
    empurrar(NEUTRA);
    await esperar(60);
    empurrar(caminho);
    await assentar();
  };

  /* ---------- superfícies ---------- */

  const ROTAS = [
    '/', '/alunos', '/alunos/novo', '/alunos/1', '/observacoes', '/observacoes/nova',
    '/gestao', '/legislacao', '/manual', '/biblioteca-recursos',
    '/agenda-atendimentos', '/minha-agenda', '/relatorio',
  ];
  // Os três redirecionamentos e o curinga entram de propósito: provam que continuam
  // respondendo depois que os imports órfãos saem de App.tsx.
  const REDIRECIONAMENTOS = ['/relatorios', '/analise-complexidade', '/analise'];
  const CURINGA = ['/rota-que-nao-existe'];
  const ABAS = ['visao-geral', 'alertas', 'analise', 'relatorios', 'equipe', 'orcamento']
    .map((t) => `/gestao?tab=${t}`);

  const SUPERFICIES = [...ROTAS, ...REDIRECIONAMENTOS, ...CURINGA, ...ABAS];

  const tudo = async ({ relogio = RELOGIO_PADRAO, superficies = SUPERFICIES } = {}) => {
    congelarRelogio(relogio);
    const saida = {};
    for (const s of superficies) {
      await ir(s);
      saida[s] = {
        ...hashes(),
        url: window.location.pathname + window.location.search,
        // A largura entra na fotografia porque a medida numeros depende dela: o Recharts
        // escolhe os rótulos de eixo conforme o espaço, e "R$ 0k / R$ 150k / R$ 300k" são
        // números como quaisquer outros. Comparar larguras diferentes acusa diferença que
        // não é do código.
        largura: window.innerWidth,
      };
    }
    return saida;
  };

  /* ---------- controle positivo do próprio arreio ---------- */

  // Uma comparação que sempre devolve "igual" não é evidência. Aqui cada medida é
  // obrigada a acusar uma quebra que se sabe ter sido feita.
  const controles = async () => {
    congelarRelogio();
    await ir('/');
    const base = medir();
    const resultado = [];

    const provar = (nome, medidaEsperada, quebrar) => {
      const desfazer = quebrar();
      const depois = medir();
      desfazer();
      const mudou = Object.fromEntries(
        Object.keys(base).map((k) => [k, hash(base[k]) !== hash(depois[k])]),
      );
      const ok = mudou[medidaEsperada] === true;
      resultado.push({ controle: nome, medida: medidaEsperada, acusou: mudou[medidaEsperada], ok, mudaram: Object.keys(mudou).filter((k) => mudou[k]) });
      return ok;
    };

    // 1. renomear um controle -> medida a11y
    provar('renomear um botão', 'a11y', () => {
      const alvo = [...document.querySelectorAll('button')].filter(visivel)[0];
      const antes = alvo.getAttribute('aria-label');
      alvo.setAttribute('aria-label', 'NOME TROCADO PELO CONTROLE');
      return () => (antes === null ? alvo.removeAttribute('aria-label') : alvo.setAttribute('aria-label', antes));
    });

    // 2. mudar um número -> medida numeros
    provar('mudar um número', 'numeros', () => {
      const alvo = [...document.querySelectorAll('div,span,p')]
        .filter((el) => visivel(el) && el.children.length === 0 && /\d/.test(el.textContent));
      const el = alvo[0];
      const antes = el.textContent;
      el.textContent = '99999';
      return () => { el.textContent = antes; };
    });

    // 3. tirar um elemento da ordem de tabulação -> medida foco
    provar('tirar um link do foco', 'foco', () => {
      const alvo = [...document.querySelectorAll('a[href]')].filter(visivel)[0];
      const antes = alvo.getAttribute('tabindex');
      alvo.setAttribute('tabindex', '-1');
      return () => (antes === null ? alvo.removeAttribute('tabindex') : alvo.setAttribute('tabindex', antes));
    });

    // 4. rebaixar um heading -> medida titulos
    provar('rebaixar um heading', 'titulos', () => {
      const alvo = [...document.querySelectorAll('h1,h2,h3')].filter(visivel)[0];
      const antes = alvo.textContent;
      alvo.textContent = `${antes} REBAIXADO`;
      return () => { alvo.textContent = antes; };
    });

    const todosOk = resultado.every((r) => r.ok);
    return { todosOk, resultado };
  };

  const MEDIDAS = ['a11y', 'numeros', 'foco', 'titulos', 'url', 'largura'];

  const difEntre = (a, b, rotulo) => {
    const difs = [];
    for (const k of Object.keys(a)) {
      for (const m of MEDIDAS) {
        if (a[k][m] !== b[k][m]) difs.push(`${rotulo} :: ${k} :: ${m} :: ${a[k][m]} -> ${b[k][m]}`);
      }
    }
    return difs;
  };

  // Segundo controle: a fotografia tem de se repetir, e não pode depender da ordem.
  //
  // Três passagens. Duas na ordem normal: se discordam, a comparação entre commits mede
  // ruído, não código. A terceira com as superfícies em ordem INVERSA: se discorda das
  // outras duas, alguma coisa que uma superfície deixa para trás muda o que a seguinte mede
  // — estado no documento, portal que não desmonta, foco preso.
  //
  // O que a ordem inversa NÃO pega, e foi medido: resíduo cujo conteúdo é o mesmo em
  // qualquer ordem. O rascunho do Recharts é assim — em qualquer ordem ele acaba guardando
  // um rótulo, e as três passagens concordam. Contra esse, o que vale é a regra de descartar
  // o que está estacionado fora da tela, acima. As duas coberturas são diferentes e nenhuma
  // substitui a outra.
  const estavel = async () => {
    const a = await tudo();
    const b = await tudo();
    const c = await tudo({ superficies: [...SUPERFICIES].reverse() });
    const difsRepeticao = difEntre(a, b, 'repetição');
    const difsOrdem = difEntre(b, c, 'ordem inversa');
    return {
      estavel: difsRepeticao.length === 0 && difsOrdem.length === 0,
      difsRepeticao,
      difsOrdem,
      difs: [...difsRepeticao, ...difsOrdem],
      foto: b,
    };
  };

  // Compara uma fotografia nova com uma guardada.
  const comparar = (antes, depois) => {
    const difs = [];
    const chaves = new Set([...Object.keys(antes), ...Object.keys(depois)]);

    // Largura diferente invalida a comparação inteira: a diferença que aparecer não será do
    // código. Isso vem primeiro, para não se ler uma lista de superfícies como regressão.
    const larguras = (foto) => [...new Set(Object.values(foto).map((v) => v.largura))];
    const [la, ld] = [larguras(antes), larguras(depois)];
    if (la.length > 1 || ld.length > 1 || (la[0] !== undefined && la[0] !== ld[0])) {
      return {
        igual: false,
        larguraIncompativel: true,
        difs: [`largura :: antes ${la.join('/')} :: depois ${ld.join('/')} — comparação inválida, refaça na mesma largura`],
      };
    }

    for (const k of chaves) {
      if (!antes[k]) { difs.push(`${k} :: superfície nova`); continue; }
      if (!depois[k]) { difs.push(`${k} :: superfície sumiu`); continue; }
      for (const m of MEDIDAS) {
        if (antes[k][m] !== depois[k][m]) difs.push(`${k} :: ${m} :: ${antes[k][m]} -> ${depois[k][m]}`);
      }
    }
    return { igual: difs.length === 0, difs };
  };

  window.__foto = { medir, hashes, tudo, controles, estavel, comparar, congelarRelogio, soltarRelogio, ir, SUPERFICIES, hash };
  return 'fotografia pronta: __foto.controles() antes, __foto.tudo() depois';
})();
