export interface TranslationResult {
  language: string;
  code: string;
  text: string;
  tone: string;
  confidence: number;
  taskKey?: string;
  modelName?: string;
  providerName?: string;
  error?: string;
}

export type ProviderType =
  | 'google'
  | 'openai'
  | 'anthropic'
  | 'mistral'
  | 'xai'
  | 'cohere'
  | 'groq'
  | 'deepseek'
  | 'together'
  | 'fireworks'
  | 'deepinfra'
  | 'perplexity'
  | 'cerebras'
  | 'azure'
  | 'vertex'
  | 'bedrock'
  | 'ollama'
  | 'zhipu'
  | 'workers'
  | 'openrouter'
  | 'custom';

export type OpenAIProtocol = 'responses' | 'chat';

export interface ProviderConnection {
  baseUrl?: string;
  protocol?: OpenAIProtocol;
  headers?: Record<string, string>;
}

export interface ProviderCredentials {
  apiKey?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export interface ProviderAccount {
  accountId?: string;
}

export interface ProviderDeployment {
  resourceName?: string;
  projectId?: string;
  location?: string;
  region?: string;
}

export interface ModelDefinition {
  uid?: string;
  id: string;
  name: string;
  enabled?: boolean;
  capabilities?: {
    vision?: boolean;
    audio?: boolean;
    reasoning?: boolean;
    coding?: boolean;
    agentic?: boolean;
    video?: boolean;
  };
}

export interface ProviderConfig {
  id: string;
  providerType: ProviderType;
  displayName: string;
  models: ModelDefinition[];
  executionMode?: ProviderExecutionMode;
  connection?: ProviderConnection;
  credentials?: ProviderCredentials;
  account?: ProviderAccount;
  deployment?: ProviderDeployment;
}

export interface AppSettings {
  providers: ProviderConfig[];
  activeModelKey: string;
  languageModels?: Record<string, string[]>;
  executionMode: TranslationExecutionMode;
}

export type TranslationExecutionMode = 'browser-direct' | 'server-proxy';
export type ProviderExecutionMode = 'inherit' | TranslationExecutionMode;

export type TranslationTaskStatus =
  | 'pending'
  | 'running'
  | 'retrying'
  | 'success'
  | 'error';

export interface TranslationTaskView {
  taskKey: string;
  language: string;
  modelKey: string;
  modelName: string;
  providerName: string;
  status: TranslationTaskStatus;
  retryCount: number;
  result?: TranslationResult;
  errorCode?: 'browser_direct_not_supported' | 'missing_model';
  error?: string;
}

export interface LanguageConfig {
  name: string;
  nativeName?: string;
  code: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export enum AppStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface TranslationRequestPayload {
  text: string;
  targetLanguages: string[];
  languageModels: Record<string, string[]>;
  activeModelKey: string;
  providers: ProviderConfig[];
}

export interface SingleTranslationRequestPayload {
  text: string;
  targetLanguage: string;
  provider: ProviderConfig;
  modelId: string;
  modelName: string;
  providerName: string;
}

export interface FetchProviderModelsPayload {
  provider: ProviderConfig;
}

export interface TranslationStreamEventMap {
  result: TranslationResult;
  error: { message: string };
  done: { count: number };
}

export type TranslationStreamEvent =
  | {
      type: 'result';
      taskKey: string;
      payload: TranslationStreamEventMap['result'];
    }
  | {
      type: 'error';
      taskKey: string;
      payload: TranslationStreamEventMap['error'];
    }
  | {
      type: 'done';
      payload: TranslationStreamEventMap['done'];
    };
