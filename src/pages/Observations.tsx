import { useState } from 'react';
import { Search, Plus, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockObservations } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { ObservationDetailDialog } from '@/components/ObservationDetailDialog';
import { Observation } from '@/types';

const Observations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredObservations = mockObservations.filter((obs) =>
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
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros Avançados
        </Button>
      </div>

      {/* Observations List */}
      {filteredObservations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredObservations.map((observation) => (
            <Card key={observation.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{observation.studentName}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(observation.data).toLocaleDateString('pt-BR')}
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
          ))}
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
