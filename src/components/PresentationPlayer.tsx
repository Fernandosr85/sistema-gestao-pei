import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home, X } from 'lucide-react';

export interface Slide {
  titulo: string;
  conteudo: JSX.Element;
}

interface PresentationPlayerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slides: Slide[];
  studentName: string;
  /** Encerrar devolve o diálogo à tela de configuração, que é de quem monta os slides. */
  onEnd: () => void;
}

/**
 * A apresentação rodando: um slide por vez, com teclado e anúncio.
 *
 * Separado de `PresentationModeDialog` na varredura de coerência da Etapa 9, porque o arquivo
 * tinha nascido com 405 linhas — acima do limite da convenção, escrito na mesma etapa que
 * media os outros. Separação sem mudança de comportamento: os mesmos elementos, os mesmos
 * nomes acessíveis, os mesmos testes.
 *
 * A MECÂNICA DE ACESSIBILIDADE É DA ETAPA 3 e continua inteira aqui: a troca de slide não
 * movia o foco nem era anunciada — quem usa leitor de tela ouvia o nome do botão "Próximo" e
 * nada mais. O slide é uma região com nome que inclui o número e o título, e o foco vai para
 * ela a cada troca: é o leitor lendo o nome da região que anuncia "Slide 3 de 8: …". As setas
 * esquerda e direita navegam, o que antes só o clique fazia.
 */
export function PresentationPlayer({ open, onOpenChange, slides, studentName, onEnd }: PresentationPlayerProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = slides.length;

  const nextSlide = () => {
    if (currentSlide < totalSlides) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 1) setCurrentSlide(currentSlide - 1);
  };

  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    slideRef.current?.focus();
  }, [currentSlide]);

  const handleSlideKeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextSlide();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prevSlide();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/*
        * O foco de abertura é declarado, e não disputado. Antes da separação, o diálogo já
        * estava montado quando a apresentação começava, e o efeito do slide corria DEPOIS do
        * foco automático do Radix. Com o player montando junto, os dois passaram a correr na
        * mesma hora e o Radix ganhava: medido no navegador, o foco deixava de chegar ao slide 1
        * (e só no 1 — a troca de slide continuava funcionando). `onOpenAutoFocus` é o ponto em
        * que o Radix pergunta para onde o foco vai, e aqui a resposta é a região do slide.
        */}
      <DialogContent
        className="max-h-[95vh] max-w-[95vw] p-0"
        onKeyDown={handleSlideKeys}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          slideRef.current?.focus();
        }}
      >
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
                <Button variant="default" size="lg" onClick={onEnd}>
                  <Home className="mr-2 h-5 w-5" aria-hidden="true" />
                  Início
                </Button>
              )}

              <Button variant="outline" size="lg" onClick={onEnd}>
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
