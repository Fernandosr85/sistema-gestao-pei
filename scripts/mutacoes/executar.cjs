const fs = require('fs');
const path = require('path');
const { rodar } = require('./comum.cjs');

/**
 * Roda os lotes de mutação.
 *
 *   node scripts/mutacoes/executar.cjs                 todos os lotes
 *   node scripts/mutacoes/executar.cjs 09-ver-pei      um lote, pelo nome do arquivo
 *
 * Cada lote planta seus defeitos um a um no código de produção e exige que `npm test`
 * reprove. Leva cerca de 20 segundos por mutação — a suíte inteira roda a cada uma.
 */
const lotes = fs
  .readdirSync(__dirname)
  .filter((nome) => /^\d{2}-.*\.cjs$/.test(nome))
  .sort();

const filtro = process.argv[2];
const escolhidos = filtro ? lotes.filter((nome) => nome.includes(filtro)) : lotes;

if (escolhidos.length === 0) {
  console.log(`Nenhum lote casa "${filtro}". Disponíveis:\n  ${lotes.join('\n  ')}`);
  process.exit(1);
}

let falhas = 0;
let mutacoes = 0;
for (const nome of escolhidos) {
  const { MUTACOES, TITULO } = require(path.join(__dirname, nome));
  mutacoes += MUTACOES.length;
  falhas += rodar(MUTACOES, TITULO);
}

console.log('\n==============================');
console.log(`${mutacoes} mutações em ${escolhidos.length} lote(s)`);
console.log(falhas === 0 ? 'todas acusadas' : `${falhas} NÃO acusada(s)`);
process.exit(falhas === 0 ? 0 : 1);
