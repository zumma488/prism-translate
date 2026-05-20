import { ProviderEditorPageClient } from '@/features/settings/components/ProviderEditorPageClient';

export default async function SettingsProviderEditPage({
  params,
}: {
  params: Promise<{ providerId: string }>;
}) {
  const { providerId } = await params;

  return <ProviderEditorPageClient mode="edit" providerId={providerId} />;
}
