import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useCourseProgress } from '../context/CourseProgressContext'
import {
  CHEMICAL_COURSE_TITLE,
  CHEMICAL_LESSON_COUNT,
  chemicalLessons,
} from '../data/chemicalLessons'
import { VideoLessonExperience } from '../components/learning/video-lesson/VideoLessonExperience.jsx'

export function ChemicalRisksUnitPage() {
  const navigate = useNavigate()
  const { lesson: lessonParam } = useParams()
  const { recordLessonComplete } = useCourseProgress()

  const lessonNum = Number.parseInt(lessonParam, 10)
  const currentIndex = lessonNum - 1
  const isValidLesson =
    Number.isFinite(lessonNum) && lessonNum >= 1 && lessonNum <= CHEMICAL_LESSON_COUNT

  const goToLesson = (index) => {
    navigate(`/course/chemical-risks/${index + 1}`)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) goToLesson(currentIndex - 1)
  }

  const handleNext = () => {
    if (currentIndex < CHEMICAL_LESSON_COUNT - 1) {
      goToLesson(currentIndex + 1)
      return
    }
    recordLessonComplete('chemical')
    navigate('/course/learn?unit=physical&intro=1')
  }

  const handleLessonComplete = (lessonId) => {
    if (lessonId === CHEMICAL_LESSON_COUNT) {
      recordLessonComplete('chemical')
    }
  }

  if (!isValidLesson) {
    return <Navigate to="/course/chemical-risks/1" replace />
  }

  return (
    <VideoLessonExperience
      courseTitle={CHEMICAL_COURSE_TITLE}
      lessons={chemicalLessons}
      currentIndex={currentIndex}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSelectLesson={goToLesson}
      onLessonComplete={handleLessonComplete}
    />
  )
}
