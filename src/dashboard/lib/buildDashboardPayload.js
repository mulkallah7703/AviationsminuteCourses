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

const STRENGTH_POOL = [
  'الامتثال لسياسات كلمات المرور',
  'الوعي بالتصيّد الاحتيالي',
  'إدارة الجلسات الآمنة',
  'الإبلاغ عن الحوادث الأمنية',
]

const GAP_POOL = [
  'تعميق وحدة إدارة الهويات',
  'مراجعة مسار الأمن الفيزيائي المتقدم',
  'اختبار محاكاة الاستجابة للحوادث',
]

const SUGGESTION_TEMPLATES = [
  { title: 'مسار مكثّف', detail: 'خصص ٢٠ دقيقة يوميًا لوحدة «الهوية والصلاحيات» لرفع مؤشر الجاهزية.' },
  { title: 'تحليل أداء', detail: 'أكمل الاختبار التكيفي الأسبوعي لتحديث نموذج التوصيات.' },
  { title: 'تقوية الأمن', detail: 'راجع محاكاة التصيّد الاحتيالي قبل نهاية الأسبوع.' },
]

const INSTRUCTORS = ['د. سارة المالكي', 'م. فيصل العتيبي', 'د. نورة الزهراني', 'م. عبدالله القحطاني']

const COURSE_BLUEPRINT = [
  { id: 'c1', title: 'الأساسيات السيبرانية المتقدمة', hoursTotal: 12 },
  { id: 'c2', title: 'الأمن الفيزيائي في بيئات العمل', hoursTotal: 9 },
  { id: 'c3', title: 'إدارة الهوية وZero Trust', hoursTotal: 14 },
  { id: 'c4', title: 'الاستجابة للحوادث والتحليل الجنائي الرقمي', hoursTotal: 16 },
]

const LESSON_TITLES = [
  'الوحدة ٤: سياسات الوصول',
  'الوحدة ٢: تصنيف المخاطر',
  'الوحدة ٦: التحقق متعدد العوامل',
  'الوحدة ١: نمذجة التهديدات',
]

const SKILL_REC_POOL = [
  { skill: 'Zero Trust Architecture', relevance: 0 },
  { skill: 'SIEM Fundamentals', relevance: 0 },
  { skill: 'Secure SDLC', relevance: 0 },
  { skill: 'Cloud Security Posture', relevance: 0 },
]

const REMINDER_POOL = [
  { title: 'جلسة تعلّم قصيرة', dueIn: 'اليوم', channel: 'push' },
  { title: 'تقرير التقدّم الأسبوعي', dueIn: 'غدًا', channel: 'email' },
  { title: 'تحديث سياسة الجهاز', dueIn: '٣ أيام', channel: 'in_app' },
]

const SECURITY_FEED_POOL = [
  { title: 'محاولة تصيّد محجوبة', severity: 'low', time: 'منذ ٤٠ دقيقة' },
  { title: 'تسجيل دخول من جهاز موثوق', severity: 'info', time: 'منذ ساعتين' },
  { title: 'تحديث توقيع التهديدات', severity: 'medium', time: 'أمس' },
]

const DIFF_ARR = ['مبتدئ', 'متوسط', 'متقدم']

const CERT_TITLES = ['أساسيات الأمن السيبراني', 'الأمن الفيزيائي المعتمد', 'إدارة الحوادث']

const ACTIVITY_KINDS = [
  { kind: 'lesson_complete', title: 'أكملت درس «عوامل المخاطر الفيزيائية»', meta: 'منذ ٢٥ دقيقة' },
  { kind: 'quiz_pass', title: 'اجتياز اختبار قصير — Zero Trust بنسبة ٩٢٪', meta: 'منذ ساعة' },
  { kind: 'certificate_earned', title: 'حصلت على شهادة إتمام مسار الأمن الفيزيائي', meta: 'أمس' },
  { kind: 'course_started', title: 'بدأت دورة «الاستجابة للحوادث»', meta: 'منذ يومين' },
  { kind: 'ai_generated', title: 'وُلدت توصية ذكية جديدة لمستوى مهاراتك', meta: 'اليوم' },
  { kind: 'cyber_complete', title: 'أكملت وحدة التوعية بالتصيّد الاحتيالي', meta: 'منذ ٣ أيام' },
]

