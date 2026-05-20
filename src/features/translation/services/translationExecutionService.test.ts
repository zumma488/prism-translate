import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ProviderConfig, TranslationTaskView } from '@/types';
import {
  executeFullTranslationFlow,
  executeIncrementalTranslationFlow,
} from './translationExecutionService';

const translateTextMock = vi.fn();

vi.mock('@/services/llmService', () => ({
  translateText: (...args: unknown[]) => translateTextMock(...args),
}));

const providers: ProviderConfig[] = [
  {
    id: 'openai',
    providerType: 'openai',
    displayName: 'OpenAI',
    models: [{ id: 'gpt-4o', name: 'GPT-4o' }],
  },
  {
    id: 'anthropic',
    providerType: 'anthropic',
    displayName: 'Anthropic',
    models: [{ id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' }],
  },
];

const enabledModels = [
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
];

describe('translationExecutionService', () => {
  beforeEach(() => {
    translateTextMock.mockReset();
    vi.restoreAllMocks();
  });

  it('marks browser-direct transport failures as browser-direct-not-supported without retrying or proxy fallback', async () => {
    translateTextMock.mockRejectedValue(new TypeError('Failed to fetch'));
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = await executeFullTranslationFlow({
      inputText: 'hello',
      targetLanguages: ['French'],
      languageModels: {
        French: ['openai:gpt-4o'],
      },
      activeModelKey: 'openai:gpt-4o',
      providers,
      enabledModels,
      executionMode: 'browser-direct',
    });

    expect(translateTextMock).toHaveBeenCalledTimes(1);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.results).toEqual([]);
    expect(result.taskViews).toEqual([
      expect.objectContaining({
        taskKey: 'French:openai:gpt-4o',
        status: 'error',
        retryCount: 0,
        errorCode: 'browser_direct_not_supported',
        error: 'Failed to fetch',
      }),
    ]);
  });

  it('keeps successful tasks when another browser-direct task is blocked', async () => {
    translateTextMock.mockImplementation(
      async ({ provider }: { provider: ProviderConfig }) => {
        if (provider.id === 'openai') {
          throw new TypeError('NetworkError when attempting to fetch resource.');
        }

        return [
          {
            language: 'French',
            code: 'fr',
            text: 'Bonjour',
            tone: 'neutral',
            confidence: 95,
          },
        ];
      },
    );

    const result = await executeFullTranslationFlow({
      inputText: 'hello',
      targetLanguages: ['French'],
      languageModels: {
        French: ['openai:gpt-4o', 'anthropic:claude-3.5-sonnet'],
      },
      activeModelKey: 'openai:gpt-4o',
      providers,
      enabledModels,
      executionMode: 'browser-direct',
    });

    expect(result.results).toEqual([
      expect.objectContaining({
        language: 'French',
        modelName: 'Claude 3.5 Sonnet',
        providerName: 'Anthropic',
        taskKey: 'French:anthropic:claude-3.5-sonnet',
      }),
    ]);
    expect(result.taskViews).toEqual([
      expect.objectContaining({
        taskKey: 'French:openai:gpt-4o',
        status: 'error',
        errorCode: 'browser_direct_not_supported',
      }),
      expect.objectContaining({
        taskKey: 'French:anthropic:claude-3.5-sonnet',
        status: 'success',
      }),
    ]);
  });

  it('retries non-classified browser-direct failures', async () => {
    translateTextMock.mockRejectedValue(new Error('Upstream provider error'));

    const result = await executeFullTranslationFlow({
      inputText: 'hello',
      targetLanguages: ['French'],
      languageModels: {
        French: ['openai:gpt-4o'],
      },
      activeModelKey: 'openai:gpt-4o',
      providers,
      enabledModels,
      executionMode: 'browser-direct',
    });

    expect(translateTextMock).toHaveBeenCalledTimes(3);
    expect(result.taskViews).toEqual([
      expect.objectContaining({
        taskKey: 'French:openai:gpt-4o',
        status: 'error',
        retryCount: 2,
        errorCode: undefined,
        error: 'Upstream provider error',
      }),
    ]);
  });

  it('uses the server-proxy route when execution mode is server-proxy', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          language: 'French',
          code: 'fr',
          text: 'Bonjour',
          tone: 'neutral',
          confidence: 96,
          modelName: 'GPT-4o',
          providerName: 'OpenAI',
          taskKey: 'French:openai:gpt-4o',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    const result = await executeFullTranslationFlow({
      inputText: 'hello',
      targetLanguages: ['French'],
      languageModels: {
        French: ['openai:gpt-4o'],
      },
      activeModelKey: 'openai:gpt-4o',
      providers,
      enabledModels,
      executionMode: 'server-proxy',
    });

    expect(translateTextMock).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/translate/task',
      expect.objectContaining({
        method: 'POST',
      }),
    );
    expect(result.results).toEqual([
      expect.objectContaining({
        language: 'French',
        modelName: 'GPT-4o',
        providerName: 'OpenAI',
        taskKey: 'French:openai:gpt-4o',
      }),
    ]);
    expect(result.taskViews).toEqual([
      expect.objectContaining({
        taskKey: 'French:openai:gpt-4o',
        status: 'success',
      }),
    ]);
  });

  it('lets a provider override the global execution mode to server-proxy', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          language: 'French',
          code: 'fr',
          text: 'Bonjour',
          tone: 'neutral',
          confidence: 96,
          modelName: 'GPT-4o',
          providerName: 'OpenAI',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    const result = await executeFullTranslationFlow({
      inputText: 'hello',
      targetLanguages: ['French'],
      languageModels: {
        French: ['openai:gpt-4o'],
      },
      activeModelKey: 'openai:gpt-4o',
      providers: [
        {
          ...providers[0],
          executionMode: 'server-proxy',
        },
      ],
      enabledModels: [
        {
          ...enabledModels[0],
          provider: {
            ...providers[0],
            executionMode: 'server-proxy',
          },
        },
      ],
      executionMode: 'browser-direct',
    });

    expect(translateTextMock).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(result.taskViews).toEqual([
      expect.objectContaining({
        taskKey: 'French:openai:gpt-4o',
        status: 'success',
      }),
    ]);
  });

  it('lets a provider override the global execution mode to browser-direct', async () => {
    translateTextMock.mockResolvedValue([
      {
        language: 'French',
        code: 'fr',
        text: 'Bonjour',
        tone: 'neutral',
        confidence: 95,
      },
    ]);
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = await executeFullTranslationFlow({
      inputText: 'hello',
      targetLanguages: ['French'],
      languageModels: {
        French: ['openai:gpt-4o'],
      },
      activeModelKey: 'openai:gpt-4o',
      providers: [
        {
          ...providers[0],
          executionMode: 'browser-direct',
        },
      ],
      enabledModels: [
        {
          ...enabledModels[0],
          provider: {
            ...providers[0],
            executionMode: 'browser-direct',
          },
        },
      ],
      executionMode: 'server-proxy',
    });

    expect(translateTextMock).toHaveBeenCalledTimes(1);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.taskViews).toEqual([
      expect.objectContaining({
        taskKey: 'French:openai:gpt-4o',
        status: 'success',
      }),
    ]);
  });

  it('incrementally translates only newly added languages and preserves existing results', async () => {
    translateTextMock.mockImplementation(
      async ({ targetLanguages }: { targetLanguages: string[] }) => [
        {
          language: targetLanguages[0],
          code: targetLanguages[0] === 'German' ? 'de' : 'fr',
          text: targetLanguages[0] === 'German' ? 'Hallo' : 'Bonjour',
          tone: 'neutral',
          confidence: 94,
        },
      ],
    );

    const existingTaskViews: TranslationTaskView[] = [
      {
        taskKey: 'French:openai:gpt-4o',
        language: 'French',
        modelKey: 'openai:gpt-4o',
        modelName: 'GPT-4o',
        providerName: 'OpenAI',
        status: 'success',
        retryCount: 0,
        result: {
          language: 'French',
          code: 'fr',
          text: 'Bonjour',
          tone: 'neutral',
          confidence: 95,
          taskKey: 'French:openai:gpt-4o',
          modelName: 'GPT-4o',
          providerName: 'OpenAI',
        },
      },
    ];

    const result = await executeIncrementalTranslationFlow({
      inputText: 'hello',
      targetLanguages: ['French', 'German'],
      addedLanguages: ['German'],
      languageModels: {
        French: ['openai:gpt-4o'],
        German: ['anthropic:claude-3.5-sonnet'],
      },
      activeModelKey: 'openai:gpt-4o',
      providers,
      enabledModels,
      executionMode: 'browser-direct',
      existingTaskViews,
      existingResults: [existingTaskViews[0].result!],
    });

    expect(translateTextMock).toHaveBeenCalledTimes(1);
    expect(translateTextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        targetLanguages: ['German'],
      }),
    );
    expect(result.results.map((entry) => entry.taskKey)).toEqual([
      'French:openai:gpt-4o',
      'German:anthropic:claude-3.5-sonnet',
    ]);
    expect(result.taskViews.map((entry) => entry.taskKey)).toEqual([
      'French:openai:gpt-4o',
      'German:anthropic:claude-3.5-sonnet',
    ]);
  });

  it('adds a missing-model error task for incrementally added languages without executable models', async () => {
    const result = await executeIncrementalTranslationFlow({
      inputText: 'hello',
      targetLanguages: ['French', 'German'],
      addedLanguages: ['German'],
      languageModels: {
        French: ['openai:gpt-4o'],
        German: ['missing:model'],
      },
      activeModelKey: 'openai:gpt-4.1-mini',
      providers,
      enabledModels: [enabledModels[0]],
      executionMode: 'browser-direct',
      existingTaskViews: [
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
      existingResults: [
        {
          language: 'French',
          code: 'fr',
          text: 'Bonjour',
          tone: 'neutral',
          confidence: 95,
          taskKey: 'French:openai:gpt-4o',
          modelName: 'GPT-4o',
          providerName: 'OpenAI',
        },
      ],
    });

    expect(translateTextMock).not.toHaveBeenCalled();
    expect(result.results).toEqual([
      expect.objectContaining({
        taskKey: 'French:openai:gpt-4o',
      }),
    ]);
    expect(result.taskViews).toEqual([
      expect.objectContaining({
        taskKey: 'French:openai:gpt-4o',
      }),
      expect.objectContaining({
        taskKey: 'German:missing-model',
        status: 'error',
        errorCode: 'missing_model',
      }),
    ]);
  });
});
