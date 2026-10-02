import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '@/App';
import DemoStoreProvider from '@/store/DemoStoreProvider';
import { createSeedState } from '@/store/seed';
import { toLocalISODate, todayLocalISO } from '@/lib/date';
import './lacunas-jsdom';

/*
 * Minha Agenda, montada de verdade. É a opção a' do backlog: os atendimentos do store, sem o
 * formulário de evento.
 *
 * O QUE ERA: uma semana inteira de exemplo — aulas, "carga total 40h", "Tarefas agendadas: 12",
 * um dia detalhado com planejamento e materiais, e alertas que nomeavam estudantes ("PEI de
 * Maria vence sexta", "Reunião Fam. Silva"). A lista de alunos estava escrita no código.
 *
 * O caso que importa aqui, e que não estava previsto: atendimento AINDA AGENDADO com data
 * passada. A seleção de "próximos" começa em hoje, e sem um bloco próprio esses registros
 * sumiriam da tela sem aviso — o defeito da Etapa 4 na forma "o registro existe e não aparece".
 * Os dados de demonstração têm datas fixas em 2025, então é exatamente o que a demonstração faz.
 */

const LENTO = 30_000;

/** O exemplo fixo que a tela mostrava. Nenhum pode voltar. */
const EXEMPLO_ANTIGO = [
  /Aula 2º Ano C/,
  /Carga total/,
  /Tarefas agendadas/,
  /PEI de Maria vence sexta/,
  /Reunião Fam\. Silva/,
  /Observações \(Pedro, João, Lucas\)/,
  /Adicionar Evento/,
  /em desenvolvimento/,
  /Intervalo de Almoço/,
];

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

describe('Minha Agenda: os atendimentos do store, sem exemplo fixo', () => {
  it(
    'lista os atendimentos registrados, com o nome do estudante resolvido pelo id',
    async () => {
      abrir('/minha-agenda');
      await screen.findByRole('heading', { name: 'Minha Agenda', level: 1 });

      for (const texto of EXEMPLO_ANTIGO) {
        expect(pagina().queryByText(texto), String(texto)).toBeNull();
      }

      // Os cinco atendimentos da semente aparecem, cada um em um bloco.
      expect(pagina().getAllByText(/Estudante:/)).toHaveLength(5);
      expect(pagina().getAllByText(/Maria Silva Santos/).length).toBeGreaterThan(0);
      // Rótulo em português, não o identificador da v4.
      expect(pagina().getAllByText('Atendimento Família').length).toBeGreaterThan(0);
      expect(pagina().queryByText('familyMeeting')).toBeNull();
    },
    LENTO,
  );

  it(
    'atendimento agendado com data passada aparece no bloco de atrasados, e não some',
    async () => {
      /*
       * A semente é de 2025 e o relógio do teste é o de hoje, então todos os agendados já
       * passaram. Para que o caso valha independentemente da data em que a suíte roda, este teste
       * grava um atendimento de hoje: um vai para "Próximos 7 dias" e os outros para o bloco de
       * atrasados. Sem data fixa, o teste passaria por acaso em 2025 e falharia depois.
       */
      const estado = createSeedState();
      const hoje = new Date();
      const daquiA = (dias: number) =>
        toLocalISODate(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + dias));
      estado.appointments.push({
        ...estado.appointments[0],
        id: 'atd-hoje',
        data: todayLocalISO(),
        status: 'agendado',
      });
      /*
       * O de daqui a 30 dias separa "Próximos 7 dias" de "Depois". Sem ele os dois blocos dariam
       * o mesmo resultado, e trocar a janela de 7 dias por "todos os futuros" passaria — foi o
       * que a mutação mostrou. Dado de teste que não distingue as implementações não verifica.
       */
      estado.appointments.push({
        ...estado.appointments[0],
        id: 'atd-depois',
        data: daquiA(30),
        status: 'agendado',
      });
      localStorage.setItem(
        'pei-demo-store',
        JSON.stringify({ version: 4, savedAt: '2026-01-01T00:00:00.000Z', state: estado }),
      );

      abrir('/minha-agenda');
      await screen.findByRole('heading', { name: 'Minha Agenda', level: 1 });

      expect(pagina().getByRole('heading', { name: 'Próximos 7 dias (1)' })).toBeInTheDocument();
      expect(pagina().getByRole('heading', { name: 'Depois (1)' })).toBeInTheDocument();
      // Os quatro agendados de 2025 continuam visíveis, em vez de sumirem da tela.
      expect(pagina().getByRole('heading', { name: 'Agendados com data já passada (4)' })).toBeInTheDocument();
      expect(pagina().getByRole('heading', { name: 'Realizados e cancelados (1)' })).toBeInTheDocument();

      // Falsificação: a soma dos blocos é o total de atendimentos. Nenhum registro se perde.
      expect(pagina().getAllByText(/Estudante:/)).toHaveLength(estado.appointments.length);
    },
    LENTO,
  );
});
