/*
 * VARREDURA POR ESTADO, não por rota — controle sem nome acessível que só existe depois de um
 * clique. Etapa 18.
 *
 * POR QUE EXISTE. Toda varredura deste projeto visitou URLs: as 23 superfícies de
 * `scripts/fotografia.js` são 13 rotas, 3 redirecionamentos, 1 curinga e 6 abas do `/gestao`,
 * todas alcançadas pelo endereço. Oito botões com papel `button` e nome vazio atravessaram
 * dezessete etapas, três auditorias de acessibilidade e 230 passadas do axe com condição
 * declarada: quatro em `/observacoes/nova`, que só existem depois de "Adicionar Situação", e
 * quatro na aba "Formação" de "Meu Perfil", a três cliques da raiz. Medido aqui: antes do
 * clique, aqueles blocos de `/observacoes/nova` têm ZERO botões; não é que a varredura os tenha
 * visto sem nome, é que não havia o que ver.
 *
 * COMO RODAR (precisa do servidor de desenvolvimento em 8080 e do Chrome instalado):
 *
 *     node scripts/varredura-de-estados.cjs --profundidade 3 > estados.json
 *     node scripts/varredura-de-estados.cjs --superficies /observacoes/nova --profundidade 1
 *
 * O CONTROLE POSITIVO desta varredura não está aqui: está em
 * `scripts/controles-depois-da-interacao.cjs`, que planta um `<button>` sem nome DENTRO do bloco
 * criado pela interação e exige que a leitura o acuse. Medido antes do conserto da Etapa 18:
 * 5 nomes vazios com o controle plantado contra 4 sem ele; depois do conserto, 1 contra 0 — o
 * instrumento continua enxergando botão mudo, e o que deixou de existir foram os oito.
 * Varredura sem controle não distingue "não há" de "não vi".
 *
 * COMO OS PONTOS SÃO ESCOLHIDOS (mecânico, não escolhido a dedo). Em cada superfície, é candidato
 * a gatilho todo elemento que:
 *   - tem `aria-haspopup` ou `aria-expanded` (menu, acordeão, seletor);
 *   - tem `data-state="closed"` (gatilho fechado do Radix);
 *   - é `[role=tab]` não selecionada;
 *   - é botão cujo nome casa o vocabulário de criação/abertura (adicionar, nova, ver, detalhes,
 *     editar, anexos, configurações, gerar, histórico, desempenho, perfil, expandir, mostrar, abrir).
 * Ficam FORA: links (navegam, e rota já é coberta), e botões de ação destrutiva ou de gravação
 * (remover, excluir, salvar, enviar, cancelar, confirmar) — clicar neles não cria controle, e
 * alguns gravam.
 *
 * PROFUNDIDADE 3, e só pelo que abriu. Depois de um clique, só se desce para gatilhos que estão
 * DENTRO do que apareceu (diálogo, menu, conteúdo de acordeão) — é assim que se chega à aba
 * "Formação" do diálogo do perfil (menu do cabeçalho -> Meu Perfil -> Formação) sem explodir o
 * produto cartesiano.
 *
 * A MEDIDA é a árvore de acessibilidade do Chrome (CDP), no documento inteiro — diálogo do Radix
 * mora em portal fora do `<main>`. Conta-se nó interativo exposto com NOME VAZIO.
 *
 * Uso: node scripts/varredura-de-estados.cjs [--profundidade N] [--superficies a,b,c] > saida.json
 */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORTA = 9341;
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

const arg = (nome, padrao) => {
  const i = process.argv.indexOf(nome);
  return i === -1 ? padrao : process.argv[i + 1];
};
const PROFUNDIDADE = Number(arg('--profundidade', 3));
const PARCIAL = path.join(os.tmpdir(), 'varredura-de-estados-parcial.json');

const ROTAS = [
  '/', '/alunos', '/alunos/novo', '/alunos/1', '/observacoes', '/observacoes/nova',
  '/gestao', '/legislacao', '/manual', '/biblioteca-recursos',
  '/agenda-atendimentos', '/minha-agenda', '/relatorio',
];
const ABAS = ['visao-geral', 'alertas', 'analise', 'relatorios', 'equipe', 'orcamento']
  .map((t) => `/gestao?tab=${t}`);
