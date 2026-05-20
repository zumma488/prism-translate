import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LanguageConfig, TranslationTaskView } from '@/types'
import TranslationCard from './TranslationCard'
import { Icon } from '@/components/ui/icon'
import { getTranslationTaskErrorMessage } from '@/features/translation/services/translationTaskError'
import { getLocalizedToneLabel } from '@/features/translation/services/translationTone'

interface TranslationGroupProps {
    taskViews: TranslationTaskView[]
    config: LanguageConfig
    totalLanguages: number
    expectedCount?: number
}

/**
 * Groups multiple translation results for the same language.
 * - Single result: renders as a normal TranslationCard
 * - Multiple results: renders a vertical list of results
 */
const TranslationGroup: React.FC<TranslationGroupProps> = ({
    taskViews,
    config,
    totalLanguages,
    expectedCount = taskViews.length,
}) => {
    const { t } = useTranslation()

    if (expectedCount === 1 && taskViews.length === 1) {
        return (
            <TranslationCard
                taskView={taskViews[0]}
                config={config}
                totalLanguages={totalLanguages}
            />
        )
    }

    return (
        <Card className="group relative flex flex-row overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-200 p-0 gap-0">
            <div
                className="w-1 sm:w-1.5 shrink-0"
                style={{ backgroundColor: config.color }}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase bg-secondary text-secondary-foreground">
                            {config.code}
                        </span>
                        <span className="font-semibold text-sm text-foreground">
                            {config.name}
                        </span>
                    </div>
                </div>

                {taskViews.map((taskView, idx) => (
                    <React.Fragment key={taskView.taskKey}>
                        {idx > 0 && <Separator className="bg-border/60" />}
                        <div className="relative p-3 sm:p-5 hover:bg-muted/5 transition-colors">
                            <ResultContent taskView={taskView} t={t} totalCount={expectedCount} totalLanguages={totalLanguages} />
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </Card>
    )
}

const COLLAPSE_THRESHOLD = 200

const ResultContent: React.FC<{ taskView: TranslationTaskView, t: any, totalCount: number, totalLanguages: number }> = ({ taskView, t, totalCount, totalLanguages }) => {
    const [isVisible, setIsVisible] = React.useState(true)
    const [isExpanded, setIsExpanded] = React.useState(false)
    const result = taskView.result

    const text = result?.text || ''
    const code = result?.code || ''
    const errorMessage = getTranslationTaskErrorMessage(taskView, t)
    const localizedTone = result?.tone ? getLocalizedToneLabel(t, result.tone) : ''
    const providerModelLabel =
        taskView.providerName && taskView.modelName
            ? `${taskView.providerName}/${taskView.modelName}`
            : taskView.providerName || taskView.modelName || ''
    const shouldEnableCollapse = (totalLanguages > 1 || totalCount > 1) && text.length > COLLAPSE_THRESHOLD
    const isCollapsed = shouldEnableCollapse && !isExpanded
    const showError = taskView.status === 'error'
    const showPendingState = taskView.status === 'pending' || taskView.status === 'running' || taskView.status === 'retrying'

    return (
        <div className="flex flex-col h-full animate-in fade-in-50 duration-200 slide-in-from-left-1">
            {showError ? (
                <div className="mt-2 flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
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
            ) : (
                <div className="relative">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap opacity-80">
                            {providerModelLabel && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/50">
                                    {t('translation.output.provider.label')}: {providerModelLabel}
                                </span>
                            )}
                            {result?.tone && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/50">
                                    {t('translation.output.tone.label')}: {localizedTone}
                                </span>
                            )}
                            {typeof result?.confidence === 'number' && result.confidence > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/5 text-primary border border-primary/20">
                                    {t('translation.output.confidence.label')}: {result.confidence}%
                                </span>
                            )}
                            {taskView.status !== 'success' && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                                    taskView.status === 'error'
                                        ? 'bg-destructive/10 text-destructive border-destructive/20'
                                        : taskView.status === 'pending'
                                          ? 'bg-muted/40 text-muted-foreground border-border/60'
                                          : 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400'
                                }`}>
                                    {taskView.status === 'running' && t('translation.output.status.running')}
                                    {taskView.status === 'retrying' && t('translation.output.status.retrying', { count: taskView.retryCount })}
                                    {taskView.status === 'pending' && t('translation.output.status.pending')}
                                    {taskView.status === 'error' && t('translation.output.status.failed')}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
                            <button
                                className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                                onClick={() => text && navigator.clipboard.writeText(text)}
                                title={t('translation.output.copy')}
                                type="button"
                                disabled={!text}
                            >
                                <Icon name="content_copy" size={16} />
                            </button>
                            <button
                                className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                                onClick={() => {
                                    if (text && 'speechSynthesis' in window) {
                                        const utterance = new SpeechSynthesisUtterance(text)
                                        const voices = window.speechSynthesis.getVoices()
                                        const langVoice = voices.find((v) => v.lang.startsWith(code))
                                        if (langVoice) utterance.voice = langVoice
                                        utterance.lang = code
                                        window.speechSynthesis.speak(utterance)
                                    }
                                }}
                                title={t('translation.output.listen')}
                                type="button"
                                disabled={!text}
                            >
                                <Icon name="volume_up" size={16} />
                            </button>
                            <button
                                className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                                onClick={() => setIsVisible(!isVisible)}
                                title={isVisible ? t('translation.output.hide') : t('translation.output.show')}
                                type="button"
                            >
                                <Icon name={isVisible ? 'visibility' : 'visibility_off'} size={16} />
                            </button>
                        </div>
                    </div>

                    {showPendingState ? (
                        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icon
                                    name="progress_activity"
                                    size={16}
                                    className="animate-spin"
                                />
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
                    ) : isVisible ? (
                        <>
                            <div className="relative">
                                <p className={`text-base leading-relaxed text-foreground whitespace-pre-wrap animate-in fade-in zoom-in-95 duration-200 ${isCollapsed ? 'line-clamp-6' : ''}`}>
                                    {text}
                                </p>
                                {isCollapsed && (
                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                                )}
                            </div>

                            {shouldEnableCollapse && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="mt-2 text-primary hover:text-primary/80 h-auto p-0 bg-transparent font-medium flex items-center gap-1 transition-colors cursor-pointer text-sm"
                                    type="button"
                                >
                                    <Icon name={isExpanded ? 'expand_less' : 'expand_more'} size={16} />
                                    {isExpanded
                                        ? t('translation.output.showLess')
                                        : t('translation.output.showMore')}
                                </button>
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
                </div>
            )}
        </div>
    )
}

export default TranslationGroup
