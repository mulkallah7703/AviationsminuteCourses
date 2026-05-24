import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  GraduationCap,
  Home,
  RefreshCw,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'
import { getRank } from './lesson1QuizScoring'

const KEY_CONCEPTS = [
  'المخاطر الكيميائية',
  'المواد القابلة للاشتعال',
  'المواد السامة',
  'طرق التعرض',
  'المخاطر البيئية',
  'المخاطر الفيزيائية',
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
}

export function Lesson1CompletionTransition({
  safetyScore,
  xp,
  mistakeCount,
  onGoToLesson2,
  onRetryQuiz,
  onReviewLesson,
  onReturnToCourse,
  canRetryQuiz,
  nextLessonTitle,
}) {
  const rank = getRank(safetyScore)

  return (
    <motion.div
      className="relative mx-auto w-full max-w-3xl px-4 py-8 sm:py-12"
      variants={container}
      initial="hidden"
      animate="show"
      dir="rtl"
    >
      <motion.div variants={item} className="mb-8 text-center">
        <motion.div
          className="lesson1-completion__hero-icon mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 ring-2 ring-emerald-400/40"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <GraduationCap className="h-10 w-10 text-emerald-300" />
        </motion.div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          أحسنت! لقد أكملت درس المخاطر الكيميائية
        </h1>
        <p className={`mt-2 text-lg font-semibold ${rank.color}`}>رتبتك: {rank.label}</p>
      </motion.div>

      {/* Section 1 — Summary */}
      <motion.section
        variants={item}
        className="mb-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900/50 to-slate-950/80 p-5 sm:p-6"
      >
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          ملخص إنجازك في الدرس الأول
        </p>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center">
            <p className="text-xs text-slate-400">درجة السلامة</p>
            <p className="mt-1 text-2xl font-bold text-emerald-300">{safetyScore}%</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center">
            <p className="flex items-center justify-center gap-1 text-xs text-slate-400">
              <Zap className="h-3 w-3" /> نقاط الخبرة
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-300">{xp}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center">
            <p className="flex items-center justify-center gap-1 text-xs text-slate-400">
              <Shield className="h-3 w-3" /> أخطاء
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-200">{mistakeCount}</p>
          </div>
        </div>

        <p className="mb-3 text-xs font-medium text-amber-500/90">المفاهيم التي تدرّبت عليها:</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {KEY_CONCEPTS.map((concept, i) => (
            <motion.li
              key={concept}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-sm text-slate-300"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-400/80" />
              {concept}
            </motion.li>
          ))}
        </ul>
      </motion.section>

      {/* Section 2 — Transition to Lesson 2 */}
      <motion.section
        variants={item}
        className="lesson1-completion__next-card relative mb-6 overflow-hidden rounded-2xl border border-cyan-500/25 p-5 sm:p-6"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-indigo-600/5 to-transparent" />
        <motion.div
          className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400/90">
            الخطوة التالية
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            {nextLessonTitle || 'الدرس الثاني — المخاطر الفيزيائية'}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            في الدرس القادم ستتعرف على إجراءات الوقاية والتحكم بالمخاطر وكيفية حماية الأفراد
            والبيئة داخل بيئات العمل الخطرة.
          </p>

          <motion.button
            type="button"
            onClick={onGoToLesson2}
            className="lesson1-completion__cta mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-cyan-500 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-cyan-900/40"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            الانتقال إلى الدرس الثاني
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.section>

      {/* Section 3 — Flexible navigation */}
      <motion.section variants={item} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {canRetryQuiz ? (
          <button
            type="button"
            onClick={onRetryQuiz}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4" />
            إعادة الاختبار
          </button>
        ) : null}
        <button
          type="button"
          onClick={onReviewLesson}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        >
          <BookOpen className="h-4 w-4" />
          مراجعة الدرس
        </button>
        <button
          type="button"
          onClick={onReturnToCourse}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        >
          <Home className="h-4 w-4" />
          العودة للدورة
        </button>
      </motion.section>

      <motion.p variants={item} className="mt-6 text-center text-xs text-slate-500">
        يمكنك المتابعة الآن أو العودة لمراجعة المحتوى — أنت تتحكم بمسار تعلّمك
        <ArrowLeft className="ms-1 inline h-3 w-3 opacity-60" />
      </motion.p>
    </motion.div>
  )
}
