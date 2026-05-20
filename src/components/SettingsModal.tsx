import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppSettings, ProviderConfig, ProviderType } from '../types';
import { ProviderDefinition } from '@/config/models';
import ManageModelsView from './settings/ManageModelsView';
import ConnectProviderView from './settings/ConnectProviderView';
import EditProviderView from './settings/EditProviderView';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useBackButton } from '../hooks/useBackButton';
import { useSettingsImportExport } from '@/features/settings/hooks/useSettingsImportExport';
import { useSettingsModalNavigation } from '@/features/settings/hooks/useSettingsModalNavigation';
import { useSettingsProviderEditing } from '@/features/settings/hooks/useSettingsProviderEditing';
import { Icon } from '@/components/ui/icon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentSettings, onSave }) => {
  const { t } = useTranslation();

  // Staging state
  const [localSettings, setLocalSettings] = useState<AppSettings>(currentSettings);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(currentSettings);
    }
  }, [isOpen, currentSettings]);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setLocalSettings(newSettings);
    onSave(newSettings); // Auto-save for toggle changes on Manage view
  };

  const {
    dismissImportConflict,
    fileInputRef,
    handleExportConfig,
    handleFileSelected,
    handleImportClick,
    handleImportMerge,
    handleImportOverride,
    importConflict,
    toastMessage,
  } = useSettingsImportExport({
    isOpen,
    settings: localSettings,
    onApplySettings: handleUpdateSettings,
  });

  const {
    deleteProvider,
    getInitialEditConfig,
    isEditingExistingProvider,
    saveProvider,
    startCreatingProvider,
    startEditingProvider,
  } = useSettingsProviderEditing({
    isOpen,
    settings: localSettings,
    onApplySettings: handleUpdateSettings,
  });

  const {
    goToConnect,
    goToEdit,
    goToManage,
    handleBack,
    view,
  } = useSettingsModalNavigation({
    isEditingExistingProvider,
    isOpen,
    onClose,
  });

  // Intercept mobile back button
  // We use a single hook for the entire modal lifecycle to avoid flickering
  // when switching between views (which would cause unmount/remount of the hook)
  useBackButton(isOpen, handleBack, 'settings-modal');

  if (!isOpen) return null;

  // -- Handlers --

  const handleConnectProvider = () => {
    goToConnect();
  };

  const handleSelectProviderType = (type: ProviderType, providerDef?: ProviderDefinition) => {
    startCreatingProvider(type, providerDef);
    goToEdit();
  };

  const handleEditProvider = (id: string) => {
    startEditingProvider(id);
    goToEdit();
  };

  const handleSaveProvider = (providerConfig: ProviderConfig) => {
    saveProvider(providerConfig);
    goToManage();
  };

  const handleDeleteProvider = (id: string) => {
    if (!confirm(t('settings.confirmDelete'))) return;

    deleteProvider(id);
    goToManage();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex h-full gap-0 overflow-hidden rounded-none p-0 sm:h-[600px] sm:max-w-2xl sm:rounded-2xl">
        <DialogTitle className="sr-only">
          {view === 'manage' && t('settings.manageModels')}
          {view === 'connect' && t('settings.connectProvider')}
          {view === 'edit' && t('settings.editProvider')}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t('settings.description')}
        </DialogDescription>

        {/* Hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".prism,.json"
          className="hidden"
          onChange={handleFileSelected}
        />

        {view === 'manage' && (
          <ManageModelsView
            settings={localSettings}
            onUpdateSettings={handleUpdateSettings}
            onConnectProvider={handleConnectProvider}
            onEditProvider={handleEditProvider}
            onDeleteProvider={handleDeleteProvider}
            onExportConfig={handleExportConfig}
            onImportConfig={handleImportClick}
          />
        )}

        {view === 'connect' && (
          <ConnectProviderView
            onSelectType={handleSelectProviderType}
            onCancel={goToManage}
          />
        )}

        {view === 'edit' && (
          <EditProviderView
            initialConfig={getInitialEditConfig()}
            globalExecutionMode={localSettings.executionMode}
            existingIds={localSettings.providers.map(p => p.id)}
            onSave={handleSaveProvider}
            onBack={handleBack}
            onDelete={handleDeleteProvider}
          />
        )}

        {/* Import Conflict Confirmation Dialog */}
        {importConflict && (
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-foreground/35 backdrop-blur-[2px]">
            <div className="mx-4 w-full max-w-md rounded-2xl border border-border/70 bg-popover/95 p-6 shadow-[var(--shadow-soft)] backdrop-blur">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="warning" size={20} className="text-amber-500" />
                <h3 className="text-lg font-semibold text-foreground">{t('settings.import.conflictTitle')}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {t('settings.import.conflictMessage')}
              </p>
              <div className="mb-4 max-h-24 overflow-y-auto rounded-xl border border-border/60 bg-muted/50 p-3">
                {importConflict.conflictNames.map((name, i) => (
                  <div key={i} className="text-sm font-medium text-foreground">
                    • {name}
                  </div>
                ))}
              </div>
              {importConflict.newCount > 0 && (
                <p className="text-sm text-muted-foreground mb-4">
                  {t('settings.import.newProvidersMessage', { count: importConflict.newCount })}
                </p>
              )}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={dismissImportConflict}>
                  {t('settings.import.cancel')}
                </Button>
                <Button variant="outline" size="sm" onClick={handleImportMerge}>
                  <Icon name="merge" size={16} className="mr-1" />
                  {t('settings.import.merge')}
                </Button>
                <Button variant="default" size="sm" onClick={handleImportOverride}>
                  <Icon name="swap_horiz" size={16} className="mr-1" />
                  {t('settings.import.override')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="animate-in fade-in slide-in-from-bottom-2 absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm text-background shadow-[var(--shadow-soft)]">
            {toastMessage}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
