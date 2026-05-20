import { useCallback, useEffect, useState } from 'react';
import type { ProviderDefinition } from '@/config/models';
import type { AppSettings, ProviderType, ProviderConfig } from '@/types';

interface UseSettingsProviderEditingParams {
  isOpen: boolean;
  settings: AppSettings;
  onApplySettings: (settings: AppSettings) => void;
}

export function useSettingsProviderEditing({
  isOpen,
  settings,
  onApplySettings,
}: UseSettingsProviderEditingParams) {
  const [editingProviderId, setEditingProviderId] = useState<string | null>(null);
  const [newProviderType, setNewProviderType] = useState<ProviderType | null>(null);
  const [newProviderDef, setNewProviderDef] = useState<ProviderDefinition | undefined>(undefined);

  const resetProviderEditing = () => {
    setEditingProviderId(null);
    setNewProviderType(null);
    setNewProviderDef(undefined);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    resetProviderEditing();
  }, [isOpen]);

  const startCreatingProvider = useCallback((type: ProviderType, providerDef?: ProviderDefinition) => {
    setNewProviderType(type);
    setNewProviderDef(providerDef);
    setEditingProviderId(null);
  }, []);

  const startEditingProvider = useCallback((id: string) => {
    setEditingProviderId(id);
    setNewProviderType(null);
    setNewProviderDef(undefined);
  }, []);

  const saveProvider = (providerConfig: ProviderConfig) => {
    const providers = [...settings.providers];
    const existingIndex = providers.findIndex((provider) => provider.id === providerConfig.id);

    if (existingIndex >= 0) {
      providers[existingIndex] = providerConfig;
    } else {
      providers.push(providerConfig);
    }

    onApplySettings({ ...settings, providers });
    resetProviderEditing();
  };

  const deleteProvider = (id: string) => {
    const providers = settings.providers.filter((provider) => provider.id !== id);
    onApplySettings({ ...settings, providers });

    if (editingProviderId === id) {
      resetProviderEditing();
    }
  };

  const getInitialEditConfig = (): Partial<ProviderConfig> & { providerType: ProviderType } => {
    if (editingProviderId) {
      const provider = settings.providers.find((item) => item.id === editingProviderId);
      if (provider) {
        return provider;
      }
    }

    const baseConfig = {
      providerType: newProviderType || 'custom',
      models: [],
    };

    if (newProviderDef) {
      return {
        ...baseConfig,
        displayName: newProviderDef.name,
        connection: newProviderDef.baseUrl ? { baseUrl: newProviderDef.baseUrl } : undefined,
        models: newProviderDef.defaultModels ? [...newProviderDef.defaultModels] : [],
      };
    }

    return baseConfig;
  };

  return {
    deleteProvider,
    getInitialEditConfig,
    isEditingExistingProvider: editingProviderId !== null,
    saveProvider,
    startCreatingProvider,
    startEditingProvider,
  };
}
