'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface SettingsShellProps {
  children: React.ReactNode;
}

interface SettingsNavItem {
  href: string;
  label: string;
  icon: string;
  match: 'exact' | 'prefix';
}

export function SettingsShell({ children }: SettingsShellProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const items = useMemo<SettingsNavItem[]>(
    () => [
      {
        href: '/settings/general',
        label: t('settings.nav.general'),
        icon: 'tune',
        match: 'exact',
      },
      {
        href: '/settings/languages',
        label: t('settings.nav.languages'),
        icon: 'language',
        match: 'exact',
      },
      {
        href: '/settings/providers',
        label: t('settings.nav.providers'),
        icon: 'hub',
        match: 'prefix',
      },
      {
        href: '/settings/about',
        label: t('settings.nav.about'),
        icon: 'shield',
        match: 'exact',
      },
    ],
    [t],
  );

  const currentItem =
    items.find((item) =>
      item.match === 'prefix'
        ? pathname.startsWith(item.href)
        : pathname === item.href,
    ) ?? items[0];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1600px] gap-0 lg:px-6">
        <aside className="hidden w-[280px] shrink-0 border-r border-border/70 bg-background/80 px-6 py-8 backdrop-blur lg:flex lg:flex-col">
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <Icon name="arrow_back" size={16} />
              {t('settings.backToWorkspace')}
            </Link>
          </div>

          <nav className="space-y-2">
            {items.map((item) => {
              const isActive =
                item.match === 'prefix'
                  ? pathname.startsWith(item.href)
                  : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center justify-between rounded-2xl border px-4 py-3 transition-all',
                    isActive
                      ? 'border-primary/20 bg-primary text-primary-foreground shadow-[var(--shadow-soft)]'
                      : 'border-transparent bg-transparent text-muted-foreground hover:border-border/70 hover:bg-card/80 hover:text-foreground',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        'flex size-9 items-center justify-center rounded-xl border transition-colors',
                        isActive
                          ? 'border-primary-foreground/15 bg-primary-foreground/10 text-primary-foreground'
                          : 'border-border/70 bg-background/75 text-foreground group-hover:border-primary/25',
                      )}
                    >
                      <Icon name={item.icon} size={18} />
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </span>
                  <Icon name="chevron_right" size={16} className={isActive ? 'text-primary-foreground/60' : 'text-muted-foreground'} />
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-[100dvh] flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <Icon name="arrow_back" size={18} />
                </Link>
              </Button>

              <div className="min-w-0 flex-1 text-center">
                <div className="truncate text-sm font-semibold text-foreground">
                  {currentItem.label}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {t('settings.centerTitle')}
                </div>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Icon name="menu" size={18} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[86vw] max-w-none border-r border-border/70 p-0" showCloseButton={false}>
                  <SheetTitle className="sr-only">{t('settings.centerTitle')}</SheetTitle>
                  <div className="flex h-full flex-col bg-background">
                    <div className="border-b border-border/70 px-5 py-5">
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                        Prism Translate
                      </div>
                      <div className="mt-2 text-2xl font-bold text-foreground">
                        {t('settings.centerTitle')}
                      </div>
                    </div>

                    <nav className="flex-1 space-y-2 px-4 py-4">
                      {items.map((item) => {
                        const isActive =
                          item.match === 'prefix'
                            ? pathname.startsWith(item.href)
                            : pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card/80 text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                          >
                            <Icon name={item.icon} size={18} />
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-[1120px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
