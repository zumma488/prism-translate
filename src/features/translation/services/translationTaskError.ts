import type { TFunction } from 'i18next';
import type { TranslationTaskView } from '@/types';

export function getTranslationTaskErrorMessage(
  taskView: TranslationTaskView,
  t: TFunction,
): string {
  if (taskView.errorCode === 'missing_model') {
    return t('translation.output.missingModel');
  }

  if (taskView.errorCode === 'browser_direct_not_supported') {
    return t('translation.output.browserDirectNotSupported');
  }

  return taskView.error || t('errors.unknown');
}