const TODAS = [...ROTAS, ...ABAS];
const SUPERFICIES = (arg('--superficies', '') || '').trim()
  ? arg('--superficies', '').split(',')
  : TODAS;

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
  /** Espera um evento do protocolo; devolve null no tempo limite, em vez de lançar. */
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

/* ---------- o que roda dentro da página ---------- */

// Ajudantes instalados uma vez por carregamento.
const AJUDANTES = String.raw`(() => {
  const CRIADORES = /adicionar|incluir|criar|nova|novo|ver\b|detalhes|editar|anexos|configura|gerar|hist[oó]rico|desempenho|perfil|expandir|mostrar|abrir|op[cç][oõ]es|menu/i;
  const PROIBIDOS = /remover|excluir|apagar|salvar|enviar|cancelar|confirmar|sair|logout|deletar|baixar|exportar|imprimir|publicar|restaurar|redefinir|resetar|limpar/i;
  const limpo = (s) => (s || '').replace(/\s+/g, ' ').trim();

  const nomeDe = (el) => {
    const rotulo = el.getAttribute('aria-label');
    if (limpo(rotulo)) return limpo(rotulo);
    const por = el.getAttribute('aria-labelledby');
    if (por) {
      const t = por.split(/\s+/).map((id) => { const n = document.getElementById(id); return n ? limpo(n.innerText || n.textContent) : ''; }).join(' ');
      if (limpo(t)) return limpo(t);
    }
    const copia = el.cloneNode(true);
    for (const svg of copia.querySelectorAll('svg')) svg.remove();
    const t = limpo(copia.innerText || copia.textContent);
    if (t) return t;
    return limpo(el.getAttribute('title'));
  };

  // chave estável: sobrevive a recarregar a página, porque os dados do app são fixos
  const chaveDe = (el, escopo) => {
    const tag = el.tagName.toLowerCase();
    const papel = el.getAttribute('role') || '';
    const nome = nomeDe(el).slice(0, 60);
    const iguais = [...(escopo || document).querySelectorAll(tag + (papel ? '[role="' + papel + '"]' : ''))]
      .filter((o) => (o.getAttribute('role') || '') === papel && nomeDe(o).slice(0, 60) === nome);
    return [tag, papel, nome, String(Math.max(0, iguais.indexOf(el)))].join('|');
  };

  const acharPorChave = (chave, escopo) => {
    const [tag, papel, nome, ord] = chave.split('|');
    const cands = [...(escopo || document).querySelectorAll(tag)]
      .filter((o) => (o.getAttribute('role') || '') === papel && nomeDe(o).slice(0, 60) === nome);
    return cands[Number(ord)] || null;
  };

  const visivel = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const e = getComputedStyle(el);
    return e.visibility !== 'hidden' && e.display !== 'none';
  };

  // gatilhos candidatos dentro de um escopo
  const gatilhos = (escopo) => {
    const raiz = escopo || document;
    const vistos = new Set();
    const saida = [];
    const considerar = (el, motivo) => {
      if (vistos.has(el) || !visivel(el)) return;
      if (el.closest('[aria-hidden="true"]')) return;
      const nome = nomeDe(el);
      if (PROIBIDOS.test(nome)) return;
      vistos.add(el);
      // A chave é sempre global ao documento: o escopo serve para DESCOBRIR o gatilho, e o
      // caminho precisa reencontrá-lo depois de recarregar, quando o escopo ainda não existe.
      saida.push({ chave: chaveDe(el, document), nome: nome.slice(0, 60), motivo, tag: el.tagName.toLowerCase(), papel: el.getAttribute('role') || '' });
    };
    for (const el of raiz.querySelectorAll('[aria-haspopup]')) considerar(el, 'aria-haspopup');
    for (const el of raiz.querySelectorAll('[aria-expanded]')) considerar(el, 'aria-expanded');
    for (const el of raiz.querySelectorAll('[data-state="closed"]')) considerar(el, 'data-state=closed');
    for (const el of raiz.querySelectorAll('[role="tab"]')) { if (el.getAttribute('aria-selected') !== 'true') considerar(el, 'aba não selecionada'); }
    for (const el of raiz.querySelectorAll('button, [role="button"], [role="menuitem"], [role="menuitemcheckbox"], summary')) { if (CRIADORES.test(nomeDe(el))) considerar(el, 'vocabulário de criação'); }
    return saida;
  };

  // o que apareceu: contêineres abertos agora (diálogo, menu, conteúdo de acordeão)
  const abertos = () => [...document.querySelectorAll('[role="dialog"], [role="menu"], [role="listbox"], [data-state="open"]')]
    .filter((el) => visivel(el));

  window.__estados = { nomeDe, chaveDe, acharPorChave, gatilhos, abertos, visivel, limpo };
  return true;
})()`;

