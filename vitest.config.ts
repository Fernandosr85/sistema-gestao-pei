import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

/*
 * A suíte usa o mesmo vite.config.ts da aplicação — mesmos alias, mesmo plugin de React —
 * para o que o teste importa ser o que o navegador importa. Um segundo pipeline de build seria
 * um segundo lugar onde a resolução pode divergir.
 *
 * O config da aplicação é exportado como função, e `mergeConfig` não funde callback: por isso
 * ele é chamado aqui com o ambiente do teste.
 *
 * `passWithNoTests: false` é o controle mais barato da etapa. O modo de falha equivalente ao
 * typecheck vazio da Etapa 0 é "0 testes coletados, saída 0": se um padrão de arquivo deixar de
 * casar, a suíte fica verde sem ter executado nada. Com isto, essa situação reprova.
 */
export default mergeConfig(
  viteConfig({ command: 'serve', mode: 'test' }),
  defineConfig({
    test: {
      /*
       * Fuso FIXO, e não o da máquina. Os defeitos de data da Etapa 4 só existem a oeste de
       * UTC: 'new Date(AAAA-MM-DD)' é meia-noite em UTC e cai no dia anterior. O CI roda em
       * ubuntu-latest, que é UTC — medido: com TZ=UTC a suíte de datas passa sem exercitar
       * um único caso do defeito. Sem este pino, o teste ficaria verde no CI justamente onde
       * o bug não pode aparecer.
       */
      env: { TZ: 'America/Sao_Paulo' },
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      passWithNoTests: false,
      reporters: ['default'],
    },
  }),
);
