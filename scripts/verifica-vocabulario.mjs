#!/usr/bin/env node
/**
 * Verificação executável da invariante 2 do CLAUDE.md, na parte que é enumerável:
 * **nenhuma palavra de inferência estatística descrevendo dado fixo**.
 *
 * O que o script pergunta NÃO é "existe ocorrência?", e sim "existe ocorrência NOVA?".
 * O repositório contém esse vocabulário legitimamente — negação ("nenhum modelo preditivo é
 * executado"), citação da própria regra, comentário explicando o que saiu da tela. Um
 * verificador cujo estado correto fosse "zero" exigiria classificar prosa dentro de um grep.
 * Daí a linha de base: `scripts/vocabulario-permitido.json`, uma entrada por ocorrência, cada
 * uma com a razão escrita. Ocorrência fora dela reprova.
 *
 * ESCOPO — DECLARADO, porque o escopo de uma varredura é parte do resultado dela (achado 20):
 *
 *   VARRE   README.md
 *           docs/**\/*.md
 *           index.html
 *           src/**\/*.{ts,tsx,css}        (menos src/test/)
 *
 *   FORA    BACKLOG-CLAUDE-CODE.md, CLAUDE.md, scripts/, src/test/, node_modules/, dist/
 *
 * A razão de cada exclusão é de CONTEÚDO, não de conveniência: esses arquivos existem para
 * **discutir** o vocabulário. O CLAUDE.md enuncia a invariante e cita as palavras proibidas; o
 * BACKLOG registra cada ocorrência histórica entre aspas, com o "falso" ao lado; `scripts/`
 * guarda este arquivo, que precisa escrever os padrões para poder procurá-los; `src/test/` guarda
 * o teste deste script, cujas fixtures são as próprias palavras. Varrê-los produziria reprovação
 * garantida em texto que está certo — e verificador que reprova o certo treina a pessoa a
 * ignorá-lo.
 *
 * VOCABULÁRIO — cada padrão carrega as suas flags, e **as flags viajam com o padrão**. A RegExp
 * é construída uma vez, aqui, com `g` incluído na declaração; o código nunca passa `.source`
 * adiante para recompilar, porque recompilar com flags default sobrepõe a declaração. Esse bug
 * foi medido num instrumento desta série: um harness que reconstruía cada padrão com 'giu' fez
 * `\bIA\b` casar o verbo "ia" em três linhas.
 *
 *   /\bintelig/gi                              inteligência, inteligencia, inteligente,
 *                                              Inteligentes (o `-i` é o que pega a maiúscula, e
 *                                              a falta dele deixou passar "Relatórios
 *                                              Inteligentes" por nove etapas)
 *   /\bpredi/gi                                preditivo, preditiva, preditivos, preditivas,
 *                                              predição, predições, predicao, predizer, prediz
 *   /\bIA\b/g                                  o acrônimo. SEM `i`, de propósito: com `i` casa o
 *                                              verbo "ia" ("o trecho lido ia da…")
 *   /confian[cç]a\s+estat[íi]stic/gi           com e sem acento, nas duas palavras
 *   /machine\s+learning|aprendizado\s+de\s+m[aá]quina/gi   com e sem acento
 *
 * FORA DO VOCABULÁRIO, e a decisão é parte da medida:
 *
 *   - `\bmodelos?\b`: 53 ocorrências medidas no repositório, quase todas o sentido de domínio —
 *     "o modelo `Student`", "modelo de dados", "o que o modelo não tem saiu da tela". Termo que
 *     gera falso positivo garantido treina a pessoa a ignorar o script.
 *   - `acurácia`, `eficácia`, `precisão`: não estão na invariante 2, e "precisão" é vocabulário
 *     das próprias regras de verificação deste repositório.
 *
 * FALSOS POSITIVOS LATENTES de `\bpredi`, medidos hoje em 0 ocorrências e reais em português:
 * `predisposição`, `predisposto`, `predispõe`, `predicado`, `predileção`. Se algum aparecer, entra
 * na linha de base com a razão — o padrão não se silencia.
 *
 * SAÍDA: sempre com escopo. "N arquivos varridos, M ocorrências, todas na linha de base" — zero
 * sem escopo não é resultado.
 *
 * Uso:  node scripts/verifica-vocabulario.mjs [--raiz <dir>] [--base <arquivo>] [--json]
 *       --raiz e --base servem ao teste, que aponta o script para uma fixture fora do
 *       repositório e para uma linha de base própria. Sem eles, varre este repositório com
 *       scripts/vocabulario-permitido.json.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PADROES = [
  { nome: 'inteligência', re: /\bintelig/gi },
  { nome: 'predição', re: /\bpredi/gi },
  { nome: 'IA (acrônimo)', re: /\bIA\b/g },
  { nome: 'confiança estatística', re: /confian[cç]a\s+estat[íi]stic/gi },
  { nome: 'aprendizado de máquina', re: /machine\s+learning|aprendizado\s+de\s+m[aá]quina/gi },
];

const INCLUI = [
  { tipo: 'arquivo', caminho: 'README.md' },
  { tipo: 'arquivo', caminho: 'index.html' },
  { tipo: 'arvore', caminho: 'docs', extensoes: ['.md'] },
  { tipo: 'arvore', caminho: 'src', extensoes: ['.ts', '.tsx', '.css'] },
];
const EXCLUI_PREFIXO = ['src/test', 'node_modules', 'dist'];

const normaliza = (texto) => texto.toLowerCase().replace(/\s+/g, ' ').trim();

const arquivosDoEscopo = (raiz) => {
  const achados = [];
  const andar = (dir, extensoes) => {
    for (const nome of readdirSync(dir)) {
      const cheio = join(dir, nome);
      const rel = relative(raiz, cheio).split(sep).join('/');
      if (EXCLUI_PREFIXO.some((p) => rel === p || rel.startsWith(`${p}/`))) continue;
      if (statSync(cheio).isDirectory()) andar(cheio, extensoes);
      else if (extensoes.some((e) => nome.endsWith(e))) achados.push(rel);
    }
  };
  for (const item of INCLUI) {
    const cheio = join(raiz, item.caminho);
    if (!existsSync(cheio)) continue;
    if (item.tipo === 'arquivo') achados.push(item.caminho);
    else andar(cheio, item.extensoes);
  }
  return achados.sort();
};

const ocorrenciasEm = (raiz, rel) => {
  const linhas = readFileSync(join(raiz, rel), 'utf8').split('\n');
  const achados = [];
  linhas.forEach((linha, i) => {
    for (const padrao of PADROES) {
      padrao.re.lastIndex = 0;
      const casamentos = linha.match(padrao.re);
      if (!casamentos) continue;
      achados.push({
        arquivo: rel,
        linha: i + 1,
        padrao: padrao.nome,
        vezes: casamentos.length,
        texto: linha.trim(),
        normalizada: normaliza(linha),
      });
    }
  });
  return achados;
};

const carregaLinhaDeBase = (caminho) => {
  if (!existsSync(caminho)) return { entradas: [], erros: [`linha de base não encontrada: ${caminho}`] };
  let bruto;
  try {
    bruto = JSON.parse(readFileSync(caminho, 'utf8'));
  } catch (erro) {
    return { entradas: [], erros: [`linha de base ilegível: ${erro.message}`] };
  }
  const erros = [];
  const entradas = bruto.map((e, i) => {
    if (!e.razao || !String(e.razao).trim()) {
      erros.push(`entrada ${i} (${e.arquivo}: "${String(e.trecho).slice(0, 40)}…") sem razao — afirmação sem a regra que a produz`);
    }
    return { ...e, trechoNormalizado: normaliza(String(e.trecho ?? '')), encontradas: 0 };
  });
  return { entradas, erros };
};

const principal = () => {
  const argv = process.argv.slice(2);
  const aqui = fileURLToPath(new URL('.', import.meta.url));
  const raizPadrao = join(aqui, '..');
  const iRaiz = argv.indexOf('--raiz');
  const raiz = iRaiz >= 0 ? argv[iRaiz + 1] : raizPadrao;
  const comoJson = argv.includes('--json');

  const iBase = argv.indexOf('--base');
  const caminhoBase = iBase >= 0 ? argv[iBase + 1] : join(raizPadrao, 'scripts', 'vocabulario-permitido.json');
  const base = carregaLinhaDeBase(caminhoBase);
  const arquivos = arquivosDoEscopo(raiz);
  const ocorrencias = arquivos.flatMap((rel) => ocorrenciasEm(raiz, rel));

  const problemas = [...base.erros];
  const novas = [];

  for (const o of ocorrencias) {
    const entrada = base.entradas.find(
      (e) => e.arquivo === o.arquivo && o.normalizada.includes(e.trechoNormalizado),
    );
    if (!entrada) novas.push(o);
    else entrada.encontradas += o.vezes;
  }

  for (const o of novas) {
    problemas.push(`ocorrência nova [${o.padrao}] ${o.arquivo}:${o.linha}: ${o.texto.slice(0, 120)}`);
  }
  for (const e of base.entradas) {
    if (e.encontradas === 0) {
      problemas.push(`entrada obsoleta: ${e.arquivo} "${String(e.trecho).slice(0, 60)}" não foi encontrada`);
    } else if (e.encontradas > e.ocorrencias) {
      problemas.push(`contagem maior que a declarada: ${e.arquivo} "${String(e.trecho).slice(0, 60)}" — declaradas ${e.ocorrencias}, encontradas ${e.encontradas}`);
    } else if (e.encontradas < e.ocorrencias) {
      problemas.push(`contagem menor que a declarada (entrada desatualizada): ${e.arquivo} "${String(e.trecho).slice(0, 60)}" — declaradas ${e.ocorrencias}, encontradas ${e.encontradas}`);
    }
  }

  const resumo = {
    raiz: relative(process.cwd(), raiz) || '.',
    arquivos: arquivos.length,
    ocorrencias: ocorrencias.reduce((s, o) => s + o.vezes, 0),
    entradasNaBase: base.entradas.length,
    problemas,
  };

  if (comoJson) {
    console.log(JSON.stringify(resumo, null, 2));
  } else if (problemas.length === 0) {
    console.log(`${resumo.arquivos} arquivos varridos, ${resumo.ocorrencias} ocorrências, todas na linha de base (${resumo.entradasNaBase} entradas).`);
  } else {
    console.error(`${resumo.arquivos} arquivos varridos, ${resumo.ocorrencias} ocorrências, ${problemas.length} problema(s):`);
    for (const p of problemas) console.error(`  - ${p}`);
  }
  process.exit(problemas.length === 0 ? 0 : 1);
};

principal();
