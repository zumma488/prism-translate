import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateId } from '@/lib/utils';
import type {
  FetchProviderModelsPayload,
  ModelDefinition,
  ProviderType,
  ProviderConfig,
} from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EditProviderViewProps {
  initialConfig: Partial<ProviderConfig> & { providerType: ProviderType };
  onSave: (config: ProviderConfig) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  existingIds: string[];
}

interface ProviderDraft {
  id: string;
  providerType: ProviderType;
  name: string;
  apiKey: string;
  baseUrl: string;
  protocol: 'responses' | 'chat';
  models: ModelDefinition[];
  headers: Record<string, string>;
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  resourceName: string;
  projectId: string;
  location: string;
  region: string;
}

function toDraft(initialConfig: Partial<ProviderConfig> & { providerType: ProviderType }): ProviderDraft {
  return {
    id: initialConfig.id || generateId(),
    providerType: initialConfig.providerType,
    name: initialConfig.displayName || '',
    apiKey: initialConfig.credentials?.apiKey || '',
    baseUrl: initialConfig.connection?.baseUrl || '',
    protocol:
      initialConfig.connection?.protocol ||
      (initialConfig.providerType === 'openai' ? 'responses' : 'chat'),
    models: initialConfig.models || [],
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
  onSave,
  onBack,
}) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<ProviderDraft>(() => toDraft(initialConfig));
  const [enableCustomBaseUrl, setEnableCustomBaseUrl] = useState(Boolean(initialConfig.connection?.baseUrl));
  const [newModelId, setNewModelId] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [fetchedModels, setFetchedModels] = useState<ModelDefinition[]>([]);
  const [selectedFetchedModels, setSelectedFetchedModels] = useState<string[]>([]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft(toDraft(initialConfig));
    setEnableCustomBaseUrl(Boolean(initialConfig.connection?.baseUrl));
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

  const handleAddModel = () => {
    if (!newModelId.trim()) {
      return;
    }

    const model: ModelDefinition = {
      id: newModelId,
      name: newModelName || newModelId,
      enabled: true,
    };

    updateDraft({ models: [...draft.models, model] });
    setNewModelId('');
    setNewModelName('');
  };

  const removeModel = (index: number) => {
    updateDraft({ models: draft.models.filter((_, currentIndex) => currentIndex !== index) });
  };

  const buildProviderConfig = (): ProviderConfig => ({
    id: draft.id,
    providerType: draft.providerType,
    displayName: draft.name,
    models: draft.models,
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

  const fetchModels = async () => {
    if (!draft.baseUrl || !draft.apiKey) {
      return;
    }

    setIsFetchingModels(true);
    setFetchError(null);
    setFetchedModels([]);

    try {
      const response = await fetch('/api/providers/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: buildProviderConfig(),
        } satisfies FetchProviderModelsPayload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `HTTP ${response.status}`);
      }

      const data = (await response.json()) as { data?: Array<{ id: string }> };
      if (!Array.isArray(data.data)) {
        throw new Error(t('settings.form.invalidResponse'));
      }

      const models = data.data.map((model) => ({
        id: model.id,
        name: model.id,
        enabled: true,
      }));

      if (models.length === 0) {
        setFetchError(t('settings.form.noModelsFoundFromApi'));
      } else {
        setFetchedModels(models);
      }
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

  const handleOpenModelModal = () => {
    setIsModelModalOpen(true);
    setSelectedFetchedModels([]);
    setFetchedModels([]);
    setFetchError(null);
    void fetchModels();
  };

  const toggleSelectedModel = (modelId: string) => {
    setSelectedFetchedModels((current) =>
      current.includes(modelId)
        ? current.filter((id) => id !== modelId)
        : [...current, modelId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedFetchedModels.length === fetchedModels.length) {
      setSelectedFetchedModels([]);
      return;
    }

    setSelectedFetchedModels(fetchedModels.map((model) => model.id));
  };

  const handleConfirmSelection = () => {
    const modelsToAdd = fetchedModels.filter((model) => selectedFetchedModels.includes(model.id));
    const newModels = modelsToAdd.filter(
      (nextModel) => !draft.models.some((existing) => existing.id === nextModel.id),
    );

    updateDraft({ models: [...draft.models, ...newModels] });
    setIsModelModalOpen(false);
  };

  const handleSave = async () => {
    if (!draft.name.trim()) {
      alert(t('settings.form.nameRequired'));
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
          <div className="flex items-center justify-between">
            <Label>{t('settings.form.models')}</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenModelModal}
              disabled={!draft.baseUrl || !draft.apiKey}
              className="h-8 text-xs text-muted-foreground hover:text-primary"
            >
              <Icon name="download" size={16} className="mr-1" />
              {t('settings.form.fetchModels')}
            </Button>
          </div>

          <div className="bg-muted rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">
                  {t('settings.form.modelId')}
                </Label>
                <Input
                  type="text"
                  value={newModelId}
                  onChange={(event) => setNewModelId(event.target.value)}
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
                  value={newModelName}
                  onChange={(event) => setNewModelName(event.target.value)}
                  placeholder={t('settings.form.displayName')}
                  className="h-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddModel}
                disabled={!newModelId.trim()}
              >
                {t('settings.form.addModel')}
              </Button>
            </div>

            <div className="space-y-1 mt-2">
              {draft.models.map((model, index) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between p-2 bg-background border border-border rounded-lg group"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{model.id}</span>
                    {model.name !== model.id && (
                      <span className="text-xs text-muted-foreground">{model.name}</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeModel(index)}
                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-muted-foreground hover:text-destructive size-7"
                  >
                    <Icon name="close" size={16} />
                  </Button>
                </div>
              ))}
              {draft.models.length === 0 && (
                <div className="text-center py-2 text-xs text-muted-foreground">
                  {t('settings.form.noModelsAdded')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <Button onClick={() => void handleSave()} className="w-full" disabled={isSaving}>
            {isSaving ? t('translation.input.translating') : t('settings.form.updateProvider')}
          </Button>
        </div>
      </div>

      <Dialog open={isModelModalOpen} onOpenChange={setIsModelModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{t('settings.form.selectModels')}</DialogTitle>
            <DialogDescription>
              {t(
                'settings.form.selectModelsDescription',
                'Select models to add to your provider configuration.',
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {isFetchingModels ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Icon name="progress_activity" size={20} className="animate-spin mb-2" />
                <p>{t('settings.form.fetching')}</p>
              </div>
            ) : fetchError ? (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-start gap-3">
                <Icon name="error" size={20} className="mt-0.5" />
                <p className="text-sm">{fetchError}</p>
              </div>
            ) : fetchedModels.length > 0 ? (
              <div className="space-y-1">
                <div
                  className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer border-b border-border mb-2 pb-2"
                  onClick={toggleSelectAll}
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedFetchedModels.length === fetchedModels.length &&
                      fetchedModels.length > 0
                    }
                    onChange={() => undefined}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label className="text-sm font-bold leading-none cursor-pointer flex-1">
                    {t('settings.form.selectAll')}
                  </label>
                </div>
                {fetchedModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                    onClick={() => toggleSelectedModel(model.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFetchedModels.includes(model.id)}
                      onChange={() => undefined}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label className="text-sm font-medium leading-none cursor-pointer flex-1">
                      {model.id}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {t('settings.form.noModelsFoundFromApi')}
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex w-full justify-between items-center sm:justify-end gap-2">
              <div className="text-xs text-muted-foreground sm:hidden">
                {selectedFetchedModels.length > 0 &&
                  t('settings.form.selectedCount', {
                    count: selectedFetchedModels.length,
                  })}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsModelModalOpen(false)}>
                  {t('settings.import.cancel')}
                </Button>
                <Button
                  onClick={handleConfirmSelection}
                  disabled={selectedFetchedModels.length === 0}
                >
                  {t('settings.form.addSelected')} ({selectedFetchedModels.length})
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProviderView;
