const { rodar } = require('./comum.cjs');

/* Etapa 9 — o nome acessível dos botões de fechar — 2 mutações. Era `mutar12.cjs` no scratchpad da sessão. */
// Mutações do nome acessível dos botões de fechar.

const MUTACOES = [
  {
    nome: 'o fechar do diálogo volta a se chamar "Close"',
    arq: 'src/components/ui/dialog.tsx',
    de: '        <span className="sr-only">Fechar</span>',
    para: '        <span className="sr-only">Close</span>',
  },
  {
    // `ui/toast.tsx` e `ui/dialog.tsx` são CRLF, como o `ui/table.tsx` — a âncora precisa do \r.
    nome: 'o fechar do toast volta a ficar sem nome acessível',
    arq: 'src/components/ui/toast.tsx',
    de: '    aria-label="Fechar notificação"\n',
    para: '',
  },
];

module.exports = { MUTACOES, TITULO: "Etapa 9 — o nome acessível dos botões de fechar" };

if (require.main === module) {
  process.exit(rodar(MUTACOES, "Etapa 9 — o nome acessível dos botões de fechar") === 0 ? 0 : 1);
}
