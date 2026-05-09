import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProviderType } from '../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import {
    getProvidersByCategory,
    getAllProviders,
    CATEGORY_TITLES,
    ProviderDefinition
} from '@/config/models';

interface ConnectProviderViewProps {
    onSelectType: (type: ProviderType, providerDef?: ProviderDefinition) => void;
    onCancel: () => void;
}

const ConnectProviderView: React.FC<ConnectProviderViewProps> = ({ onSelectType, onCancel }) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

    const allProviders = getAllProviders();

    const filteredProviders = searchQuery
        ? allProviders.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : null;

    const toggleSection = (category: string) => {
        setCollapsedSections(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const renderProviderButton = (provider: ProviderDefinition, index: number) => (
        <button
            key={`${provider.id}-${provider.name}-${index}`}
            onClick={() => onSelectType(provider.id, provider)}
            className="w-full flex items-center justify-start gap-4 p-3 rounded-xl hover:bg-accent border border-transparent hover:border-border transition-all group text-left cursor-pointer"
        >
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-background group-hover:shadow-sm transition-all border border-border">
                <Icon name={provider.icon} size={20} />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">{provider.name}</span>
                {provider.description && (
                    <span className="text-xs text-muted-foreground">{provider.description}</span>
                )}
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="chevron_right" size={20} className="text-muted-foreground" />
            </div>
        </button>
    );

    const renderSection = (category: ProviderDefinition['category']) => {
        const providers = getProvidersByCategory(category);
        const isCollapsed = collapsedSections[category];

        return (
            <div className="space-y-1">
                <button
                    onClick={() => toggleSection(category)}
                    className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors rounded-lg hover:bg-accent/50 cursor-pointer"
                >
                    <span>{t('settings.categories.' + category)} ({providers.length})</span>
                    <Icon
                        name={isCollapsed ? 'expand_more' : 'expand_less'}
                        size={16}
                        className="transition-transform duration-200"
                    />
                </button>
                {!isCollapsed && providers.map((provider, index) => renderProviderButton(provider, index))}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
                <Button variant="ghost" size="icon" onClick={onCancel}>
                    <Icon name="arrow_back" size={20} />
                </Button>
                <h2 className="text-xl font-bold text-foreground tracking-tight">{t('settings.connectProvider')}</h2>
            </div>

            {/* Search */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 pb-2">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder={t('settings.provider.searchPlaceholder')}
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Icon name="search" size={18} className="absolute left-3 top-2.5 text-muted-foreground" />
                </div>
            </div>

            {/* Quick Access: Custom Endpoint */}
            {!searchQuery && (
                <div className="px-4 sm:px-6 pb-3">
                    <button
                        onClick={() => onSelectType('custom')}
                        className="w-full flex items-center gap-4 p-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent transition-all group text-left cursor-pointer"
                    >
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-all border border-primary/20">
                            <Icon name="add_circle" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground">{t('settings.provider.customProvider')}</span>
                            <span className="text-xs text-muted-foreground">{t('settings.provider.customDescription')}</span>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <Icon name="chevron_right" size={20} className="text-muted-foreground" />
                        </div>
                    </button>
                </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
                {filteredProviders ? (
                    <div className="space-y-1">
                        <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {t('settings.provider.searchResults', { count: filteredProviders.length })}
                        </div>
                        {filteredProviders.length > 0 ? (
                            filteredProviders.map((provider, index) => renderProviderButton(provider, index))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                <Icon name="search_off" size={40} className="mb-2 opacity-50" />
                                <p>{t('settings.provider.noResults')}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {renderSection('popular')}
                        {renderSection('all')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConnectProviderView;
