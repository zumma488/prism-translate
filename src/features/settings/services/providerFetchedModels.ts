import type { ModelDefinition } from '@/types';
import { createModelUid } from '@/services/modelIdentity';

export interface FetchedProviderModel {
  id: string;
  name?: string;
}

export interface SelectableFetchedProviderModel extends FetchedProviderModel {
  isExisting: boolean;
  selected: boolean;
}

function normalizeFetchedModelId(model: FetchedProviderModel) {
  return model.id.trim();
}

function normalizeFetchedModelName(model: FetchedProviderModel) {
  return model.name?.trim() || normalizeFetchedModelId(model);
}

export function buildSelectableFetchedModels(
  fetchedModels: FetchedProviderModel[],
  existingModels: Pick<ModelDefinition, 'id'>[],
): SelectableFetchedProviderModel[] {
  const existingIds = new Set(existingModels.map((model) => model.id.trim()));
  const seenFetchedIds = new Set<string>();

  return fetchedModels.reduce<SelectableFetchedProviderModel[]>((items, model) => {
    const id = normalizeFetchedModelId(model);
    if (!id || seenFetchedIds.has(id)) {
      return items;
    }

    seenFetchedIds.add(id);
    const isExisting = existingIds.has(id);
    items.push({
      id,
      name: normalizeFetchedModelName(model),
      isExisting,
      selected: false,
    });
    return items;
  }, []);
}

export function toggleSelectableFetchedModel(
  models: SelectableFetchedProviderModel[],
  targetId: string,
) {
  return models.map((model) =>
    model.id === targetId ? { ...model, selected: !model.selected } : model,
  );
}

export function selectAllNewFetchedModels(models: SelectableFetchedProviderModel[]) {
  return models.map((model) => (model.isExisting ? model : { ...model, selected: true }));
}

export function mergeSelectedFetchedModels<T extends ModelDefinition>(
  existingModels: T[],
  selectedModels: SelectableFetchedProviderModel[],
) {
  const existingIds = new Set(existingModels.map((model) => model.id.trim()));
  const additions = selectedModels.reduce<T[]>((items, model) => {
    if (!model.selected || model.isExisting || existingIds.has(model.id)) {
      return items;
    }

    existingIds.add(model.id);
    items.push({
      uid: createModelUid(),
      id: model.id,
      name: normalizeFetchedModelName(model),
      enabled: true,
    } as T);
    return items;
  }, []);

  return additions.length > 0 ? [...existingModels, ...additions] : existingModels;
}
