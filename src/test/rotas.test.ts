import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/*
 * Todo destino de navegação tem de resolver para uma rota declarada em App.tsx.
 *
 * Este teste lê o código-fonte em vez de renderizar: o destino de um `<Link>` é texto no
 * arquivo, e renderizar a aplicação inteira para descobri-lo custaria muito mais sem cobrir
 * mais. Link quebrado é defeito barulhento, então isto é guarda de regressão, não caça a
 * defeito — hoje são 12 destinos distintos e 0 órfãos (regra: texto do destino como está no
 * fonte, antes de normalizar, contado sem repetição).
 *
 * A LIÇÃO QUE ESTE ARQUIVO CARREGA: ao planejar esta etapa, escrevi esta varredura, ela
 * devolveu 0 órfãos, e plantei um destino quebrado para conferir — e ela CONTINUOU devolvendo
 * 0. O trecho que eu mandava substituir não existia no arquivo que escolhi, a quebra nunca foi
 * plantada, e eu não conferi. Por isso o teste abaixo assevera que a varredura acusa um órfão
 * injetado: sem essa asserção, "0 órfãos" pode ser "a varredura não vê nada".
 */

const RAIZ = path.resolve(__dirname, '../..');

const arquivos = (dir: string, saida: string[] = []): string[] => {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) arquivos(p, saida);
    else if (/\.tsx?$/.test(item.name) && !/\.test\.tsx?$/.test(item.name)) saida.push(p);
  }
  return saida;
};

/** Caminho relativo com `/`, igual no Windows e no Linux do CI. */
const relativo = (f: string) => path.relative(RAIZ, f).split(path.sep).join('/');

const rotasDeclaradas = (fonteApp: string) =>
  [...fonteApp.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);

/* O que a varredura CAPTURA: destino literal ou template, nas três formas de navegar. */
const LINK_CAPTURADO = /<Link\s[^>]*?to=(?:"([^"]+)"|\{`([^`]+)`\})/g;
const NAVIGATE_CAPTURADO = /<Navigate\s[^>]*?to=(?:"([^"]+)"|\{`([^`]+)`\})/g;
const CHAMADA_CAPTURADA = /navigate\(\s*(?:'([^']+)'|"([^"]+)"|`([^`]+)`)/g;

const destinosDe = (fonte: string) => {
  const achados: string[] = [];
  for (const m of fonte.matchAll(LINK_CAPTURADO)) achados.push(m[1] ?? m[2]);
  for (const m of fonte.matchAll(NAVIGATE_CAPTURADO)) achados.push(m[1] ?? m[2]);
  for (const m of fonte.matchAll(CHAMADA_CAPTURADA)) achados.push(m[1] ?? m[2] ?? m[3]);
  return achados;
};

/** Template vira padrão comparável: `/alunos/${id}` e `/alunos/:id` são o mesmo destino. */
const normaliza = (alvo: string) => alvo.replace(/\$\{[^}]+\}/g, ':param').split('?')[0];

/*
 * Um segmento LITERAL do destino só casa segmento literal igual da rota. Sem isso,
 * `/alunos/novo` casaria `/alunos/:id`, e apagar a rota estática passaria despercebido —
 * medido: com a regra frouxa, remover `<Route path="/alunos/novo">` de App.tsx não reprovava
 * a suíte. No aplicativo, esse destino cairia no StudentDetail com id "novo".
 *
 * Segmento de parâmetro no destino (`${id}`) casa segmento de parâmetro da rota.
 */
const resolve = (alvo: string, rotas: string[]) => {
  const partes = normaliza(alvo).split('/').filter(Boolean);
  return rotas.some((rota) => {
    if (rota === '*') return false;
    const padrao = rota.split('/').filter(Boolean);
    if (padrao.length !== partes.length) return false;
    return padrao.every((seg, i) =>
      partes[i] === ':param' ? seg.startsWith(':') : seg === partes[i],
    );
  });
};

