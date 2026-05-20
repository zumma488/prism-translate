import { generateId } from '@/lib/utils';
import type { AppSettings, ModelDefinition, ProviderConfig } from '@/types';
import { DEFAULT_PROVIDER_EXECUTION_MODE } from '@/services/executionMode';

function hasStableUid(model: ModelDefinition) {
  return typeof model.uid === 'string' && model.uid.length > 0;
}

function buildLegacyModelUid(modelId: string, duplicateIndex: number) {
  return duplicateIndex === 0 ? modelId : `${modelId}__${duplicateIndex + 1}`;
}

export function createModelUid() {
  return generateId();
}

export function getModelSelectionKey(providerId: string, model: Pick<ModelDefinition, 'id' | 'uid'>) {
  return `${providerId}:${model.uid || model.id}`;
}

export function normalizeModelDefinitions(models: ModelDefinition[]) {
  const duplicateCounts = new Map<string, number>();
  let changed = false;

  const normalizedModels = models.map((model) => {
    const duplicateIndex = duplicateCounts.get(model.id) ?? 0;
    duplicateCounts.set(model.id, duplicateIndex + 1);

    if (hasStableUid(model)) {
      return model;
    }

    changed = true;
    return {
      ...model,
      uid: buildLegacyModelUid(model.id, duplicateIndex),
    };
  });

  return changed ? normalizedModels : models;
}

export function normalizeProviderModels(provider: ProviderConfig): ProviderConfig {
  const models = normalizeModelDefinitions(provider.models);
  const executionMode = provider.executionMode ?? DEFAULT_PROVIDER_EXECUTION_MODE;

  if (models === provider.models && executionMode === provider.executionMode) {
    return provider;
  }

  return {
    ...provider,
    models,
    executionMode,
  };
}

export function normalizeProviders(providers: ProviderConfig[]) {
  let changed = false;

  const normalizedProviders = providers.map((provider) => {
    const normalizedProvider = normalizeProviderModels(provider);
    if (normalizedProvider !== provider) {
      changed = true;
    }
    return normalizedProvider;
  });

  return changed ? normalizedProviders : providers;
}

export function normalizeSettingsProviders(settings: AppSettings): AppSettings {
  const providers = normalizeProviders(settings.providers);
  return providers === settings.providers ? settings : { ...settings, providers };
}
