import { calculateAge, formatLocalDate } from '@/lib/date';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, User, Calendar, Phone, Mail, FileText, Activity, TrendingUp,
  Edit, FileCheck, Clipboard, BarChart3, Lock, GraduationCap,
  Heart, BookOpen, Users, School
} from 'lucide-react';
import { StudentPerformanceDialog } from '@/components/StudentPerformanceDialog';
import { StudentHistoryDialog } from '@/components/StudentHistoryDialog';
import { PresentationModeDialog } from '@/components/PresentationModeDialog';
import { EditarCadastroDialog } from '@/components/EditarCadastroDialog';
import { VerPEIDialog } from '@/components/VerPEIDialog';
import { AnexosDialog } from '@/components/AnexosDialog';
import { NovaObservacaoDialog } from '@/components/NovaObservacaoDialog';
import { BenchmarkingPanel } from '@/components/BenchmarkingPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { institution } from '@/config/institution';
import StudentObservationsCard from '@/components/StudentObservationsCard';
import StudentAssessmentsCard from '@/components/StudentAssessmentsCard';
import StudentProfileCard from '@/components/StudentProfileCard';
import { studentStatusLabel, supportLevelLabel } from '@/lib/student';
import { studentProgress, studentRecordSummary } from '@/lib/metrics';
import { useDemoStore } from '@/store/useDemoStore';

