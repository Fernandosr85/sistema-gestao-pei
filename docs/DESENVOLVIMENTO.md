# Desenvolvimento

Instruções para **rodar e verificar o Sistema de Gestão PEI localmente**.

**Não é um guia de contribuição.** O projeto tem um único mantenedor e não espera contribuição
externa: não existe fila de triagem, processo de revisão nem critério de aceitação de código de
terceiros. Descrever um fluxo desses seria prometer um processo que não existe. O que está aqui
serve a quem clona e roda o projeto — inclusive ao próprio autor dentro de seis meses.

As regras de trabalho, as invariantes do projeto e as convenções de commit ficam em
[`CLAUDE.md`](../CLAUDE.md), na raiz. Este arquivo não as repete.

## Pré-requisitos

- **Node 22.13+ ou 24+.** As versões ímpares 21 e 23 não servem. O `package.json` declara
  `engines.node` como `^22.13.0 || >=24.0.0`, e o número foi medido pelos `engines` dos pacotes
  instalados (ver "O pré-requisito de Node estava errado desde a Etapa 7", no backlog).
- npm
- Git

## Rodar local

```bash
git clone https://github.com/Fernandosr85/sistema-gestao-pei.git
cd sistema-gestao-pei
npm ci
npm run dev
```

`npm ci` instala exatamente o que está no `package-lock.json`, e é o que o CI roda — `npm install`
pode atualizar o lockfile sem ninguém pedir. A aplicação sobe em:

```text
http://localhost:8080
```

A porta e o host estão fixados em `vite.config.ts` (`localhost:8080`): o servidor de
desenvolvimento não escuta em outras interfaces.

**Para começar de um estado limpo**, apague a chave `pei-demo-store` do `localStorage` do site (ou
limpe os dados do site) e recarregue. A chave só é criada na primeira escrita; carregar a página
não grava nada.

## As quatro verificações

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Nenhuma alteração é considerada pronta antes de as quatro passarem. Os critérios de aceite de cada
uma — 0 erros no lint com quatro avisos aceitos em `src/components/ui/`, typecheck silencioso,
suíte verde, build concluindo — estão em [`CLAUDE.md`](../CLAUDE.md), junto da regra de que zero
teste coletado **reprova**.

O CI (`.github/workflows/ci.yml`) roda as quatro em Node 22 a cada `push` no `main` e a cada pull
request. `npm test` entra nele desde 18/09/2026; antes dessa data o CI tinha três passos, porque a
suíte não existia.

## Estrutura de pastas

Conferida em 03/10/2026:

```text
src/pages/         # Rotas e páginas
src/components/    # Componentes reutilizáveis (ui/ = primitivos shadcn)
src/store/         # Store externo, reducer, persistência, migrações e esquemas zod
src/data/          # Semente de demonstração
src/types/         # Interfaces TypeScript compartilhadas
src/hooks/         # Hooks customizados
src/lib/           # Seletores de domínio e utilitários
src/config/        # Configuração institucional (invariante 1 do CLAUDE.md)
src/test/          # Suíte de árvore React, arreio e remendos de jsdom
docs/              # Documentação
scripts/           # Arreio de superfície (fotografia.js) e mutações (mutacoes/)
```

## Stack

React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Hook Form e Zod.

Não há cliente HTTP nem camada de dados remota: o estado vive num store externo próprio
(`src/store/`), lido pelos componentes com `useSyncExternalStore` e persistido no `localStorage`.
