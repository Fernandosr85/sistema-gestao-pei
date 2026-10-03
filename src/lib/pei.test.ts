import { describe, expect, it } from 'vitest';
import {
  activePeiOf,
  familyMeetingsOf,
  goalCountsByStatus,
  goalsByArea,
  goalsCitingSource,
  goalsOfPei,
  noteSourceLabel,
  notesOfGoal,
  peiGoalAreaLabel,
  peiGoalsProgress,
  peiGoalStatusLabel,
  peiHistoryOf,
  revisionsOfPei,
} from './pei';
import { createSeedState } from '@/store/seed';
import type { DemoState } from '@/types/store';
import type { Pei, PeiGoal, PeiGoalArea, PeiGoalStatus } from '@/types/pei';

/*
 * Os seletores que a tela Ver PEI usa. A fotografia de superfície não alcança esta tela — ela é
 * um diálogo que abre por clique, e o arreio mede rotas sem interação —, então o que prende o
 * comportamento é esta suíte mais o teste de árvore em `src/test/verpei.test.tsx`.
 *
 * A regra sob verificação aqui é a do número que não existe: estudante sem PEI vigente não tem
 * progresso, e `undefined` não é 0.
 */

const semente = (): DemoState => JSON.parse(JSON.stringify(createSeedState())) as DemoState;

const metaMinima = (sobrescreve: Partial<PeiGoal> = {}): PeiGoal => ({
  id: 'g',
  peiId: 'pei-1',
  area: 'portuguese',
  title: 'Meta',
  description: '',
  status: 'inProgress',
  progress: 50,
  strategies: [],
  nextStep: '',
  owner: '',
  ...sobrescreve,
});

describe('activePeiOf: o plano é do estudante, ou não existe', () => {
  it('o estudante 1 tem o plano vigente da semente', () => {
    const s = semente();
    expect(activePeiOf(s, '1')?.id).toBe('pei-1');
  });

  it('estudante sem plano devolve undefined, e nunca o plano de outro', () => {
    const s = semente();
    // Falsificação: é a classe do achado 1 — o diálogo mostrava o mesmo plano para qualquer
    // estudante. Um seletor que ignorasse o studentId passaria no caso acima e falharia aqui.
    expect(activePeiOf(s, '2')).toBeUndefined();
    expect(activePeiOf(s, '3')).toBeUndefined();
    expect(activePeiOf(s, '4')).toBeUndefined();
  });

  it('plano encerrado ou em rascunho não é vigente, e vai para o histórico', () => {
    const s = semente();
    const vigente = s.peis[0];
    const encerrado: Pei = { ...vigente, id: 'pei-0', term: '2025 - 3º Trimestre', startsOn: '2025-07-01', status: 'closed' };
    const rascunho: Pei = { ...vigente, id: 'pei-2', term: '2026 - 1º Trimestre', startsOn: '2026-02-01', status: 'draft' };
    /*
     * A ORDEM É PARTE DO TESTE. Com o encerrado e o rascunho depois do vigente, um seletor que
     * ignorasse o status devolveria o vigente de qualquer jeito e passaria: foi assim que a
     * primeira versão deste teste nasceu cega, e a mutação do filtro de status a denunciou.
     * Aqui os dois vêm ANTES, então só um seletor que olhe o status acerta.
     */
    s.peis = [encerrado, rascunho, vigente];

    expect(activePeiOf(s, '1')?.id).toBe('pei-1');
    expect(peiHistoryOf(s, '1').map((pei) => pei.id)).toEqual(['pei-2', 'pei-0']);
    // Falsificação: o vigente não pode aparecer no histórico, senão a aba o mostraria duas vezes.
    expect(peiHistoryOf(s, '1').map((pei) => pei.id)).not.toContain('pei-1');
  });

  it('estudante cujo único plano está encerrado não tem plano vigente', () => {
    const s = semente();
    s.peis = [{ ...s.peis[0], status: 'closed' }];
    // Sem esta asserção, a tela exibiria um plano encerrado como se estivesse valendo — com
    // metas, progresso e próxima revisão de um documento que já não vale.
    expect(activePeiOf(s, '1')).toBeUndefined();
    expect(peiHistoryOf(s, '1')).toHaveLength(1);
  });
});

