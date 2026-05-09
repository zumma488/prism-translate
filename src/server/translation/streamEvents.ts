import type { TranslationStreamEvent } from '@/types';

const encoder = new TextEncoder();

export function encodeSseEvent(event: TranslationStreamEvent) {
  return encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
}

export function createSseResponse(stream: ReadableStream<Uint8Array>) {
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
