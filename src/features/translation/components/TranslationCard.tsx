import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { LanguageConfig, TranslationTaskView } from '@/types'
import { Icon } from '@/components/ui/icon'
import { getTranslationTaskErrorMessage } from '@/features/translation/services/translationTaskError'
import { getLocalizedToneLabel } from '@/features/translation/services/translationTone'

interface TranslationCardProps {
  taskView: TranslationTaskView
  config: LanguageConfig
  totalLanguages?: number
}

const COLLAPSE_THRESHOLD = 200 // Characters threshold for collapsing

const TranslationCard: React.FC<TranslationCardProps> = ({
  taskView,
  config,
  totalLanguages = 1,
}) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const data = taskView.result
  const text = data?.text || ''
  const code = data?.code || ''
  const errorMessage = getTranslationTaskErrorMessage(taskView, t)
  const localizedTone = data?.tone ? getLocalizedToneLabel(t, data.tone) : ''
  const providerModelLabel =
    taskView.providerName && taskView.modelName
      ? `${taskView.providerName}/${taskView.modelName}`
      : taskView.providerName || taskView.modelName || ''

  const shouldEnableCollapse =
    totalLanguages > 1 && text.length > COLLAPSE_THRESHOLD
  const isCollapsed = shouldEnableCollapse && !isExpanded

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text)
    }
  }

  const handleSpeak = () => {
    if (text && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      const voices = window.speechSynthesis.getVoices()
      const langVoice = voices.find((v) => v.lang.startsWith(code))
      if (langVoice) utterance.voice = langVoice
      utterance.lang = code
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <Card className="group relative flex flex-row overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-200 p-0 gap-0">
      <div
        className="w-1 sm:w-1.5 shrink-0"
        style={{ backgroundColor: config.color }}
      />
      <div className="flex-1 p-3 sm:p-5">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">
              {taskView.language}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex gap-2 items-center flex-wrap">
            {providerModelLabel && (
              <Badge
                variant="outline"
                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
              >
                {t('translation.output.provider.label')}: {providerModelLabel}
              </Badge>
            )}
            {data?.tone && (
              <Badge variant="outline" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
                {t('translation.output.tone.label')}: {localizedTone}
              </Badge>
            )}
            {typeof data?.confidence === 'number' && data.confidence > 0 && (
              <Badge variant="outline" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
                {t('translation.output.confidence.label')}: {data.confidence}%
              </Badge>
            )}
            {taskView.status !== 'success' && (
              <Badge
                variant="outline"
                className={
                  taskView.status === 'error'
                    ? 'border-destructive/20 bg-destructive/10 text-destructive'
                    : taskView.status === 'pending'
                      ? 'border-border/60 bg-muted/40 text-muted-foreground'
                      : 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                }
              >
                {taskView.status === 'pending' && t('translation.output.status.pending')}
                {taskView.status === 'running' && t('translation.output.status.running')}
                {taskView.status === 'retrying' && t('translation.output.status.retrying', { count: taskView.retryCount })}
                {taskView.status === 'error' && t('translation.output.status.failed')}
              </Badge>
            )}
          </div>

          <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={handleCopy}
                  disabled={!text}
                >
                  <Icon name="content_copy" size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('translation.output.copy')}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={handleSpeak}
                  disabled={!text}
                >
                  <Icon name="volume_up" size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('translation.output.listen')}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <Icon name={isVisible ? 'visibility' : 'visibility_off'} size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isVisible ? t('translation.output.hide') : t('translation.output.show')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {taskView.status === 'error' ? (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <Icon name="error" size={20} className="text-destructive shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-destructive">{t('translation.output.error', 'Translation Failed')}</p>
              <p className="text-xs text-destructive/80 mt-1 break-all">{errorMessage}</p>
              {taskView.errorCode && taskView.error ? (
                <p className="text-[11px] text-destructive/70 mt-2 break-all">
                  {taskView.error}
                </p>
              ) : null}
            </div>
          </div>
        ) : taskView.status === 'pending' || taskView.status === 'running' || taskView.status === 'retrying' ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="progress_activity" size={16} className="animate-spin" />
              <span>
                {taskView.status === 'retrying'
                  ? t('translation.output.retryingMessage', { count: taskView.retryCount })
                  : t('translation.output.runningMessage')}
              </span>
            </div>
            {taskView.error && (
              <p className="mt-2 text-xs text-muted-foreground break-all">
                {taskView.error}
              </p>
            )}
          </div>
        ) : (
          <>
            {isVisible ? (
              <>
                <div className="relative">
                  <p
                    className={`text-base leading-relaxed text-foreground whitespace-pre-wrap ${isCollapsed ? 'line-clamp-6' : ''
                      }`}
                  >
                    {text}
                  </p>

                  {isCollapsed && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  )}
                </div>

                {shouldEnableCollapse && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-primary hover:text-primary/80 h-auto p-0 hover:bg-transparent font-medium flex items-center gap-1 transition-colors"
                  >
                    <Icon name={isExpanded ? 'expand_less' : 'expand_more'} size={16} />
                    {isExpanded
                      ? t('translation.output.showLess')
                      : t('translation.output.showMore')}
                  </Button>
                )}
              </>
            ) : (
              <div
                className="h-6 flex items-center gap-1.5 text-muted-foreground/50 text-xs italic select-none cursor-pointer hover:text-muted-foreground transition-colors"
                onClick={() => setIsVisible(true)}
              >
                <Icon name="visibility_off" size={14} />
                <span>{t('translation.output.hidden', 'Translation hidden')}</span>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}

export default TranslationCard