describe('peiGoalsProgress: sem meta não há média, e undefined não é 0', () => {
  it('a média das quatro metas da semente é 50%', () => {
    const s = semente();
    const metas = goalsOfPei(s, 'pei-1');
    // 60 + 40 + 100 + 0, divididos por 4. A regra de contagem é esta: média aritmética do
    // `progress` corrente de todas as metas do plano, inclusive as não iniciadas.
    expect(metas).toHaveLength(4);
    expect(peiGoalsProgress(metas)).toBe(50);
  });

  it('plano sem meta devolve undefined, não 0', () => {
    expect(peiGoalsProgress([])).toBeUndefined();
    // Falsificação da regra ditada para esta etapa: 0% é uma medida, e medida que ninguém fez
    // não se exibe. A tela precisa poder distinguir "nenhuma meta" de "nenhum progresso".
    expect(peiGoalsProgress([])).not.toBe(0);
  });

  it('meta não iniciada entra na média como 0 e derruba o número', () => {
    const comZero = [metaMinima({ id: 'a', progress: 100, status: 'achieved' }), metaMinima({ id: 'b', progress: 0, status: 'notStarted' })];
    expect(peiGoalsProgress(comZero)).toBe(50);
    // Falsificação: uma média que filtrasse as não iniciadas devolveria 100 e inflaria o plano.
    expect(peiGoalsProgress(comZero)).not.toBe(100);
  });

  it('as contagens por status somam o total de metas', () => {
    const s = semente();
    const metas = goalsOfPei(s, 'pei-1');
    const contagens = goalCountsByStatus(metas);
    expect(contagens).toEqual({ achieved: 1, inProgress: 2, notStarted: 1, needsReview: 0 });
    const soma = Object.values(contagens).reduce((total, valor) => total + valor, 0);
    expect(soma).toBe(metas.length);
  });
});

describe('agrupamento e rótulos', () => {
  it('as metas saem agrupadas na ordem das áreas do manual, sem área vazia', () => {
    const s = semente();
    const grupos = goalsByArea(goalsOfPei(s, 'pei-1'));
    expect(grupos.map((grupo) => grupo.area)).toEqual(['portuguese', 'math', 'selfRegulation', 'functionalCommunication']);
    expect(grupos.every((grupo) => grupo.goals.length > 0)).toBe(true);
    // Falsificação: nenhuma meta pode se perder no agrupamento.
    expect(grupos.reduce((total, grupo) => total + grupo.goals.length, 0)).toBe(4);
  });

  it('nenhum identificador cru chega à tela', () => {
    const areas: PeiGoalArea[] = [
      'portuguese', 'math', 'science', 'geographyHistory', 'arts', 'physicalEducation',
      'selfRegulation', 'socialInteraction', 'functionalCommunication', 'autonomy',
    ];
    const status: PeiGoalStatus[] = ['notStarted', 'inProgress', 'achieved', 'needsReview'];
    // O mesmo controle do `AppointmentType` na v4: o rótulo tem de ser diferente da chave, senão
    // o identificador em inglês vaza para o texto da interface.
    for (const area of areas) {
      expect(peiGoalAreaLabel(area), area).not.toBe(area);
      expect(peiGoalAreaLabel(area).length, area).toBeGreaterThan(0);
    }
    for (const estado of status) {
      expect(peiGoalStatusLabel(estado), estado).not.toBe(estado);
    }
  });
});

