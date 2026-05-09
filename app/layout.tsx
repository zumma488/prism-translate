import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import './globals.css';
import { AppProviders } from '@/app/providers/AppProviders';
import { LANGUAGE_COOKIE_NAME, normalizeLanguage } from '@/i18n/shared';

export const metadata: Metadata = {
  title: 'Prism Translate',
  description: 'Multi-model AI translation comparison workspace',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLanguage = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;
  const acceptLanguage = headerStore.get('accept-language')?.split(',')[0];
  const initialLanguage = normalizeLanguage(cookieLanguage || acceptLanguage);

  return (
    <html lang={initialLanguage}>
      <body>
        <AppProviders initialLanguage={initialLanguage}>{children}</AppProviders>
      </body>
    </html>
  );
}
