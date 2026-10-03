import { beforeEach, describe, expect, it } from 'vitest';
import { loadState, saveState } from './persistence';
import { createSeedState } from './seed';
import { objectiveTitle } from '@/lib/pei';
import type { DemoState } from '@/types/store';

/*
 * O caminho do store é o primeiro da suíte por um motivo específico: o protocolo da fotografia
 * de superfície manda medir com o `localStorage` VAZIO (scripts/README-fotografia.md). Carga,
 * migração, validação, descarte e cascata não são cobertos por nenhum outro instrumento deste
 * projeto — nem lint, nem typecheck, nem arreio. É também o único lugar que já produziu tela em
 * branco medida (Etapa 6).
 *
 * Um defeito aqui é silencioso por construção: o registro some e ninguém vê sumir.
 */

const CHAVE = 'pei-demo-store';

const gravar = (version: number, state: unknown) =>
  window.localStorage.setItem(CHAVE, JSON.stringify({ version, savedAt: '2026-01-01T00:00:00.000Z', state }));

/** Semente com uma cópia profunda, para estragar sem contaminar os outros testes. */
const semente = (): DemoState => JSON.parse(JSON.stringify(createSeedState())) as DemoState;

beforeEach(() => {
  window.localStorage.clear();
});

describe('envelope e versão', () => {
  it('sem nada gravado, devolve vazio', () => {
    expect(loadState()).toEqual({ status: 'empty' });
  });

  it('JSON ilegível é descartado, e não propagado como estado', () => {
    window.localStorage.setItem(CHAVE, 'isto não é json');
    const r = loadState();
    expect(r.status).toBe('discarded');
    // Falsificação: se o descarte devolvesse um estado, isto passaria a existir.
    expect(r).not.toHaveProperty('state');
  });

  it('versão desconhecida é descartada em vez de lida como a atual', () => {
    gravar(99, semente());
    expect(loadState().status).toBe('discarded');
  });

  it('a semente gravada na versão corrente volta inteira', () => {
    const s = semente();
    gravar(4, s);
    const r = loadState();
    expect(r.status).toBe('loaded');
    if (r.status !== 'loaded') return;
    expect(r.state.students).toHaveLength(s.students.length);
    expect(r.discarded).toBeUndefined();
  });
});

describe('migrações', () => {
  it('v1 traz estudantes e observações e completa o resto da semente', () => {
    const s = semente();
    gravar(1, { students: s.students, observations: s.observations });
    const r = loadState();
    expect(r.status).toBe('loaded');
    if (r.status !== 'loaded') return;
    expect(r.migratedFrom).toBe(1);
    expect(r.state.students).toHaveLength(s.students.length);
    expect(r.state.favorites).toEqual([]);
    // O que a v1 não tinha vem da semente, e não vazio.
    expect(r.state.resources.length).toBeGreaterThan(0);
  });

  it('v2 ganha favorites vazio e mantém o resto', () => {
    const s = semente();
    const { favorites: _favorites, ...v2 } = s;
    gravar(2, v2);
    const r = loadState();
    expect(r.status).toBe('loaded');
    if (r.status !== 'loaded') return;
    expect(r.migratedFrom).toBe(2);
    expect(r.state.favorites).toEqual([]);
    expect(r.state.appointments).toHaveLength(s.appointments.length);
  });

  it('a chave acentuada da v1 vira a chave ASCII', () => {
    const s = semente();
    const aluno = {
      ...s.students[0],
      comportamento: {
        comportamentosDesafiadores: 'a',
        // Chave legada, escrita pela v1 antes de o acento sair do modelo.
        'estratégiasAcalmar': 'respiração guiada',
        situacoesEstresse: 'c',
      },
    };
    delete (aluno.comportamento as Record<string, unknown>).estrategiasAcalmar;
    gravar(1, { students: [aluno], observations: [] });
    const r = loadState();
    expect(r.status).toBe('loaded');
    if (r.status !== 'loaded') return;
    expect(r.state.students[0].comportamento?.estrategiasAcalmar).toBe('respiração guiada');
  });
});

