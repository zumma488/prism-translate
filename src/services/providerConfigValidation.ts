import type { ProviderConfig } from '@/types';

const PROVIDER_KEYS = new Set([
  'id',
  'providerType',
  'displayName',
  'models',
  'connection',
  'credentials',
  'account',
  'deployment',
]);

const CONNECTION_KEYS = new Set(['baseUrl', 'protocol', 'headers']);
const CREDENTIAL_KEYS = new Set(['apiKey', 'accessKeyId', 'secretAccessKey']);
const ACCOUNT_KEYS = new Set(['accountId']);
const DEPLOYMENT_KEYS = new Set(['resourceName', 'projectId', 'location', 'region']);
const MODEL_KEYS = new Set(['id', 'name', 'enabled', 'capabilities']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowedKeys: Set<string>) {
  return Object.keys(value).every((key) => allowedKeys.has(key));
}

function isOptionalString(value: unknown) {
  return value === undefined || typeof value === 'string';
}

function isOptionalBoolean(value: unknown) {
  return value === undefined || typeof value === 'boolean';
}

function isStringRecord(value: unknown) {
  return (
    value === undefined ||
    (isRecord(value) &&
      Object.values(value).every((item) => typeof item === 'string'))
  );
}

function isGroupedObject(value: unknown, allowedKeys: Set<string>) {
  return value === undefined || (isRecord(value) && hasOnlyKeys(value, allowedKeys));
}

function isModelDefinition(value: unknown) {
  if (!isRecord(value) || !hasOnlyKeys(value, MODEL_KEYS)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    isOptionalBoolean(value.enabled) &&
    (value.capabilities === undefined || isRecord(value.capabilities))
  );
}

export function isProviderConfig(value: unknown): value is ProviderConfig {
  if (!isRecord(value) || !hasOnlyKeys(value, PROVIDER_KEYS)) {
    return false;
  }

  if (
    typeof value.id !== 'string' ||
    typeof value.displayName !== 'string' ||
    typeof value.providerType !== 'string' ||
    !Array.isArray(value.models) ||
    !value.models.every(isModelDefinition)
  ) {
    return false;
  }

  if (!isGroupedObject(value.connection, CONNECTION_KEYS)) {
    return false;
  }
  if (!isGroupedObject(value.credentials, CREDENTIAL_KEYS)) {
    return false;
  }
  if (!isGroupedObject(value.account, ACCOUNT_KEYS)) {
    return false;
  }
  if (!isGroupedObject(value.deployment, DEPLOYMENT_KEYS)) {
    return false;
  }

  const connection = value.connection as Record<string, unknown> | undefined;
  const credentials = value.credentials as Record<string, unknown> | undefined;
  const account = value.account as Record<string, unknown> | undefined;
  const deployment = value.deployment as Record<string, unknown> | undefined;

  return (
    isOptionalString(connection?.baseUrl) &&
    (connection?.protocol === undefined ||
      connection.protocol === 'responses' ||
      connection.protocol === 'chat') &&
    isStringRecord(connection?.headers) &&
    isOptionalString(credentials?.apiKey) &&
    isOptionalString(credentials?.accessKeyId) &&
    isOptionalString(credentials?.secretAccessKey) &&
    isOptionalString(account?.accountId) &&
    isOptionalString(deployment?.resourceName) &&
    isOptionalString(deployment?.projectId) &&
    isOptionalString(deployment?.location) &&
    isOptionalString(deployment?.region)
  );
}

export function validateProviders(providers: unknown): providers is ProviderConfig[] {
  return Array.isArray(providers) && providers.every(isProviderConfig);
}

