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
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      passWithNoTests: false,
      reporters: ['default'],
    },
  }),
);
