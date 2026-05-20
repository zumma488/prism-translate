import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AppStatus, ProviderConfig } from '../types'
import LanguageTag from './LanguageTag'
import TargetLanguageSelector from '@/features/translation/components/TargetLanguageSelector'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'

interface ModelOption {
  uniqueId: string
  modelName: string
  providerName: string
  provider: ProviderConfig
}

interface TranslationInputProps {
  inputText: string
  onInputChange: (text: string) => void
  targetLanguages: string[]
  onLanguagesChange: (languages: string[]) => void
  onTranslate: () => void
  status: AppStatus
  autoFocus?: boolean
  availableModels: ModelOption[]
  languageModels: Record<string, string[]>
  onLanguageModelChange: (lang: string, modelIds: string[]) => void
  defaultModelId: string
}

const TranslationInput: React.FC<TranslationInputProps> = ({
  inputText,
  onInputChange,
  targetLanguages,
  onLanguagesChange,
  onTranslate,
  status,
  autoFocus = true,
  availableModels,
  languageModels,
  onLanguageModelChange,
  defaultModelId,
}) => {
  const { t } = useTranslation()
  const [maxHeight, setMaxHeight] = useState(400)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  // Calculate max height based on viewport
  useEffect(() => {
    const calculateMaxHeight = () => {
      const headerHeight = 73 // Header height with border (py-4 = 32px + border)
      const toolbarHeight = 100 // Approximate toolbar height
      const spacing = 20 // Extra spacing for safety
      const viewportHeight = window.innerHeight
      const isMobile = window.innerWidth < 768 // md breakpoint

      if (isMobile) {
        // On mobile: cap textarea at ~70% of viewport
        const mobileMax = Math.floor(viewportHeight * 0.7) - toolbarHeight
        setMaxHeight(Math.max(200, mobileMax))
      } else {
        const verticalPadding = 48 // 24px top + 24px bottom (p-6)
        const calculatedMaxHeight =
          viewportHeight - headerHeight - verticalPadding - toolbarHeight - spacing
        setMaxHeight(Math.max(200, calculatedMaxHeight)) // Ensure at least 200px
      }
    }

    calculateMaxHeight()
    window.addEventListener('resize', calculateMaxHeight)
    return () => window.removeEventListener('resize', calculateMaxHeight)
  }, [])

  // Focus input on mount
  useEffect(() => {
    if (autoFocus) {
      textAreaRef.current?.focus()
    }
  }, [autoFocus])

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textAreaRef.current
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      // Set height to scrollHeight to fit content, with max height limit
      const newHeight = Math.min(textarea.scrollHeight, maxHeight)
      textarea.style.height = `${newHeight}px`
    }
  }, [inputText, maxHeight])

  const toggleLanguage = (langName: string) => {
    const newLanguages = targetLanguages.includes(langName)
      ? targetLanguages.filter((l) => l !== langName)
      : [...targetLanguages, langName]
    onLanguagesChange(newLanguages)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter to translate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (
        inputText.trim() &&
        targetLanguages.length > 0 &&
        status !== AppStatus.LOADING
      ) {
        onTranslate()
      }
    }
  }

  return (
    <div className="flex w-full flex-col bg-transparent p-3 sm:p-6 md:h-full md:w-1/2 md:overflow-y-auto md:pr-4">
      <div className="flex flex-col rounded-2xl border border-border/70 bg-card/85 shadow-[var(--shadow-soft)] backdrop-blur transition-all duration-200 focus-within:border-ring/70 focus-within:ring-2 focus-within:ring-ring/20">
        <div className="relative">
          <Textarea
            ref={textAreaRef}
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[150px] w-full resize-none overflow-y-auto border-none bg-transparent p-4 text-base leading-relaxed text-foreground shadow-none outline-none placeholder:text-muted-foreground/50 focus-visible:ring-0 sm:p-5 md:p-6 md:text-lg"
            placeholder={t('translation.input.placeholder')}
            maxLength={5000}
            rows={1}
            style={{ maxHeight: `${maxHeight}px` }}
          />
        </div>

        {/* Toolbar - Optimized Layout */}
        <div className="flex flex-col gap-2 rounded-b-2xl border-t border-border/70 bg-muted/45 p-2.5 sm:p-3">
          {/* Row 1: Source + Actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground min-w-0 flex-wrap">
              <Icon name="language" size={16} className="shrink-0" />
              <span className="font-medium shrink-0">
                {t('translation.input.autoDetect')}
              </span>
              <Icon name="arrow_forward" size={16} className="shrink-0" />
              <span className="text-foreground font-medium shrink-0">
                {t('translation.input.languages', {
                  count: targetLanguages.length,
                })}
              </span>
              <span className="hidden sm:inline mx-1.5 text-border">|</span>
              <span className="hidden sm:inline text-xs">
                {t('translation.input.charCount', { count: inputText.length })}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Add Language Dropdown - Hidden when no languages available */}
              <TargetLanguageSelector
                selectedLanguages={targetLanguages}
                status={status}
                onSelectLanguage={toggleLanguage}
              />

              {/* Translate Button */}
              <Button
                onClick={onTranslate}
                disabled={
                  status === AppStatus.LOADING ||
                  !inputText.trim() ||
                  targetLanguages.length === 0
                }
                className="gap-1.5 h-8 px-4"
                title={
                  targetLanguages.length === 0
                    ? t('translation.input.selectLanguageWarning')
                    : t('translation.input.translateHotkey')
                }
              >
                <Icon
                  name={status === AppStatus.LOADING ? 'progress_activity' : 'send'}
                  size={16}
                  className={status === AppStatus.LOADING ? 'animate-spin' : ''}
                />
                <span className="hidden sm:inline">
                  {status === AppStatus.LOADING
                    ? t('translation.input.translating')
                    : t('translation.input.translate')}
                </span>
              </Button>
            </div>
          </div>

          {/* Row 2: Target Languages */}
          <div className="flex items-center flex-wrap gap-1.5">
            {targetLanguages.map((lang) => (
              <LanguageTag
                key={lang}
                language={lang}
                selectedModelIds={languageModels[lang] || []}
                defaultModelId={defaultModelId}
                availableModels={availableModels}
                status={status}
                onRemove={() => toggleLanguage(lang)}
                onModelChange={(modelIds) => onLanguageModelChange(lang, modelIds)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TranslationInput