const PAPEIS_INTERATIVOS = new Set([
  'button', 'link', 'checkbox', 'radio', 'switch', 'textbox', 'combobox', 'menuitem',
  'menuitemcheckbox', 'menuitemradio', 'tab', 'slider', 'spinbutton', 'searchbox',
  'option', 'treeitem', 'listbox',
]);

(async () => {
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-est-'));
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORTA,
    '--user-data-dir=' + perfil, '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--window-size=1280,900',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    'http://localhost:8080/'], { stdio: 'ignore' });
  const relatorio = { profundidade: PROFUNDIDADE, superficies: SUPERFICIES, pontos: [], achados: [] };
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
    await cdp.enviar('Runtime.enable'); await cdp.enviar('DOM.enable'); await cdp.enviar('Accessibility.enable'); await cdp.enviar('Page.enable');
    /*
     * RETENTATIVA NA CORRIDA COM O CARREGAMENTO. A primeira passada completa deste instrumento
     * morreu na 5ª superfície com "Inspected target navigated or closed": a avaliação caía no
     * documento que o `Page.navigate` estava destruindo. Agora a chamada tenta outra vez depois de
     * o documento novo existir — e `irPara` espera o evento de carga em vez de dormir.
     */
    const avaliar = async (expr, ms = 60000) => {
      for (let tentativa = 0; ; tentativa += 1) {
        try {
          const r = await cdp.enviar('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: ms });
          if (r.exceptionDetails) throw new Error('JS: ' + ((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || JSON.stringify(r.exceptionDetails)).slice(0, 600) + ' <<< ' + expr.slice(0, 200));
          return r.result.value;
        } catch (e) {
          if (tentativa >= 2 || !/navigated or closed|Execution context was destroyed|Cannot find context/i.test(e.message)) throw e;
          await dormir(400);
        }
      }
    };
    for (let i = 0; i < 100; i += 1) {
      const p = await avaliar("location.origin + '|' + document.readyState").catch(() => '');
      if (/localhost:8080/.test(p) && /complete|interactive/.test(p)) break;
      await dormir(200);
    }

    const instalar = async () => {
      await avaliar("(() => { document.documentElement.setAttribute('data-a11y-motion','reduzido'); return true; })()");
      await avaliar(AJUDANTES);
    };
    await instalar();

    /*
     * CARREGAMENTO DE VERDADE, não `pushState`. Medido na primeira versão deste instrumento: com
     * `pushState` o estado do React sobrevive à troca de rota, e um diálogo aberto num ponto
     * continuava aberto nos pontos seguintes — com ele aberto, o Radix põe `aria-hidden` no resto
     * do documento e a árvore devolve ZERO controle sem nome. O instrumento mediria limpo por
     * contaminação. Cada ponto agora começa de um documento novo, com `localStorage` vazio.
     */
    const irPara = async (rota) => {
      const carga = cdp.esperarEvento('Page.loadEventFired', 20000);
      await cdp.enviar('Page.navigate', { url: 'http://localhost:8080' + rota });
      await carga;
      for (let i = 0; i < 150; i += 1) {
        const p = await avaliar("document.readyState + '|' + (document.querySelector('main') ? 'main' : '-')").catch(() => '');
        if (/complete\|main|interactive\|main/.test(p)) break;
        await dormir(100);
      }
      await avaliar('(() => { try { localStorage.clear(); sessionStorage.clear(); } catch { /* bloqueado */ } return true; })()');
      await dormir(400);
      await avaliar('(async () => { if (document.fonts && document.fonts.ready) await document.fonts.ready; return true; })()');
      await instalar();
    };

    /** nós interativos expostos com nome vazio, no documento inteiro */
    const semNome = async () => {
      const { root } = await cdp.enviar('DOM.getDocument', { depth: -1, pierce: true });
      const { nodes } = await cdp.enviar('Accessibility.queryAXTree', { nodeId: root.nodeId });
      const maus = nodes.filter((n) => !n.ignored && n.role && PAPEIS_INTERATIVOS.has(n.role.value) && !(n.name && n.name.value));
      const saida = [];
      for (const n of maus) {
        let onde = '(sem descrição)';
        try {
          const d = await cdp.enviar('DOM.describeNode', { backendNodeId: n.backendDOMNodeId });
          const attrs = d.node.attributes || [];
          const mapa = {};
          for (let k = 0; k < attrs.length; k += 2) mapa[attrs[k]] = attrs[k + 1];
          onde = d.node.nodeName.toLowerCase() + (mapa.class ? '.' + mapa.class.split(/\s+/).slice(0, 3).join('.') : '');
        } catch { /* nó sumiu */ }
        saida.push({ papel: n.role.value, nome: '', onde });
      }
      return saida;
    };

    /*
     * CLIQUE DE MOUSE DE VERDADE, pelo protocolo. Medido: `el.click()` NÃO abre menu do Radix —
     * o gatilho do `DropdownMenu` escuta `pointerdown`, e o "Menu da conta" devolvia zero
     * contêiner aberto. Aqui vai um evento de ponteiro pelo CDP, nas coordenadas do elemento, e
     * confere-se que o ponto cai sobre o alvo; quando não cai (coberto por outra camada), o
     * instrumento registra que usou o caminho sintético, para a leitura não misturar os dois.
     */
    const clicar = async (chave) => {
      const alvo = await avaliar(`(() => {
        const el = window.__estados.acharPorChave(${JSON.stringify(chave)}, document);
        if (!el) return 'nao-achei';
        el.scrollIntoView({ block: 'center' });
        const r = el.getBoundingClientRect();
        const x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
        const sob = document.elementFromPoint(x, y);
        return { x, y, acerta: !!sob && (sob === el || el.contains(sob) || sob.contains(el)) };
      })()`);
      if (alvo === 'nao-achei') return 'nao-achei';
      if (alvo.acerta && alvo.x > 0 && alvo.y > 0) {
        for (const type of ['mousePressed', 'mouseReleased']) {
          await cdp.enviar('Input.dispatchMouseEvent', { type, x: alvo.x, y: alvo.y, button: 'left', clickCount: 1, buttons: type === 'mousePressed' ? 1 : 0 });
        }
        return 'ok';
      }
      const r = await avaliar(`(() => {
        const el = window.__estados.acharPorChave(${JSON.stringify(chave)}, document);
        if (!el) return 'nao-achei';
        el.click();
        return 'ok-sintetico';
      })()`);
      return r;
    };

    const assentar = async () => {
      await avaliar(`(async () => {
        const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
        const alvo = document.body;
        let ultima = performance.now();
        const obs = new MutationObserver(() => { ultima = performance.now(); });
        obs.observe(alvo, { childList: true, subtree: true, attributes: true });
        const t0 = performance.now();
        while (performance.now() - t0 < 4000 && performance.now() - ultima < 300) await esperar(70);
        obs.disconnect();
        return Math.round(performance.now() - t0);
      })()`);
    };

    /** visita um caminho de chaves a partir de uma superfície limpa */
    const visitar = async (rota, caminho) => {
      await irPara(rota);
      const comoClicou = [];
      for (const passo of caminho) {
        const r = await clicar(passo);
        if (r !== 'ok' && r !== 'ok-sintetico') return { falhou: r, passo };
        comoClicou.push(r);
        await assentar();
      }
      return { falhou: null, comoClicou };
    };

    let totalPontos = 0;
    for (const rota of SUPERFICIES) {
      // Parcial a cada superfície, para uma queda no meio não levar embora o que já foi medido.
      // Vai para o diretório temporário do SO, NUNCA para dentro do repositório.
      fs.writeFileSync(PARCIAL, JSON.stringify(relatorio, null, 2), 'utf8');
      await irPara(rota);
      const base = await semNome();
      const topo = await avaliar('window.__estados.gatilhos(document)');
      console.error(`${rota}: ${topo.length} gatilhos | base sem nome: ${base.length}`);
      relatorio.pontos.push({ rota, tipo: 'base', caminho: [], gatilhos: topo.length, semNome: base });
      if (base.length) relatorio.achados.push({ rota, caminho: [], semNome: base });

      // fila de caminhos a explorar: cada item é uma lista de chaves
      const fila = topo.map((g) => ({ caminho: [g.chave], rotulos: [g.nome || g.chave], motivo: g.motivo }));
      while (fila.length) {
        const item = fila.shift();
        totalPontos += 1;
        let v;
        try {
          v = await visitar(rota, item.caminho);
        } catch (e) {
          // Ponto que explode não derruba a varredura, mas ENTRA no relatório: ponto não medido é
          // buraco no escopo, e escopo é parte do resultado.
          relatorio.pontos.push({ rota, tipo: 'ponto', caminho: item.rotulos, erro: 'EXCEÇÃO: ' + e.message.slice(0, 200) });
          console.error(`  xx ${rota} ${item.rotulos.join(' > ')} -> EXCEÇÃO: ${e.message.slice(0, 120)}`);
          continue;
        }
        if (v.falhou) {
          relatorio.pontos.push({ rota, tipo: 'ponto', caminho: item.rotulos, erro: v.falhou });
          continue;
        }
        const maus = await semNome();
        const modal = await avaliar('document.querySelectorAll(\'[aria-modal="true"]\').length');
        const abriu = await avaliar(`window.__estados.abertos().map((e) => (e.getAttribute('role') || e.tagName.toLowerCase()) + (e.className && typeof e.className === 'string' ? '.' + e.className.split(/\\s+/)[0] : ''))`);
        relatorio.pontos.push({ rota, tipo: 'ponto', caminho: item.rotulos, motivo: item.motivo, abriu, modal, comoClicou: v.comoClicou, semNome: maus });
        const novos = maus.filter((m) => !base.some((b) => b.papel === m.papel && b.onde === m.onde));
        if (novos.length) {
          relatorio.achados.push({ rota, caminho: item.rotulos, semNome: novos });
          console.error(`  !! ${rota} ${item.rotulos.join(' > ')} -> ${novos.length} sem nome: ${novos.map((n) => n.papel + '│' + n.onde).join(', ')}`);
        }
        // descer só pelo que abriu
        if (item.caminho.length < PROFUNDIDADE && abriu.length) {
          const dentro = await avaliar(`(() => {
            const conts = window.__estados.abertos();
            const saida = [];
            for (const c of conts) for (const g of window.__estados.gatilhos(c)) saida.push(g);
            const vistos = new Set(); return saida.filter((g) => { if (vistos.has(g.chave)) return false; vistos.add(g.chave); return true; });
          })()`);
          for (const g of dentro) fila.push({ caminho: [...item.caminho, g.chave], rotulos: [...item.rotulos, g.nome || g.chave], motivo: g.motivo });
        }
      }
    }
    relatorio.totalPontos = totalPontos;
    console.error(`\ntotal de pontos visitados: ${totalPontos} | achados: ${relatorio.achados.length}`);
    console.log(JSON.stringify(relatorio, null, 2));
  } finally {
    try { chrome.kill(); } catch { /* ja morreu */ }
    try { fs.rmSync(perfil, { recursive: true, force: true }); } catch { /* fica para o SO */ }
  }
})().catch((e) => { console.error('FALHOU: ' + e.message); process.exit(1); });
