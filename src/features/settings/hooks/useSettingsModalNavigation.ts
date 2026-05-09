import { useEffect, useState } from 'react';

export type SettingsModalView = 'manage' | 'connect' | 'edit';

interface UseSettingsModalNavigationParams {
  isEditingExistingProvider: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function useSettingsModalNavigation({
  isEditingExistingProvider,
  isOpen,
  onClose,
}: UseSettingsModalNavigationParams) {
  const [view, setView] = useState<SettingsModalView>('manage');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setView('manage');
  }, [isOpen]);

  const goToManage = () => {
    setView('manage');
  };

  const goToConnect = () => {
    setView('connect');
  };

  const goToEdit = () => {
    setView('edit');
  };

  const handleBack = () => {
    if (view === 'manage') {
      onClose();
      return false;
    }

    if (view === 'edit') {
      setView(isEditingExistingProvider ? 'manage' : 'connect');
      return true;
    }

    setView('manage');
    return true;
  };

  return {
    goToConnect,
    goToEdit,
    goToManage,
    handleBack,
    view,
  };
}
