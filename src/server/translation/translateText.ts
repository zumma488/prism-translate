import { generateText } from 'ai';
import type { ProviderConfig, TranslationResult } from '@/types';
import { createModel } from '@/server/translation/providers';

const SYSTEM_PROMPT = `
You are a professional translator.
For each language, provide:
1. The translated text.
2. The tone (e.g., Formal, Casual, Neutral).
3. A confidence score between 0 and 100.
4. The standard ISO language code.

Return the response strictly as a JSON array with this schema:
[
  {
    "language": "Target Language Name",
    "code": "ISO Code",
    "text": "Translated Text",
    "tone": "Tone",
    "confidence": 95
  }
]
`;

export interface LLMRequest {
  text: string;
  targetLanguages: string[];
  provider: ProviderConfig;
  modelId: string;
}

function resolveRequestTimeoutMs() {
  const configuredTimeout =
    Number(process.env.REQUEST_TIMEOUT_MS || process.env.NEXT_REQUEST_TIMEOUT_MS) ||
    30 * 60 * 1000;
  const isVercel = process.env.VERCEL === '1';

  if (!isVercel) {
    return configuredTimeout;
  }

  // Keep provider requests slightly below the route maxDuration to avoid Vercel
  // terminating the function before the upstream timeout fires.
  return Math.min(configuredTimeout, 295_000);
}

export async function translateText(request: LLMRequest): Promise<TranslationResult[]> {
  const { text, targetLanguages, provider, modelId } = request;
  const requestTimeoutMs = resolveRequestTimeoutMs();

  if (!provider.credentials?.apiKey && provider.providerType !== 'ollama') {
    throw new Error('API key is missing');
  }

  const prompt = `Translate this text: "${text}" into these languages: ${targetLanguages.join(', ')}.`;
  const model = createModel(provider, modelId);
  const { text: responseText } = await generateText({
    model,
    system: SYSTEM_PROMPT,
    prompt,
    abortSignal: AbortSignal.timeout(requestTimeoutMs),
  });

  if (!responseText) {
    throw new Error('No response from AI model');
  }

  const cleaned = responseText
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/^[\s\S]*?<\/think>/g, '')
    .trim();

  const startIndex = cleaned.indexOf('[');
  const endIndex = cleaned.lastIndexOf(']');

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('Could not extract JSON from AI response');
  }

  return JSON.parse(cleaned.slice(startIndex, endIndex + 1)) as TranslationResult[];
}
