export function ClassificationCard({
  card,
  isSelected,
  assignedEffectLabel,
  isInfoOpen,
  onClick,
  onToggleInfo,
}) {
  return (
    <button
      type="button"
      className={`classification-card-item ${isSelected ? 'active' : ''}`}
      onClick={onClick}
    >
      <button
        type="button"
        className={`classification-card-refresh ${isInfoOpen ? 'active' : ''}`}
        aria-label={`معلومات إضافية حول ${card.title}`}
        onClick={(event) => {
          event.stopPropagation()
          onToggleInfo()
        }}
      >
        ↻
      </button>
      <span className="classification-card-icon" aria-hidden="true">
        {card.icon}
      </span>
      <span className="classification-card-title">{card.title}</span>
      {assignedEffectLabel ? (
        <span className="classification-card-match">{assignedEffectLabel}</span>
      ) : null}
      <div className={`classification-info-pop ${isInfoOpen ? 'open' : ''}`} role="status" aria-live="polite">
        {card.info}
      </div>
    </button>
  )
}
