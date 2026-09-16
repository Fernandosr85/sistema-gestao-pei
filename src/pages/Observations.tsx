import { useState } from 'react';
import { Search, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ObservationDetailDialog } from '@/components/ObservationDetailDialog';
import { StructuredObservation } from '@/types';
import { formatLocalDate } from '@/lib/date';
import {
  labelFor,
  quickObservationContextOptions,
  quickObservationToneOptions,
  quickObservationTopicOptions,
} from '@/lib/observation';
import { useDemoStore } from '@/store/useDemoStore';

const Observations = () => {
  const { state } = useDemoStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedObservation, setSelectedObservation] = useState<StructuredObservation | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredObservations = state.observations.filter((obs) =>
    obs.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Observações Diárias</h1>
          <p className="text-muted-foreground mt-1">
            Registro e acompanhamento do desenvolvimento dos alunos
          </p>
        </div>
        <Link to="/observacoes/nova">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Observação
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 p-6 bg-card rounded-lg border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Observations List */}
      {filteredObservations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {/* Cada observação é um cartão com <h3>. O título da seção evita o salto de nível. */}
          <h2 className="sr-only">Observações registradas</h2>
          {filteredObservations.map((observation) => {
            if (observation.kind === 'quick') {
              return (
                <Card key={observation.id} className="card-hover">
                  <CardHeader>
                    <CardTitle className="text-xl">{observation.studentName}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatLocalDate(observation.data)} às {observation.time}
                      </Badge>
                      <Badge variant="outline">Registro rápido</Badge>
                      <Badge variant="outline">{labelFor(quickObservationToneOptions, observation.tone)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold mb-2">Observador</p>
                        <p className="text-sm text-muted-foreground">{observation.observador}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Local/Contexto</p>
                        <p className="text-sm text-muted-foreground">
                          {labelFor(quickObservationContextOptions, observation.context)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">Descrição</p>
                      <p className="text-sm whitespace-pre-line">{observation.description}</p>
                    </div>

                    {observation.topics.length > 0 && (
                      <div className="pt-4 border-t">
                        <p className="text-sm font-semibold mb-2">Relacionado a</p>
                        <div className="flex flex-wrap gap-2">
                          {observation.topics.map((topic) => (
                            <Badge key={topic} variant="outline">
                              {labelFor(quickObservationTopicOptions, topic)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card key={observation.id} className="card-hover">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-xl">{observation.studentName}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatLocalDate(observation.data)}
                        </Badge>
                        <Badge variant={observation.periodo === 'manha' ? 'default' : 'secondary'}>
                          {observation.periodo === 'manha' ? 'Manhã' : 'Tarde'}
                        </Badge>
                        <Badge variant="outline">{observation.duracao} min</Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedObservation(observation);
                        setDetailDialogOpen(true);
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-2">Observador</p>
                    <p className="text-sm text-muted-foreground">{observation.observador}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-success/10 rounded-lg">
                      <p className="text-sm font-semibold text-success mb-2">Pontos Fortes</p>
                      <p className="text-xs">{observation.resumo.pontoForte}</p>
                    </div>
                    <div className="p-4 bg-warning/10 rounded-lg">
                      <p className="text-sm font-semibold text-warning mb-2">Desafios</p>
                      <p className="text-xs">{observation.resumo.desafio}</p>
                    </div>
                    <div className="p-4 bg-info/10 rounded-lg">
                      <p className="text-sm font-semibold text-info mb-2">Ajustes</p>
                      <p className="text-xs">{observation.resumo.ajustesNecessarios}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold mb-2">Comportamentos Observados</p>
                    <div className="flex flex-wrap gap-2">
                      {observation.comportamento.positivos.map((comp, idx) => (
                        <Badge key={idx} variant="outline" className="bg-success/5">
                          ✓ {comp}
                        </Badge>
                      ))}
                      {observation.comportamento.desafiadores.map((comp, idx) => (
                        <Badge key={idx} variant="outline" className="bg-warning/5">
                          ! {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma observação encontrada.</p>
          </CardContent>
        </Card>
      )}

      {/* Detail Dialog */}
      <ObservationDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        observation={selectedObservation}
      />
    </div>
  );
};

export default Observations;
