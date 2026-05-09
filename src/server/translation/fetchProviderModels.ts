import type { ProviderConfig } from '@/types';
import { safeFetch } from '@/server/translation/safeFetch';

export async function fetchProviderModels(provider: ProviderConfig) {
  const baseUrl = provider.connection?.baseUrl;
  if (!baseUrl) {
    throw new Error('Base URL is required to fetch provider models.');
  }

  const resolvedBaseUrl = baseUrl.replace(/\/$/, '');
  const headers: Record<string, string> = {
    ...provider.connection?.headers,
  };

  if (provider.credentials?.apiKey) {
    headers.Authorization = `Bearer ${provider.credentials.apiKey}`;
  }

  const response = await safeFetch(`${resolvedBaseUrl}/models`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch models (${response.status})`);
  }

  return response.json();
}
