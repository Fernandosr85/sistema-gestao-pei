import type { ClassReport } from '@/lib/report';
import { studentStatusLabel, supportLevelLabel } from '@/lib/student';

interface ClassReportContentProps {
  report: ClassReport;
}

const ClassReportContent = ({ report }: ClassReportContentProps) => (
  <section className="space-y-2 text-sm">
    <h2 className="text-lg font-semibold">Estudantes ({report.rows.length})</h2>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="mb-2 text-left text-muted-foreground">
          Quantidade de registros de cada estudante no período.
        </caption>
        <thead>
          <tr className="border-b">
            <th scope="col" className="py-2 pr-4 font-semibold">Estudante</th>
            <th scope="col" className="py-2 pr-4 font-semibold">Status</th>
            <th scope="col" className="py-2 pr-4 font-semibold">Nível de suporte</th>
            <th scope="col" className="py-2 pr-4 text-right font-semibold">Observações</th>
            <th scope="col" className="py-2 pr-4 text-right font-semibold">Atendimentos</th>
            <th scope="col" className="py-2 text-right font-semibold">Avaliações</th>
          </tr>
        </thead>
        <tbody>
          {report.rows.map((row) => (
            <tr key={row.student.id} className="border-b">
              <th scope="row" className="py-2 pr-4 font-medium">{row.student.nomeCompleto}</th>
              <td className="py-2 pr-4">{studentStatusLabel(row.student.status)}</td>
              <td className="py-2 pr-4">{supportLevelLabel(row.student.nivelSuporte)}</td>
              <td className="py-2 pr-4 text-right">{row.observations}</td>
              <td className="py-2 pr-4 text-right">{row.appointments}</td>
              <td className="py-2 text-right">{row.assessments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default ClassReportContent;
