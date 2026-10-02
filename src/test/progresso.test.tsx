import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '@/App';
import DemoStoreProvider from '@/store/DemoStoreProvider';
import './lacunas-jsdom';

/*
 * O número de progresso nas duas telas em que ele aparece: a listagem de alunos (o mesmo cartão
 * que o Dashboard monta) e a ficha do estudante.
 *
 * POR QUE ESTE ARQUIVO EXISTE. A Etapa 9 trocou a FONTE do número — era a média dos objetivos da
 * avaliação mais recente, passou a ser a média das metas do PEI vigente —, e trocar a fonte sem
 * trocar o rótulo seria o pior resultado possível: o mesmo texto na tela, outro número por trás.
 * Os seletores têm teste próprio; o que faltava era prender o PAR número-rótulo onde ele é lido.
 *
 * Cada caso assevera o valor da fonte ANTIGA como falsificação: 60% para a estudante 1 e "Sem
 * avaliação registrada" para quem não tem plano. Assim "passou" significa "o número vem do
 * plano e o rótulo diz isso", e não "existe um número na tela".
 */

const LENTO = 30_000;

const abrir = (rota: string) => {
  window.history.pushState({}, '', rota);
  return render(
    <DemoStoreProvider>
      <App />
    </DemoStoreProvider>,
  );
};

const pagina = () => within(screen.getByRole('main'));

beforeEach(() => {
  localStorage.clear();
});

describe('o progresso na listagem de alunos', () => {
  it(
    'o rótulo diz de onde o número vem, e o número é o das metas do plano',
    async () => {
      abrir('/alunos');
      await screen.findByRole('heading', { name: 'Gestão de Alunos', level: 1 });

      // Quatro cartões, um rótulo em cada: o texto é o mesmo para quem tem e para quem não tem.
      expect(pagina().getAllByText('Progresso nas metas do PEI')).toHaveLength(4);
      expect(pagina().queryByText(/Progresso médio dos objetivos na avaliação mais recente/)).toBeNull();

      expect(pagina().getByText('50%')).toBeInTheDocument();
      // Falsificação: 60% é a média dos objetivos de `avl-1`, o número da fonte antiga.
      expect(pagina().queryByText('60%')).toBeNull();

      // Os três sem plano: a ausência tem nome, e não é zero.
      expect(pagina().getAllByText('Sem PEI vigente')).toHaveLength(3);
      expect(pagina().queryByText('Sem avaliação registrada')).toBeNull();
      expect(pagina().queryByText('0%')).toBeNull();
    },
    LENTO,
  );
});

describe('o progresso na ficha do estudante', () => {
  it(
    'estudante com plano: 50% no círculo, com o rótulo do plano, e a revisão contada',
    async () => {
      abrir('/alunos/1');
      await screen.findByRole('heading', { name: 'Maria Silva Santos', level: 2 });

      expect(pagina().getByText('50%')).toBeInTheDocument();
      expect(pagina().queryByText('60%')).toBeNull();
      expect(pagina().getByText('Progresso nas metas do PEI')).toBeInTheDocument();
      expect(pagina().queryByText(/Progresso médio dos objetivos/)).toBeNull();

      // A revisão do PEI entrou na contagem de registros do estudante.
      expect(pagina().getByText('Revisões do PEI: 1')).toBeInTheDocument();
    },
    LENTO,
  );

  it(
    'estudante sem plano: "Sem PEI vigente", sem porcentagem nenhuma',
    async () => {
      abrir('/alunos/2');
      await screen.findByRole('heading', { name: 'Pedro Oliveira Costa', level: 2 });

      expect(pagina().getByText('Sem PEI vigente')).toBeInTheDocument();
      expect(pagina().queryByText('Sem avaliação registrada')).toBeNull();
      expect(pagina().queryByText('0%')).toBeNull();
      expect(pagina().queryByText('50%')).toBeNull();
      expect(pagina().getByText('Revisões do PEI: 0')).toBeInTheDocument();
    },
    LENTO,
  );
});
