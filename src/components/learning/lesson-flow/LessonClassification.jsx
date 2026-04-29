import { useEffect, useRef, useState } from 'react'
import { ClassificationCard } from './ClassificationCard'

const classificationCards = [
  {
    id: 'hazardous-materials',
    icon: '⚗️',
    title: 'المواد الكيميائية الخطرة',
    info: 'تشمل المواد السامة، القابلة للاشتعال أو التفاعل، والتي قد تشكل خطرًا مباشرًا على الإنسان أو البيئة في حال سوء الاستخدام.',
  },
  {
    id: 'health-effects',
    icon: '🧠',
    title: 'تأثيرات على الصحة',
    info: 'تتضمن التأثيرات قصيرة وطويلة المدى على جسم الإنسان، مثل التسمم، الأمراض المزمنة، أو التأثير على الأجهزة الحيوية.',
  },
  {
    id: 'environment-effects',
    icon: '🌱',
    title: 'تأثيرات على البيئة',
    info: 'قد تؤدي المواد الكيميائية إلى تلوث الهواء أو المياه أو التربة، مما يؤثر على الكائنات الحية والتوازن البيئي.',
  },
  {
    id: 'fire-risks',
    icon: '🔥',
    title: 'مخاطر الحرائق',
    info: 'بعض المواد الكيميائية قابلة للاشتعال أو الانفجار، مما يزيد من احتمالية حدوث حرائق خطيرة في بيئة العمل.',
  },
]

const effectItems = [
  {
    id: 'cancer',
    label: 'السرطان',
    details:
      'بعض المواد الكيميائية تُصنف كمسرطنة، حيث يمكن أن تؤدي إلى تغيرات في الخلايا على المدى الطويل، مما يزيد من احتمالية الإصابة بأنواع مختلفة من السرطان عند التعرض المستمر دون حماية.',
  },
  {
    id: 'respiratory',
    label: 'مشاكل الجهاز التنفسي',
    details:
      'استنشاق الأبخرة أو الغازات الكيميائية قد يسبب تهيجًا في الجهاز التنفسي، مثل السعال وضيق التنفس، وقد يتطور إلى أمراض مزمنة مثل الربو أو تلف الرئة.',
  },
  {
    id: 'digestive',
    label: 'مشاكل الجهاز الهضمي',
    details:
      'ابتلاع المواد الكيميائية أو انتقالها عبر الأيدي الملوثة قد يؤدي إلى اضطرابات في الجهاز الهضمي، مثل التسمم، الغثيان، أو تلف الأعضاء الداخلية.',
  },
  {
    id: 'skin',
    label: 'مشاكل الجلد',
    details:
      'التعرض المباشر لبعض المواد الكيميائية قد يسبب التهابات جلدية، حروق كيميائية، أو حساسية مزمنة، خاصة في حال عدم استخدام معدات الحماية.',
  },
  {
    id: 'eye',
    label: 'تهيج العين',
    details:
      'ملامسة المواد الكيميائية للعين قد تسبب احمرارًا شديدًا، ألمًا، أو تلفًا في القرنية، مما قد يؤدي إلى ضعف أو فقدان البصر في الحالات الخطرة.',
  },
]

export function LessonClassification({
  selectedCardId,
  assignedEffects,
  onSelectCard,
  onAssignEffect,
}) {
  const [expandedEffectId, setExpandedEffectId] = useState(null)
  const [activeInfoCardId, setActiveInfoCardId] = useState(null)
  const rootRef = useRef(null)

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setActiveInfoCardId(null)
      }
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <div className="lesson-classification-step" ref={rootRef}>
      <header className="classification-header">
        <h2>تصنيف المواد الكيميائية</h2>
        <p>يرجى تصنيف كل نوع من الأنواع الكيميائية التالية بالتأثير الصحيح من ضمن الفئات المحددة</p>
      </header>

      <div className="classification-layout">
        <div className="classification-effects-list">
          {effectItems.map((effect) => {
            const matchedCard = Object.entries(assignedEffects).find(([, value]) => value === effect.id)
            const isActive = selectedCardId && assignedEffects[selectedCardId] === effect.id
            const isOpen = expandedEffectId === effect.id
            return (
              <article key={effect.id} className={`classification-effect-row ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className={`classification-effect-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setExpandedEffectId((current) => (current === effect.id ? null : effect.id))
                    onAssignEffect(effect.id)
                  }}
                >
                  <span>{effect.label}</span>
                  <span className={`classification-effect-icon ${isOpen ? 'open' : ''}`} aria-hidden="true">
                    ˅
                  </span>
                  {matchedCard ? <span className="classification-effect-badge" /> : null}
                </button>
                <div className="classification-effect-panel" dir="rtl">
                  <p>{effect.details}</p>
                </div>
              </article>
            )
          })}
        </div>

        <div className="classification-cards-grid">
          {classificationCards.map((card) => {
            const assignedEffectId = assignedEffects[card.id]
            const assignedEffectLabel = effectItems.find((effect) => effect.id === assignedEffectId)?.label
            return (
              <ClassificationCard
                key={card.id}
                card={card}
                isSelected={selectedCardId === card.id}
                assignedEffectLabel={assignedEffectLabel}
                isInfoOpen={activeInfoCardId === card.id}
                onClick={() => onSelectCard(card.id)}
                onToggleInfo={() =>
                  setActiveInfoCardId((current) => (current === card.id ? null : card.id))
                }
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
