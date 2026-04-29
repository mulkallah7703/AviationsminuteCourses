export function Accordion({ id, title, content, isOpen, onToggle }) {
  return (
    <div className={`lesson-accordion-item ${isOpen ? 'open' : ''}`}>
      <button type="button" className="lesson-accordion-trigger" onClick={() => onToggle(id)}>
        <span className="lesson-accordion-chevron" aria-hidden="true">
          ˅
        </span>
        <span className="lesson-accordion-title">{title}</span>
      </button>
      {isOpen ? (
        <div className="lesson-accordion-panel">
          <p>{content}</p>
        </div>
      ) : null}
    </div>
  )
}
