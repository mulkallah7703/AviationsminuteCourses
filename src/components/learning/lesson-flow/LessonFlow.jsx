import { useMemo, useState } from 'react'
import { LessonLayoutWrapper } from './LessonLayoutWrapper'
import { LessonIntro } from './LessonIntro'
import { LessonCards } from './LessonCards'
import { LessonClassification } from './LessonClassification'
import { LessonVideo } from './LessonVideo'
import { LessonAccordionsImage } from './LessonAccordionsImage'
import { LessonSummary } from './LessonSummary'

export function LessonFlow({ onExit, onFinish }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [activeInfoCard, setActiveInfoCard] = useState(null)
  const [activeClassificationCard, setActiveClassificationCard] = useState(null)
  const [classificationSelection, setClassificationSelection] = useState({})
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isVideoComplete, setIsVideoComplete] = useState(false)

  const steps = useMemo(
    () => [
      {
        id: 'intro',
        render: () => <LessonIntro />,
      },
      {
        id: 'cards',
        render: () => (
          <LessonCards
            activeCard={activeInfoCard}
            onToggleCard={(cardId) =>
              setActiveInfoCard((current) => (current === cardId ? null : cardId))
            }
          />
        ),
      },
      {
        id: 'classification',
        render: () => (
          <LessonClassification
            selectedCardId={activeClassificationCard}
            assignedEffects={classificationSelection}
            onSelectCard={(cardId) => {
              setActiveClassificationCard(cardId)
              setHasInteracted(true)
            }}
            onAssignEffect={(effectId) => {
              if (!activeClassificationCard) return
              setHasInteracted(true)
              setClassificationSelection((current) => {
                const next = { ...current }
                for (const [cardId, assignedId] of Object.entries(current)) {
                  if (assignedId === effectId) {
                    delete next[cardId]
                  }
                }
                next[activeClassificationCard] = effectId
                return next
              })
            }}
          />
        ),
      },
      {
        id: 'video',
        render: () => <LessonVideo onVideoEnded={() => setIsVideoComplete(true)} />,
      },
      {
        id: 'accordions-image',
        render: () => <LessonAccordionsImage />,
      },
      {
        id: 'summary-carousel',
        render: () => <LessonSummary />,
      },
    ],
    [activeClassificationCard, activeInfoCard, classificationSelection],
  )

  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1
  const isClassificationStep = steps[currentStep].id === 'classification'
  const isVideoStep = steps[currentStep].id === 'video'

  const handleNext = () => {
    if (isLast) {
      onFinish()
      return
    }
    setCurrentStep((step) => step + 1)
  }

  const handlePrevious = () => {
    if (isFirst) {
      onExit()
      return
    }
    setCurrentStep((step) => step - 1)
  }

  return (
    <LessonLayoutWrapper
      onPrevious={handlePrevious}
      onNext={handleNext}
      isNextDisabled={isVideoStep && !isVideoComplete}
    >
      <div key={steps[currentStep].id} className="lesson-flow-step">
        {steps[currentStep].render()}
      </div>
    </LessonLayoutWrapper>
  )
}
