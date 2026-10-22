/*
 * CONFERE UMA PUBLICAÇÃO DESTA APLICAÇÃO, pela URL (Etapa 20).
 *
 * Recebe a URL base e mede três coisas na coisa publicada, não no `preview`:
 *
 *   1. AS 23 SUPERFÍCIES CARREGAM, e o recarregamento de rota profunda funciona. Carregamento de
 *      verdade a cada superfície (`Page.navigate`), não `pushState`: o que se quer medir é
 *      justamente o que o servidor devolve quando alguém digita o endereço ou aperta F5. Uma
 *      superfície "carrega" quando o roteador resolveu — se ela cair no 404 da própria aplicação,
 *      reprova, e esse é o modo de falha de `basename` errado.
 *   2. NADA É PEDIDO A TERCEIRO. Coleta toda requisição de rede e exige que a origem de todas seja
 *      a do próprio site. É a varredura da Etapa 10b, agora contra a URL real, e com CONTROLE
 *      POSITIVO: no fim, a página pede um recurso de uma origem de fora e o coletor tem de acusar.
 *      A origem do controle é um domínio `.invalid` (RFC 2606), que nunca resolve — o controle prova
 *      que o coletor enxerga origem de fora sem contatar ninguém de verdade.
 *   3. O AXE COM CONDIÇÃO DECLARADA numa amostra de rotas. Os instrumentos do repositório
 *      (`condicao-de-pronto.js`, `axe-com-condicao.js`) e o `axe-core` são INJETADOS DO DISCO, não
 *      buscados do site: eles não fazem parte do `dist/`, e injetar do disco também deixa a medição
 *      independente do que o site serve.
 *
 * Uso:
 *   node scripts/confere-publicacao.cjs <url-base> [--passadas N] [--amostra a,b,c]
 *   node scripts/confere-publicacao.cjs https://fernandosr85.github.io/sistema-gestao-pei/
 */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORTA = 9361;
const RAIZ = path.resolve(__dirname, '..');

const arg = (nome, padrao) => {
  const i = process.argv.indexOf(nome);
  return i === -1 ? padrao : process.argv[i + 1];
};
const BASE = (process.argv[2] || '').replace(/\/+$/, '') + '/';
if (!process.argv[2] || process.argv[2].startsWith('--')) {
  console.error('uso: node scripts/confere-publicacao.cjs <url-base> [--passadas N] [--amostra a,b,c]');
  process.exit(2);
}
const PASSADAS = Number(arg('--passadas', 5));

const ROTAS = [
  '/', '/alunos', '/alunos/novo', '/alunos/1', '/observacoes', '/observacoes/nova',
  '/gestao', '/legislacao', '/manual', '/biblioteca-recursos',
  '/agenda-atendimentos', '/minha-agenda', '/relatorio',
];
const REDIRECIONAMENTOS = ['/relatorios', '/analise-complexidade', '/analise'];
const CURINGA = ['/rota-que-nao-existe'];
const ABAS = ['visao-geral', 'alertas', 'analise', 'relatorios', 'equipe', 'orcamento']
  .map((t) => `/gestao?tab=${t}`);
const SUPERFICIES = [...ROTAS, ...REDIRECIONAMENTOS, ...CURINGA, ...ABAS];
// A amostra do axe: as três com gráfico (onde a condição tem objeto), uma de formulário e a raiz.
const AMOSTRA_PADRAO = ['/', '/observacoes/nova', '/gestao?tab=relatorios', '/relatorios', '/gestao?tab=orcamento'];
const AMOSTRA = (arg('--amostra', '') || '').trim() ? arg('--amostra', '').split(',') : AMOSTRA_PADRAO;

const ORIGEM_DO_CONTROLE = 'https://controle-positivo.invalid';
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

class Cdp {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pendentes = new Map(); this.ouvintes = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pendentes.has(msg.id)) {
        const { ok, ruim } = this.pendentes.get(msg.id);
        this.pendentes.delete(msg.id);
        if (msg.error) ruim(new Error(msg.error.message)); else ok(msg.result);
        return;
      }
      if (msg.method) for (const o of [...this.ouvintes]) o(msg);
    });
  }
  enviar(method, params = {}) {
    this.id += 1; const id = this.id;
    return new Promise((ok, ruim) => { this.pendentes.set(id, { ok, ruim }); this.ws.send(JSON.stringify({ id, method, params })); });
  }
  ao(method, fn) { this.ouvintes.push((msg) => { if (msg.method === method) fn(msg.params); }); }
  esperarEvento(method, ms) {
    return new Promise((ok) => {
      const t = setTimeout(() => { this.ouvintes = this.ouvintes.filter((o) => o !== ouvinte); ok(null); }, ms);
      const ouvinte = (msg) => {
        if (msg.method !== method) return;
        clearTimeout(t);
        this.ouvintes = this.ouvintes.filter((o) => o !== ouvinte);
        ok(msg.params || {});
      };
      this.ouvintes.push(ouvinte);
    });
  }
}

