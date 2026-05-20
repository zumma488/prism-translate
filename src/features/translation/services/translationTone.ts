import type { TFunction } from 'i18next';

function normalizeToneValue(tone: string) {
  return tone.trim().toLowerCase();
}

export function getLocalizedToneLabel(t: TFunction, tone: string) {
  const normalizedTone = normalizeToneValue(tone);

  if (normalizedTone === 'neutral') {
    return t('translation.output.tone.values.neutral');
  }

  if (normalizedTone === 'formal') {
    return t('translation.output.tone.values.formal');
  }

  if (normalizedTone === 'casual') {
    return t('translation.output.tone.values.casual');
  }

  return tone;
}
