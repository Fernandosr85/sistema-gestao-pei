import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '@/App';
import DemoStoreProvider from '@/store/DemoStoreProvider';
import './lacunas-jsdom';

/*
 * O único teste desta suíte que monta a árvore React de verdade: o App inteiro, com o roteador,
 * o provedor do store, o cabeçalho e os formulários reais de react-hook-form e Radix.
 *
 * O que ele prova, e nenhum dos outros prova: que o caminho do formulário até a LISTAGEM está
 * inteiro. Reducer, persistência e seletores já têm teste próprio e cada um passa sozinho — o
 * defeito que sobra é o do fio solto entre eles: o `dispatch` que não é chamado, a rota que não
 * leva a lugar nenhum, a listagem que lê outra coleção. Parar antes da listagem trocaria este
 * teste por outro, mais barato e sem essa cobertura.
 *
 * Toda asserção de presença vem depois de uma asserção de AUSÊNCIA do mesmo texto na mesma
 * tela: sem isso, "o nome aparece" não distingue o cadastro de um nome que já estava na semente.
 */

const LENTO = 30_000; // Digitar doze campos em jsdom passa dos 5s padrão do vitest.

const aluno = {
  nome: 'Marina Fluxo de Teste',
  matricula: 'MAT-FLUXO-001',
  serie: '3º Ano EF',
};

const abrir = (rota: string) => {
  window.history.pushState({}, '', rota);
  return render(
    <DemoStoreProvider>
      <App />
    </DemoStoreProvider>,
  );
};

/** O toast de sucesso repete o nome do aluno fora do <main>. Consultar só o miolo da página. */
const pagina = () => within(screen.getByRole('main'));

const escolher = async (user: UserEvent, rotulo: RegExp, opcao: string | RegExp) => {
  await user.click(screen.getByLabelText(rotulo));
  await user.click(await screen.findByRole('option', { name: opcao }));
};

const preencher = async (user: UserEvent, rotulo: string, valor: string) => {
  await user.type(screen.getByLabelText(rotulo), valor);
};

/*
 * Campo de data: jsdom sanitiza valor parcial de <input type="date"> para string vazia, então
 * digitar caractere a caractere nunca chega a uma data válida. O evento de mudança é o que o
 * react-hook-form escuta, e é o que o navegador emite quando o seletor de data devolve o valor.
 */
const preencherData = (rotulo: string, valor: string) => {
  fireEvent.change(screen.getByLabelText(rotulo), { target: { value: valor } });
};

const cadastrarAluno = async (user: UserEvent, nome: string, matricula: string) => {
  await preencher(user, 'Nome Completo *', nome);
  preencherData('Data de Nascimento *', '2015-03-12');
  await preencher(user, 'Matrícula *', matricula);
  await escolher(user, /^Série \*$/, aluno.serie);
  await preencher(user, 'Turma *', 'Turma A');
  await preencher(user, 'Diagnóstico *', 'TEA Nível 1');
  await preencher(user, 'Professor Responsável *', 'Prof. Fictício');
  await preencher(user, 'Nome do Responsável *', 'Responsável Fictício');
  await preencher(user, 'Parentesco *', 'Mãe');
  await preencher(user, 'Telefone *', '(11) 90000-0001');
  await preencher(user, 'Email *', 'responsavel@example.org');
  await user.click(screen.getByRole('button', { name: /Salvar Aluno/ }));
};

const registrarObservacao = async (user: UserEvent, opcaoAluno: RegExp) => {
  await escolher(user, /^Aluno \*$/, opcaoAluno);
  await preencher(user, 'Observador *', 'Prof. Fictício');
  await preencher(user, 'Duração (minutos) *', '45');
  await preencher(user, 'Contexto *', 'Roda de leitura na sala');
  await preencher(user, 'Resposta do Aluno *', 'Respondeu com apoio visual');
  await preencher(user, 'Tipo de Interação *', 'Interação com colega');
  await preencher(user, 'Descrição *', 'Dividiu o material sem ser solicitado');
  await preencher(user, 'Comportamentos Positivos *', 'Cooperação, iniciativa');
  await preencher(user, 'Comportamentos Desafiadores *', 'Sai da cadeira na transição');
  await preencher(user, 'Ponto Forte *', 'Memória visual');
  await preencher(user, 'Desafio Principal *', 'Tempo de espera');
  await preencher(user, 'Ajustes Necessários *', 'Apoio visual antes da troca de atividade');
  await user.click(screen.getByRole('button', { name: /Salvar Observação/ }));
};