/*
 * SÍTIOS × CAPTURADOS (Etapa 8).
 *
 * A varredura acima só enxerga destino literal ou template. Um destino que venha de variável
 * — `to={destino}`, `navigate(destino)` — some dela sem aviso, e é exatamente essa a forma que
 * torna viva a advisory de open redirect do react-router (GHSA-wrjc-x8rr-h8h6): destino vindo
 * de dado pode começar com `\`. Por isso aqui se conta todo SÍTIO de navegação, capturado ou
 * não, e todo sítio não capturado tem de estar na lista abaixo, pelo nome.
 *
 * Os três de hoje vêm de arrays literais no próprio arquivo, conferidos um a um na Etapa 8. Um
 * quarto destino não literal reprova — e antes de acrescentá-lo aqui, alguém tem de olhar de
 * onde ele vem.
 */
const NAO_LITERAIS_CONHECIDOS = [
  'src/components/Header.tsx: to={item.path}',
  'src/components/Header.tsx: to={item.path}',
  'src/components/ResourcesPanel.tsx: to={resource.link.to}',
];

/*
 * Sítio é toda ABERTURA de `<Link` e `<Navigate`, e toda chamada `navigate(`. Contar a
 * abertura, e não "abertura com to=", é de propósito: um atributo com `=>` antes do `to=`
 * esconderia o destino de um regex que procura o `to=` dentro da tag.
 */
