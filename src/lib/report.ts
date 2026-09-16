import { institution } from '@/config/institution';
import type { Assessment, Atendimento, Observation, Student } from '@/types';
import type { DemoState } from '@/types/store';
import { isWithinPeriod, type DatePeriod } from '@/lib/metrics';

export type ReportKind = 'student' | 'class';

/** O período do relatório é o mesmo intervalo de datas usado pelas métricas. */
export type ReportPeriod = DatePeriod;

/** A class is a grade plus a group; neither identifies it on its own. */
export const classKeyOf = (student: Pick<Student, 'serie' | 'turma'>): string => `${student.serie}|${student.turma}`;

export const classLabelOf = (student: Pick<Student, 'serie' | 'turma'>): string =>
  `${student.serie} - Turma ${student.turma}`;

/** Classes that have at least one student in the store. */
export const classOptions = (students: Student[]): Array<{ key: string; label: string }> => {
  const labels = new Map<string, string>();
  for (const student of students) labels.set(classKeyOf(student), classLabelOf(student));
  return Array.from(labels, ([key, label]) => ({ key, label })).sort((a, b) =>
    a.label.localeCompare(b.label, institution.locale),
  );
};

const newestFirst = <T>(dateOf: (item: T) => string) => (a: T, b: T) => dateOf(b).localeCompare(dateOf(a));

export interface StudentReport {
  student: Student;
  observations: Observation[];
  appointments: Atendimento[];
  assessments: Assessment[];
}

export const buildStudentReport = (state: DemoState, studentId: string, period: ReportPeriod): StudentReport | null => {
  const student = state.students.find((item) => item.id === studentId);
  if (!student) return null;
  return {
    student,
    observations: state.observations
      .filter((item) => item.studentId === studentId && isWithinPeriod(item.data, period))
      .sort(newestFirst((item) => item.data)),
    appointments: state.appointments
      .filter((item) => item.studentId === studentId && isWithinPeriod(item.data, period))
      .sort(newestFirst((item) => `${item.data} ${item.horarioInicio}`)),
    assessments: state.assessments
      .filter((item) => item.studentId === studentId && isWithinPeriod(item.date, period))
      .sort(newestFirst((item) => item.date)),
  };
};

export interface ClassReportRow {
  student: Student;
  observations: number;
  appointments: number;
  assessments: number;
}

export interface ClassReport {
  label: string;
  rows: ClassReportRow[];
}

export const buildClassReport = (state: DemoState, classKey: string, period: ReportPeriod): ClassReport | null => {
  const students = state.students
    .filter((student) => classKeyOf(student) === classKey)
    .sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto, institution.locale));
  if (students.length === 0) return null;

  const countFor = <T extends { studentId: string }>(items: T[], studentId: string, dateOf: (item: T) => string) =>
    items.filter((item) => item.studentId === studentId && isWithinPeriod(dateOf(item), period)).length;

  return {
    label: classLabelOf(students[0]),
    rows: students.map((student) => ({
      student,
      observations: countFor(state.observations, student.id, (item) => item.data),
      appointments: countFor(state.appointments, student.id, (item) => item.data),
      assessments: countFor(state.assessments, student.id, (item) => item.date),
    })),
  };
};
