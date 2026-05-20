'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SettingsPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function SettingsPageHeader({
  eyebrow,
  title,
  description,
  badge,
  actions,
  className,
}: SettingsPageHeaderProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-border/70 bg-card/85 px-6 py-6 shadow-[var(--shadow-soft)] backdrop-blur sm:px-8 sm:py-8',
        className,
      )}
    >
      <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,_color-mix(in_oklab,var(--primary)_18%,transparent),_transparent_68%)] lg:block" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
              {eyebrow}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {badge ? <Badge variant="soft" className="px-3 py-1">{badge}</Badge> : null}
          </div>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-[15px]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="relative z-10 flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