beforeEach(() => {
  localStorage.clear();
});

describe('cadastro de aluno', () => {
  it(
    'do formulário até a listagem, e a busca encontra o registro novo',
    async () => {
      const user = userEvent.setup({ delay: null });
      abrir('/alunos');
      expect(pagina().queryByText(aluno.nome)).toBeNull();
      const antes = Number(
        pagina().getByText(/Mostrando/).textContent?.match(/de (\d+) alunos/)?.[1],
      );
      expect(antes).toBeGreaterThan(0);

      await user.click(screen.getByRole('link', { name: /Novo Aluno/ }));
      await screen.findByRole('heading', { name: 'Novo Aluno', level: 1 });
      await cadastrarAluno(user, aluno.nome, aluno.matricula);

      // A navegação faz parte do fluxo: sem ela o cadastro some da vista de quem cadastrou.
      await screen.findByRole('heading', { name: 'Gestão de Alunos', level: 1 });
      expect(pagina().getByRole('heading', { name: aluno.nome })).toBeInTheDocument();
      expect(pagina().getByText(/Mostrando/).textContent).toContain(`de ${antes + 1} alunos`);

      // E o registro está nos dados, não só na tela: o filtro de busca o encontra sozinho.
      await user.type(screen.getByPlaceholderText(/Buscar por nome ou matrícula/), aluno.matricula);
      expect(pagina().getAllByRole('heading', { level: 3 })).toHaveLength(1);
      expect(pagina().getByRole('heading', { name: aluno.nome })).toBeInTheDocument();
    },
    LENTO,
  );

  it('CONTROLE: formulário vazio não cadastra e não navega', async () => {
    const user = userEvent.setup({ delay: null });
    abrir('/alunos/novo');
    await user.click(screen.getByRole('button', { name: /Salvar Aluno/ }));

    expect(await screen.findByText('Nome completo é obrigatório')).toBeInTheDocument();
    expect(pagina().getByRole('heading', { name: 'Novo Aluno', level: 1 })).toBeInTheDocument();
    expect(localStorage.getItem('pei-demo-store')).toBeNull();
  });

  it(
    'o aluno cadastrado sobrevive a recarregar a página',
    async () => {
      const user = userEvent.setup({ delay: null });
      const tela = abrir('/alunos/novo');
      await cadastrarAluno(user, aluno.nome, aluno.matricula);
      await screen.findByRole('heading', { name: 'Gestão de Alunos', level: 1 });

      // Desmontar e montar de novo é o que o navegador faz ao recarregar: o store nasce outra
      // vez e só tem o que a persistência gravou.
      tela.unmount();
      abrir('/alunos');
      expect(pagina().getByRole('heading', { name: aluno.nome })).toBeInTheDocument();
    },
    LENTO,
  );
});

describe('registro de observação', () => {
  it(
    'a observação nova aparece na listagem sob o nome do aluno, buscado por id',
    async () => {
      const user = userEvent.setup({ delay: null });
      const tela = abrir('/alunos/novo');
      await cadastrarAluno(user, aluno.nome, aluno.matricula);
      await screen.findByRole('heading', { name: 'Gestão de Alunos', level: 1 });
      tela.unmount();

      const listagem = abrir('/observacoes');
      // Ausência antes: o nome só chega a esta tela pela observação que ainda falta registrar.
      expect(pagina().queryByText(aluno.nome)).toBeNull();
      const antes = pagina().getAllByRole('heading', { level: 3 }).length;
      listagem.unmount();

      abrir('/observacoes/nova');
      await registrarObservacao(user, new RegExp(aluno.nome));

      await screen.findByRole('heading', { name: 'Observações Diárias', level: 1 });
      const cartoes = pagina().getAllByRole('heading', { level: 3 });
      expect(cartoes).toHaveLength(antes + 1);
      /*
       * O nome no cartão não está guardado na observação: a Etapa 5 tirou a cópia, e a tela
       * resolve `studentId` contra a coleção de alunos. Este é o par de pontas que a cópia
       * desfazia — o aluno foi cadastrado numa tela e o nome dele é lido em outra.
       */
      expect(pagina().getByRole('heading', { name: aluno.nome })).toBeInTheDocument();
      expect(pagina().getByText('45 min')).toBeInTheDocument();
    },
    LENTO,
  );
});
