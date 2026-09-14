import type { DispatchResult } from '@/types/store';

/** Sentence appended to success messages so they say where the record was kept. */
export const describeSaveLocation = ({ persistence }: DispatchResult): string => {
  switch (persistence) {
    case 'browser':
      return 'Salvo apenas neste navegador.';
    case 'memoryOnly':
      return 'O navegador não permitiu gravar: o registro some ao recarregar a página.';
    case 'disabled':
      return 'Registrado só nesta sessão; nada é gravado no navegador.';
  }
};
