/**
 * Preferências de acessibilidade deste navegador.
 *
 * Ficam fora do store de demonstração, em chave própria, por três motivos: não são dado de
 * demonstração; precisam sobreviver quando o envelope do store é descartado por versão
 * desconhecida; e não exigem uma versão nova do store só para existirem.
 *
 * São aplicadas por atributo de dados no elemento raiz, e o CSS reage a eles em
 * `src/index.css`. Nada aqui depende de conta de usuário nem sai do navegador.
 */

export type FontSizePreference = 'padrao' | 'grande' | 'muito-grande';

export interface A11yPreferences {
  /** Aumenta o contraste de todos os tokens de cor. */
  altoContraste: boolean;
  /** Escala a raiz em rem, o que aumenta texto, espaçamentos e controles juntos. */
  tamanhoFonte: FontSizePreference;
  /** Encurta transições e animações, somando-se a `prefers-reduced-motion`. */
  reduzirAnimacoes: boolean;
  /** Contorno de foco mais espesso e visível. */
  destacarFoco: boolean;
  /** Alvo mínimo de 44 px em botões e links, o critério 2.5.5 (AAA) como opção. */
  botoesMaiores: boolean;
}

export const A11Y_STORAGE_KEY = 'pei-a11y-preferences';

const STORAGE_VERSION = 1;

export const defaultA11yPreferences: A11yPreferences = {
  altoContraste: false,
  tamanhoFonte: 'padrao',
  reduzirAnimacoes: false,
  destacarFoco: false,
  botoesMaiores: false,
};

interface StoredEnvelope {
  version: number;
  savedAt: string;
  preferences: A11yPreferences;
}

const isFontSize = (value: unknown): value is FontSizePreference =>
  value === 'padrao' || value === 'grande' || value === 'muito-grande';

/**
 * Lê campo a campo e cai no padrão em qualquer divergência. Preferência de acessibilidade
 * mal lida não pode derrubar a aplicação nem deixar a pessoa sem o ajuste que ela escolheu.
 */
const parsePreferences = (value: unknown): A11yPreferences => {
  if (typeof value !== 'object' || value === null) return defaultA11yPreferences;
  const raw = value as Record<string, unknown>;
  return {
    altoContraste: raw.altoContraste === true,
    tamanhoFonte: isFontSize(raw.tamanhoFonte) ? raw.tamanhoFonte : defaultA11yPreferences.tamanhoFonte,
    reduzirAnimacoes: raw.reduzirAnimacoes === true,
    destacarFoco: raw.destacarFoco === true,
    botoesMaiores: raw.botoesMaiores === true,
  };
};

export const loadA11yPreferences = (): A11yPreferences => {
  if (typeof window === 'undefined') return defaultA11yPreferences;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(A11Y_STORAGE_KEY);
  } catch {
    // Navegador com armazenamento bloqueado: segue com o padrão, sem quebrar.
    return defaultA11yPreferences;
  }
  if (!raw) return defaultA11yPreferences;
  try {
    const envelope = JSON.parse(raw) as Partial<StoredEnvelope>;
    if (envelope.version !== STORAGE_VERSION) return defaultA11yPreferences;
    return parsePreferences(envelope.preferences);
  } catch {
    return defaultA11yPreferences;
  }
};

/** Diz onde a preferência ficou, para a interface poder ser honesta sobre isso. */
export type PreferenceSaveResult = 'browser' | 'memoryOnly';

export const saveA11yPreferences = (preferences: A11yPreferences): PreferenceSaveResult => {
  try {
    const envelope: StoredEnvelope = {
      version: STORAGE_VERSION,
      savedAt: new Date().toISOString(),
      preferences,
    };
    window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(envelope));
    return 'browser';
  } catch {
    return 'memoryOnly';
  }
};

/**
 * Escreve os atributos que o CSS observa. Atributo ausente significa "padrão", para o
 * seletor não precisar cobrir o caso comum.
 */
export const applyA11yPreferences = (preferences: A11yPreferences): void => {
  const root = document.documentElement;
  const alternar = (atributo: string, valor: string | null) => {
    if (valor === null) root.removeAttribute(atributo);
    else root.setAttribute(atributo, valor);
  };

  alternar('data-a11y-contrast', preferences.altoContraste ? 'alto' : null);
  alternar('data-a11y-font', preferences.tamanhoFonte === 'padrao' ? null : preferences.tamanhoFonte);
  alternar('data-a11y-motion', preferences.reduzirAnimacoes ? 'reduzido' : null);
  alternar('data-a11y-focus', preferences.destacarFoco ? 'destacado' : null);
  alternar('data-a11y-targets', preferences.botoesMaiores ? 'grandes' : null);
};
