/*
 * O que jsdom não tem e a árvore React de verdade precisa.
 *
 * Cada remendo aqui está registrado com o erro exato que ele evita, medido ao escrever o teste
 * de fluxo. Nenhum deles muda comportamento de produção: são APIs do navegador que o jsdom não
 * implementa, e sem elas o componente estoura antes de qualquer asserção.
 *
 * Importe este módulo só nos testes que montam componentes. Os testes de lógica não precisam
 * dele, e quanto menos ambiente falso houver em volta de um teste, mais ele vale.
 */

// sonner (o segundo Toaster do App) lê o esquema de cores no primeiro efeito.
// Sem isto: "TypeError: window.matchMedia is not a function".
window.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia;

// Radix Select consulta a API de pointer capture ao abrir a lista.
// Sem isto: "TypeError: target.hasPointerCapture is not a function".
Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};

// Radix rola a opção selecionada para dentro da lista.
// Sem isto: "TypeError: ...scrollIntoView is not a function".
Element.prototype.scrollIntoView = () => {};
