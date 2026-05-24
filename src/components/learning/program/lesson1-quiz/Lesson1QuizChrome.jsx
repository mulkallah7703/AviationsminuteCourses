import { motion } from 'framer-motion'
import { BarChart3, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { SCORABLE_STEPS } from './useLesson1QuizFlow.js'

export function Lesson1QuizProgress({
  scorableIndex,
  answeredCount,
  progressPercent,
  isStepAnswered,
  onSelectQuestion,
  onBackToLesson,
}) {
  return (
      <div className="lesson1-chrome__progress shrink-0 border-b border-amber-500/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-3 py-3 sm:px-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs text-amber-500/90">
                {scorableIndex >= 0 ? (
                  <>
                    السؤال <span className="font-bold text-amber-300">{scorableIndex + 1}</span> من{' '}
                    {SCORABLE_STEPS.length}
                  </>
                ) : (
                  'محاكاة تفاعلية'
                )}
              </p>
              <p className="text-[11px] text-slate-500">
                {answeredCount} مكتمل · {progressPercent}% من المحاكاة
              </p>
            </div>
            {onBackToLesson ? (
              <button
                type="button"
                onClick={onBackToLesson}
                className="text-[11px] text-slate-400 underline-offset-2 hover:text-amber-300 hover:underline"
              >
                العودة للدرس
              </button>
            ) : null}
          </div>

          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-l from-amber-400 via-orange-500 to-amber-600"
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>

          <div className="lesson1-chrome__dots flex gap-1.5 overflow-x-auto pb-1 scrollbar-hidden">
            {SCORABLE_STEPS.map((s, i) => {
              const answered = isStepAnswered(s.id)
              const active = i === scorableIndex
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectQuestion(i)}
                  title={s.title}
                  className={`lesson1-chrome__dot flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/50'
                      : answered
                        ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                        : 'bg-white/5 text-slate-500 ring-1 ring-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-current={active ? 'step' : undefined}
                >
                  {answered && !active ? (
                    <span className="sr-only">مكتمل </span>
                  ) : null}
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>
      </div>
  )
}

export function Lesson1QuizActions({
  onPrev,
  onNext,
  onFinish,
  canGoPrev,
  canGoNext,
  showFinish,
  primaryAction,
}) {
  return (
      <div className="lesson1-chrome__actions shrink-0 border-t border-amber-500/15 bg-slate-950/95 px-3 py-3 backdrop-blur-xl safe-area-pb sm:px-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-2">
          {primaryAction ? <div className="w-full">{primaryAction}</div> : null}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={!canGoPrev}
              className="lesson1-chrome__btn flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-medium text-white transition enabled:hover:bg-white/10 disabled:opacity-35 sm:flex-none sm:px-5"
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </button>

            {showFinish ? (
              <button
                type="button"
                onClick={onFinish}
                className="lesson1-chrome__btn flex flex-[2] items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-600 py-3 text-sm font-bold text-white shadow-lg"
              >
                <BarChart3 className="h-4 w-4" />
                إنهاء المحاكاة
              </button>
            ) : (
              <button
                type="button"
                onClick={onNext}
                disabled={!canGoNext}
                className="lesson1-chrome__btn flex flex-[2] items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-amber-500 to-orange-600 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-900/30 transition enabled:hover:brightness-110 disabled:opacity-40"
              >
                السؤال التالي
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>

          <p className="hidden text-center text-[10px] text-slate-600 sm:block">
            ← السؤال التالي · السابق → · يمكنك التنقل بحرية بين الأسئلة
          </p>
        </div>
      </div>
  )
}

/** @deprecated use Lesson1QuizProgress + Lesson1QuizActions */
export function Lesson1QuizChrome(props) {
  return (
    <>
      <Lesson1QuizProgress {...props} />
      <Lesson1QuizActions {...props} />
    </>
  )
}

export function Lesson1IntroChrome({ onBackToLesson }) {
  return (
    <div className="border-t border-white/10 px-4 py-3 text-center">
      {onBackToLesson ? (
        <button
          type="button"
          onClick={onBackToLesson}
          className="mb-2 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-amber-400"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          العودة للدرس
        </button>
      ) : null}
      <p className="text-xs text-slate-600">استخدم أزرار التنقل بعد بدء المحاكاة</p>
    </div>
  )
}
