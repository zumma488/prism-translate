import { describe, expect, it } from 'vitest';

import { AppStatus, type TranslationTaskView } from '@/types';
import { resolveTargetLanguageChangeDecision } from './translationRunnerDecision';

const existingTaskViews: TranslationTaskView[] = [
  {
    taskKey: 'French:openai:gpt-4o',
    language: 'French',
    modelKey: 'openai:gpt-4o',
    modelName: 'GPT-4o',
    providerName: 'OpenAI',
    status: 'success',
    retryCount: 0,
  },
];

describe('translationRunnerDecision', () => {
  it('triggers incremental translation when new languages are added for unchanged input with existing tasks', () => {
    expect(
      resolveTargetLanguageChangeDecision({
        previousLanguages: ['French'],
        nextLanguages: ['French', 'German'],
        inputText: 'hello',
        lastSubmittedInputText: 'hello',
        status: AppStatus.SUCCESS,
        taskViews: existingTaskViews,
      }),
    ).toEqual({
      addedLanguages: ['German'],
      removedLanguages: [],
      shouldIncrementalTranslate: true,
    });
  });

  it('does not trigger incremental translation when the input text changed', () => {
    expect(
      resolveTargetLanguageChangeDecision({
        previousLanguages: ['French'],
        nextLanguages: ['French', 'German'],
        inputText: 'hello world',
        lastSubmittedInputText: 'hello',
        status: AppStatus.SUCCESS,
        taskViews: existingTaskViews,
      }).shouldIncrementalTranslate,
    ).toBe(false);
  });

  it('does not trigger incremental translation while loading', () => {
    expect(
      resolveTargetLanguageChangeDecision({
        previousLanguages: ['French'],
        nextLanguages: ['French', 'German'],
        inputText: 'hello',
        lastSubmittedInputText: 'hello',
        status: AppStatus.LOADING,
        taskViews: existingTaskViews,
      }).shouldIncrementalTranslate,
    ).toBe(false);
  });

  it('reports removed languages separately from added languages', () => {
    expect(
      resolveTargetLanguageChangeDecision({
        previousLanguages: ['French', 'German'],
        nextLanguages: ['French', 'Japanese'],
        inputText: 'hello',
        lastSubmittedInputText: 'hello',
        status: AppStatus.SUCCESS,
        taskViews: [
          ...existingTaskViews,
          {
            taskKey: 'German:openai:gpt-4o',
            language: 'German',
            modelKey: 'openai:gpt-4o',
            modelName: 'GPT-4o',
            providerName: 'OpenAI',
            status: 'success',
            retryCount: 0,
          },
        ],
      }),
    ).toEqual({
      addedLanguages: ['Japanese'],
      removedLanguages: ['German'],
      shouldIncrementalTranslate: true,
    });
  });
});
