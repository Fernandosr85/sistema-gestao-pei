/*
 * OS SEIS CONTROLES SEM NOME, medidos na árvore DEPOIS da interação — e o controle positivo da
 * varredura por estado. Etapa 18.
 *
 * Mostra `papel│nome` de cada botão dos blocos onde os seis vivem, nos dois estados em que eles só
 * existem depois de um clique:
 *
 *   caso A  /observacoes/nova  -> "Adicionar Situação" e "Adicionar Interação" criam as linhas, e
 *                                 com duas linhas aparece o botão de remover de CADA uma (o JSX
 *                                 esconde o botão quando há só uma): 2 sítios no código, 4 botões.
 *   caso B  /  -> "Menu da conta" -> "Meu Perfil" -> aba "Formação": 4 botões (editar e remover de
 *                                 duas formações), dentro de `<fieldset disabled>` — desabilitado
 *                                 continua na árvore, e continua precisando de nome.
 *
 * `--plantar` acrescenta o CONTROLE POSITIVO: um `<button>` sem nome dentro do mesmo bloco, depois
 * da interação. A medição tem de acusá-lo; se não acusar, o zero desta medida não vale nada.
 * Medido na Etapa 18, nos dois casos: **5 nomes vazios com o controle plantado contra 4 sem ele**
 * antes do conserto, e **1 contra 0** depois. O zero de agora é zero porque o 1 ainda aparece.
 *
 * Uso: node scripts/controles-depois-da-interacao.cjs [--plantar] > saida.json
 */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORTA = 9343;
