'use client';

import Link from 'next/link';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import EditProviderView from '@/components/settings/EditProviderView';
import { getAllProviders } from '@/config/models';
import { useAppSettings } from '@/features/settings/hooks/useAppSettings';
import { Icon } from '@/components/ui/icon';
import type { ProviderConfig, ProviderType } from '@/types';

interface ProviderEditorPageClientProps {
  mode: 'create' | 'edit';
  providerId?: string;
}

type ProviderInitialConfig = Partial<ProviderConfig> & { providerType: ProviderType };

function decodeProviderSeed(searchParams: Pick<URLSearchParams, 'get'>) {
  const type = searchParams.get('type') as ProviderType | null;
  const name = searchParams.get('name');
  const baseUrl = searchParams.get('baseUrl');

  if (!type) {
    return null;
  }

  const providerDef = getAllProviders().find(
    (provider) =>
      provider.id === type &&
      (name ? provider.name === name : true) &&
      (baseUrl ? provider.baseUrl === baseUrl : true),
  );

  return {
    providerType: type,
    displayName: providerDef?.name ?? name ?? '',
    connection: baseUrl ? { baseUrl } : providerDef?.baseUrl ? { baseUrl: providerDef.baseUrl } : undefined,
    models: providerDef?.defaultModels ? [...providerDef.defaultModels] : [],
  } satisfies ProviderInitialConfig;
}

export function ProviderEditorPageClient({
  mode,
  providerId,
}: ProviderEditorPageClientProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveSettings, settings, settingsLoaded } = useAppSettings();

  const initialConfig = useMemo<ProviderInitialConfig | null>(() => {
    if (mode === 'edit') {
      const provider = settings.providers.find((item) => item.id === providerId);
      if (!provider) {
        return null;
      }

      return provider;
    }

    return decodeProviderSeed(searchParams) ?? { providerType: 'custom' as ProviderType, models: [] };
  }, [mode, providerId, searchParams, settings.providers]);

  if (mode === 'edit' && !settingsLoaded) {
    return (
      <div className="flex min-h-[50dvh] items-center justify-center text-sm text-muted-foreground">
        <Icon name="progress_activity" size={18} className="mr-2 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!initialConfig) {
    notFound();
  }

  const handleSave = (providerConfig: ProviderConfig) => {
    const providers = [...settings.providers];
    const existingIndex = providers.findIndex((provider) => provider.id === providerConfig.id);

    if (existingIndex >= 0) {
      providers[existingIndex] = providerConfig;
    } else {
      providers.push(providerConfig);
    }

    saveSettings({ ...settings, providers });
    router.push('/settings/providers');
  };

  const handleDelete = (id: string) => {
    if (!confirm(t('settings.confirmDelete'))) {
      return;
    }

    saveSettings({
      ...settings,
      providers: settings.providers.filter((provider) => provider.id !== id),
    });
    router.push('/settings/providers');
  };

  const pageTitle = mode === 'create' ? t('settings.connectProvider') : t('settings.editProvider');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/settings/providers" className="transition-colors hover:text-foreground">
          {t('settings.nav.providers')}
        </Link>
        <span>/</span>
        <span className="text-foreground">{pageTitle}</span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/85 shadow-[var(--shadow-soft)] backdrop-blur">
        <div className="h-[min(78dvh,980px)]">
          <EditProviderView
            initialConfig={initialConfig}
            globalExecutionMode={settings.executionMode}
            existingIds={settings.providers.map((provider) => provider.id)}
            onSave={handleSave}
            onDelete={handleDelete}
            onBack={() => router.back()}
          />
        </div>
      </div>
    </div>
  );
}
