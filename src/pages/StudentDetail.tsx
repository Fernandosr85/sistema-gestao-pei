import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, User, Calendar, Phone, Mail, FileText, Activity, TrendingUp,
  Edit, FileCheck, Clipboard, BarChart3, Lock, Shield, GraduationCap,
  Heart, BookOpen, Users, AlertCircle, Clock, CheckCircle, School
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockStudents } from '@/data/mockData';

const StudentDetail = () => {
  const { id } = useParams();
  const student = mockStudents.find((s) => s.id === id);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [peiDialogOpen, setPeiDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

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

  const alunoCompleto = {
    nomeCompleto: student.nomeCompleto,
    matricula: student.matriculaSESI,
    serieTurma: `${student.serie} - Turma ${student.turma}`,
    dataNascimento: new Date(student.dataNascimento).toLocaleDateString('pt-BR'),
    idade: student.idade,
    status: student.status,
    informacoesAcademicas: {
      anoLetivo: 2024,
      turma: "Manhã",
      professorRegente: student.professorResponsavel,
      professorApoio: "Professor(a) de Apoio F."
    },
    perfilSaude: {
      diagnosticos: student.diagnostico,
      medicina: "Ana Paulita",
      restricoesAlergias: "Nenhuma",
      ultimoLaudo: "01/02/2024"
    },
    necessidadesEspecificas: {
      tipo: "Transtorno Global do Desenvolvimento",
      grau: student.nivelSuporte,
      recursos: ["Comunicação alternativa visual"]
    },
    contextoFamiliar: {
      responsaveis: `${student.responsavel.nome} (${student.responsavel.parentesco})`,
      composicao: "Família ativa",
      contatos: student.responsavel.telefone
    },
    timeline: [
      { tipo: "pendencia", texto: "Pendências: 1", icone: AlertCircle, cor: "text-warning" },
      { tipo: "ingresso", texto: "Ingresso no SESI", data: "2020", icone: School, cor: "text-primary" },
      { tipo: "pei", texto: "Primeiro PEI elaborado", data: "2023", icone: FileText, cor: "text-success" },
      { tipo: "revisao", texto: "Revisões realizadas: 3", icone: TrendingUp, cor: "text-info" },
      { tipo: "progressao", texto: "Progressões/retenções: Nenhuma", icone: CheckCircle, cor: "text-success" },
      { tipo: "historico", texto: "Histórico completo desde o ingresso", icone: Clock, cor: "text-muted-foreground" },
      { tipo: "acesso", texto: "Acesso controlado por perfil", icone: Shield, cor: "text-muted-foreground" }
    ],
    documentacaoEmDia: student.progresso,
    ultimaAtualizacao: "30/03/2024"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Cabeçalho Azul */}
      <div className="bg-sesi-blue text-white p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/alunos">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
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
                  <Badge className="bg-success text-success-foreground">
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

                {/* Indicador de Status */}
                <div className="flex items-center gap-2 text-success text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Desempenho em dia</span>
                </div>

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
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - alunoCompleto.documentacaoEmDia / 100)}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">{alunoCompleto.documentacaoEmDia}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-success text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Documentação em dia</span>
                  </div>
                </div>
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
                    <p className="text-muted-foreground">Ano letivo</p>
                    <p className="font-medium">{alunoCompleto.informacoesAcademicas.anoLetivo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Turma</p>
                    <p className="font-medium">{alunoCompleto.informacoesAcademicas.turma}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Professor(a) Regente</p>
                    <p className="font-medium">{alunoCompleto.informacoesAcademicas.professorRegente}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Professor(a) de Apoio</p>
                    <p className="font-medium">{alunoCompleto.informacoesAcademicas.professorApoio}</p>
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
                  <div>
                    <p className="text-muted-foreground">Medicina</p>
                    <p className="font-medium">{alunoCompleto.perfilSaude.medicina}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Restrições/Alergias</p>
                    <p className="font-medium">{alunoCompleto.perfilSaude.restricoesAlergias}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Último Laudo</p>
                    <p className="font-medium text-primary">{alunoCompleto.perfilSaude.ultimoLaudo}</p>
                  </div>
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
                    <p className="text-muted-foreground">Tipo</p>
                    <p className="font-medium">{alunoCompleto.necessidadesEspecificas.tipo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Grau</p>
                    <Badge variant={
                      alunoCompleto.necessidadesEspecificas.grau === 'baixo' ? 'default' :
                      alunoCompleto.necessidadesEspecificas.grau === 'medio' ? 'secondary' :
                      'destructive'
                    } className="capitalize">
                      {alunoCompleto.necessidadesEspecificas.grau}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Recursos</p>
                    <ul className="list-disc list-inside">
                      {alunoCompleto.necessidadesEspecificas.recursos.map((recurso, idx) => (
                        <li key={idx} className="font-medium">{recurso}</li>
                      ))}
                    </ul>
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
                  <div>
                    <p className="text-muted-foreground">Composição</p>
                    <p className="font-medium">{alunoCompleto.contextoFamiliar.composicao}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Observações</p>
                    <p className="font-medium text-muted-foreground italic">Nenhuma observação adicional</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Coluna Direita - Timeline e Ícones de Ação */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Timeline Vertical */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Histórico</CardTitle>
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
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Lock className="h-4 w-4" />
                  Segurança/Permissões
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" size="sm" onClick={() => setEditDialogOpen(true)}>
                  <Edit className="h-4 w-4" />
                  Editar informações
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <GraduationCap className="h-4 w-4" />
                  Histórico acadêmico
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <BarChart3 className="h-4 w-4" />
                  Ver desempenho
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Shield className="h-4 w-4" />
                  Dados protegidos
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Shield className="h-4 w-4" />
                  Conformidade LGPD
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Barra de Botões Inferiores */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Edit className="mr-2 h-4 w-4" />
                Editar Cadastro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Cadastro do Aluno</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground">Formulário de edição será implementado aqui.</p>
              </div>
            </DialogContent>
          </Dialog>

          <Badge className="flex items-center justify-center h-10 px-4 bg-success hover:bg-success/90 text-lg">
            21
          </Badge>

          <Dialog open={peiDialogOpen} onOpenChange={setPeiDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-warning hover:bg-warning/90">
                <FileText className="mr-2 h-4 w-4" />
                Ver PEI Ativo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Plano Educacional Individualizado (PEI)</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground">Visualização do PEI será implementada aqui.</p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: 'hsl(var(--info))' }} className="hover:opacity-90">
                <BarChart3 className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerar Relatório</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-3">
                <p className="text-muted-foreground">Selecione o tipo de relatório:</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Relatório completo do aluno
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Relatório de saúde
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Relatório pedagógico
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Histórico de progressão
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Clipboard className="h-4 w-4" />
          </Button>

          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Observações
          </Button>
        </div>

        {/* Rodapé */}
        <div className="mt-12 pt-6 border-t flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-sesi-blue rounded flex items-center justify-center text-white font-bold text-xl">
              SESI
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Última atualização: {alunoCompleto.ultimaAtualizacao}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
