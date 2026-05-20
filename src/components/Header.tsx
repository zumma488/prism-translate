import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { ProviderConfig } from '../types'
import LanguageSwitcher from './LanguageSwitcher'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

interface ModelItem {
  provider: ProviderConfig
  modelId: string
  modelName: string
  uniqueId: string
}

interface HeaderProps {
  enabledModels: ModelItem[]
  currentModel?: ModelItem
  activeModelKey: string
  onModelSelect: (uniqueId: string) => void
}

const Header: React.FC<HeaderProps> = ({
  enabledModels,
  currentModel,
  activeModelKey,
  onModelSelect,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)

  const handleModelClick = (uniqueId: string) => {
    onModelSelect(uniqueId)
    setIsModelDropdownOpen(false)
  }

  const handleManageClick = () => {
    router.push('/settings/providers/models')
    setIsModelDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 flex min-h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background/82 px-4 py-2.5 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Icon name="translate" size={18} />
        </div>
        <h1 className="hidden text-lg font-bold tracking-tight text-foreground sm:block">
          {t('header.title')}
        </h1>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5">
          <DropdownMenu
            open={isModelDropdownOpen}
            onOpenChange={setIsModelDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-9 min-w-[148px] justify-between gap-2 border-border/70 bg-card/65 px-3 text-sm font-semibold shadow-none backdrop-blur hover:border-primary/25 hover:bg-card/90 sm:min-w-[180px] sm:px-4"
                title={t('header.changeModel')}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Icon name="neurology" size={18} className="shrink-0 text-primary" />
                  <span className="max-w-[92px] truncate sm:max-w-[132px]">
                    {currentModel
                      ? currentModel.modelName
                      : t('header.selectModel')}
                  </span>
                </div>
                <Icon
                  name={isModelDropdownOpen ? 'expand_less' : 'expand_more'}
                  size={18}
                  className="text-muted-foreground transition-transform duration-200"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end" sideOffset={8}>
              <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
                <span>{t('header.selectModel')}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[300px]">
                {enabledModels.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {t('header.noModels')}
                  </div>
                ) : (
                  <DropdownMenuRadioGroup
                    value={activeModelKey}
                    onValueChange={handleModelClick}
                  >
                    {enabledModels.map((item) => (
                      <DropdownMenuRadioItem
                        key={item.uniqueId}
                        value={item.uniqueId}
                        className="cursor-pointer py-2"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{item.modelName}</span>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {item.provider.displayName}
                          </span>
                        </div>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                )}
              </ScrollArea>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleManageClick}
                className="cursor-pointer text-primary focus:text-primary"
              >
                <Icon name="settings" size={16} className="mr-2" />
                {t('header.manageModels')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon" asChild className="size-9 border-border/60 bg-card/55 text-muted-foreground shadow-none backdrop-blur hover:border-primary/25 hover:bg-card/90 hover:text-foreground">
            <Link href="/settings" title={t('header.settings')}>
              <Icon name="settings" size={18} />
            </Link>
          </Button>
        </div>

        <LanguageSwitcher />


      </div>
    </header>
  )
}

export default Header
