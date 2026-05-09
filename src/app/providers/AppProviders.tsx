'use client';

import '@/i18n';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initI18n } from '@/i18n';

export function AppProviders({
  children,
  initialLanguage = 'en',
}: {
  children: React.ReactNode;
  initialLanguage?: string;
}) {
  initI18n(initialLanguage);

  return <TooltipProvider>{children}</TooltipProvider>;
}
