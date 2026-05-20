'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';

interface ImportConflictDialogProps {
  open: boolean;
  conflictNames: string[];
  newCount: number;
  onCancel: () => void;
  onMerge: () => void;
  onOverride: () => void;
}

export function ImportConflictDialog({
  open,
  conflictNames,
  newCount,
  onCancel,
  onMerge,
  onOverride,
}: ImportConflictDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <DialogContent className="max-w-lg p-0">
        <div className="space-y-5 p-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl border border-warning/25 bg-warning/10 text-warning">
              <Icon name="warning" size={20} />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl text-foreground">
                {t('settings.import.conflictTitle')}
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-muted-foreground">
                {t('settings.import.conflictMessage')}
              </DialogDescription>
            </div>
          </div>

          <div className="max-h-48 space-y-2 overflow-y-auto rounded-2xl border border-border/70 bg-muted/50 p-4">
            {conflictNames.map((name) => (
              <div key={name} className="text-sm font-medium text-foreground">
                • {name}
              </div>
            ))}
          </div>

          {newCount > 0 ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {t('settings.import.newProvidersMessage', { count: newCount })}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onCancel}>
              {t('settings.import.cancel')}
            </Button>
            <Button variant="outline" onClick={onMerge}>
              {t('settings.import.merge')}
            </Button>
            <Button onClick={onOverride}>{t('settings.import.override')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
