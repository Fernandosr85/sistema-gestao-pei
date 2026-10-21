import { useEffect, useRef, useState } from 'react';
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
import { todayLocalISO } from '@/lib/date';
import { createId } from '@/lib/id';
import { describeSaveLocation } from '@/store/saveFeedback';
import { useDemoStore } from '@/store/useDemoStore';
import type { StructuredObservation } from '@/types';

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
  const { state, dispatch } = useDemoStore();

  const form = useForm<ObservationForm>({
    resolver: zodResolver(observationSchema),
    defaultValues: {
      studentId: '',
      data: todayLocalISO(),
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

  /*
   * REMOVER UMA LINHA PERDIA O FOCO E NÃO ANUNCIAVA NADA (Etapa 19, passo 2 do M10).
   *
   * Medido antes do conserto, nos quatro casos (as duas listas, com e sem linha anterior
   * sobrevivente): acionar o botão de remover pelo teclado mandava o foco para `document.body` e
   * não escrevia nada em região viva nenhuma — a única da página era a do sistema de avisos, vazia
   * antes e depois. Pelo critério que o M10 declarou ANTES da execução (é falha se não houver
   * anúncio E o foco se perder), os quatro casos davam FALHA.
   *
   * O conserto tem duas partes, e as duas são necessárias: quem não vê precisa saber que a linha
   * saiu (a região viva) e precisa continuar em algum lugar (o foco).
   */
  const [avisoDeLista, setAvisoDeLista] = useState('');
  /*
   * O foco só pode ser movido DEPOIS de o React recomprometer o DOM: o alvo é escolhido por índice,
   * e os índices mudam na remoção. Por isso o `useEffect` abaixo procura o alvo no documento já
   * atualizado, por `data-foco`, em vez de guardar o nó antes de remover — nó guardado antes pode
   * ser justamente o que saiu da árvore.
   */
  const alvoDoFoco = useRef<string | null>(null);
  const [pedidosDeFoco, setPedidosDeFoco] = useState(0);

  /*
   * O alvo fica num `ref` e o gatilho é um contador, para o efeito não precisar atualizar estado: a
   * primeira versão guardava o alvo em estado e o limpava aqui dentro, o que custava um render a
   * mais por remoção. Contador em vez de booleano porque duas remoções seguidas precisam disparar
   * duas vezes.
   *
   * (Essa primeira versão também apareceu junto de um aviso de `act()` nos testes, e eu atribuí o
   * aviso a ela. Errado: medido, o aviso vinha do TESTE chamando `.focus()` fora de `act` — com a
   * chamada embrulhada, zero avisos, e o `ref` não tem nada a ver com isso. A troca fica porque
   * economiza um render, não porque conserta aviso.)
   */
  useEffect(() => {
    if (!pedidosDeFoco || !alvoDoFoco.current) return;
    document.querySelector<HTMLElement>(`[data-foco="${alvoDoFoco.current}"]`)?.focus();
    alvoDoFoco.current = null;
  }, [pedidosDeFoco]);

  /**
   * Remove uma linha de uma das duas listas, move o foco e anuncia.
   *
   * O alvo do foco é a **linha anterior, quando ela existe e continua tendo botão de remover** —
   * o JSX esconde esses botões quando sobra uma linha só, e focar um nó que vai desaparecer é
   * perder o foco de novo. Nos outros casos (removeu a primeira linha, ou sobrou uma linha só) o
   * alvo é o botão "Adicionar", que está sempre lá.
   *
   * A contagem entra no texto anunciado de propósito: região viva com o MESMO texto duas vezes não
   * é reanunciada, e remover duas linhas em seguida é exatamente o caso em que o texto se repetiria.
   * Com a contagem, cada remoção produz um texto diferente — e a informação é útil por si.
   */
  const removerLinha = (
    lista: 'situacoes' | 'interacoes',
    indice: number,
    quantasAntes: number,
  ) => {
    const remover = lista === 'situacoes' ? removeSituacao : removeInteracao;
    remover(indice);

    const sobram = quantasAntes - 1;
    const temLinhaAnterior = indice > 0 && sobram > 1;
    alvoDoFoco.current = temLinhaAnterior ? `${lista}-remover-${indice - 1}` : `${lista}-adicionar`;
    setPedidosDeFoco((n) => n + 1);

    const nome = lista === 'situacoes' ? 'Situação' : 'Interação';
    const plural = lista === 'situacoes' ? 'situações' : 'interações';
    const singular = lista === 'situacoes' ? 'situação' : 'interação';
    setAvisoDeLista(
      `${nome} removida. ${sobram === 1 ? `Resta 1 ${singular}` : `Restam ${sobram} ${plural}`} na lista.`,
    );
  };

  const onSubmit = (data: ObservationForm) => {
    const student = state.students.find((s) => s.id === data.studentId);
    if (!student) {
      form.setError('studentId', { message: 'Aluno não encontrado. Selecione novamente.' });
      return;
    }

    const splitList = (value: string) =>
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    const observation: StructuredObservation = {
      kind: 'structured',
      id: createId('obs'),
      studentId: student.id,
      data: data.data,
      periodo: data.periodo,
      duracao: Number(data.duracao),
      observador: data.observador.trim(),
      comunicacao: {
        situacoes: data.situacoes.map(({ contexto, resposta }) => ({ contexto, resposta })),
      },
      habilidadesSociais: {
        interacoes: data.interacoes.map(({ tipo, descricao }) => ({ tipo, descricao })),
      },
      comportamento: {
        positivos: splitList(data.comportamentosPositivos),
        desafiadores: splitList(data.comportamentosDesafiadores),
      },
      resumo: {
        pontoForte: data.pontoForte,
        desafio: data.desafio,
        ajustesNecessarios: data.ajustesNecessarios,
      },
    };

    const result = dispatch({ type: 'observation/add', observation });
    toast({
      title: 'Observação registrada com sucesso!',
      description: `Observação de ${student.nomeCompleto} adicionada à lista. ${describeSaveLocation(result)}`,
    });
    navigate('/observacoes');
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/observacoes')}
          aria-label="Voltar para a lista de observações"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
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
          {/*
            * A região viva das duas listas. Fica aqui, montada desde o começo e vazia: região viva
            * criada no mesmo instante em que recebe texto costuma não ser anunciada, porque o leitor
            * de tela precisa já estar observando o nó. Única na página para as duas listas — duas
            * regiões concorrentes se atropelam.
            *
            * `sr-only` e não `hidden`: o que está em `display:none` sai da árvore de acessibilidade
            * e não é anunciado. Isto é texto que só quem ouve recebe.
            */}
          <p className="sr-only" role="status" aria-live="polite">{avisoDeLista}</p>

          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle level={2}>Informações Básicas</CardTitle>
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
                          {state.students.map((student) => (
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
              <CardTitle level={2}>Comunicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {situacoesFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Situação {index + 1}</h3>
                    {situacoesFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        /*
                         * Nome pela POSIÇÃO, não pelo conteúdo (invariante 4, Etapa 18). A linha
                         * nasce vazia e o texto muda a cada tecla; nome de controle que muda a cada
                         * tecla é reanunciado a cada tecla. "Situação {index + 1}" é o título
                         * visível do bloco, então o que o leitor anuncia casa o que está na tela.
                         */
                        aria-label={`Remover situação ${index + 1}`}
                        data-foco={`situacoes-remover-${index}`}
                        onClick={() => removerLinha('situacoes', index, situacoesFields.length)}
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
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
                data-foco="situacoes-adicionar"
                onClick={() => appendSituacao({ contexto: '', resposta: '' })}
              >
                <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
                Adicionar Situação
              </Button>
            </CardContent>
          </Card>

          {/* Habilidades Sociais */}
          <Card>
            <CardHeader>
              <CardTitle level={2}>Habilidades Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {interacoesFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Interação {index + 1}</h3>
                    {interacoesFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        // Mesma regra do botão de remover situação: posição, não conteúdo.
                        aria-label={`Remover interação ${index + 1}`}
                        data-foco={`interacoes-remover-${index}`}
                        onClick={() => removerLinha('interacoes', index, interacoesFields.length)}
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
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
                data-foco="interacoes-adicionar"
                onClick={() => appendInteracao({ tipo: '', descricao: '' })}
              >
                <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
                Adicionar Interação
              </Button>
            </CardContent>
          </Card>

          {/* Comportamento */}
          <Card>
            <CardHeader>
              <CardTitle level={2}>Comportamento</CardTitle>
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
              <CardTitle level={2}>Resumo da Observação</CardTitle>
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
            >
              Cancelar
            </Button>
            <Button type="submit">
              <Save aria-hidden="true" className="mr-2 h-4 w-4" />
              Salvar Observação
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewObservation;
