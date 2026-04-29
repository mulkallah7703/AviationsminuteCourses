export function CourseAccordion({ sections, openId, onToggle }) {
  return (
    <div className="lesson-accordions-list vr-accordion-wrap">
      {sections.map((sec) => {
        const open = openId === sec.id
        return (
          <div key={sec.id} className={`lesson-accordion-item ${open ? 'open' : ''}`}>
            <button
              type="button"
              className="lesson-accordion-trigger"
              dir="rtl"
              onClick={() => onToggle(sec.id)}
            >
              <span className="lesson-accordion-chevron" aria-hidden>
                ˅
              </span>
              <span className="lesson-accordion-title">{sec.title}</span>
            </button>
            {open ? (
              <div className="lesson-accordion-panel">
                <ul className="vr-accordion-bullets">
                  {sec.bullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
