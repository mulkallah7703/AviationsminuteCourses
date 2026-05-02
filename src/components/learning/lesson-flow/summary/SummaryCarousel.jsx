import { SummaryCarouselCard } from './SummaryCarouselCard'

const SUMMARY_ITEMS = [
  'المواد الكيميائية قد تشكل خطرًا مباشرًا عند سوء استخدامها أو تخزينها بشكل غير آمن.',
  'استنشاق الأبخرة الكيميائية قد يؤدي إلى مشاكل في الجهاز التنفسي مثل ضيق التنفس أو التهيج.',
  'التعرض المستمر لبعض المواد قد يسبب أمراضًا مزمنة مثل الحساسية أو السرطان.',
  'ملامسة المواد الكيميائية للجلد قد تؤدي إلى التهابات أو حروق كيميائية.',
  'بعض المواد الكيميائية قابلة للاشتعال وقد تسبب حرائق خطيرة في بيئة العمل.',
  'تسرب المواد الكيميائية قد يؤدي إلى تلوث البيئة والمياه والتربة.',
  'عدم استخدام معدات الحماية الشخصية يزيد من خطر الإصابة.',
  'التخزين غير الصحيح للمواد الكيميائية قد يؤدي إلى تفاعلات خطيرة.',
  'التوعية والتدريب يساعدان في تقليل المخاطر وتعزيز السلامة.',
  'اتباع إجراءات السلامة يساهم في حماية العاملين وتقليل الحوادث.',
]

/** Fixed strip of three summary cards (no carousel controls). */
const VISIBLE_CARDS = SUMMARY_ITEMS.slice(0, 3)

export function SummaryCarousel() {
  return (
    <div className="summary-carousel-wrapper">
      <div className="summary-carousel summary-carousel--static">
        <div className="summary-carousel-stage carousel-container carousel-viewport">
          <div className="summary-carousel-track carousel-track summary-carousel-track--static">
            {VISIBLE_CARDS.map((text, idx) => (
              <SummaryCarouselCard key={idx} text={text} isActive={idx === 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
