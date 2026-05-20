'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { ProviderType } from '@/types';
import type { ProviderDefinition } from '@/config/models';
import ConnectProviderView from '@/components/settings/ConnectProviderView';

interface ConnectProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: ProviderType, providerDef?: ProviderDefinition) => void;
}

export function ConnectProviderDialog({
  open,
  onOpenChange,
  onSelectType,
}: ConnectProviderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-[100dvh] w-full max-w-none rounded-none border-0 p-0 sm:h-[min(88dvh,780px)] sm:max-w-3xl sm:rounded-2xl sm:border"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Connect provider</DialogTitle>
        <DialogDescription className="sr-only">
          Choose a provider type to start configuration.
        </DialogDescription>
        <ConnectProviderView
          onSelectType={onSelectType}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
