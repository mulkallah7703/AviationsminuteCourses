export function SummaryCarouselCard({ text, isActive = false }) {
  return (
    <article className={`summary-carousel-card card ${isActive ? 'summary-carousel-card--active' : ''}`.trim()}>
      <p className="summary-carousel-card__text" dir="rtl">
        {text}
      </p>
    </article>
  )
}
