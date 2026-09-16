/**
 * Alertas do cenário ilustrativo da Gestão, mostrados na aba Análise.
 *
 * O painel de alertas lista estes, e o Resumo Executivo conta a partir deles. Antes cada um
 * tinha o seu número: o resumo dizia "17 alertas ativos, 5 críticos", e a lista logo abaixo,
 * na mesma aba, tinha 5 alertas e 2 críticos.
 *
 * Sem nome de aluno: o cenário ilustrativo não nomeia estudante nem família. "Pedro Costa"
 * lembrava o aluno Pedro Oliveira Costa da demonstração.
 */
export interface ScenarioAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  details: string[];
}

export const scenarioAlerts: ScenarioAlert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'PEI não atualizado há 120 dias',
    description: 'Ação Imediata Necessária',
    details: [
      '⏱️ Vencido há: 30 dias',
      '📅 Última revisão: 15/07/2024',
      '👤 Responsável: Profª. Helena Duarte'
    ],
  },
  {
    id: '2',
    type: 'critical',
    title: 'Um aluno com frequência abaixo de 60%',
    description: 'Intervenção Necessária',
    details: [
      '📊 Presença: 58% (12 faltas no mês)',
      '📅 Última presença: 18/11/2024',
      '⚠️ Risco de retenção por falta'
    ],
  },
  {
    id: '3',
    type: 'warning',
    title: 'Um aluno sem progresso há 8 semanas',
    description: 'Monitoramento Necessário',
    details: [
      '📊 Objetivos estagnados: 4 de 7',
      '📈 Última evolução: Set/2024',
      '💡 Sugestão: Revisão de estratégias'
    ],
  },
  {
    id: '4',
    type: 'warning',
    title: 'Turma 3º B: Necessita profissional de apoio',
    description: 'Recurso Insuficiente',
    details: [
      '👥 Alunos com PEI: 6',
      '🔴 Apoio disponível: 1 (insuficiente)',
      '📊 Recomendado: 2 profissionais'
    ],
  },
  {
    id: '5',
    type: 'info',
    title: 'Nova formação sobre TEA disponível',
    description: 'Para Conhecimento',
    details: [
      '📅 Data: 05/12/2024 às 14h',
      '👥 Vagas: 30 (18 disponíveis)',
      '🎓 Certificação: 8 horas'
    ],
  }
];
