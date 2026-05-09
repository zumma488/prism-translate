import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AppSettings } from '../../../types';
import {
  detectConflicts,
  exportConfig,
  importConfig,
  mergeSettings,
  overrideSettings,
} from '../../../services/configIO';

interface ImportConflictState {
  imported: AppSettings;
  conflictNames: string[];
  newCount: number;
}

interface UseSettingsImportExportParams {
  isOpen: boolean;
  settings: AppSettings;
  onApplySettings: (settings: AppSettings) => void;
}

export function useSettingsImportExport({
  isOpen,
  settings,
  onApplySettings,
}: UseSettingsImportExportParams) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importConflict, setImportConflict] = useState<ImportConflictState | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setImportConflict(null);
    setToastMessage(null);
  }, [isOpen]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleExportConfig = async () => {
    try {
      await exportConfig(settings);
      setToastMessage(t('settings.toast.exportSuccess'));
    } catch (error) {
      setToastMessage(
        t('settings.toast.exportFailed', {
          error: error instanceof Error ? error.message : t('errors.unknown'),
        }),
      );
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    event.target.value = '';

    try {
      const result = await importConfig(file);
      const { conflicts, newProviders } = detectConflicts(settings, result.settings);

      if (conflicts.length === 0) {
        const mergedSettings = mergeSettings(settings, result.settings);
        onApplySettings(mergedSettings);
        setToastMessage(t('settings.toast.importSuccess', { count: newProviders.length }));
        return;
      }

      setImportConflict({
        imported: result.settings,
        conflictNames: conflicts.map(
          (conflict) => `${conflict.displayName} (${conflict.providerType})`,
        ),
        newCount: newProviders.length,
      });
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : t('settings.toast.importFailed'));
    }
  };

  const handleImportMerge = () => {
    if (!importConflict) {
      return;
    }

    const mergedSettings = mergeSettings(settings, importConflict.imported);
    onApplySettings(mergedSettings);
    setToastMessage(
      t('settings.toast.mergeSuccess', {
        new: importConflict.newCount,
        merged: importConflict.conflictNames.length,
      }),
    );
    setImportConflict(null);
  };

  const handleImportOverride = () => {
    if (!importConflict) {
      return;
    }

    const overriddenSettings = overrideSettings(settings, importConflict.imported);
    onApplySettings(overriddenSettings);
    setToastMessage(
      t('settings.toast.overrideSuccess', {
        count: importConflict.imported.providers.length,
      }),
    );
    setImportConflict(null);
  };

  const dismissImportConflict = () => {
    setImportConflict(null);
  };

  return {
    dismissImportConflict,
    fileInputRef,
    handleExportConfig,
    handleFileSelected,
    handleImportClick,
    handleImportMerge,
    handleImportOverride,
    importConflict,
    toastMessage,
  };
}
