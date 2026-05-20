import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateId } from '@/lib/utils';
import {
  createModelUid,
  normalizeModelDefinitions,
} from '@/services/modelIdentity';
import {
  DEFAULT_PROVIDER_EXECUTION_MODE,
  resolveProviderExecutionMode,
} from '@/services/executionMode';
import { fetchProviderModelsForExecutionMode } from '@/features/settings/services/fetchProviderModels';
import { FetchedModelsSelectionDialog } from '@/features/settings/components/FetchedModelsSelectionDialog';
import {
  buildSelectableFetchedModels,
  mergeSelectedFetchedModels,
  selectAllNewFetchedModels,
  toggleSelectableFetchedModel,
  type SelectableFetchedProviderModel,
} from '@/features/settings/services/providerFetchedModels';
import type {
  ModelDefinition,
  ProviderExecutionMode,
  ProviderType,
  ProviderConfig,
  TranslationExecutionMode,
} from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@/components/ui/icon';

interface EditProviderViewProps {
  initialConfig: Partial<ProviderConfig> & { providerType: ProviderType };
  globalExecutionMode: TranslationExecutionMode;
  onSave: (config: ProviderConfig) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  existingIds: string[];
}

interface ProviderModelDraft extends ModelDefinition {
  uid: string;
}

interface ProviderDraft {
  id: string;
  providerType: ProviderType;
  name: string;
  executionMode: ProviderExecutionMode;
  apiKey: string;
  baseUrl: string;
  protocol: 'responses' | 'chat';
  models: ProviderModelDraft[];
  headers: Record<string, string>;
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  resourceName: string;
  projectId: string;
  location: string;
  region: string;
}

function toDraftModels(models: ModelDefinition[]) {
  return normalizeModelDefinitions(models).map((model) => ({
    ...model,
    uid: model.uid || createModelUid(),
  }));
}

function toDraft(initialConfig: Partial<ProviderConfig> & { providerType: ProviderType }): ProviderDraft {
  return {
    id: initialConfig.id || generateId(),
    providerType: initialConfig.providerType,
    name: initialConfig.displayName || '',
    executionMode: initialConfig.executionMode || DEFAULT_PROVIDER_EXECUTION_MODE,
    apiKey: initialConfig.credentials?.apiKey || '',
    baseUrl: initialConfig.connection?.baseUrl || '',
    protocol:
      initialConfig.connection?.protocol ||
      (initialConfig.providerType === 'openai' ? 'responses' : 'chat'),
    models: toDraftModels(initialConfig.models || []),
    headers: initialConfig.connection?.headers || {},
    accountId: initialConfig.account?.accountId || '',
    accessKeyId: initialConfig.credentials?.accessKeyId || '',
    secretAccessKey: initialConfig.credentials?.secretAccessKey || '',
    resourceName: initialConfig.deployment?.resourceName || '',
    projectId: initialConfig.deployment?.projectId || '',
    location: initialConfig.deployment?.location || '',
    region: initialConfig.deployment?.region || '',
  };
}

