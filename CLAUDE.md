# CLAUDE.md

Instruções permanentes para trabalho neste repositório. Leia antes de qualquer alteração.

## O que é este projeto

Protótipo de frontend para gestão de Planos Educacionais Individualizados (PEI) na
educação inclusiva brasileira. React 18 + TypeScript + Vite + Tailwind + shadcn/ui.
Sem backend e sem autenticação. Os dados iniciais vêm de `src/data/`; em modo demonstração
(`DEMO_MODE`), o que é cadastrado na interface fica no localStorage via `src/store/`.

O sistema lida com um domínio sensível: crianças e adolescentes com deficiência,
diagnósticos e dados de saúde. Isso governa várias regras abaixo.

## Verificação obrigatória

Nenhuma alteração é considerada pronta antes de as três passarem:

```bash
npm run lint        # 0 erros. 4 warnings react-refresh em src/components/ui/ são aceitos.
npm run typecheck   # silêncio
npm run build       # conclui
```

Rode as três antes de cada commit. Se uma quebrar, conserte antes de seguir — não
acumule.

Toda varredura inclui um controle positivo: uma ocorrência que se sabe existir e que precisa
aparecer na saída. Varredura sem controle positivo não produz evidência — um zero pode ser
defeito da ferramenta. Classes de caractere com acento ([áa]) não casam a letra acentuada
neste ambiente; use script com regex Unicode. grep -i não muda o caso de letra acentuada:
'licença' não casa 'LICENÇA'. Vale para qualquer busca por termo em maiúsculas em código
escrito em português.

## Invariantes — nunca violar

### 1. Nenhum vínculo institucional no código
O repositório foi deliberadamente desvinculado de uma instituição específica. Não
reintroduza nomes, siglas, domínios de e-mail, unidades, códigos de matrícula ou paletas
de marca de nenhuma instituição real.

Tudo que é específico de uma instituição vive em `src/config/institution.ts`. Se você
precisar de um nome de escola, unidade, rótulo de matrícula ou nome de rede, leia de lá.
Se o dado necessário não existe no config, **adicione o campo ao config** — não escreva
literal no componente.

Cores de marca: variáveis `--brand-*` em `src/index.css`. Não crie tokens de cor fora
desse bloco.

### 2. Nenhum número inventado apresentado como real
Todo indicador, projeção, comparativo, ranking ou valor financeiro exibido é fixo no
código. Regras:

- Qualquer tela que mostre métrica, projeção, benchmark ou orçamento **deve** renderizar
  `<DemoDataNotice />`.
- Proibido usar as palavras "Inteligência Artificial", "modelo", "predição", "confiança
  estatística" ou equivalentes para descrever dados estáticos.
- Proibido afirmar garantias de privacidade que o código não implementa (anonimização,
  consentimento, opt-out, criptografia).
- Proibido `Math.random()` em dados exibidos — gera números que mudam a cada render.
- Ao adicionar fixtures, use nomes fictícios, domínio `example.org` e telefones
  `(11) 90000-000X` (não discáveis).

Se implementar uma métrica de verdade, ela deve derivar de um dataset datado via seletor
compartilhado — nunca de um literal duplicado em outro componente.

### 3. Nenhuma afirmação falsa de funcionalidade
O README tem uma tabela "O que está implementado" com ✅/⚠️/❌. Se você implementar ou
remover algo, **atualize a tabela no mesmo commit**. Nunca marque ✅ o que não funciona
ponta a ponta.

Em etapas de vários commits, a tabela do README pode ficar defasada entre commits
intermediários, desde que o commit final da etapa a atualize. Registre a defasagem na
mensagem do commit.

Nunca exiba toast de sucesso ("salvo", "enviado", "gerado") para uma ação que não
produziu resultado persistido ou arquivo. Ou implemente, ou desabilite o controle com
explicação visível, ou remova.

### 4. Acessibilidade é requisito, não melhoria
É um sistema de educação inclusiva. Alvo: WCAG 2.1 AA.

