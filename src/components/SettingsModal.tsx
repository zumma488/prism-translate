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
      <DialogContent className="sm:max-w-2xl h-full sm:h-[600px] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-[#1a2632] rounded-none sm:rounded-lg">
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
            existingIds={localSettings.providers.map(p => p.id)}
            onSave={handleSaveProvider}
            onBack={handleBack}
            onDelete={handleDeleteProvider}
          />
        )}

        {/* Import Conflict Confirmation Dialog */}
        {importConflict && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
            <div className="bg-background rounded-xl p-6 mx-4 max-w-md w-full shadow-2xl border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="warning" size={20} className="text-amber-500" />
                <h3 className="text-lg font-semibold text-foreground">{t('settings.import.conflictTitle')}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {t('settings.import.conflictMessage')}
              </p>
              <div className="bg-muted/50 rounded-lg p-3 mb-4 max-h-24 overflow-y-auto">
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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-lg text-sm shadow-lg animate-in fade-in slide-in-from-bottom-2 z-50">
            {toastMessage}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
