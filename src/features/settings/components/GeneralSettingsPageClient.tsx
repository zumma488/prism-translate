'use client';

import { useTranslation } from 'react-i18next';
import { useAppSettings } from '@/features/settings/hooks/useAppSettings';
import { SettingsPageHeader } from '@/features/settings/components/SettingsPageHeader';
import { ExecutionModeSettingsCard } from '@/features/settings/components/ExecutionModeSettingsCard';

export function GeneralSettingsPageClient() {
  const { t } = useTranslation();
  const { saveSettings, settings } = useAppSettings();

  return (
    <div className="space-y-6">
      <SettingsPageHeader title={t('settings.general.title')} />

      <ExecutionModeSettingsCard
        settings={settings}
        onUpdateSettings={saveSettings}
      />
    </div>
  );
}
