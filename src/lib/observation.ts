import type { QuickObservationContext, QuickObservationTone, QuickObservationTopic } from '@/types';

interface Option<T extends string> {
  value: T;
  label: string;
}

export const quickObservationContextOptions: Option<QuickObservationContext>[] = [
  { value: 'classroom', label: 'Sala de Aula' },
  { value: 'recess', label: 'Recreio' },
  { value: 'aee', label: 'AEE' },
  { value: 'physicalEducation', label: 'Educação Física' },
  { value: 'other', label: 'Outro' },
];

export const quickObservationTopicOptions: Option<QuickObservationTopic>[] = [
  { value: 'peiGoal', label: 'Objetivo do PEI' },
  { value: 'behavior', label: 'Comportamento' },
  { value: 'learning', label: 'Aprendizagem' },
  { value: 'socialization', label: 'Socialização' },
  { value: 'communication', label: 'Comunicação' },
];

export const quickObservationToneOptions: Array<Option<QuickObservationTone> & { emoji: string }> = [
  { value: 'positive', label: 'Positiva', emoji: '😊' },
  { value: 'neutral', label: 'Neutra/Informativa', emoji: 'ℹ️' },
  { value: 'attention', label: 'Atenção necessária', emoji: '⚠️' },
];

export const labelFor = <T extends string>(options: Option<T>[], value: T): string =>
  options.find((option) => option.value === value)?.label ?? value;