const PLANTAR = process.argv.includes('--plantar');
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
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-seis-'));
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORTA,
    '--user-data-dir=' + perfil, '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--window-size=1280,900',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    'http://localhost:8080/'], { stdio: 'ignore' });
  const saida = { plantou: PLANTAR, casos: {} };
  try {
    let alvo = null;
    for (let i = 0; i < 100; i += 1) {
      try {
        const r = await fetch('http://127.0.0.1:' + PORTA + '/json/list');
        alvo = (await r.json()).find((t) => t.type === 'page' && t.url.includes('localhost:8080'));
        if (alvo) break;
      } catch { /* subindo */ }
      await dormir(200);
    }
    if (!alvo) throw new Error('aba nao encontrada');
    const cdp = new Cdp(await abrirWs(alvo.webSocketDebuggerUrl));
    await cdp.enviar('Runtime.enable'); await cdp.enviar('DOM.enable');
    await cdp.enviar('Accessibility.enable'); await cdp.enviar('Page.enable');
    const avaliar = async (expr, ms = 60000) => {
      for (let t = 0; ; t += 1) {
        try {
          const r = await cdp.enviar('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: ms });
          if (r.exceptionDetails) throw new Error('JS: ' + ((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || JSON.stringify(r.exceptionDetails)).slice(0, 500));
          return r.result.value;
        } catch (e) {
          if (t >= 2 || !/navigated or closed|context was destroyed|find context/i.test(e.message)) throw e;
          await dormir(400);
        }
      }
    };

    const irPara = async (rota) => {
      const carga = cdp.esperarEvento('Page.loadEventFired', 20000);
      await cdp.enviar('Page.navigate', { url: 'http://localhost:8080' + rota });
      await carga;
      for (let i = 0; i < 150; i += 1) {
        const p = await avaliar("document.readyState + '|' + (document.querySelector('main') ? 'main' : '-')").catch(() => '');
        if (/complete\|main|interactive\|main/.test(p)) break;
        await dormir(100);
      }
      await avaliar('(() => { try { localStorage.clear(); sessionStorage.clear(); } catch { /* bloqueado */ } document.documentElement.setAttribute("data-a11y-motion","reduzido"); return true; })()');
      await dormir(400);
    };

    const assentar = async () => avaliar(`(async () => {
      const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
      let ultima = performance.now();
      const obs = new MutationObserver(() => { ultima = performance.now(); });
      obs.observe(document.body, { childList: true, subtree: true, attributes: true });
      const t0 = performance.now();
      while (performance.now() - t0 < 4000 && performance.now() - ultima < 300) await esperar(70);
      obs.disconnect();
      return Math.round(performance.now() - t0);
    })()`);

    /** clique de mouse de verdade, pelo texto visível do controle */
    const clicarTexto = async (texto, seletor = 'button, [role="menuitem"], [role="tab"]') => {
      const alvoClique = await avaliar(`(() => {
        const limpo = (s) => (s || '').replace(/\\s+/g, ' ').trim();
        const cands = [...document.querySelectorAll(${JSON.stringify(seletor)})];
        const el = cands.find((e) => limpo(e.innerText || e.textContent) === ${JSON.stringify(texto)})
          || cands.find((e) => limpo(e.getAttribute('aria-label')) === ${JSON.stringify(texto)})
          || cands.find((e) => limpo(e.innerText || e.textContent).includes(${JSON.stringify(texto)}));
        if (!el) return 'nao-achei';
        el.scrollIntoView({ block: 'center' });
        const r = el.getBoundingClientRect();
        const x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
        const sob = document.elementFromPoint(x, y);
        return { x, y, acerta: !!sob && (sob === el || el.contains(sob) || sob.contains(el)) };
      })()`);
      if (alvoClique === 'nao-achei') throw new Error('não achei o controle: ' + texto);
      if (!alvoClique.acerta) throw new Error('ponto coberto por outra camada: ' + texto);
      for (const type of ['mousePressed', 'mouseReleased']) {
        await cdp.enviar('Input.dispatchMouseEvent', { type, x: alvoClique.x, y: alvoClique.y, button: 'left', clickCount: 1, buttons: type === 'mousePressed' ? 1 : 0 });
      }
      await assentar();
      return true;
    };

    /** marca os blocos de interesse e devolve quantos foram marcados */
    const marcarBlocos = async (modo) => avaliar(`(() => {
      const limpo = (s) => (s || '').replace(/\\s+/g, ' ').trim();
      for (const el of document.querySelectorAll('[data-ax-bloco]')) el.removeAttribute('data-ax-bloco');
      let n = 0;
      if (${JSON.stringify(modo)} === 'A') {
        for (const h of document.querySelectorAll('h3')) {
          const t = limpo(h.innerText);
          if (!/^(Situação|Interação) \\d+$/.test(t)) continue;
          const bloco = h.closest('div.p-4');
          if (bloco) { bloco.setAttribute('data-ax-bloco', t); n += 1; }
        }
      } else {
        for (const h of document.querySelectorAll('h4')) {
          const t = limpo(h.innerText);
          const bloco = h.closest('div.border');
          if (bloco && bloco.querySelector('button')) { bloco.setAttribute('data-ax-bloco', t); n += 1; }
        }
      }
      return n;
    })()`);

    /** papel│nome de cada controle dentro de cada bloco marcado, pela árvore do Chrome */
    const lerBlocos = async () => {
      const chaves = await avaliar("[...document.querySelectorAll('[data-ax-bloco]')].map((e) => e.getAttribute('data-ax-bloco'))");
      const { root } = await cdp.enviar('DOM.getDocument', { depth: -1, pierce: true });
      const saidaBlocos = {};
      for (const chave of chaves) {
        const { nodeId } = await cdp.enviar('DOM.querySelector', { nodeId: root.nodeId, selector: `[data-ax-bloco="${chave.replace(/"/g, '\\"')}"]` });
        if (!nodeId) { saidaBlocos[chave] = ['(bloco não encontrado)']; continue; }
        const { nodes } = await cdp.enviar('Accessibility.queryAXTree', { nodeId });
        saidaBlocos[chave] = nodes
          .filter((n) => !n.ignored && n.role && ['button', 'link', 'checkbox', 'textbox', 'combobox', 'slider'].includes(n.role.value))
          .map((n) => `${n.role.value}│${(n.name && n.name.value) || '(VAZIO)'}`);
      }
      return saidaBlocos;
    };

    const plantar = async (modo) => avaliar(`(() => {
      const bloco = document.querySelector('[data-ax-bloco]');
      if (!bloco) return 'sem bloco';
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('data-controle-plantado', '1');
      b.style.cssText = 'width:24px;height:24px';
      bloco.appendChild(b);
      return document.querySelectorAll('[data-controle-plantado]').length;
    })()`);
    const despiantar = async () => avaliar("(() => { let n = 0; for (const e of document.querySelectorAll('[data-controle-plantado]')) { e.remove(); n += 1; } return n; })()");

    /* ---------- caso A ---------- */
    await irPara('/observacoes/nova');
    saida.casos.A = { rota: '/observacoes/nova', passos: ['Adicionar Situação', 'Adicionar Interação'] };
    saida.casos.A.antesDaInteracao = { blocosMarcados: await marcarBlocos('A'), blocos: await lerBlocos() };
    await clicarTexto('Adicionar Situação');
    await clicarTexto('Adicionar Interação');
    saida.casos.A.blocosMarcados = await marcarBlocos('A');
    saida.casos.A.depoisDaInteracao = await lerBlocos();
    if (PLANTAR) {
      const quantos = await plantar('A');
      await marcarBlocos('A');
      saida.casos.A.comControlePlantado = { plantados: quantos, blocos: await lerBlocos() };
      saida.casos.A.removidos = await despiantar();
      await marcarBlocos('A');
      saida.casos.A.semControlePlantado = await lerBlocos();
    }

    /* ---------- caso B ---------- */
    await irPara('/');
    saida.casos.B = { rota: '/', passos: ['Menu da conta', 'Meu Perfil', 'Formação'] };
    await clicarTexto('Menu da conta');
    await clicarTexto('Meu Perfil', '[role="menuitem"]');
    await clicarTexto('Formação', '[role="tab"]');
    saida.casos.B.blocosMarcados = await marcarBlocos('B');
    saida.casos.B.depoisDaInteracao = await lerBlocos();
    if (PLANTAR) {
      const quantos = await plantar('B');
      await marcarBlocos('B');
      saida.casos.B.comControlePlantado = { plantados: quantos, blocos: await lerBlocos() };
      saida.casos.B.removidos = await despiantar();
      await marcarBlocos('B');
      saida.casos.B.semControlePlantado = await lerBlocos();
    }

    for (const [nome, caso] of Object.entries(saida.casos)) {
      console.error(`caso ${nome} (${caso.rota}, ${caso.passos.join(' > ')}): ${caso.blocosMarcados} blocos`);
      for (const [b, ctrls] of Object.entries(caso.depoisDaInteracao || {})) console.error(`  ${b}: ${ctrls.join(' , ')}`);
      if (caso.comControlePlantado) {
        const todos = Object.values(caso.comControlePlantado.blocos).flat();
        console.error(`  controle plantado: ${todos.filter((c) => /VAZIO/.test(c)).length} vazios com o controle, `
          + `${Object.values(caso.semControlePlantado).flat().filter((c) => /VAZIO/.test(c)).length} sem`);
      }
    }
    console.log(JSON.stringify(saida, null, 2));
  } finally {
    try { chrome.kill(); } catch { /* ja morreu */ }
    try { fs.rmSync(perfil, { recursive: true, force: true }); } catch { /* fica para o SO */ }
  }
})().catch((e) => { console.error('FALHOU: ' + e.message); process.exit(1); });
