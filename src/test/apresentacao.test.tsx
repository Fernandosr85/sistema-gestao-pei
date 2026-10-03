import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '@/App';
import DemoStoreProvider from '@/store/DemoStoreProvider';
import { createSeedState } from '@/store/seed';
import './lacunas-jsdom';

/*
 * O Modo Apresentação, montado de verdade.
 *
 * É a tela em que mentir custa mais caro: o material que uma escola levaria para a reunião com a
 * família. Até a Etapa 9 eram doze slides fixos, iguais para qualquer criança — 85%, "12 de 15
 * objetivos", "aumento de 15% desde o último trimestre", conquistas inventadas e oito slides
 * "em desenvolvimento".
 *
 * O que este arquivo prende: que o número de slides VEM DO PLANO (não é constante), que o
 * conteúdo é do estudante aberto, e que sem plano vigente não se monta apresentação nenhuma.
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

const abrirApresentacao = async (user: UserEvent, rota: string) => {
  abrir(rota);
  await user.click(await screen.findByRole('button', { name: /Modo Apresentação/ }));
  return within(await screen.findByRole('dialog'));
};

beforeEach(() => {
  localStorage.clear();
});

describe('Modo Apresentação: os slides vêm do plano', () => {
  it(
    'o preview lista os slides que serão montados, e o número vem das metas',
    async () => {
      const user = userEvent.setup({ delay: null });
      const dialogo = await abrirApresentacao(user, '/alunos/1');

      // 4 metas na semente: capa + progresso + 4 metas + conquistas + próximos passos = 8.
      expect(dialogo.getByText(/8 slides, montados do PEI 2025 - 4º Trimestre/)).toBeInTheDocument();
      expect(dialogo.getByText('Reconhecer e ler palavras do vocabulário funcional')).toBeInTheDocument();
      // CONTROLE: o "12" era o número de slides do exemplo fixo, com oito deles vazios.
      expect(dialogo.queryByText(/Slides estimados/)).toBeNull();
      expect(dialogo.queryByText(/Duração estimada/)).toBeNull();
    },
    LENTO,
  );

  it(
    'a apresentação anda pelos slides do estudante, e o exemplo fixo sumiu',
    async () => {
      const user = userEvent.setup({ delay: null });
      const dialogo = await abrirApresentacao(user, '/alunos/1');
      await user.click(dialogo.getByRole('button', { name: /Iniciar apresentação/ }));

      const regiao = await screen.findByRole('region', { name: /^Slide 1 de 8/ });
      const slide = within(regiao);
      expect(slide.getByRole('heading', { name: 'Maria Silva Santos', level: 1 })).toBeInTheDocument();
      expect(slide.getByText('PEI 2025 - 4º Trimestre')).toBeInTheDocument();

      /*
       * O FOCO AO ABRIR, que é o que faz o leitor de tela anunciar o primeiro slide. Esta
       * asserção nasceu de uma regressão medida: ao separar o player em componente próprio, ele
       * passou a montar junto com o diálogo, o foco automático do Radix passou a correr na mesma
       * hora que o efeito do slide, e o foco deixava de chegar aqui — só no slide 1, e sem que
       * nenhum teste ou o arreio notasse.
       */
      expect(regiao).toHaveFocus();

      const apresentacao = within(screen.getByRole('dialog'));
      expect(apresentacao.getByText(/Slide 1 de 8/)).toBeInTheDocument();

      await user.click(apresentacao.getByRole('button', { name: /Próximo/ }));
      expect(await apresentacao.findByText(/Slide 2 de 8/)).toBeInTheDocument();
      // O progresso do slide 2 é o das metas, 50% — e não os 85% fixos de antes.
      expect(apresentacao.getByText('50%')).toBeInTheDocument();
      expect(apresentacao.queryByText('85%')).toBeNull();
      expect(apresentacao.queryByText(/12 de 15 objetivos/)).toBeNull();
      expect(apresentacao.queryByText(/Aumento de 15%/)).toBeNull();

      await user.click(apresentacao.getByRole('button', { name: /Próximo/ }));
      expect(await apresentacao.findByText(/Slide 3 de 8/)).toBeInTheDocument();
      expect(apresentacao.getByRole('heading', { name: 'Reconhecer e ler palavras do vocabulário funcional' })).toBeInTheDocument();

      /*
       * O nome da região é o que o leitor de tela anuncia a cada troca (Etapa 3). Ele inclui o
       * número do slide E o título, então precisa acompanhar o slide atual.
       */
      expect(screen.getByRole('region', { name: /^Slide 3 de 8/ })).toHaveAttribute(
        'aria-label',
        'Slide 3 de 8: Reconhecer e ler palavras do vocabulário funcional',
      );
    },
    LENTO,
  );

  it(
    'com dois planos no store, a apresentação traz só as metas do plano deste estudante',
    async () => {
      /*
       * A semente tem um plano só, e com um plano só a tela passaria mesmo lendo TODAS as metas
       * do sistema — foi o que uma mutação mostrou. Este caso carrega um segundo plano, de outro
       * estudante, e aí as duas leituras se separam. A carga entra pelo localStorage, que é o
       * caminho real: o store nasce do que foi gravado.
       */
      const estado = createSeedState();
      estado.peis.push({ ...estado.peis[0], id: 'pei-2', studentId: '2' });
      estado.peiGoals.push({
        ...estado.peiGoals[0],
        id: 'pei-goal-de-outro',
        peiId: 'pei-2',
        title: 'Meta do plano de outro estudante',
      });
      localStorage.setItem(
        'pei-demo-store',
        JSON.stringify({ version: 4, savedAt: '2026-01-01T00:00:00.000Z', state: estado }),
      );

      const user = userEvent.setup({ delay: null });
      const dialogo = await abrirApresentacao(user, '/alunos/1');

      expect(dialogo.getByText(/8 slides, montados do PEI/)).toBeInTheDocument();
      expect(dialogo.queryByText('Meta do plano de outro estudante')).toBeNull();
      expect(dialogo.getByText('Reconhecer e ler palavras do vocabulário funcional')).toBeInTheDocument();
    },
    LENTO,
  );

  it(
    'estudante sem plano vigente não tem apresentação, e o botão de iniciar nem aparece',
    async () => {
      const user = userEvent.setup({ delay: null });
      const dialogo = await abrirApresentacao(user, '/alunos/2');

      expect(dialogo.getByText('Sem PEI vigente, não há apresentação.')).toBeInTheDocument();
      expect(dialogo.queryByRole('button', { name: /Iniciar apresentação/ })).toBeNull();
      // E nada do plano da outra criança.
      expect(dialogo.queryByText(/Reconhecer e ler palavras/)).toBeNull();
      expect(dialogo.queryByText(/50%/)).toBeNull();
    },
    LENTO,
  );
});
