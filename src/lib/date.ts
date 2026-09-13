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
