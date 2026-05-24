import { ChevronLeft, ChevronRight, Grid3x3, Home, Lock, PlayCircle } from 'lucide-react'
import { getNextLessonButtonLabel, getPreviousLessonButtonLabel } from './programNavLabels'

const btnOutline =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35'
const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-cyan-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-900/25 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40'
const btnGhost =
  'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-slate-200'

/**
 * Shared footer navigation for program lessons & quizzes.
 * Actions stay visible after completion (user control & freedom).
 */
export function ProgramStepNavigation({
  variant = 'lesson',
  moduleId,
  canGoPrevious = false,
  onPrevious,
  onNext,
  nextDisabled = false,
  nextLabel = 'التالي',
  quizDone = false,
  isLastQuiz = false,
  canSubmitQuiz = false,
  onSubmitQuiz,
  onGoToNextLesson,
  onReturnToCourses,
  onReviewCourse,
  onReturnToOverview,
  submitLabel,
}) {
  const nextLessonLabel = getNextLessonButtonLabel(moduleId)
  const prevLessonLabel = getPreviousLessonButtonLabel(moduleId)
  const showPostQuizNav = variant === 'quiz' && quizDone
  const showLessonExtras = variant === 'lesson'

  const resolvedSubmitLabel =
    submitLabel ?? (isLastQuiz ? 'إنهاء البرنامج' : 'إكمال الاختبار والمتابعة')

  return (
    <div className="mt-auto space-y-3 border-t border-white/10 pt-4 sm:pt-6">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        {onReturnToOverview ? (
          <button type="button" onClick={onReturnToOverview} className={btnGhost}>
            <Grid3x3 className="h-3.5 w-3.5" />
            نظرة عامة على الدورة
          </button>
        ) : null}
        {onReturnToCourses ? (
          <button type="button" onClick={onReturnToCourses} className={btnGhost}>
            <Home className="h-3.5 w-3.5" />
            العودة للدورات
          </button>
        ) : null}
        {showLessonExtras && quizDone && prevLessonLabel && onPrevious ? (
          <button type="button" onClick={onPrevious} className={btnGhost}>
            {prevLessonLabel}
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrevious && variant === 'lesson'}
          className={`${btnOutline} w-full sm:w-auto`}
        >
          <ChevronRight className="h-4 w-4" />
          {variant === 'quiz' ? 'العودة للدرس' : 'السابق'}
        </button>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          {showPostQuizNav ? (
            <>
              {isLastQuiz ? (
                <>
                  {onReviewCourse ? (
                    <button type="button" onClick={onReviewCourse} className={btnOutline}>
                      <PlayCircle className="h-4 w-4" />
                      مراجعة الدورة
                    </button>
                  ) : null}
                  {onReturnToCourses ? (
                    <button type="button" onClick={onReturnToCourses} className={btnPrimary}>
                      <Home className="h-4 w-4" />
                      العودة إلى الدورات
                    </button>
                  ) : null}
                  {onGoToNextLesson ? (
                    <button type="button" onClick={onGoToNextLesson} className={btnOutline}>
                      متابعة الوحدة التالية
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  ) : null}
                </>
              ) : (
                <>
                  {onGoToNextLesson && nextLessonLabel ? (
                    <button type="button" onClick={onGoToNextLesson} className={btnPrimary}>
                      {nextLessonLabel}
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  ) : null}
                  {onReturnToCourses ? (
                    <button type="button" onClick={onReturnToCourses} className={btnOutline}>
                      العودة للدورات
                    </button>
                  ) : null}
                </>
              )}
            </>
          ) : variant === 'quiz' && !quizDone && onSubmitQuiz ? (
            <button
              type="button"
              onClick={onSubmitQuiz}
              disabled={!canSubmitQuiz}
              className={`${btnPrimary} w-full sm:w-auto`}
            >
              {!canSubmitQuiz ? <Lock className="h-4 w-4" /> : null}
              {resolvedSubmitLabel}
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : variant === 'lesson' ? (
            <button
              type="button"
              onClick={onNext}
              disabled={nextDisabled}
              className={`${btnPrimary} w-full sm:w-auto`}
            >
              {nextDisabled ? <Lock className="h-4 w-4" /> : null}
              {nextLabel}
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
