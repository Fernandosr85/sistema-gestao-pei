const { rodar } = require('./comum.cjs');

/* Etapa 9 — o Modo Apresentação e o foco do slide — 6 mutações. Era `mutar14.cjs` no scratchpad da sessão. */
// Mutações do Modo Apresentação (Etapa 9).

const MUTACOES = [
  {
    nome: 'o número de slides volta a ser constante (12)',
    arq: 'src/components/PresentationModeDialog.tsx',
    de: '  const totalSlides = slides.length;',
    para: '  const totalSlides = 12;',
  },
  {
    nome: 'o nome da região do slide perde o número, que é o que o leitor anuncia',
    arq: 'src/components/PresentationPlayer.tsx',
    de: '            aria-label={`Slide ${currentSlide} de ${totalSlides}: ${slides[currentSlide - 1].titulo}`}',
    para: '            aria-label={slides[currentSlide - 1].titulo}',
  },
  {
    nome: 'os slides de meta passam a usar todas as metas do sistema, não as do plano',
    arq: 'src/components/PresentationModeDialog.tsx',
    de: '    for (const goal of goals) {',
    para: '    for (const goal of state.peiGoals) {',
  },
  {
    nome: 'estudante sem plano volta a ver o botão de iniciar apresentação',
    arq: 'src/components/PresentationModeDialog.tsx',
    de: '        {!pei ? (',
    para: '        {false ? (',
  },
  {
    nome: 'o progresso do slide 2 passa a vir da avaliação, não das metas',
    arq: 'src/components/PresentationModeDialog.tsx',
    de: '              <p className="text-6xl font-bold text-primary">{progresso}%</p>',
    para: '              <p className="text-6xl font-bold text-primary">{ultima ? 60 : progresso}%</p>',
  },
  {
    // Acrescentada na varredura de coerencia: a regressao de foco que a separacao do player
    // introduziu e que nem a suite nem o arreio pegavam antes desta assercao.
    nome: 'o foco deixa de ir para o slide ao abrir a apresentacao',
    arq: 'src/components/PresentationPlayer.tsx',
    de: [
      '        onOpenAutoFocus={(event) => {',
      '          event.preventDefault();',
      '          slideRef.current?.focus();',
      '        }}',
      '',
    ].join('\n'),
    para: '',
  },
];

module.exports = { MUTACOES, TITULO: "Etapa 9 — o Modo Apresentação e o foco do slide" };

if (require.main === module) {
  process.exit(rodar(MUTACOES, "Etapa 9 — o Modo Apresentação e o foco do slide") === 0 ? 0 : 1);
}
