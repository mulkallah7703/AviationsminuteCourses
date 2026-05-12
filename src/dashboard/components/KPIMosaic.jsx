import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { CountUp } from './CountUp.jsx'

export function KPIMosaic({ kpis }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="مؤشرات الأداء">
      {kpis.map((k, i) => (
        <motion.article
          key={k.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ delay: i * 0.04, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute -end-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-600/10 blur-2xl transition group-hover:from-cyan-400/30" />
          <p className="text-sm font-semibold text-slate-400">{k.label}</p>
          <p className="mt-3 flex items-baseline gap-1 text-4xl font-black tabular-nums text-white">
            <CountUp value={k.value} />
            {k.suffix ? <span className="text-xl font-bold text-slate-500">{k.suffix}</span> : null}
          </p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500">{k.hint}</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                k.trendPct >= 0
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'bg-rose-500/15 text-rose-300'
              }`}
            >
              {k.trendPct >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {k.trendPct >= 0 ? '+' : ''}
              {k.trendPct}٪
            </span>
          </div>
        </motion.article>
      ))}
    </section>
  )
}
