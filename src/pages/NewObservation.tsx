import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { mockStudents } from '@/data/mockData';

const observationSchema = z.object({
  studentId: z.string().min(1, 'Selecione um aluno'),
  data: z.string().min(1, 'Data é obrigatória'),
  periodo: z.enum(['manha', 'tarde']),
  duracao: z.string().min(1, 'Duração é obrigatória'),
  observador: z.string().min(3, 'Nome do observador é obrigatório'),
  situacoes: z.array(z.object({
    contexto: z.string().min(1, 'Contexto é obrigatório'),
    resposta: z.string().min(1, 'Resposta é obrigatória'),
  })).min(1, 'Adicione pelo menos uma situação'),
  interacoes: z.array(z.object({
    tipo: z.string().min(1, 'Tipo é obrigatório'),
    descricao: z.string().min(1, 'Descrição é obrigatória'),
  })).min(1, 'Adicione pelo menos uma interação'),
  comportamentosPositivos: z.string().min(1, 'Comportamentos positivos são obrigatórios'),
  comportamentosDesafiadores: z.string().min(1, 'Comportamentos desafiadores são obrigatórios'),
  pontoForte: z.string().min(1, 'Ponto forte é obrigatório'),
  desafio: z.string().min(1, 'Desafio é obrigatório'),
  ajustesNecessarios: z.string().min(1, 'Ajustes necessários são obrigatórios'),
});

type ObservationForm = z.infer<typeof observationSchema>;

const NewObservation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ObservationForm>({
    resolver: zodResolver(observationSchema),
    defaultValues: {
      studentId: '',
      data: new Date().toISOString().split('T')[0],
      periodo: 'manha',
      duracao: '',
      observador: '',
      situacoes: [{ contexto: '', resposta: '' }],
      interacoes: [{ tipo: '', descricao: '' }],
      comportamentosPositivos: '',
      comportamentosDesafiadores: '',
      pontoForte: '',
      desafio: '',
      ajustesNecessarios: '',
    },
  });

  const { fields: situacoesFields, append: appendSituacao, remove: removeSituacao } = useFieldArray({
    control: form.control,
    name: 'situacoes',
  });

  const { fields: interacoesFields, append: appendInteracao, remove: removeInteracao } = useFieldArray({
    control: form.control,
    name: 'interacoes',
  });

  const onSubmit = async (data: ObservationForm) => {
    setIsSubmitting(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const student = mockStudents.find(s => s.id === data.studentId);
    
    toast({
      title: 'Observação registrada com sucesso!',
      description: `Observação de ${student?.nomeCompleto} foi salva.`,
    });
    
    setIsSubmitting(false);
    navigate('/observacoes');
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/observacoes')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nova Observação</h1>
          <p className="text-muted-foreground mt-1">
            Registre observações detalhadas do desenvolvimento do aluno
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aluno *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o aluno" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockStudents.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.nomeCompleto} - {student.serie}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observador"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observador *</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="periodo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="manha">Manhã</SelectItem>
                          <SelectItem value="tarde">Tarde</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duracao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (minutos) *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 45" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Comunicação */}
          <Card>
            <CardHeader>
              <CardTitle>Comunicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {situacoesFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Situação {index + 1}</h4>
                    {situacoesFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSituacao(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`situacoes.${index}.contexto`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contexto *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva o contexto da situação observada..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`situacoes.${index}.resposta`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resposta do Aluno *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva como o aluno respondeu..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => appendSituacao({ contexto: '', resposta: '' })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Situação
              </Button>
            </CardContent>
          </Card>

          {/* Habilidades Sociais */}
          <Card>
            <CardHeader>
              <CardTitle>Habilidades Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {interacoesFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Interação {index + 1}</h4>
                    {interacoesFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInteracao(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`interacoes.${index}.tipo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Interação *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Interação com colega" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`interacoes.${index}.descricao`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva detalhadamente a interação..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => appendInteracao({ tipo: '', descricao: '' })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Interação
              </Button>
            </CardContent>
          </Card>

          {/* Comportamento */}
          <Card>
            <CardHeader>
              <CardTitle>Comportamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="comportamentosPositivos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comportamentos Positivos *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Liste comportamentos positivos observados (separe por vírgula)..."
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
                name="comportamentosDesafiadores"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comportamentos Desafiadores *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Liste comportamentos desafiadores observados (separe por vírgula)..."
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

          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Observação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="pontoForte"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ponto Forte *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o principal ponto forte observado..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desafio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desafio Principal *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o principal desafio observado..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ajustesNecessarios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ajustes Necessários *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva os ajustes necessários no plano educacional..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/observacoes')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Salvando...' : 'Salvar Observação'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewObservation;
