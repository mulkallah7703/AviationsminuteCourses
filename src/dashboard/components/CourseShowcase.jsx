import { motion } from 'framer-motion'
import { BookOpen, Clock, Play, Sparkles, User } from 'lucide-react'
import { Link } from 'react-router-dom'

const diffStyle = {
  مبتدئ: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  متوسط: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  متقدم: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
}

export function CourseShowcase({ courses }) {
  return (
    <section id="courses" className="scroll-mt-28 space-y-6" aria-labelledby="courses-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="courses-heading" className="flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
          <BookOpen className="h-8 w-8 text-violet-300" aria-hidden />
          مساراتك التعليمية
        </h2>
        <Link
          to="/course"
          className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-500/20"
        >
          فتح كل الدورات
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((c, i) => (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <div
              className="relative h-36 w-full overflow-hidden"
              style={{
                background: `linear-gradient(135deg, hsla(${c.bannerHue},85%,42%,0.95) 0%, hsla(${c.bannerHue + 40},70%,22%,0.98) 100%)`,
              }}
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
              <div className="absolute bottom-3 start-4 end-4 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${diffStyle[c.difficulty] || diffStyle['متوسط']}`}
                >
                  {c.difficulty}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur">
                  <Sparkles className="h-3 w-3 text-cyan-200" />
                  توصية AI {c.matchScore}٪
                </span>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <div>
                <h3 className="text-lg font-bold leading-snug text-white">{c.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <User className="h-3.5 w-3.5" />
                  {c.instructor}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {c.currentLessonTitle}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1">
                  <Clock className="h-3.5 w-3.5" />
                  متبقي ~{c.remainingMinutes} د
                </span>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs font-bold text-slate-400">
                  <span>التقدّم</span>
                  <span>{c.progress}٪</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-l from-cyan-400 via-violet-500 to-fuchsia-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
              <Link
                to="/course"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-cyan-500 to-indigo-600 py-3 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition group-hover:brightness-110"
              >
                <Play className="h-4 w-4 fill-current" />
                متابعة ذكية
              </Link>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/0 transition group-hover:ring-cyan-400/25" />
          </motion.article>
        ))}
      </div>
    </section>
  )
}
