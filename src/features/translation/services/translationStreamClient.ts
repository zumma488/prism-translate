import type {
  TranslationRequestPayload,
  TranslationStreamEvent,
  TranslationResult,
} from '@/types';

function parseSseChunk(chunk: string): TranslationStreamEvent[] {
  return chunk
    .split('\n\n')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .flatMap((entry) => {
      const dataLine = entry
        .split('\n')
        .find((line) => line.startsWith('data: '));

      if (!dataLine) {
        return [];
      }

      try {
        return [JSON.parse(dataLine.slice(6)) as TranslationStreamEvent];
      } catch {
        return [];
      }
    });
}

export interface ConsumeTranslationStreamParams {
  payload: TranslationRequestPayload;
  onResult: (result: TranslationResult) => void;
}

export async function consumeTranslationStream({
  payload,
  onResult,
}: ConsumeTranslationStreamParams): Promise<void> {
  const response = await fetch('/api/translate/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.body) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || 'Failed to start translation stream.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = parseSseChunk(buffer);

    const trailingSeparator = buffer.lastIndexOf('\n\n');
    if (trailingSeparator !== -1) {
      buffer = buffer.slice(trailingSeparator + 2);
    }

    for (const event of events) {
      if (event.type === 'result') {
        onResult(event.payload);
      }

      if (event.type === 'error') {
        throw new Error(event.payload.message);
      }
    }
  }
}
