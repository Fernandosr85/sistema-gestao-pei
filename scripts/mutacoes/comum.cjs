const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/** A raiz do repositório, relativa a este arquivo: o script roda de qualquer lugar. */
const RAIZ = path.resolve(__dirname, '..', '..');

/**
 * Executa um lote de mutações.
 *
 * Cada mutação é um defeito plantado no código de PRODUÇÃO. A suíte tem de **reprovar**; se
 * passar, o teste que diz pegar aquele defeito não pega, e é o teste que está errado.
 *
 * A ASSERÇÃO DE CASAMENTO ÚNICO é a parte que não pode sair: se a substituição não casa
 * exatamente uma vez, a quebra nunca foi plantada, e um verde aí significaria "nada foi
 * alterado", não "a suíte não pega". Essa confusão já custou resultados falsos seis vezes
 * nesta série (achado 11 do BACKLOG).
 *
 * O arquivo volta ao original mesmo quando a suíte reprova — é o `finally`.
 */
const rodar = (lote, nomeDoLote) => {
  let falhas = 0;
  console.log(`\n== ${nomeDoLote} — ${lote.length} mutações ==`);

  for (const m of lote) {
    const caminho = path.join(RAIZ, m.arq);
    const original = fs.readFileSync(caminho, 'utf8');

    /*
     * FIM DE LINHA NÃO ENTRA NA ÂNCORA. O repositório tem `core.autocrlf=true`: o conteúdo
     * versionado é LF e a cópia de trabalho no Windows é CRLF, arquivo a arquivo. Uma âncora
     * escrita com `\n` casava zero vezes num arquivo CRLF, e isso já custou uma mutação lida
     * como "não plantada" (achado 11). As âncoras são escritas em LF; aqui o arquivo é
     * normalizado para casar, e devolvido com o fim de linha que tinha.
     */
    const eraCRLF = original.includes('\r\n');
    const normalizado = eraCRLF ? original.replace(/\r\n/g, '\n') : original;
    const paraDisco = (texto) => (eraCRLF ? texto.replace(/\n/g, '\r\n') : texto);
    const ocorrencias = normalizado.split(m.de).length - 1;

    if (ocorrencias !== 1) {
      console.log(`ABORTA  ${m.nome}  -> casou ${ocorrencias} vezes, mutação NÃO plantada`);
      falhas += 1;
      continue;
    }

    let reprovou = false;
    let resumo = '';
    try {
      fs.writeFileSync(caminho, paraDisco(normalizado.split(m.de).join(m.para)));
      try {
        execSync('npm test', { cwd: RAIZ, stdio: 'pipe' });
      } catch (erro) {
        reprovou = true;
        const saida = String(erro.stdout).replace(/\x1b\[[0-9;]*m/g, '');
        resumo = (saida.match(/Tests\s+.*\(\d+\)/) || [''])[0].trim();
      }
    } finally {
      fs.writeFileSync(caminho, original);
    }

    console.log(`${reprovou ? 'OK     ' : 'PASSOU '} ${m.nome}${reprovou ? '   ' + resumo : '   <-- A SUÍTE NÃO PEGOU'}`);
    if (!reprovou) falhas += 1;
  }

  return falhas;
};

module.exports = { rodar, RAIZ };