describe('validação de forma: descarta o registro, não o estado', () => {
  it('estudante sem dataCadastro sai, e o resto fica', () => {
    const s = semente();
    const antesEstudantes = s.students.length;
    delete (s.students[0] as Partial<DemoState['students'][number]>).dataCadastro;
    gravar(4, s);

    const r = loadState();
    expect(r.status).toBe('loaded');
    if (r.status !== 'loaded') return;

    // O registro ruim saiu...
    expect(r.state.students).toHaveLength(antesEstudantes - 1);
    expect(r.state.students.some((aluno) => aluno.id === '1')).toBe(false);
    // ...e o estado NÃO foi descartado inteiro, que é a decisão desta etapa.
    expect(r.state.students.length).toBeGreaterThan(0);
    expect(r.state.resources).toHaveLength(s.resources.length);
  });

  it('a cascata leva o que apontava para o registro descartado', () => {
    const s = semente();
    const alvo = s.students[0].id;
    const obsDoAlvo = s.observations.filter((o) => o.studentId === alvo).length;
    const atdDoAlvo = s.appointments.filter((a) => a.studentId === alvo).length;
    expect(obsDoAlvo + atdDoAlvo).toBeGreaterThan(0); // a semente precisa ter o que cascatear
    delete (s.students[0] as Partial<DemoState['students'][number]>).dataCadastro;
    gravar(4, s);

    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.state.observations.some((o) => o.studentId === alvo)).toBe(false);
    expect(r.state.appointments.some((a) => a.studentId === alvo)).toBe(false);
    expect(r.state.assessments.some((a) => a.studentId === alvo)).toBe(false);
  });

  it('a contagem por coleção bate com o que saiu', () => {
    const s = semente();
    const alvo = s.students[0].id;
    const esperado = {
      students: 1,
      observations: s.observations.filter((o) => o.studentId === alvo).length,
      appointments: s.appointments.filter((a) => a.studentId === alvo).length,
      assessments: s.assessments.filter((a) => a.studentId === alvo).length,
    };
    delete (s.students[0] as Partial<DemoState['students'][number]>).dataCadastro;
    gravar(4, s);

    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.discarded).toBeDefined();
    expect(r.discarded?.students).toBe(esperado.students);
    expect(r.discarded?.observations).toBe(esperado.observations);
    expect(r.discarded?.appointments).toBe(esperado.appointments);
    expect(r.discarded?.assessments).toBe(esperado.assessments);
    // Falsificação: a contagem não é constante nem zero.
    expect(r.discarded?.students).not.toBe(0);
    expect(r.discarded?.resources).toBe(0);
  });

  it('avaliação de recurso órfã sai junto com o recurso', () => {
    const s = semente();
    const recurso = s.resources[0].id;
    const reviewsDoRecurso = s.reviews.filter((rev) => rev.resourceId === recurso).length;
    expect(reviewsDoRecurso).toBeGreaterThan(0);
    delete (s.resources[0] as Partial<DemoState['resources'][number]>).title;
    gravar(4, s);

    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.state.reviews.some((rev) => rev.resourceId === recurso)).toBe(false);
    expect(r.discarded?.reviews).toBe(reviewsDoRecurso);
  });

  it('CONTROLE: sem nada estragado, nada é descartado', () => {
    // Se este falhar, os testes acima passariam por descartar tudo sempre, e não por discriminar.
    gravar(4, semente());
    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.discarded).toBeUndefined();
    expect(r.state.students).toHaveLength(semente().students.length);
  });

  it('CONTROLE: a semente inteira passa nos esquemas', () => {
    // Se a semente reprovasse, o store perderia registro a cada recarga, em silêncio.
    const s = semente();
    gravar(4, s);
    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    // Enumerado a partir da própria semente: lista fixa aqui envelhece a cada coleção nova, e
    // foi o que aconteceu na v4 — o PEI entrou e este controle continuaria verde sem olhar para ele.
    const chaves = Object.keys(s) as Array<keyof DemoState>;
    expect(chaves.length).toBe(11);
    for (const chave of chaves) {
      expect(r.state[chave], chave).toHaveLength(s[chave].length);
    }
  });
});

describe('gravação', () => {
  it('o que é gravado volta igual', () => {
    const s = semente();
    expect(saveState(s)).toBe(true);
    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.state).toEqual(s);
  });
});

/*
 * A v4 traz o PEI e renomeia o tipo do atendimento. Duas coisas no mesmo passo, porque o dado
 * gravado precisa de uma migração só — decisão registrada na Etapa 9.
 */
