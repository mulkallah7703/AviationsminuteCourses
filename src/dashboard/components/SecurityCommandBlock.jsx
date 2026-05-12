import { motion } from 'framer-motion'
import { Activity, Crosshair, Fingerprint, MailWarning, Radar, ShieldAlert, ShieldCheck, Target } from 'lucide-react'
import { CountUp } from './CountUp.jsx'

const riskStyle = {
  low: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
  medium: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
  elevated: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
}

const riskAr = {
  low: 'منخفض',
  medium: 'متوسط',
  elevated: 'مرتفع',
}

export function SecurityCommandBlock({ security }) {
  const rs = riskStyle[security.riskLevel] || riskStyle.medium

  return (
    <section
      id="cyber"
      className="scroll-mt-28 space-y-6 rounded-3xl border border-cyan-500/15 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-6 shadow-[0_0_80px_rgba(34,211,238,0.06)] backdrop-blur-2xl md:p-8"
      aria-labelledby="cyber-heading"
    >
      <h2 id="cyber-heading" className="flex items-center gap-2 text-xl font-bold text-white md:text-2xl">
        <Radar className="h-7 w-7 text-cyan-300" aria-hidden />
        التوعية الأمنية والتدريب السيبراني
      </h2>

      {security.learning ? (
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: MailWarning,
              label: 'الوعي بالتصيّد',
              value: security.learning.phishingPct,
              suffix: '%',
              sub: 'محاكاة ووحدات',
            },
            {
              icon: Crosshair,
              label: 'تدريب مخاطر الهجوم',
              value: security.learning.attackSimPct,
              suffix: '%',
              sub: 'سيناريوهات تفاعلية',
            },
            {
              icon: Target,
              label: 'جاهزية الأمن',
              value: security.learning.readinessLevel,
              suffix: '/١٠٠',
              sub: 'مؤشر تراكمي',
            },
            {
              icon: ShieldCheck,
              label: 'تدريب المخاطر',
              value: security.learning.riskTrainingScore,
              suffix: '/١٠٠',
              sub: 'أداء الوحدات',
            },
            {
              icon: Activity,
              label: 'التوعية العامة',
              value: security.learning.awarenessPct,
              suffix: '%',
              sub: 'استيعاب المحتوى',
            },
            {
              icon: Radar,
              label: 'الامتثال',
              value: security.learning.compliancePct,
              suffix: '%',
              sub: 'سياسات المنصة',
            },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              className="rounded-2xl border border-cyan-500/15 bg-cyan-950/25 p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-cyan-200/90">
                <c.icon className="h-4 w-4" />
                <span className="text-xs font-bold">{c.label}</span>
              </div>
              <p className="text-2xl font-black tabular-nums text-white">
                <CountUp value={c.value} />
                {c.suffix}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">{c.sub}</p>
            </motion.div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
        >
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <Fingerprint className="h-5 w-5" />
            <span className="text-sm font-bold">محاكاة التصيّد</span>
          </div>
          <p className="text-lg font-bold text-white">{security.phishing.lastSimulation}</p>
          <p className="mt-2 text-xs text-slate-500">الحالة: {security.phishing.status === 'passed' ? 'ممتاز' : 'بانتظار الإكمال'}</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className={`rounded-2xl border p-5 ${rs}`}
        >
          <div className="mb-2 flex items-center gap-2 opacity-90">
            <ShieldAlert className="h-5 w-5" />
            <span className="text-sm font-bold">مؤشر المخاطر</span>
          </div>
          <p className="text-2xl font-black">{riskAr[security.riskLevel] || security.riskLevel}</p>
          <p className="mt-2 text-xs opacity-80">مُحدَّث من نماذج السلوك والوصول</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
        >
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-bold">الوضع الأمني</span>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-4xl font-black text-white">{security.posturePct}</span>
            <span className="pb-1 text-lg text-slate-500">/ ١٠٠</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-cyan-400"
              initial={{ width: 0 }}
              whileInView={{ width: `${security.posturePct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <Activity className="h-4 w-4" />
            تغذية الوعي بالتهديدات
          </h3>
          <span className="text-xs text-slate-500">الامتثال: {security.compliancePct}٪</span>
        </div>
        <ul className="space-y-3">
          {security.feed.map((f, i) => (
            <li
              key={`${f.title}-${i}`}
              className="flex items-start gap-3 rounded-xl border border-white/5 bg-slate-950/40 px-3 py-2.5"
            >
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  f.severity === 'low'
                    ? 'bg-emerald-400'
                    : f.severity === 'medium'
                      ? 'bg-amber-400'
                      : f.severity === 'info'
                        ? 'bg-cyan-400'
                        : 'bg-rose-400'
                }`}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-200">{f.title}</p>
                <p className="text-xs text-slate-500">{f.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
