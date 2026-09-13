import { Info } from "lucide-react";
import { DEMO_MODE } from "@/config/institution";

interface DemoDataNoticeProps {
  /** What the surrounding screen shows, e.g. "Os indicadores de benchmarking". */
  subject?: string;
  /** Extra sentence for screens that imply a model, forecast or measurement. */
  detail?: string;
  className?: string;
}

/**
 * Marks a screen as illustrative.
 *
 * Every number rendered by this prototype comes from static fixtures in
 * `src/data/`. No model, no measurement and no real cohort backs any of it.
 * Any screen that shows a metric, projection, benchmark or budget figure must
 * render this notice.
 */
const DemoDataNotice = ({
  subject = "Os dados desta tela",
  detail,
  className = "",
}: DemoDataNoticeProps) => {
  if (!DEMO_MODE) return null;

  return (
    <div
      role="note"
      aria-label="Aviso sobre dados de demonstração"
      className={`flex items-start gap-3 rounded-lg border border-[hsl(var(--alert-info-border))] bg-[hsl(var(--alert-info-bg))] p-4 text-[hsl(var(--alert-info-text))] ${className}`}
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="text-sm leading-relaxed">
        <strong>Dados fictícios.</strong> {subject} são exemplos estáticos criados
        para demonstrar a interface. Não representam alunos, escolas, orçamentos
        ou resultados reais.
        {detail ? ` ${detail}` : ""}
      </p>
    </div>
  );
};

export default DemoDataNotice;
