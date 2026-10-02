import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { appointmentStatusLabel } from '@/lib/appointment';
import { formatLocalDate } from '@/lib/date';
import { appointmentOf, familyMeetingsOf, peiReviewFrequencyLabel, revisionsOfPei } from '@/lib/pei';
import { useDemoStore } from '@/store/useDemoStore';
import type { Pei } from '@/types/pei';

/**
 * A parte VI do manual, Avaliação e Monitoramento: periodicidade, revisões registradas e os
 * atendimentos com a família, que o manual trata como coautora do plano (5.2).
 *
 * Antes era texto fixo — "Avaliações trimestrais", "Última reunião: 18/10/2024" e um botão
 * desabilitado de ata. Agora a periodicidade vem do plano, as revisões da coleção própria, e as
 * reuniões da agenda de atendimentos, que já as registrava.
 */
export function PeiFollowUp({ pei }: { pei: Pei }) {
  const { state } = useDemoStore();
  const revisions = revisionsOfPei(state, pei.id);
  const familyMeetings = familyMeetingsOf(state, pei.studentId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Avaliação e monitoramento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Periodicidade de revisão:</span>{' '}
            {peiReviewFrequencyLabel(pei.reviewFrequency)}
          </p>
          <p>
            <span className="font-medium">Próxima revisão:</span> {formatLocalDate(pei.nextReviewOn)}
          </p>
          {/* Invariante 6: a origem da regra é o manual, e a tela diz isso. */}
          <p className="text-muted-foreground">
            A periodicidade trimestral é a que o manual deste repositório adota (seção 10.2); não é
            exigência de lei.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revisões registradas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {revisions.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma revisão registrada neste plano.</p>
          ) : (
            revisions.map((revision) => {
              const atendimento = revision.appointmentId
                ? appointmentOf(state, revision.appointmentId)
                : undefined;
              return (
                <div key={revision.id} className="rounded-md border p-3">
                  <p className="font-medium">
                    {formatLocalDate(revision.date)} — {revision.author}
                  </p>
                  <p className="text-muted-foreground">
                    Participantes: {revision.participants.join(', ')}
                  </p>
                  <p className="mt-1">{revision.summary}</p>
                  {/* A ata vive no atendimento, não aqui, e pode não estar preenchida. */}
                  {atendimento && (
                    <p className="mt-1 text-muted-foreground">
                      {atendimento.ata
                        ? `Ata do atendimento de ${formatLocalDate(atendimento.data)}: ${atendimento.ata}`
                        : `Atendimento de ${formatLocalDate(atendimento.data)} sem ata registrada.`}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atendimentos com a família</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {familyMeetings.length === 0 ? (
            <p className="text-muted-foreground">
              Nenhum atendimento com a família registrado para este estudante.
            </p>
          ) : (
            <ul className="space-y-2">
              {familyMeetings.map((atendimento) => (
                <li key={atendimento.id}>
                  <span className="font-medium">{formatLocalDate(atendimento.data)}</span>{' '}
                  <span className="text-muted-foreground">
                    ({appointmentStatusLabel(atendimento.status)}) — {atendimento.objetivos}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="text-muted-foreground">
            A família é coautora do plano no manual (seção 5.2); estes registros vêm da agenda de
            atendimentos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
