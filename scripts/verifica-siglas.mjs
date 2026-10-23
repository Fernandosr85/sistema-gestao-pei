#!/usr/bin/env node
/**
 * Varredor de siglas: quantos arquivos usam cada sigla e quantos trazem a forma extensa.
 *
 * POR QUE ESTE ARQUIVO EXISTE. O inventário de acessibilidade cognitiva (Pendência 12 do
 * backlog) publica números de sigla — "PEI aparece em 46 arquivos e 3 trazem a forma extensa".
 * A primeira versão desse varredor rodou no diretório temporário de uma sessão e foi embora com
 * ela. Número que só existiu lá não é medida: é a mesma classe das 27 mutações perdidas da
 * Etapa 7 (Pendência 4). Declarar o limite não substitui cumprir a regra quando cumprir custa
 * um arquivo.
 *
 * ESCOPO — DECLARADO, porque o escopo de uma varredura é parte do resultado dela (achado 20):
 *
 *   VARRE   src/ **\/*.{ts,tsx}
 *   FORA    src/test/ (fixtures citam as siglas de propósito)
 *           src/components/ui/ (biblioteca de terceiros, não é texto deste produto)
 *           qualquer coisa fora de src/
 *
 * A UNIDADE É ARQUIVO, NÃO OCORRÊNCIA, e isso precisa estar dito porque os dois números
 * existem e são diferentes: no escopo acima `PEI` está em 46 ARQUIVOS e tem 152 OCORRÊNCIAS.
 * Comparar um com o outro é a comparação entre listas de unidades diferentes que já apareceu
 * três vezes neste repositório (achados 18, 27 e a releitura da Etapa 18).
 *
 * E CONTAGEM POR ARQUIVO NÃO É CONTAGEM POR TELA: a forma extensa estar no mesmo arquivo que a
 * sigla não garante que ela apareça junto da sigla na tela, nem o contrário. O que este script
 * mede é um indício barato; o que decide é olhar a tela.
 *
 * OS CONTROLES, E O QUE CADA UM TRAVA. Um varredor quebrado devolve exatamente o que um
 * resultado negativo devolveria — na primeira versão deste, uma barra invertida comida pelo
 * shell fez `\b` virar backspace e TODAS as siglas devolveram zero. Zero plausível e falso.
 * Por isso o script reprova sozinho se:
 *
 *   1. uma sigla que não existe no código devolver qualquer coisa diferente de 0;
 *   2. `PEI` devolver número diferente do esperado declarado abaixo;
 *   3. a fronteira de palavra não se comportar nos três casos plantados — `comPEI` NÃO conta,
 *      `PEIzinho` NÃO conta, `o PEI vigente` conta.
 *
 * O controle 3 não é teoria: `grep -rlwF "PEI" src --include=*.tsx` (GNU grep 3.0) CONTA
 * `comPEI:` como palavra inteira. Medido com controle plantado: `grep -wF` devolve 1 para
 * "comPEI: x", enquanto `grep -w` e `grep -wE` devolvem 0, e os três rejeitam "PEIzinho". Foi
 * essa diferença que produziu 36 onde o certo era 35.
 *
 * AS OUTRAS SIGLAS têm linha de base declarada, mas a diferença nelas é RELATADA, não reprova:
 * elas mudam quando a interface muda, e um verificador que reprova a cada texto novo treina a
 * pessoa a ignorá-lo. Os três controles acima é que existem para reprovar.
 *
 * Uso:  node scripts/verifica-siglas.mjs [--json]
 * Saída: 0 se os controles passam, 1 se algum falha.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/** Sigla, forma extensa aceita, e a linha de base medida em 23/10/2026. */
const SIGLAS = [
  { sigla: 'PEI', extenso: /Plano(\s+de)?\s+Ensino\s+Individualizado|Plano\s+Educacional\s+Individualizado/i, base: { arquivos: 46, comExtenso: 3 } },
  { sigla: 'AEE', extenso: /Atendimento\s+Educacional\s+Especializado/i, base: { arquivos: 5, comExtenso: 2 } },
  { sigla: 'CID', extenso: /Classifica[çc][ãa]o\s+Internacional\s+de\s+Doen[çc]as/i, base: { arquivos: 1, comExtenso: 0 } },
  { sigla: 'TEA', extenso: /Transtorno\s+do\s+Espectro\s+Autista/i, base: { arquivos: 15, comExtenso: 1 } },
  { sigla: 'TDAH', extenso: /Transtorno\s+do\s+D[ée]ficit\s+de\s+Aten[çc][ãa]o/i, base: { arquivos: 8, comExtenso: 0 } },
  { sigla: 'BNCC', extenso: /Base\s+Nacional\s+Comum\s+Curricular/i, base: { arquivos: 1, comExtenso: 1 } },
  { sigla: 'LDB', extenso: /Lei\s+de\s+Diretrizes\s+e\s+Bases/i, base: { arquivos: 2, comExtenso: 1 } },
  { sigla: 'PDI', extenso: /Plano\s+de\s+Desenvolvimento\s+Individual/i, base: { arquivos: 0, comExtenso: 0 } },
];

