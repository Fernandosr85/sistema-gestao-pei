import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Play, X, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import DemoDataNotice from '@/components/DemoDataNotice';
import { assessmentsOf } from '@/lib/assessment';
import { formatLocalDate } from '@/lib/date';
import { studentNameOf } from '@/lib/metrics';
import {
  activePeiOf,
  goalCountsByStatus,
  goalsOfPei,
  notesOfGoal,
  peiGoalAreaLabel,
  peiGoalStatusLabel,
  peiGoalsProgress,
} from '@/lib/pei';
import { useDemoStore } from '@/store/useDemoStore';

interface PresentationModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Id, não nome: os slides são feitos dos registros do estudante. */
  studentId: string;
}

/**
 * A apresentação do progresso para a família, montada do plano e das avaliações.
 *
 * O QUE ERA (até a Etapa 9): doze slides fixos, iguais para qualquer estudante — 85% num
 * círculo, "12 de 15 objetivos concluídos", "aumento de 15% desde o último trimestre", três
 * conquistas inventadas (uma delas citando a prancha de CAA de outra aluna, resíduo do achado 1)
 * e oito slides com "Conteúdo detalhado em desenvolvimento...". Era o material que uma escola
 * levaria para uma reunião com a família: a tela em que mentir custa mais caro de todas.
 *
 * O QUE É AGORA: um slide por parte do que está registrado, e o número de slides vem do plano —
 * capa, progresso, uma meta por slide, conquistas da última avaliação e próximos passos. Sem
 * plano vigente não há apresentação, e o diálogo diz isso em vez de montar slides vazios.
 *
 * A mecânica de acessibilidade da Etapa 3 fica: região com nome que inclui o número do slide,
 * foco movido a cada troca (é o que faz o leitor anunciar "Slide 3 de N") e navegação por setas.
 */
