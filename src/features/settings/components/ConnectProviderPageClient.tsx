'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ConnectProviderView from '@/components/settings/ConnectProviderView';
import type { ProviderType } from '@/types';
import type { ProviderDefinition } from '@/config/models';

function buildConnectProviderQuery(type: ProviderType, providerDef?: ProviderDefinition) {
  const params = new URLSearchParams();
  params.set('type', type);

  if (providerDef) {
    params.set('name', providerDef.name);

    if (providerDef.baseUrl) {
      params.set('baseUrl', providerDef.baseUrl);
    }
  }

  return params.toString();
}

export function ConnectProviderPageClient() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleSelectType = (type: ProviderType, providerDef?: ProviderDefinition) => {
    const query = buildConnectProviderQuery(type, providerDef);
    router.push(`/settings/providers/new${query ? `?${query}` : ''}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button type="button" onClick={() => router.push('/settings/providers')} className="transition-colors hover:text-foreground">
          {t('settings.nav.providers')}
        </button>
        <span>/</span>
        <span className="text-foreground">{t('settings.selectProvider')}</span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/85 shadow-[var(--shadow-soft)] backdrop-blur">
        <div className="h-[min(72dvh,820px)]">
          <ConnectProviderView
            onSelectType={handleSelectType}
            onCancel={() => router.push('/settings/providers')}
          />
        </div>
      </div>
    </div>
  );
}
