import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CourseAnalyticsBelt } from '../dashboard/components/CourseAnalyticsBelt.jsx'
import { FeedsSection } from '../dashboard/components/FeedsSection.jsx'
import { HeroSection } from '../dashboard/components/HeroSection.jsx'
import { useDashboardData } from '../dashboard/hooks/useDashboardData.js'

export function DashboardPage() {
  const data = useDashboardData()
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location.hash])

  return (
    <div dir="rtl" className="min-h-full bg-slate-950 text-slate-100 antialiased">
      <HeroSection hero={data.hero} meta={data.meta} />

      <div className="relative z-10 space-y-12 px-4 pb-24 pt-4 md:space-y-14 md:px-8 md:pb-28 lg:space-y-16 lg:px-12 lg:pb-32">
        <CourseAnalyticsBelt cards={data.courseAnalytics.cards} />

        <FeedsSection activity={data.activity} />

        <section
          id="reports"
          className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8"
        >
          <h2 className="mb-2 text-xl font-bold text-white">التقارير</h2>
          <p className="max-w-3xl text-slate-400">
            تقارير الأداء والشهادات والامتثال — البنية جاهزة للتصدير عند ربط{' '}
            <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-cyan-200">GET /api/learner/reports</code>.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section
            id="profile"
            className="scroll-mt-28 rounded-2xl border border-cyan-500/15 bg-cyan-950/10 p-6 backdrop-blur-xl"
          >
            <h2 className="mb-2 text-xl font-bold text-white">الملف الشخصي</h2>
            <p className="text-slate-400">
              الاسم: <span className="font-semibold text-white">{data.meta.fullName}</span>
            </p>
            <p className="mt-1 text-slate-400">
              رقم الموظف:{' '}
              <span className="font-mono text-sm font-semibold text-cyan-200">{data.meta.employeeNumber}</span>
            </p>
          </section>
          <section
            id="settings"
            className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
          >
            <h2 className="mb-2 text-xl font-bold text-white">الإعدادات</h2>
            <p className="text-slate-400">
              تفضيلات الإشعارات واللغة والجلسة ستُربط بواجهة الإعدادات عند توفرها في الخادم.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
