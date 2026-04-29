import { SummaryCarousel } from './summary/SummaryCarousel'

export function LessonSummary() {
  return (
    <div className="lesson-summary-screen">
      <header className="lesson-summary-header">
        <h2>Summary Carousel</h2>
        <p>
          في هذا القسم نستعرض أهم المفاهيم المتعلقة بالمخاطر الكيميائية وتأثيراتها، مع تلخيص يساعد على
          تثبيت المعلومات واستيعابها بشكل أفضل.
        </p>
      </header>

      <SummaryCarousel />
    </div>
  )
}
