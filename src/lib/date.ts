import { institution } from '@/config/institution';

/**
 * Age must always be derived from the birth date. Storing it produces records
 * that silently go stale: a student born in 2016 was recorded as 8 years old
 * and stayed 8 forever.
 */
export const calculateAge = (birthDate: string, reference: Date = new Date()): number => {
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return 0;

  let age = reference.getFullYear() - birth.getFullYear();
  const monthDiff = reference.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && reference.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
};

const pad = (value: number): string => String(value).padStart(2, '0');

/**
 * Local calendar date as YYYY-MM-DD. `toISOString()` is UTC, which in Brazil
 * already reads as tomorrow after 21:00.
 */
export const todayLocalISO = (reference: Date = new Date()): string =>
  `${reference.getFullYear()}-${pad(reference.getMonth() + 1)}-${pad(reference.getDate())}`;

/** Local time as HH:mm. */
export const currentLocalTime = (reference: Date = new Date()): string =>
  `${pad(reference.getHours())}:${pad(reference.getMinutes())}`;

/**
 * Displays a YYYY-MM-DD date. `new Date('2025-11-19')` is parsed as UTC
 * midnight and renders as the previous day in Brazil, so build it in local time.
 */
export const formatLocalDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  return new Date(year, month - 1, day).toLocaleDateString(institution.locale);
};
