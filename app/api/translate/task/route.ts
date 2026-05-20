import { NextResponse } from 'next/server';
import { z } from 'zod';
import { translateText } from '@/server/translation/translateText';
import { providerSchema } from '@/server/translation/providerSchema';

export const runtime = 'nodejs';
export const maxDuration = 120;

const requestSchema = z.object({
  text: z.string().min(1),
  targetLanguage: z.string().min(1),
  provider: providerSchema,
  modelId: z.string().min(1),
  modelName: z.string().min(1),
  providerName: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const payload = requestSchema.parse(await request.json());
    const results = await translateText({
      text: payload.text,
      targetLanguages: [payload.targetLanguage],
      provider: payload.provider,
      modelId: payload.modelId,
    });

    const result = results[0];
    if (!result) {
      throw new Error('Translation returned no result.');
    }

    return NextResponse.json({
      ...result,
      modelName: payload.modelName,
      providerName: payload.providerName,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Translation failed.',
      },
      { status: 400 },
    );
  }
}
