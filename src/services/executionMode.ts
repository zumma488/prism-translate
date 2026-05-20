import type {
  ProviderConfig,
  ProviderExecutionMode,
  TranslationExecutionMode,
} from '@/types';

export const DEFAULT_PROVIDER_EXECUTION_MODE: ProviderExecutionMode = 'inherit';

export function normalizeProviderExecutionMode(
  value: ProviderExecutionMode | undefined,
): ProviderExecutionMode {
  return value ?? DEFAULT_PROVIDER_EXECUTION_MODE;
}

export function resolveProviderExecutionMode(
  provider: Pick<ProviderConfig, 'executionMode'>,
  globalExecutionMode: TranslationExecutionMode,
): TranslationExecutionMode {
  const providerExecutionMode = normalizeProviderExecutionMode(provider.executionMode);
  return providerExecutionMode === 'inherit' ? globalExecutionMode : providerExecutionMode;
}
