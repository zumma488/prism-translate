import React, { useState } from 'react'
import { ProviderConfig } from '../types'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ModelOption {
    uniqueId: string
    modelName: string
    providerName: string
    provider: ProviderConfig
}

interface ModelSelectorPopoverProps {
    language: string
    selectedModelIds: string[] // empty means use default
    defaultModelId: string
    availableModels: ModelOption[]
    onSelectionChange: (modelIds: string[]) => void
    trigger: React.ReactNode
}

const ModelSelectorPopover: React.FC<ModelSelectorPopoverProps> = ({
    language,
    selectedModelIds,
    defaultModelId,
    availableModels,
    onSelectionChange,
    trigger,
}) => {
    const [isOpen, setIsOpen] = useState(false)

    // Group models by provider
    const modelsByProvider = availableModels.reduce((acc, model) => {
        if (!acc[model.providerName]) {
            acc[model.providerName] = []
        }
        acc[model.providerName].push(model)
        return acc
    }, {} as Record<string, ModelOption[]>)

    const sortedProviders = Object.keys(modelsByProvider).sort()

    const hasCustomSelection = selectedModelIds.length > 0

    const handleToggleModel = (modelId: string) => {
        if (selectedModelIds.includes(modelId)) {
            // Remove from selection
            const newIds = selectedModelIds.filter(id => id !== modelId)
            onSelectionChange(newIds)
        } else {
            // Add to selection
            onSelectionChange([...selectedModelIds, modelId])
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <div className="p-2 border-b border-border flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
                                Model for {language}
                                {hasCustomSelection && (
                                    <span className="ml-1 text-primary">
                                        ({selectedModelIds.length})
                                    </span>
                                )}
                            </span>
                            {hasCustomSelection && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 text-[10px] text-primary hover:text-primary/80 hover:bg-transparent"
                                    onClick={() => {
                                        onSelectionChange([])
                                    }}
                                >
                                    Reset to Global
                                </Button>
                            )}
                        </div>
                        <CommandInput
                            placeholder="Search models..."
                            className="h-8 text-xs"
                            wrapperClassName="border rounded-md px-2"
                        />
                    </div>
                    <CommandList className="max-h-[300px]">
                        <CommandEmpty>No models found.</CommandEmpty>
                        {sortedProviders.map((providerName) => (
                            <CommandGroup key={providerName} heading={providerName}>
                                {modelsByProvider[providerName].map((model) => {
                                    const isSelected = selectedModelIds.includes(model.uniqueId)
                                    const isDefault = model.uniqueId === defaultModelId
                                    const isEffectiveDefault = !hasCustomSelection && isDefault

                                    return (
                                        <CommandItem
                                            key={model.uniqueId}
                                            value={`${model.modelName} ${model.providerName}`}
                                            onSelect={() => {
                                                handleToggleModel(model.uniqueId)
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <div
                                                className={cn(
                                                    'mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border',
                                                    isSelected
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : isEffectiveDefault
                                                            ? 'border-primary/50 bg-primary/20 text-primary'
                                                            : 'border-muted-foreground/30 opacity-50'
                                                )}
                                            >
                                                {isSelected && (
                                                    <span
                                                        className="material-symbols-outlined"
                                                        style={{ fontSize: '14px' }}
                                                    >
                                                        check
                                                    </span>
                                                )}
                                                {isEffectiveDefault && !isSelected && (
                                                    <div className="h-2 w-2 rounded-sm bg-current" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span>{model.modelName}</span>
                                                {isDefault && (
                                                    <span className="text-[10px] text-muted-foreground">
                                                        (Global Default)
                                                    </span>
                                                )}
                                            </div>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default ModelSelectorPopover
