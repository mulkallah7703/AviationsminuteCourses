import { ActionFooter } from './ActionFooter'
import { FinalLessonCompletion } from './FinalLessonCompletion'
import { FinalInteractiveExam } from './FinalInteractiveExam'
import { LessonContent } from './LessonContent'
import { LessonHeader } from './LessonHeader'
import { LessonMeta } from './LessonMeta'
import { LessonFlow } from './lesson-flow/LessonFlow'
import { ModuleIntroPhysical } from './ModuleIntroPhysical'
import { ModulePhysicalRisksPage2 } from './ModulePhysicalRisksPage2'
import { SidebarNavigation } from './SidebarNavigation'

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
        ) : isInteractiveStep && activeUnit.key === 'chemical' ? (
          <LessonFlow onExit={onExitInteractiveStep} onFinish={onFinishLessonFlow} />
        ) : isInteractiveStep && activeUnit.key === 'interactive-assessment' ? (
          <FinalInteractiveExam onExitToCourse={() => onExitInteractiveStep()} />
        ) : activeUnit.key === 'interactive-assessment' ? (
          <FinalLessonCompletion
            onPrimaryAction={onStartLesson}
            onReviewLessons={() => onSelectUnit('chemical')}
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
              canStartLesson={activeUnit.key === 'chemical'}
            />
          </>
        )}
      </main>
    </div>
  )
}
