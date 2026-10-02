import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '@/App';
import DemoStoreProvider from '@/store/DemoStoreProvider';
import './lacunas-jsdom';

/*
 * A tela Ver PEI, montada de verdade — App, roteador, store e o diálogo do Radix.
 *
 * POR QUE ESTE TESTE EXISTE, e por que não bastava a suíte de seletores. A fotografia de
 * superfície não alcança esta tela: o arreio mede 23 rotas sem interação, e o PEI é um diálogo
 * que abre por clique. Então, para esta tela, a diferença zero na fotografia não é evidência de
 * nada — o instrumento não chega lá. O que prende o comportamento é este arquivo.
 *
 * O QUE ELE PROVA. Que o plano exibido é o do estudante aberto, que o número tem o rótulo que
 * diz de onde ele vem, e que estudante sem plano recebe "Sem PEI vigente" em vez de 0% ou do
 * plano de outra criança — a classe do achado 1, que esta tela já cometeu uma vez.
 *
 * Toda asserção de presença vem com a asserção de AUSÊNCIA do texto fixo que estava aqui até a
 * Etapa 9: sem isso, "aparece uma meta" não distinguiria o dado do store do exemplo antigo.
 */

const LENTO = 30_000;

/** Texto fixo que o diálogo mostrava para qualquer estudante até a Etapa 9. */
const EXEMPLO_ANTIGO = [
  /Escrever nome completo/,
  /Ler palavras simples/,
  /12\/15/,
  /PEI 2024 - 4º Trimestre/,
  /Professor\(a\) regente/,
  /não é o plano de/,
];

const abrir = (rota: string) => {
  window.history.pushState({}, '', rota);
  return render(
    <DemoStoreProvider>
      <App />
    </DemoStoreProvider>,
  );
};

const abrirPei = async (user: UserEvent, rota: string) => {
  abrir(rota);
  await user.click(await screen.findByRole('button', { name: /Ver PEI Ativo/ }));
  return within(await screen.findByRole('dialog'));
};

beforeEach(() => {
  localStorage.clear();
});

describe('Ver PEI: o plano é do estudante aberto', () => {
  it(
    'o estudante com plano vigente vê identificação, perfil e progresso do store',
    async () => {
      const user = userEvent.setup({ delay: null });
      const dialogo = await abrirPei(user, '/alunos/1');

      // CONTROLE: nada do exemplo fixo sobreviveu.
      for (const texto of EXEMPLO_ANTIGO) {
        expect(dialogo.queryByText(texto), String(texto)).toBeNull();
      }

      // Identificação, do plano pei-1 da semente.
      expect(dialogo.getByText(/2025 - 4º Trimestre/)).toBeInTheDocument();
      expect(dialogo.getByText('15/09/2025')).toBeInTheDocument();
      expect(dialogo.getByText('Profª. Ana Beatriz')).toBeInTheDocument();
      // Perfil, da parte II: o desafio que a observação obs-1 registrou.
      expect(dialogo.getByText('Transições entre atividades')).toBeInTheDocument();

      /*
       * O rótulo diz de que o número é. Existem dois progressos no sistema — a média das metas do
       * plano e a média dos objetivos da avaliação mais recente —, e um rótulo genérico deixaria
       * os dois indistinguíveis para quem lê a tela.
       */
      expect(dialogo.getByRole('heading', { name: 'Progresso nas metas do PEI' })).toBeInTheDocument();
      expect(dialogo.getByText('50%')).toBeInTheDocument();
      expect(dialogo.getByText(/Média das 4 metas do plano/)).toBeInTheDocument();
      expect(dialogo.getByText(/Alcançadas: 1 de 4/)).toBeInTheDocument();
      expect(dialogo.getByText(/Não iniciadas: 1 de 4/)).toBeInTheDocument();
    },
    LENTO,
  );

  it(
    'a aba Objetivos mostra as metas por área, com a nota e a evidência que ela cita',
    async () => {
      const user = userEvent.setup({ delay: null });
      const dialogo = await abrirPei(user, '/alunos/1');

      // A meta só existe depois do clique: o Radix monta o conteúdo da aba selecionada.
      expect(dialogo.queryByText(/Reconhecer e ler palavras do vocabulário funcional/)).toBeNull();
      await user.click(dialogo.getByRole('tab', { name: 'Objetivos' }));

      expect(
        await dialogo.findByText(/Reconhecer e ler palavras do vocabulário funcional/),
      ).toBeInTheDocument();
      // Área com o rótulo do manual, e não o identificador 'portuguese'.
      expect(dialogo.getByRole('heading', { name: /Língua Portuguesa \(1 meta\)/ })).toBeInTheDocument();
      expect(dialogo.queryByText(/portuguese/)).toBeNull();
      // Status em texto, não só em cor.
      expect(dialogo.getAllByText('Em progresso').length).toBeGreaterThan(0);
      expect(dialogo.getByText('Não iniciada')).toBeInTheDocument();

      // A nota da meta, e a evidência resolvida pelo registro citado (avl-1, de 01/11/2025).
      expect(dialogo.getByText(/Reconheceu as palavras familiares/)).toBeInTheDocument();
      expect(dialogo.getByText(/Avaliação de 01\/11\/2025/)).toBeInTheDocument();
      // A meta sem nota diz que não tem, em vez de omitir a seção.
      expect(dialogo.getAllByText('Nenhuma observação registrada nesta meta.').length).toBe(2);
    },
    LENTO,
  );

  it(
    'estudante sem plano vigente recebe "Sem PEI vigente" — não 0%, não o plano de outro',
    async () => {
      const user = userEvent.setup({ delay: null });
      const dialogo = await abrirPei(user, '/alunos/2');

      expect(dialogo.getByRole('heading', { name: 'Sem PEI vigente' })).toBeInTheDocument();
      expect(dialogo.getByText(/Pedro Oliveira Costa não tem PEI vigente registrado/)).toBeInTheDocument();

      /*
       * As três falsificações desta tela, na ordem em que elas já falharam em algum sistema:
       * mostrar o plano de outra criança (achado 1), mostrar 0% como se fosse medida, e mostrar o
       * progresso que vem de outra fonte sob o mesmo nome.
       */
      expect(dialogo.queryByText(/Reconhecer e ler palavras do vocabulário funcional/)).toBeNull();
      expect(dialogo.queryByText('Transições entre atividades')).toBeNull();
      expect(dialogo.queryByText('0%')).toBeNull();
      expect(dialogo.queryByText('50%')).toBeNull();
      expect(dialogo.queryByText(/Progresso nas metas do PEI/)).toBeNull();
      // Sem plano não há abas: não existe aba vazia para o leitor percorrer.
      expect(dialogo.queryByRole('tab')).toBeNull();
    },
    LENTO,
  );
});
