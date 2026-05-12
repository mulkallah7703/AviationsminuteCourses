import { motion } from 'framer-motion'
import { Check, CircleDot, Compass, Sparkles } from 'lucide-react'

const statusIcon = {
  done: Check,
  active: CircleDot,
  upcoming: CircleDot,
}

const line = {
  done: 'from-emerald-400 to-emerald-500',
  active: 'from-cyan-400 to-indigo-500',
  upcoming: 'from-slate-600 to-slate-700',
}

export function RoadmapTimeline({ milestones, careerSuggestions, futureAiRecs }) {
  return (
    <section
      id="roadmap"
      className="scroll-mt-28 rounded-3xl border border-violet-500/20 bg-gradient-to-b from-slate-900/85 to-slate-950/95 p-6 shadow-[0_0_60px_rgba(139,92,246,0.08)] backdrop-blur-2xl md:p-10"
      aria-labelledby="roadmap-heading"
    >
      <h2 id="roadmap-heading" className="mb-2 flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
        <Compass className="h-8 w-8 text-violet-300" aria-hidden />
        مسار التعلّم الذكي
      </h2>
      <p className="mb-10 max-w-3xl text-slate-400">
        خط زمني تفاعلي للمراحل المكتملة والحالية والقادمة، مع رؤى مهنية ومستقبلية من نموذج التوصية.
      </p>

      <div className="relative">
        <div className="absolute end-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-cyan-500/40 via-violet-500/30 to-transparent" />
        <ol className="relative space-y-8">
          {milestones.map((m, i) => {
            const Icon = statusIcon[m.status] || CircleDot
            const active = m.status === 'active'
            return (
              <motion.li
                key={m.id}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative flex gap-5 pe-2"
              >
                <div
                  className={`relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg ${line[m.status]}`}
                >
                  <Icon className={`h-5 w-5 ${m.status === 'done' ? 'text-white' : 'text-white'}`} />
                  {active ? (
                    <motion.span
                      className="absolute inset-0 rounded-2xl bg-cyan-400/30"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    />
                  ) : null}
                </div>
                <div
                  className={`min-w-0 flex-1 rounded-2xl border p-5 transition ${
                    active
                      ? 'border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_40px_rgba(34,211,238,0.12)]'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-white">{m.title}</h3>
                    <span className="text-xs font-bold text-slate-500">{m.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{m.detail}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    {m.status === 'done' ? 'مكتمل' : m.status === 'active' ? 'المسار الحالي' : 'قادم'}
                  </p>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-violet-200">
            <Sparkles className="h-4 w-4" />
            اقتراحات مسار مهني
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {careerSuggestions.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-violet-400">▹</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-5">
          <h3 className="mb-3 text-sm font-bold text-cyan-200">توقعات الذكاء الاصطناعي</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {futureAiRecs.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-cyan-400">◆</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
