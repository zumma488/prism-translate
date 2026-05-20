import { describe, expect, it, vi } from 'vitest';

import type { ModelDefinition } from '@/types';

import {
  buildSelectableFetchedModels,
  mergeSelectedFetchedModels,
  selectAllNewFetchedModels,
  toggleSelectableFetchedModel,
} from './providerFetchedModels';

describe('providerFetchedModels', () => {
  it('marks fetched models as new or existing and leaves all fetched items unselected by default', () => {
    const result = buildSelectableFetchedModels(
      [
        { id: 'gpt-4o' },
        { id: 'gpt-4o-mini', name: 'GPT-4o mini' },
        { id: 'gpt-4o' },
      ],
      [{ id: 'gpt-4o' }],
    );

    expect(result).toEqual([
      {
        id: 'gpt-4o',
        name: 'gpt-4o',
        isExisting: true,
        selected: false,
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o mini',
        isExisting: false,
        selected: false,
      },
    ]);
  });

  it('toggles an individual fetched model and can reselect all new models', () => {
    const initial = buildSelectableFetchedModels(
      [
        { id: 'gpt-4o' },
        { id: 'gpt-4o-mini' },
      ],
      [{ id: 'gpt-4o' }],
    );

    const toggled = toggleSelectableFetchedModel(initial, 'gpt-4o');
    const reselected = selectAllNewFetchedModels(
      toggleSelectableFetchedModel(toggled, 'gpt-4o-mini'),
    );

    expect(toggled[0].selected).toBe(true);
    expect(reselected).toEqual([
      {
        id: 'gpt-4o',
        name: 'gpt-4o',
        isExisting: true,
        selected: true,
      },
      {
        id: 'gpt-4o-mini',
        name: 'gpt-4o-mini',
        isExisting: false,
        selected: true,
      },
    ]);
  });

  it('appends only selected new models when merging', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('new-model-uid');
    const existingModels: ModelDefinition[] = [
      {
        uid: 'existing-uid',
        id: 'gpt-4o',
        name: 'Existing GPT-4o',
        enabled: false,
      },
    ];

    const merged = mergeSelectedFetchedModels(existingModels, [
      {
        id: 'gpt-4o',
        name: 'gpt-4o',
        isExisting: true,
        selected: false,
      },
      {
        id: 'gpt-4.1-mini',
        name: 'GPT-4.1 mini',
        isExisting: false,
        selected: true,
      },
    ]);

    expect(merged).toEqual([
      existingModels[0],
      {
        uid: 'new-model-uid',
        id: 'gpt-4.1-mini',
        name: 'GPT-4.1 mini',
        enabled: true,
      },
    ]);
  });

  it('keeps existing model metadata and avoids duplicate rows when only existing models are selected', () => {
    const existingModels: ModelDefinition[] = [
      {
        uid: 'existing-uid',
        id: 'gpt-4o',
        name: 'Pinned GPT-4o',
        enabled: false,
        capabilities: {
          reasoning: true,
        },
      },
    ];

    const merged = mergeSelectedFetchedModels(existingModels, [
      {
        id: 'gpt-4o',
        name: 'gpt-4o',
        isExisting: true,
        selected: true,
      },
    ]);

    expect(merged).toBe(existingModels);
    expect(merged).toEqual([
      {
        uid: 'existing-uid',
        id: 'gpt-4o',
        name: 'Pinned GPT-4o',
        enabled: false,
        capabilities: {
          reasoning: true,
        },
      },
    ]);
  });
});
