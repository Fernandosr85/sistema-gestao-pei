# Guia de Componentes

## Visão Geral

O sistema utiliza **Shadcn/ui** como base e possui **40+ componentes customizados** para atender aos módulos funcionais da aplicação.

## Organização dos Componentes

```text
src/components/
├─ ui/                  # Componentes base do Shadcn/ui
├─ gestao/              # Componentes do painel de gestão
├─ reports/             # Componentes de relatórios e gráficos
```

## Componentes Principais

### Header

**Tipo:** Layout  
**Descrição:** Navegação principal com notificações e perfil do usuário.

#### Responsabilidades
- Exibir identidade visual do sistema
- Mostrar notificações
- Acesso rápido ao perfil

---

### StatCard

**Tipo:** Dashboard  
**Descrição:** Card estatístico com ícone e indicador de tendência.

#### Casos de uso
- Total de alunos ativos
- Quantidade de observações
- Reuniões agendadas
- Indicadores rápidos no dashboard

#### Props sugeridas
```ts
type StatCardProps = {
  title: string;
  value: string | number;
  trend?: string;
  icon?: React.ReactNode;
};
```

---

### StudentCard

**Tipo:** Alunos  
**Descrição:** Card resumido de aluno com progresso.

#### Informações exibidas
- Nome
- Diagnóstico
- Nível de suporte
- Indicador de progresso
- Responsável ou resumo visual

---

### ResourceCard

**Tipo:** Biblioteca  
**Descrição:** Card de recurso pedagógico adaptado.

#### Informações exibidas
- Título
- Tipo do recurso
- Diagnósticos relacionados
- Avaliação
- Autor

---

### BenchmarkingPanel

**Tipo:** Análise  
**Descrição:** Painel de comparativo ilustrativo com a rede. Os números são fixos no código e não representam uma coorte real.

#### Finalidade
- Comparação anonimizada
- Apoio à tomada de decisão
- Indicadores de referência

---

### ExecutiveSummary

**Tipo:** Gestão  
**Descrição:** Resumo executivo com KPIs institucionais.

#### Uso
- Visão consolidada para coordenação
- Apoio ao acompanhamento de indicadores
- Destaque de alertas e prioridades

---

### CalendarIntegrations

**Tipo:** Agenda  
**Descrição:** Painel de integrações de calendário.

#### Integrações previstas
- Google Calendar
- Microsoft Outlook

#### Observação
A interface está pronta, mas o fluxo real ainda depende de implementação backend/OAuth.

---

### MeuPerfilDialog

**Tipo:** Perfil  
**Descrição:** Janela modal de perfil com elementos de gamificação.

#### Possíveis conteúdos
- Dados do usuário
- Badges e conquistas
- Preferências pessoais

---

### ConfiguracoesDialog

**Tipo:** Configuração  
**Descrição:** Modal de configurações com 6 abas.

#### Finalidade
- Centralizar ajustes do sistema
- Organizar preferências por categorias
- Melhorar a administração da interface

---

### PresentationModeDialog

**Tipo:** Alunos  
**Descrição:** Modo apresentação otimizado para reuniões com famílias.

#### Benefícios
- Visual mais limpo
- Foco em informações essenciais
- Melhor experiência em reuniões pedagógicas

---

### GenerateReportDialog

**Tipo:** Relatórios  
**Descrição:** Modal de geração de relatórios.

#### Objetivos
- Selecionar formato de exportação
- Filtrar escopo dos dados
- Preparar saída para PDF, Excel e Word

---

## Componentes de Relatórios Inteligentes

### ProgressChart
Gráfico de evolução do aluno ao longo do tempo.

### ObservationHeatmap
Mapa de calor da frequência de observações.

### MilestonesCard
Exibição de marcos e conquistas do aluno.

### AlertsCard
Exibição de alertas e pontos de atenção.

### PredictiveAnalysis
Análise preditiva com IA.

### PEIRadarChart
Gráfico radar das áreas do PEI.

### InterventionDonut
Distribuição dos tipos de intervenção.

## Boas Práticas para Componentes

- Manter componentes pequenos e reutilizáveis
- Separar lógica de apresentação quando possível
- Usar TypeScript para tipagem explícita
- Padronizar estilos com Tailwind CSS
- Reaproveitar base do Shadcn/ui
- Validar dados com Zod em formulários
- Preferir composição em vez de componentes monolíticos

## Observações

`NavigationBar`, `ComplexityCard` e `ActionPanel` foram descritos aqui até a Etapa 5, quando
saíram do repositório por não serem alcançáveis a partir de `main.tsx`. As descrições foram
removidas junto: guia que descreve componente inexistente é afirmação falsa de funcionalidade.

Este guia foi montado com base na documentação disponível.  
Para documentação mais detalhada por componente, o ideal é complementar com exemplos reais de uso, props completas e capturas de tela.
