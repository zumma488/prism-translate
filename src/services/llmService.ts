import { generateText, LanguageModel } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createMistral } from '@ai-sdk/mistral';
import { createXai } from '@ai-sdk/xai';
import { createCohere } from '@ai-sdk/cohere';
import { createGroq } from '@ai-sdk/groq';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { createTogetherAI } from '@ai-sdk/togetherai';
import { createFireworks } from '@ai-sdk/fireworks';
import { createDeepInfra } from '@ai-sdk/deepinfra';
import { createPerplexity } from '@ai-sdk/perplexity';
import { createCerebras } from '@ai-sdk/cerebras';
import { createOllama } from 'ollama-ai-provider';
import { createZhipu } from 'zhipu-ai-provider';
import { createWorkersAI } from 'workers-ai-provider';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

import { TranslationResult, ProviderConfig } from '../types';

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

// Cache for API format detection results
const apiFormatCache = new Map<string, 'chat' | 'responses'>();

export const translateText = async (request: LLMRequest): Promise<TranslationResult[]> => {
    const { text, targetLanguages, provider, modelId } = request;

    if (!provider.apiKey && provider.type !== 'ollama') {
        throw new Error("API Key is missing");
    }

    const userPrompt = `Translate this text: "${text}" into these languages: ${targetLanguages.join(", ")}.`;

    // For custom/openai providers, try with auto-detection
    if (provider.type === 'custom' || provider.type === 'openai') {
        return translateWithAutoDetect(provider, modelId, userPrompt);
    }

    // For native SDK providers, use direct call
    try {
        const model = createModel(provider, modelId);

        const { text: responseText } = await generateText({
            model,
            system: SYSTEM_PROMPT,
            prompt: userPrompt,
        });

        if (!responseText) {
            throw new Error("No response from AI model");
        }

        const cleanContent = responseText.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanContent) as TranslationResult[];

    } catch (error) {
        console.error("Translation Error:", error);
        throw error;
    }
};

/**
 * Auto-detect API format and translate with fallback
 * Priority: chat (most compatible) → responses (OpenAI native)
 */
async function translateWithAutoDetect(
    provider: ProviderConfig,
    modelId: string,
    userPrompt: string
): Promise<TranslationResult[]> {
    const cacheKey = `${provider.baseUrl || 'openai'}:${provider.id}`;
    const cachedFormat = apiFormatCache.get(cacheKey);

    const openai = createOpenAI({
        apiKey: provider.apiKey,
        baseURL: provider.baseUrl || 'https://api.openai.com/v1',
    });

    const tryGenerate = async (format: 'chat' | 'responses') => {
        const model = format === 'chat' ? openai.chat(modelId) : openai(modelId);

        const { text: responseText } = await generateText({
            model,
            system: SYSTEM_PROMPT,
            prompt: userPrompt,
        });

        if (!responseText) {
            throw new Error("No response from AI model");
        }

        // Cache successful format
        apiFormatCache.set(cacheKey, format);


        const cleanContent = responseText.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanContent) as TranslationResult[];
    };

    // If we have a cached format, try it first
    if (cachedFormat) {
        try {
            return await tryGenerate(cachedFormat);
        } catch (error) {
            // Cache might be stale, clear and retry with detection
            apiFormatCache.delete(cacheKey);
        }
    }

    // Try chat first (most compatible with third-party APIs)
    try {
        return await tryGenerate('chat');
    } catch (chatError) {


        // Fallback to responses API
        try {
            return await tryGenerate('responses');
        } catch (responsesError) {
            // Both failed, throw the original chat error (more likely to be the real issue)
            console.error('[API Format] All formats failed');
            throw chatError;
        }
    }
}

function createModel(provider: ProviderConfig, modelId: string): LanguageModel {
    switch (provider.type) {
        case 'google': {
            const google = createGoogleGenerativeAI({ apiKey: provider.apiKey });
            return google(modelId || 'gemini-2.0-flash');
        }

        case 'anthropic': {
            const anthropic = createAnthropic({ apiKey: provider.apiKey });
            return anthropic(modelId || 'claude-3-5-sonnet-20241022');
        }

        case 'mistral': {
            const mistral = createMistral({ apiKey: provider.apiKey });
            return mistral(modelId || 'mistral-large-latest');
        }

        case 'xai': {
            const xai = createXai({ apiKey: provider.apiKey });
            return xai(modelId || 'grok-2');
        }

        case 'cohere': {
            const cohere = createCohere({ apiKey: provider.apiKey });
            return cohere(modelId || 'command-r-plus');
        }

        case 'groq': {
            const groq = createGroq({ apiKey: provider.apiKey });
            return groq(modelId || 'llama-3.3-70b-versatile');
        }

        case 'deepseek': {
            const deepseek = createDeepSeek({ apiKey: provider.apiKey });
            return deepseek(modelId || 'deepseek-chat');
        }

        case 'together': {
            const together = createTogetherAI({ apiKey: provider.apiKey });
            return together(modelId || 'meta-llama/Llama-3.3-70B-Instruct-Turbo');
        }

        case 'fireworks': {
            const fireworks = createFireworks({ apiKey: provider.apiKey });
            return fireworks(modelId || 'accounts/fireworks/models/llama-v3p3-70b-instruct');
        }

        case 'deepinfra': {
            const deepinfra = createDeepInfra({ apiKey: provider.apiKey });
            return deepinfra(modelId || 'meta-llama/Llama-3.3-70B-Instruct');
        }

        case 'perplexity': {
            const perplexity = createPerplexity({ apiKey: provider.apiKey });
            return perplexity(modelId || 'sonar-pro');
        }

        case 'cerebras': {
            const cerebras = createCerebras({ apiKey: provider.apiKey });
            return cerebras(modelId || 'llama-3.3-70b');
        }



        case 'ollama': {
            const ollama = createOllama({ baseURL: provider.baseUrl || 'http://localhost:11434/api' });
            return ollama(modelId || 'llama3.2') as unknown as LanguageModel;
        }

        case 'zhipu': {
            const zhipu = createZhipu({ apiKey: provider.apiKey });
            return zhipu(modelId || 'glm-4-plus') as unknown as LanguageModel;
        }

        case 'workers': {
            const workersAI = createWorkersAI({
                accountId: provider.accountId,
                apiKey: provider.apiKey,
            });
            return workersAI(modelId || '@cf/meta/llama-3.3-70b-instruct-fp8-fast');
        }

        case 'openrouter': {
            const openrouter = createOpenRouter({
                apiKey: provider.apiKey,
                headers: {
                    'HTTP-Referer': 'https://github.com/vercel/ai', // Optional: for rankings
                    'X-Title': 'Prism Translate', // Optional: for rankings
                }
            });
            return openrouter(modelId || 'openai/gpt-4o');
        }

        case 'openai':
        case 'custom':
        default: {
            // OpenAI and all OpenAI-compatible APIs (Kimi, Qianwen, MiniMax, GLM, Baichuan, Doubao, etc.)
            const openai = createOpenAI({
                apiKey: provider.apiKey,
                baseURL: provider.baseUrl || 'https://api.openai.com/v1',
            });
            // Use .chat() for better compatibility with third-party APIs
            // The default uses OpenAI Responses API which may not be supported
            return openai.chat(modelId);
        }
    }
}

// Re-export SUPPORTED_PROVIDERS from centralized config
export { SUPPORTED_PROVIDERS } from '@/config/models';
