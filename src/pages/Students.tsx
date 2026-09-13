import { useState } from 'react';
import { Search, Plus, Filter, Download } from 'lucide-react';
import StudentCard from '@/components/StudentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDemoStore } from '@/store/useDemoStore';
import { Link } from 'react-router-dom';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSerie, setSelectedSerie] = useState('all');
  const [selectedSupport, setSelectedSupport] = useState('all');

  const { state } = useDemoStore();
  const filteredStudents = state.students.filter((student) => {
    const matchesSearch = student.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.matricula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSerie = selectedSerie === 'all' || student.serie === selectedSerie;
    const matchesSupport = selectedSupport === 'all' || student.nivelSuporte === selectedSupport;
    
    return matchesSearch && matchesSerie && matchesSupport;
  });

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Alunos</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciar e acompanhar o desenvolvimento dos alunos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Link to="/alunos/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Aluno
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 p-6 bg-card rounded-lg border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedSerie} onValueChange={setSelectedSerie}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Série" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Séries</SelectItem>
            <SelectItem value="2º Ano EF">2º Ano EF</SelectItem>
            <SelectItem value="3º Ano EF">3º Ano EF</SelectItem>
            <SelectItem value="4º Ano EF">4º Ano EF</SelectItem>
            <SelectItem value="5º Ano EF">5º Ano EF</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSupport} onValueChange={setSelectedSupport}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Nível de Suporte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Níveis</SelectItem>
            <SelectItem value="baixo">Baixo</SelectItem>
            <SelectItem value="medio">Médio</SelectItem>
            <SelectItem value="alto">Alto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-semibold">{filteredStudents.length}</span> de{' '}
          <span className="font-semibold">{state.students.length}</span> alunos
        </p>
      </div>

      {/* Students Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum aluno encontrado com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};

export default Students;
