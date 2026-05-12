import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const tipStyle = {
  backgroundColor: 'rgba(15,23,42,0.95)',
  border: '1px solid rgba(148,163,184,0.2)',
  borderRadius: 12,
  color: '#e2e8f0',
}

export default function DashboardCharts({ weeklyActivity, skillGrowth, chartMerge, streakCurrent }) {
  return (
    <div className="space-y-6" dir="ltr">
      <div className="flex flex-wrap items-center justify-end gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 px-4 py-3" dir="rtl">
        <p className="text-sm text-slate-400">
          <span className="font-bold text-cyan-200">سلسلة تعلّم حالية:</span>{' '}
          <span className="text-2xl font-black tabular-nums text-white">{streakCurrent}</span> أيام متتالية
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 pb-2 shadow-inner md:p-5"
        >
          <h3 className="mb-4 text-end text-sm font-bold text-slate-400" dir="rtl">
            الساعات التعليمية أسبوعيًا
          </h3>
          <div className="h-[240px] w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={tipStyle} formatter={(v) => [`${v} س`, '']} />
                <Area type="monotone" dataKey="hours" stroke="#22d3ee" strokeWidth={2.5} fill="url(#fillHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.04 }}
          className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 pb-2 shadow-inner md:p-5"
        >
          <h3 className="mb-4 text-end text-sm font-bold text-slate-400" dir="rtl">
            نمو المهارات
          </h3>
          <div className="h-[240px] w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={skillGrowth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={tipStyle} />
                <Line type="monotone" dataKey="score" stroke="#a78bfa" strokeWidth={3} dot={{ fill: '#c4b5fd', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06 }}
          className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 pb-2 shadow-inner md:p-5"
        >
          <h3 className="mb-4 text-end text-sm font-bold text-slate-400" dir="rtl">
            تفاعل التعلّم (مؤشر أسبوعي)
          </h3>
          <div className="h-[240px] w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartMerge} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={tipStyle} />
                <Bar dataKey="engagement" fill="url(#barEng)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barEng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 pb-2 shadow-inner md:p-5"
        >
          <h3 className="mb-4 text-end text-sm font-bold text-slate-400" dir="rtl">
            تنبؤ الذكاء الاصطناعي · الساعات (فعلي × متوقع)
          </h3>
          <div className="h-[260px] w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartMerge} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={tipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="actual" name="فعلي" stroke="#22d3ee" strokeWidth={2} dot={false} />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  name="متوقع AI"
                  stroke="#f472b6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line type="monotone" dataKey="focus" name="تركيز" stroke="#a78bfa" strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
