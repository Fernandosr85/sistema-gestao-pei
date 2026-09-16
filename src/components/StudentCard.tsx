import { calculateAge } from '@/lib/date';
import { Student } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UserCircle, Calendar, BookOpen, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { studentProgress } from '@/lib/metrics';
import { useDemoStore } from '@/store/useDemoStore';

interface StudentCardProps {
  student: Student;
}

const StudentCard = ({ student }: StudentCardProps) => {
  const { state } = useDemoStore();
  const progress = studentProgress(state, student.id);

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case 'baixo':
        return 'bg-success text-success-foreground';
      case 'medio':
        return 'bg-warning text-warning-foreground';
      case 'alto':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSupportLevelLabel = (level: string) => {
    switch (level) {
      case 'baixo':
        return 'Baixo';
      case 'medio':
        return 'Médio';
      case 'alto':
        return 'Alto';
      default:
        return level;
    }
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{student.nomeCompleto}</h3>
              <p className="text-sm text-muted-foreground">{student.matricula}</p>
            </div>
          </div>
          <Badge className={getSupportLevelColor(student.nivelSuporte)}>
            {getSupportLevelLabel(student.nivelSuporte)}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Série:</span>
            <span className="font-medium">{student.serie} - Turma {student.turma}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Idade:</span>
            <span className="font-medium">{calculateAge(student.dataNascimento)} anos</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <UserCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Professor:</span>
            <span className="font-medium">{student.professorResponsavel}</span>
          </div>
        </div>

        {/*
          * O número vinha de `student.progresso`, guardado no cadastro e nunca atualizado por
          * avaliação: três dos quatro alunos do exemplo mostravam porcentagem sem ter avaliação.
          */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Progresso médio dos objetivos na avaliação mais recente</span>
            {progress === undefined ? (
              <span className="shrink-0 text-muted-foreground">Sem avaliação registrada</span>
            ) : (
              <span className="shrink-0 font-semibold">{progress}%</span>
            )}
          </div>
          {progress !== undefined && <Progress value={progress} className="h-2" />}
        </div>

        <div className="pt-4 border-t">
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">Diagnóstico</p>
            <Badge variant="outline" className="text-xs">
              {student.diagnostico}
            </Badge>
          </div>
          
          <Link to={`/alunos/${student.id}`}>
            <Button className="w-full" variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