/** Sigla que não existe no código. Se ela aparecer, o varredor está casando o que não devia. */
const CONTROLE_NEGATIVO = 'ZZQX';

/** Casos plantados da fronteira de palavra: [texto, deve contar?]. */
const CONTROLES_DE_FRONTEIRA = [
  ['comPEI: x', false],
  ['PEIzinho', false],
  ['o PEI vigente', true],
  ['usar PEI.', true],
];

const FORA = [join('src', 'test'), join('src', 'components', 'ui')];

const palavra = (sigla) => new RegExp('\\b' + sigla + '\\b');

const arquivosDoEscopo = (raiz) => {
  const achados = [];
  const anda = (dir) => {
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      const caminho = join(dir, entrada.name);
      if (entrada.isDirectory()) {
        if (!FORA.some((f) => caminho === f || caminho.startsWith(f + sep))) anda(caminho);
      } else if (/\.tsx?$/.test(entrada.name)) {
        achados.push(caminho);
      }
    }
  };
  anda(raiz);
  return achados.sort();
};

const principal = () => {
  const comoJson = process.argv.includes('--json');
  const arquivos = arquivosDoEscopo('src');
  const conteudo = new Map(arquivos.map((f) => [f, readFileSync(f, 'utf8')]));

  const linhas = SIGLAS.map(({ sigla, extenso, base }) => {
    const re = palavra(sigla);
    const usam = arquivos.filter((f) => re.test(conteudo.get(f)));
    const comExtenso = usam.filter((f) => extenso.test(conteudo.get(f)));
    const reGlobal = new RegExp('\\b' + sigla + '\\b', 'g');
    const ocorrencias = usam.reduce((s, f) => s + (conteudo.get(f).match(reGlobal) || []).length, 0);
    return {
      sigla,
      arquivos: usam.length,
      ocorrencias,
      comExtenso: comExtenso.length,
      onde: comExtenso.map((f) => relative('src', f).split(sep).join('/')),
      base,
      mudou: usam.length !== base.arquivos || comExtenso.length !== base.comExtenso,
    };
  });

  const falhas = [];

  // Controle 1: sigla inexistente.
  const reControle = palavra(CONTROLE_NEGATIVO);
  const falsos = arquivos.filter((f) => reControle.test(conteudo.get(f)));
  if (falsos.length !== 0) {
    falhas.push(`controle negativo: "${CONTROLE_NEGATIVO}" não existe no código e casou em ${falsos.length} arquivo(s)`);
  }

  // Controle 2: PEI no valor esperado.
  const pei = linhas.find((l) => l.sigla === 'PEI');
  if (pei.arquivos !== pei.base.arquivos) {
    falhas.push(
      `controle positivo: PEI deveria estar em ${pei.base.arquivos} arquivos e está em ${pei.arquivos}. ` +
        'Se a interface mudou, atualize a linha de base de PEI neste arquivo e diga no backlog o que mudou; ' +
        'se não mudou nada, o varredor está quebrado.',
    );
  }

  // Controle 3: fronteira de palavra, nos casos plantados.
  for (const [texto, deveContar] of CONTROLES_DE_FRONTEIRA) {
    const contou = palavra('PEI').test(texto);
    if (contou !== deveContar) {
      falhas.push(`controle de fronteira: "${texto}" ${contou ? 'contou' : 'não contou'} e deveria ${deveContar ? 'contar' : 'não contar'}`);
    }
  }

  const resumo = {
    arquivosVarridos: arquivos.length,
    escopoFora: FORA.map((f) => f.split(sep).join('/')),
    unidade: 'arquivos (a coluna de ocorrências é outra unidade e está ao lado)',
    siglas: linhas.map(({ base, mudou, ...resto }) => ({ ...resto, base, mudou })),
    falhas,
  };

  if (comoJson) {
    console.log(JSON.stringify(resumo, null, 2));
  } else {
    console.log(`${arquivos.length} arquivos .ts/.tsx varridos (fora: ${resumo.escopoFora.join(', ')}). Unidade: ARQUIVOS.`);
    console.log('sigla | arquivos | ocorrências | com forma extensa | linha de base');
    for (const l of linhas) {
      const marca = l.mudou ? '  <- MUDOU' : '';
      console.log(
        `${l.sigla.padEnd(5)} | ${String(l.arquivos).padStart(8)} | ${String(l.ocorrencias).padStart(11)} | ${String(l.comExtenso).padStart(17)} | ${l.base.arquivos}/${l.base.comExtenso}${marca}`,
      );
    }
    const mudaram = linhas.filter((l) => l.mudou && l.sigla !== 'PEI');
    if (mudaram.length) {
      console.log(`\n${mudaram.length} sigla(s) fora da linha de base — relatado, não reprova. Atualize a base e registre o motivo.`);
    }
    if (falhas.length === 0) {
      console.log('\nControles: sigla inexistente 0, PEI no valor esperado, fronteira de palavra nos 4 casos plantados. OK.');
    } else {
      console.error(`\n${falhas.length} controle(s) falharam:`);
      for (const f of falhas) console.error(`  - ${f}`);
    }
  }

  process.exit(falhas.length === 0 ? 0 : 1);
};

principal();
