'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSettings } from '@/features/settings/hooks/useAppSettings';
import { useSettingsImportExport } from '@/features/settings/hooks/useSettingsImportExport';
import { SettingsPageHeader } from '@/features/settings/components/SettingsPageHeader';
import { ImportConflictDialog } from '@/features/settings/components/ImportConflictDialog';
import { SettingsToast } from '@/features/settings/components/SettingsToast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

export function ProviderSettingsPageClient() {
  const { t } = useTranslation();
  const { saveSettings, settings } = useAppSettings();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    dismissImportConflict,
    fileInputRef,
    handleExportConfig,
    handleFileSelected,
    handleImportClick,
    handleImportMerge,
    handleImportOverride,
    importConflict,
    toastMessage,
  } = useSettingsImportExport({
    isOpen: true,
    settings,
    onApplySettings: saveSettings,
  });

  const filteredProviders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return settings.providers;
    }

    return settings.providers.filter((provider) => {
      const providerMatches = provider.displayName.toLowerCase().includes(query);
      const modelMatches = provider.models.some(
        (model) =>
          model.name.toLowerCase().includes(query) ||
          model.id.toLowerCase().includes(query),
      );
      return providerMatches || modelMatches;
    });
  }, [searchQuery, settings.providers]);

  const totalEnabledModels = settings.providers.reduce(
    (count, provider) =>
      count + provider.models.filter((model) => model.enabled !== false).length,
    0,
  );

  const handleDeleteProvider = (providerId: string) => {
    if (!confirm(t('settings.confirmDelete'))) {
      return;
    }

    saveSettings({
      ...settings,
      providers: settings.providers.filter((provider) => provider.id !== providerId),
    });
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".prism,.json"
        className="hidden"
        onChange={handleFileSelected}
      />

      <SettingsPageHeader
        title={t('settings.providers.title')}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/settings/providers/models">
                <Icon name="neurology" size={16} />
                {t('settings.manageModels')}
              </Link>
            </Button>
            <Button variant="outline" onClick={handleImportClick}>
              <Icon name="upload" size={16} />
              {t('settings.importConfig')}
            </Button>
            <Button variant="outline" onClick={() => void handleExportConfig()}>
              <Icon name="download" size={16} />
              {t('settings.exportConfig')}
            </Button>
            <Button asChild>
              <Link href="/settings/providers/select">
                <Icon name="add" size={16} />
                {t('settings.connectProvider')}
              </Link>
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden py-0">
        <CardContent className="space-y-6 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">
                {t('settings.providers.listTitle')}
              </h2>
              <div className="text-sm text-muted-foreground">
                {t('settings.providers.summary', {
                  count: settings.providers.length,
                  models: totalEnabledModels,
                })}
              </div>
            </div>

            <div className="relative w-full lg:w-[360px]">
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('settings.searchModels')}
                className="h-11 pl-10"
              />
              <Icon name="search" size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
            </div>
          </div>

          {filteredProviders.length > 0 ? (
            <div className="grid gap-4">
              {filteredProviders.map((provider) => {
                const enabledCount = provider.models.filter((model) => model.enabled !== false).length;

                return (
                  <div
                    key={provider.id}
                    className="rounded-3xl border border-border/70 bg-background/70 p-5 shadow-sm transition-colors hover:border-primary/25 hover:bg-card/85"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {provider.displayName}
                          </h3>
                          <Badge variant="outline">
                            {provider.providerType}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span>
                            {t('settings.providers.modelCount', {
                              count: provider.models.length,
                            })}
                          </span>
                          <span>
                            {t('settings.providers.enabledCount', {
                              count: enabledCount,
                            })}
                          </span>
                          <span>
                            {t(
                              provider.executionMode && provider.executionMode !== 'inherit'
                                ? 'settings.providers.executionModeOverride'
                                : 'settings.providers.executionModeInherited',
                            )}
                          </span>
                        </div>
                        {provider.connection?.baseUrl ? (
                          <p className="break-all rounded-2xl border border-border/70 bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
                            {provider.connection.baseUrl}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                          <Link href={`/settings/providers/${encodeURIComponent(provider.id)}`}>
                            <Icon name="edit" size={16} />
                            {t('settings.editProvider')}
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="border-destructive/25 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteProvider(provider.id)}
                        >
                          <Icon name="delete" size={16} />
                          {t('settings.deleteProvider')}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-muted/50 px-6 py-14 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-3xl border border-border/70 bg-background/70 text-muted-foreground shadow-sm">
                <Icon name="hub" size={24} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {searchQuery ? t('settings.providers.emptySearchTitle') : t('settings.providers.emptyTitle')}
              </h3>
              {!searchQuery ? (
                <Button className="mt-5" asChild>
                  <Link href="/settings/providers/select">
                    <Icon name="add" size={16} />
                    {t('settings.connectProvider')}
                  </Link>
                </Button>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {importConflict ? (
        <ImportConflictDialog
          open
          conflictNames={importConflict.conflictNames}
          newCount={importConflict.newCount}
          onCancel={dismissImportConflict}
          onMerge={handleImportMerge}
          onOverride={handleImportOverride}
        />
      ) : null}

      {toastMessage ? <SettingsToast message={toastMessage} /> : null}
    </div>
  );
}
