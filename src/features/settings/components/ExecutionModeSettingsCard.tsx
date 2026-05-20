'use client';

import { useTranslation } from 'react-i18next';
import type { AppSettings, TranslationExecutionMode } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface ExecutionModeSettingsCardProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const EXECUTION_MODES: TranslationExecutionMode[] = [
  'browser-direct',
  'server-proxy',
];

export function ExecutionModeSettingsCard({
  settings,
  onUpdateSettings,
}: ExecutionModeSettingsCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="space-y-5 px-6 py-6 sm:px-8">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-foreground">
            {t('settings.executionMode.title')}
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {t('settings.executionMode.description')}
          </p>
          <p className="text-sm leading-6 text-muted-foreground/80">
            {t('settings.executionMode.scopeHint')}
          </p>
        </div>

        <RadioGroup
          value={settings.executionMode}
          onValueChange={(mode) =>
            onUpdateSettings({
              ...settings,
              executionMode: mode as TranslationExecutionMode,
            })
          }
          className="grid gap-3 lg:grid-cols-2"
        >
          {EXECUTION_MODES.map((mode) => {
            const selected = settings.executionMode === mode;
            const isBrowserDirect = mode === 'browser-direct';

            return (
              <label
                key={mode}
                className={cn(
                  'group flex min-h-[188px] cursor-pointer flex-col gap-2 rounded-3xl border px-5 py-5 text-left transition-all',
                  selected
                    ? 'border-primary/35 bg-primary/10 shadow-[var(--shadow-soft)]'
                    : 'border-border/70 bg-background/70 hover:border-primary/25 hover:bg-muted/60',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold text-foreground">
                      {isBrowserDirect
                        ? t('settings.executionMode.browserDirect')
                        : t('settings.executionMode.serverProxy')}
                    </div>
                    <p className="mt-2 text-sm leading-5 text-muted-foreground">
                      {isBrowserDirect
                        ? t('settings.executionMode.browserDirectHint')
                        : t('settings.executionMode.serverProxyHint')}
                    </p>
                  </div>
                  <RadioGroupItem value={mode} className="mt-1" />
                </div>
                {isBrowserDirect ? (
                  <p className="text-sm leading-5 text-muted-foreground">
                    {t('settings.executionMode.browserDirectRisk')}
                  </p>
                ) : null}
              </label>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
