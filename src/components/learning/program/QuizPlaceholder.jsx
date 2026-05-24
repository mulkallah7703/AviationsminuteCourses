import { motion } from 'framer-motion'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { ProgramStepNavigation } from './ProgramStepNavigation.jsx'

export function QuizPlaceholder({
  title,
  moduleIndex,
  totalModules,
  alreadyCompleted,
  onPrevious,
  onSubmitQuiz,
  isLastQuiz,
  canSubmit,
  moduleId,
  onGoToNextLesson,
  onReturnToCourses,
  onReviewCourse,
  onReturnToOverview,
}) {
  return (
    <motion.div className="relative flex min-h-full flex-1 flex-col" dir="rtl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div
        className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 md:px-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header className="w-full text-center">
          <p className="text-sm font-medium text-cyan-400/90">اختبار تفاعلي</p>
          <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            الاختبار {moduleIndex + 1} من {totalModules}
          </p>
        </header>

        <motion.div
          className={`w-full flex-1 rounded-3xl border p-10 text-center shadow-2xl backdrop-blur-xl md:p-14 ${
            alreadyCompleted
              ? 'border-emerald-500/25 bg-emerald-500/5'
              : 'border-white/10 bg-white/[0.04]'
          }`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {alreadyCompleted ? (
            <>
              <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-400" />
              <p className="text-xl font-semibold text-emerald-300 md:text-2xl">تم إكمال الاختبار</p>
              <p className="mx-auto mt-4 max-w-md text-sm text-slate-400">
                يمكنك الانتقال للدرس التالي أو مراجعة الدورة في أي وقت.
              </p>
            </>
          ) : (
            <>
              <motion.div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 text-cyan-300 ring-1 ring-cyan-400/20"
                animate={{ rotate: [0, 4, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="h-8 w-8" />
              </motion.div>
              <p className="text-xl font-semibold text-white md:text-2xl">هنا سوف يكون الاختبار</p>
              <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-slate-400 md:text-base">
                سيتم بناء الاختبار بناءً على محتوى الفيديوهات الخاصة بالدورة.
              </p>
              <p className="mx-auto mt-3 text-xs text-amber-400/80">محاولة واحدة فقط — تأكد من جاهزيتك قبل الإرسال</p>
            </>
          )}
        </motion.div>

        <ProgramStepNavigation
          variant="quiz"
          moduleId={moduleId}
          canGoPrevious
          onPrevious={onPrevious}
          quizDone={alreadyCompleted}
          isLastQuiz={isLastQuiz}
          canSubmitQuiz={canSubmit}
          onSubmitQuiz={onSubmitQuiz}
          onGoToNextLesson={onGoToNextLesson}
          onReturnToCourses={onReturnToCourses}
          onReviewCourse={onReviewCourse}
          onReturnToOverview={onReturnToOverview}
        />
      </motion.div>
    </motion.div>
  )
}
