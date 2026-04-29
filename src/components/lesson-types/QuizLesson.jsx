import { useState } from 'react'

export function QuizLesson({ content }) {
  const [selected, setSelected] = useState(null)
  const isCorrect = selected === content.correctIndex

  return (
    <div className="lesson-grid single">
      <div className="soft-card">
        <h4>{content.question}</h4>
        <div className="quiz-options">
          {content.options.map((option, index) => (
            <button
              key={option}
              type="button"
              className={`quiz-option ${selected === index ? 'selected' : ''}`}
              onClick={() => setSelected(index)}
            >
              {option}
            </button>
          ))}
        </div>
        {selected !== null ? (
          <p className={`quiz-feedback ${isCorrect ? 'ok' : 'warn'}`}>
            {isCorrect ? 'إجابة صحيحة' : 'حاول مرة أخرى'}
          </p>
        ) : null}
      </div>
    </div>
  )
}
