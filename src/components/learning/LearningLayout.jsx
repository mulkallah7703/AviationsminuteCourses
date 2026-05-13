import { useNavigate } from 'react-router-dom'
import { ActionFooter } from './ActionFooter'
import { FinalLessonCompletion } from './FinalLessonCompletion'
import { FinalInteractiveExam } from './FinalInteractiveExam'
import { LessonContent } from './LessonContent'
import { LessonHeader } from './LessonHeader'
import { LessonMeta } from './LessonMeta'
import { ModuleIntroPhysical } from './ModuleIntroPhysical'
import { ModulePhysicalRisksPage2 } from './ModulePhysicalRisksPage2'
import { SidebarNavigation } from './SidebarNavigation'
import { getUnitPath } from '../../lib/unitNavigation'

export function LearningLayout({
  units,
  activeUnit,
  onSelectUnit,
  progressPercent,
  onNextLesson,
  onFinishLessonFlow,
  onStartLesson,
  canGoNext,
  isInteractiveStep,
  onExitInteractiveStep,
  showPhysicalModuleIntro,
  onPhysicalModuleIntroNext,
  onPhysicalModuleIntroBack,
  showPhysicalRisksPage2,
  onPhysicalRisksPage2Back,
  lessonIndexInModule,
}) {
  const navigate = useNavigate()

  return (
    <div className="learning-layout">
      <SidebarNavigation
        units={units}
        activeUnitKey={activeUnit.key}
        onSelectUnit={onSelectUnit}
        progressPercent={progressPercent}
        courseHeading="برنامج التوعية التفاعلي: التعرف على أنواع المخاطر المهنية والاستجابة الآمنة"
      />

      <main className="learning-main">
        {showPhysicalRisksPage2 ? (
          <ModulePhysicalRisksPage2 onPrevious={onPhysicalRisksPage2Back} />
        ) : showPhysicalModuleIntro ? (
          <ModuleIntroPhysical
            onNext={onPhysicalModuleIntroNext}
            onPrevious={onPhysicalModuleIntroBack}
            lessonStep={lessonIndexInModule}
          />
        ) : isInteractiveStep && activeUnit.key === 'interactive-assessment' ? (
          <FinalInteractiveExam onExitToCourse={() => onExitInteractiveStep()} />
        ) : activeUnit.key === 'interactive-assessment' ? (
          <FinalLessonCompletion
            onPrimaryAction={onStartLesson}
            onReviewLessons={() => navigate(getUnitPath('chemical'))}
          />
        ) : (
          <>
            <LessonHeader
              title={activeUnit.shortTitle}
              lessonIndex={activeUnit.order}
              totalLessons={units.length}
            />
            <LessonMeta
              lessonIndex={activeUnit.order}
              totalLessons={units.length}
              duration={activeUnit.duration}
              progressPercent={progressPercent}
            />
            <LessonContent unit={activeUnit} />
            <ActionFooter
              onStartLesson={onStartLesson}
              onNextLesson={onNextLesson}
              canGoNext={canGoNext}
              canStartLesson={false}
            />
          </>
        )}
      </main>
    </div>
  )
}
