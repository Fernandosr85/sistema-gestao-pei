import { Building2 } from 'lucide-react';
import { illustrativeScenario } from '@/config/institution';
import { studentCounts } from '@/lib/metrics';
import { useDemoStore } from '@/store/useDemoStore';

interface IllustrativeScenarioNoticeProps {
  className?: string;
}

/**
 * Names the fictional school behind the management panel.
 *
 * Every tab of Gestão shows a fixed scenario — a school with its own students, team, alerts and
 * budget — that is not the school kept in the demo store. The notice says so once, above the
 * tabs, next to the store's own student count, so the two are never read as the same school.
 * It is shown outside demo mode too: the scenario stays fixed either way.
 */
const IllustrativeScenarioNotice = ({ className = '' }: IllustrativeScenarioNoticeProps) => {
  const { state } = useDemoStore();
  const { total } = studentCounts(state);
  const cadastrados = total === 1 ? '1 aluno cadastrado' : `${total} alunos cadastrados`;

  return (
    <div
      role="note"
      aria-label="Aviso sobre o cenário ilustrativo"
      className={`flex items-start gap-3 rounded-lg border border-[hsl(var(--alert-info-border))] bg-[hsl(var(--alert-info-bg))] p-4 text-[hsl(var(--alert-info-text))] ${className}`}
    >
      <Building2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="space-y-1 text-sm leading-relaxed">
        <p>
          <strong>Cenário ilustrativo: {illustrativeScenario.name}.</strong> Todas as abas deste
          painel descrevem uma escola fictícia, com {illustrativeScenario.studentsWithPei} alunos com
          PEI e com equipe, alertas e orçamento próprios.
        </p>
        <p>
          Não é a escola deste navegador, que tem {cadastrados}: nenhum número, nome ou alerta
          daqui vem dela, e o que for cadastrado no sistema não muda este painel.
        </p>
      </div>
    </div>
  );
};

export default IllustrativeScenarioNotice;
