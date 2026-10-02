import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '@/App';
import DemoStoreProvider from '@/store/DemoStoreProvider';
import './lacunas-jsdom';

/*
 * A tela de Desempenho, montada de verdade.
 *
 * O QUE ELA DIZIA ATÉ A ETAPA 9: curva fixa 65-72-78-85, "12/15 alcançados", "94% de presença",
 * "Bom" de integração e uma lista de objetivos inventada — tudo igual para qualquer estudante.
 * Presença e integração SAÍRAM: não existe entidade de frequência nem medida de integração, e
 * número sem registro de origem é invenção.
 *
 * O caso mais importante daqui é o das DUAS MEDIDAS convivendo: 60% é o que a avaliação de
 * 01/11/2025 mediu, 50% é o estado corrente das metas do plano. A tela mostra os dois, cada um
 * com o nome do que é. Um teste que só procurasse "uma porcentagem" não distinguiria isso.
 */

const LENTO = 30_000;

/** O que era fixo e igual para qualquer estudante. Nenhum pode sobreviver. */
const EXEMPLO_ANTIGO = [/65%/, /72%/, /78%/, /85%/, /12\/15/, /94%/, /Presença/, /Integração/, /Ler palavras simples/, /Recontar histórias/];

const abrir = (rota: string) => {
  window.history.pushState({}, '', rota);
  return render(
    <DemoStoreProvider>
      <App />
    </DemoStoreProvider>,
  );
};

const abrirDesempenho = async (user: UserEvent, rota: string) => {
  abrir(rota);
  await user.click(await screen.findByRole('button', { name: /Ver Desempenho Completo/ }));
  return within(await screen.findByRole('dialog'));
};

beforeEach(() => {
  localStorage.clear();
});

describe('Desempenho: os números vêm dos registros do estudante', () => {
  it(
    'as duas medidas aparecem com nomes diferentes, e o exemplo fixo sumiu',
    async () => {
      const user = userEvent.setup({ delay: null });
      const dialogo = await abrirDesempenho(user, '/alunos/1');

      for (const texto of EXEMPLO_ANTIGO) {
        expect(dialogo.queryByText(texto), String(texto)).toBeNull();
      }

      // A medição datada: a única avaliação da semente mediu 60%.
      expect(
        dialogo.getByText(/Uma única avaliação registrada, de 01\/11\/2025: 60%/),
      ).toBeInTheDocument();
      // O estado corrente das metas: 50%, com o rótulo que diz de onde vem.
      expect(dialogo.getByText('Progresso nas metas do PEI')).toBeInTheDocument();
      expect(dialogo.getByText('50%')).toBeInTheDocument();
      expect(dialogo.getByText('1/4')).toBeInTheDocument();
      expect(dialogo.getByText(/Metas alcançadas no plano vigente/)).toBeInTheDocument();

      // Conquistas e próximos passos saem do resumo da avaliação, não de uma lista fixa.
      expect(dialogo.getByText(/Ampliou o vocabulário funcional/)).toBeInTheDocument();
    },
    LENTO,
  );

  it(
    'as abas mostram as metas do plano e o que a avaliação registrou',
    async () => {
      const user = userEvent.setup({ delay: null });
      const dialogo = await abrirDesempenho(user, '/alunos/1');

      await user.click(dialogo.getByRole('tab', { name: 'Metas do PEI' }));
      expect(
        await dialogo.findByText('Reconhecer e ler palavras do vocabulário funcional'),
      ).toBeInTheDocument();
      expect(dialogo.getByText('Contar até 50 com material concreto')).toBeInTheDocument();

      await user.click(dialogo.getByRole('tab', { name: 'Por área curricular' }));
      // Nível em palavra, não em número solto: "Bom", não "4".
      expect(await dialogo.findByText(/Leitura:/)).toBeInTheDocument();
      expect(dialogo.getByText(/Níveis registrados na avaliação de 01\/11\/2025/)).toBeInTheDocument();
      // Meta socioemocional não entra na aba curricular.
      expect(dialogo.queryByText('Antecipar transições com apoio visual')).toBeNull();

      await user.click(dialogo.getByRole('tab', { name: 'Socioemocionais' }));
      expect(await dialogo.findByText('Pede ajuda quando precisa')).toBeInTheDocument();
      expect(dialogo.getByText('Antecipar transições com apoio visual')).toBeInTheDocument();
      // E a meta curricular não entra na socioemocional.
      expect(dialogo.queryByText('Contar até 50 com material concreto')).toBeNull();

      await user.click(dialogo.getByRole('tab', { name: 'Comparativos' }));
      expect(await dialogo.findByText('Não há comparação para mostrar.')).toBeInTheDocument();
      // CONTROLE: a aba de comparação não pode trazer número nenhum.
      expect(dialogo.queryByText(/\d+%/)).toBeNull();
    },
    LENTO,
  );

  it(
    'estudante sem registros: a tela diz o que falta, sem porcentagem',
    async () => {
      const user = userEvent.setup({ delay: null });
      const dialogo = await abrirDesempenho(user, '/alunos/2');

      expect(dialogo.getByText(/Nenhuma avaliação com objetivos medidos/)).toBeInTheDocument();
      expect(dialogo.getByText('Sem PEI vigente')).toBeInTheDocument();
      expect(
        dialogo.getByText('Nenhuma avaliação registrada para este estudante.'),
      ).toBeInTheDocument();
      // Nem 0%, nem o número do outro estudante.
      expect(dialogo.queryByText(/\d+%/)).toBeNull();
      expect(dialogo.queryByText(/Ampliou o vocabulário funcional/)).toBeNull();
    },
    LENTO,
  );
});
