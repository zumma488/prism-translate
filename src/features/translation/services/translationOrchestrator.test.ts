import { describe, expect, it } from 'vitest';

import type { ProviderConfig, TranslationResult } from '@/types';

import {
  buildTranslationTasks,
  getEnabledModels,
  getExpectedCountForLanguage,
  getExpectedTranslationCount,
  groupTranslationsByLanguage,
  sortTranslationResults,
} from './translationOrchestrator';

const providers: ProviderConfig[] = [
  {
    id: 'openai',
    providerType: 'openai',
    displayName: 'OpenAI',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4.1-mini', name: 'GPT-4.1 mini', enabled: false },
    ],
  },
  {
    id: 'anthropic',
    providerType: 'anthropic',
    displayName: 'Anthropic',
    models: [{ id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' }],
  },
];

describe('translationOrchestrator', () => {
  it('returns metadata for enabled models only', () => {
    expect(getEnabledModels(providers)).toEqual([
      {
        provider: providers[0],
        modelId: 'gpt-4o',
        modelName: 'GPT-4o',
        uniqueId: 'openai:gpt-4o',
        providerName: 'OpenAI',
      },
      {
        provider: providers[1],
        modelId: 'claude-3.5-sonnet',
        modelName: 'Claude 3.5 Sonnet',
        uniqueId: 'anthropic:claude-3.5-sonnet',
        providerName: 'Anthropic',
      },
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
      { lang: 'German', modelKey: 'anthropic:claude-3.5-sonnet' },
      { lang: 'Japanese', modelKey: 'anthropic:claude-3.5-sonnet' },
    ]);
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
});
