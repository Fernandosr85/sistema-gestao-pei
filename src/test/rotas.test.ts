import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/*
 * Todo destino de navegação tem de resolver para uma rota declarada em App.tsx.
 *
 * Este teste lê o código-fonte em vez de renderizar: o destino de um `<Link>` é texto no
 * arquivo, e renderizar a aplicação inteira para descobri-lo custaria muito mais sem cobrir
 * mais. Link quebrado é defeito barulhento, então isto é guarda de regressão, não caça a
 * defeito — hoje são 10 destinos distintos e 0 órfãos.
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

const rotasDeclaradas = (fonteApp: string) =>
  [...fonteApp.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);

const destinosDe = (fonte: string) => {
  const achados: string[] = [];
  for (const m of fonte.matchAll(/<Link\s[^>]*?to=(?:"([^"]+)"|\{`([^`]+)`\})/g)) achados.push(m[1] ?? m[2]);
  for (const m of fonte.matchAll(/navigate\(\s*(?:'([^']+)'|"([^"]+)"|`([^`]+)`)/g)) achados.push(m[1] ?? m[2] ?? m[3]);
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

const fonteApp = fs.readFileSync(path.join(RAIZ, 'src/App.tsx'), 'utf8');
const rotas = rotasDeclaradas(fonteApp);
const destinos = arquivos(path.join(RAIZ, 'src')).flatMap((f) =>
  destinosDe(fs.readFileSync(f, 'utf8')).map((alvo) => ({ arquivo: path.relative(RAIZ, f), alvo })),
);

describe('grafo de navegação', () => {
  it('a varredura enxerga: encontra rotas e destinos de verdade', () => {
    // Sem isto, um regex quebrado devolveria listas vazias e todos os testes abaixo passariam.
    expect(rotas.length).toBeGreaterThan(10);
    expect(rotas).toContain('/alunos/:id');
    expect(destinos.length).toBeGreaterThan(10);
    expect(destinos.map((d) => d.alvo)).toContain('/alunos/novo');
  });

  it('todo destino de Link e navigate resolve para uma rota declarada', () => {
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