const ROADMAP_MILESTONES = [
  { id: 'm1', title: 'أساسيات الحوكمة الأمنية', status: 'done', date: '٢٠٢٥/٠٨/١٢', detail: '٨ وحدات · ١٢ ساعة' },
  { id: 'm2', title: 'الأمن الفيزيائي والبيئي', status: 'done', date: '٢٠٢٥/١٠/٠٣', detail: '٦ وحدات · ٩ ساعات' },
  { id: 'm3', title: 'الهوية والوصول (IAM)', status: 'active', date: 'قيد التنفيذ', detail: 'الوحدة ٤ من ١٠' },
  { id: 'm4', title: 'الاستجابة للحوادث', status: 'upcoming', date: 'بعد الإكمال', detail: 'موصى به من الذكاء الاصطناعي' },
  { id: 'm5', title: 'القيادة الأمنية والامتثال', status: 'upcoming', date: 'مخطط', detail: 'مسار مهني أمني' },
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

  const weeklyProgressPct = Math.round(58 + seededUnit(seed, 1) * 38)
  const performanceScore = Math.round(72 + seededUnit(seed, 2) * 26)
  const cyberPosture = Math.round(64 + seededUnit(seed, 3) * 32)
  const awarenessScore = Math.round(70 + seededUnit(seed, 4) * 28)
  const compliancePct = Math.round(82 + seededUnit(seed, 5) * 15)

  const learningSpeed = Math.round(65 + seededUnit(seed, 17) * 33)
  const focusLevel = Math.round(58 + seededUnit(seed, 18) * 40)
  const bestSkill = STRENGTH_POOL[Math.floor(seededUnit(seed, 19) * STRENGTH_POOL.length)]
  const performanceGrade = seededUnit(seed, 21) > 0.75 ? 'A' : seededUnit(seed, 21) > 0.45 ? 'B+' : 'B'

  const weeks = 12
  const weeklyActivity = Array.from({ length: weeks }, (_, w) => ({
    week: `${w + 1}`,
    hours: Math.round(2 + seededUnit(seed, 20 + w) * 14),
    intensity: seededUnit(seed, 40 + w),
  }))

  const skillGrowth = Array.from({ length: 8 }, (_, m) => ({
    month: `${m + 1}`,
    score: Math.round(55 + seededUnit(seed, 60 + m) * 40 + m * 2),
  }))

  const engagement = weeklyActivity.map((w, i) => ({
    week: w.week,
    engagement: Math.round(40 + seededUnit(seed, 900 + i) * 55),
  }))

  const focusWeekly = weeklyActivity.map((w, i) => ({
    week: w.week,
    focus: Math.round(35 + seededUnit(seed, 920 + i) * 60),
  }))

  const streakCurrent = 3 + Math.floor(seededUnit(seed, 940) * 12)

  const aiPrediction = weeklyActivity.map((w, i) => ({
    week: w.week,
    actual: w.hours,
    predicted: Math.round(w.hours * (0.92 + seededUnit(seed, 960 + i) * 0.2)),
  }))

  const chartMerge = weeklyActivity.map((w, i) => ({
    week: w.week,
    hours: w.hours,
    engagement: engagement[i].engagement,
    focus: focusWeekly[i].focus,
    actual: aiPrediction[i].actual,
    predicted: aiPrediction[i].predicted,
  }))

  const heatmapRows = ['صباحًا', 'ظهرًا', 'مساءً', 'ليلاً']
  const heatmapCols = ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج']
  const heatmapCells = heatmapRows.map((_, r) =>
    heatmapCols.map((__, c) => seededUnit(seed, 100 + r * 7 + c)),
  )

  const strengths = shuffledTake(seed, 200, STRENGTH_POOL, 2)
  const gaps = shuffledTake(seed, 210, GAP_POOL, 2)

  const suggestions = [0, 1, 2].map((i) => ({
    ...SUGGESTION_TEMPLATES[i % SUGGESTION_TEMPLATES.length],
    priority: ['high', 'medium', 'low'][Math.floor(seededUnit(seed, 220 + i) * 3)],
  }))

  const courses = COURSE_BLUEPRINT.map((c, i) => {
    const progress = Math.round(seededUnit(seed, 300 + i) * 100)
    const remaining = Math.max(0, Math.round((1 - progress / 100) * c.hoursTotal * 60))
    return {
      ...c,
      instructor: INSTRUCTORS[i % INSTRUCTORS.length],
      progress,
      currentLessonTitle: LESSON_TITLES[i % LESSON_TITLES.length],
      remainingMinutes: remaining,
      matchScore: Math.round(72 + seededUnit(seed, 310 + i) * 26),
      difficulty: DIFF_ARR[Math.floor(seededUnit(seed, 320 + i) * 3) % 3],
      status: progress === 0 ? 'not_started' : progress >= 100 ? 'completed' : 'in_progress',
      bannerHue: Math.round(160 + seededUnit(seed, 330 + i) * 120),
    }
  })

  const skillRecommendations = SKILL_REC_POOL.map((s, i) => ({
    ...s,
    relevance: Math.round(55 + seededUnit(seed, 400 + i) * 44),
  }))

  const roadmap = [
    { phase: 'المرحلة ١', label: 'تأسيس الأمن', status: 'done' },
    { phase: 'المرحلة ٢', label: 'التطبيق العملي', status: 'active' },
    { phase: 'المرحلة ٣', label: 'القيادة والامتثال', status: 'upcoming' },
  ]

  const reminders = shuffledTake(seed, 520, REMINDER_POOL, 2)
  const securityFeed = shuffledTake(seed, 700, SECURITY_FEED_POOL, 3)

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

  const certificatesEarned = CERT_TITLES.slice(0, Math.min(certificatesCount, CERT_TITLES.length)).map((title, i) => ({
    id: `cert-${i}`,
    title,
    issuedAt: `٢٠٢٥ · ${8 + i} · ١٥`,
    verifyId: `LMS-${employeeNumber}-${1000 + i}`,
    hue: 200 + i * 40,
  }))

  const certTimeline = certificatesEarned.map((c) => ({
    title: c.title,
    at: c.issuedAt,
    type: 'issued',
  }))

  const nextCertificate = {
    title: 'محترف الأمن السيبراني — المستوى ٢',
    progressPct: Math.min(99, overallCompletionPct + Math.floor(seededUnit(seed, 1300) * 15)),
    etaWeeks: 2 + Math.floor(seededUnit(seed, 1301) * 6),
  }

  const activity = shuffledTake(seed, 1600, ACTIVITY_KINDS, 6).map((a, i) => ({
    id: `act-${i}`,
    kind: a.kind,
    title: a.title,
    meta: a.meta,
  }))

  const notifications = [
    { id: 'n1', title: 'توصية ذكية: وحدة جديدة متاحة', meta: 'الآن', unread: true },
    { id: 'n2', title: 'تقرير الامتثال جاهز للمراجعة', meta: 'منذ يوم', unread: false },
    { id: 'n3', title: 'اقتراب موعد تجديد شهادة الوعي الأمني', meta: 'هذا الأسبوع', unread: true },
  ]

  const cyberLearning = {
    phishingPct: Math.round(78 + seededUnit(seed, 1400) * 20),
    riskTrainingScore: Math.round(70 + seededUnit(seed, 1401) * 28),
    readinessLevel: Math.round(65 + seededUnit(seed, 1402) * 30),
    awarenessPct: awarenessScore,
    attackSimPct: Math.round(55 + seededUnit(seed, 1403) * 40),
    compliancePct,
  }

  const aiRecommendations = [
    {
      shelf: 'دورات مقترحة لك',
      items: [
        { id: 'r1', title: 'التحليل الجنائي السحابي', subtitle: 'تمديد مسار الحوادث · ٨ ساعات', score: 94, kind: 'course' },
        { id: 'r2', title: 'أمن التوريد والبرامج', subtitle: 'يغطي ضعفك في Secure SDLC', score: 89, kind: 'course' },
        { id: 'r3', title: 'الامتثال NIST CSF ٢.٠', subtitle: 'شهادة مهنية', score: 87, kind: 'cert' },
      ],
    },
    {
      shelf: 'مهارات تحتاج تقوية',
      items: [
        { id: 'r4', title: 'جلسات تمارين SIEM', subtitle: '٣ جلسات قصيرة أسبوعيًا', score: 82, kind: 'skill' },
        { id: 'r5', title: 'محاكاة تصيّد متقدمة', subtitle: 'وحدة التوعية الأمنية', score: 91, kind: 'cyber' },
      ],
    },
    {
      shelf: 'خطط تعلّم ذكية',
      items: [
        { id: 'r6', title: 'خطة ١٤ يومًا لرفع معدل الاختبارات', subtitle: 'مُولَّدة بالذكاء الاصطناعي', score: 88, kind: 'plan' },
      ],
    },
  ]

  const careerSuggestions = [
    'مسار «محلل أمن سيبراني» — أكمل مسار الحوادث ثم شهادة المستوى ٢.',
    'توسيع الكفاءة في السحابة بعد إتقان الهوية والوصول.',
  ]

  const futureAiRecs = [
    'بعد إكمال IAM: تفعيل توصيات Zero Trust التلقائية.',
    'الأسبوع القادم: تركيز على وحدات الامتثال والتدقيق.',
  ]

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
      tagline:
        'منصة ذكية لتحليل تقدمك التعليمي وتطوير مهاراتك باستخدام الذكاء الاصطناعي.',
      liveStats: [
        { label: 'مسارات نشطة', value: String(activeCourses + completedCourses), sub: 'تعلّم مستمر' },
        { label: 'ساعات مُكتسبة', value: String(learningHours), sub: 'تراكمي' },
        { label: 'شهادات', value: String(certificatesCount), sub: 'مُتحقق منها' },
      ],
    },
    courseAnalytics: { cards: courseAnalyticsCards },
    ai: {
      weeklyProgressPct,
      analysisSummary:
        weeklyProgressPct >= 85
          ? 'أداؤك هذا الأسبوع ضمن النطاق الممتاز. حافظ على إيقاع التعلّم القصير اليومي.'
          : 'هناك مجال لرفع وتيرة التعلّم قليلًا. ركّز على الوحدات ذات الأولوية العالية في التوصيات.',
      strengths,
      gaps,
      suggestions,
      bestSkill,
      skillsToImprove: gaps,
      learningSpeed,
      focusLevel,
      performanceGrade,
      performanceAnalysis: `درجة الأداء التقديرية ${performanceGrade} بناءً على التقدّم والاختبارات ووقت التفاعل.`,
      scoreRings: [
        { id: 'engagement', label: 'مؤشر التفاعل', value: weeklyProgressPct },
        { id: 'mastery', label: 'إتقان المحتوى', value: performanceScore },
        { id: 'security', label: 'الوعي الأمني', value: awarenessScore },
      ],
      neuralPulse: Array.from({ length: 24 }, (_, i) => ({
        x: (i % 6) + seededUnit(seed, 1500 + i),
        y: Math.floor(i / 6) + seededUnit(seed, 1510 + i),
        a: 0.2 + seededUnit(seed, 1520 + i) * 0.8,
      })),
    },
    learning: {
      courses,
      skillRecommendations,
      roadmap,
      reminders,
      roadmapMilestones: ROADMAP_MILESTONES,
      careerSuggestions,
      futureAiRecs,
    },
    certificates: {
      earned: certificatesEarned,
      nextCertificate,
      timeline: certTimeline,
    },
    series: {
      weeklyActivity,
      skillGrowth,
      engagement,
      focusWeekly,
      aiPrediction,
      chartMerge,
      streakCurrent,
    },
    heatmap: {
      rows: heatmapRows,
      cols: heatmapCols,
      cells: heatmapCells,
    },
    security: {
      phishing: {
        status: seededUnit(seed, 700) > 0.25 ? 'passed' : 'pending',
        lastSimulation: seededUnit(seed, 701) > 0.5 ? 'مكتمل بنجاح' : 'مجدول',
        score: awarenessScore,
      },
      riskLevel: cyberPosture > 85 ? 'low' : cyberPosture > 70 ? 'medium' : 'elevated',
      posturePct: cyberPosture,
      compliancePct,
      feed: securityFeed,
      learning: cyberLearning,
    },
    activity,
    notifications,
    aiRecommendations,
    kpis: [],
  }
}
