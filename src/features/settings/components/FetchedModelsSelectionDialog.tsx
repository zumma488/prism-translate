import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SelectableFetchedProviderModel } from '@/features/settings/services/providerFetchedModels';

interface FetchedModelsSelectionDialogProps {
  open: boolean;
  models: SelectableFetchedProviderModel[];
  onToggle: (modelId: string) => void;
  onSelectAllNew: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function FetchedModelsSelectionDialog({
  open,
  models,
  onToggle,
  onSelectAllNew,
  onCancel,
  onConfirm,
}: FetchedModelsSelectionDialogProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open]);

  const selectedCount = useMemo(
    () => models.filter((model) => model.selected).length,
    [models],
  );
  const newModelCount = useMemo(
    () => models.filter((model) => !model.isExisting).length,
    [models],
  );
  const filteredModels = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return models;
    }

    return models.filter((model) => {
      const normalizedName = model.name?.toLowerCase() || '';
      return model.id.toLowerCase().includes(query) || normalizedName.includes(query);
    });
  }, [models, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <DialogContent className="max-h-[86dvh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border/70 px-6 py-5">
          <DialogTitle className="text-xl text-foreground">
            {t('settings.form.selectModels')}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
            {t('settings.form.selectModelsDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-6 py-4">
          <p className="text-sm text-muted-foreground">
            {t('settings.form.selectedCount', { count: selectedCount })}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSelectAllNew}
            disabled={newModelCount === 0}
          >
            <Icon name="add_circle_outline" size={16} />
            {t('settings.form.selectAllNew')}
          </Button>
        </div>

        <div className="border-b border-border/70 px-6 py-4">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('settings.form.searchFetchedModels')}
              className="h-10 pl-10"
            />
            <Icon
              name="search"
              size={16}
              className="pointer-events-none absolute left-3 top-3 text-muted-foreground"
            />
          </div>
        </div>

        <ScrollArea className="max-h-[52dvh]">
          <div className="space-y-3 px-6 py-4">
            {filteredModels.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => onToggle(model.id)}
                className="flex w-full items-start gap-3 rounded-xl border border-border/70 bg-background px-4 py-3 text-left transition-colors hover:border-border hover:bg-accent/30"
              >
                <Icon
                  name={model.selected ? 'check_circle' : 'radio_button_unchecked'}
                  size={18}
                  className={model.selected ? 'text-primary' : 'text-muted-foreground'}
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm text-foreground">{model.id}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        model.isExisting
                          ? 'bg-amber-500/12 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {model.isExisting
                        ? t('settings.form.existingFetchedModel')
                        : t('settings.form.newFetchedModel')}
                    </span>
                    {model.isExisting ? (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        {t('settings.form.replaceFetchedModel')}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}

            {filteredModels.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/70 bg-muted/35 px-4 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  {t('settings.form.noFetchedModelsMatchSearch')}
                </p>
              </div>
            ) : null}
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-border/70 px-6 py-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('settings.import.cancel')}
          </Button>
          <Button type="button" onClick={onConfirm} disabled={selectedCount === 0}>
            {t('settings.form.addSelected')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
