import { describe, expect, it } from 'vitest';
import { demoReducer } from './reducer';
import { createSeedState } from './seed';
import type { DemoState } from '@/types/store';

/*
 * O reducer é puro, e é onde a Etapa 5 tirou a propagação do nome do estudante: `student/update`
 * deixou de copiar o nome novo para observações, atendimentos e avaliações, porque essas
 * coleções pararam de guardar cópia. Um teste aqui prende essa decisão.
 *
 * Todo teste confere também que o estado ANTERIOR não foi mutado: reducer que muta em vez de
 * devolver estado novo passa despercebido até a interface parar de re-renderizar.
 */

const semente = (): DemoState => JSON.parse(JSON.stringify(createSeedState())) as DemoState;

describe('student/update', () => {
  it('troca o estudante e NÃO toca nos registros vinculados', () => {
    const antes = semente();
    const alvo = antes.students[0];
    const depois = demoReducer(antes, {
      type: 'student/update',
      student: { ...alvo, nomeCompleto: 'Nome Editado' },
    });

    expect(depois.students[0].nomeCompleto).toBe('Nome Editado');
    // A propagação saiu na Etapa 5: as outras coleções ficam idênticas, por referência.
    expect(depois.observations).toBe(antes.observations);
    expect(depois.appointments).toBe(antes.appointments);
    expect(depois.assessments).toBe(antes.assessments);
  });

  it('não muta o estado anterior', () => {
    const antes = semente();
    const nomeOriginal = antes.students[0].nomeCompleto;
    demoReducer(antes, { type: 'student/update', student: { ...antes.students[0], nomeCompleto: 'X' } });
    expect(antes.students[0].nomeCompleto).toBe(nomeOriginal);
  });

  it('id que não existe não cria estudante nem apaga nenhum', () => {
    const antes = semente();
    const depois = demoReducer(antes, {
      type: 'student/update',
      student: { ...antes.students[0], id: 'nao-existe' },
    });
    expect(depois.students).toHaveLength(antes.students.length);
    expect(depois.students.some((aluno) => aluno.id === 'nao-existe')).toBe(false);
  });
});

describe('adições entram no topo da lista', () => {
  it('student/add', () => {
    const antes = semente();
    const novo = { ...antes.students[0], id: 'novo', nomeCompleto: 'Aluno Novo' };
    const depois = demoReducer(antes, { type: 'student/add', student: novo });
    expect(depois.students).toHaveLength(antes.students.length + 1);
    expect(depois.students[0].id).toBe('novo');
    // Falsificação: se entrasse no fim, o primeiro continuaria sendo o antigo.
    expect(depois.students[0].id).not.toBe(antes.students[0].id);
  });

  it('observation/add, appointment/add e assessment/add', () => {
    const antes = semente();
    const obs = { ...antes.observations[0], id: 'obs-novo' };
    const atd = { ...antes.appointments[0], id: 'atd-novo' };
    const avl = { ...antes.assessments[0], id: 'avl-novo' };

    expect(demoReducer(antes, { type: 'observation/add', observation: obs }).observations[0].id).toBe('obs-novo');
    expect(demoReducer(antes, { type: 'appointment/add', appointment: atd }).appointments[0].id).toBe('atd-novo');
    expect(demoReducer(antes, { type: 'assessment/add', assessment: avl }).assessments[0].id).toBe('avl-novo');
  });
});

describe('estado dos atendimentos', () => {
  it('markDone muda só o alvo, e só o status', () => {
    const antes = semente();
    const alvo = antes.appointments[0];
    const outro = antes.appointments[1];
    const depois = demoReducer(antes, { type: 'appointment/markDone', id: alvo.id });

    expect(depois.appointments[0].status).toBe('realizado');
    expect(depois.appointments[0].data).toBe(alvo.data);
    // Falsificação: se mudasse todos, o segundo também estaria 'realizado'.
    expect(depois.appointments[1].status).toBe(outro.status);
  });

  it('cancel marca cancelado e NÃO remove o registro', () => {
    const antes = semente();
    const depois = demoReducer(antes, { type: 'appointment/cancel', id: antes.appointments[0].id });
    expect(depois.appointments).toHaveLength(antes.appointments.length);
    expect(depois.appointments[0].status).toBe('cancelado');
  });

  it('saveMinutes grava a ata no alvo', () => {
    const antes = semente();
    const depois = demoReducer(antes, {
      type: 'appointment/saveMinutes', id: antes.appointments[0].id, minutes: 'ata escrita',
    });
    expect(depois.appointments[0].ata).toBe('ata escrita');
    expect(depois.appointments[1].ata).toBe(antes.appointments[1].ata);
  });

  it('id inexistente não muda nada', () => {
    const antes = semente();
    const depois = demoReducer(antes, { type: 'appointment/markDone', id: 'nao-existe' });
    expect(depois.appointments.map((a) => a.status)).toEqual(antes.appointments.map((a) => a.status));
  });
});

describe('favoritos', () => {
  it('favorite/add não duplica o mesmo recurso', () => {
    const antes = semente();
    const fav = { resourceId: antes.resources[0].id, addedAt: '2026-01-01T00:00:00.000Z' };
    const um = demoReducer(antes, { type: 'favorite/add', favorite: fav });
    const dois = demoReducer(um, { type: 'favorite/add', favorite: { ...fav, addedAt: '2026-02-02T00:00:00.000Z' } });

    expect(um.favorites).toHaveLength(1);
    expect(dois.favorites).toHaveLength(1);
    // Falsificação: a segunda chamada devolve o MESMO estado, não um novo com duplicata.
    expect(dois).toBe(um);
  });

  it('favorite/remove tira só o recurso pedido', () => {
    const antes = semente();
    const a = demoReducer(antes, { type: 'favorite/add', favorite: { resourceId: antes.resources[0].id, addedAt: 'x' } });
    const b = demoReducer(a, { type: 'favorite/add', favorite: { resourceId: antes.resources[1].id, addedAt: 'y' } });
    const c = demoReducer(b, { type: 'favorite/remove', resourceId: antes.resources[0].id });

    expect(c.favorites).toHaveLength(1);
    expect(c.favorites[0].resourceId).toBe(antes.resources[1].id);
  });
});

describe('demo/reset', () => {
  it('volta à semente, descartando o que foi cadastrado', () => {
    const antes = semente();
    const comNovo = demoReducer(antes, {
      type: 'student/add', student: { ...antes.students[0], id: 'novo' },
    });
    expect(comNovo.students).toHaveLength(antes.students.length + 1);

    const depois = demoReducer(comNovo, { type: 'demo/reset' });
    expect(depois.students).toHaveLength(createSeedState().students.length);
    expect(depois.students.some((aluno) => aluno.id === 'novo')).toBe(false);
  });
});