const EditProviderView: React.FC<EditProviderViewProps> = ({
  initialConfig,
  globalExecutionMode,
  onSave,
  onBack,
}) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<ProviderDraft>(() => toDraft(initialConfig));
  const [enableCustomBaseUrl, setEnableCustomBaseUrl] = useState(Boolean(initialConfig.connection?.baseUrl));
  const [modelRowErrors, setModelRowErrors] = useState<Record<string, string>>({});
  const [modelsValidationMessage, setModelsValidationMessage] = useState<string | null>(null);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchedModelsSelection, setFetchedModelsSelection] = useState<
    SelectableFetchedProviderModel[]
  >([]);
  const [isFetchedModelsDialogOpen, setIsFetchedModelsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft(toDraft(initialConfig));
    setEnableCustomBaseUrl(Boolean(initialConfig.connection?.baseUrl));
    setModelRowErrors({});
    setModelsValidationMessage(null);
    setFetchError(null);
    setFetchedModelsSelection([]);
    setIsFetchedModelsDialogOpen(false);
  }, [initialConfig]);

  useEffect(() => {
    if (!draft.name) {
      if (draft.providerType === 'google') {
        setDraft((current) => ({ ...current, name: 'Google Gemini' }));
      }
      if (draft.providerType === 'openai') {
        setDraft((current) => ({ ...current, name: 'OpenAI' }));
      }
      if (draft.providerType === 'custom') {
        setDraft((current) => ({ ...current, name: t('settings.provider.customProvider') }));
      }
    }
    if (!draft.baseUrl && draft.providerType === 'openai') {
      setDraft((current) => ({ ...current, baseUrl: 'https://api.openai.com/v1' }));
    }
  }, [draft.name, draft.baseUrl, draft.providerType, t]);

  const updateDraft = (patch: Partial<ProviderDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const clearModelValidation = (uid?: string) => {
    if (uid) {
      setModelRowErrors((current) => {
        if (!(uid in current)) {
          return current;
        }

        const next = { ...current };
        delete next[uid];
        return next;
      });
    } else {
      setModelRowErrors({});
    }

    setModelsValidationMessage(null);
  };

  const addModelRow = () => {
    clearModelValidation();
    updateDraft({
      models: [
        ...draft.models,
        {
          uid: createModelUid(),
          id: '',
          name: '',
          enabled: true,
        },
      ],
    });
  };

  const updateModelRow = (uid: string, patch: Partial<ProviderModelDraft>) => {
    clearModelValidation(uid);
    updateDraft({
      models: draft.models.map((model) =>
        model.uid === uid ? { ...model, ...patch } : model,
      ),
    });
  };

  const removeModelRow = (uid: string) => {
    clearModelValidation(uid);
    updateDraft({ models: draft.models.filter((model) => model.uid !== uid) });
  };

  const buildProviderConfig = (): ProviderConfig => ({
    id: draft.id,
    providerType: draft.providerType,
    displayName: draft.name,
    executionMode: draft.executionMode,
    models: draft.models.map((model) => {
      const modelId = model.id.trim();
      const modelName = model.name.trim();

      return {
        uid: model.uid,
        id: modelId,
        name: modelName || modelId,
        enabled: model.enabled,
        capabilities: model.capabilities,
      };
    }),
    connection: {
      baseUrl: draft.baseUrl || undefined,
      protocol: draft.protocol,
      headers: draft.headers,
    },
    credentials: {
      apiKey: draft.apiKey || undefined,
      accessKeyId: draft.accessKeyId || undefined,
      secretAccessKey: draft.secretAccessKey || undefined,
    },
    account: {
      accountId: draft.accountId || undefined,
    },
    deployment: {
      resourceName: draft.resourceName || undefined,
      projectId: draft.projectId || undefined,
      location: draft.location || undefined,
      region: draft.region || undefined,
    },
  });

  const buildFetchProviderConfig = (): ProviderConfig => ({
    ...buildProviderConfig(),
    models: draft.models
      .filter((model) => model.id.trim())
      .map((model) => ({
        uid: model.uid,
        id: model.id.trim(),
        name: model.name.trim() || model.id.trim(),
        enabled: model.enabled,
        capabilities: model.capabilities,
      })),
  });

  const validateModelRows = () => {
    const nextErrors: Record<string, string> = {};

    draft.models.forEach((model) => {
      const modelId = model.id.trim();
      const modelName = model.name.trim();

      if (!modelId && !modelName) {
        nextErrors[model.uid] = t('settings.form.modelRowEmpty');
        return;
      }

      if (!modelId) {
        nextErrors[model.uid] = t('settings.form.modelIdRequired');
      }
    });

    setModelRowErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setModelsValidationMessage(t('settings.form.fixModelRows'));
      return false;
    }

    setModelsValidationMessage(null);
    return true;
  };

  const fetchModels = async () => {
    if (!draft.baseUrl || !draft.apiKey) {
      return;
    }

    setIsFetchingModels(true);
    setFetchError(null);

    try {
      const data = await fetchProviderModelsForExecutionMode(
        buildFetchProviderConfig(),
        globalExecutionMode,
      );
      if (!Array.isArray(data.data)) {
        throw new Error(t('settings.form.invalidResponse'));
      }

      const models = buildSelectableFetchedModels(data.data, draft.models);

      if (models.length === 0) {
        setFetchError(t('settings.form.noModelsFoundFromApi'));
        return;
      }

      setFetchedModelsSelection(models);
      setIsFetchedModelsDialogOpen(true);
    } catch (error) {
      setFetchError(
        t('settings.form.fetchError', {
          error: error instanceof Error ? error.message : String(error),
        }),
      );
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleToggleFetchedModel = (modelId: string) => {
    setFetchedModelsSelection((current) => toggleSelectableFetchedModel(current, modelId));
  };

  const handleSelectAllNewFetchedModels = () => {
    setFetchedModelsSelection((current) => selectAllNewFetchedModels(current));
  };

  const handleCancelFetchedModelsDialog = () => {
    setIsFetchedModelsDialogOpen(false);
    setFetchedModelsSelection([]);
  };

  const handleConfirmFetchedModelsDialog = () => {
    clearModelValidation();
    setDraft((current) => ({
      ...current,
      models: mergeSelectedFetchedModels(current.models, fetchedModelsSelection),
    }));
    setIsFetchedModelsDialogOpen(false);
    setFetchedModelsSelection([]);
  };

  const effectiveExecutionMode = resolveProviderExecutionMode(
    { executionMode: draft.executionMode },
    globalExecutionMode,
  );

  const handleSave = async () => {
    if (!draft.name.trim()) {
      alert(t('settings.form.nameRequired'));
      return;
    }

    if (!validateModelRows()) {
      return;
    }

    setIsSaving(true);
    try {
      onSave(buildProviderConfig());
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <FetchedModelsSelectionDialog
        open={isFetchedModelsDialogOpen}
        models={fetchedModelsSelection}
        onToggle={handleToggleFetchedModel}
        onSelectAllNew={handleSelectAllNewFetchedModels}
        onCancel={handleCancelFetchedModelsDialog}
        onConfirm={handleConfirmFetchedModelsDialog}
      />

      <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <Icon name="arrow_back" size={20} />
        </Button>
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          {draft.providerType === 'custom'
            ? t('settings.provider.customProvider')
            : draft.providerType === 'google'
              ? 'Google Gemini'
              : draft.providerType === 'workers'
                ? 'Cloudflare Workers AI'
                : draft.providerType === 'openai'
                  ? 'OpenAI'
                  : draft.name || draft.providerType}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6">
        <p className="text-sm text-muted-foreground">
          {t('settings.form.configureProviderHint')}
        </p>

        <div className="space-y-2">
          <Label htmlFor="displayName">{t('settings.form.displayName')}</Label>
          <Input
            id="displayName"
            type="text"
            value={draft.name}
            onChange={(event) => updateDraft({ name: event.target.value })}
            placeholder={t('settings.form.displayNamePlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="providerExecutionMode">{t('settings.form.executionMode')}</Label>
          <select
            id="providerExecutionMode"
            value={draft.executionMode}
            onChange={(event) =>
              updateDraft({ executionMode: event.target.value as ProviderExecutionMode })
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="inherit">{t('settings.form.executionModeInherit')}</option>
            <option value="browser-direct">{t('settings.form.executionModeBrowserDirect')}</option>
            <option value="server-proxy">{t('settings.form.executionModeServerProxy')}</option>
          </select>
          <p className="text-xs text-muted-foreground">{t('settings.form.executionModeHint')}</p>
          <p className="text-xs text-muted-foreground">
            {t('settings.form.executionModeResolved', {
              mode:
                effectiveExecutionMode === 'browser-direct'
                  ? t('settings.executionMode.browserDirect')
                  : t('settings.executionMode.serverProxy'),
            })}
          </p>
        </div>

        {draft.providerType !== 'openai' &&
          draft.providerType !== 'custom' &&
          draft.providerType !== 'ollama' &&
          draft.providerType !== 'workers' && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('settings.form.enableCustomBaseUrl', '自定义 Base URL')}</Label>
                <p className="text-xs text-muted-foreground">
                  {t('settings.form.customBaseUrlHint', '覆盖默认的 API 请求地址（如使用反向代理）')}
                </p>
              </div>
              <Switch
                checked={enableCustomBaseUrl}
                onCheckedChange={(checked) => {
                  setEnableCustomBaseUrl(checked);
                  if (!checked) {
                    updateDraft({ baseUrl: '' });
                  }
                }}
              />
            </div>
          )}

        {(draft.providerType === 'openai' ||
          draft.providerType === 'custom' ||
          draft.providerType === 'ollama' ||
          draft.providerType === 'workers' ||
          enableCustomBaseUrl) && (
          <div className="space-y-2">
            <Label htmlFor="baseUrl">{t('settings.form.baseUrl')}</Label>
            <Input
              id="baseUrl"
              type="text"
              value={draft.baseUrl}
              onChange={(event) => updateDraft({ baseUrl: event.target.value })}
              placeholder={t('settings.form.baseUrlPlaceholder')}
              className="font-mono"
            />
          </div>
        )}

        {draft.providerType === 'workers' && (
          <div className="space-y-2">
            <Label htmlFor="accountId">Account ID</Label>
            <Input
              id="accountId"
              type="text"
              value={draft.accountId}
              onChange={(event) => updateDraft({ accountId: event.target.value })}
              placeholder="Cloudflare account ID"
              className="font-mono"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="apiKey">{t('settings.form.apiKey')}</Label>
          <Input
            id="apiKey"
            type="password"
            value={draft.apiKey}
            onChange={(event) => updateDraft({ apiKey: event.target.value })}
            placeholder={t('settings.form.apiKeyPlaceholder')}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">{t('settings.form.apiKeyHint')}</p>
        </div>

        {draft.providerType === 'bedrock' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="accessKeyId">Access Key ID</Label>
              <Input
                id="accessKeyId"
                type="text"
                value={draft.accessKeyId}
                onChange={(event) => updateDraft({ accessKeyId: event.target.value })}
                placeholder="AWS access key ID"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secretAccessKey">Secret Access Key</Label>
              <Input
                id="secretAccessKey"
                type="password"
                value={draft.secretAccessKey}
                onChange={(event) => updateDraft({ secretAccessKey: event.target.value })}
                placeholder="AWS secret access key"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                type="text"
                value={draft.region}
                onChange={(event) => updateDraft({ region: event.target.value })}
                placeholder="us-east-1"
                className="font-mono"
              />
            </div>
          </>
        )}

        {(draft.providerType === 'openai' || draft.providerType === 'custom') && (
          <div className="space-y-2">
            <Label htmlFor="protocol">{t('settings.form.protocol')}</Label>
            <select
              id="protocol"
              value={draft.protocol}
              onChange={(event) =>
                updateDraft({ protocol: event.target.value as 'responses' | 'chat' })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="responses">{t('settings.form.protocolResponses')}</option>
              <option value="chat">{t('settings.form.protocolChat')}</option>
            </select>
            <p className="text-xs text-muted-foreground">
              {draft.providerType === 'openai'
                ? t('settings.form.protocolHintOpenAI')
                : t('settings.form.protocolHintCompatible')}
            </p>
          </div>
        )}

        <Separator />

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-foreground">
                {t('settings.form.models')}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t('settings.form.modelActionsHint', {
                  defaultValue: 'Add models manually or pull them in from the provider endpoint.',
                })}
              </p>
            </div>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={addModelRow}
                className="h-8 flex-1 sm:flex-none rounded-md px-2.5 text-xs"
              >
                <Icon name="add" size={16} />
                {t('settings.form.addModel')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void fetchModels()}
                disabled={!draft.baseUrl || !draft.apiKey || isFetchingModels}
                className="h-8 flex-1 sm:flex-none rounded-md px-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Icon
                  name={isFetchingModels ? 'progress_activity' : 'download'}
                  size={16}
                  className={isFetchingModels ? 'animate-spin' : ''}
                />
                {t('settings.form.fetchModels')}
              </Button>
            </div>
          </div>

          <div className="bg-muted rounded-xl p-4 space-y-3">
            {fetchError ? (
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg flex items-start gap-3">
                <Icon name="error" size={18} className="mt-0.5 shrink-0" />
                <p className="text-sm">{fetchError}</p>
              </div>
            ) : null}

            {modelsValidationMessage ? (
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                {modelsValidationMessage}
              </div>
            ) : null}

            <div className="space-y-3">
              {draft.models.map((model) => (
                <div
                  key={model.uid}
                  className="rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        {t('settings.form.modelId')}
                      </Label>
                      <Input
                        type="text"
                        value={model.id}
                        onChange={(event) => updateModelRow(model.uid, { id: event.target.value })}
                        placeholder={t('settings.form.modelIdPlaceholder')}
                        className="font-mono h-9"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        {t('settings.form.displayName')}
                      </Label>
                      <Input
                        type="text"
                        value={model.name}
                        onChange={(event) => updateModelRow(model.uid, { name: event.target.value })}
                        placeholder={t('settings.form.displayName')}
                        className="h-9"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeModelRow(model.uid)}
                      className="self-end size-9 text-muted-foreground hover:text-destructive"
                      title={t('settings.form.removeModel')}
                    >
                      <Icon name="close" size={16} />
                    </Button>
                  </div>
                  {modelRowErrors[model.uid] ? (
                    <p className="mt-2 text-xs text-destructive">
                      {modelRowErrors[model.uid]}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            {draft.models.length === 0 && (
              <div className="text-center py-2 text-xs text-muted-foreground">
                {t('settings.form.noModelsAdded')}
              </div>
            )}
          </div>
        </div>

        <div className="pt-6">
          <Button onClick={() => void handleSave()} className="w-full" disabled={isSaving}>
            {isSaving ? t('translation.input.translating') : t('settings.form.updateProvider')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProviderView;
