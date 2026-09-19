import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/*
 * jsdom não calcula layout. Isso não é detalhe: medido na aba Orçamento, 28 dos 79 elementos
 * semânticos e 13 dos 96 números da tela só ficam de fora da contagem porque o navegador
 * calcula layout e o Radix mantém montado o conteúdo das abas fechadas.
 *
 * Por isso a fotografia de superfície (`scripts/fotografia.js`) NÃO migra para cá: as quatro
 * medidas dela dependem de `checkVisibility`, `innerText` e `getBoundingClientRect`, que em
 * jsdom não discriminam. Esta suíte cobre lógica; renderização continua no arreio.
 */

afterEach(() => {
  cleanup();
});
