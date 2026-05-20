import type { LanguageModel } from 'ai';
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
import type { ProviderConfig } from '@/types';
import { safeFetch } from '@/services/llmService/safeFetch';

function resolveOpenAIProtocol(provider: ProviderConfig): 'responses' | 'chat' {
  if (provider.connection?.protocol) {
    return provider.connection.protocol;
  }

  return provider.providerType === 'openai' ? 'responses' : 'chat';
}

export function createModel(provider: ProviderConfig, modelId: string): LanguageModel {
  const apiKey = provider.credentials?.apiKey;
  const baseURL = provider.connection?.baseUrl || undefined;

  switch (provider.providerType) {
    case 'google': {
      const google = createGoogleGenerativeAI({
        apiKey,
        baseURL,
        fetch: safeFetch,
      });
      return google(modelId || 'gemini-2.0-flash');
    }

    case 'anthropic': {
      const anthropic = createAnthropic({
        apiKey,
        baseURL,
        fetch: safeFetch,
      });
      return anthropic(modelId || 'claude-3-5-sonnet-20241022');
    }

    case 'mistral': {
      const mistral = createMistral({
        apiKey,
        baseURL,
        fetch: safeFetch,
      });
      return mistral(modelId || 'mistral-large-latest');
    }

    case 'xai': {
      const xai = createXai({
        apiKey,
        baseURL,
        fetch: safeFetch,
      });
      return xai(modelId || 'grok-2');
    }

    case 'cohere': {
      const cohere = createCohere({
        apiKey,
        baseURL,
        fetch: safeFetch,
      });
      return cohere(modelId || 'command-r-plus');
    }

    case 'groq': {
      const groq = createGroq({
        apiKey,
        baseURL,
        fetch: safeFetch,
      });
      return groq(modelId || 'llama-3.3-70b-versatile');
    }

    case 'deepseek': {
      const deepseek = createDeepSeek({
        apiKey,
        baseURL,
        fetch: safeFetch,
      });
      return deepseek(modelId || 'deepseek-chat');
    }

    case 'together': {
      const together = createTogetherAI({
        apiKey,
        baseURL,
        fetch: safeFetch,
      });
      return together(modelId || 'meta-llama/Llama-3.3-70B-Instruct-Turbo');
    }

    case 'fireworks': {
      const fireworks = createFireworks({
        apiKey,
        baseURL,
        fetch: safeFetch,
      });
      return fireworks(modelId || 'accounts/fireworks/models/llama-v3p3-70b-instruct');
    }

    case 'deepinfra': {
      const deepinfra = createDeepInfra({
        apiKey,
        baseURL,
        fetch: safeFetch,
      });
      return deepinfra(modelId || 'meta-llama/Llama-3.3-70B-Instruct');
    }

    case 'perplexity': {
      const perplexity = createPerplexity({
        apiKey,
        baseURL,
        fetch: safeFetch,
      });
      return perplexity(modelId || 'sonar-pro');
    }

    case 'cerebras': {
      const cerebras = createCerebras({
        apiKey,
        baseURL,
        fetch: safeFetch,
      });
      return cerebras(modelId || 'llama-3.3-70b');
    }

    case 'ollama': {
      const ollama = createOllama({
        baseURL: provider.connection?.baseUrl || 'http://localhost:11434/api',
        fetch: safeFetch,
      });
      return ollama(modelId || 'llama3.2') as unknown as LanguageModel;
    }

    case 'zhipu': {
      const zhipu = createZhipu({
        apiKey,
        baseURL,
        fetch: safeFetch,
      });
      return zhipu(modelId || 'glm-4-plus') as unknown as LanguageModel;
    }

    case 'workers': {
      const accountId = provider.account?.accountId;
      if (!accountId) {
        throw new Error('Cloudflare Workers AI requires accountId.');
      }
      if (!apiKey) {
        throw new Error('Cloudflare Workers AI requires apiKey.');
      }
      const workersAI = createWorkersAI({
        accountId,
        apiKey,
      });
      return workersAI(modelId || '@cf/meta/llama-3.3-70b-instruct-fp8-fast');
    }

    case 'openrouter': {
      const openrouter = createOpenRouter({
        apiKey,
        baseURL,
        fetch: safeFetch,
        headers: {
          'HTTP-Referer': 'https://github.com/vercel/ai',
          'X-Title': 'Prism Translate',
        },
      });
      return openrouter(modelId || 'openai/gpt-4o');
    }

    case 'openai':
    case 'custom':
    default: {
      const openai = createOpenAI({
        apiKey,
        baseURL: provider.connection?.baseUrl || 'https://api.openai.com/v1',
        fetch: safeFetch,
      });

      const protocol = resolveOpenAIProtocol(provider);
      return protocol === 'responses' ? openai.responses(modelId) : openai.chat(modelId);
    }
  }
}
