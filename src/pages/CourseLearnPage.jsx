import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { learningUnits } from '../data/courseData'
import { LearningLayout } from '../components/learning/LearningLayout'

export function CourseLearnPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [startedUnits, setStartedUnits] = useState([])
  const [isInteractiveStep, setIsInteractiveStep] = useState(false)
  const [lessonIndexInModule, setLessonIndexInModule] = useState(1)

  const currentUnitKey = searchParams.get('unit') ?? 'chemical'
  const showPhysicalModuleIntro = currentUnitKey === 'physical' && searchParams.get('intro') === '1'
  const showPhysicalRisksPage2 = currentUnitKey === 'physical' && searchParams.get('page') === '2'

  const activeUnit = useMemo(
    () => learningUnits.find((unit) => unit.key === currentUnitKey) ?? learningUnits[0],
    [currentUnitKey],
  )

  const progressPercent = Math.round((startedUnits.length / learningUnits.length) * 100)
  const activeUnitIndex = learningUnits.findIndex((unit) => unit.key === activeUnit.key)
  const selectUnit = (unitKey) => {
    if (unitKey === 'extreme-temperature') {
      navigate('/course/extreme-temperature/1')
      return
    }
    if (unitKey === 'vibration') {
      navigate('/course/vibration-risks/1')
      return
    }
    if (unitKey === 'electricity') {
      navigate('/course/electrical-risks/1')
      return
    }
    if (unitKey === 'xray') {
      navigate('/course/radiation-risks/1')
      return
    }
    setSearchParams({ unit: unitKey })
  }

  const goToNext = () => {
    const next = learningUnits[activeUnitIndex + 1]
    if (next) {
      setSearchParams({ unit: next.key })
      setIsInteractiveStep(false)
    }
  }

  const handleLessonFlowFinish = () => {
    if (activeUnit.key === 'chemical') {
      setSearchParams({ unit: 'physical', intro: '1' })
      setIsInteractiveStep(false)
      setLessonIndexInModule(1)
      return
    }
    goToNext()
  }

  const handlePhysicalModuleIntroNext = () => {
    setSearchParams({ unit: 'physical', page: '2' })
    setLessonIndexInModule((n) => n + 1)
  }

  const startLesson = () => {
    setStartedUnits((current) => {
      if (current.includes(activeUnit.key)) return current
      return [...current, activeUnit.key]
    })
    setIsInteractiveStep(true)
  }

  useEffect(() => {
    setIsInteractiveStep(false)
    setLessonIndexInModule(1)
  }, [activeUnit.key])

  return (
    <LearningLayout
      units={learningUnits}
      activeUnit={activeUnit}
      onSelectUnit={selectUnit}
      progressPercent={progressPercent}
      onNextLesson={goToNext}
      onFinishLessonFlow={handleLessonFlowFinish}
      onStartLesson={startLesson}
      canGoNext={activeUnitIndex < learningUnits.length - 1}
      isInteractiveStep={isInteractiveStep}
      onExitInteractiveStep={() => setIsInteractiveStep(false)}
      showPhysicalModuleIntro={showPhysicalModuleIntro}
      onPhysicalModuleIntroNext={handlePhysicalModuleIntroNext}
      showPhysicalRisksPage2={showPhysicalRisksPage2}
      lessonIndexInModule={lessonIndexInModule}
    />
  )
}
