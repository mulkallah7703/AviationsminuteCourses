import { motion } from 'framer-motion'
import { Brain, Cpu, Eye, Gauge, Lightbulb, Sparkles, Target, TrendingUp, Zap } from 'lucide-react'
import { CountUp } from './CountUp.jsx'
import { ScoreRing } from './ScoreRing.jsx'

const pri = {
  high: 'border-rose-400/40 bg-rose-500/10 text-rose-100',
  medium: 'border-amber-400/35 bg-amber-500/10 text-amber-100',
  low: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
}

export function AIInsightsDeck({ ai }) {
  const pulse = ai.neuralPulse ?? []

  return (
    <section
      id="insights"
      className="scroll-mt-28 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/80 p-6 shadow-[0_40px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-10"
      aria-labelledby="ai-insights-heading"
    >
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2
            id="ai-insights-heading"
            className="flex items-center gap-2 text-2xl font-bold text-white md:text-3xl"
          >
            <Brain className="h-8 w-8 text-cyan-300" aria-hidden />
            تحليلات الذكاء الاصطناعي للتعلّم
          </h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            نماذج تفاعل وإتقان وتركيز — مُحدَّثة من سلوك التعلّم لديك وجاهزة للربط مع خادم التحليلات.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 md:justify-end">
          {ai.scoreRings.map((r, i) => (
            <ScoreRing key={r.id} ringId={r.id} label={r.label} value={r.value} delay={0.08 * i} />
          ))}
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Sparkles, label: 'أفضل مهارة لديك', value: ai.bestSkill, sub: 'حسب نموذج الأداء', type: 'text' },
          { icon: Zap, label: 'سرعة التعلّم', value: ai.learningSpeed, suffix: '/١٠٠', sub: 'مؤشر تعجيل', type: 'num' },
          { icon: Eye, label: 'مستوى التركيز', value: ai.focusLevel, suffix: '/١٠٠', sub: 'جلسات عميقة', type: 'num' },
          { icon: Gauge, label: 'تقدير الأداء', value: ai.performanceGrade, sub: ai.performanceAnalysis, type: 'grade' },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
          >
            <div className="mb-2 flex items-center gap-2 text-cyan-200/90">
              <m.icon className="h-4 w-4" />
              <span className="text-xs font-bold">{m.label}</span>
            </div>
            {m.type === 'text' ? (
              <p className="text-sm font-bold leading-snug text-white">{m.value}</p>
            ) : m.type === 'grade' ? (
              <p className="text-3xl font-black text-white">{m.value}</p>
            ) : (
              <p className="text-3xl font-black tabular-nums text-white">
                <CountUp value={m.value} />
                <span className="text-lg text-slate-500">{m.suffix}</span>
              </p>
            )}
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {pulse.length ? (
        <div className="mb-8 rounded-2xl border border-cyan-500/15 bg-slate-950/50 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300/90">
            <Cpu className="h-4 w-4" />
            تمثيل نشاط الشبكة العصبية (مزاج التعلّم)
          </div>
          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 md:grid-cols-12">
            {pulse.map((n, i) => (
              <motion.span
                key={i}
                className="aspect-square rounded-md bg-cyan-400"
                style={{ opacity: n.a * 0.95 }}
                animate={{ opacity: [n.a * 0.5, n.a, n.a * 0.55] }}
                transition={{ duration: 2.4 + (i % 5) * 0.12, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6"
        >
          <div className="mb-3 flex items-center gap-2 text-cyan-200">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-bold">مستوى التقدّم هذا الأسبوع</span>
          </div>
          <p className="mb-4 text-4xl font-black tabular-nums text-white">{ai.weeklyProgressPct}٪</p>
          <p className="leading-relaxed text-slate-300">{ai.analysisSummary}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: 0.06 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-2 flex items-center gap-2 text-emerald-300">
              <Target className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">نقاط القوة</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              {ai.strengths.map((s) => (
                <li key={s} className="flex gap-2">
                  <span className="text-emerald-400">▹</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-2 flex items-center gap-2 text-amber-300">
              <Lightbulb className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">مهارات تحتاج تحسين</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              {ai.gaps.map((g) => (
                <li key={g} className="flex gap-2">
                  <span className="text-amber-400">▹</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">توصيات تعلّم ذكية</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {ai.suggestions.map((s, i) => (
            <motion.article
              key={s.title + i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border p-5 transition ${pri[s.priority] || pri.medium}`}
            >
              <p className="font-bold text-white">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed opacity-90">{s.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