const SITIOS = [/<Link\b/g, /<Navigate\b/g, /\bnavigate\(/g];
const CAPTURAS = [LINK_CAPTURADO, NAVIGATE_CAPTURADO, CHAMADA_CAPTURADA];

const naoCapturadosEm = (fonte: string, arquivo: string) => {
  const saida: string[] = [];
  SITIOS.forEach((sitio, i) => {
    const capturados = new Set([...fonte.matchAll(CAPTURAS[i])].map((m) => m.index));
    for (const m of fonte.matchAll(sitio)) {
      if (capturados.has(m.index)) continue;
      const trecho = fonte.slice(m.index, m.index + 300);
      const destino = trecho.match(/\sto=(\{[^}]*\}|"[^"]*")/)?.[0].trim() ?? trecho.match(/navigate\([^)]*\)/)?.[0];
      saida.push(`${arquivo}: ${destino ?? trecho.split('\n')[0]}`);
    }
  });
  return saida;
};

/*
 * E o apelido. `const ir = useNavigate(); ir(destino)` escaparia da contagem de `navigate(`.
 * Hoje os seis `useNavigate()` são atribuídos a `navigate`; um que não for reprova.
 */
const apelidosDeNavigate = (fonte: string, arquivo: string) =>
  [...fonte.matchAll(/(\S+\s+)?(\S+)\s*=\s*useNavigate\(\)/g)]
    .filter((m) => m[2] !== 'navigate')
    .map((m) => `${arquivo}: ${m[0].trim()}`);

const fonteApp = fs.readFileSync(path.join(RAIZ, 'src/App.tsx'), 'utf8');
const rotas = rotasDeclaradas(fonteApp);
const fontes = arquivos(path.join(RAIZ, 'src')).map((f) => ({
  arquivo: relativo(f),
  fonte: fs.readFileSync(f, 'utf8'),
}));
const destinos = fontes.flatMap(({ arquivo, fonte }) =>
  destinosDe(fonte).map((alvo) => ({ arquivo, alvo })),
);

describe('grafo de navegação', () => {
  it('a varredura enxerga: encontra rotas e destinos de verdade', () => {
    // Sem isto, um regex quebrado devolveria listas vazias e todos os testes abaixo passariam.
    expect(rotas.length).toBeGreaterThan(10);
    expect(rotas).toContain('/alunos/:id');
    expect(destinos.length).toBeGreaterThan(10);
    expect(destinos.map((d) => d.alvo)).toContain('/alunos/novo');
    // E as três formas de navegar aparecem, não só a primeira.
    expect(destinos.map((d) => d.alvo)).toContain('/gestao?tab=relatorios');
    expect(destinos.map((d) => d.alvo)).toContain('/observacoes');
  });

  it('todo destino de Link, Navigate e navigate resolve para uma rota declarada', () => {
    const orfaos = destinos.filter((d) => !resolve(d.alvo, rotas));
    expect(orfaos.map((o) => `${o.alvo} (${o.arquivo})`)).toEqual([]);
  });

  it('CONTROLE: um destino inventado é acusado como órfão', () => {
    // A asserção que faltou quando planejei a etapa. Prova que o "[]" acima é ausência de
    // órfão, e não cegueira da varredura.
    expect(resolve('/rota-que-nao-existe', rotas)).toBe(false);
    expect(resolve('/alunos/novo/demais/fundo', rotas)).toBe(false);
    // E que ela reconhece o que deve reconhecer:
    expect(resolve('/alunos/novo', rotas)).toBe(true);
    expect(resolve('/alunos/${student.id}', rotas)).toBe(true);
  });

  it('CONTROLE: destino literal não se apoia numa rota de parâmetro', () => {
    // Achado por mutação: com a regra frouxa, apagar <Route path="/alunos/novo"> de App.tsx
    // não reprovava, porque o destino passava a casar /alunos/:id. Aqui, sem a rota estática,
    // o destino literal fica órfão.
    const semAEstatica = rotas.filter((r) => r !== '/alunos/novo');
    expect(resolve('/alunos/novo', semAEstatica)).toBe(false);
    // E o destino de parâmetro continua casando a rota de parâmetro:
    expect(resolve('/alunos/${student.id}', semAEstatica)).toBe(true);
  });

  it('a rota curinga não serve de resolução para nada', () => {
    // Se `*` contasse, todo destino quebrado passaria por estar "declarado".
    expect(rotas).toContain('*');
    expect(resolve('/qualquer-coisa', rotas)).toBe(false);
  });
});

describe('sítios × capturados: nenhum destino fora do alcance da varredura', () => {
  it('todo destino não literal está na lista, pelo nome', () => {
    const naoCapturados = fontes.flatMap(({ arquivo, fonte }) => naoCapturadosEm(fonte, arquivo));
    expect([...naoCapturados].sort()).toEqual([...NAO_LITERAIS_CONHECIDOS].sort());
  });

  it('todo useNavigate() é atribuído a `navigate`', () => {
    const apelidos = fontes.flatMap(({ arquivo, fonte }) => apelidosDeNavigate(fonte, arquivo));
    expect(apelidos).toEqual([]);
  });

  it('CONTROLE: o medidor acusa destino não literal e apelido, nas três formas', () => {
    // O medidor desta asserção nasceu cego na Parte B da Etapa 8: o regex exigia dois espaços
    // onde havia um e devolveu "2 sítios, 13 capturados". Este controle é o que dizia isso.
    const fonte = [
      '<Link to={destinoVindoDeFora}>a</Link>',
      '<Link className="x" onClick={() => marcar()} to="/alunos">b</Link>',
      '<Navigate to={outroDestino} replace />',
      'navigate(destinoDoUsuario);',
      'navigate(`/alunos/${id}`);',
    ].join('\n');
    expect(naoCapturadosEm(fonte, 'x.tsx')).toEqual([
      'x.tsx: to={destinoVindoDeFora}',
      // O `=>` antes do `to=` esconde o destino do regex de captura, mas não da contagem.
      'x.tsx: to="/alunos"',
      'x.tsx: to={outroDestino}',
      'x.tsx: navigate(destinoDoUsuario)',
    ]);
    expect(apelidosDeNavigate('const ir = useNavigate();', 'x.tsx')).toEqual([
      'x.tsx: const ir = useNavigate()',
    ]);
    expect(apelidosDeNavigate('const navigate = useNavigate();', 'x.tsx')).toEqual([]);
  });
});
