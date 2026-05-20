'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSettings } from '@/features/settings/hooks/useAppSettings';
import { SettingsPageHeader } from '@/features/settings/components/SettingsPageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { getModelSelectionKey } from '@/services/modelIdentity';
import {
  getActiveModelMeta,
  getEnabledModels,
} from '@/features/translation/services/translationOrchestrator';

interface ModelRow {
  providerId: string;
  providerName: string;
  providerType: string;
  modelId: string;
  modelName: string;
  uniqueId: string;
  enabled: boolean;
}

export function ProviderModelsPageClient() {
  const { t } = useTranslation();
  const { saveSettings, settings } = useAppSettings();
  const [searchQuery, setSearchQuery] = useState('');

  const modelRows = useMemo<ModelRow[]>(
    () =>
      settings.providers.flatMap((provider) =>
        provider.models.map((model) => ({
          providerId: provider.id,
          providerName: provider.displayName,
          providerType: provider.providerType,
          modelId: model.id,
          modelName: model.name,
          uniqueId: getModelSelectionKey(provider.id, model),
          enabled: model.enabled !== false,
        })),
      ),
    [settings.providers],
  );

  const filteredModels = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return modelRows;
    }

    return modelRows.filter((model) =>
      [model.modelName, model.modelId, model.providerName]
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [modelRows, searchQuery]);

  const enabledModels = useMemo(() => getEnabledModels(settings.providers), [settings.providers]);
  const currentModel = getActiveModelMeta(enabledModels, settings.activeModelKey);

  const toggleModel = (providerId: string, modelUniqueId: string, enabled: boolean) => {
    const nextProviders = settings.providers.map((provider) => {
      if (provider.id !== providerId) {
        return provider;
      }

      return {
        ...provider,
        models: provider.models.map((model) =>
          getModelSelectionKey(provider.id, model) === modelUniqueId
            ? { ...model, enabled }
            : model,
        ),
      };
    });

    saveSettings({
      ...settings,
      providers: nextProviders,
    });
  };

  const setDefaultModel = (modelKey: string) => {
    saveSettings({
      ...settings,
      activeModelKey: modelKey,
    });
  };

  if (settings.providers.length === 0) {
    return (
      <div className="space-y-6">
        <SettingsPageHeader
          eyebrow={t('settings.providers.models.eyebrow')}
          title={t('settings.providers.models.title')}
          description={t('settings.providers.models.description')}
        />

        <Card className="overflow-hidden py-0">
          <CardContent className="px-6 py-14 text-center sm:px-8">
            <div className="mx-auto flex size-14 items-center justify-center rounded-3xl border border-primary/10 bg-primary/10 text-primary">
              <Icon name="neurology" size={24} />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-foreground">
              {t('settings.providers.models.emptyTitle')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              {t('settings.providers.models.emptyDescription')}
            </p>
            <Button className="mt-6" asChild>
              <Link href="/settings/providers/select">
                <Icon name="add" size={16} />
                {t('settings.providers.models.emptyAction')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/settings/providers" className="transition-colors hover:text-foreground">
          {t('settings.nav.providers')}
        </Link>
        <Icon name="chevron_right" size={16} />
        <span className="text-foreground">{t('settings.providers.models.breadcrumb')}</span>
      </div>

      <SettingsPageHeader
        title={t('settings.providers.models.title')}
        actions={
          <Button variant="outline" asChild>
            <Link href="/settings/providers">
              <Icon name="arrow_back" size={16} />
              {t('settings.providers.models.backToProviders')}
            </Link>
          </Button>
        }
      />

      <Card className="overflow-hidden py-0">
        <CardContent className="space-y-6 px-6 py-6 sm:px-8">
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {t('settings.providers.models.listTitle')}
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {currentModel
                      ? t('settings.providers.models.defaultBadge', {
                          name: currentModel.modelName,
                        })
                      : t('settings.providers.models.noDefaultBadge')}
                  </div>
                </div>
                <div className="relative w-full lg:w-[340px]">
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t('settings.searchModels')}
                    className="h-11 pl-10"
                  />
                  <Icon name="search" size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-3">
                {filteredModels.map((model) => {
                  const isDefault = settings.activeModelKey === model.uniqueId;

                  return (
                    <div
                      key={model.uniqueId}
                      className="rounded-3xl border border-border/70 bg-background/70 p-4 shadow-sm transition-colors hover:border-primary/25 hover:bg-card/85"
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {model.modelName}
                            </h3>
                            {isDefault ? (
                              <Badge variant="default">
                                {t('settings.providers.models.defaultLabel')}
                              </Badge>
                            ) : null}
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span>{model.providerName}</span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {model.modelId}
                            </span>
                            <span className="capitalize">{model.providerType}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            variant={isDefault ? 'default' : 'outline'}
                            onClick={() => setDefaultModel(model.uniqueId)}
                            disabled={!model.enabled}
                          >
                            <Icon name={isDefault ? 'check_circle' : 'radio_button_checked'} size={16} />
                            {t('settings.providers.models.setDefault')}
                          </Button>
                          <Button variant="outline" asChild>
                            <Link href={`/settings/providers/${encodeURIComponent(model.providerId)}`}>
                              <Icon name="edit" size={16} />
                              {t('settings.providers.models.editProvider')}
                            </Link>
                          </Button>
                          <div className="ml-1 flex items-center gap-3 rounded-full border border-border/70 bg-background/70 px-3 py-2">
                            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                              {t('settings.providers.models.enabled')}
                            </span>
                            <Switch
                              checked={model.enabled}
                              onCheckedChange={(checked) =>
                                toggleModel(model.providerId, model.uniqueId, checked)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredModels.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border bg-muted/50 px-6 py-12 text-center">
                  <Icon name="search_off" size={28} className="mx-auto text-muted-foreground" />
                  <div className="mt-4 text-lg font-semibold text-foreground">
                    {t('settings.providers.models.emptySearchTitle')}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t('settings.providers.models.emptySearchDescription')}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
