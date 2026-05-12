import { motion } from 'framer-motion'
import { Cpu, Sparkles } from 'lucide-react'

const float = {
  animate: {
    y: [0, -18, 0],
    opacity: [0.35, 0.65, 0.35],
  },
  transition: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
}

export function HeroSection({ hero, meta }) {
  return (
    <section
      className="relative isolate overflow-hidden border-b border-white/5 bg-gradient-to-bl from-slate-950 via-slate-900 to-indigo-950 px-4 pb-16 pt-10 md:px-10 md:pb-24 md:pt-14"
      aria-labelledby="dash-hero-title"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -start-[20%] -top-[30%] h-[70vmin] w-[70vmin] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute -end-[10%] top-[10%] h-[55vmin] w-[55vmin] rounded-full bg-indigo-600/25 blur-[100px]" />
        <div className="absolute bottom-0 start-1/3 h-40 w-40 rounded-full bg-sky-400/15 blur-3xl" />
        {[...Array(18)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-cyan-200/40 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
            style={{
              insetInlineStart: `${(i * 17 + 7) % 92}%`,
              top: `${(i * 23 + 11) % 88}%`,
            }}
            {...float}
            transition={{ ...float.transition, delay: i * 0.12 }}
          />
        ))}
        <motion.div
          className="absolute inset-x-[-30%] bottom-0 h-48 rounded-[100%] bg-gradient-to-t from-cyan-500/20 via-indigo-500/10 to-transparent blur-3xl"
          animate={{ scaleX: [1, 1.12, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/90 to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 self-start rounded-full border border-cyan-400/25 bg-white/5 px-4 py-1.5 text-sm text-cyan-100/90 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4 text-cyan-300" aria-hidden />
          <span className="font-medium">محرك تحليلات ذكي · جاهز للتشغيل</span>
        </motion.div>

        <motion.h1
          id="dash-hero-title"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
        >
          مرحباً، {hero.greetingName} 👋
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-pretty text-lg leading-relaxed text-slate-300 md:text-xl"
        >
          {hero.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid gap-4 sm:grid-cols-3"
        >
          {(hero.liveStats ?? []).map((c) => (
            <div
              key={c.label}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <Cpu className="h-5 w-5 text-cyan-300/80 transition group-hover:text-cyan-200" />
                <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-200/90">
                  live
                </span>
              </div>
              <p className="text-3xl font-black tabular-nums text-white">{c.value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-200">{c.label}</p>
              <p className="text-xs text-slate-500">{c.sub}</p>
            </div>
          ))}
        </motion.div>

        <p className="text-xs text-slate-500">
          نموذج بيانات: v{meta.modelVersion} · مُحدَّث {new Date(meta.generatedAt).toLocaleString('ar')}
        </p>
      </div>
    </section>
  )
}
