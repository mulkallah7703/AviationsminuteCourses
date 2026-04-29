export function LessonActions({
  onComplete,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}) {
  return (
    <div className="lesson-actions">
      <button type="button" className="ghost" onClick={onPrevious} disabled={!canGoPrevious}>
        السابق
      </button>
      <div className="action-right">
        <button type="button" className="ghost" onClick={onComplete}>
          تم الإكمال
        </button>
        <button type="button" className="primary" onClick={onNext} disabled={!canGoNext}>
          التالي
        </button>
      </div>
    </div>
  )
}
