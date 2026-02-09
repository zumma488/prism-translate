import React, { useState, useEffect } from 'react';
import { AppSettings, ProviderConfig, ModelProvider } from '../types';
import ManageModelsView from './settings/ManageModelsView';
import ConnectProviderView from './settings/ConnectProviderView';
import EditProviderView from './settings/EditProviderView';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

type ViewState = 'manage' | 'connect' | 'edit';

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentSettings, onSave }) => {
  const [view, setView] = useState<ViewState>('manage');

  // Staging state
  const [localSettings, setLocalSettings] = useState<AppSettings>(currentSettings);
  const [editingProviderId, setEditingProviderId] = useState<string | null>(null);
  const [newProviderType, setNewProviderType] = useState<ModelProvider | null>(null);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(currentSettings);
      setView('manage');
      setEditingProviderId(null);
      setNewProviderType(null);
    }
  }, [isOpen, currentSettings]);

  if (!isOpen) return null;

  // -- Handlers --

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setLocalSettings(newSettings);
    onSave(newSettings); // Auto-save for toggle changes on Manage view
  };

  const handleConnectProvider = () => {
    setView('connect');
  };

  const handleSelectProviderType = (type: ModelProvider) => {
    setNewProviderType(type);
    setEditingProviderId(null); // It's a new one
    setView('edit');
  };

  const handleEditProvider = (id: string) => {
    setEditingProviderId(id);
    setNewProviderType(null);
    setView('edit');
  };

  const handleSaveProvider = (providerConfig: ProviderConfig) => {
    let newProviders = [...localSettings.providers];
    const existingIndex = newProviders.findIndex(p => p.id === providerConfig.id);

    if (existingIndex >= 0) {
      newProviders[existingIndex] = providerConfig;
    } else {
      newProviders.push(providerConfig);
    }

    const updatedSettings = { ...localSettings, providers: newProviders };
    setLocalSettings(updatedSettings);
    onSave(updatedSettings);
    setView('manage');
  };

  const handleDeleteProvider = (id: string) => {
    if (!confirm("Are you sure you want to remove this provider?")) return;

    const newProviders = localSettings.providers.filter(p => p.id !== id);
    const updatedSettings = { ...localSettings, providers: newProviders };
    setLocalSettings(updatedSettings);
    onSave(updatedSettings);
    setView('manage');
  };

  const handleBack = () => {
    if (view === 'edit') {
      // If we were adding new, go back to connect. If editing, go back to manage.
      if (editingProviderId) {
        setView('manage');
      } else {
        setView('connect');
      }
    } else if (view === 'connect') {
      setView('manage');
    } else {
      onClose(); // Close if back from manage (optional, but UI implies X is close)
    }
  };

  // Get initial config for edit view
  const getInitialEditConfig = () => {
    if (editingProviderId) {
      const found = localSettings.providers.find(p => p.id === editingProviderId);
      if (found) return found;
    }
    // New
    return {
      type: newProviderType || 'custom',
      models: [],
      headers: {}
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl h-[90vh] sm:h-[600px] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-[#1a2632]">
        <DialogTitle className="sr-only">
          {view === 'manage' && 'Manage Models'}
          {view === 'connect' && 'Connect Provider'}
          {view === 'edit' && 'Edit Provider'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Manage your AI provider settings and models
        </DialogDescription>

        {view === 'manage' && (
          <ManageModelsView
            settings={localSettings}
            onUpdateSettings={handleUpdateSettings}
            onConnectProvider={handleConnectProvider}
            onEditProvider={handleEditProvider}
            onDeleteProvider={handleDeleteProvider}
          />
        )}

        {view === 'connect' && (
          <ConnectProviderView
            onSelectType={handleSelectProviderType}
            onCancel={() => setView('manage')}
          />
        )}

        {view === 'edit' && (
          <EditProviderView
            initialConfig={getInitialEditConfig()}
            existingIds={localSettings.providers.map(p => p.id)}
            onSave={handleSaveProvider}
            onBack={handleBack}
            onDelete={handleDeleteProvider}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;