import { translateText } from '../../../services/llmService';
import { TranslationResult } from '../../../types';
import {
  buildTranslationTasks,
  EnabledModelMeta,
  sortTranslationResults,
} from './translationOrchestrator';

export interface ExecuteTranslationFlowParams {
  inputText: string;
  targetLanguages: string[];
  languageModels: Record<string, string[]>;
  activeModelKey: string;
  enabledModels: EnabledModelMeta[];
  onResult?: (results: TranslationResult[]) => void;
}

export async function executeTranslationFlow({
  inputText,
  targetLanguages,
  languageModels,
  activeModelKey,
  enabledModels,
  onResult,
}: ExecuteTranslationFlowParams): Promise<TranslationResult[]> {
  const tasks = buildTranslationTasks(targetLanguages, languageModels, activeModelKey);
  const collectedResults: TranslationResult[] = [];

  const emitProgress = (nextResult: TranslationResult) => {
    collectedResults.push(nextResult);
    const sortedResults = sortTranslationResults(collectedResults, targetLanguages, tasks, enabledModels);
    onResult?.(sortedResults);
  };

  const translationTasks = tasks.map(async ({ lang, modelKey }) => {
    const meta = enabledModels.find((model) => model.uniqueId === modelKey);

    if (!meta) {
      console.warn(`Model not found for key: ${modelKey}, skipping language: ${lang}`);
      return null;
    }

    try {
      const results = await translateText({
        text: inputText,
        targetLanguages: [lang],
        provider: meta.provider,
        modelId: meta.modelId,
      });

      const result = results[0];
      if (!result) {
        return null;
      }

      const enrichedResult: TranslationResult = {
        ...result,
        modelName: meta.modelName,
        providerName: meta.providerName || meta.provider.name,
      };

      emitProgress(enrichedResult);
      return enrichedResult;
    } catch (err) {
      console.error(`Translation failed for ${lang} with model ${modelKey}:`, err);

      const errorResult: TranslationResult = {
        language: lang,
        code: '',
        text: '',
        tone: '',
        confidence: 0,
        modelName: meta.modelName,
        providerName: meta.providerName || meta.provider.name,
        error: err instanceof Error ? err.message : String(err),
      };

      emitProgress(errorResult);
      return errorResult;
    }
  });

  await Promise.all(translationTasks);

  return sortTranslationResults(collectedResults, targetLanguages, tasks, enabledModels);
}
