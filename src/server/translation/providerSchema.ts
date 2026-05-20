import { z } from 'zod';
import type { ProviderConfig } from '@/types';

const providerTypeSchema = z.enum([
  'google',
  'openai',
  'anthropic',
  'mistral',
  'xai',
  'cohere',
  'groq',
  'deepseek',
  'together',
  'fireworks',
  'deepinfra',
  'perplexity',
  'cerebras',
  'azure',
  'vertex',
  'bedrock',
  'ollama',
  'zhipu',
  'workers',
  'openrouter',
  'custom',
]);

export const providerSchema = z
  .object({
    id: z.string(),
    providerType: providerTypeSchema,
    displayName: z.string(),
    models: z.array(
      z
        .object({
          uid: z.string().optional(),
          id: z.string(),
          name: z.string(),
          enabled: z.boolean().optional(),
          capabilities: z
            .object({
              vision: z.boolean().optional(),
              audio: z.boolean().optional(),
              reasoning: z.boolean().optional(),
              coding: z.boolean().optional(),
              agentic: z.boolean().optional(),
              video: z.boolean().optional(),
            })
            .strict()
            .optional(),
        })
        .strict(),
    ),
    executionMode: z.enum(['inherit', 'browser-direct', 'server-proxy']).optional(),
    connection: z
      .object({
        baseUrl: z.string().optional(),
        protocol: z.enum(['responses', 'chat']).optional(),
        headers: z.record(z.string(), z.string()).optional(),
      })
      .strict()
      .optional(),
    credentials: z
      .object({
        apiKey: z.string().optional(),
        accessKeyId: z.string().optional(),
        secretAccessKey: z.string().optional(),
      })
      .strict()
      .optional(),
    account: z
      .object({
        accountId: z.string().optional(),
      })
      .strict()
      .optional(),
    deployment: z
      .object({
        resourceName: z.string().optional(),
        projectId: z.string().optional(),
        location: z.string().optional(),
        region: z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict() satisfies z.ZodType<ProviderConfig>;
