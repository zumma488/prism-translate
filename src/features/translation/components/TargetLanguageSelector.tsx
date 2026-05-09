import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_CONFIGS } from '../../../constants'
import { AppStatus } from '../../../types'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
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
} from '@/components/ui/command'

interface TargetLanguageSelectorProps {
  selectedLanguages: string[]
  status: AppStatus
  onSelectLanguage: (language: string) => void
}

const TargetLanguageSelector: React.FC<TargetLanguageSelectorProps> = ({
  selectedLanguages,
  status,
  onSelectLanguage,
}) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const availableLanguages = Object.keys(LANGUAGE_CONFIGS).filter(
    (language) => !selectedLanguages.includes(language)
  )

  if (availableLanguages.length === 0) {
    return null
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={status === AppStatus.LOADING}
          className="gap-1.5 h-8 px-3"
          title={t('translation.input.addLanguage')}
        >
          <Icon name="add" size={16} />
          <span className="hidden sm:inline">{t('translation.input.add')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0" align="end" side="top">
        <Command>
          <CommandInput
            placeholder={t('translation.input.addLanguage') + '...'}
          />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {availableLanguages.map((language) => {
                const config = LANGUAGE_CONFIGS[language]

                return (
                  <CommandItem
                    key={language}
                    value={config?.nativeName || language}
                    onSelect={() => {
                      onSelectLanguage(language)
                      setIsOpen(false)
                    }}
                    className="cursor-pointer"
                  >
                    <span
                      className="size-2.5 rounded-full shrink-0 mr-2"
                      style={{ backgroundColor: config?.color }}
                    />
                    <span className="font-medium text-xs">
                      {config?.nativeName || language}
                    </span>
                    <span className="text-muted-foreground text-[10px] ml-auto">
                      {language}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default TargetLanguageSelector
