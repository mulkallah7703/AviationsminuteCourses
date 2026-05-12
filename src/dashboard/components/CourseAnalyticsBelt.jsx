import { motion } from 'framer-motion'
import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react'
import { CountUp } from './CountUp.jsx'
import { MiniRing } from './MiniRing.jsx'
import { MiniSparkline } from './MiniSparkline.jsx'

export function CourseAnalyticsBelt({ cards }) {
  return (
    <section
      id="course-analytics"
      className="scroll-mt-28 space-y-4"
      aria-labelledby="course-analytics-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="course-analytics-heading" className="flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
          <BarChart3 className="h-8 w-8 text-cyan-300" aria-hidden />
          تحليلات الدورات والتعلّم
        </h2>
        <p className="max-w-xl text-sm text-slate-400">
          مؤشرات حية مرتبطة بتقدّمك في المسارات والشهادات والوقت التعليمي — جاهزة للمزامنة مع واجهة التحليلات.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => (
          <motion.article
            key={card.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: i * 0.04, duration: 0.45 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute -end-6 -top-6 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl transition group-hover:bg-cyan-400/20" />
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-slate-500">{card.label}</p>
                <p className="mt-1 flex items-baseline gap-1 text-2xl font-black tabular-nums text-white">
                  <CountUp value={card.value} />
                  {card.suffix ? <span className="text-sm font-bold text-slate-500">{card.suffix}</span> : null}
                </p>
              </div>
              <MiniRing value={card.ring} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
              <MiniSparkline data={card.spark} />
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  card.trendPct >= 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
                }`}
              >
                {card.trendPct >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {card.trendPct >= 0 ? '+' : ''}
                {card.trendPct}%
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
