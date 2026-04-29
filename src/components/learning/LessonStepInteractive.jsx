import { useState } from 'react'
import { FlipCard } from './FlipCard'

const stepOptions = [
  {
    id: 'hazardous-materials',
    icon: '⚗️',
    title: 'المواد الكيميائية الخطرة',
    description: 'تشمل مواد سامة أو قابلة للاشتعال قد تسبب إصابات خطيرة عند التعرض.',
  },
  {
    id: 'health-effects',
    icon: '🧠',
    title: 'تأثيرات على الصحة',
    description: 'قد تسبب التسمم، الحروق، أو مشاكل تنفسية عند التعرض.',
  },
  {
    id: 'environment-effects',
    icon: '🌱',
    title: 'تأثيرات على البيئة',
    description: 'تؤدي إلى تلوث الهواء والمياه والتربة وتؤثر على البيئة.',
  },
  {
    id: 'fire-risks',
    icon: '🔥',
    title: 'مخاطر الحرائق',
    description: 'قد تسبب حرائق أو انفجارات بسبب سوء التخزين أو الاستخدام.',
  },
]

export function LessonStepInteractive({ onPrevious, onNext }) {
  const [activeCard, setActiveCard] = useState(null)

  return (
    <section className="lesson-step-screen fade-slide-in">
      <header className="lesson-step-brand">
        <strong>NCMS</strong>
      </header>

      <div className="lesson-step-main">
        <h2>لماذا يجب أن نهتم بالكيميائية في بيئة العمل؟</h2>
        <p>
          في هذا الدرس، نستعرض المواد الكيميائية الشائعة والأخطار المحتملة لها داخل بيئة العمل،
          وكيفية الوقاية منها لحماية الأفراد والمكان.
        </p>

        <div className="lesson-step-grid">
          {stepOptions.map((option) => (
            <FlipCard
              key={option.id}
              option={option}
              isFlipped={activeCard === option.id}
              onToggle={() =>
                setActiveCard((current) => (current === option.id ? null : option.id))
              }
            />
          ))}
        </div>
      </div>

      <footer className="lesson-step-actions">
        <button type="button" className="ghost step-btn" onClick={onPrevious}>
          Previous
        </button>
        <button type="button" className="primary step-btn" onClick={onNext}>
          Next
        </button>
      </footer>
    </section>
  )
}
