import type {
  FetchProviderModelsPayload,
  ProviderConfig,
  TranslationExecutionMode,
} from '@/types';
import { resolveProviderExecutionMode } from '@/services/executionMode';

function buildProviderHeaders(provider: ProviderConfig) {
  const headers: Record<string, string> = {
    ...provider.connection?.headers,
  };

  if (provider.credentials?.apiKey) {
    headers.Authorization = `Bearer ${provider.credentials.apiKey}`;
  }

  return headers;
}

async function fetchProviderModelsViaBrowser(provider: ProviderConfig) {
  const baseUrl = provider.connection?.baseUrl;
  if (!baseUrl) {
    throw new Error('Base URL is required to fetch provider models.');
  }

  const resolvedBaseUrl = baseUrl.replace(/\/$/, '');
  const response = await fetch(`${resolvedBaseUrl}/models`, {
    method: 'GET',
    headers: buildProviderHeaders(provider),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch models (${response.status})`);
  }

  return (await response.json()) as { data?: Array<{ id: string }> };
}

async function fetchProviderModelsViaProxy(provider: ProviderConfig) {
  const response = await fetch('/api/providers/models', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider,
    } satisfies FetchProviderModelsPayload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || `HTTP ${response.status}`);
  }

  return (await response.json()) as { data?: Array<{ id: string }> };
}

export async function fetchProviderModelsForExecutionMode(
  provider: ProviderConfig,
  globalExecutionMode: TranslationExecutionMode,
) {
  const executionMode = resolveProviderExecutionMode(provider, globalExecutionMode);

  if (executionMode === 'server-proxy') {
    return fetchProviderModelsViaProxy(provider);
  }

  return fetchProviderModelsViaBrowser(provider);
}
