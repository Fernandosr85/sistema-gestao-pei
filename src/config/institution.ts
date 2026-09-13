/**
 * Single configuration point for the institution running this system.
 *
 * The system ships with neutral placeholder values so it can be deployed by any
 * school or network. Change this file (or wire it to your own environment) to
 * adapt the application — no institution name, unit list or enrollment format
 * should be hardcoded anywhere else in `src/`.
 */

export interface InstitutionUnit {
  id: string;
  name: string;
}

export const institution = {
  /** Full institution name, shown in page titles and reports. */
  name: "Instituição de Ensino",
  /** Short label used in the header and compact spaces. */
  shortName: "PEI",
  /** How a student identifier is called in this institution. */
  enrollmentLabel: "Matrícula",
  /** Prefix used when generating example enrollment codes. */
  enrollmentPrefix: "MAT",
  /** How a group of schools is called ("Rede", "Distrito", "Secretaria"...). */
  networkLabel: "Rede",
  /** Units/campuses available in the profile and management screens. */
  units: [
    { id: "unit-1", name: "Unidade 1" },
    { id: "unit-2", name: "Unidade 2" },
    { id: "unit-3", name: "Unidade 3" },
  ] as InstitutionUnit[],
  /** Example domain used by demo data. Must stay non-deliverable. */
  exampleEmailDomain: "example.org",
  locale: "pt-BR",
  currency: "BRL",
  timeZone: "America/Sao_Paulo",
} as const;

/**
 * Demo mode. While true, the UI must label every dataset as fictional and no
 * screen may present mock numbers as measured evidence, and records created in
 * the UI are kept in this browser's localStorage. While false, the demo store
 * runs in memory only and never touches localStorage.
 */
export const DEMO_MODE = true;

/** Name shown for the person using the prototype while there is no authentication. */
export const DEMO_USER_NAME = "Usuário de demonstração";
