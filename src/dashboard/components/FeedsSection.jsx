import { motion } from 'framer-motion'
import {
  Award,
  Bell,
  BookOpen,
  Brain,
  GraduationCap,
  Radio,
  Shield,
} from 'lucide-react'

const kindIcon = {
  lesson_complete: BookOpen,
  quiz_pass: GraduationCap,
  certificate_earned: Award,
  course_started: Radio,
  ai_generated: Brain,
  cyber_complete: Shield,
}

export function FeedsSection({ activity, notifications }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section
        id="notifications"
        className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
        aria-labelledby="notif-heading"
      >
        <h2 id="notif-heading" className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
          <Bell className="h-5 w-5 text-amber-300" />
          الإشعارات
        </h2>
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`rounded-xl border px-4 py-3 transition ${
                n.unread ? 'border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_24px_rgba(34,211,238,0.08)]' : 'border-white/5 bg-slate-950/30'
              }`}
            >
              <p className="font-semibold text-slate-100">{n.title}</p>
              <p className="text-xs text-slate-500">{n.meta}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl" aria-label="نشاط حديث">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
          <Radio className="h-5 w-5 text-emerald-300" />
          نشاط التعلّم المباشر
        </h2>
        <ul className="space-y-3">
          {activity.map((a, i) => {
            const Icon = kindIcon[a.kind] || Radio
            return (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: -4 }}
                className="flex gap-3 rounded-xl border border-white/5 bg-slate-950/50 px-3 py-3"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 text-cyan-200 ring-1 ring-white/10">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug text-slate-100">{a.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{a.meta}</p>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
