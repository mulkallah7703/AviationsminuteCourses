import { useState } from 'react'

export function AccordionLesson({ content }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="lesson-grid single">
      <div className="soft-card">
        <h4>محتوى قابل للتوسيع</h4>
        {content.sections.map((section, index) => (
          <div key={section.title} className="accordion-item">
            <button
              type="button"
              className="accordion-trigger"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <span>{section.title}</span>
              <span>{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index ? <p className="accordion-content">{section.body}</p> : null}
          </div>
        ))}
      </div>
    </div>
  )
}
