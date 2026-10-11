import { afterEach, describe, expect, it } from 'vitest';
import { lerMovimentoReduzido } from '@/hooks/useReducedMotion';

/*
 * A leitura de "movimento reduzido", que a Etapa 14 passou a consultar antes de animar.
 *
 * Por que isto é teste e não medição no navegador: das duas fontes, só UMA é alcançável no
 * navegador desta sessão. A preferência do app é um atributo, e dá para ligá-la e medir o
 * efeito — medido, os setores da rosca passaram de 1 466 ms para 73 ms. A do SISTEMA não é
 * emulável aqui: medido na Etapa 13, `matchMedia('(prefers-reduced-motion: reduce)').matches`
 * responde `false` e não há como mudá-lo. O ramo do sistema, então, só se verifica assim.
 *
 * O caso que falsifica: atributo PRESENTE com outro valor tem de dar `false`. A regra é o
 * valor `reduzido`, não a presença do atributo — e "presença não é efeito" é a invariante 7.
 */

const PREFERENCIA_DO_SISTEMA = '(prefers-reduced-motion: reduce)';

/** Troca `window.matchMedia` por um que responde o que o teste pedir. Devolve como desfazer. */
const fingirSistema = (reduz: boolean) => {
  const original = window.matchMedia;
  window.matchMedia = ((consulta: string) => ({
    matches: consulta === PREFERENCIA_DO_SISTEMA ? reduz : false,
    media: consulta,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  return () => { window.matchMedia = original; };
};

const comAtributo = (valor: string | null) => {
  if (valor === null) document.documentElement.removeAttribute('data-a11y-motion');
  else document.documentElement.setAttribute('data-a11y-motion', valor);
};

afterEach(() => {
  comAtributo(null);
  // O stub de matchMedia é desfeito em cada caso; aqui fica a garantia de não vazar o atributo.
});

describe('lerMovimentoReduzido: a preferência do app OU a do sistema', () => {
  it('sem nenhuma das duas, não reduz', () => {
    const desfazer = fingirSistema(false);
    comAtributo(null);
    expect(lerMovimentoReduzido()).toBe(false);
    desfazer();
  });

  it('só a preferência do app liga', () => {
    const desfazer = fingirSistema(false);
    comAtributo('reduzido');
    expect(lerMovimentoReduzido()).toBe(true);
    desfazer();
  });

  it('só a preferência do sistema liga', () => {
    const desfazer = fingirSistema(true);
    comAtributo(null);
    expect(lerMovimentoReduzido()).toBe(true);
    desfazer();
  });

  it('as duas juntas ligam, e nenhuma anula a outra', () => {
    const desfazer = fingirSistema(true);
    comAtributo('reduzido');
    expect(lerMovimentoReduzido()).toBe(true);
    desfazer();
  });

  it('o atributo presente com OUTRO valor não liga — é o valor que decide, não a presença', () => {
    const desfazer = fingirSistema(false);
    comAtributo('normal');
    expect(document.documentElement.hasAttribute('data-a11y-motion')).toBe(true);
    expect(lerMovimentoReduzido()).toBe(false);
    desfazer();
  });

  it('sem matchMedia no ambiente, responde pelo app em vez de estourar', () => {
    const original = window.matchMedia;
    // @ts-expect-error — o jsdom cru não tem matchMedia, e é esse ambiente que se testa aqui.
    delete window.matchMedia;
    comAtributo(null);
    expect(lerMovimentoReduzido()).toBe(false);
    comAtributo('reduzido');
    expect(lerMovimentoReduzido()).toBe(true);
    window.matchMedia = original;
  });
});
