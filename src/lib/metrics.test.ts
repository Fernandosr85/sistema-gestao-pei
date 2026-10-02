import { describe, expect, it } from 'vitest';
import {
  earnedBadges,
  formatRating,
  isWithinPeriod,
  monthPeriod,
  periodChange,
  previousMonthPeriod,
  previousWeekPeriod,
  studentNameOf,
  studentProgress,
  studentRecordSummary,
  summarizeRatings,
  weekPeriod,
} from './metrics';
import { createSeedState } from '@/store/seed';
import type { DemoState } from '@/types/store';
import type { Badge } from '@/types/resource';

/*
 * Seletores corrigidos na Etapa 4 (`9cbeb7d`, `46ae545`, `6c502da`) e na Etapa 5 (`2c6a428`).
 * Aparecem na tela, então a fotografia de superfície pegaria uma mudança — mas só se alguém a
 * rodar. Aqui eles ficam presos no CI.
 *
 * O fuso está fixo em America/Sao_Paulo pelo vitest.config.ts: os períodos são calculados a
 * partir de uma data de referência local, e em UTC os limites cairiam em outro dia.
 */

const semente = (): DemoState => JSON.parse(JSON.stringify(createSeedState())) as DemoState;

describe('periodChange: sem base anterior, a tela diz "sem base"', () => {
  it('período anterior zerado devolve noBaseline, e não uma porcentagem', () => {
    expect(periodChange(7, 0)).toEqual({ kind: 'noBaseline' });
    // O defeito da Etapa 4 era exibir "+100%" quando não havia com o que comparar.
    expect(periodChange(7, 0)).not.toEqual({ kind: 'change', percent: 100 });
  });

  it('com base, calcula a variação', () => {
    expect(periodChange(12, 10)).toEqual({ kind: 'change', percent: 20 });
    expect(periodChange(8, 10)).toEqual({ kind: 'change', percent: -20 });
    expect(periodChange(10, 10)).toEqual({ kind: 'change', percent: 0 });
  });

  it('zero atual sobre base existente é -100%, não noBaseline', () => {
    // Falsificação: distingue "não há base" de "caiu a zero", que é outra coisa.
    expect(periodChange(0, 4)).toEqual({ kind: 'change', percent: -100 });
    expect(periodChange(0, 4)).not.toEqual({ kind: 'noBaseline' });
  });
});

describe('períodos de semana e mês', () => {
  const referencia = new Date(2025, 10, 24, 21, 30); // segunda, 24/11/2025, 21h30 local

  it('a semana contém o domingo, que a conta antiga perdia', () => {
    const semana = weekPeriod(referencia);
    // O defeito da Etapa 4: a comparação entre semanas perdia o atendimento de domingo.
    expect(isWithinPeriod('2025-11-23', semana)).toBe(true); // domingo
    expect(isWithinPeriod('2025-11-29', semana)).toBe(true); // sábado
    expect(isWithinPeriod('2025-11-22', semana)).toBe(false);
    expect(isWithinPeriod('2025-11-30', semana)).toBe(false);
  });

  it('a semana anterior não invade a atual', () => {
    const atual = weekPeriod(referencia);
    const anterior = previousWeekPeriod(referencia);
    expect(isWithinPeriod('2025-11-16', anterior)).toBe(true);
    expect(isWithinPeriod('2025-11-23', anterior)).toBe(false);
    // Falsificação: os dois períodos não podem ser o mesmo.
    expect(anterior).not.toEqual(atual);
  });

  it('o mês contém o último dia, às 21h30 inclusive', () => {
    const mes = monthPeriod(new Date(2025, 10, 30, 21, 30));
    expect(isWithinPeriod('2025-11-01', mes)).toBe(true);
    expect(isWithinPeriod('2025-11-30', mes)).toBe(true);
    expect(isWithinPeriod('2025-12-01', mes)).toBe(false);
    expect(isWithinPeriod('2025-10-31', mes)).toBe(false);
  });

  it('o mês anterior é outubro quando a referência é novembro', () => {
    const anterior = previousMonthPeriod(referencia);
    expect(isWithinPeriod('2025-10-15', anterior)).toBe(true);
    expect(isWithinPeriod('2025-11-15', anterior)).toBe(false);
  });
});

/*
 * A FONTE DESTE NÚMERO MUDOU NA ETAPA 9: era a média dos objetivos da avaliação mais recente,
 * passou a ser a média das metas do PEI vigente. Mudança de comportamento declarada, não
 * refatoração — e por isso os testes da fonte antiga foram reescritos, não adaptados.
 *
 * Cada caso aqui assevera também o valor que a fonte ANTIGA produziria, pela regra do CLAUDE.md:
 * assim "passou" significa "o número vem do plano", e não "o número existe".
 */
