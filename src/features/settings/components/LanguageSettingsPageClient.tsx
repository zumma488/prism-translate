'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSettings } from '@/features/settings/hooks/useAppSettings';
import { SettingsPageHeader } from '@/features/settings/components/SettingsPageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { LANGUAGE_CONFIGS } from '@/constants';
import { cn } from '@/lib/utils';
import { getEnabledModels } from '@/features/translation/services/translationOrchestrator';

type LanguageRow = {
  language: string;
  nativeName: string;
  modelKeys: string[];
};

export function LanguageSettingsPageClient() {
  const { t } = useTranslation();
  const { settings, updateLanguageModels } = useAppSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingLanguage, setEditingLanguage] = useState<string | null>(null);

  const enabledModels = useMemo(() => getEnabledModels(settings.providers), [settings.providers]);
  const languageOptions = useMemo(() => Object.keys(LANGUAGE_CONFIGS), []);

  const languageRows = useMemo<LanguageRow[]>(
    () =>
      languageOptions.map((language) => ({
        language,
        nativeName: LANGUAGE_CONFIGS[language]?.nativeName || language,
        modelKeys: settings.languageModels?.[language] || [],
      })),
    [languageOptions, settings.languageModels],
  );

  const filteredLanguages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return languageRows;
    }

    return languageRows.filter((row) => {
      const modelMatches = row.modelKeys.some((key) =>
        enabledModels.some(
          (model) =>
            model.uniqueId === key &&
            (model.modelName.toLowerCase().includes(query) ||
              model.providerName.toLowerCase().includes(query)),
        ),
      );

      return (
        row.language.toLowerCase().includes(query) ||
        row.nativeName.toLowerCase().includes(query) ||
        modelMatches
      );
    });
  }, [enabledModels, languageRows, searchQuery]);

  const editingLanguageName = editingLanguage || languageOptions[0] || '';
  const editingLanguageConfig = editingLanguage
    ? LANGUAGE_CONFIGS[editingLanguage]
    : undefined;
  const editingModelKeys = editingLanguage
    ? settings.languageModels?.[editingLanguage] || []
    : [];

  const toggleLanguageBinding = (language: string, modelKey: string) => {
    const currentBindings = settings.languageModels?.[language] || [];
    const nextBindings = currentBindings.includes(modelKey)
      ? currentBindings.filter((id) => id !== modelKey)
      : [...currentBindings, modelKey];

    updateLanguageModels(language, nextBindings);
  };

  const clearLanguageBinding = (language: string) => {
    updateLanguageModels(language, []);
  };

  return (
    <div className="space-y-6">
      <SettingsPageHeader title={t('settings.languages.title')} />

      <Card className="overflow-hidden py-0">
        <CardContent className="space-y-6 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {t('settings.languages.bindingTitle')}
            </h2>
            <div className="relative w-full lg:w-[340px]">
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('settings.languages.searchPlaceholder')}
                className="h-11 pl-10"
              />
              <Icon name="search" size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
            </div>
          </div>

          <div className="divide-y divide-border/70 rounded-3xl border border-border/70 bg-background/70">
            {filteredLanguages.map((row) => {
              const boundModelNames = row.modelKeys
                .map((key) => enabledModels.find((model) => model.uniqueId === key)?.modelName)
                .filter(Boolean);

              return (
                <div
                  key={row.language}
                  className="grid gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(180px,260px)_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-foreground">
                      {row.nativeName}
                    </div>
                    <div className="text-xs text-muted-foreground">{row.language}</div>
                  </div>

                  <div className="min-w-0 text-sm text-muted-foreground">
                    {boundModelNames.length > 0 ? (
                      <span className="line-clamp-2">{boundModelNames.join(', ')}</span>
                    ) : (
                      <span className="text-muted-foreground/70">
                        {t('settings.languages.useGlobalDefault')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:justify-end">
                    {row.modelKeys.length > 0 ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t('settings.languages.clearBinding')}
                        onClick={() => clearLanguageBinding(row.language)}
                      >
                        <Icon name="restart_alt" size={16} />
                      </Button>
                    ) : null}
                    <Button variant="outline" onClick={() => setEditingLanguage(row.language)}>
                      <Icon name="rule" size={16} />
                      {t('settings.languages.bindModels')}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLanguages.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-muted/50 px-6 py-12 text-center">
              <Icon name="search_off" size={28} className="mx-auto text-muted-foreground" />
              <div className="mt-4 text-lg font-semibold text-foreground">
                {t('settings.languages.emptySearchTitle')}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={Boolean(editingLanguage)} onOpenChange={(open) => !open && setEditingLanguage(null)}>
        <DialogContent className="max-h-[86dvh] max-w-2xl overflow-hidden p-0">
          <div className="border-b border-border/70 px-6 py-5">
            <DialogTitle className="text-xl text-foreground">
              {t('settings.languages.bindModelsFor', {
                language: editingLanguageConfig?.nativeName || editingLanguageName,
              })}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              {t('settings.languages.bindModelsDescription')}
            </DialogDescription>
          </div>

          <div className="max-h-[56dvh] space-y-2 overflow-y-auto px-6 py-5">
            {enabledModels.length > 0 ? (
              enabledModels.map((model) => {
                const selected = editingModelKeys.includes(model.uniqueId);

                return (
                  <button
                    key={model.uniqueId}
                    type="button"
                    onClick={() => editingLanguage && toggleLanguageBinding(editingLanguage, model.uniqueId)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors',
                      selected
                        ? 'border-primary/30 bg-primary/10'
                        : 'border-border/70 bg-background/70 hover:bg-muted/60',
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {model.modelName}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {model.providerName}
                      </span>
                    </span>
                    <Icon
                      name={selected ? 'check_circle' : 'add_circle'}
                      size={18}
                      className={selected ? 'text-primary' : 'text-muted-foreground'}
                    />
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-muted/50 px-4 py-10 text-center text-sm text-muted-foreground">
                {t('settings.languages.noModelsAvailable')}
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-border/70 px-6 py-4">
            {editingLanguage ? (
              <Button variant="outline" onClick={() => clearLanguageBinding(editingLanguage)}>
                <Icon name="restart_alt" size={16} />
                {t('settings.languages.clearBinding')}
              </Button>
            ) : null}
            <Button onClick={() => setEditingLanguage(null)}>
              {t('settings.languages.done')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
