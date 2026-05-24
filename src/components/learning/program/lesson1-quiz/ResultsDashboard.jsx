import { motion } from 'framer-motion'
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import { categoryInsight, getRank } from './lesson1QuizScoring'

export function ResultsDashboard({
  safetyScore,
  xp,
  mistakeCount,
  avgResponseSec,
  categoryScores,
  onContinue,
  canSubmit,
  isLastQuiz,
  nextLessonLabel,
}) {
  const rank = getRank(safetyScore)
  const insight = categoryInsight(categoryScores)

  const categoryLabels = {
    emergency: 'إجراءات الطوارئ',
    classification: 'تصنيف الرموز',
    health: 'التأثيرات الصحية',
    exposure: 'مسارات التعرض',
    environment: 'الأثر البيئي',
    fire: 'مخاطر الحريق',
    judgment: 'حكم السلامة',
  }

  const categories = Object.entries(categoryScores).filter(([, v]) => v.total > 0)

  return (
    <motion.div
      className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center">
        <motion.div
          className="lesson1-sim__pulse-ring mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/30 to-orange-600/20 ring-2 ring-amber-400/40"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <Sparkles className="h-10 w-10 text-amber-300" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white md:text-3xl">لوحة التحليلات النهائية</h2>
        <p className={`mt-2 text-lg font-semibold ${rank.color}`}>رتبتك: {rank.label}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5">
          <p className="text-xs text-emerald-400/80">درجة السلامة</p>
          <p className="mt-1 text-3xl font-bold text-emerald-300">{safetyScore}%</p>
        </div>
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5">
          <p className="text-xs text-amber-400/80">نقاط الخبرة</p>
          <p className="mt-1 text-3xl font-bold text-amber-300">{xp} XP</p>
        </div>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <p className="flex items-center gap-1 text-xs text-red-400/80">
            <AlertTriangle className="h-3.5 w-3.5" /> أخطاء
          </p>
          <p className="mt-1 text-3xl font-bold text-red-300">{mistakeCount}</p>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
          <p className="flex items-center gap-1 text-xs text-cyan-400/80">
            <Clock className="h-3.5 w-3.5" /> متوسط الاستجابة
          </p>
          <p className="mt-1 text-3xl font-bold text-cyan-300">{avgResponseSec}s</p>
        </div>
      </div>

      {categories.length > 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <BarChart3 className="h-4 w-4 text-amber-400" />
            فهم المخاطر حسب المحور
          </p>
          <ul className="space-y-3">
            {categories.map(([key, v]) => {
              const pct = Math.round((v.correct / v.total) * 100)
              return (
                <li key={key}>
                  <div className="mb-1 flex justify-between text-xs text-slate-400">
                    <span>{categoryLabels[key] || key}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-l from-amber-500 to-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-amber-200">
          <Target className="h-4 w-4" />
          توصية شخصية
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{insight}</p>
      </div>

      {canSubmit ? (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-amber-500 to-orange-600 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-900/40 transition hover:brightness-110"
          >
            <CheckCircle2 className="h-5 w-5" />
            {isLastQuiz ? 'إكمال المحاكاة' : 'إكمال المحاكاة والمتابعة'}
            <TrendingUp className="h-4 w-4" />
          </button>
          {!isLastQuiz && nextLessonLabel ? (
            <p className="mt-3 text-center text-xs text-slate-500">
              بعد الإكمال: {nextLessonLabel}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="pt-2 text-center text-sm text-emerald-400/90">تم حفظ نتيجتك — استخدم أزرار التنقل بالأسفل</p>
      )}
    </motion.div>
  )
}
