import { appointmentStatusLabel } from '@/lib/appointment';
import { assessmentKindLabel, objectiveStatusLabel } from '@/lib/assessment';
import { calculateAge, formatLocalDate } from '@/lib/date';
import { labelFor, quickObservationContextOptions, quickObservationToneOptions } from '@/lib/observation';
import { classLabelOf } from '@/lib/report';
import type { StudentReport } from '@/lib/report';
import { studentProfileSections, studentStatusLabel, supportLevelLabel } from '@/lib/student';

interface StudentReportContentProps {
  report: StudentReport;
}

const StudentReportContent = ({ report }: StudentReportContentProps) => {
  const { student, observations, appointments, assessments } = report;
  const profileSections = studentProfileSections(student);

  // Guardian contact (phone and e-mail) stays out of the printout: the report does not need it.
  const identification: Array<[string, string]> = [
    ['Matrícula', student.matricula],
    ['Série e turma', classLabelOf(student)],
    ['Data de nascimento', `${formatLocalDate(student.dataNascimento)} (${calculateAge(student.dataNascimento)} anos)`],
    ['Status', studentStatusLabel(student.status)],
    ['Professor(a) responsável', student.professorResponsavel],
    ['Responsável', `${student.responsavel.nome} (${student.responsavel.parentesco})`],
    ['Diagnóstico', student.diagnostico],
    ['Nível de suporte', supportLevelLabel(student.nivelSuporte)],
  ];

  return (
    <div className="space-y-6 text-sm">
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Identificação</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
          {identification.map(([label, value]) => (
            <div key={label}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Comunicação, comportamento e rotina</h2>
        {profileSections.length === 0 ? (
          <p className="text-muted-foreground">Nada registrado no cadastro.</p>
        ) : (
          profileSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h3 className="font-semibold">{section.title}</h3>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
                {section.entries.map((entry) => (
                  <div key={entry.label}>
                    <dt className="text-muted-foreground">{entry.label}</dt>
                    <dd className="whitespace-pre-line">{entry.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Observações ({observations.length})</h2>
        {observations.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma observação no período.</p>
        ) : (
          <ul className="space-y-3">
            {observations.map((observation) => (
              <li key={observation.id} className="rounded-md border p-3">
                <p className="font-medium">
                  {formatLocalDate(observation.data)}
                  {observation.kind === 'quick' ? ` às ${observation.time} · Registro rápido` : ' · Observação estruturada'}
                  {` · ${observation.observador}`}
                </p>
                {observation.kind === 'quick' ? (
                  <>
                    <p className="text-muted-foreground">
                      {labelFor(quickObservationContextOptions, observation.context)} ·{' '}
                      {labelFor(quickObservationToneOptions, observation.tone)}
                    </p>
                    <p className="whitespace-pre-line">{observation.description}</p>
                  </>
                ) : (
                  <dl className="mt-1 space-y-1">
                    <div>
                      <dt className="inline font-medium">Ponto forte: </dt>
                      <dd className="inline">{observation.resumo.pontoForte}</dd>
                    </div>
                    <div>
                      <dt className="inline font-medium">Desafio: </dt>
                      <dd className="inline">{observation.resumo.desafio}</dd>
                    </div>
                    <div>
                      <dt className="inline font-medium">Ajustes necessários: </dt>
                      <dd className="inline">{observation.resumo.ajustesNecessarios}</dd>
                    </div>
                  </dl>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Atendimentos ({appointments.length})</h2>
        {appointments.length === 0 ? (
          <p className="text-muted-foreground">Nenhum atendimento no período.</p>
        ) : (
          <ul className="space-y-3">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="rounded-md border p-3">
                <p className="font-medium">
                  {formatLocalDate(appointment.data)}, {appointment.horarioInicio} - {appointment.horarioFim} ·{' '}
                  {appointment.tipo} · {appointmentStatusLabel(appointment.status)}
                </p>
                <p className="text-muted-foreground">Local: {appointment.local}</p>
                <p>Objetivos: {appointment.objetivos}</p>
                {appointment.ata && <p className="whitespace-pre-line">Ata: {appointment.ata}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Avaliações ({assessments.length})</h2>
        {assessments.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma avaliação no período.</p>
        ) : (
          <ul className="space-y-3">
            {assessments.map((assessment) => (
              <li key={assessment.id} className="rounded-md border p-3">
                <p className="font-medium">
                  {formatLocalDate(assessment.date)} · {assessmentKindLabel(assessment.kind)}
                  {assessment.quarter ? ` · ${assessment.quarter}º trimestre` : ''} · {assessment.assessor}
                </p>
                {assessment.objectives.map((objective) => (
                  <p key={objective.title} className="text-muted-foreground">
                    {objective.title}: {objective.progress}% ({objectiveStatusLabel(objective.status)})
                  </p>
                ))}
                <dl className="mt-1 space-y-1">
                  <div>
                    <dt className="inline font-medium">Conquistas: </dt>
                    <dd className="inline">{assessment.summary.achievements}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Desafios: </dt>
                    <dd className="inline">{assessment.summary.challenges}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Próximos passos: </dt>
                    <dd className="inline">{assessment.summary.nextSteps}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default StudentReportContent;
