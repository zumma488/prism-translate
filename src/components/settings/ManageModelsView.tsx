import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppSettings, ProviderConfig } from '../../types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';

interface ManageModelsViewProps {
    settings: AppSettings;
    onUpdateSettings: (settings: AppSettings) => void;
    onEditProvider: (providerId: string) => void;
    onDeleteProvider: (providerId: string) => void;
    onConnectProvider: () => void;
    onExportConfig: () => void;
    onImportConfig: () => void;
}

const ManageModelsView: React.FC<ManageModelsViewProps> = ({
    settings,
    onUpdateSettings,
    onEditProvider,
    onDeleteProvider,
    onConnectProvider,
    onExportConfig,
    onImportConfig
}) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    const toggleModel = (providerId: string, modelUid: string, enabled: boolean) => {
        const newProviders = settings.providers.map(p => {
            if (p.id !== providerId) return p;
            return {
                ...p,
                models: p.models.map(m => {
                    if ((m.uid || m.id) !== modelUid) return m;
                    return { ...m, enabled };
                })
            };
        });
        onUpdateSettings({ ...settings, providers: newProviders });
    };

    const filteredProviders = settings.providers.map(provider => {
        const matchesProvider = provider.displayName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchedModels = provider.models.filter(m =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.id.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (matchesProvider) return provider;

        if (matchedModels.length > 0) {
            return { ...provider, models: matchedModels };
        }

        return null;
    }).filter(Boolean) as ProviderConfig[];

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center justify-between pl-4 sm:pl-6 pr-10 sm:pr-14 py-3 sm:py-4 border-b border-border">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{t('settings.manageModels')}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                        {t('settings.description')}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap gap-2 sm:gap-3">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('settings.searchModels')}
                        className="pl-10"
                    />
                    <Icon name="search" size={18} className="absolute left-3 top-2.5 text-muted-foreground" />
                </div>
                <Button
                    onClick={onConnectProvider}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                >
                    <Icon name="add" size={18} />
                    <span className="hidden sm:inline">{t('settings.connectProvider')}</span>
                </Button>
                <Button
                    onClick={onImportConfig}
                    variant="outline"
                    size="icon"
                    className="shrink-0 size-9"
                    title={t('settings.importConfig')}
                >
                    <Icon name="upload" size={18} />
                </Button>
                <Button
                    onClick={onExportConfig}
                    variant="outline"
                    size="icon"
                    className="shrink-0 size-9"
                    title={t('settings.exportConfig')}
                >
                    <Icon name="download" size={18} />
                </Button>
            </div>

            <div className="px-4 sm:px-6 pb-4">
                <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">
                            {t('settings.executionMode.title')}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t('settings.executionMode.description')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t('settings.executionMode.scopeHint')}
                        </p>
                    </div>

                    <div className="grid gap-3">
                        <button
                            type="button"
                            onClick={() => onUpdateSettings({ ...settings, executionMode: 'browser-direct' })}
                            className={`rounded-lg border p-3 text-left transition-colors ${
                                settings.executionMode === 'browser-direct'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/40'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-sm font-medium text-foreground">
                                        {t('settings.executionMode.browserDirect')}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {t('settings.executionMode.browserDirectHint')}
                                    </p>
                                </div>
                                {settings.executionMode === 'browser-direct' && (
                                    <Icon name="check_circle" size={18} className="text-primary shrink-0" />
                                )}
                            </div>
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                                {t('settings.executionMode.browserDirectRisk')}
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => onUpdateSettings({ ...settings, executionMode: 'server-proxy' })}
                            className={`rounded-lg border p-3 text-left transition-colors ${
                                settings.executionMode === 'server-proxy'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/40'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-sm font-medium text-foreground">
                                        {t('settings.executionMode.serverProxy')}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {t('settings.executionMode.serverProxyHint')}
                                    </p>
                                </div>
                                {settings.executionMode === 'server-proxy' && (
                                    <Icon name="check_circle" size={18} className="text-primary shrink-0" />
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6 space-y-6">
                {filteredProviders.map(provider => (
                    <div key={provider.id} className="group">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-foreground">
                                {provider.displayName}
                            </h3>
                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEditProvider(provider.id)}
                                    className="size-7 hover:bg-muted"
                                    title={t('settings.editProvider')}
                                >
                                    <Icon name="edit" size={18} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDeleteProvider(provider.id)}
                                    className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    title={t('settings.deleteProvider')}
                                >
                                    <Icon name="delete" size={18} />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            {provider.models.map(model => (
                                <div key={model.uid || model.id} className="flex items-center justify-between py-2 pl-2 pr-2 hover:bg-accent rounded-lg group/item">
                                    <span className="text-sm text-foreground">{model.name}</span>
                                    <Switch
                                        checked={model.enabled !== false}
                                        onCheckedChange={(checked) => toggleModel(provider.id, model.uid || model.id, checked)}
                                    />
                                </div>
                            ))}
                            {provider.models.length === 0 && (
                                <div className="text-sm text-muted-foreground italic pl-2">No models configured.</div>
                            )}
                        </div>
                    </div>
                ))}

                {filteredProviders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                        <Icon name="search_off" size={40} className="mb-2 opacity-50" />
                        <p>{searchQuery ? t('settings.noModelsFound') : t('settings.noModels')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageModelsView;
