export function FlipCard({ option, isFlipped, onToggle }) {
  return (
    <button
      type="button"
      className={`lesson-step-card flip-card ${isFlipped ? 'active is-flipped' : ''}`}
      onClick={onToggle}
    >
      <div className="flip-card-inner">
        <div className="flip-card-face flip-card-face-front">
          <span className="step-card-refresh" aria-hidden="true">
            ↻
          </span>
          <span className="step-card-icon" aria-hidden="true">
            {option.icon}
          </span>
          <span className="step-card-title">{option.title}</span>
        </div>

        <div className="flip-card-face flip-card-face-back">
          <span className="step-card-refresh" aria-hidden="true">
            ↻
          </span>
          <span className="step-card-title">{option.title}</span>
          <p className="step-card-description">{option.description}</p>
        </div>
      </div>
    </button>
  )
}
