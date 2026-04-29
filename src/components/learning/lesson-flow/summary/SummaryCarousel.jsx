import { useEffect, useMemo, useRef, useState } from 'react'
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

export function SummaryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [stepPx, setStepPx] = useState(0)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const visibleCards = 3
  const totalCards = SUMMARY_ITEMS.length
  const maxIndex = Math.max(0, totalCards - visibleCards)

  const centerIndex = useMemo(
    () => Math.min(currentIndex + Math.floor(visibleCards / 2), SUMMARY_ITEMS.length - 1),
    [currentIndex],
  )

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      const cards = track.querySelectorAll('.card')
      if (cards.length === 0) return
      const cardWidth = cards[0].getBoundingClientRect().width
      setStepPx(cardWidth)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex))
  }, [maxIndex])

  const clampedIndex = Math.max(0, Math.min(currentIndex, maxIndex))
  const moveX = clampedIndex * stepPx

  const goPrev = () => {
    if (clampedIndex > 0) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  const goNext = () => {
    if (clampedIndex < maxIndex) {
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
    }
  }

  return (
    <div className="summary-carousel-wrapper">
      <div className="summary-carousel">
        <button
          type="button"
          className="summary-carousel-arrow summary-carousel-arrow--prev summary-carousel-btn left-btn"
          onClick={goPrev}
          aria-label="العنصر السابق"
          disabled={clampedIndex === 0}
        >
          ‹
        </button>

        <div className="summary-carousel-stage carousel-container carousel-viewport" ref={viewportRef}>
          <div
            className="summary-carousel-track carousel-track"
            style={{ transform: `translateX(-${moveX}px)` }}
            ref={trackRef}
          >
            {SUMMARY_ITEMS.map((text, idx) => (
              <SummaryCarouselCard key={idx} text={text} isActive={idx === centerIndex} />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="summary-carousel-arrow summary-carousel-arrow--next summary-carousel-btn right-btn"
          onClick={goNext}
          aria-label="العنصر التالي"
          disabled={clampedIndex === maxIndex}
        >
          ›
        </button>
      </div>
    </div>
  )
}
