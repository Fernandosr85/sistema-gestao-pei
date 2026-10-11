import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Teste do verificador de vocabulário (`scripts/verifica-vocabulario.mjs`).
 *
 * As fixtures ficam em `os.tmpdir()`, FORA do repositório, e são removidas em `finally`. O
 * motivo é de método, não de arrumação: o caso 1 varre o repositório inteiro, e fixture que
 * vazasse para dentro dele faria o caso 1 reprovar por causa do caso 2, com uma mensagem que não
 * diria isso. Proteger a fixture por exclusão de caminho seria configuração, e configuração
 * quebra.
 */

// O ambiente de teste é jsdom, onde `import.meta.url` não é uma URL file:// — os caminhos saem do
// diretório de trabalho, que o vitest fixa na raiz do repositório, e o caso 1 assevera que o
// script está lá: cwd errado reprova em voz alta em vez de passar calado.
const RAIZ_REPO = process.cwd();
const SCRIPT = join(RAIZ_REPO, 'scripts', 'verifica-vocabulario.mjs');

type Resumo = {
  raiz: string;
  arquivos: number;
  ocorrencias: number;
  entradasNaBase: number;
  problemas: string[];
};

/** Roda o script e devolve o resumo em JSON, com o código de saída. */
const rodar = (args: string[]): { resumo: Resumo; codigo: number } => {
  try {
    const saida = execFileSync(process.execPath, [SCRIPT, '--json', ...args], { encoding: 'utf8' });
    return { resumo: JSON.parse(saida) as Resumo, codigo: 0 };
  } catch (erro) {
    const e = erro as { status?: number; stdout?: string };
    return { resumo: JSON.parse(e.stdout ?? '{}') as Resumo, codigo: e.status ?? -1 };
  }
};

