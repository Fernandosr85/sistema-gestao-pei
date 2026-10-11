const { rodar } = require('./comum.cjs');

/*
 * Etapa 11 — o verificador de vocabulário — 6 mutações.
 *
 * Aqui o "código de produção" é o próprio verificador: ele é o que o teste
 * `src/test/vocabulario.test.ts` diz verificar. Cada mutação é um defeito que já aconteceu nesta
 * série, ou que a declaração do script existe para impedir.
 */

const SCRIPT = 'scripts/verifica-vocabulario.mjs';

const MUTACOES = [
  {
    // O defeito medido num instrumento desta série: com `i`, `\bIA\b` casa o verbo "ia".
    nome: 'o padrão do acrônimo IA ganha `i` e passa a casar o verbo "ia"',
    arq: SCRIPT,
    de: "  { nome: 'IA (acrônimo)', re: /\\bIA\\b/g },",
    para: "  { nome: 'IA (acrônimo)', re: /\\bIA\\b/gi },",
  },
  {
    // O defeito da Etapa 10g: `intelig` sem `-i` não casa "Inteligentes".
    nome: 'o padrão de inteligência perde o `i` e deixa de casar "Inteligentes"',
    arq: SCRIPT,
    de: "  { nome: 'inteligência', re: /\\bintelig/gi },",
    para: "  { nome: 'inteligência', re: /\\bintelig/g },",
  },
  {
    // O defeito da própria mensagem do autor: `preditivo` não casa `preditiva`.
    nome: 'o padrão de predição vira a forma flexionada e perde as outras',
    arq: SCRIPT,
    de: "  { nome: 'predição', re: /\\bpredi/gi },",
    para: "  { nome: 'predição', re: /\\bpreditivo/gi },",
  },
  {
    nome: 'o escopo deixa de varrer `src/`, e as entradas da linha de base ficam órfãs',
    arq: SCRIPT,
    de: "  { tipo: 'arvore', caminho: 'src', extensoes: ['.ts', '.tsx', '.css'] },",
    para: "  { tipo: 'arvore', caminho: 'src', extensoes: ['.nao-existe'] },",
  },
  {
    nome: 'o script para de ler arquivo nenhum e ainda sai 0',
    arq: SCRIPT,
    de: '  return achados.sort();',
    para: '  return [];',
  },
  {
    nome: 'a exigência de razão na linha de base sai, e entrada sem razão passa',
    arq: SCRIPT,
    de: "    if (!e.razao || !String(e.razao).trim()) {",
    para: "    if (false) {",
  },
];

module.exports = { MUTACOES, TITULO: 'Etapa 11 — o verificador de vocabulário' };

if (require.main === module) {
  process.exit(rodar(MUTACOES, 'Etapa 11 — o verificador de vocabulário') === 0 ? 0 : 1);
}
