import { describe, expect, it } from 'vitest';
import { assessmentProgress, assessmentsOf, performanceLevelLabel } from './assessment';
import { createSeedState } from '@/store/seed';
import type { Assessment, PerformanceLevel } from '@/types';
import type { DemoState } from '@/types/store';

/*
 * A medição datada da avaliação, que a Etapa 9 separou do progresso das metas do plano.
 *
 * POR QUE ESTE ARQUIVO EXISTE. A mutação que trocava a média pelo MÁXIMO dos objetivos não
 * reprovou a suíte: a avaliação da semente tem um objetivo só, e com um objetivo média e máximo
 * dão o mesmo número. O teste de tela não podia distinguir as duas contas — a fixture não
 * distingue. Casos com DOIS objetivos distinguem, e é isso que está aqui.
 */

const semente = (): DemoState => JSON.parse(JSON.stringify(createSeedState())) as DemoState;

const comObjetivos = (progressos: number[]): Assessment => {
  const base = semente().assessments[0];
  return {
    ...base,
    objectives: progressos.map((progress, indice) => ({
      title: `Objetivo ${indice + 1}`,
      status: 'inProgress' as const,
      progress,
      notes: '',
    })),
  };
};

describe('assessmentProgress: a média do que AQUELA avaliação mediu', () => {
  it('é a média aritmética dos objetivos, não o maior nem o menor', () => {
    const avaliacao = comObjetivos([40, 80]);
    expect(assessmentProgress(avaliacao)).toBe(60);
    // Falsificação: com um objetivo só, média, máximo e mínimo coincidem e nada distingue as
    // três contas. Com dois, cada uma dá um número diferente.
    expect(assessmentProgress(avaliacao)).not.toBe(80);
    expect(assessmentProgress(avaliacao)).not.toBe(40);
  });

  it('arredonda, e o arredondamento é para o inteiro mais próximo', () => {
    expect(assessmentProgress(comObjetivos([40, 80, 95]))).toBe(72); // 71,67
    expect(assessmentProgress(comObjetivos([10, 11]))).toBe(11); // 10,5
  });

  it('avaliação sem objetivo devolve undefined, e não zero', () => {
    expect(assessmentProgress(comObjetivos([]))).toBeUndefined();
    expect(assessmentProgress(comObjetivos([]))).not.toBe(0);
  });

  it('a avaliação da semente mede 60%, o número que a ficha exibia até a Etapa 9', () => {
    const s = semente();
    expect(assessmentProgress(s.assessments[0])).toBe(60);
  });
});

describe('assessmentsOf: as avaliações do estudante, da mais antiga para a mais recente', () => {
  it('filtra por estudante', () => {
    const s = semente();
    expect(assessmentsOf(s, '1').map((avaliacao) => avaliacao.id)).toEqual(['avl-1']);
    expect(assessmentsOf(s, '2')).toHaveLength(0);
  });

  it('ordena por data crescente, que é a ordem em que a série é lida', () => {
    const s = semente();
    const base = s.assessments[0];
    s.assessments = [
      { ...base, id: 'avl-nova', date: '2025-12-01' },
      { ...base, id: 'avl-antiga', date: '2025-03-01' },
      base,
    ];
    expect(assessmentsOf(s, '1').map((avaliacao) => avaliacao.id)).toEqual([
      'avl-antiga',
      'avl-1',
      'avl-nova',
    ]);
  });
});

describe('performanceLevelLabel: nível em palavra, não em número solto', () => {
  it('cada nível tem rótulo, e nenhum é o próprio número', () => {
    for (const nivel of [1, 2, 3, 4, 5] as PerformanceLevel[]) {
      expect(performanceLevelLabel(nivel), String(nivel)).not.toBe(String(nivel));
    }
    expect(performanceLevelLabel(4)).toBe('Bom');
  });
});
