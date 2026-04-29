export function StepNavigation({
  onPrevious,
  onNext,
  showPrevious = true,
  nextDisabled = false,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  className = '',
}) {
  return (
    <footer className={`et-step-nav ${className}`.trim()} dir="ltr">
      {showPrevious ? (
        <button type="button" className="ghost step-btn" onClick={onPrevious}>
          {previousLabel}
        </button>
      ) : null}
      <button type="button" className="primary step-btn" onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </button>
    </footer>
  )
}