describe('migração para a v4', () => {
  /** O que a v3 gravava: sem coleções de PEI, e com o rótulo acentuado no lugar do identificador. */
  const comoV3 = (s: DemoState) => {
    const legado: Record<string, string> = {
      pedagogicalMeeting: 'Reunião Pedagógica',
      assessment: 'Avaliação',
      familyMeeting: 'Atendimento Família',
      multidisciplinary: 'Multidisciplinar',
      other: 'Outros',
    };
    const { peis, peiGoals, peiGoalNotes, peiRevisions, ...resto } = s;
    void peis;
    void peiGoals;
    void peiGoalNotes;
    void peiRevisions;
    return {
      ...resto,
      appointments: resto.appointments.map((a) => ({ ...a, tipo: legado[a.tipo] })),
      // A avaliação da v3 tinha o título dentro do objetivo, e nenhuma meta para apontar.
      assessments: resto.assessments.map((avaliacao) => ({
        ...avaliacao,
        objectives: avaliacao.objectives.map(() => ({
          title: 'Desenvolver habilidades de leitura',
          status: 'inProgress' as const,
          progress: 60,
          notes: 'Reconhece palavras familiares com apoio de pictogramas.',
        })),
      })),
    };
  };

  it('o tipo acentuado do atendimento vira identificador, e nada mais do registro muda', () => {
    const s = semente();
    const v3 = comoV3(s);
    expect(v3.appointments[0].tipo).toBe('Reunião Pedagógica'); // o dado de entrada é o antigo
    gravar(3, v3);

    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.migratedFrom).toBe(3);
    expect(r.state.appointments).toHaveLength(v3.appointments.length);
    expect(r.state.appointments.map((a) => a.tipo)).toEqual(s.appointments.map((a) => a.tipo));
    // O resto do atendimento é o mesmo registro: a migração renomeia a etiqueta, não o conteúdo.
    expect(r.state.appointments[0].data).toBe(v3.appointments[0].data);
    expect(r.state.appointments[0].profissionais).toEqual(v3.appointments[0].profissionais);
    expect(r.discarded).toBeUndefined();
  });

  it('tipo fora da tabela vira "other" em vez de levar o atendimento inteiro', () => {
    const v3 = comoV3(semente());
    v3.appointments[0].tipo = 'Categoria Que Nunca Existiu';
    gravar(3, v3);

    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.state.appointments).toHaveLength(v3.appointments.length);
    expect(r.state.appointments[0].tipo).toBe('other');
    // O registro vale mais que a etiqueta: data, profissionais e objetivos continuam lá.
    expect(r.state.appointments[0].objetivos).toBe(v3.appointments[0].objetivos);
  });

  it('as coleções do PEI entram VAZIAS, e não com o plano da semente', () => {
    // Decisão declarada: um PEI é documento atribuído a uma criança nomeada. A v1->v2 completou
    // coleções novas com as fixtures; aqui isso injetaria um plano fictício nos dados de alguém.
    const v3 = comoV3(semente());
    gravar(3, v3);

    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.state.peis).toEqual([]);
    expect(r.state.peiGoals).toEqual([]);
    expect(r.state.peiGoalNotes).toEqual([]);
    expect(r.state.peiRevisions).toEqual([]);
    // E a semente de um navegador novo CONTINUA com o PEI, que é o outro lado da decisão.
    expect(semente().peis).toHaveLength(1);
  });

  it('ida e volta v1 -> v4: nada do que estava gravado se perde', () => {
    const s = semente();
    gravar(1, { students: s.students, observations: s.observations });

    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.migratedFrom).toBe(1);
    // O que a v1 tinha volta inteiro...
    expect(r.state.students).toHaveLength(s.students.length);
    expect(r.state.observations).toHaveLength(s.observations.length);
    // ...as coleções que não existiam vêm da semente, como a v1->v2 decidiu...
    expect(r.state.appointments).toHaveLength(s.appointments.length);
    expect(r.state.assessments).toHaveLength(s.assessments.length);
    // ...o tipo do atendimento chega como identificador, sem acento e sem espaço...
    expect(r.state.appointments.every((a) => /^[a-z][A-Za-z]*$/.test(a.tipo))).toBe(true);
    expect(r.state.appointments.map((a) => a.tipo)).toEqual(s.appointments.map((a) => a.tipo));
    // ...e as do PEI vêm vazias, porque a v1 não tinha PEI nenhum.
    expect(r.state.peis).toEqual([]);
    expect(r.discarded).toBeUndefined();

    // E o que voltou é gravável de novo na versão corrente, sem perder nada no caminho.
    expect(saveState(r.state)).toBe(true);
    const r2 = loadState();
    if (r2.status !== 'loaded') throw new Error('esperado loaded');
    expect(r2.migratedFrom).toBeUndefined();
    expect(r2.state).toEqual(r.state);
  });
});

