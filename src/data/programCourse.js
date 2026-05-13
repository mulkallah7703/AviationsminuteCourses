export const PROGRAM_COURSE_ID = 'hazards-program'
export const PROGRAM_COURSE_TITLE = 'برنامج التوعية التفاعلي'

export const PROTECTED_DEMO_VIDEO =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

/**
 * Each module = one protected video lesson + one quiz.
 * Videos MUST be self-hosted MP4 for anti-seek compliance (not YouTube).
 */
export const programModules = [
  {
    id: 1,
    lessonTitle: 'الدرس الأول — المخاطر الكيميائية',
    quizTitle: 'اختبار الدرس الأول',
    video: {
      provider: 'mp4',
      src: PROTECTED_DEMO_VIDEO,
      description: 'نظرة عامة على المخاطر الكيميائية في بيئة العمل وأهمية التوعية.',
    },
  },
  {
    id: 2,
    lessonTitle: 'الدرس الثاني — المخاطر الفيزيائية',
    quizTitle: 'اختبار الدرس الثاني',
    video: {
      provider: 'mp4',
      src: PROTECTED_DEMO_VIDEO,
      description: 'التعرف على المخاطر الفيزيائية ومصادرها في بيئة العمل.',
    },
  },
  {
    id: 3,
    lessonTitle: 'الدرس الثالث — درجات الحرارة القصوى',
    quizTitle: 'اختبار الدرس الثالث',
    video: {
      provider: 'mp4',
      src: PROTECTED_DEMO_VIDEO,
      description: 'مخاطر الحرارة والبرودة الشديدة وتأثيرها على سلامة العاملين.',
    },
  },
  {
    id: 4,
    lessonTitle: 'الدرس الرابع — السلامة المهنية',
    quizTitle: 'اختبار الدرس الرابع',
    video: {
      provider: 'mp4',
      src: PROTECTED_DEMO_VIDEO,
      description: 'مبادئ السلامة المهنية والوقاية من الإصابات في بيئة العمل.',
    },
  },
  {
    id: 5,
    lessonTitle: 'الدرس الخامس — المخاطر الكهربائية',
    quizTitle: 'اختبار الدرس الخامس',
    video: {
      provider: 'mp4',
      src: PROTECTED_DEMO_VIDEO,
      description: 'مخاطر الكهرباء والصدمات الكهربائية وإجراءات الوقاية.',
    },
  },
  {
    id: 6,
    lessonTitle: 'الدرس السادس — مخاطر الإشعاع',
    quizTitle: 'اختبار الدرس السادس',
    video: {
      provider: 'mp4',
      src: PROTECTED_DEMO_VIDEO,
      description: 'التعرض للإشعاع في بيئة العمل وطرق الحماية والتقليل.',
    },
  },
  {
    id: 7,
    lessonTitle: 'الدرس السابع — التقييم والمتابعة',
    quizTitle: 'اختبار الدرس السابع',
    video: {
      provider: 'mp4',
      src: PROTECTED_DEMO_VIDEO,
      description: 'تلخيص البرنامج وآليات التقييم الذاتي والمتابعة المستمرة.',
    },
  },
]

export const PROGRAM_MODULE_COUNT = programModules.length

export function getModuleById(id) {
  return programModules.find((m) => m.id === id) ?? null
}

/** Total learning steps = lessons + quizzes */
export function getTotalProgramSteps() {
  return programModules.length * 2
}
