export const CHEMICAL_COURSE_TITLE = 'المخاطر الكيميائية'

/**
 * Seven focused video lessons for Unit 1 — المخاطر الكيميائية.
 */
export const chemicalLessons = [
  {
    id: 1,
    title: 'مقدمة في المخاطر الكيميائية',
    description: 'نظرة عامة على المخاطر الكيميائية في بيئة العمل وأهمية التوعية.',
    provider: 'mp4',
    src: '/video1.mp4',
    attachment: null,
  },
  {
    id: 2,
    title: 'التعرف على المواد الخطرة',
    description: 'كيفية تحديد المواد الكيميائية الخطرة وقراءة علامات التحذير.',
    provider: 'mp4',
    src: '/video1.mp4',
    attachment: null,
  },
  {
    id: 3,
    title: 'طرق التعرض الكيميائي',
    description: 'مسارات التعرض: استنشاق، ملامسة، وابتلاع — وكيف تحدث في الميدان.',
    provider: 'mp4',
    src: '/video1.mp4',
    attachment: null,
  },
  {
    id: 4,
    title: 'التعرض في بيئة العمل',
    description: 'مشهد توضيحي للتعرض لمخاطر المواد الكيميائية داخل بيئة العمل.',
    provider: 'mp4',
    src: '/video1.mp4',
    attachment: { label: 'دليل السلامة الكيميائية', href: '#' },
  },
  {
    id: 5,
    title: 'بطاقات بيانات السلامة',
    description: 'فهم MSDS/SDS واستخدامها لاتخاذ قرارات آمنة.',
    provider: 'mp4',
    src: '/video1.mp4',
    attachment: null,
  },
  {
    id: 6,
    title: 'إجراءات الطوارئ والاستجابة',
    description: 'خطوات الاستجابة الأولية عند التسرب أو التعرض الكيميائي.',
    provider: 'mp4',
    src: '/video1.mp4',
    attachment: null,
  },
  {
    id: 7,
    title: 'ملخص الوحدة والتطبيق العملي',
    description: 'تلخيص أهم النقاط وتطبيق ممارسات السلامة اليومية.',
    provider: 'mp4',
    src: '/video1.mp4',
    attachment: null,
  },
]

export const CHEMICAL_LESSON_COUNT = chemicalLessons.length
