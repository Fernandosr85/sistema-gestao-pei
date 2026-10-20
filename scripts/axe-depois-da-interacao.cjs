/*
 * O AXE DEPOIS DA INTERAÇÃO, em três estados que a varredura por rota não alcança. Etapa 18.
 *
 * Existe para não deixar no registro uma previsão: a Pendência 11 diz que `aria-input-field-name`
 * cobre `combobox`, `listbox` e `slider`, e daí que "o axe acusaria estes três se a varredura dele
 * abrisse o seletor". Isso é previsão até ser medido — e o achado 24 é sobre exatamente esse tipo de
 * suposição a respeito do que a ferramenta cobre.
 *
 * Três casos, cada um com N passadas sob a mesma condição dos instrumentos do repositório:
 *   A  /observacoes/nova  -> abre o seletor "Selecione o aluno"   (listbox sem nome)
 *   B  /                  -> Menu da conta > Meu Perfil > Preferências (combobox sem nome)
 *   C  /                  -> Nova Avaliação                       (slider sem nome)
 *
 * O QUE ESTA MEDIÇÃO DEVOLVEU (Etapa 18, 3 passadas por estado, resultado idêntico nas três):
 *
 *   listbox  (/observacoes/nova, seletor aberto)  -> aria-hidden-focus(1), grave — e NADA sobre nome
 *   combobox (Meu Perfil > Preferências)          -> button-name(1), critical
 *   slider   (Nova Avaliação > Objetivos)         -> aria-input-field-name(1), grave
 *
 * Um de três pela regra prevista, dois de três por alguma regra, e o terceiro por nenhuma. O
 * `aria-hidden-focus` é o Radix pondo `aria-hidden="true"` em `.min-h-screen` com o seletor aberto,
 * com elemento focável dentro — violação que nenhuma varredura por rota podia ver.
 *
 * Uso: node scripts/axe-depois-da-interacao.cjs [--passadas N] > saida.json
 */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORTA = 9345;
const arg = (n, d) => { const i = process.argv.indexOf(n); return i === -1 ? d : process.argv[i + 1]; };
const PASSADAS = Number(arg('--passadas', 3));
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

const CASOS = [
  { nome: 'A', rota: '/observacoes/nova', passos: [['Selecione o aluno', 'button, [role="combobox"]']], espera: 'listbox' },
  { nome: 'B', rota: '/', passos: [['Menu da conta', 'button'], ['Meu Perfil', '[role="menuitem"]'], ['Preferências', '[role="tab"]']], espera: 'combobox' },
  // Dois cliques: o controle deslizante vive na aba "Objetivos" do diálogo, não na aba inicial —
  // foi onde a varredura por estado o achou ("Nova Avaliação > Objetivos").
  { nome: 'C', rota: '/', passos: [['Nova Avaliação', 'button'], ['Objetivos', '[role="tab"]']], espera: 'slider' },
];

(async () => {
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-axest-'));
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORTA,
    '--user-data-dir=' + perfil, '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--window-size=1280,900',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    'http://localhost:8080/'], { stdio: 'ignore' });
  const saida = { passadas: PASSADAS, casos: {} };
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
    await cdp.enviar('Runtime.enable'); await cdp.enviar('Page.enable');
    await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
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

    const irPara = async (rota) => {
      const carga = cdp.esperarEvento('Page.loadEventFired', 20000);
      await cdp.enviar('Page.navigate', { url: 'http://localhost:8080' + rota });
      await carga;
      for (let i = 0; i < 150; i += 1) {
        const p = await avaliar("document.readyState + '|' + (document.querySelector('main') ? 'main' : '-')").catch(() => '');
        if (/complete\|main|interactive\|main/.test(p)) break;
        await dormir(100);
      }
      await avaliar(`(async () => {
        try { localStorage.clear(); sessionStorage.clear(); } catch { /* bloqueado */ }
        document.documentElement.setAttribute('data-a11y-motion', 'reduzido');
        const colar = async (c) => { const r = await fetch(c); if (!r.ok) throw new Error(c + ' ' + r.status); (new Function(await r.text()))(); };
        if (!window.axe) await colar('/node_modules/axe-core/axe.min.js');
        await colar('/scripts/condicao-de-pronto.js');
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
        return true;
      })()`);
    };

    const clicarTexto = async (texto, seletor) => {
      const a = await avaliar(`(() => {
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
      if (a === 'nao-achei') throw new Error('não achei: ' + texto);
      if (!a.acerta) throw new Error('coberto: ' + texto);
      for (const type of ['mousePressed', 'mouseReleased']) {
        await cdp.enviar('Input.dispatchMouseEvent', { type, x: a.x, y: a.y, button: 'left', clickCount: 1, buttons: type === 'mousePressed' ? 1 : 0 });
      }
      await avaliar(`(async () => {
        const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
        let ultima = performance.now();
        const obs = new MutationObserver(() => { ultima = performance.now(); });
        obs.observe(document.body, { childList: true, subtree: true, attributes: true });
        const t0 = performance.now();
        while (performance.now() - t0 < 4000 && performance.now() - ultima < 400) await esperar(70);
        obs.disconnect();
        return true;
      })()`);
    };

    for (const caso of CASOS) {
      const r = { rota: caso.rota, passos: caso.passos.map((p) => p[0]), esperado: caso.espera, resultados: [] };
      for (let i = 0; i < PASSADAS; i += 1) {
        await irPara(caso.rota);
        for (const [texto, sel] of caso.passos) await clicarTexto(texto, sel);
        const medida = await avaliar(`(async () => {
          const alvos = [...document.querySelectorAll('[role="listbox"], [role="combobox"], [role="slider"]')];
          const semNome = alvos.filter((e) => !(e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || (e.innerText || '').trim())).length;
          const res = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
          return {
            papeisPresentes: alvos.map((e) => e.getAttribute('role')),
            semNomeNoDom: semNome,
            violacoes: res.violations.map((v) => v.id + '(' + v.nodes.length + ')').sort().join(',') || 'ZERO',
            detalhe: res.violations.map((v) => ({ regra: v.id, impacto: v.impact, nos: v.nodes.map((n) => ({ alvo: n.target.join(' '), html: (n.html || '').slice(0, 160) })) })),
            incompletas: res.incomplete.map((v) => v.id + '(' + v.nodes.length + ')').sort().join(',') || 'ZERO',
          };
        })()`);
        r.resultados.push(medida);
      }
      const distintas = [...new Set(r.resultados.map((x) => x.violacoes))];
      r.identico = distintas.length === 1;
      r.violacoes = distintas;
      saida.casos[caso.nome] = r;
      console.error(`caso ${caso.nome} (${caso.rota} :: ${r.passos.join(' > ')}) esperando ${caso.espera}`);
      console.error(`  papéis presentes: ${JSON.stringify(r.resultados[0].papeisPresentes)} | sem nome no DOM: ${r.resultados[0].semNomeNoDom}`);
      console.error(`  axe, ${PASSADAS} passadas: ${r.identico ? 'idêntico -> ' : 'FAIXA -> '}${distintas.join(' | ')}`);
      console.error(`  incompletas: ${r.resultados[0].incompletas}`);
    }
    console.log(JSON.stringify(saida, null, 2));
  } finally {
    try { chrome.kill(); } catch { /* ja morreu */ }
    try { fs.rmSync(perfil, { recursive: true, force: true }); } catch { /* fica para o SO */ }
  }
})().catch((e) => { console.error('FALHOU: ' + e.message); process.exit(1); });