export const PresentationModeDialog = ({ open, onOpenChange, studentId }: PresentationModeDialogProps) => {
  const { state } = useDemoStore();
  const studentName = studentNameOf(state, studentId);
  const pei = activePeiOf(state, studentId);
  const goals = pei ? goalsOfPei(state, pei.id) : [];
  const progresso = peiGoalsProgress(goals);
  const contagens = goalCountsByStatus(goals);
  const avaliacoes = assessmentsOf(state, studentId);
  const ultima = avaliacoes[avaliacoes.length - 1];

  const [isPresenting, setIsPresenting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [format, setFormat] = useState('interactive');

  /*
   * Os slides são DERIVADOS: a quantidade vem do plano, não de uma constante. O "12" antigo era
   * número de slides de um exemplo, e oito deles não tinham conteúdo.
   */
  const slides: Array<{ titulo: string; conteudo: JSX.Element }> = [];

  if (pei) {
    slides.push({
      titulo: 'Capa',
      conteudo: (
        <div className="space-y-6 text-center">
          <h1 className="text-5xl font-bold text-foreground">{studentName}</h1>
          <p className="text-xl text-muted-foreground">PEI {pei.term}</p>
          <div className="mx-auto my-10 h-1 w-64 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <h2 className="text-3xl font-semibold text-primary">Apresentação do progresso</h2>
          <p className="text-lg text-muted-foreground">
            Vigência de {formatLocalDate(pei.startsOn)} a {formatLocalDate(pei.endsOn)}
          </p>
        </div>
      ),
    });

    slides.push({
      titulo: 'Progresso nas metas do PEI',
      conteudo: (
        <div className="w-full max-w-3xl space-y-8 text-center">
          <h2 className="text-4xl font-bold">Progresso nas metas do PEI</h2>
          {progresso === undefined ? (
            <p className="text-xl text-muted-foreground">Nenhuma meta registrada neste plano.</p>
          ) : (
            <>
              <p className="text-6xl font-bold text-primary">{progresso}%</p>
              <p className="text-xl text-muted-foreground">Média das {goals.length} metas do plano</p>
              {/* Concordância: o slide é lido em voz alta numa reunião, "1 alcançadas" destoa. */}
              <ul className="space-y-2 text-xl">
                <li>
                  {contagens.achieved} {contagens.achieved === 1 ? 'alcançada' : 'alcançadas'}
                </li>
                <li>{contagens.inProgress} em progresso</li>
                <li>
                  {contagens.notStarted} {contagens.notStarted === 1 ? 'não iniciada' : 'não iniciadas'}
                </li>
                {contagens.needsReview > 0 && (
                  <li>
                    {contagens.needsReview}{' '}
                    {contagens.needsReview === 1 ? 'precisa de revisão' : 'precisam de revisão'}
                  </li>
                )}
              </ul>
            </>
          )}
        </div>
      ),
    });

    for (const goal of goals) {
      const notas = notesOfGoal(state, goal.id);
      slides.push({
        titulo: goal.title,
        conteudo: (
          <div className="w-full max-w-4xl space-y-6">
            <p className="text-center text-lg text-muted-foreground">{peiGoalAreaLabel(goal.area)}</p>
            <h2 className="text-center text-4xl font-bold">{goal.title}</h2>
            <p className="text-center text-2xl text-primary">
              {goal.progress}% · {peiGoalStatusLabel(goal.status)}
            </p>
            <Card>
              <CardContent className="space-y-3 pt-6 text-lg">
                <p>{goal.description}</p>
                <p>
                  <span className="font-semibold">Como trabalhamos:</span> {goal.strategies.join('; ')}
                </p>
                <p>
                  <span className="font-semibold">Próxima etapa:</span> {goal.nextStep}
                </p>
                {notas.length > 0 && (
                  <p>
                    <span className="font-semibold">Última observação ({formatLocalDate(notas[0].date)}):</span>{' '}
                    {notas[0].text}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ),
      });
    }

    slides.push({
      titulo: 'Conquistas e desafios',
      conteudo: (
        <div className="w-full max-w-4xl space-y-6">
          <h2 className="text-center text-4xl font-bold">Conquistas e desafios</h2>
          {!ultima ? (
            <p className="text-center text-xl text-muted-foreground">
              Nenhuma avaliação registrada para este estudante.
            </p>
          ) : (
            <Card>
              <CardContent className="space-y-4 pt-6 text-lg">
                <p className="text-muted-foreground">
                  Da avaliação de {formatLocalDate(ultima.date)}, por {ultima.assessor}.
                </p>
                <p>
                  <span className="font-semibold">Conquistas:</span> {ultima.summary.achievements}
                </p>
                <p>
                  <span className="font-semibold">Desafios:</span> {ultima.summary.challenges}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ),
    });

    slides.push({
      titulo: 'Próximos passos',
      conteudo: (
        <div className="w-full max-w-4xl space-y-6">
          <h2 className="text-center text-4xl font-bold">Próximos passos</h2>
          <Card>
            <CardContent className="space-y-4 pt-6 text-lg">
              {ultima && (
                <p>
                  <span className="font-semibold">Da última avaliação:</span> {ultima.summary.nextSteps}
                </p>
              )}
              {goals.length > 0 && (
                <div>
                  <p className="font-semibold">Em cada meta:</p>
                  <ul className="ml-6 list-disc space-y-1">
                    {goals.map((goal) => (
                      <li key={goal.id}>
                        {goal.title}: {goal.nextStep}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="border-t pt-4">
                <span className="font-semibold">Próxima revisão do PEI:</span>{' '}
                {formatLocalDate(pei.nextReviewOn)}
              </p>
            </CardContent>
          </Card>
        </div>
      ),
    });
  }

  const totalSlides = slides.length;

  const handleStartPresentation = () => {
    setIsPresenting(true);
    setCurrentSlide(1);
  };

  const handleEndPresentation = () => {
    setIsPresenting(false);
    setCurrentSlide(1);
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 1) setCurrentSlide(currentSlide - 1);
  };

  /*
   * A troca de slide não movia o foco nem era anunciada: quem usa leitor de tela ouvia o
   * nome do botão "Próximo" e nada mais. O slide vira uma região com nome que inclui o
   * número, e o foco vai para ela a cada troca — é o leitor lendo o nome da região que
   * anuncia "Slide 3 de N". Também não havia navegação por setas: só o clique nos botões.
   */
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPresenting) slideRef.current?.focus();
  }, [currentSlide, isPresenting]);

  const handleSlideKeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextSlide();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prevSlide();
    }
  };

  if (isPresenting && totalSlides > 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[95vh] max-w-[95vw] p-0" onKeyDown={handleSlideKeys}>
          <DialogHeader className="sr-only">
            <DialogTitle>Apresentação do progresso de {studentName}</DialogTitle>
            <DialogDescription>
              {totalSlides} slides montados a partir do PEI e das avaliações deste estudante. Use as
              setas esquerda e direita para navegar, ou os botões no rodapé.
            </DialogDescription>
          </DialogHeader>

          {/* `min-w-0` porque item de grade tem largura mínima automática: sem ele, o slide
              cresce até caber o conteúdo e estoura o diálogo em telas estreitas. */}
          <div className="relative flex h-[90vh] w-full min-w-0 flex-col bg-gradient-to-br from-primary/5 to-accent/5">
            <div
              ref={slideRef}
              tabIndex={-1}
              role="region"
              aria-roledescription="slide"
              aria-label={`Slide ${currentSlide} de ${totalSlides}: ${slides[currentSlide - 1].titulo}`}
              className="flex min-w-0 flex-1 items-center justify-center overflow-y-auto p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-12"
            >
              {slides[currentSlide - 1].conteudo}
            </div>

            <div className="py-4 text-center text-sm text-muted-foreground">
              Slide {currentSlide} de {totalSlides} · montado com os registros de {studentName}
            </div>

            {/* Controles de Navegação. Em 320 px, ou com zoom de 200%, os três botões não
                cabem lado a lado e o rodapé estourava a largura; agora quebram linha. */}
            <div className="border-t bg-background/95 p-4 backdrop-blur">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button variant="outline" size="lg" onClick={prevSlide} disabled={currentSlide === 1}>
                  <ChevronLeft className="mr-2 h-5 w-5" aria-hidden="true" />
                  Anterior
                </Button>

                {currentSlide < totalSlides ? (
                  <Button variant="default" size="lg" onClick={nextSlide}>
                    Próximo
                    <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button variant="default" size="lg" onClick={handleEndPresentation}>
                    <Home className="mr-2 h-5 w-5" aria-hidden="true" />
                    Início
                  </Button>
                )}

                <Button variant="outline" size="lg" onClick={handleEndPresentation}>
                  <X className="mr-2 h-5 w-5" aria-hidden="true" />
                  Encerrar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Modo apresentação para reunião com a família</DialogTitle>
          <DialogDescription>
            Monta uma apresentação do progresso de {studentName} com o que está registrado no PEI e
            nas avaliações.
          </DialogDescription>
        </DialogHeader>

        <DemoDataNotice
          subject="O progresso, as metas, as conquistas e os próximos passos dos slides"
          detail={`Vêm dos registros de demonstração de ${studentName}, com conteúdo fictício.`}
        />

        {!pei ? (
          <Card>
            <CardContent className="space-y-2 pt-6 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Sem PEI vigente, não há apresentação.</p>
              <p>
                Os slides são montados das metas do plano e das avaliações registradas. Enquanto não
                houver plano vigente para este estudante, não há o que apresentar — e inventar
                conteúdo para uma reunião com a família seria o pior lugar possível para fazer isso.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-6 pt-6">
                <h3 className="text-lg font-semibold">Configurações da apresentação</h3>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Formato de saída:</Label>
                  <RadioGroup value={format} onValueChange={setFormat}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="interactive" id="interactive" />
                      <Label htmlFor="interactive">Apresentação interativa (navegável no navegador)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="video" id="video" disabled aria-describedby="formato-indisponivel" />
                      <Label htmlFor="video">Vídeo MP4 (gravado com narração)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id="pdf" disabled aria-describedby="formato-indisponivel" />
                      <Label htmlFor="pdf">PDF para impressão</Label>
                    </div>
                  </RadioGroup>
                  <p id="formato-indisponivel" className="text-xs text-muted-foreground">
                    Vídeo e PDF não são gerados neste protótipo; só a apresentação interativa funciona.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-6">
                {/*
                  * O preview era uma miniatura falsa com "Slides estimados: 12" e "Duração
                  * estimada: ~15 minutos" — número de slides de um exemplo e um tempo que nada
                  * media. Agora lista os slides que serão montados, que é o que um preview é.
                  */}
                <h4 className="mb-4 font-semibold">O que a apresentação vai mostrar</h4>
                <ol className="list-inside list-decimal space-y-1 text-sm">
                  {slides.map((slide) => (
                    <li key={slide.titulo}>{slide.titulo}</li>
                  ))}
                </ol>
                <p className="mt-4 text-sm text-muted-foreground">
                  {totalSlides} slides, montados do PEI {pei.term} e das avaliações registradas.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleStartPresentation}>
                <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                Iniciar apresentação
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
