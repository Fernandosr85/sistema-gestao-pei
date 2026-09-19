import { describe, expect, it } from 'vitest';
import { calculateAge, formatLocalDate, parseLocalDate, toLocalISODate } from './date';

/*
 * Os defeitos de data da Etapa 4 (`a0d36cf`) eram todos da mesma forma: errado por um dia, e
 * só depois das 21h no Brasil. Invisíveis a menos que se olhasse na hora certa.
 *
 * A causa era `new Date('AAAA-MM-DD')`, que o padrão manda ler como meia-noite em UTC. Em
 * fuso negativo isso cai no dia anterior.
 *
 * Por isso cada teste aqui compara o valor certo COM A CONTA QUE PRODUZIA O DEFEITO, e não só
 * com um literal. Assim "o teste passa" significa "o defeito não voltou", e não "a função
 * devolveu algo".
 *
 * O fuso está FIXO em America/Sao_Paulo pelo vitest.config.ts. Sem isso as comparações com a
 * conta antiga não teriam sentido no CI, que roda em UTC: lá new Date("2025-11-19") devolve dia
 * 19 e o defeito não se manifesta. Medido — com TZ=UTC esta suíte passava sem exercitar um
 * único caso do defeito.
 */

/** A conta antiga, preservada para servir de controle. Não use em código de produção. */
const contaAntiga = (iso: string) => new Date(iso);

describe('o fuso do teste está fixo', () => {
  it('roda em America/Sao_Paulo, onde o defeito existe', () => {
    // Se este reprovar, todas as comparações com a conta antiga viraram vácuo.
    expect(new Date(2025, 10, 24).getTimezoneOffset()).toBe(180);
    expect(new Date('2025-11-19').getDate()).toBe(18);
  });
});

describe('parseLocalDate lê como data local, não como UTC', () => {
  it('19/11/2025 é dia 19, e não 18 como a conta antiga dava em fuso negativo', () => {
    const local = parseLocalDate('2025-11-19');
    expect(local).not.toBeNull();
    expect(local?.getDate()).toBe(19);
    expect(local?.getMonth()).toBe(10);
    expect(local?.getFullYear()).toBe(2025);

    // O defeito, explicitado: a conta antiga devolve o dia anterior.
    const antiga = contaAntiga('2025-11-19');
    expect(antiga.getDate()).toBe(18);
    expect(local?.getDate()).not.toBe(antiga.getDate());
  });

  it('data inválida devolve null em vez de Invalid Date', () => {
    expect(parseLocalDate('')).toBeNull();
    expect(parseLocalDate('nao-e-data')).toBeNull();
    expect(parseLocalDate('2025-00-10')).toBeNull();
    // Falsificação: uma data boa não pode devolver null.
    expect(parseLocalDate('2025-11-19')).not.toBeNull();
  });
});

describe('calculateAge', () => {
  const nascimento = '2016-03-15';

  it('na véspera do aniversário ainda não somou o ano', () => {
    expect(calculateAge(nascimento, new Date(2026, 2, 14))).toBe(9);
  });

  it('no dia do aniversário soma o ano', () => {
    expect(calculateAge(nascimento, new Date(2026, 2, 15))).toBe(10);
  });

  it('no dia seguinte continua somado', () => {
    expect(calculateAge(nascimento, new Date(2026, 2, 16))).toBe(10);
  });

  it('a véspera e o dia do aniversário dão valores DIFERENTES', () => {
    // Falsificação: se a função devolvesse constante, os dois seriam iguais e isto reprovaria.
    const vespera = calculateAge(nascimento, new Date(2026, 2, 14));
    const dia = calculateAge(nascimento, new Date(2026, 2, 15));
    expect(dia).toBe(vespera + 1);
  });

  it('às 23h da véspera NÃO soma o ano — era aqui que o defeito aparecia', () => {
    // A conta antiga lia o nascimento como UTC e adiantava a idade na véspera.
    expect(calculateAge(nascimento, new Date(2026, 2, 14, 23, 59))).toBe(9);
  });

  it('data de nascimento inválida devolve 0 em vez de NaN', () => {
    expect(calculateAge('', new Date(2026, 2, 15))).toBe(0);
    expect(calculateAge('nao-e-data', new Date(2026, 2, 15))).toBe(0);
    expect(Number.isNaN(calculateAge('', new Date(2026, 2, 15)))).toBe(false);
  });

  it('mês anterior ao do aniversário ainda não somou', () => {
    expect(calculateAge(nascimento, new Date(2026, 1, 28))).toBe(9);
  });
});

describe('toLocalISODate', () => {
  it('devolve o dia local, não o dia em UTC', () => {
    // 21h30 de 24/11 em fuso negativo já é 25/11 em UTC. O dia gravado tem de ser o local.
    const noite = new Date(2025, 10, 24, 21, 30);
    expect(toLocalISODate(noite)).toBe('2025-11-24');

    // O defeito, explicitado: toISOString() daria o dia seguinte.
    expect(noite.toISOString().slice(0, 10)).toBe('2025-11-25');
    expect(toLocalISODate(noite)).not.toBe(noite.toISOString().slice(0, 10));
  });

  it('ida e volta: o texto gravado relê como o mesmo dia', () => {
    const iso = '2025-11-19';
    const voltou = parseLocalDate(iso);
    expect(voltou).not.toBeNull();
    expect(toLocalISODate(voltou as Date)).toBe(iso);
  });
});

describe('formatLocalDate', () => {
  it('exibe o dia gravado, e não o anterior', () => {
    expect(formatLocalDate('2025-11-19')).toContain('19');
    expect(formatLocalDate('2025-11-19')).not.toContain('18/11');
  });
});