describe('notas da meta e a evidência, que é elo fraco', () => {
  it('a nota aparece sob a meta que ela cita, da mais recente para a mais antiga', () => {
    const s = semente();
    expect(notesOfGoal(s, 'pei-goal-1').map((nota) => nota.id)).toEqual(['pei-note-1']);
    expect(notesOfGoal(s, 'pei-goal-2').map((nota) => nota.id)).toEqual(['pei-note-2']);
    // Falsificação: nota de outra meta não pode aparecer aqui.
    expect(notesOfGoal(s, 'pei-goal-3')).toHaveLength(0);
  });

  it('a evidência é resolvida pelo registro citado', () => {
    const s = semente();
    expect(noteSourceLabel(s, { kind: 'assessment', id: 'avl-1' })).toMatch(/^Avaliação de \d{2}\/\d{2}\/\d{4}$/);
    expect(noteSourceLabel(s, { kind: 'observation', id: 'obs-1' })).toMatch(/^Observação de \d{2}\/\d{2}\/\d{4}$/);
    expect(noteSourceLabel(s, { kind: 'appointment', id: 'atd-3' })).toMatch(/^Atendimento Família de \d{2}\/\d{2}\/\d{4}$/);
  });

  it('evidência que não existe mais devolve texto explícito, e a nota continua lá', () => {
    const s = semente();
    // É o outro lado da cascata por posse: o descarte do atendimento não leva a nota, então a
    // tela tem de saber dizer que a evidência não está no registro, em vez de quebrar ou mentir.
    expect(noteSourceLabel(s, { kind: 'appointment', id: 'atd-999' })).toBe('Atendimento não encontrado no registro');
    expect(noteSourceLabel(s, { kind: 'assessment', id: 'avl-999' })).toBe('Avaliação não encontrada no registro');
    expect(noteSourceLabel(s, { kind: 'observation', id: 'obs-999' })).toBe('Observação não encontrada no registro');
  });
});

describe('goalsCitingSource: a evidência percorrida ao contrário', () => {
  it('a meta cuja nota cita a observação aparece; as outras não', () => {
    const s = semente();
    // `pei-note-2` cita a observação `obs-1`, e ela é da meta `pei-goal-2`.
    expect(goalsCitingSource(s, 'observation', 'obs-1').map((meta) => meta.id)).toEqual(['pei-goal-2']);
    expect(goalsCitingSource(s, 'observation', 'obs-inexistente')).toHaveLength(0);
  });

  it('o TIPO da evidência conta, não só o id', () => {
    const s = semente();
    /*
     * Na semente nenhum id se repete entre coleções, então ignorar o `kind` passaria despercebido
     * — foi o que uma mutação mostrou. Aqui o mesmo id 'x' é usado por uma observação e por uma
     * avaliação, e as duas notas são de metas diferentes: só uma pode responder por cada tipo.
     */
    s.peiGoalNotes = [
      { ...s.peiGoalNotes[0], id: 'n-obs', goalId: 'pei-goal-1', source: { kind: 'observation', id: 'x' } },
      { ...s.peiGoalNotes[0], id: 'n-avl', goalId: 'pei-goal-2', source: { kind: 'assessment', id: 'x' } },
    ];
    expect(goalsCitingSource(s, 'observation', 'x').map((meta) => meta.id)).toEqual(['pei-goal-1']);
    expect(goalsCitingSource(s, 'assessment', 'x').map((meta) => meta.id)).toEqual(['pei-goal-2']);
  });
});

describe('acompanhamento', () => {
  it('a revisão da semente pertence ao plano do estudante 1', () => {
    const s = semente();
    expect(revisionsOfPei(s, 'pei-1').map((revisao) => revisao.id)).toEqual(['pei-rev-1']);
    expect(revisionsOfPei(s, 'pei-inexistente')).toHaveLength(0);
  });

  it('os atendimentos com a família vêm da agenda, filtrados por estudante e tipo', () => {
    const s = semente();
    const doUm = familyMeetingsOf(s, '1');
    expect(doUm.map((atendimento) => atendimento.id)).toEqual(['atd-3']);
    // Falsificação: atendimento de outro tipo, ou de outro estudante, não entra.
    expect(doUm.every((atendimento) => atendimento.tipo === 'familyMeeting')).toBe(true);
    expect(familyMeetingsOf(s, '3').map((atendimento) => atendimento.id)).toEqual([]);
  });
});
