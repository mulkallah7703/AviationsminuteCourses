import { IntroLesson } from './lesson-types/IntroLesson'
import { ContentImageLesson } from './lesson-types/ContentImageLesson'
import { ContentAudioLesson } from './lesson-types/ContentAudioLesson'
import { AccordionLesson } from './lesson-types/AccordionLesson'
import { QuizLesson } from './lesson-types/QuizLesson'
import { DragDropLesson } from './lesson-types/DragDropLesson'
import { SummaryLesson } from './lesson-types/SummaryLesson'
import { LessonActions } from './ui/LessonActions'

const lessonMap = {
  intro: IntroLesson,
  'content-image': ContentImageLesson,
  'content-audio': ContentAudioLesson,
  accordion: AccordionLesson,
  quiz: QuizLesson,
  'drag-drop': DragDropLesson,
  summary: SummaryLesson,
}

export function LessonRenderer({
  lesson,
  onComplete,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}) {
  const Template = lessonMap[lesson.type]
  return (
    <section className="lesson-area">
      <article key={lesson.id} className="lesson-card fade-slide-in">
        <div className="lesson-header">
          <span className="lesson-pill">{lesson.unitTitle}</span>
          <h3>{lesson.title}</h3>
        </div>
        {Template ? <Template content={lesson.content} /> : <p>لا يوجد قالب لهذا الدرس.</p>}
      </article>
      <LessonActions
        onComplete={onComplete}
        onNext={onNext}
        onPrevious={onPrevious}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
      />
    </section>
  )
}
