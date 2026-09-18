import { beforeEach, describe, expect, it } from 'vitest';
import { loadState, saveState } from './persistence';
import { createSeedState } from './seed';
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

  it('a semente gravada como v3 volta inteira', () => {
    const s = semente();
    gravar(3, s);
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
    gravar(3, s);

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
    gravar(3, s);

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
    gravar(3, s);

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
    gravar(3, s);

    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.state.reviews.some((rev) => rev.resourceId === recurso)).toBe(false);
    expect(r.discarded?.reviews).toBe(reviewsDoRecurso);
  });

  it('CONTROLE: sem nada estragado, nada é descartado', () => {
    // Se este falhar, os testes acima passariam por descartar tudo sempre, e não por discriminar.
    gravar(3, semente());
    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    expect(r.discarded).toBeUndefined();
    expect(r.state.students).toHaveLength(semente().students.length);
  });

  it('CONTROLE: a semente inteira passa nos esquemas', () => {
    // Se a semente reprovasse, o store perderia registro a cada recarga, em silêncio.
    const s = semente();
    gravar(3, s);
    const r = loadState();
    if (r.status !== 'loaded') throw new Error('esperado loaded');
    for (const chave of ['students', 'observations', 'appointments', 'assessments', 'resources', 'reviews', 'favorites'] as const) {
      expect(r.state[chave]).toHaveLength(s[chave].length);
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
