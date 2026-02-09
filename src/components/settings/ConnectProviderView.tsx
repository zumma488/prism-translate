import React, { useState } from 'react';
import { ModelProvider } from '../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    getProvidersByCategory,
    getAllProviders,
    CATEGORY_TITLES,
    ProviderDefinition
} from '@/config/models';

interface ConnectProviderViewProps {
    onSelectType: (type: ModelProvider, providerDef?: ProviderDefinition) => void;
    onCancel: () => void;
}

const ConnectProviderView: React.FC<ConnectProviderViewProps> = ({ onSelectType, onCancel }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const allProviders = getAllProviders();

    const filteredProviders = searchQuery
        ? allProviders.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : null;

    const renderProviderButton = (provider: ProviderDefinition, index: number) => (
        <button
            key={`${provider.id}-${provider.name}-${index}`}
            onClick={() => onSelectType(provider.id, provider)}
            className="w-full flex items-center justify-start gap-4 p-3 rounded-xl hover:bg-accent border border-transparent hover:border-border transition-all group text-left"
        >
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-background group-hover:shadow-sm transition-all border border-border">
                <span className="material-symbols-outlined">{provider.icon}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">{provider.name}</span>
                {provider.description && (
                    <span className="text-xs text-muted-foreground">{provider.description}</span>
                )}
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-muted-foreground">chevron_right</span>
            </div>
        </button>
    );

    const renderSection = (category: ProviderDefinition['category']) => {
        const providers = getProvidersByCategory(category);
        return (
            <div className="space-y-1">
                <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {CATEGORY_TITLES[category]}
                </div>
                {providers.map((provider, index) => renderProviderButton(provider, index))}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                <Button variant="ghost" size="icon" onClick={onCancel}>
                    <span className="material-symbols-outlined">arrow_back</span>
                </Button>
                <h2 className="text-xl font-bold text-foreground tracking-tight">Connect Provider</h2>
            </div>

            {/* Search */}
            <div className="px-6 py-4">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search providers..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-muted-foreground text-[18px]">search</span>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                {filteredProviders ? (
                    <div className="space-y-1">
                        <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Search Results ({filteredProviders.length})
                        </div>
                        {filteredProviders.length > 0 ? (
                            filteredProviders.map((provider, index) => renderProviderButton(provider, index))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No matching providers found
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {renderSection('popular')}
                        {renderSection('native')}
                        {renderSection('community')}
                        {renderSection('compatible')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConnectProviderView;
