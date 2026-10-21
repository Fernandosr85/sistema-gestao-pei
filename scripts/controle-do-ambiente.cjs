/*
 * O CONTROLE DO DETECTOR DE AMBIENTE (`__pronto.ambiente()`). Etapa 18.
 *
 * O detector só vale se reclamar quando tem de reclamar E NÃO RECLAMAR quando não tem. As duas
 * pontas são medidas no mesmo Chrome, trocando só o que se quer medir:
 *
 *   1. aba em PRIMEIRO plano  -> `ambiente()` tem de dizer que está limpo e `exigirAmbiente()` tem
 *                                de passar. Detector que só diz não não informa nada.
 *   2. aba em SEGUNDO plano   -> depende do que está MEDIDO, e é aqui que o controle pegou um
 *                                defeito do próprio detector:
 *                                  SEM os sinalizadores, o relógio prende (medido: mediana de
 *                                  995 ms para uma espera pedida de 20 ms) e tudo tem de recusar;
 *                                  COM os sinalizadores, o relógio NÃO prende (21 ms, igual ao
 *                                  primeiro plano) e nada pode recusar — a aba estar oculta sai só
 *                                  como AVISO.
 *                                A primeira versão do detector recusava por
 *                                `document.visibilityState` e teria reprovado o segundo caso: aba
 *                                oculta é prognóstico de estrangulamento, não o estrangulamento.
 *
 * A aba vai para segundo plano abrindo outra aba em primeiro — é a mesma situação do painel do app
 * na Etapa 17, onde a varredura travou.
 *
 * Uso: node scripts/controle-do-ambiente.cjs [--com-flags]
 *   Rode as DUAS formas: sem sinalizador (o estrangulamento tem de aparecer) e com
 *   `--com-flags` (o estrangulamento não pode aparecer). O veredito muda conforme o modo, e é
 *   essa diferença que prova que o detector mede o relógio em vez de adivinhar pela visibilidade.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORTA = 9342;
const COM_FLAGS = process.argv.includes('--com-flags');
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

class Cdp {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pendentes = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pendentes.has(msg.id)) {
        const { ok, ruim } = this.pendentes.get(msg.id);
        this.pendentes.delete(msg.id);
        if (msg.error) ruim(new Error(msg.error.message)); else ok(msg.result);
      }
    });
  }
  enviar(method, params = {}) {
    this.id += 1; const id = this.id;
    return new Promise((ok, ruim) => { this.pendentes.set(id, { ok, ruim }); this.ws.send(JSON.stringify({ id, method, params })); });
  }
}

const abrirWs = (url) => new Promise((ok, ruim) => {
  const ws = new WebSocket(url);
  ws.addEventListener('open', () => ok(ws));
  ws.addEventListener('error', () => ruim(new Error('ws falhou')));
});

(async () => {
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-amb-'));
  const flags = ['--headless=new', '--remote-debugging-port=' + PORTA,
    '--user-data-dir=' + perfil, '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--window-size=1280,900'];
  if (COM_FLAGS) flags.push('--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows');
  const chrome = spawn(CHROME, [...flags, 'http://localhost:8080/'], { stdio: 'ignore' });
  const saida = { comFlags: COM_FLAGS, flags: flags.filter((f) => /throttl|backgroun/.test(f)) };
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
    await cdp.enviar('Runtime.enable');
    const avaliar = async (expr, ms = 120000) => {
      const r = await cdp.enviar('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: ms });
      if (r.exceptionDetails) {
        const d = (r.exceptionDetails.exception && r.exceptionDetails.exception.description) || JSON.stringify(r.exceptionDetails);
        return { __erro: d.slice(0, 400) };
      }
      return r.result.value;
    };
    for (let i = 0; i < 100; i += 1) {
      const p = await avaliar("location.origin + '|' + document.readyState");
      if (p && !p.__erro && /localhost:8080/.test(p) && /complete|interactive/.test(p)) break;
      await dormir(200);
    }

    const carregar = async () => avaliar(`(async () => {
      const colar = async (c) => { const r = await fetch(c); if (!r.ok) throw new Error(c + ' ' + r.status); (new Function(await r.text()))(); };
      await colar('/scripts/condicao-de-pronto.js');
      await colar('/scripts/fotografia.js');
      return { pronto: !!window.__pronto, foto: !!window.__foto, temAmbiente: typeof window.__pronto.ambiente === 'function' };
    })()`);
    saida.carregado = await carregar();

    /* 1. primeiro plano */
    saida.primeiroPlano = {
      ambiente: await avaliar('window.__pronto.ambiente()'),
      exigir: await avaliar('(async () => { try { const a = await window.__pronto.exigirAmbiente(); return { passou: true, msPorEspera: a.msPorEspera }; } catch (e) { return { passou: false, erro: e.message }; } })()'),
      umaSuperficie: await avaliar('(async () => { try { const m = await window.__foto.medirPronto("/alunos"); return { mediu: true, chaves: Object.keys(m) }; } catch (e) { return { mediu: false, erro: e.message.slice(0, 220) }; } })()'),
    };
    console.error('primeiro plano: ' + JSON.stringify(saida.primeiroPlano.ambiente));

    /* 2. manda a aba para segundo plano abrindo outra em primeiro */
    const nova = await cdp.enviar('Target.createTarget', { url: 'about:blank' });
    await cdp.enviar('Target.activateTarget', { targetId: nova.targetId });
    await dormir(1500);

    saida.segundoPlano = {
      ambiente: await avaliar('window.__pronto.ambiente()'),
      exigir: await avaliar('(async () => { try { const a = await window.__pronto.exigirAmbiente(); return { passou: true, msPorEspera: a.msPorEspera }; } catch (e) { return { passou: false, erro: e.message.slice(0, 300) }; } })()'),
      umaSuperficie: await avaliar('(async () => { try { const m = await window.__foto.medirPronto("/alunos"); return { mediu: true, chaves: Object.keys(m) }; } catch (e) { return { mediu: false, erro: e.message.slice(0, 300) }; } })()'),
    };
    console.error('segundo plano: ' + JSON.stringify(saida.segundoPlano.ambiente));

    const a1 = saida.primeiroPlano.ambiente;
    const a2 = saida.segundoPlano.ambiente;
    // O esperado em segundo plano depende dos sinalizadores, e é isso que se está medindo.
    const esperadoEmSegundoPlano = COM_FLAGS ? 'relógio limpo, só aviso' : 'relógio preso, recusa';
    saida.veredito = {
      esperadoEmSegundoPlano,
      limpoEmPrimeiroPlano: a1 && a1.estrangulado === false && saida.primeiroPlano.exigir.passou === true,
      segundoPlanoComoEsperado: COM_FLAGS
        ? Boolean(a2 && a2.estrangulado === false && a2.oculta === true && a2.aviso && saida.segundoPlano.exigir.passou === true)
        : Boolean(a2 && a2.estrangulado === true && saida.segundoPlano.exigir.passou === false && saida.segundoPlano.umaSuperficie.mediu === false),
      msPorEspera: { primeiroPlano: a1 && a1.msPorEspera, segundoPlano: a2 && a2.msPorEspera },
    };
    console.error('veredito: ' + JSON.stringify(saida.veredito));
    console.log(JSON.stringify(saida, null, 2));
  } finally {
    try { chrome.kill(); } catch { /* ja morreu */ }
    try { fs.rmSync(perfil, { recursive: true, force: true }); } catch { /* fica para o SO */ }
  }
})().catch((e) => { console.error('FALHOU: ' + e.message); process.exit(1); });
