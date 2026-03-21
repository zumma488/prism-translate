import React from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_CONFIGS } from '../constants'
import { AppStatus, ProviderConfig } from '../types'
import ModelSelectorPopover from './ModelSelectorPopover'
import './LanguageTag.css'

interface ModelOption {
    uniqueId: string
    modelName: string
    providerName: string
    provider: ProviderConfig
}

interface LanguageTagProps {
    language: string
    selectedModelIds: string[]
    defaultModelId: string
    availableModels: ModelOption[]
    status: AppStatus
    onRemove: () => void
    onModelChange: (modelIds: string[]) => void
}

const LanguageTag: React.FC<LanguageTagProps> = ({
    language,
    selectedModelIds,
    defaultModelId,
    availableModels,
    status,
    onRemove,
    onModelChange,
}) => {
    const { t } = useTranslation()
    const config = LANGUAGE_CONFIGS[language]
    const hasCustomModel = selectedModelIds.length > 0

    return (
        <div
            className={`language-tag ${hasCustomModel ? 'language-tag--custom-model' : ''}`}
            style={{ backgroundColor: config?.color || '#64748b' }}
        >
            <ModelSelectorPopover
                language={config?.nativeName || language}
                selectedModelIds={selectedModelIds}
                defaultModelId={defaultModelId}
                availableModels={availableModels}
                onSelectionChange={(modelIds) => onModelChange(modelIds)}
                trigger={
                    <button
                        disabled={status === AppStatus.LOADING}
                        className="language-tag__settings-btn"
                        title={t('translation.input.selectModel', { lang: language })}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '16px' }}
                        >
                            {hasCustomModel ? 'settings_suggest' : 'settings'}
                        </span>
                    </button>
                }
            />

            <button
                onClick={onRemove}
                disabled={status === AppStatus.LOADING}
                className="language-tag__remove-btn"
                title={
                    status === AppStatus.LOADING
                        ? t('translation.input.cannotRemoveLanguage')
                        : t('translation.input.removeLanguage', { lang: language })
                }
            >
                <span>{config?.nativeName || language}</span>
                <span
                    className="material-symbols-outlined language-tag__close-icon"
                    style={{ fontSize: '16px' }}
                >
                    close
                </span>
            </button>

            {hasCustomModel && (
                <div className="language-tag__tooltip">
                    <div className="language-tag__tooltip-content">
                        {selectedModelIds.length === 1
                            ? `Using: ${availableModels.find((m) => m.uniqueId === selectedModelIds[0])
                                ?.modelName || 'Unknown'}`
                            : `Using: ${selectedModelIds.length} models`}
                    </div>
                </div>
            )}
        </div>
    )
}

export default LanguageTag
