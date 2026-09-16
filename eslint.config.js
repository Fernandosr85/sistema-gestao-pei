import js from "@eslint/js";
import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

/**
 * Etapa 3 do BACKLOG. As regras de acessibilidade entraram como aviso, para servirem de
 * lista de trabalho: eram 8 no começo da etapa e chegaram a 0 no commit 5. Agora são erro,
 * e uma regressão de acessibilidade que elas cubram quebra o `npm run lint` e o CI.
 *
 * Elas não cobrem tudo: não atravessam abstração de componente, então um `<Card onClick>`
 * passa batido. O achado 2 do BACKLOG tem a medida disso.
 */
const JSX_A11Y_SEVERITY = "error";

const isOff = (value) => {
  const severity = Array.isArray(value) ? value[0] : value;
  return severity === "off" || severity === 0;
};

/**
 * Troca a severidade das regras ligadas e preserva as que o preset desliga.
 * `label-has-for`, por exemplo, vem desligada por estar obsoleta: ela exige
 * aninhamento E `htmlFor` ao mesmo tempo, e reativá-la traria 85 avisos sobre
 * rótulos que já estão corretos, escondendo os defeitos reais.
 */
const withSeverity = (rules, severity) =>
  Object.fromEntries(
    Object.entries(rules).map(([rule, value]) => [
      rule,
      isOff(value) ? value : Array.isArray(value) ? [severity, ...value.slice(1)] : severity,
    ]),
  );

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "jsx-a11y": jsxA11y,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...withSeverity(jsxA11y.flatConfigs.recommended.rules, JSX_A11Y_SEVERITY),
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
