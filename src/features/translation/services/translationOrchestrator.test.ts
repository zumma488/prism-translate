import { describe, expect, it } from 'vitest';

import type { ProviderConfig, TranslationResult } from '@/types';

import {
  buildTranslationTasks,
  buildTaskOrder,
  getEnabledModels,
  getExpectedCountForLanguage,
  getExpectedTranslationCount,
  groupTranslationsByLanguage,
  resolveResolvedTranslationTaskSet,
  resolveTranslationTaskSet,
  sortTaskViewsByOrder,
  sortTranslationResults,
} from './translationOrchestrator';

const providers: ProviderConfig[] = [
  {
    id: 'openai',
    providerType: 'openai',
    displayName: 'OpenAI',
    models: [
      { uid: 'gpt-4o', id: 'gpt-4o', name: 'GPT-4o' },
      { uid: 'gpt-4.1-mini', id: 'gpt-4.1-mini', name: 'GPT-4.1 mini', enabled: false },
    ],
  },
  {
    id: 'anthropic',
    providerType: 'anthropic',
    displayName: 'Anthropic',
    models: [{ uid: 'claude-3.5-sonnet', id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' }],
  },
];

describe('translationOrchestrator', () => {
  it('returns metadata for enabled models only', () => {
    expect(getEnabledModels(providers)).toEqual([
      expect.objectContaining({
        provider: expect.objectContaining({
          id: 'openai',
          displayName: 'OpenAI',
          executionMode: 'inherit',
        }),
        modelId: 'gpt-4o',
        modelName: 'GPT-4o',
        uniqueId: 'openai:gpt-4o',
        providerName: 'OpenAI',
      }),
      expect.objectContaining({
        provider: expect.objectContaining({
          id: 'anthropic',
          displayName: 'Anthropic',
          executionMode: 'inherit',
        }),
        modelId: 'claude-3.5-sonnet',
        modelName: 'Claude 3.5 Sonnet',
        uniqueId: 'anthropic:claude-3.5-sonnet',
        providerName: 'Anthropic',
      }),
    ]);
  });

  it('uses uid-based keys so duplicate model ids stay selectable', () => {
    expect(
      getEnabledModels([
        {
          id: 'custom-provider',
          providerType: 'custom',
          displayName: 'Custom Provider',
          models: [
            { uid: 'row-1', id: 'gpt-4o', name: 'GPT-4o A' },
            { uid: 'row-2', id: 'gpt-4o', name: 'GPT-4o B' },
          ],
        },
      ]),
    ).toEqual([
      expect.objectContaining({
        modelId: 'gpt-4o',
        modelName: 'GPT-4o A',
        uniqueId: 'custom-provider:row-1',
      }),
      expect.objectContaining({
        modelId: 'gpt-4o',
        modelName: 'GPT-4o B',
        uniqueId: 'custom-provider:row-2',
      }),
    ]);
  });

  it('builds tasks from valid language bindings and falls back to the active model', () => {
    const enabledModels = getEnabledModels(providers);

    expect(
      buildTranslationTasks(
        ['French', 'German', 'Japanese'],
        {
          French: ['openai:gpt-4o', 'anthropic:claude-3.5-sonnet'],
          German: ['openai:gpt-4.1-mini', 'missing:model'],
        },
        'anthropic:claude-3.5-sonnet',
        enabledModels,
      ),
    ).toEqual([
      { lang: 'French', modelKey: 'openai:gpt-4o' },
      { lang: 'French', modelKey: 'anthropic:claude-3.5-sonnet' },
      { lang: 'Japanese', modelKey: 'anthropic:claude-3.5-sonnet' },
    ]);
  });

  it('tracks languages that have no available model instead of forcing a fake fallback', () => {
    const enabledModels = getEnabledModels([]);

    expect(
      resolveTranslationTaskSet(
        ['French', 'German'],
        {},
        'missing:model',
        enabledModels,
      ),
    ).toEqual({
      tasks: [],
      missingLanguages: ['French', 'German'],
    });
  });

  it('counts valid model bindings and fallback translations consistently', () => {
    const enabledModels = getEnabledModels(providers);
    const languageModels = {
      French: ['openai:gpt-4o', 'anthropic:claude-3.5-sonnet'],
      German: ['openai:gpt-4.1-mini', 'missing:model'],
    };

    expect(getExpectedTranslationCount(['French', 'German', 'Japanese'], languageModels, enabledModels)).toBe(4);
    expect(getExpectedCountForLanguage('French', languageModels, enabledModels)).toBe(2);
    expect(getExpectedCountForLanguage('German', languageModels, enabledModels)).toBe(1);
    expect(getExpectedCountForLanguage('Japanese', languageModels, enabledModels)).toBe(1);
  });

  it('sorts and groups results using language order and task order', () => {
    const enabledModels = getEnabledModels(providers);
    const tasks = buildTranslationTasks(
      ['French', 'German'],
      {
        French: ['openai:gpt-4o', 'anthropic:claude-3.5-sonnet'],
        German: ['anthropic:claude-3.5-sonnet'],
      },
      'openai:gpt-4o',
      enabledModels,
    );

    const results: TranslationResult[] = [
      {
        language: 'German',
        code: 'de',
        text: 'Hallo',
        tone: 'neutral',
        confidence: 0.8,
        modelName: 'Claude 3.5 Sonnet',
      },
      {
        language: 'French',
        code: 'fr',
        text: 'Bonjour',
        tone: 'neutral',
        confidence: 0.8,
        modelName: 'Claude 3.5 Sonnet',
      },
      {
        language: 'French',
        code: 'fr',
        text: 'Salut',
        tone: 'neutral',
        confidence: 0.8,
        modelName: 'GPT-4o',
      },
    ];

    const sorted = sortTranslationResults(results, ['French', 'German'], tasks, enabledModels);

    expect(sorted.map((result) => `${result.language}:${result.modelName}`)).toEqual([
      'French:GPT-4o',
      'French:Claude 3.5 Sonnet',
      'German:Claude 3.5 Sonnet',
    ]);

    expect(groupTranslationsByLanguage(sorted)).toEqual([
      {
        language: 'French',
        results: [sorted[0], sorted[1]],
      },
      {
        language: 'German',
        results: [sorted[2]],
      },
    ]);
  });

  it('builds task order including missing-model placeholders and sorts task views accordingly', () => {
    const enabledModels = getEnabledModels(providers);
    const taskOrder = buildTaskOrder(
      ['French', 'German', 'Japanese'],
      {
        French: ['openai:gpt-4o'],
        German: ['missing:model'],
      },
      'openai:gpt-4.1-mini',
      enabledModels,
    );

    expect(taskOrder).toEqual([
      'French:openai:gpt-4o',
      'German:missing-model',
      'Japanese:openai:gpt-4o',
    ]);

    expect(
      sortTaskViewsByOrder(
        [
          {
            taskKey: 'Japanese:openai:gpt-4o',
            language: 'Japanese',
            modelKey: 'openai:gpt-4o',
            modelName: 'GPT-4o',
            providerName: 'OpenAI',
            status: 'pending',
            retryCount: 0,
          },
          {
            taskKey: 'German:missing-model',
            language: 'German',
            modelKey: '__missing_model__',
            modelName: '',
            providerName: '',
            status: 'error',
            retryCount: 0,
            errorCode: 'missing_model',
          },
          {
            taskKey: 'French:openai:gpt-4o',
            language: 'French',
            modelKey: 'openai:gpt-4o',
            modelName: 'GPT-4o',
            providerName: 'OpenAI',
            status: 'success',
            retryCount: 0,
          },
        ],
        taskOrder,
        ['French', 'German', 'Japanese'],
      ).map((taskView) => taskView.taskKey),
    ).toEqual([
      'French:openai:gpt-4o',
      'German:missing-model',
      'Japanese:openai:gpt-4o',
    ]);
  });
});
