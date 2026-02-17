import { generateText } from 'ai';

import { TranslationResult, ProviderConfig } from '../../types';
import { createModel } from './providers';

export interface LLMRequest {
    text: string;
    targetLanguages: string[];
    provider: ProviderConfig;
    modelId: string;
}

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

// Request timeout: default 30 minutes, configurable via VITE_REQUEST_TIMEOUT_MS in .env
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_REQUEST_TIMEOUT_MS) || 30 * 60 * 1000;

export const translateText = async (request: LLMRequest): Promise<TranslationResult[]> => {
    const { text, targetLanguages, provider, modelId } = request;

    if (!provider.apiKey && provider.type !== 'ollama') {
        throw new Error("API Key is missing");
    }

    const userPrompt = `Translate this text: "${text}" into these languages: ${targetLanguages.join(", ")}.`;
    const model = createModel(provider, modelId);

    try {
        const { text: responseText } = await generateText({
            model,
            system: SYSTEM_PROMPT,
            prompt: userPrompt,
            abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        if (!responseText) {
            throw new Error("No response from AI model");
        }

        const cleaned = responseText
            .replace(/<think>[\s\S]*?<\/think>/g, '')  // Standard <think>...</think>
            .replace(/^[\s\S]*?<\/think>/g, '')         // Missing opening <think> tag
            .trim();

        const startIdx = cleaned.indexOf('[');
        const endIdx = cleaned.lastIndexOf(']');
        if (startIdx === -1 || endIdx === -1) {
            throw new Error("Could not extract JSON from AI response");
        }
        return JSON.parse(cleaned.substring(startIdx, endIdx + 1)) as TranslationResult[];

    } catch (error) {
        console.error("Translation Error:", error);
        throw error;
    }
};

// Re-export SUPPORTED_PROVIDERS from centralized config
export { SUPPORTED_PROVIDERS } from '@/config/models';