const abrirWs = (url) => new Promise((ok, ruim) => {
  const ws = new WebSocket(url);
  ws.addEventListener('open', () => ok(ws));
  ws.addEventListener('error', () => ruim(new Error('ws falhou')));
});

(async () => {
  const origemDoSite = new URL(BASE).origin;
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-pub-'));
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORTA,
    '--user-data-dir=' + perfil, '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--window-size=1280,900',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    BASE], { stdio: 'ignore' });
  const saida = { base: BASE, origemDoSite, medidoEm: new Date().toISOString() };
  try {
    let alvo = null;
    for (let i = 0; i < 150; i += 1) {
      try {
        const r = await fetch('http://127.0.0.1:' + PORTA + '/json/list');
        alvo = (await r.json()).find((t) => t.type === 'page');
        if (alvo) break;
      } catch { /* subindo */ }
      await dormir(200);
    }
    if (!alvo) throw new Error('aba nao encontrada');
    const cdp = new Cdp(await abrirWs(alvo.webSocketDebuggerUrl));
    await cdp.enviar('Runtime.enable'); await cdp.enviar('Page.enable'); await cdp.enviar('Network.enable');
    await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });

    /* ---------- coletor de rede, ligado do começo ao fim ---------- */
    const requisicoes = [];
    cdp.ao('Network.requestWillBeSent', (p) => {
      if (p && p.request && p.request.url) requisicoes.push(p.request.url);
    });

    const avaliar = async (expr, ms = 120000) => {
      for (let t = 0; ; t += 1) {
        try {
          const r = await cdp.enviar('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: ms });
          if (r.exceptionDetails) throw new Error('JS: ' + ((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || JSON.stringify(r.exceptionDetails)).slice(0, 400));
          return r.result.value;
        } catch (e) {
          if (t >= 2 || !/navigated or closed|context was destroyed|find context/i.test(e.message)) throw e;
          await dormir(400);
        }
      }
    };

    const urlDe = (superficie) => {
      const [caminho, consulta] = superficie.split('?');
      return BASE.replace(/\/$/, '') + caminho + (consulta ? '?' + consulta : '');
    };

    const irPara = async (superficie) => {
      const carga = cdp.esperarEvento('Page.loadEventFired', 30000);
      await cdp.enviar('Page.navigate', { url: urlDe(superficie) });
      await carga;
      for (let i = 0; i < 200; i += 1) {
        const p = await avaliar("document.readyState + '|' + (document.querySelector('main') ? 'main' : '-')").catch(() => '');
        if (/complete\|main|interactive\|main/.test(p)) break;
        await dormir(100);
      }
      await dormir(350);
    };

    /* ---------- 1. as 23 superfícies ---------- */
    saida.superficies = [];
    for (const s of SUPERFICIES) {
      await irPara(s);
      const estado = await avaliar(`(() => {
        const h1 = document.querySelector('h1');
        const texto = (document.querySelector('main') || document.body).innerText || '';
        return {
          url: location.pathname + location.search,
          temMain: !!document.querySelector('main'),
          h1: h1 ? h1.textContent.replace(/\\s+/g, ' ').trim().slice(0, 70) : null,
          caiuNo404DaAplicacao: /Oops! Page not found/.test(texto),
          tamanhoDoTexto: texto.replace(/\\s+/g, ' ').trim().length,
        };
      })()`);
      // O curinga DEVE cair no 404 da aplicação: é a rota que não existe.
      const esperaO404 = s === '/rota-que-nao-existe';
      /*
       * O piso de texto é 20 e não 40 porque o 404 DA APLICAÇÃO é curto de propósito: medido, o
       * texto dele tem 39 caracteres ("404 Oops! Page not found Return to Home"), e um piso de 40
       * reprovava a única superfície que tem de cair nele. Era defeito da verificação, não do site.
       */
      const ok = estado.temMain && estado.tamanhoDoTexto > 20
        && (esperaO404 ? estado.caiuNo404DaAplicacao : !estado.caiuNo404DaAplicacao);
      saida.superficies.push({ superficie: s, ...estado, esperaO404, ok });
      console.error(`${ok ? 'ok  ' : 'FALHA'} ${s} -> ${estado.h1 || '(sem h1)'}`);
    }
    saida.superficiesOk = saida.superficies.filter((x) => x.ok).length;

    /* ---------- 1b. recarregamento de rota profunda, duas vezes ---------- */
    saida.recarregamento = [];
    for (const s of ['/alunos/1', '/observacoes/nova']) {
      await irPara(s);
      const antes = await avaliar("document.querySelector('h1') ? document.querySelector('h1').textContent.trim().slice(0,60) : null");
      const carga = cdp.esperarEvento('Page.loadEventFired', 30000);
      await cdp.enviar('Page.reload', { ignoreCache: true });
      await carga;
      await dormir(600);
      const depois = await avaliar(`(() => {
        const h1 = document.querySelector('h1');
        const texto = (document.querySelector('main') || document.body).innerText || '';
        return { h1: h1 ? h1.textContent.replace(/\\s+/g, ' ').trim().slice(0, 60) : null, caiuNo404: /Oops! Page not found/.test(texto), url: location.pathname };
      })()`);
      const ok = !depois.caiuNo404 && depois.h1 === antes;
      saida.recarregamento.push({ superficie: s, antes, ...depois, ok });
      console.error(`${ok ? 'ok  ' : 'FALHA'} recarregar ${s} -> ${depois.h1}`);
    }

    /* ---------- 2. nada de terceiro ---------- */
    const porOrigem = {};
    for (const u of requisicoes) {
      let origem;
      try { origem = new URL(u).origin; } catch { origem = '(url inválida)'; }
      porOrigem[origem] = (porOrigem[origem] || 0) + 1;
    }
    /*
     * TERCEIRO SE DECIDE PELO ESQUEMA DA URL, não pela origem serializada. `data:` e `blob:` têm
     * origem "null" quando serializadas, e filtrar `/^(data|blob)/` sobre a ORIGEM não pegava nada
     * — "null" entrava na lista de terceiros e a varredura reprovava um site que não pede nada a
     * ninguém. Medido: 4 requisições `data:` nesta passada. Era defeito da verificação.
     */
    const terceiro = (u) => /^https?:\/\//i.test(u) && new URL(u).origin !== origemDoSite;
    const urlsDeTerceiro = [...new Set(requisicoes.filter(terceiro))];
    const deTerceiro = [...new Set(urlsDeTerceiro.map((u) => new URL(u).origin))];
    const naoDeRede = [...new Set(requisicoes.filter((u) => !/^https?:/i.test(u)).map((u) => u.slice(0, u.indexOf(':') + 1)))];
    saida.rede = {
      requisicoes: requisicoes.length,
      porOrigem,
      origensDeTerceiro: deTerceiro,
      urlsDeTerceiro,
      esquemasQueNaoSaoDeRede: naoDeRede,
      fontesPedidas: [...new Set(requisicoes.filter((u) => /\.(woff2?|ttf|otf|eot)(\?|$)/i.test(u)))],
    };
    console.error(`rede: ${requisicoes.length} requisições, origens: ${Object.keys(porOrigem).join(', ')}`);
    console.error(`fontes: ${saida.rede.fontesPedidas.length ? saida.rede.fontesPedidas.join(', ') : '(nenhuma)'}`);

    // CONTROLE POSITIVO do coletor: pede um recurso de origem de fora (domínio .invalid, que nunca
    // resolve) e exige que o coletor o veja.
    const antesDoControle = requisicoes.length;
    await avaliar(`(async () => {
      try { await fetch('${ORIGEM_DO_CONTROLE}/pixel.png', { mode: 'no-cors' }); } catch { /* não resolve, e é de propósito */ }
      return true;
    })()`);
    await dormir(800);
    const viuOControle = requisicoes.slice(antesDoControle).some((u) => u.startsWith(ORIGEM_DO_CONTROLE));
    saida.rede.controlePositivo = {
      origemPlantada: ORIGEM_DO_CONTROLE,
      coletorAcusou: viuOControle,
      requisicoesDepois: requisicoes.length - antesDoControle,
    };
    console.error(`controle positivo do coletor: ${viuOControle ? 'ACUSOU' : 'NÃO ACUSOU — a varredura não está medindo'}`);

    /* ---------- 3. o axe com condição declarada ---------- */
    const injetar = async () => {
      const arquivos = [
        path.join(RAIZ, 'node_modules', 'axe-core', 'axe.min.js'),
        path.join(RAIZ, 'scripts', 'condicao-de-pronto.js'),
        path.join(RAIZ, 'scripts', 'axe-com-condicao.js'),
      ];
      for (const a of arquivos) {
        if (!fs.existsSync(a)) throw new Error('não achei para injetar: ' + a);
        const texto = fs.readFileSync(a, 'utf8');
        await cdp.enviar('Runtime.evaluate', { expression: texto, returnByValue: false });
      }
      return avaliar('({ axe: !!window.axe, pronto: !!window.__pronto, instrumento: !!window.__axe })');
    };

    saida.axe = { amostra: AMOSTRA, passadas: PASSADAS, porSuperficie: {} };
    for (const s of AMOSTRA) {
      await irPara(s);
      const carregado = await injetar();
      if (!carregado.axe || !carregado.pronto || !carregado.instrumento) {
        throw new Error('injeção falhou em ' + s + ': ' + JSON.stringify(carregado));
      }
      // `__axe.medir` navega com `__foto.ir` quando existe; aqui não há `__foto`, e a rota já está
      // carregada, então passa-se `null` para medir a página corrente com a condição da rota.
      const marcador = await avaliar(`window.__pronto.marcadorDe(${JSON.stringify(s)})`);
      const r = await avaliar(`window.__axe.medir(null, { passadas: ${PASSADAS}, marcador: ${JSON.stringify(marcador)} })`);
      saida.axe.porSuperficie[s] = {
        identico: r.identico, resultados: r.resultados, condicao: r.condicao,
        temMarcador: Boolean(marcador), marcador,
        naoAtingiram: r.naoAtingiram, duracaoMs: r.duracaoMs, ambiente: r.ambiente,
      };
      console.error(`axe ${s}: ${r.identico ? 'idêntico' : 'FAIXA'} -> ${[...new Set(r.resultados)].join(' | ')}`);
    }
    const todosZero = Object.values(saida.axe.porSuperficie).every((x) => x.identico && x.resultados[0] === 'ZERO');
    const umAmbiente = Object.values(saida.axe.porSuperficie)[0].ambiente;
    /*
     * A condição da frase descreve a condição INTEIRA e diz em quantas superfícies da amostra cada
     * parte se aplica — não a condição da primeira superfície. Citar a primeira foi um defeito real
     * da frase de `__axe.varrer()`, corrigido na Etapa 18b: `/` não tem gráfico, e a frase saía sem
     * a espera pelo objeto, que é a parte que importa justamente onde há gráfico.
     */
    const comMarcador = AMOSTRA.filter((s) => saida.axe.porSuperficie[s].temMarcador).length;
    saida.axe.frase = (todosZero
      ? `ZERO em ${PASSADAS} de ${PASSADAS} em cada uma das ${AMOSTRA.length} superfícies da amostra`
      : 'resultado NÃO uniforme: ' + JSON.stringify(Object.fromEntries(Object.entries(saida.axe.porSuperficie).map(([k, v]) => [k, v.resultados[0]]))))
      + `; amostra: ${AMOSTRA.join(', ')}`
      + `; ${AMOSTRA.length * PASSADAS} passadas`
      + `; condição "objeto do gráfico onde há gráfico (${comMarcador} de ${AMOSTRA.length} da amostra)`
      + ' + 400 ms sem mutação + movimento reduzido pelo atributo do app + document.fonts.ready"'
      + `; ambiente MEDIDO: ${/Headless/.test(umAmbiente.agente) ? 'Chrome headless' : 'Chrome'}, aba ${umAmbiente.visibilidade}, espera de ${umAmbiente.pedidoMs} ms custou ${umAmbiente.msMediana} ms de mediana (amostras ${umAmbiente.amostrasMs.join(', ')}; limiar ${umAmbiente.limiteMs} ms), janela ${umAmbiente.janela}`
      + `; alvo: ${BASE}`;

    saida.veredito = {
      superficies: `${saida.superficiesOk} de ${SUPERFICIES.length}`,
      recarregamentoOk: saida.recarregamento.every((x) => x.ok),
      semTerceiros: deTerceiro.length === 0,
      coletorAcusouOControle: viuOControle,
      axeUniformeZero: todosZero,
    };
    console.error('');
    console.error('FRASE DO AXE: ' + saida.axe.frase);
    console.error('VEREDITO: ' + JSON.stringify(saida.veredito));
    console.log(JSON.stringify(saida, null, 2));
  } finally {
    try { chrome.kill(); } catch { /* ja morreu */ }
    try { fs.rmSync(perfil, { recursive: true, force: true }); } catch { /* fica para o SO */ }
  }
})().catch((e) => { console.error('FALHOU: ' + e.message); process.exit(1); });
