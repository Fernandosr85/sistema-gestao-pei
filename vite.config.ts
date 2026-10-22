import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

/*
 * O CAMINHO BASE DA PUBLICAÇÃO, num lugar só (Etapa 20).
 *
 * O GitHub Pages deste repositório serve em `https://fernandosr85.github.io/sistema-gestao-pei/`,
 * então a aplicação publicada vive sob um SUBCAMINHO, não na raiz. Duas coisas precisam saber
 * disso: o Vite, para reescrever os caminhos dos recursos, e o roteador, para não procurar
 * `/sistema-gestao-pei/alunos/1` entre as rotas declaradas.
 *
 * A string fica AQUI e só aqui. O roteador não a repete: ele lê `import.meta.env.BASE_URL`, que é o
 * próprio `base` abaixo, derivado pelo Vite. Fixar a mesma string em dois arquivos é o defeito que
 * a Etapa 10 pagou para aprender em outro contexto — duas fontes para o mesmo fato divergem.
 *
 * Condicional por modo: em `development` (o `npm run dev` e os testes) continua `/`, porque ali a
 * aplicação é servida na raiz e um subcaminho quebraria tudo sem avisar.
 */
const BASE_DA_PUBLICACAO = "/sistema-gestao-pei/";

/*
 * O QUE O GITHUB PAGES PRECISA, E QUE O BUILD PASSA A ESCREVER (Etapa 20).
 *
 * 1. `404.html`, cópia do `index.html` GERADO. O Pages é servidor de arquivo estático: ele não sabe
 *    que `/alunos/1` é rota de uma aplicação de página única, e devolveria 404 de verdade num
 *    recarregamento. Servindo o `index.html` como página de 404, a aplicação carrega e o roteador
 *    resolve o caminho do lado do cliente. Tem de ser cópia do gerado, não do `index.html` da raiz
 *    do repositório: só o gerado tem os caminhos com o subcaminho e os nomes com hash.
 * 2. `.nojekyll`, porque o Pages passa o conteúdo pelo Jekyll por padrão, e o Jekyll ignora
 *    diretório que comece com `_`. O Vite não gera `_assets`, mas qualquer dependência que gere
 *    quebraria em silêncio — o arquivo é barato e fecha a classe.
 *
 * No BUILD e não à mão: arquivo copiado à mão sai de sincronia no primeiro build seguinte, e ninguém
 * descobre até alguém recarregar uma rota profunda na página publicada.
 */
const paginasDoGitHub = () => ({
  name: "paginas-do-github",
  closeBundle() {
    const saida = path.resolve(__dirname, "dist");
    const indice = path.join(saida, "index.html");
    if (!fs.existsSync(indice)) {
      throw new Error("paginas-do-github: dist/index.html não existe — o build não produziu a página");
    }
    fs.copyFileSync(indice, path.join(saida, "404.html"));
    fs.writeFileSync(path.join(saida, ".nojekyll"), "");
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? BASE_DA_PUBLICACAO : "/",
  server: {
    host: "localhost",
    port: 8080,
  },
  plugins: [react(), paginasDoGitHub()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
          calendar: ["react-big-calendar", "moment"],
        },
      },
    },
  },
}));