describe('studentProgress: o progresso vem das metas do PEI vigente, ou não existe', () => {
  it('estudante sem PEI vigente devolve undefined, e não zero', () => {
    const s = semente();
    const semPlano = s.students.find((aluno) => !s.peis.some((pei) => pei.studentId === aluno.id));
    expect(semPlano).toBeDefined();
    if (!semPlano) return;
    // Vale a mesma regra da Etapa 4, agora sobre a outra fonte: ausência não é zero.
    expect(studentProgress(s, semPlano.id)).toBeUndefined();
    expect(studentProgress(s, semPlano.id)).not.toBe(0);
  });

  it('com plano vigente, é a média das metas — 50% na semente, e não os 60% da avaliação', () => {
    const s = semente();
    expect(studentProgress(s, '1')).toBe(50);
    /*
     * 60 é a média dos objetivos de `avl-1`, o número que esta função devolvia até a Etapa 9. É
     * ele que não pode voltar sob o rótulo "Progresso nas metas do PEI": os dois estão certos e
     * medem coisas diferentes, e é a troca silenciosa entre eles que esta asserção impede.
     */
    expect(studentProgress(s, '1')).not.toBe(60);
  });

  it('a avaliação deixa de influir: mudá-la não mexe no progresso do plano', () => {
    const s = semente();
    const antes = studentProgress(s, '1');
    s.assessments = s.assessments.map((avaliacao) => ({
      ...avaliacao,
      objectives: avaliacao.objectives.map((objetivo) => ({ ...objetivo, progress: 100 })),
    }));
    expect(studentProgress(s, '1')).toBe(antes);
    expect(studentProgress(s, '1')).not.toBe(100);
  });

  it('plano vigente sem meta devolve undefined, e não zero', () => {
    const s = semente();
    s.peiGoals = [];
    expect(studentProgress(s, '1')).toBeUndefined();
    expect(studentProgress(s, '1')).not.toBe(0);
  });

  it('plano encerrado não conta: sem vigente, não há número', () => {
    const s = semente();
    s.peis = s.peis.map((pei) => ({ ...pei, status: 'closed' as const }));
    expect(studentProgress(s, '1')).toBeUndefined();
  });
});

describe('studentRecordSummary: as revisões do PEI entram na contagem', () => {
  it('conta a revisão do plano vigente do estudante 1, e zero para quem não tem plano', () => {
    const s = semente();
    expect(studentRecordSummary(s, '1').peiRevisions).toBe(1);
    expect(studentRecordSummary(s, '2').peiRevisions).toBe(0);
  });

  it('a revisão não antecipa a data do último registro quando há registro mais novo', () => {
    const s = semente();
    // Atendimento de 30/11 é mais recente que a revisão de 05/11: a data não muda com a Etapa 9.
    expect(studentRecordSummary(s, '1').lastRecordDate).toBe('2025-11-30');
  });

  it('com a revisão como registro mais recente, ela passa a ser a data', () => {
    const s = semente();
    s.peiRevisions = s.peiRevisions.map((revisao) => ({ ...revisao, date: '2026-01-15' }));
    // Falsificação: se a revisão ficasse fora do cálculo, a data seria a do atendimento.
    expect(studentRecordSummary(s, '1').lastRecordDate).toBe('2026-01-15');
    expect(studentRecordSummary(s, '1').lastRecordDate).not.toBe('2025-11-30');
  });
});

describe('studentNameOf: o nome vem do cadastro, pelo id', () => {
  it('devolve o nome do estudante do cadastro', () => {
    const s = semente();
    expect(studentNameOf(s, s.students[0].id)).toBe(s.students[0].nomeCompleto);
  });

  it('id inexistente devolve texto explícito, e não string vazia', () => {
    const s = semente();
    const resultado = studentNameOf(s, 'nao-existe');
    expect(resultado).toBe('Estudante não encontrado');
    expect(resultado).not.toBe('');
  });

  it('renomear o estudante muda o nome resolvido, sem tocar em registro vinculado', () => {
    // É a razão de a Etapa 5 remover a cópia do nome: a propagação deixou de ser necessária.
    const s = semente();
    const alvo = s.students[0];
    s.students = [{ ...alvo, nomeCompleto: 'Nome Editado' }, ...s.students.slice(1)];
    expect(studentNameOf(s, alvo.id)).toBe('Nome Editado');
    expect(studentNameOf(s, alvo.id)).not.toBe(alvo.nomeCompleto);
  });
});

describe('nota de recurso', () => {
  it('sem avaliação, a média é null e a contagem é zero', () => {
    expect(summarizeRatings([])).toEqual({ average: null, count: 0 });
    // O defeito da Etapa 4: recursos exibiam nota vinda da fixture, sem avaliação real.
    expect(summarizeRatings([]).average).not.toBe(0);
  });

  it('a média é das avaliações dadas, com uma casa', () => {
    const avaliacoes = [4, 5, 4].map((rating, i) => ({
      id: 'r' + i, resourceId: 'x', author: 'a', rating, comment: 'c', date: '2025-01-01',
    }));
    expect(summarizeRatings(avaliacoes)).toEqual({ average: 4.3, count: 3 });
  });

  it('formatRating exibe uma casa decimal, inclusive em número inteiro', () => {
    // O defeito da Etapa 4: o selo mostrava "5" em vez de "5,0".
    expect(formatRating(5)).toBe('5,0');
    expect(formatRating(4.3)).toBe('4,3');
    expect(formatRating(5)).not.toBe('5');
  });
});

describe('earnedBadges: conquistada é a que o número de contribuições alcança', () => {
  const badges: Badge[] = [1, 5, 10, 15, 30].map((n) => ({
    id: 'b' + n, name: 'b' + n, description: '', icon: '', requiredContributions: n,
  }));

  it('sem contribuição, nenhuma badge', () => {
    expect(earnedBadges(badges, 0)).toHaveLength(0);
  });

  it('nos limiares, conquista exatamente as alcançadas', () => {
    expect(earnedBadges(badges, 1).map((b) => b.requiredContributions)).toEqual([1]);
    expect(earnedBadges(badges, 5).map((b) => b.requiredContributions)).toEqual([1, 5]);
    expect(earnedBadges(badges, 9).map((b) => b.requiredContributions)).toEqual([1, 5]);
    expect(earnedBadges(badges, 30)).toHaveLength(5);
  });

  it('logo abaixo do limiar NÃO conquista', () => {
    // Falsificação: se o critério fosse `>`, o limiar exato não contaria; se fosse sempre
    // verdadeiro, isto reprovaria.
    expect(earnedBadges(badges, 4)).toHaveLength(1);
    expect(earnedBadges(badges, 5)).toHaveLength(2);
  });
});
