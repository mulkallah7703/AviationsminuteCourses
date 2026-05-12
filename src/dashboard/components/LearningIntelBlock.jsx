import { motion } from 'framer-motion'
import { GraduationCap, Timer } from 'lucide-react'

export function LearningIntelBlock({ learning }) {
  return (
    <section
      id="skills-intel"
      className="scroll-mt-28 space-y-8 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl md:p-8"
      aria-labelledby="skills-intel-heading"
    >
      <h2 id="skills-intel-heading" className="flex items-center gap-2 text-xl font-bold text-white md:text-2xl">
        <GraduationCap className="h-7 w-7 text-violet-300" aria-hidden />
        الذكاء التعليمي · المهارات والتذكيرات
      </h2>

      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">مهارات مقترحة بالذكاء الاصطناعي</h3>
        <div className="flex flex-wrap gap-2">
          {learning.skillRecommendations.map((s) => (
            <motion.span
              key={s.skill}
              whileHover={{ scale: 1.04 }}
              className="rounded-full border border-cyan-500/25 bg-gradient-to-l from-cyan-500/15 to-indigo-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.08)]"
            >
              {s.skill}
              <span className="ms-2 text-xs font-black text-cyan-300">{s.relevance}٪</span>
            </motion.span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          <Timer className="h-4 w-4" />
          تذكيرات ذكية
        </h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {learning.reminders.map((r, i) => (
            <motion.li
              key={`${r.title}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
            >
              <span className="font-bold text-white">{r.title}</span>
              <span className="ms-2 text-slate-500">· {r.dueIn}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
