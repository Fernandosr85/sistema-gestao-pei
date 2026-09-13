import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, Eye, X, ChevronLeft, ChevronRight, Home, 
  Pause, Settings, FileText, Video 
} from 'lucide-react';

interface PresentationModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
}

export const PresentationModeDialog = ({ open, onOpenChange, studentName }: PresentationModeDialogProps) => {
  const [isPresenting, setIsPresenting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 12;

  const [config, setConfig] = useState({
    period: 'trimestre',
    includeOverview: true,
    includePEI: true,
    includeGraphs: true,
    includeAchievements: true,
    includeMedia: true,
    includeRecommendations: true,
    includeNextGoals: true,
    includeComparison: false,
    includeAttendance: false,
    style: 'accessible',
    language: 'pt',
    format: 'interactive',
  });

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

  if (isPresenting) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          {/* Tela de Apresentação em Fullscreen */}
          <div className="relative w-full h-[90vh] bg-gradient-to-br from-primary/5 to-accent/5 flex flex-col">
            {/* Conteúdo do Slide */}
            <div className="flex-1 flex items-center justify-center p-12">
              {currentSlide === 1 && (
                <div className="text-center space-y-8">
                  <div className="text-6xl mb-8">👧</div>
                  <h1 className="text-5xl font-bold text-foreground">{studentName.toUpperCase()}</h1>
                  <p className="text-2xl text-muted-foreground">2º Ano EF - Turma C</p>
                  <p className="text-xl text-muted-foreground">Trimestre 3 de 2024 (Set-Nov)</p>
                  <div className="my-12 h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
                  <div className="space-y-4">
                    <h2 className="text-3xl font-semibold text-primary">🎯 Apresentação do Progresso</h2>
                    <p className="text-xl text-muted-foreground">Reunião com Família</p>
                    <p className="text-lg text-muted-foreground">21 de Novembro de 2024</p>
                  </div>
                </div>
              )}

              {currentSlide === 2 && (
                <div className="w-full max-w-4xl space-y-8">
                  <h2 className="text-4xl font-bold text-center mb-12">📊 PROGRESSO GERAL DO TRIMESTRE</h2>
                  <div className="flex items-center justify-center mb-8">
                    <div className="relative w-64 h-64">
                      <svg className="w-64 h-64 transform -rotate-90">
                        <circle
                          cx="128"
                          cy="128"
                          r="100"
                          stroke="hsl(var(--muted))"
                          strokeWidth="20"
                          fill="none"
                        />
                        <circle
                          cx="128"
                          cy="128"
                          r="100"
                          stroke="hsl(var(--primary))"
                          strokeWidth="20"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 100}`}
                          strokeDashoffset={`${2 * Math.PI * 100 * (1 - 0.85)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl font-bold text-primary">85%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-y-4 text-xl">
                    <p className="flex items-center justify-center gap-2">
                      <span className="text-2xl">✅</span> 
                      <span>12 de 15 objetivos concluídos</span>
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <span className="text-2xl">📈</span> 
                      <span>Aumento de 15% desde o último trimestre</span>
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <span className="text-2xl">🎉</span> 
                      <span>4 conquistas importantes desbloqueadas</span>
                    </p>
                  </div>
                </div>
              )}

              {currentSlide === 3 && (
                <div className="w-full max-w-5xl space-y-8">
                  <h2 className="text-4xl font-bold text-center mb-12">🏆 CONQUISTAS IMPORTANTES!</h2>
                  <div className="space-y-6">
                    <Card className="bg-gradient-to-r from-success/10 to-success/5">
                      <CardContent className="p-8">
                        <div className="flex items-start gap-6">
                          <div className="text-6xl">⭐</div>
                          <div>
                            <h3 className="text-2xl font-bold mb-2">Leitura Independente</h3>
                            <p className="text-xl text-muted-foreground">
                              Ana conseguiu ler textos curtos sozinha!
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
                      <CardContent className="p-8">
                        <div className="flex items-start gap-6">
                          <div className="text-6xl">⭐</div>
                          <div>
                            <h3 className="text-2xl font-bold mb-2">Trabalho em Grupo</h3>
                            <p className="text-xl text-muted-foreground">
                              Participou ativamente de projetos com colegas
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-accent/10 to-accent/5">
                      <CardContent className="p-8">
                        <div className="flex items-start gap-6">
                          <div className="text-6xl">⭐</div>
                          <div>
                            <h3 className="text-2xl font-bold mb-2">Comunicação</h3>
                            <p className="text-xl text-muted-foreground">
                              Usa a prancha de CAA espontaneamente
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {currentSlide > 3 && currentSlide < totalSlides && (
                <div className="text-center space-y-8">
                  <div className="text-5xl mb-4">📊</div>
                  <h2 className="text-3xl font-bold">Slide {currentSlide}</h2>
                  <p className="text-xl text-muted-foreground">Conteúdo detalhado em desenvolvimento...</p>
                </div>
              )}

              {currentSlide === totalSlides && (
                <div className="w-full max-w-4xl space-y-8">
                  <h2 className="text-4xl font-bold text-center mb-12">🎯 PRÓXIMOS PASSOS</h2>
                  
                  <Card>
                    <CardContent className="pt-8 space-y-6">
                      <h3 className="text-2xl font-semibold text-primary mb-4">🏠 O QUE FAZER EM CASA:</h3>
                      
                      <div className="space-y-4 text-lg">
                        <div>
                          <h4 className="font-semibold mb-2">📖 1. Leitura compartilhada</h4>
                          <ul className="ml-6 space-y-1 text-muted-foreground">
                            <li>• 15 minutos por dia</li>
                            <li>• Livros com imagens grandes</li>
                            <li>• Fazer perguntas sobre a história</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">🔢 2. Brincadeiras com números</h4>
                          <ul className="ml-6 space-y-1 text-muted-foreground">
                            <li>• Contar objetos do cotidiano</li>
                            <li>• Jogos simples de adição</li>
                            <li>• Usar materiais concretos (blocos, botões)</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">💬 3. Estimular comunicação</h4>
                          <ul className="ml-6 space-y-1 text-muted-foreground">
                            <li>• Incentivar uso da prancha em casa</li>
                            <li>• Dar tempo para ela se expressar</li>
                            <li>• Celebrar cada tentativa de comunicação</li>
                          </ul>
                        </div>
                      </div>

                      <div className="border-t pt-6 mt-6 space-y-2 text-center">
                        <p className="text-muted-foreground">📅 Próxima reunião: Fevereiro de 2025</p>
                        <p className="text-muted-foreground">📧 coordenacao.demo@example.org</p>
                        <p className="text-muted-foreground">📱 WhatsApp: (11) 90000-0001</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Indicador de Slide */}
            <div className="text-center py-4 text-sm text-muted-foreground">
              Slide {currentSlide} de {totalSlides}
            </div>

            {/* Controles de Navegação */}
            <div className="bg-background/95 backdrop-blur border-t p-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={prevSlide}
                  disabled={currentSlide === 1}
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Anterior
                </Button>

                <Button variant="outline" size="lg">
                  <Pause className="h-5 w-5 mr-2" />
                  Pausar
                </Button>

                {currentSlide < totalSlides ? (
                  <Button
                    variant="default"
                    size="lg"
                    onClick={nextSlide}
                  >
                    Próximo
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleEndPresentation}
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Início
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleEndPresentation}
                >
                  <X className="h-5 w-5 mr-2" />
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            🎥 MODO APRESENTAÇÃO PARA REUNIÃO COM FAMÍLIA
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Crie uma apresentação visual e acessível para compartilhar o progresso de {studentName} com a família.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configurações */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              <h3 className="font-semibold text-lg">⚙️ CONFIGURAÇÕES DA APRESENTAÇÃO</h3>

              {/* Período */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">📅 Período a apresentar:</Label>
                <RadioGroup value={config.period} onValueChange={(value) => setConfig({ ...config, period: value })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mes" id="mes" />
                    <Label htmlFor="mes">Último mês</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="trimestre" id="trimestre" />
                    <Label htmlFor="trimestre">Último trimestre</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="semestre" id="semestre" />
                    <Label htmlFor="semestre">Semestre</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ano" id="ano" />
                    <Label htmlFor="ano">Ano completo</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Conteúdo */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">📊 Conteúdo a incluir:</Label>
                <div className="space-y-2">
                  {[
                    { id: 'includeOverview', label: 'Visão geral do progresso' },
                    { id: 'includePEI', label: 'Objetivos do PEI alcançados' },
                    { id: 'includeGraphs', label: 'Gráficos de evolução' },
                    { id: 'includeAchievements', label: 'Conquistas e destaques' },
                    { id: 'includeMedia', label: 'Fotos e vídeos de evidências' },
                    { id: 'includeRecommendations', label: 'Recomendações para casa' },
                    { id: 'includeNextGoals', label: 'Próximos objetivos' },
                    { id: 'includeComparison', label: 'Comparativo com turma (opcional)' },
                    { id: 'includeAttendance', label: 'Dados de frequência detalhados' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.id}
                        checked={config[item.id as keyof typeof config] as boolean}
                        onCheckedChange={(checked) =>
                          setConfig({ ...config, [item.id]: checked })
                        }
                      />
                      <Label htmlFor={item.id} className="text-sm cursor-pointer">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estilo */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">🎨 Estilo da apresentação:</Label>
                <RadioGroup value={config.style} onValueChange={(value) => setConfig({ ...config, style: value })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="accessible" id="accessible" />
                    <Label htmlFor="accessible">Visual e Acessível (recomendado para famílias)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="technical" id="technical" />
                    <Label htmlFor="technical">Técnico e Detalhado (para especialistas)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal" />
                    <Label htmlFor="minimal">Minimalista e Direto</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Formato */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">📱 Formato de saída:</Label>
                <RadioGroup value={config.format} onValueChange={(value) => setConfig({ ...config, format: value })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interactive" id="interactive" />
                    <Label htmlFor="interactive">Apresentação interativa (navegável no navegador)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="video" id="video" />
                    <Label htmlFor="video">Vídeo MP4 (gravado com narração)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="pdf" />
                    <Label htmlFor="pdf">PDF para impressão</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-4">🎬 PREVIEW</h4>
              <div className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Miniatura da apresentação</p>
                <div className="space-y-1">
                  <p className="text-sm">
                    <strong>Slides estimados:</strong> {totalSlides}
                  </p>
                  <p className="text-sm">
                    <strong>Duração estimada:</strong> ~15 minutos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="secondary">
              <Eye className="h-4 w-4 mr-2" />
              Ver Preview Completo
            </Button>
            <Button onClick={handleStartPresentation}>
              <Play className="h-4 w-4 mr-2" />
              Iniciar Apresentação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
