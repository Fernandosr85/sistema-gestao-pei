import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '@/App';
import DemoStoreProvider from '@/store/DemoStoreProvider';
import { createSeedState } from '@/store/seed';
import './lacunas-jsdom';

/*
 * O detalhe da observação, montado de verdade.
 *
 * O QUE ELE INVENTAVA até a Etapa 9, e por que isso era grave: além de horário, local, gatilhos,
 * plano de ação e evidências que não existiam, o diálogo trazia um texto de "Observações
 * Adicionais" ASSINADO pelo observador e uma notificação com RESPOSTA DA FAMÍLIA entre aspas.
 * Texto fictício atribuído, com nome, a quem não escreveu — a classe do achado 1.
 *
 * O que fica preso aqui: que nada disso voltou, e que "Relacionado a" agora é o grafo do
 * registro — as metas cujas notas citam esta observação como evidência.
 */

const LENTO = 30_000;

/** Trechos que o diálogo inventava. Nenhum pode voltar. */
const INVENTADO = [
  /Objetivo PEI #3/,
  /Crescimento: \+200%/,
  /GATILHOS IDENTIFICADOS/,
  /PLANO DE AÇÃO/,
  /Evidências Anexadas/,
  /Observações Adicionais/,
  /Notificações Enviadas/,
  /Obrigada pelo retorno/,
  /Sala de Aula Regular/,
  /08:30 - 10:30/,
  /Visualizado às/,
  /Metadados/,
];

const abrir = (rota: string) => {
  window.history.pushState({}, '', rota);
  return render(
    <DemoStoreProvider>
      <App />
    </DemoStoreProvider>,
  );
};

beforeEach(() => {
  localStorage.clear();
});

describe('Detalhe da observação: só o que foi registrado', () => {
  it(
    'mostra o que a observação tem, e nada do que o diálogo inventava',
    async () => {
      const user = userEvent.setup({ delay: null });
      abrir('/observacoes');
      await user.click((await screen.findAllByRole('button', { name: /Ver Detalhes/ }))[0]);
      const dialogo = within(await screen.findByRole('dialog'));

      for (const texto of INVENTADO) {
        expect(dialogo.queryByText(texto), String(texto)).toBeNull();
      }

      // O que está gravado na observação obs-1.
      expect(dialogo.getByRole('heading', { name: 'Maria Silva Santos', level: 2 })).toBeInTheDocument();
      expect(dialogo.getByText(/Manhã · 120 minutos/)).toBeInTheDocument();
      expect(dialogo.getByText(/Melhor comunicação verbal durante as atividades/)).toBeInTheDocument();

      /*
       * A ligação que passou a existir: a nota `pei-note-2` cita esta observação como evidência,
       * e a meta dela aparece aqui. É o `PeiGoalNote.source` percorrido ao contrário — a
       * observação não guarda lista de metas, que seria a cópia que a Etapa 5 ensinou a evitar.
       */
      expect(dialogo.getByText(/Antecipar transições com apoio visual/)).toBeInTheDocument();
      expect(
        dialogo.getByText(/Metas do PEI que citam esta observação/),
      ).toBeInTheDocument();
    },
    LENTO,
  );

  it(
    'observação que nenhuma meta cita diz isso, em vez de listar objetivo nenhum',
    async () => {
      /*
       * A semente tem uma observação só, e ela é citada por uma nota — com uma só, a tela
       * passaria mesmo listando as metas de QUALQUER observação. A segunda entra pelo
       * localStorage, que é o caminho real, e separa as duas leituras.
       */
      const estado = createSeedState();
      const base = estado.observations[0];
      // A semente tem uma observação estruturada; o estreitamento é do tipo, não suposição.
      if (base.kind !== 'structured') throw new Error('esperada observação estruturada na semente');
      estado.observations.push({
        ...base,
        id: 'obs-sem-nota',
        data: '2025-11-20',
        resumo: { ...base.resumo, pontoForte: 'Observação sem nota de meta' },
      });
      localStorage.setItem(
        'pei-demo-store',
        JSON.stringify({ version: 4, savedAt: '2026-01-01T00:00:00.000Z', state: estado }),
      );

      const user = userEvent.setup({ delay: null });
      abrir('/observacoes');
      const botoes = await screen.findAllByRole('button', { name: /Ver Detalhes/ });
      expect(botoes).toHaveLength(2);
      /*
       * O cartão certo é localizado pela data, não pela posição na lista: índice depende da
       * ordenação da tela, e um teste que depende dela passa a medir a ordenação sem querer.
       */
      const cartao = screen.getByText('20/11/2025').closest('div.card-hover') as HTMLElement;
      await user.click(within(cartao).getByRole('button', { name: /Ver Detalhes/ }));
      const dialogo = within(await screen.findByRole('dialog'));
      expect(dialogo.getByText('Observação sem nota de meta')).toBeInTheDocument();

      expect(
        dialogo.getByText('Nenhuma meta cita esta observação como evidência.'),
      ).toBeInTheDocument();
      // CONTROLE: não pode pegar a meta da OUTRA observação.
      expect(dialogo.queryByText(/Antecipar transições com apoio visual/)).toBeNull();
    },
    LENTO,
  );
});