/** Cria uma fixture fora do repositório, roda o script contra ela e limpa sempre. */
const comFixture = (
  arquivos: Record<string, string>,
  usar: (dir: string, baseVazia: string) => void,
) => {
  const dir = mkdtempSync(join(tmpdir(), 'pei-vocab-'));
  try {
    for (const [rel, conteudo] of Object.entries(arquivos)) {
      const partes = rel.split('/');
      if (partes.length > 1) mkdirSync(join(dir, ...partes.slice(0, -1)), { recursive: true });
      writeFileSync(join(dir, rel), conteudo, 'utf8');
    }
    const baseVazia = join(dir, 'base-vazia.json');
    writeFileSync(baseVazia, '[]', 'utf8');
    usar(dir, baseVazia);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

describe('verificador de vocabulário da invariante 2', () => {
  // Caso 1 — o repositório passa, com o escopo e a linha de base de verdade.
  it('aprova o repositório, e diz quantos arquivos varreu', () => {
    expect(existsSync(SCRIPT), `script não encontrado em ${SCRIPT}`).toBe(true);
    const { resumo, codigo } = rodar([]);
    expect(resumo.problemas).toEqual([]);
    expect(codigo).toBe(0);
    expect(resumo.arquivos).toBeGreaterThan(0);
    expect(resumo.entradasNaBase).toBeGreaterThan(0);
  });

  // Caso 2 — um caso por padrão: se uma flag estiver errada, o teste diz qual padrão falhou.
  const porPadrao: Array<{ padrao: string; conteudo: string; achar: string }> = [
    { padrao: 'inteligência', conteudo: '# Relatórios Inteligentes\n', achar: 'Relatórios Inteligentes' },
    { padrao: 'inteligência', conteudo: '# INTELIGÊNCIA ARTIFICIAL aplicada\n', achar: 'INTELIGÊNCIA ARTIFICIAL' },
    { padrao: 'predição', conteudo: 'Análise Preditiva do aluno\n', achar: 'Análise Preditiva' },
    { padrao: 'predição', conteudo: 'as análise preditivas do trimestre\n', achar: 'análise preditivas' },
    { padrao: 'confiança estatística', conteudo: 'indice com confianca estatistica de 87%\n', achar: 'confianca estatistica' },
    { padrao: 'aprendizado de máquina', conteudo: 'usa Aprendizado de Maquina para prever\n', achar: 'Aprendizado de Maquina' },
  ];

  for (const caso of porPadrao) {
    it(`acha "${caso.achar}" pelo padrão [${caso.padrao}]`, () => {
      comFixture({ 'README.md': caso.conteudo }, (dir, baseVazia) => {
        const { resumo, codigo } = rodar(['--raiz', dir, '--base', baseVazia]);
        expect(codigo).toBe(1);
        expect(resumo.problemas.join('\n')).toContain(`[${caso.padrao}]`);
        expect(resumo.problemas.join('\n')).toContain(caso.achar);
      });
    });
  }

  // Caso 3 — o padrão sensível a caso prova que é sensível a caso. Os dois na mesma fixture: se
  // alguém acrescentar `i` ao padrão, este teste reprova.
  it('casa o acrônimo IA e não casa o verbo "ia"', () => {
    comFixture(
      { 'README.md': 'A tela usa IA para decidir\no trecho lido ia da linha 10 à 20\n' },
      (dir, baseVazia) => {
        const { resumo, codigo } = rodar(['--raiz', dir, '--base', baseVazia]);
        const texto = resumo.problemas.join('\n');
        expect(codigo).toBe(1);
        expect(texto).toContain('IA (acrônimo)');
        expect(texto).toContain('A tela usa IA para decidir');
        expect(texto).not.toContain('o trecho lido ia da linha');
      },
    );
  });

  /*
   * As três regras do comparador, que os quatro casos do plano não cobriam. Estão aqui porque a
   * bateria de mutações mostrou a lacuna: plantar `if (false)` na exigência de razão, ou apagar a
   * checagem de contagem, não reprovava nenhum dos quatro.
   */
  it('reprova entrada da linha de base sem razão', () => {
    comFixture({ 'README.md': 'Análise Preditiva do aluno\n' }, (dir) => {
      const base = join(dir, 'base-sem-razao.json');
      writeFileSync(
        base,
        JSON.stringify([
          { arquivo: 'README.md', trecho: 'Análise Preditiva', ocorrencias: 1, razao: '   ' },
        ]),
        'utf8',
      );
      const { resumo, codigo } = rodar(['--raiz', dir, '--base', base]);
      expect(codigo).toBe(1);
      expect(resumo.problemas.join('\n')).toContain('sem razao');
    });
  });

  it('reprova entrada da linha de base que não existe mais', () => {
    comFixture({ 'README.md': 'texto sem nenhum termo do vocabulário\n' }, (dir) => {
      const base = join(dir, 'base-obsoleta.json');
      writeFileSync(
        base,
        JSON.stringify([
          {
            arquivo: 'README.md',
            trecho: 'Análise Preditiva',
            ocorrencias: 1,
            razao: 'descreve o que já saiu do texto',
          },
        ]),
        'utf8',
      );
      const { resumo, codigo } = rodar(['--raiz', dir, '--base', base]);
      expect(codigo).toBe(1);
      expect(resumo.problemas.join('\n')).toContain('entrada obsoleta');
    });
  });

  it('reprova contagem maior que a declarada', () => {
    comFixture({ 'README.md': 'Análise Preditiva\nAnálise Preditiva de novo\n' }, (dir) => {
      const base = join(dir, 'base-contagem.json');
      writeFileSync(
        base,
        JSON.stringify([
          {
            arquivo: 'README.md',
            trecho: 'Análise Preditiva',
            ocorrencias: 1,
            razao: 'uma ocorrência declarada, duas no arquivo',
          },
        ]),
        'utf8',
      );
      const { resumo, codigo } = rodar(['--raiz', dir, '--base', base]);
      expect(codigo).toBe(1);
      expect(resumo.problemas.join('\n')).toContain('contagem maior que a declarada');
    });
  });

  // Caso 4 — script que não lê nada passa igual a script correto. Este caso separa os dois.
  it('sai 0 num diretório sem ocorrência, e varre mais de zero arquivo no repositório', () => {
    comFixture({ 'README.md': 'Projeção ilustrativa, sem termo proibido.\n' }, (dir, baseVazia) => {
      const vazio = rodar(['--raiz', dir, '--base', baseVazia]);
      expect(vazio.resumo.problemas).toEqual([]);
      expect(vazio.codigo).toBe(0);
      expect(vazio.resumo.arquivos).toBe(1);
    });

    const repo = rodar(['--raiz', RAIZ_REPO]);
    expect(repo.codigo).toBe(0);
    expect(repo.resumo.arquivos).toBeGreaterThan(0);
  });
});