const StudentDetail = () => {
  const { id } = useParams();
  const { state } = useDemoStore();
  const student = state.students.find((s) => s.id === id);
  const [performanceDialogOpen, setPerformanceDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [presentationDialogOpen, setPresentationDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [peiDialogOpen, setPeiDialogOpen] = useState(false);
  const [anexosDialogOpen, setAnexosDialogOpen] = useState(false);
  const [observacaoDialogOpen, setObservacaoDialogOpen] = useState(false);

  if (!student) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Aluno não encontrado.</p>
            <Link to="/alunos">
              <Button className="mt-4">Voltar para Alunos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const registros = studentRecordSummary(state, student.id);

  const alunoCompleto = {
    nomeCompleto: student.nomeCompleto,
    matricula: student.matricula,
    serieTurma: `${student.serie} - Turma ${student.turma}`,
    dataNascimento: formatLocalDate(student.dataNascimento),
    idade: calculateAge(student.dataNascimento),
    status: studentStatusLabel(student.status),
    // Saíram ano letivo (2024), "Turma: Manhã" e "Professor(a) de Apoio F.": nenhum dos três
    // existe no cadastro, e eram iguais para qualquer estudante.
    informacoesAcademicas: {
      professorRegente: student.professorResponsavel,
    },
    perfilSaude: {
      diagnosticos: student.diagnostico
    },
    /*
     * Havia aqui um "tipo" fixo, "Transtorno Global do Desenvolvimento", e um recurso fixo,
     * "Comunicação alternativa visual", exibidos para qualquer estudante: um diagnóstico e uma
     * necessidade de comunicação atribuídos a quem não os tem. O diagnóstico registrado já
     * aparece no cartão de saúde, vindo do cadastro. Fica só o nível de suporte, que é do aluno.
     */
    necessidadesEspecificas: {
      grau: student.nivelSuporte,
    },
    // Saiu a composição "Família ativa", igual para qualquer estudante.
    contextoFamiliar: {
      responsaveis: `${student.responsavel.nome} (${student.responsavel.parentesco})`,
      contatos: student.responsavel.telefone
    },
    /*
     * Era uma linha do tempo fixa, igual para qualquer estudante: "Pendências: 1", "Ingresso na
     * instituição 2020", "Primeiro PEI elaborado 2023", "Revisões realizadas: 3" e
     * "Progressões/retenções: Nenhuma". Nada disso existe no store. Agora são os registros do
     * estudante, contados. Não há entidade PEI (Etapa 9), então não há revisão para contar.
     */
    timeline: [
      { tipo: "cadastro", texto: "Cadastro no sistema", data: formatLocalDate(student.dataCadastro), icone: School, cor: "text-primary" },
      { tipo: "observacoes", texto: `Observações registradas: ${registros.observations}`, icone: FileText, cor: "text-info" },
      { tipo: "avaliacoes", texto: `Avaliações registradas: ${registros.assessments}`, icone: TrendingUp, cor: "text-success" },
      { tipo: "atendimentos", texto: `Atendimentos: ${registros.appointments}`, icone: Calendar, cor: "text-warning" },
    ],
    ultimoRegistro: registros.lastRecordDate ? formatLocalDate(registros.lastRecordDate) : undefined,
    progresso: studentProgress(state, student.id),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Cabeçalho Azul */}
      <div className="bg-brand-blue text-white p-6">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            {/*
              * Era um <a> envolvendo um <button>, aninhamento inválido, e o link não tinha
              * nome: o leitor anunciava só "link". Com asChild sai um <a> só, nomeado.
              */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" asChild>
              <Link to="/alunos" aria-label="Voltar para a lista de alunos">
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">
              Gestão de Alunos - Cadastro Completo e Individualizado
            </h1>
          </div>
          <div className="hidden md:flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
            <User className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Coluna Esquerda - Perfil do Aluno */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6 space-y-4">
                {/* Avatar */}
                <div className="flex justify-center">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {student.nomeCompleto.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Nome e Badge */}
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold">{alunoCompleto.nomeCompleto}</h2>
                  <Badge
                    variant={student.status === 'ativo' ? 'default' : 'secondary'}
                    className={student.status === 'ativo' ? 'bg-success text-success-foreground' : undefined}
                  >
                    {alunoCompleto.status}
                  </Badge>
                </div>

                <Separator />

                {/* Informações Básicas */}
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Matrícula</p>
                    <p className="font-medium">{alunoCompleto.matricula}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Série/Turma</p>
                    <p className="font-medium">{alunoCompleto.serieTurma}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">{alunoCompleto.dataNascimento}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Idade</p>
                    <p className="font-medium">{alunoCompleto.idade} anos</p>
                  </div>
                </div>

                <Separator />

                {/*
                  * Saíram "Desempenho em dia" e "Documentação em dia", afirmados sempre que havia um
                  * número, e o número guardado no cadastro, que nenhuma avaliação atualizava.
                  */}
                {alunoCompleto.progresso === undefined ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">Sem avaliação registrada</p>
                ) : (
                  <>
                    {/* Círculo de Progresso */}
                    <div className="flex flex-col items-center py-4">
                      <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="hsl(var(--muted))"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="hsl(var(--primary))"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - alunoCompleto.progresso / 100)}`}
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold text-primary">{alunoCompleto.progresso}%</span>
                        </div>
                      </div>
                      <p className="mt-3 text-center text-sm text-muted-foreground">
                        Progresso médio dos objetivos na avaliação mais recente
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Central - Cards de Informação */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Card 1: Informações Acadêmicas */}
              <Card className="card-hover">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Informações Acadêmicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Série e turma</p>
                    <p className="font-medium">{alunoCompleto.serieTurma}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Professor(a) Regente</p>
                    <p className="font-medium">{alunoCompleto.informacoesAcademicas.professorRegente}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Perfil de Saúde */}
              <Card className="card-hover">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="h-5 w-5 text-secondary" />
                    Perfil de Saúde
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Diagnósticos</p>
                    <p className="font-medium">{alunoCompleto.perfilSaude.diagnosticos}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Medicação, alergias e médico responsável não são registrados neste sistema.
                  </p>
                </CardContent>
              </Card>

              {/* Card 3: Necessidades Específicas */}
              <Card className="card-hover">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-warning" />
                    Necessidades Específicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nível de suporte</p>
                    <Badge variant={
                      alunoCompleto.necessidadesEspecificas.grau === 'baixo' ? 'default' :
                      alunoCompleto.necessidadesEspecificas.grau === 'medio' ? 'secondary' :
                      'destructive'
                    }>
                      {supportLevelLabel(alunoCompleto.necessidadesEspecificas.grau)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Contexto Familiar */}
              <Card className="card-hover">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-info" />
                    Contexto Familiar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Responsáveis</p>
                    <p className="font-medium">{alunoCompleto.contextoFamiliar.responsaveis}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contatos</p>
                    <p className="font-medium">{alunoCompleto.contextoFamiliar.contatos}</p>
                  </div>

                </CardContent>
              </Card>
            </div>

            <StudentProfileCard student={student} />

            <StudentObservationsCard studentId={student.id} />

            <StudentAssessmentsCard studentId={student.id} />

            {/* Benchmarking Panel */}
            <BenchmarkingPanel 
              studentName={student.nomeCompleto}
              diagnosis={student.diagnostico}
              diagnosisLevel={student.nivelSuporte}
            />
          </div>

          {/* Coluna Direita - Timeline e Ícones de Ação */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Timeline Vertical */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Registros do estudante</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alunoCompleto.timeline.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        item.cor === 'text-warning' ? 'bg-warning/20' :
                        item.cor === 'text-primary' ? 'bg-primary/20' :
                        item.cor === 'text-success' ? 'bg-success/20' :
                        item.cor === 'text-info' ? 'bg-info/20' :
                        'bg-muted'
                      }`}>
                        <item.icone className={`h-4 w-4 ${item.cor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.texto}</p>
                        {item.data && <p className="text-xs text-muted-foreground">{item.data}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ícones de Ação Rápida */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2" 
                  size="sm"
                  onClick={() => setPerformanceDialogOpen(true)}
                >
                  <BarChart3 className="h-4 w-4" />
                  Ver Desempenho Completo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2" 
                  size="sm"
                  onClick={() => setHistoryDialogOpen(true)}
                >
                  <GraduationCap className="h-4 w-4" />
                  Histórico Acadêmico
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2" 
                  size="sm"
                  onClick={() => setPresentationDialogOpen(true)}
                >
                  <FileText className="h-4 w-4" />
                  Modo Apresentação/Reunião
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Barra de Botões Principais de Ação */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setEditDialogOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar Cadastro
          </Button>

          <Button 
            className="bg-destructive hover:bg-destructive/90"
            onClick={() => setPeiDialogOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Ver PEI Ativo
          </Button>

          {/* Saiu o "21": não existe entidade de anexo, e a lista de exemplo tem oito itens. */}
          <Button 
            className="bg-success hover:bg-success/90 gap-2"
            onClick={() => setAnexosDialogOpen(true)}
          >
            Anexos
          </Button>

          <Button 
            style={{ backgroundColor: 'hsl(var(--info))' }}
            className="hover:opacity-90"
            onClick={() => setObservacaoDialogOpen(true)}
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Nova Observação
          </Button>
        </div>

        {/* Rodapé */}
        <div className="mt-12 pt-6 border-t flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-brand-blue rounded flex items-center justify-center text-white font-bold text-xl">
              {institution.shortName}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {/* Era "Última atualização: 30/03/2024", fixo. */}
            {alunoCompleto.ultimoRegistro
              ? `Último registro: ${alunoCompleto.ultimoRegistro}`
              : 'Nenhum registro de observação, avaliação ou atendimento'}
          </p>
        </div>
      </div>

      {/* Dialogs */}
      <StudentPerformanceDialog
        open={performanceDialogOpen}
        onOpenChange={setPerformanceDialogOpen}
        studentName={student.nomeCompleto}
      />
      <StudentHistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        studentName={student.nomeCompleto}
      />
      <PresentationModeDialog
        open={presentationDialogOpen}
        onOpenChange={setPresentationDialogOpen}
        studentName={student.nomeCompleto}
      />
      <EditarCadastroDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        student={student}
      />
      <VerPEIDialog
        open={peiDialogOpen}
        onOpenChange={setPeiDialogOpen}
        studentName={student.nomeCompleto}
      />
      <AnexosDialog
        open={anexosDialogOpen}
        onOpenChange={setAnexosDialogOpen}
        studentName={student.nomeCompleto}
      />
      <NovaObservacaoDialog
        open={observacaoDialogOpen}
        onOpenChange={setObservacaoDialogOpen}
        studentId={student.id}
        studentName={student.nomeCompleto}
      />
    </div>
  );
};

export default StudentDetail;
