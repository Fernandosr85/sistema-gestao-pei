import { useEffect, useState } from 'react';

/**
 * Movimento reduzido: a preferência do app e a do sistema, juntas, para quem anima em
 * JavaScript.
 *
 * O CSS deste projeto já zera transição e animação sob `data-a11y-motion="reduzido"`
 * (`src/index.css`) e o navegador trata `prefers-reduced-motion` por conta própria. Quem
 * escapa dos dois é animação feita em JavaScript: o Recharts interpola os caminhos do SVG
 * quadro a quadro com `react-smooth`, sem consultar preferência nenhuma. Medido na Etapa 13:
 * com "Reduzir animações" ligada, os setores da rosca continuavam aparecendo entre 3,3 s e
 * 4,0 s, idêntico a sem a preferência.
 *
 * As duas fontes entram em OU, porque nenhuma substitui a outra: a do sistema vale para quem
 * configurou o sistema operacional e nunca abriu as preferências daqui; a do app vale para
 * quem usa um computador compartilhado, ou um sistema que não oferece a opção.
 *
 * Reage a mudança nas duas: a preferência do app é um atributo no elemento raiz, escrito por
 * `applyA11yPreferences`, e um `MutationObserver` nesse atributo vê o ajuste no mesmo instante
 * em que a pessoa o faz, sem recarregar a página.
 */
const CONSULTA_DO_SISTEMA = '(prefers-reduced-motion: reduce)';
const ATRIBUTO_DO_APP = 'data-a11y-motion';

const sistemaPedeReduzir = (): boolean => {
  // jsdom não tem matchMedia, e navegador com armazenamento restrito pode lançar aqui.
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia(CONSULTA_DO_SISTEMA).matches;
  } catch {
    return false;
  }
};

const appPedeReduzir = (): boolean =>
  typeof document !== 'undefined' &&
  document.documentElement.getAttribute(ATRIBUTO_DO_APP) === 'reduzido';

/** A leitura, sem React: serve ao primeiro render e a qualquer medição fora de componente. */
export const lerMovimentoReduzido = (): boolean => appPedeReduzir() || sistemaPedeReduzir();

export const useReducedMotion = (): boolean => {
  const [reduzido, setReduzido] = useState<boolean>(lerMovimentoReduzido);

  useEffect(() => {
    const reavaliar = () => setReduzido(lerMovimentoReduzido());

    // O primeiro render pode ter acontecido antes de `applyA11yPreferences` rodar.
    reavaliar();

    const observador = new MutationObserver(reavaliar);
    observador.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [ATRIBUTO_DO_APP],
    });

    let consulta: MediaQueryList | null = null;
    if (typeof window.matchMedia === 'function') {
      try {
        consulta = window.matchMedia(CONSULTA_DO_SISTEMA);
        consulta.addEventListener?.('change', reavaliar);
      } catch {
        consulta = null;
      }
    }

    return () => {
      observador.disconnect();
      consulta?.removeEventListener?.('change', reavaliar);
    };
  }, []);

  return reduzido;
};
