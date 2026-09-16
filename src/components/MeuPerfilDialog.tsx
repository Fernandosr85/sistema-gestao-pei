import { useState } from 'react';
import { User, GraduationCap, TrendingUp, Award, Settings, Upload, Trash2, Edit, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from 'recharts';
import ChartDataTable from '@/components/ChartDataTable';
import { DEMO_USER_NAME } from '@/config/institution';
import DemoDataNotice from '@/components/DemoDataNotice';

interface MeuPerfilDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MeuPerfilDialog = ({ open, onOpenChange }: MeuPerfilDialogProps) => {
  const [selectedTab, setSelectedTab] = useState('dados-pessoais');

  // Mock data for charts
  const alunosAoLongoAnos = [
    { ano: '2015', alunos: 2 },
    { ano: '2016', alunos: 3 },
    { ano: '2017', alunos: 3 },
    { ano: '2018', alunos: 4 },
    { ano: '2019', alunos: 5 },
    { ano: '2020', alunos: 2 },
    { ano: '2021', alunos: 3 },
    { ano: '2022', alunos: 4 },
    { ano: '2023', alunos: 5 },
    { ano: '2024', alunos: 3 },
  ];

  const taxaSucessoAnos = [
    { ano: '2019', taxa: 85 },
    { ano: '2020', taxa: 87 },
    { ano: '2021', taxa: 89 },
    { ano: '2022', taxa: 86 },
    { ano: '2023', taxa: 90 },
    { ano: '2024', taxa: 88 },
  ];

  const satisfacaoFamilias = [
    { mes: 'Jan', satisfacao: 4.6 },
    { mes: 'Fev', satisfacao: 4.5 },
    { mes: 'Mar', satisfacao: 4.7 },
    { mes: 'Abr', satisfacao: 4.8 },
    { mes: 'Mai', satisfacao: 4.7 },
    { mes: 'Jun', satisfacao: 4.9 },
    { mes: 'Jul', satisfacao: 4.8 },
    { mes: 'Ago', satisfacao: 4.8 },
    { mes: 'Set', satisfacao: 4.9 },
    { mes: 'Out', satisfacao: 4.8 },
    { mes: 'Nov', satisfacao: 4.8 },
  ];

  const badges = [
    { id: 1, categoria: 'Produtividade', nome: '100 Observações', desbloqueado: true, ano: 2015 },
    { id: 2, categoria: 'Produtividade', nome: '500 Observações', desbloqueado: true, ano: 2020 },
    { id: 3, categoria: 'Produtividade', nome: '1.000 Observações', desbloqueado: false, faltam: 153 },
    { id: 4, categoria: 'Produtividade', nome: '10 PEIs Elaborados', desbloqueado: true, ano: 2018 },
    { id: 5, categoria: 'Produtividade', nome: '50 PEIs Elaborados', desbloqueado: false, faltam: 32 },
    { id: 6, categoria: 'Excelência', nome: 'Satisfação 4.5+ (6 meses)', desbloqueado: true, ano: 2023 },
    { id: 7, categoria: 'Excelência', nome: 'Satisfação 4.8+ (1 ano)', desbloqueado: true, ano: 2024 },
    { id: 8, categoria: 'Excelência', nome: 'Taxa Sucesso 85%+', desbloqueado: true, ano: 2022 },
    { id: 9, categoria: 'Excelência', nome: 'TOP 10% da Rede', desbloqueado: true, ano: 2024 },
    { id: 10, categoria: 'Excelência', nome: 'TOP 5% da Rede', desbloqueado: true, ano: 2024 },
    { id: 11, categoria: 'Formação', nome: 'Formação Básica TEA', desbloqueado: true, ano: 2023 },
    { id: 12, categoria: 'Formação', nome: 'Formação Intermediária TEA', desbloqueado: true, ano: 2024 },
    { id: 13, categoria: 'Formação', nome: 'Formação Avançada TEA', desbloqueado: true, ano: 2024 },
    { id: 14, categoria: 'Formação', nome: 'TDAH - Função Executiva', desbloqueado: true, ano: 2024 },
    { id: 15, categoria: 'Formação', nome: 'CAA - Comunicação Alternativa', desbloqueado: true, ano: 2023 },
    { id: 16, categoria: 'Formação', nome: '100 Horas de Formação', desbloqueado: true, ano: 2024 },
    { id: 17, categoria: 'Colaboração', nome: 'Primeira Estratégia Compartilhada', desbloqueado: true, ano: 2022 },
    { id: 18, categoria: 'Colaboração', nome: '10 Estratégias Compartilhadas', desbloqueado: true, ano: 2024 },
    { id: 19, categoria: 'Colaboração', nome: '5 Estrelas da Comunidade', desbloqueado: true, ano: 2024 },
    { id: 20, categoria: 'Colaboração', nome: 'Mentor de 3 Professores', desbloqueado: true, ano: 2024 },
    { id: 21, categoria: 'Colaboração', nome: 'Contribuidor Ouro', desbloqueado: true, ano: 2024 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6" />
            Meu Perfil - {DEMO_USER_NAME}
          </DialogTitle>
          <DialogDescription>
            Dados pessoais, formação, estatísticas e conquistas do profissional.
          </DialogDescription>
        </DialogHeader>

        <DemoDataNotice
          id="perfil-ilustrativo"
          subject="Os dados deste perfil, as estatísticas e as conquistas"
          detail="Não há contas de usuário neste protótipo: os campos estão desabilitados e nada é salvo."
        />

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dados-pessoais">
              <User className="h-4 w-4 mr-2" />
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger value="formacao">
              <GraduationCap className="h-4 w-4 mr-2" />
              Formação
            </TabsTrigger>
            <TabsTrigger value="estatisticas">
              <TrendingUp className="h-4 w-4 mr-2" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="conquistas">
              <Award className="h-4 w-4 mr-2" />
              Conquistas
            </TabsTrigger>
            <TabsTrigger value="preferencias">
              <Settings className="h-4 w-4 mr-2" />
              Preferências
            </TabsTrigger>
          </TabsList>

          {/* DADOS PESSOAIS */}
          <TabsContent value="dados-pessoais" className="space-y-6">
            <fieldset disabled aria-describedby="perfil-ilustrativo" className="min-w-0 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src="" />
                <AvatarFallback>
                  <User className="h-16 w-16" aria-hidden="true" />
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Alterar foto
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nome-completo">Nome Completo *</Label>
                <Input id="nome-completo" defaultValue={DEMO_USER_NAME} />
              </div>

              <div>
                <Label htmlFor="nome-exibicao">Nome de Exibição</Label>
                <Input id="nome-exibicao" defaultValue={DEMO_USER_NAME} />
                <p className="text-sm text-muted-foreground mt-1">Como você aparece no sistema</p>
              </div>

              <div>
                <Label htmlFor="email-institucional">Email Institucional *</Label>
                <Input id="email-institucional" defaultValue="professor.demo@example.org" />
              </div>

              <div>
                <Label htmlFor="email-pessoal">Email Pessoal</Label>
                <Input id="email-pessoal" defaultValue="professor.demo@example.org" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone-celular">Telefone Celular</Label>
                  <Input id="telefone-celular" defaultValue="(11) 90000-0001" />
                </div>
                <div>
                  <Label htmlFor="telefone-comercial">Telefone Comercial</Label>
                  <Input id="telefone-comercial" defaultValue="" />
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informações Profissionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" defaultValue="Professora de Ensino Fundamental I" />
                </div>

                <div>
                  <Label htmlFor="unidade">Unidade</Label>
                  <Select defaultValue="unit-1">
                    <SelectTrigger id="unidade">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unit-1">Unidade 1</SelectItem>
                      <SelectItem value="unit-2">Unidade 2</SelectItem>
                      <SelectItem value="unit-3">Unidade 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Turmas Atribuídas</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="turma1" defaultChecked />
                      <label htmlFor="turma1" className="text-sm">2º Ano EF - Turma C (Regente)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="turma2" defaultChecked />
                      <label htmlFor="turma2" className="text-sm">3º Ano EF - Turma A (Apoio)</label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="matricula">Matrícula Funcional</Label>
                    <Input id="matricula" defaultValue="2024.SP.001234" disabled />
                  </div>
                  <div>
                    <Label htmlFor="admissao">Data de Admissão</Label>
                    <Input id="admissao" defaultValue="05/03/2015" disabled />
                    <p className="text-sm text-muted-foreground mt-1">🎉 9 anos na instituição!</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="carga-horaria">Carga Horária Semanal</Label>
                  <Input id="carga-horaria" defaultValue="40 horas" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Especialidades</CardTitle>
                <CardDescription>Selecione suas áreas de expertise para aparecer como referência</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="esp1" defaultChecked />
                    <label htmlFor="esp1" className="text-sm">TEA (Transtorno do Espectro Autista)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="esp2" defaultChecked />
                    <label htmlFor="esp2" className="text-sm">TDAH</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="esp3" defaultChecked />
                    <label htmlFor="esp3" className="text-sm">Alfabetização</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="esp4" />
                    <label htmlFor="esp4" className="text-sm">Dislexia</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="esp5" />
                    <label htmlFor="esp5" className="text-sm">Deficiência Intelectual</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="esp6" />
                    <label htmlFor="esp6" className="text-sm">Altas Habilidades</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="esp7" defaultChecked />
                    <label htmlFor="esp7" className="text-sm">Comunicação Alternativa (CAA)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="esp8" defaultChecked />
                    <label htmlFor="esp8" className="text-sm">Gestão de Comportamento</label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <Label htmlFor="bio">Bio Profissional</Label>
              <Textarea
                id="bio"
                rows={6}
                defaultValue="Sou professora há 9 anos na instituição e especializada em educação inclusiva. Tenho experiência com alunos TEA, TDAH e uso de comunicação alternativa. Acredito que cada criança tem seu próprio ritmo e que, com as estratégias certas, todos podem aprender e se desenvolver plenamente."
                maxLength={500}
              />
            </div>
            </fieldset>

            <p className="text-sm text-muted-foreground">
              Este protótipo não tem contas de usuário nem autenticação: não há senha, verificação
              de e-mail nem autenticação em dois fatores para configurar.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Minhas Estatísticas (resumo)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">• Alunos PEI atendidos: <strong>27</strong> (histórico)</p>
                  <p className="text-sm">• Alunos PEI atuais: <strong>3</strong></p>
                  <p className="text-sm">• Observações registradas: <strong>847</strong></p>
                  <p className="text-sm">• PEIs elaborados: <strong>18</strong></p>
                  <p className="text-sm">• Taxa média de sucesso: <strong>88%</strong></p>
                  <p className="text-sm">• Satisfação das famílias: <strong>4.8/5.0</strong> ⭐⭐⭐⭐⭐</p>
                </div>
                <Button variant="link" className="mt-4 p-0" onClick={() => setSelectedTab('estatisticas')}>
                  Ver estatísticas completas →
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button disabled aria-describedby="perfil-ilustrativo">
                <Settings className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </TabsContent>

          {/* FORMAÇÃO */}
          <TabsContent value="formacao" className="space-y-6">
            <fieldset disabled aria-describedby="perfil-ilustrativo" className="min-w-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Formação Acadêmica</CardTitle>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Adicionar nova formação
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <GraduationCap className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold">Pedagogia</h4>
                        <p className="text-sm text-muted-foreground">Universidade de São Paulo (USP)</p>
                        <p className="text-sm text-muted-foreground">Bacharelado - 2010 a 2014</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <GraduationCap className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold">Especialização em Educação Inclusiva</h4>
                        <p className="text-sm text-muted-foreground">PUC-SP</p>
                        <p className="text-sm text-muted-foreground">Pós-graduação Lato Sensu - 2016 a 2017</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificações e Formações</CardTitle>
                <Button variant="outline" size="sm" disabled aria-describedby="portal-formacao-indisponivel">
                  Sincronizar com Portal de formação
                </Button>
                <p id="portal-formacao-indisponivel" className="text-sm text-muted-foreground">
                  Indisponível: não há integração com portal de formação.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cert1" defaultChecked disabled />
                    <label htmlFor="cert1" className="text-sm">TEA - Nível Avançado (20h) - 2024</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cert2" defaultChecked disabled />
                    <label htmlFor="cert2" className="text-sm">TDAH - Função Executiva (12h) - 2024</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cert3" defaultChecked disabled />
                    <label htmlFor="cert3" className="text-sm">Dislexia - Métodos Fônicos (8h) - 2023</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cert4" defaultChecked disabled />
                    <label htmlFor="cert4" className="text-sm">CAA - Comunicação Alternativa (16h) - 2023</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cert5" defaultChecked disabled />
                    <label htmlFor="cert5" className="text-sm">Gestão de Crises (6h) - 2024</label>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm mb-2">Total acumulado: <strong>124 horas</strong></p>
                  <p className="text-sm mb-4">Meta anual: 40 horas <Badge variant="default" className="bg-green-500 ml-2">+84h acima!</Badge></p>
                  <Progress value={310} className="mb-4" />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Ver todos os certificados</Button>
                  <Button variant="outline" size="sm">Baixar histórico</Button>
                </div>
              </CardContent>
            </Card>
            </fieldset>
          </TabsContent>

          {/* ESTATÍSTICAS */}
          <TabsContent value="estatisticas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alunos Atendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  role="img"
                  aria-label="Gráfico de linhas do número de alunos acompanhados por ano, de 2015 a 2024. Os mesmos números estão na tabela abaixo."
                >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={alunosAoLongoAnos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ano" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="alunos" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
                </div>

                <ChartDataTable
                  caption="Alunos acompanhados por ano."
                  columns={['Ano', 'Alunos']}
                  rows={alunosAoLongoAnos.map((ponto) => [ponto.ano, ponto.alunos])}
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total histórico</p>
                    <p className="text-2xl font-bold">27 alunos</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Média por ano</p>
                    <p className="text-2xl font-bold">3 alunos</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ano com mais alunos</p>
                    <p className="text-2xl font-bold">2019 e 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taxa de Sucesso</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  role="img"
                  aria-label="Gráfico de barras da taxa de sucesso por ano, de 2019 a 2024, em porcentagem. Os mesmos números estão na tabela abaixo."
                >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={taxaSucessoAnos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ano" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="taxa" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
                </div>

                <ChartDataTable
                  caption="Taxa de sucesso por ano, em porcentagem."
                  columns={['Ano', 'Taxa de sucesso']}
                  rows={taxaSucessoAnos.map((ponto) => [ponto.ano, `${ponto.taxa}%`])}
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Sua média</p>
                    <p className="text-2xl font-bold">88%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Média da rede</p>
                    <p className="text-2xl font-bold">74%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Diferença</p>
                    <p className="text-2xl font-bold text-green-500">+14pp ⭐</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-yellow-500 mt-4">
                  🏆 Você está no TOP 5% da rede!
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Produtividade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Observações registradas</p>
                    <p className="text-2xl font-bold mb-1">847</p>
                    <p className="text-sm">Média por aluno: <strong>31 observações</strong></p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tempo médio por observação</p>
                    <p className="text-2xl font-bold mb-1">8 minutos</p>
                    <p className="text-sm text-muted-foreground">Rede: 12 minutos</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">PEIs elaborados</p>
                    <p className="text-2xl font-bold">18</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tempo médio de revisão</p>
                    <p className="text-2xl font-bold mb-1">38 dias</p>
                    <p className="text-sm">Meta da rede: 45 dias <Badge variant="default" className="bg-green-500 ml-1">✅</Badge></p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Formação Continuada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Horas de formação (2024)</p>
                    <p className="text-2xl font-bold">124 horas</p>
                    <p className="text-sm mt-1">Meta anual: 40 horas</p>
                    <Badge variant="default" className="bg-yellow-500 mt-2">Excedente: +84 horas (+210%) 🌟</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cursos concluídos (total)</p>
                    <p className="text-2xl font-bold">23 cursos</p>
                    <p className="text-sm mt-1">Certificações ativas: <strong>11</strong></p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfação e Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  role="img"
                  aria-label="Gráfico de linhas da satisfação das famílias mês a mês, numa escala de 0 a 5. Os mesmos números estão na tabela abaixo."
                >
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={satisfacaoFamilias}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="satisfacao" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
                </div>

                <ChartDataTable
                  caption="Satisfação das famílias por mês, de 0 a 5."
                  columns={['Mês', 'Satisfação']}
                  rows={satisfacaoFamilias.map((ponto) => [ponto.mes, ponto.satisfacao])}
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Média geral</p>
                    <p className="text-2xl font-bold">4.8/5.0 ⭐</p>
                    <p className="text-sm text-muted-foreground">Rede: 4.5/5.0</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Comentários positivos</p>
                    <p className="text-2xl font-bold">94%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo médio de resposta</p>
                    <p className="text-2xl font-bold">8 horas</p>
                    <Badge variant="default" className="bg-green-500 mt-1">Meta: 24h ✅</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contribuições para a Rede</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estratégias compartilhadas</p>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm mt-1">Downloads por outros profs: <strong>347</strong></p>
                    <p className="text-sm">Avaliação média: <strong>4.7/5.0</strong></p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mentorias realizadas</p>
                    <p className="text-2xl font-bold">7 professores</p>
                    <p className="text-sm mt-1">Casos de sucesso documentados: <strong>5</strong></p>
                  </div>
                </div>
                <Button variant="link" className="mt-4 p-0" disabled aria-describedby="perfil-ilustrativo">Ver impacto detalhado</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONQUISTAS */}
          <TabsContent value="conquistas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Nível: Mestre da Inclusão
                </CardTitle>
                <CardDescription>
                  XP: 2.847 / 3.000 (próximo nível: Referência Nacional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={95} className="mb-2" />
                <p className="text-sm text-muted-foreground">95%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges Conquistados (24/40)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {['Produtividade', 'Excelência', 'Formação', 'Colaboração'].map((categoria) => (
                    <div key={categoria}>
                      <h4 className="font-semibold mb-3">{categoria}:</h4>
                      <div className="space-y-2">
                        {badges
                          .filter((b) => b.categoria === categoria)
                          .map((badge) => (
                            <div key={badge.id} className="flex items-center justify-between p-2 border rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl" aria-hidden="true">
                                  {badge.desbloqueado ? '🥇' : '🔒'}
                                </span>
                                <span className="sr-only">
                                  {badge.desbloqueado ? 'Conquistada:' : 'Bloqueada:'}
                                </span>
                                <div>
                                  <p className="text-sm font-medium">{badge.nome}</p>
                                  {badge.desbloqueado && badge.ano && (
                                    <p className="text-xs text-muted-foreground">Desbloqueado: {badge.ano}</p>
                                  )}
                                  {!badge.desbloqueado && badge.faltam && (
                                    <p className="text-xs text-muted-foreground">Faltam {badge.faltam}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}

                  <div>
                    <h4 className="font-semibold mb-3">Especiais:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🌟</span>
                          <div>
                            <p className="text-sm font-medium">Mestre da Consistência</p>
                            <p className="text-xs text-muted-foreground">100% PEIs no prazo por 12 meses</p>
                            <p className="text-xs text-muted-foreground">Desbloqueado: 2024</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🌟</span>
                          <div>
                            <p className="text-sm font-medium">Coração da Inclusão</p>
                            <p className="text-xs text-muted-foreground">Feedback excepcional das famílias</p>
                            <p className="text-xs text-muted-foreground">Desbloqueado: 2023</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🔒</span>
                          <div>
                            <p className="text-sm font-medium">Inovadora do Ano</p>
                            <p className="text-xs text-muted-foreground">Próximo badge</p>
                            <p className="text-xs text-muted-foreground">Falta: Implementar 5 novas estratégias (atual: 3/5)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximos Objetivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="obj1" disabled aria-describedby="perfil-ilustrativo" />
                    <label htmlFor="obj1" className="text-sm">Alcançar 1.000 observações (+153)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="obj2" disabled aria-describedby="perfil-ilustrativo" />
                    <label htmlFor="obj2" className="text-sm">Completar formação em Dislexia</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="obj3" disabled aria-describedby="perfil-ilustrativo" />
                    <label htmlFor="obj3" className="text-sm">Mentorar mais 2 professores</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="obj4" disabled aria-describedby="perfil-ilustrativo" />
                    <label htmlFor="obj4" className="text-sm">Manter satisfação 4.8+ por +6 meses</label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PREFERÊNCIAS */}
          <TabsContent value="preferencias" className="space-y-6">
            <fieldset disabled aria-describedby="perfil-ilustrativo" className="min-w-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Visualização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Página inicial padrão</Label>
                  <Select defaultValue="dashboard">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="alunos">Alunos</SelectItem>
                      <SelectItem value="observacoes">Observações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Auto-save</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="autosave" />
                    <label htmlFor="autosave" className="text-sm">Salvar rascunhos automaticamente a cada 2 minutos</label>
                  </div>
                </div>

                <div>
                  <Label>Confirmações</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="confirm1" />
                      <label htmlFor="confirm1" className="text-sm">Confirmar antes de excluir</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="confirm2" />
                      <label htmlFor="confirm2" className="text-sm">Confirmar antes de sair sem salvar</label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </fieldset>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button variant="outline" disabled aria-describedby="perfil-ilustrativo">Restaurar Padrões</Button>
              <Button disabled aria-describedby="perfil-ilustrativo">
                <Settings className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MeuPerfilDialog;