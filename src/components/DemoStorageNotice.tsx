import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDemoStore } from '@/store/useDemoStore';
import type { DiscardedCounts } from '@/types/store';

/*
 * Nomes das coleções em português, no singular e no plural, para a contagem do que foi
 * descartado na carga. A contagem aparece na tela de propósito: "descartei 3 observações" e
 * "sumiram 3 observações" são coisas diferentes, e é o número que separa as duas.
 */
const COLLECTION_LABELS: Record<keyof DiscardedCounts, [string, string]> = {
  students: ['estudante', 'estudantes'],
  observations: ['observação', 'observações'],
  appointments: ['atendimento', 'atendimentos'],
  assessments: ['avaliação', 'avaliações'],
  resources: ['recurso', 'recursos'],
  reviews: ['avaliação de recurso', 'avaliações de recurso'],
  favorites: ['favorito', 'favoritos'],
};

const describeDiscarded = (counts: DiscardedCounts): string =>
  (Object.keys(COLLECTION_LABELS) as Array<keyof DiscardedCounts>)
    .filter((key) => counts[key] > 0)
    .map((key) => `${counts[key]} ${COLLECTION_LABELS[key][counts[key] === 1 ? 0 : 1]}`)
    .join(', ');

/**
 * Required by CLAUDE.md for any local storage: states that records stay in this
 * browser and that demo mode is not fit for real data. Hidden when DEMO_MODE is
 * off, because then nothing is written to the browser.
 */
const DemoStorageNotice = () => {
  const { persistence, discardedStoredData, discardedRecords, dispatch } = useDemoStore();
  const { toast } = useToast();

  if (persistence === 'disabled') return null;

  const handleReset = () => {
    const result = dispatch({ type: 'demo/reset' });
    toast({
      title: 'Dados de demonstração restaurados',
      description:
        result.persistence === 'browser'
          ? 'Os registros criados neste navegador foram apagados.'
          : 'Os registros desta sessão foram descartados.',
    });
  };

  return (
    <div
      role="region"
      aria-label="Aviso sobre o armazenamento dos dados"
      className="border-b border-[hsl(var(--alert-warning-border))] bg-[hsl(var(--alert-warning-bg))] text-[hsl(var(--alert-warning-text))] print:hidden"
    >
      <div className="container flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <p className="flex items-start gap-2 text-sm leading-relaxed">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            <strong>Modo demonstração.</strong>{' '}
            {persistence === 'browser'
              ? 'O que você cadastra fica salvo apenas neste navegador, sem criptografia, e pode ser apagado a qualquer momento.'
              : 'Este navegador não permitiu salvar dados: o que você cadastrar some ao recarregar a página.'}{' '}
            Não use dados reais de estudantes.
            {discardedStoredData
              ? ' Dados salvos anteriormente estavam em formato incompatível e foram descartados.'
              : ''}
          </span>
        </p>
        {discardedRecords ? (
          <p className="flex items-start gap-2 text-sm leading-relaxed md:order-last md:w-full">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              <strong>Registros descartados na abertura:</strong> {describeDiscarded(discardedRecords)}.
              Estavam salvos neste navegador em formato que não corresponde ao esperado, ou apontavam
              para um registro descartado. O resto foi carregado normalmente.
            </span>
          </p>
        ) : null}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="shrink-0">
              Restaurar dados de demonstração
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Restaurar dados de demonstração?</AlertDialogTitle>
              <AlertDialogDescription>
                Todos os registros cadastrados neste navegador serão apagados e os dados fictícios
                originais voltarão. Não é possível desfazer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Restaurar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DemoStorageNotice;
