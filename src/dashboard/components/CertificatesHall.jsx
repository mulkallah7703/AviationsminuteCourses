import { motion } from 'framer-motion'
import { Award, Download, ShieldCheck, Sparkles } from 'lucide-react'
import { CountUp } from './CountUp.jsx'

export function CertificatesHall({ certificates }) {
  const { earned, nextCertificate, timeline } = certificates

  return (
    <section
      id="certificates"
      className="scroll-mt-28 space-y-8 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/50 via-slate-950/80 to-slate-900/90 p-6 shadow-[0_40px_100px_rgba(99,102,241,0.12)] backdrop-blur-2xl md:p-10"
      aria-labelledby="cert-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="cert-heading" className="flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
          <Award className="h-8 w-8 text-amber-300" aria-hidden />
          الشهادات والإنجازات
        </h2>
        <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-100">
          تحقق رقمي · LMS Verify
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">شهادات مكتسبة</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {earned.map((c, i) => (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-2xl border border-white/15 p-4 shadow-inner"
                style={{
                  background: `linear-gradient(145deg, hsla(${c.hue},70%,24%,0.9), rgba(15,23,42,0.95))`,
                  boxShadow: '0 0 40px rgba(167,139,250,0.15)',
                }}
              >
                <div className="pointer-events-none absolute -top-10 -end-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <Sparkles className="relative mb-2 h-5 w-5 text-amber-200" />
                <p className="relative font-bold text-white">{c.title}</p>
                <p className="relative mt-1 text-xs text-slate-400">إصدار {c.issuedAt}</p>
                <div className="relative mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                  <span className="truncate font-mono text-[10px] text-cyan-200/90">{c.verifyId}</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] font-bold text-white transition hover:bg-white/20"
                  >
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-violet-500/25 bg-violet-950/30 p-6">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-white">
            <ShieldCheck className="h-5 w-5 text-violet-300" />
            التقدّم نحو الشهادة التالية
          </h3>
          <p className="text-sm font-semibold text-slate-300">{nextCertificate.title}</p>
          <p className="mt-1 text-xs text-slate-500">تقدير الإكمال: خلال {nextCertificate.etaWeeks} أسابيع</p>
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm font-bold text-white">
              <span>نسبة الإكمال</span>
              <span>
                <CountUp value={nextCertificate.progressPct} />٪
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                className="h-full rounded-full bg-gradient-to-l from-amber-400 via-violet-500 to-cyan-400"
                initial={{ width: 0 }}
                whileInView={{ width: `${nextCertificate.progressPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">خط زمني للإنجاز</h3>
        <div className="flex flex-wrap gap-3">
          {timeline.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2"
            >
              <p className="text-xs font-bold text-slate-500">{t.at}</p>
              <p className="text-sm font-semibold text-white">{t.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
