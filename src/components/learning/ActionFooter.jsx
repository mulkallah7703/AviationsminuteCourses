export function ActionFooter({ onStartLesson, onNextLesson, canGoNext, canStartLesson = true }) {
  return (
    <footer className="lesson-action-footer">
      <button type="button" className="ghost" onClick={onNextLesson} disabled={!canGoNext}>
        التالي
      </button>
      <button
        type="button"
        className="primary lesson-start"
        onClick={onStartLesson}
        disabled={!canStartLesson}
      >
        ابدأ الدرس
      </button>
    </footer>
  )
}