- Todo controle interativo precisa de nome acessível. Botão só-de-ícone exige
  `aria-label` descrevendo a ação e o objeto ("Editar aluno Maria Silva", não "Editar").
- Nada operável só por mouse. Se tem `onClick`, tem que ser `<button>`/`<a>` ou ter
  `role`, `tabIndex` e handler de teclado.
- Significado nunca por cor ou emoji sozinhos — sempre acompanhar de texto (visível ou
  `sr-only`). Emoji decorativo recebe `aria-hidden="true"`.
- Gráfico Recharts precisa de nome acessível e equivalente textual (tabela ou lista).
- Ao mudar qualquer valor HSL em `src/index.css`, recalcule o contraste. Mínimo 4,5:1
  para texto normal. Os valores atuais foram medidos e passam.
- Razão de contraste anotada em comentário não é evidência. Meça da cor computada no
  navegador, no uso real do token, e anote a medição.
- Captura de tela em viewport estreita não é evidência de estouro — o painel de ferramentas
  corta a imagem. Meça `scrollWidth` e procure texto clipado.
- Hierarquia de headings sem pular níveis.
- `lang="pt-BR"` no `index.html` — não alterar.
- A ferramenta de navegador das sessões não ativa `<button>` nativo por Enter/Space, nem
  botões com nome acessível. Ativação por teclado não pode ser verificada por ela — só a
  árvore de acessibilidade (nome, papel, estado). Não registre falha de ativação por
  teclado como defeito do app sem teste manual.

### 5. Nenhum dado real, nunca
Não versione dados reais de estudantes, responsáveis ou profissionais. Não adicione
segredos. Apenas variáveis `VITE_*` chegam ao bundle do navegador; client secrets e
tokens ficam em servidor.

Se implementar armazenamento local (localStorage/IndexedDB), a UI deve avisar
explicitamente que os dados ficam no navegador e que o modo demo não é adequado para
dados reais.

Ao procurar dado sensível, busque por VOCABULÁRIO do domínio (clínico, comportamental, de
saúde mental), nunca pelos termos do defeito já conhecido. Cada busca anterior desta série
usou as palavras do caso anterior, e foi assim que 'Transtorno Global do Desenvolvimento'
sobreviveu a duas varreduras.

O cenário ilustrativo da Gestão não nomeia nenhum estudante nem família, e sua equipe não
repete nome algum dos dados de demonstração. Ao editar qualquer tela de Gestão, verifique as
duas coisas.

## Convenções

- Identificadores novos: inglês, ASCII, camelCase/PascalCase. Português apenas em textos
  de interface. (O modelo atual é misto — não piore, e migre quando a tarefa pedir.)
- Sem acentos em chaves de objeto.
- Valores derivados se calculam, não se armazenam. Idade vem de
  `calculateAge(dataNascimento)` em `src/lib/date.ts` — nunca de um campo salvo.
- Um componente por arquivo.
- Arquivos acima de ~400 linhas devem ser quebrados em commits de refatoração dedicados,
  nunca junto de mudança de comportamento.
- Nada de `any`. Se o tipo não existe, crie em `src/types/`.
- Sem dependência de plataforma de hospedagem específica. `npm run build` gera estático.

## Commits

Prefixos: `Add:`, `Fix:`, `Update:`, `Docs:`, `Style:`, `Refactor:`, `Test:`.
Um commit por etapa concluída e verificada. Não misture refatoração com mudança de
comportamento.

Antes de commitar numa branch que já tem PR aberto, confira o estado do PR. Se já foi mesclado,
saia para uma branch nova a partir do main atualizado.

## O que perguntar antes de fazer

Não decida sozinho, pergunte:

- Escolher entre store local de demonstração e backend real
- Remover uma tela ou funcionalidade inteira
- Adicionar dependência nova
- Trocar a paleta de cores
- Mudar o modelo de dados de `Student` de forma incompatível
