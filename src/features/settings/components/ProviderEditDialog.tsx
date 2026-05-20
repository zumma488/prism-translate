'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { ProviderConfig, ProviderType, TranslationExecutionMode } from '@/types';
import EditProviderView from '@/components/settings/EditProviderView';

interface ProviderEditDialogProps {
  open: boolean;
  initialConfig: Partial<ProviderConfig> & { providerType: ProviderType };
  globalExecutionMode: TranslationExecutionMode;
  existingIds: string[];
  onOpenChange: (open: boolean) => void;
  onSave: (providerConfig: ProviderConfig) => void;
  onDelete: (providerId: string) => void;
}

export function ProviderEditDialog({
  open,
  initialConfig,
  globalExecutionMode,
  existingIds,
  onOpenChange,
  onSave,
  onDelete,
}: ProviderEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-[100dvh] w-full max-w-none rounded-none border-0 p-0 sm:h-[min(92dvh,880px)] sm:max-w-4xl sm:rounded-2xl sm:border"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Edit provider</DialogTitle>
        <DialogDescription className="sr-only">
          Manage provider connection details and models.
        </DialogDescription>
        <EditProviderView
          initialConfig={initialConfig}
          globalExecutionMode={globalExecutionMode}
          existingIds={existingIds}
          onSave={onSave}
          onDelete={onDelete}
          onBack={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
