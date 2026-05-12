import { lazy, Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AIInsightsDeck } from '../dashboard/components/AIInsightsDeck.jsx'
import { AIRecommendationsShelf } from '../dashboard/components/AIRecommendationsShelf.jsx'
import { CertificatesHall } from '../dashboard/components/CertificatesHall.jsx'
import { CourseAnalyticsBelt } from '../dashboard/components/CourseAnalyticsBelt.jsx'
import { CourseShowcase } from '../dashboard/components/CourseShowcase.jsx'
import { FeedsSection } from '../dashboard/components/FeedsSection.jsx'
import { HeatmapSection } from '../dashboard/components/HeatmapSection.jsx'
import { HeroSection } from '../dashboard/components/HeroSection.jsx'
import { LearningIntelBlock } from '../dashboard/components/LearningIntelBlock.jsx'
import { RoadmapTimeline } from '../dashboard/components/RoadmapTimeline.jsx'
import { SecurityCommandBlock } from '../dashboard/components/SecurityCommandBlock.jsx'
import { useDashboardData } from '../dashboard/hooks/useDashboardData.js'

const DashboardCharts = lazy(() => import('../dashboard/components/DashboardCharts.jsx'))

function ChartSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 animate-pulse rounded-xl bg-white/5" />
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[260px] animate-pulse rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/80 to-slate-950/80"
          />
        ))}
      </div>
    </div>
  )
}

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
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <HeroSection hero={data.hero} meta={data.meta} />

      <div className="relative z-10 space-y-16 px-4 pb-28 pt-4 md:space-y-20 md:px-8 md:pb-32 lg:px-12">
        <CourseAnalyticsBelt cards={data.courseAnalytics.cards} />

        <AIInsightsDeck ai={data.ai} />

        <CourseShowcase courses={data.learning.courses} />

        <RoadmapTimeline
          milestones={data.learning.roadmapMilestones}
          careerSuggestions={data.learning.careerSuggestions}
          futureAiRecs={data.learning.futureAiRecs}
        />

        <CertificatesHall certificates={data.certificates} />

        <AIRecommendationsShelf shelves={data.aiRecommendations} />

        <div className="grid gap-8 xl:grid-cols-2">
          <LearningIntelBlock learning={data.learning} />
          <SecurityCommandBlock security={data.security} />
        </div>

        <section id="analytics" className="scroll-mt-28 space-y-6" aria-labelledby="analytics-heading">
          <h2 id="analytics-heading" className="text-2xl font-bold text-white md:text-3xl">
            التحليلات والرسوم البيانية المتقدمة
          </h2>
          <Suspense fallback={<ChartSkeleton />}>
            <DashboardCharts
              weeklyActivity={data.series.weeklyActivity}
              skillGrowth={data.series.skillGrowth}
              chartMerge={data.series.chartMerge}
              streakCurrent={data.series.streakCurrent}
            />
          </Suspense>
          <HeatmapSection heatmap={data.heatmap} />
        </section>

        <FeedsSection activity={data.activity} notifications={data.notifications} />

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
