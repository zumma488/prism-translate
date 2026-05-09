import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchProviderModels } from '@/server/translation/fetchProviderModels';
import { providerSchema } from '@/server/translation/providerSchema';

export const runtime = 'nodejs';
export const maxDuration = 60;

const schema = z.object({
  provider: providerSchema,
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const data = await fetchProviderModels(body.provider);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch models.',
      },
      { status: 400 },
    );
  }
}
