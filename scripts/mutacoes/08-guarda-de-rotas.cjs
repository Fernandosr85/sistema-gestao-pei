const { rodar } = require('./comum.cjs');

/* Etapa 8 — a guarda de navegação (sítios × capturados) — 3 mutações. Era `mutar8.cjs` no scratchpad da sessão. */
// Só o teste de rotas: a pergunta é se a asserção de sítios × capturados pega, não se alguma
// outra coisa pega. O destino plantado tem o MESMO valor em tempo de execução, então nenhum
// outro teste teria motivo para reprovar — só a forma sintática muda para uma que a
// varredura de captura não enxerga.

const MUTACOES = [
  {
    nome: 'um quarto destino não literal: to={variável} no StudentCard (Etapa 8)',
    arq: 'src/components/StudentCard.tsx',
    de: '          <Link to={`/alunos/${student.id}`}>',
    para: "          <Link to={'/alunos/' + student.id}>",
  },
  {
    nome: 'um redirecionamento aponta para rota que não existe (<Navigate>, antes fora da varredura)',
    arq: 'src/App.tsx',
    de: '<Navigate to="/gestao?tab=relatorios" replace />',
    para: '<Navigate to="/gestao-antiga?tab=relatorios" replace />',
  },
  {
    nome: 'useNavigate() atribuído a um apelido: as chamadas escapariam da contagem',
    arq: 'src/components/QuickActions.tsx',
    de: '  const navigate = useNavigate();',
    para: '  const ir = useNavigate();\n  const navigate = ir;',
  },
];

module.exports = { MUTACOES, TITULO: "Etapa 8 — a guarda de navegação (sítios × capturados)" };

if (require.main === module) {
  process.exit(rodar(MUTACOES, "Etapa 8 — a guarda de navegação (sítios × capturados)") === 0 ? 0 : 1);
}