describe('cascata do PEI: posse cascateia, referência fraca não', () => {
  it('plano sem estudante sai, e leva metas, notas e revisões', () => {
    const s = semente();
    const aluno = s.peis[0].studentId;
    expect(s.peiGoals.length).toBeGreaterThan(0);
    expect(s.peiGoalNotes.length).toBeGreaterThan(0);
    expect(s.peiRevisions.length).toBeGreaterThan(0);
    delete (s.students.find((a) => a.id === aluno) as Partial<DemoState['students'][number]>).dataCadastro;
    gravar(4, s);

    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.state.peis).toEqual([]);
    expect(r.state.peiGoals).toEqual([]);
    expect(r.state.peiGoalNotes).toEqual([]);
    expect(r.state.peiRevisions).toEqual([]);
    expect(r.discarded?.peis).toBe(1);
    expect(r.discarded?.peiGoals).toBe(s.peiGoals.length);
    expect(r.discarded?.peiGoalNotes).toBe(s.peiGoalNotes.length);
    expect(r.discarded?.peiRevisions).toBe(s.peiRevisions.length);
  });

  it('meta inválida sai, leva as notas dela, e não leva as das outras metas', () => {
    const s = semente();
    const metaAlvo = s.peiGoals[0].id;
    const notasDoAlvo = s.peiGoalNotes.filter((n) => n.goalId === metaAlvo).length;
    expect(notasDoAlvo).toBeGreaterThan(0);
    delete (s.peiGoals[0] as Partial<DemoState['peiGoals'][number]>).title;
    gravar(4, s);

    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.state.peiGoals).toHaveLength(s.peiGoals.length - 1);
    expect(r.state.peiGoals.some((m) => m.id === metaAlvo)).toBe(false);
    expect(r.state.peiGoalNotes.some((n) => n.goalId === metaAlvo)).toBe(false);
    expect(r.state.peiGoalNotes).toHaveLength(s.peiGoalNotes.length - notasDoAlvo);
    expect(r.discarded?.peiGoals).toBe(1);
    expect(r.discarded?.peiGoalNotes).toBe(notasDoAlvo);
    // O plano fica: a meta é dele, mas ele não é da meta.
    expect(r.state.peis).toHaveLength(s.peis.length);
  });

  it('evidência apontando para registro descartado NÃO leva a nota', () => {
    // Referência fraca: o texto que alguém escreveu vale sem o elo. Descartar a nota por causa
    // da evidência seria jogar fora o conteúdo para preservar o link.
    const s = semente();
    const nota = s.peiGoalNotes.find((n) => n.source?.kind === 'observation');
    if (!nota?.source) throw new Error('a semente precisa de uma nota com evidência');
    const observacaoCitada = nota.source.id;
    delete (s.observations.find((o) => o.id === observacaoCitada) as Partial<DemoState['observations'][number]>)
      .observador;
    gravar(4, s);

    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.state.observations.some((o) => o.id === observacaoCitada)).toBe(false);
    expect(r.state.peiGoalNotes.some((n) => n.id === nota.id)).toBe(true);
    expect(r.discarded?.peiGoalNotes).toBe(0);
  });

  it('CONTROLE: com a semente intacta, nenhuma coleção do PEI perde registro', () => {
    gravar(4, semente());
    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    const s = semente();
    expect(r.state.peis).toHaveLength(s.peis.length);
    expect(r.state.peiGoals).toHaveLength(s.peiGoals.length);
    expect(r.state.peiGoalNotes).toHaveLength(s.peiGoalNotes.length);
    expect(r.state.peiRevisions).toHaveLength(s.peiRevisions.length);
    expect(r.discarded).toBeUndefined();
  });
});

describe('o título do objetivo medido mora na meta', () => {
  it('a avaliação da semente aponta para a meta, em vez de copiar o título', () => {
    const s = semente();
    const objetivo = s.assessments[0].objectives[0];
    expect(objetivo.goalId).toBe('pei-goal-1');
    expect(objetivo.title).toBeUndefined();
    expect(objectiveTitle(objetivo, s.peiGoals)).toBe(s.peiGoals.find((m) => m.id === 'pei-goal-1')?.title);
  });

  it('renomear a meta muda o que a avaliação mostra, sem tocar na avaliação', () => {
    // É o defeito do nome do estudante da Etapa 5, prevenido pela forma do tipo.
    const s = semente();
    const metas = s.peiGoals.map((m) => (m.id === 'pei-goal-1' ? { ...m, title: 'Título novo' } : m));
    expect(objectiveTitle(s.assessments[0].objectives[0], metas)).toBe('Título novo');
  });

  it('objetivo solto, de antes do PEI, continua mostrando o próprio título', () => {
    expect(objectiveTitle({ title: 'Objetivo antigo', status: 'inProgress', progress: 10, notes: '' }, [])).toBe(
      'Objetivo antigo',
    );
  });

  it('meta que não existe mais é dita, não escondida', () => {
    expect(objectiveTitle({ goalId: 'nao-existe', status: 'inProgress', progress: 10, notes: '' }, [])).toBe(
      'Meta não encontrada',
    );
  });
});
