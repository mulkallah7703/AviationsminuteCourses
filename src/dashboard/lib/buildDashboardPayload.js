import { seededUnit, stableHash } from './hash.js'

function shuffledTake(seed, salt, arr, n) {
  return [...arr]
    .map((item, i) => ({ item, k: seededUnit(seed, salt * 997 + i) }))
    .sort((a, b) => a.k - b.k)
    .slice(0, n)
    .map((x) => x.item)
}

function sparkFromSeed(seed, salt, len) {
  return Array.from({ length: len }, (_, i) =>
    Math.round(20 + seededUnit(seed, salt + i) * 80),
  )
}

const ACTIVITY_KINDS = [
  { kind: 'lesson_complete', title: 'أكملت درس «عوامل المخاطر الفيزيائية»', meta: 'منذ ٢٥ دقيقة' },
  { kind: 'quiz_pass', title: 'اجتياز اختبار قصير — Zero Trust بنسبة ٩٢٪', meta: 'منذ ساعة' },
  { kind: 'certificate_earned', title: 'حصلت على شهادة إتمام مسار الأمن الفيزيائي', meta: 'أمس' },
  { kind: 'course_started', title: 'بدأت دورة «الاستجابة للحوادث»', meta: 'منذ يومين' },
  { kind: 'cyber_complete', title: 'أكملت وحدة التوعية بالتصيّد الاحتيالي', meta: 'منذ ٣ أيام' },
]

/**
 * LMS dashboard view-model — deterministic from `user` until API replaces this.
 * @param {{ id?: string, fullName?: string, employeeNumber?: string } | null} user
 */
export function buildDashboardPayload(user) {
  const employeeNumber = user?.employeeNumber ?? 'guest'
  const fullName = user?.fullName?.trim() || 'متعلّم'
  const userId = user?.id ?? employeeNumber
  const seed = stableHash(`${userId}|${employeeNumber}`)
  const now = new Date().toISOString()

  const activeCourses = 3 + Math.floor(seededUnit(seed, 11) * 3)
  const completedCourses = 1 + Math.floor(seededUnit(seed, 12) * 6)
  const learningHours = Math.round(18 + seededUnit(seed, 6) * 52)
  const avgProgress = Math.round(45 + seededUnit(seed, 13) * 50)
  const quizRate = Math.round(75 + seededUnit(seed, 9) * 23)
  const weeklyMinutes = Math.round(120 + seededUnit(seed, 14) * 240)
  const certificatesCount = 1 + Math.floor(seededUnit(seed, 15) * 4)
  const overallCompletionPct = Math.round(38 + seededUnit(seed, 16) * 55)

  const courseAnalyticsCards = [
    {
      id: 'active',
      label: 'الدورات الحالية',
      value: activeCourses,
      suffix: '',
      trendPct: Math.round((seededUnit(seed, 1100) - 0.45) * 12),
      ring: Math.min(100, Math.round((activeCourses / 6) * 100)),
      spark: sparkFromSeed(seed, 1200, 8),
    },
    {
      id: 'completed',
      label: 'الدورات المكتملة',
      value: completedCourses,
      suffix: '',
      trendPct: Math.round((seededUnit(seed, 1101) - 0.4) * 15),
      ring: Math.min(100, completedCourses * 14),
      spark: sparkFromSeed(seed, 1210, 8),
    },
    {
      id: 'hours',
      label: 'الساعات التعليمية',
      value: learningHours,
      suffix: ' س',
      trendPct: Math.round((seededUnit(seed, 1102) - 0.48) * 10),
      ring: Math.min(100, Math.round((learningHours / 80) * 100)),
      spark: sparkFromSeed(seed, 1220, 8),
    },
    {
      id: 'avgprog',
      label: 'متوسط التقدم',
      value: avgProgress,
      suffix: '%',
      trendPct: Math.round((seededUnit(seed, 1103) - 0.5) * 14),
      ring: avgProgress,
      spark: sparkFromSeed(seed, 1230, 8),
    },
    {
      id: 'quiz',
      label: 'معدل الاختبارات',
      value: quizRate,
      suffix: '%',
      trendPct: Math.round((seededUnit(seed, 1104) - 0.5) * 8),
      ring: quizRate,
      spark: sparkFromSeed(seed, 1240, 8),
    },
    {
      id: 'weeklymin',
      label: 'الوقت الأسبوعي (د)',
      value: Math.round(weeklyMinutes / 60),
      suffix: ' س',
      trendPct: Math.round((seededUnit(seed, 1105) - 0.46) * 11),
      ring: Math.min(100, Math.round((weeklyMinutes / 600) * 100)),
      spark: sparkFromSeed(seed, 1250, 8),
    },
    {
      id: 'certs',
      label: 'عدد الشهادات',
      value: certificatesCount,
      suffix: '',
      trendPct: Math.round((seededUnit(seed, 1106) - 0.42) * 9),
      ring: Math.min(100, certificatesCount * 25),
      spark: sparkFromSeed(seed, 1260, 8),
    },
    {
      id: 'overall',
      label: 'نسبة الإنجاز العامة',
      value: overallCompletionPct,
      suffix: '%',
      trendPct: Math.round((seededUnit(seed, 1107) - 0.47) * 13),
      ring: overallCompletionPct,
      spark: sparkFromSeed(seed, 1270, 8),
    },
  ]

  const activity = shuffledTake(seed, 1600, ACTIVITY_KINDS, 6).map((a, i) => ({
    id: `act-${i}`,
    kind: a.kind,
    title: a.title,
    meta: a.meta,
  }))

  return {
    meta: {
      userId,
      employeeNumber,
      fullName,
      generatedAt: now,
      modelVersion: '2.0.0-lms',
    },
    hero: {
      greetingName: fullName,
      tagline: 'منصة تعلّم مؤسسية لتتبع تقدمك وإنجازاتك التعليمية.',
      liveStats: [
        { label: 'مسارات نشطة', value: String(activeCourses + completedCourses), sub: 'تعلّم مستمر' },
        { label: 'ساعات مُكتسبة', value: String(learningHours), sub: 'تراكمي' },
        { label: 'شهادات', value: String(certificatesCount), sub: 'مُتحقق منها' },
      ],
    },
    courseAnalytics: { cards: courseAnalyticsCards },
    activity,
    kpis: [],
  }
}
