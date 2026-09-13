import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { todayLocalISO } from '@/lib/date';
import { createId } from '@/lib/id';
import { describeSaveLocation } from '@/store/saveFeedback';
import { useDemoStore } from '@/store/useDemoStore';
import type { Student } from '@/types';

const studentSchema = z.object({
  nomeCompleto: z.string().min(3, 'Nome completo é obrigatório'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  serie: z.string().min(1, 'Série é obrigatória'),
  turma: z.string().min(1, 'Turma é obrigatória'),
  diagnostico: z.string().min(1, 'Diagnóstico é obrigatório'),
  nivelSuporte: z.enum(['baixo', 'medio', 'alto']),
  professorResponsavel: z.string().min(1, 'Professor responsável é obrigatório'),
  responsavelNome: z.string().min(3, 'Nome do responsável é obrigatório'),
  responsavelParentesco: z.string().min(1, 'Parentesco é obrigatório'),
  responsavelTelefone: z.string().min(10, 'Telefone é obrigatório'),
  responsavelEmail: z.string().email('Email inválido'),
  compreensaoFala: z.string().optional(),
  palavrasConhecidas: z.string().optional(),
  comportamentosDesafiadores: z.string().optional(),
  estrategiasAcalmar: z.string().optional(),
  situacoesEstresse: z.string().optional(),
  horarioAcordar: z.string().optional(),
  horarioDormir: z.string().optional(),
  comeSozinha: z.string().optional(),
  usaBanheiroSozinha: z.string().optional(),
  atividadesPreferidas: z.string().optional(),
});

type StudentForm = z.infer<typeof studentSchema>;

const NewStudent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { dispatch } = useDemoStore();

  const form = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      nomeCompleto: '',
      dataNascimento: '',
      matricula: '',
      serie: '',
      turma: '',
      diagnostico: '',
      nivelSuporte: 'medio',
      professorResponsavel: '',
      responsavelNome: '',
      responsavelParentesco: '',
      responsavelTelefone: '',
      responsavelEmail: '',
      compreensaoFala: '',
      palavrasConhecidas: '',
      comportamentosDesafiadores: '',
      estrategiasAcalmar: '',
      situacoesEstresse: '',
      horarioAcordar: '',
      horarioDormir: '',
      comeSozinha: '',
      usaBanheiroSozinha: '',
      atividadesPreferidas: '',
    },
  });

  const onSubmit = (data: StudentForm) => {
    const hasAny = (...values: Array<string | undefined>) => values.some((value) => value?.trim());

    const student: Student = {
      id: createId('student'),
      nomeCompleto: data.nomeCompleto.trim(),
      dataNascimento: data.dataNascimento,
      matricula: data.matricula.trim(),
      serie: data.serie,
      turma: data.turma.trim(),
      diagnostico: data.diagnostico.trim(),
      nivelSuporte: data.nivelSuporte,
      professorResponsavel: data.professorResponsavel.trim(),
      status: 'ativo',
      dataCadastro: todayLocalISO(),
      responsavel: {
        nome: data.responsavelNome.trim(),
        parentesco: data.responsavelParentesco.trim(),
        telefone: data.responsavelTelefone.trim(),
        email: data.responsavelEmail.trim(),
      },
    };

    if (hasAny(data.compreensaoFala, data.palavrasConhecidas)) {
      student.comunicacao = {
        compreensaoFala: data.compreensaoFala ?? '',
        palavrasConhecidas: data.palavrasConhecidas ?? '',
      };
    }
    if (hasAny(data.comportamentosDesafiadores, data.estrategiasAcalmar, data.situacoesEstresse)) {
      student.comportamento = {
        comportamentosDesafiadores: data.comportamentosDesafiadores ?? '',
        estratégiasAcalmar: data.estrategiasAcalmar ?? '',
        situacoesEstresse: data.situacoesEstresse ?? '',
      };
    }
    if (
      hasAny(
        data.horarioAcordar,
        data.horarioDormir,
        data.comeSozinha,
        data.usaBanheiroSozinha,
        data.atividadesPreferidas,
      )
    ) {
      student.rotina = {
        horarioAcordar: data.horarioAcordar ?? '',
        horarioDormir: data.horarioDormir ?? '',
        comeSozinha: data.comeSozinha ?? '',
        usaBanheiroSozinha: data.usaBanheiroSozinha ?? '',
        atividadesPreferidas: data.atividadesPreferidas ?? '',
      };
    }

    const result = dispatch({ type: 'student/add', student });
    toast({
      title: 'Aluno cadastrado com sucesso!',
      description: `${student.nomeCompleto} foi adicionado à lista de alunos. ${describeSaveLocation(result)}`,
    });
    navigate('/alunos');
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/alunos')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Novo Aluno</h1>
          <p className="text-muted-foreground mt-1">
            Preencha os dados do aluno para cadastro no sistema
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="dados-basicos" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dados-basicos">Dados Básicos</TabsTrigger>
              <TabsTrigger value="comunicacao">Comunicação</TabsTrigger>
              <TabsTrigger value="comportamento">Comportamento</TabsTrigger>
              <TabsTrigger value="rotina">Rotina</TabsTrigger>
            </TabsList>

            <TabsContent value="dados-basicos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nomeCompleto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo do aluno" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dataNascimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="matricula"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matrícula *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: MAT-2024-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Série *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a série" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2º Ano EF">2º Ano EF</SelectItem>
                              <SelectItem value="3º Ano EF">3º Ano EF</SelectItem>
                              <SelectItem value="4º Ano EF">4º Ano EF</SelectItem>
                              <SelectItem value="5º Ano EF">5º Ano EF</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="turma"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Turma *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Turma A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="diagnostico"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diagnóstico *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: TEA Nível 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nivelSuporte"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nível de Suporte *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="baixo">Baixo</SelectItem>
                              <SelectItem value="medio">Médio</SelectItem>
                              <SelectItem value="alto">Alto</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="professorResponsavel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professor Responsável *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do professor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dados do Responsável</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="responsavelNome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Responsável *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="responsavelParentesco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parentesco *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Mãe, Pai, Avó" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="responsavelTelefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone *</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="responsavelEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="usuario@example.org" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comunicacao" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comunicação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="compreensaoFala"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compreensão da Fala</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva como o aluno compreende a fala..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="palavrasConhecidas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Palavras Conhecidas</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Liste as palavras que o aluno conhece e utiliza..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comportamento" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comportamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="comportamentosDesafiadores"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comportamentos Desafiadores</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva comportamentos desafiadores observados..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estrategiasAcalmar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estratégias para Acalmar</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva estratégias que funcionam para acalmar o aluno..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="situacoesEstresse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Situações de Estresse</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva situações que causam estresse no aluno..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rotina" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rotina Diária</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="horarioAcordar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário de Acordar</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="horarioDormir"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário de Dormir</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="comeSozinha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Come Sozinha?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva a autonomia alimentar do aluno..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="usaBanheiroSozinha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usa o Banheiro Sozinha?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva a autonomia no uso do banheiro..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="atividadesPreferidas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Atividades Preferidas</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Liste as atividades favoritas do aluno..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/alunos')}
            >
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Salvar Aluno
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewStudent;
