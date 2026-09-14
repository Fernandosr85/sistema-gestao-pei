import type { DiagnosisType, SubjectType } from '@/types/resource';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ResourceCard } from '@/components/ResourceCard';
import { ResourceDetailModal } from '@/components/ResourceDetailModal';
import { ContributeResourceDialog } from '@/components/ContributeResourceDialog';
import { mockBadges } from '@/data/mockResources';
import { useDemoStore } from '@/store/useDemoStore';
import { Resource } from '@/types/resource';
import { Search, Plus, Trophy, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function ResourceLibrary() {
  const { state } = useDemoStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState('recent');
  
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [contributeDialogOpen, setContributeDialogOpen] = useState(false);
  const [showMyResources, setShowMyResources] = useState(false);

  const diagnoses = ['TEA', 'TDAH', 'Dislexia', 'Discalculia', 'Deficiência Intelectual', 'Síndrome de Down', 'Deficiência Visual', 'Deficiência Auditiva', 'Paralisia Cerebral', 'Superdotação'];
  const subjects = ['Língua Portuguesa', 'Matemática', 'Ciências da Natureza', 'Geografia', 'História', 'Arte', 'Educação Física', 'Inglês', 'Habilidades Socioemocionais'];
  const types = ['Material Impresso', 'Vídeo', 'Jogo', 'Aplicativo', 'Prancha CAA', 'Sequência Didática', 'Avaliação Adaptada'];
  const levels = ['Educação Infantil', 'Fundamental 1', 'Fundamental 2', 'Ensino Médio', 'EJA'];

  const toggleFilter = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const clearFilters = () => {
    setSelectedDiagnoses([]);
    setSelectedSubjects([]);
    setSelectedTypes([]);
    setSelectedLevels([]);
    setMinRating(0);
  };

  const handleViewResource = (resource: Resource) => {
    setSelectedResource(resource);
    setDetailModalOpen(true);
  };

  const handleDownload = (resource: Resource) => {
    toast.success(`Baixando: ${resource.title}`);
  };

  const handleFavorite = (resource: Resource) => {
    toast.success(`${resource.title} adicionado aos favoritos!`);
  };

  const filteredResources = state.resources.filter(resource => {
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedDiagnoses.length > 0 && !selectedDiagnoses.some(d => resource.diagnoses.includes(d as DiagnosisType))) return false;
    if (selectedSubjects.length > 0 && !selectedSubjects.some(s => resource.subjects.includes(s as SubjectType))) return false;
    if (minRating > 0 && resource.rating < minRating) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Biblioteca de Recursos para Educação Inclusiva 📚</h1>
              <p className="text-primary-foreground/80">
                Materiais adaptados, estratégias e ferramentas para todos os professores
              </p>
            </div>
            <Button
              onClick={() => setContributeDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Contribuir com Recurso
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Buscar recursos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={!showMyResources ? 'default' : 'outline'}
            onClick={() => setShowMyResources(false)}
          >
            📚 Todos os Recursos
          </Button>
          <Button
            variant={showMyResources ? 'default' : 'outline'}
            onClick={() => setShowMyResources(true)}
          >
            🎖️ Meus Recursos
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {!showMyResources && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    🔍 Filtros
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Limpar
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      {/* Diagnoses */}
                      <div>
                        <Label className="font-semibold mb-2 block">📋 Por Diagnóstico</Label>
                        <div className="space-y-2">
                          {diagnoses.map(diagnosis => (
                            <div key={diagnosis} className="flex items-center space-x-2">
                              <Checkbox
                                id={diagnosis}
                                checked={selectedDiagnoses.includes(diagnosis)}
                                onCheckedChange={() => toggleFilter(diagnosis, setSelectedDiagnoses)}
                              />
                              <Label htmlFor={diagnosis} className="font-normal cursor-pointer text-sm">
                                {diagnosis}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Subjects */}
                      <div>
                        <Label className="font-semibold mb-2 block">📚 Por Componente Curricular</Label>
                        <div className="space-y-2">
                          {subjects.map(subject => (
                            <div key={subject} className="flex items-center space-x-2">
                              <Checkbox
                                id={subject}
                                checked={selectedSubjects.includes(subject)}
                                onCheckedChange={() => toggleFilter(subject, setSelectedSubjects)}
                              />
                              <Label htmlFor={subject} className="font-normal cursor-pointer text-sm">
                                {subject}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Rating */}
                      <div>
                        <Label className="font-semibold mb-2 block">⭐ Por Avaliação</Label>
                        <RadioGroup value={minRating.toString()} onValueChange={(v) => setMinRating(Number(v))}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id="rating-all" />
                            <Label htmlFor="rating-all" className="font-normal cursor-pointer">Todas</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="5" id="rating-5" />
                            <Label htmlFor="rating-5" className="font-normal cursor-pointer">5 estrelas</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4" id="rating-4" />
                            <Label htmlFor="rating-4" className="font-normal cursor-pointer">4+ estrelas</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="rating-3" />
                            <Label htmlFor="rating-3" className="font-normal cursor-pointer">3+ estrelas</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Separator />

                      {/* Sort */}
                      <div>
                        <Label className="font-semibold mb-2 block">📊 Ordenar por</Label>
                        <RadioGroup value={sortBy} onValueChange={setSortBy}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="recent" id="sort-recent" />
                            <Label htmlFor="sort-recent" className="font-normal cursor-pointer">Mais recentes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="downloads" id="sort-downloads" />
                            <Label htmlFor="sort-downloads" className="font-normal cursor-pointer">Mais baixados</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rating" id="sort-rating" />
                            <Label htmlFor="sort-rating" className="font-normal cursor-pointer">Melhor avaliados</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className={showMyResources ? 'lg:col-span-4' : 'lg:col-span-3'}>
            {showMyResources ? (
              <div className="space-y-6">
                {/* My Resources Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>📚 Meus Recursos Compartilhados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">12</p>
                        <p className="text-sm text-muted-foreground">Publicados</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-600">1,234</p>
                        <p className="text-sm text-muted-foreground">Downloads</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">4.7 ⭐</p>
                        <p className="text-sm text-muted-foreground">Avaliação Média</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">234</p>
                        <p className="text-sm text-muted-foreground">Favoritados</p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        🎖️ Badges Conquistadas
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {mockBadges.filter(b => b.earnedAt).map(badge => (
                          <Badge key={badge.id} variant="secondary" className="text-lg px-4 py-2">
                            {badge.icon} {badge.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Leaderboard */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      🏆 Ranking de Colaboradores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { pos: '🥇', name: 'Ana Silva', resources: 47, badge: '💎' },
                        { pos: '🥈', name: 'João Santos', resources: 38, badge: '🥇' },
                        { pos: '🥉', name: 'Maria Oliveira', resources: 29, badge: '🥇' },
                        { pos: '4', name: 'Pedro Costa', resources: 24, badge: '🥈' },
                        { pos: '5', name: 'Você', resources: 12, badge: '🥉' }
                      ].map(item => (
                        <div
                          key={item.pos}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            item.name === 'Você' ? 'bg-primary/10 border-2 border-primary' : 'bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.pos}</span>
                            <span className="font-semibold">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">{item.resources} recursos</span>
                            <span className="text-xl">{item.badge}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredResources.length} recursos encontrados
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredResources.map(resource => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      onView={handleViewResource}
                      onDownload={handleDownload}
                      onFavorite={handleFavorite}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ResourceDetailModal
        resource={selectedResource}
        reviews={state.reviews.filter(r => r.resourceId === selectedResource?.id)}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onDownload={handleDownload}
        onFavorite={handleFavorite}
      />

      <ContributeResourceDialog
        open={contributeDialogOpen}
        onOpenChange={setContributeDialogOpen}
      />
    </div>
  );
}
