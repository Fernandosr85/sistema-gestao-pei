import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '@/App';
import DemoStoreProvider from '@/store/DemoStoreProvider';
import './lacunas-jsdom';

/*
 * Remover uma linha da observação nova: para onde o foco vai, e o que é anunciado.
 *
 * O DEFEITO QUE ISTO PRENDE (Etapa 19, passo 2 do M10). Acionar um botão de remover pelo teclado
 * tirava a linha e deixava o foco em `document.body` — medido em Chrome por CDP, nos quatro casos
 * das duas listas —, sem escrever nada em região viva nenhuma. Quem não vê perdia duas coisas ao
 * mesmo tempo: a notícia de que a linha saiu e o lugar onde estava. O passo do M10 declarou o
 * critério ANTES de medir — é falha se não houver anúncio E o foco se perder —, e os quatro casos
 * davam FALHA.
 *
 * Cada teste aqui assevera O VALOR ERRADO ANTIGO junto do certo: que o foco NÃO é `document.body`
 * (era) e que a região viva NÃO está vazia (estava). Sem isso, "o teste passa" significaria só que
 * o componente rodou.
 *
 * POR QUE O ALVO DO FOCO MUDA DE CASO: o JSX esconde os botões de remover quando sobra uma linha
 * só, então focar a linha anterior só funciona quando ela continua tendo botão. Os dois ramos estão
 * cobertos — com linha anterior sobrevivente e sem.
 */

const LENTO = 30_000;

const abrir = () => {
  window.history.pushState({}, '', '/observacoes/nova');
  return render(
    <DemoStoreProvider>
      <App />
    </DemoStoreProvider>,
  );
};

/** A região viva das listas: única na página, montada vazia desde o começo. */
const regiaoViva = () => {
  const vivas = document.querySelectorAll('[role="status"][aria-live="polite"]');
  // O sistema de avisos (sonner) também tem região viva; a das listas é a que está dentro do form.
  const daLista = [...vivas].find((e) => e.closest('form'));
  return daLista ? (daLista.textContent ?? '') : null;
};

beforeEach(() => {
  localStorage.clear();
});

describe('Remover linha: o foco não se perde e a remoção é anunciada', () => {
  it(
    'com duas linhas, remover a segunda põe o foco em "Adicionar Situação" e anuncia',
    async () => {
      const user = userEvent.setup({ delay: null });
      abrir();

      await user.click(await screen.findByRole('button', { name: 'Adicionar Situação' }));
      const remover = await screen.findByRole('button', { name: 'Remover situação 2' });

      // O estado em que o defeito aparecia: o foco está no botão que vai desaparecer.
      await act(async () => { remover.focus(); });
      expect(document.activeElement).toBe(remover);
      expect(regiaoViva()).toBe('');

      await user.keyboard('{Enter}');

      // Com uma linha só, os dois botões de remover somem — era aqui que o foco caía no vazio.
      expect(screen.queryByRole('button', { name: /^Remover situação/ })).toBeNull();
      const adicionar = screen.getByRole('button', { name: 'Adicionar Situação' });
      expect(document.activeElement).toBe(adicionar);
      expect(document.activeElement).not.toBe(document.body);

      expect(regiaoViva()).toBe('Situação removida. Resta 1 situação na lista.');
      expect(regiaoViva()).not.toBe('');
    },
    LENTO,
  );

  it(
    'com três linhas, remover a última põe o foco no botão da linha anterior',
    async () => {
      const user = userEvent.setup({ delay: null });
      abrir();

      const adicionar = await screen.findByRole('button', { name: 'Adicionar Situação' });
      await user.click(adicionar);
      await user.click(adicionar);

      const remover = await screen.findByRole('button', { name: 'Remover situação 3' });
      await act(async () => { remover.focus(); });
      await user.keyboard('{Enter}');

      // Sobram duas linhas, então a anterior continua tendo botão: o foco fica na lista.
      const anterior = screen.getByRole('button', { name: 'Remover situação 2' });
      expect(document.activeElement).toBe(anterior);
      expect(document.activeElement).not.toBe(document.body);
      expect(regiaoViva()).toBe('Situação removida. Restam 2 situações na lista.');
    },
    LENTO,
  );

  it(
    'remover a PRIMEIRA linha não tem anterior, então o foco vai para "Adicionar Situação"',
    async () => {
      const user = userEvent.setup({ delay: null });
      abrir();

      const adicionar = await screen.findByRole('button', { name: 'Adicionar Situação' });
      await user.click(adicionar);
      await user.click(adicionar);

      const remover = await screen.findByRole('button', { name: 'Remover situação 1' });
      await act(async () => { remover.focus(); });
      await user.keyboard('{Enter}');

      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Adicionar Situação' }));
      expect(document.activeElement).not.toBe(document.body);
      expect(regiaoViva()).toBe('Situação removida. Restam 2 situações na lista.');
    },
    LENTO,
  );

  it(
    'a lista de interações se comporta igual, com o texto dela',
    async () => {
      const user = userEvent.setup({ delay: null });
      abrir();

      await user.click(await screen.findByRole('button', { name: 'Adicionar Interação' }));
      const remover = await screen.findByRole('button', { name: 'Remover interação 2' });
      await act(async () => { remover.focus(); });
      await user.keyboard('{Enter}');

      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Adicionar Interação' }));
      expect(document.activeElement).not.toBe(document.body);
      expect(regiaoViva()).toBe('Interação removida. Resta 1 interação na lista.');
    },
    LENTO,
  );

  it(
    'duas remoções seguidas mudam o texto anunciado, senão a segunda não seria reanunciada',
    async () => {
      const user = userEvent.setup({ delay: null });
      abrir();

      const adicionar = await screen.findByRole('button', { name: 'Adicionar Situação' });
      await user.click(adicionar);
      await user.click(adicionar);

      const terceiro = await screen.findByRole('button', { name: 'Remover situação 3' });
      await act(async () => { terceiro.focus(); });
      await user.keyboard('{Enter}');
      const primeiroTexto = regiaoViva();

      // O foco já está no botão da linha anterior: remover de novo, pelo teclado, sem procurar nada.
      await user.keyboard('{Enter}');
      const segundoTexto = regiaoViva();

      expect(primeiroTexto).toBe('Situação removida. Restam 2 situações na lista.');
      expect(segundoTexto).toBe('Situação removida. Resta 1 situação na lista.');
      /*
       * A asserção que justifica a contagem no texto: região viva com o MESMO conteúdo duas vezes
       * não é reanunciada pelo leitor de tela. Sem a contagem, estes dois textos seriam iguais.
       */
      expect(segundoTexto).not.toBe(primeiroTexto);
    },
    LENTO,
  );
});
