import { z } from 'zod';
import { translateText } from '@/server/translation/translateText';
import { createSseResponse, encodeSseEvent } from '@/server/translation/streamEvents';
import {
  buildTranslationTasks,
  sortTranslationResults,
  type EnabledModelMeta,
} from '@/features/translation/services/translationOrchestrator';
import { providerSchema } from '@/server/translation/providerSchema';
import type { ProviderConfig, TranslationResult } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 300;

const requestSchema = z.object({
  text: z.string().min(1),
  targetLanguages: z.array(z.string()).min(1),
  languageModels: z.record(z.string(), z.array(z.string())).default({}),
  activeModelKey: z.string().default(''),
  providers: z.array(providerSchema),
});

function getEnabledModels(providers: ProviderConfig[]): EnabledModelMeta[] {
  const allModels: EnabledModelMeta[] = [];

  providers.forEach((provider) => {
    provider.models.forEach((model) => {
      if (model.enabled !== false) {
        allModels.push({
          provider,
          modelId: model.id,
          modelName: model.name,
          uniqueId: `${provider.id}:${model.id}`,
          providerName: provider.displayName,
        });
      }
    });
  });

  return allModels;
}

export async function POST(request: Request) {
  const payload = requestSchema.parse(await request.json());
  const enabledModels = getEnabledModels(payload.providers);
  const tasks = buildTranslationTasks(
    payload.targetLanguages,
    payload.languageModels,
    payload.activeModelKey,
    enabledModels,
  );

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const collectedResults: TranslationResult[] = [];
      let completed = 0;

      const pushResult = (taskKey: string, result: TranslationResult) => {
        collectedResults.push(result);
        const sorted = sortTranslationResults(
          collectedResults,
          payload.targetLanguages,
          tasks,
          enabledModels,
        );
        const nextResult = sorted.find(
          (item) =>
            item.language === result.language &&
            item.modelName === result.modelName &&
            item.providerName === result.providerName &&
            item.text === result.text &&
            item.error === result.error,
        ) || result;

        controller.enqueue(
          encodeSseEvent({
            type: 'result',
            taskKey,
            payload: nextResult,
          }),
        );
      };

      const finishTask = () => {
        completed += 1;
        if (completed === tasks.length) {
          controller.enqueue(
            encodeSseEvent({
              type: 'done',
              payload: {
                count: collectedResults.length,
              },
            }),
          );
          controller.close();
        }
      };

      tasks.forEach(async ({ lang, modelKey }) => {
        const meta = enabledModels.find((model) => model.uniqueId === modelKey);
        if (!meta) {
          finishTask();
          return;
        }

        const taskKey = `${lang}:${modelKey}`;

        try {
          const results = await translateText({
            text: payload.text,
            targetLanguages: [lang],
            provider: meta.provider,
            modelId: meta.modelId,
          });

          const result = results[0];
          if (!result) {
            throw new Error('Translation returned no result.');
          }

          pushResult(taskKey, {
            ...result,
            modelName: meta.modelName,
            providerName: meta.providerName || meta.provider.displayName,
          });
        } catch (error) {
          pushResult(taskKey, {
            language: lang,
            code: '',
            text: '',
            tone: '',
            confidence: 0,
            modelName: meta.modelName,
            providerName: meta.providerName || meta.provider.displayName,
            error: error instanceof Error ? error.message : String(error),
          });
        } finally {
          finishTask();
        }
      });
    },
  });

  return createSseResponse(stream);
}
