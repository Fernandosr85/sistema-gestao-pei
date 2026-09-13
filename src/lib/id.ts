/**
 * Id for records created in the browser. `crypto.randomUUID` only exists in
 * secure contexts (HTTPS or localhost), so plain-HTTP access falls back.
 */
export const createId = (prefix: string): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};
