'use client';

import { useTranslation } from 'react-i18next';
import { SettingsPageHeader } from '@/features/settings/components/SettingsPageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

const SECTIONS = [
  {
    icon: 'lock',
    titleKey: 'settings.about.localStorageTitle',
    descriptionKey: 'settings.about.localStorageDescription',
  },
  {
    icon: 'description',
    titleKey: 'settings.about.exportTitle',
    descriptionKey: 'settings.about.exportDescription',
  },
  {
    icon: 'lan',
    titleKey: 'settings.about.browserDirectTitle',
    descriptionKey: 'settings.about.browserDirectDescription',
  },
  {
    icon: 'cloud_sync',
    titleKey: 'settings.about.serverProxyTitle',
    descriptionKey: 'settings.about.serverProxyDescription',
  },
];

export function AboutSettingsPageClient() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <SettingsPageHeader title={t('settings.about.title')} />

      <div className="grid gap-4 lg:grid-cols-2">
        {SECTIONS.map((section) => (
          <Card key={section.titleKey} className="overflow-hidden py-0">
            <CardContent className="space-y-4 px-6 py-6 sm:px-8">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary">
                <Icon name={section.icon} size={20} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  {t(section.titleKey)}
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  {t(section.descriptionKey)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
