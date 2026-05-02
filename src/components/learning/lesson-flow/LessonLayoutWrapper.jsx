export function LessonLayoutWrapper({
  children,
  onPrevious,
  onNext,
  previousLabel = 'السابق',
  nextLabel = 'التالي',
  isNextDisabled = false,
}) {
  return (
    <section className="lesson-step-screen fade-slide-in">
      <header className="lesson-step-brand" aria-hidden />

      <div className="lesson-step-main">{children}</div>

      <footer className="lesson-step-actions">
        <button type="button" className="ghost step-btn" onClick={onPrevious}>
          {previousLabel}
        </button>
        <button type="button" className="primary step-btn" onClick={onNext} disabled={isNextDisabled}>
          {nextLabel}
        </button>
      </footer>
    </section>
  )
}
