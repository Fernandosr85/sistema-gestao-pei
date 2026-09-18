import { describe, expect, it } from 'vitest';

/*
 * Teste do próprio arreio de teste.
 *
 * Suíte que passa sempre é a mesma família do typecheck vazio da Etapa 0 e do `grep` que não
 * casa acento da Etapa 1: a saída é indistinguível da saída de uma verificação que funciona.
 * Este arquivo existe para que a suíte prove, a cada execução, que ela discrimina.
 *
 * As três camadas de controle da etapa:
 *  1. o runner reprova com zero testes coletados — `passWithNoTests: false` no vitest.config.ts;
 *  2. todo teste de defeito corrigido assevera também o valor errado antigo (ver os demais
 *     arquivos);
 *  3. cada arquivo carrega ao menos um caso de falsificação — uma asserção que só passa se a
 *     comparação discriminar de fato. É o que está abaixo.
 */

describe('o arreio de teste discrimina', () => {
  it('reprova uma igualdade falsa', () => {
    expect(2 + 2).toBe(4);
    expect(2 + 2).not.toBe(5);
  });

  it('distingue objetos com o mesmo formato e conteúdo diferente', () => {
    expect({ a: 1, b: [2, 3] }).toEqual({ a: 1, b: [2, 3] });
    expect({ a: 1, b: [2, 3] }).not.toEqual({ a: 1, b: [2, 4] });
  });

  it('o ambiente é jsdom, e jsdom não calcula layout', () => {
    // Se isto falhar, os testes de componente estão rodando sem DOM.
    expect(typeof document).toBe('object');
    expect(typeof window).toBe('object');

    // E este é o motivo documentado de a fotografia de superfície não migrar para cá:
    // sem layout, toda caixa mede zero e nada distingue visível de oculto.
    const el = document.createElement('div');
    el.textContent = 'com texto';
    document.body.appendChild(el);
    const rect = el.getBoundingClientRect();
    expect(rect.width).toBe(0);
    expect(rect.height).toBe(0);
    el.remove();
  });
});
