'use client';

import { Icon } from '@/components/ui/icon';

interface SettingsToastProps {
  message: string;
}

export function SettingsToast({ message }: SettingsToastProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm text-background shadow-[var(--shadow-soft)]">
      <span className="flex items-center gap-2">
        <Icon name="check_circle" size={16} />
        {message}
      </span>
    </div>
  );
}
