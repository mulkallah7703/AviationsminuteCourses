export const courseTitle = 'منصة التدريب التفاعلي'

export const units = [
  { id: 'u1', key: 'chemical', title: 'الوحدة 1: المخاطر الكيميائية', shortTitle: 'المخاطر الكيميائية', icon: '🧪' },
  { id: 'u2', key: 'physical', title: 'الوحدة 2: المخاطر الفيزيائية', shortTitle: 'المخاطر الفيزيائية', icon: '⚙️' },
  {
    id: 'u3',
    key: 'extreme-temperature',
    title: 'الوحدة 3: مخاطر درجات الحرارة القصوى',
    shortTitle: 'مخاطر درجات الحرارة القصوى',
    icon: '🌡️',
  },
  { id: 'u4', key: 'vibration', title: 'الوحدة 4: مخاطر الاهتزازات', shortTitle: 'مخاطر الاهتزازات', icon: '📳' },
  {
    id: 'u5',
    key: 'electricity',
    title: 'الوحدة 5: المخاطر الناتجة عن تأثير الكهرباء',
    shortTitle: 'المخاطر الناتجة عن تأثير الكهرباء',
    icon: '⚡',
  },
  { id: 'u6', key: 'xray', title: 'الوحدة 6: مخاطر الاشعة السينية', shortTitle: 'مخاطر الاشعة السينية', icon: '☢️' },
  {
    id: 'u7',
    key: 'interactive-assessment',
    title: 'الوحدة 7: التقييم التفاعلي',
    shortTitle: 'التقييم التفاعلي',
    icon: '✅',
  },
]

export const learningUnits = units.map((unit, index) => ({
  ...unit,
  order: index + 1,
  duration: '25 دقيقة',
  objectives: [
    `التعرف على ${unit.shortTitle}.`,
    `فهم طرق التعامل مع ${unit.shortTitle}.`,
    'تطبيق إجراءات السلامة والاستجابة الصحيحة.',
  ],
}))

export const lessons = [
  {
    id: 'u1-l1',
    unitId: 'u1',
    unitTitle: 'الوحدة 1: المخاطر الكيميائية',
    title: 'مقدمة الوحدة',
    type: 'intro',
    content: {
      headline: 'الوحدة 1: المخاطر الكيميائية',
      description: 'هذا الدرس تمهيدي ويمكن تعديل المحتوى لاحقاً.',
      tags: ['تمهيدي', 'تفاعلي', 'قابل للتوسعة'],
    },
  },
  {
    id: 'u1-l2',
    unitId: 'u1',
    unitTitle: 'الوحدة 1: المخاطر الكيميائية',
    title: 'محتوى تفاعلي',
    type: 'accordion',
    content: {
      sections: [
        { title: 'قسم 1', body: 'محتوى قابل للتعديل لاحقاً.' },
        { title: 'قسم 2', body: 'استخدم هذا القسم لإضافة نصوص التدريب.' },
        { title: 'قسم 3', body: 'يمكن توسيع هذا القالب بسهولة.' },
      ],
    },
  },
  {
    id: 'u2-l1',
    unitId: 'u2',
    unitTitle: 'الوحدة 2: المخاطر الفيزيائية',
    title: 'محتوى + صورة',
    type: 'content-image',
    content: {
      text: 'منطقة عرض محتوى بصري ونصي دون تغيير العناوين الأساسية.',
      imageLabel: 'صورة توضيحية',
    },
  },
  {
    id: 'u2-l2',
    unitId: 'u2',
    unitTitle: 'الوحدة 2: المخاطر الفيزيائية',
    title: 'محتوى + صوت',
    type: 'content-audio',
    content: {
      text: 'واجهة صوتية جاهزة لملف صوتي حقيقي عند التوسعة.',
      trackTitle: 'مشغل صوت (نموذج)',
    },
  },
  {
    id: 'u7-l1',
    unitId: 'u7',
    unitTitle: 'الوحدة 7: التقييم التفاعلي',
    title: 'اختبار تفاعلي',
    type: 'quiz',
    content: {
      question: 'اختر الإجابة الصحيحة (نموذج تفاعلي):',
      options: ['الخيار 1', 'الخيار 2', 'الخيار 3'],
      correctIndex: 1,
    },
  },
  {
    id: 'u7-l2',
    unitId: 'u7',
    unitTitle: 'الوحدة 7: التقييم التفاعلي',
    title: 'تصنيف بالسحب والإفلات',
    type: 'drag-drop',
    content: {
      prompt: 'اسحب العناصر إلى الفئة المناسبة (نموذج).',
      categories: ['فئة أ', 'فئة ب'],
      items: [
        { id: 'i1', label: 'عنصر 1', correctCategory: 'فئة أ' },
        { id: 'i2', label: 'عنصر 2', correctCategory: 'فئة ب' },
      ],
    },
  },
  {
    id: 'u7-l3',
    unitId: 'u7',
    unitTitle: 'الوحدة 7: التقييم التفاعلي',
    title: 'ملخص',
    type: 'summary',
    content: {
      points: ['نقطة ملخص 1', 'نقطة ملخص 2', 'نقطة ملخص 3'],
    },
  },
]
