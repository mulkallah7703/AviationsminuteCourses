import { motion } from 'framer-motion'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useCourseProgress } from '../context/CourseProgressContext'
import { CourseSidebar } from '../components/learning/program/CourseSidebar.jsx'
import { LessonView } from '../components/learning/program/LessonView.jsx'
import { QuizPlaceholder } from '../components/learning/program/QuizPlaceholder.jsx'
import {
  PROGRAM_MODULE_COUNT,
  getModuleById,
  programModules,
} from '../data/programCourse'
import { useProgramProgress } from '../hooks/useProgramProgress'
import {
  canAccessLesson,
  canAccessQuiz,
  getWatchRecord,
} from '../lib/programLocks'
import { MAX_QUIZ_ATTEMPTS } from '../lib/programProgressIntegrity'

export function ProgramCoursePage() {
  const navigate = useNavigate()
  const { type, moduleId: moduleIdParam } = useParams()
  const { recordLessonComplete } = useCourseProgress()
  const progress = useProgramProgress()
  const {
    state,
    percent,
    resumeRoute,
    updateWatchProgress,
    markQuizComplete,
    recordQuizAttempt,
    isLessonVideoComplete,
    isQuizComplete,
  } = progress

  const moduleId = Number.parseInt(moduleIdParam, 10)
  const isValidType = type === 'lesson' || type === 'quiz'
  const module = getModuleById(moduleId)
  const moduleIndex = programModules.findIndex((m) => m.id === moduleId)

  if (!isValidType || !module || moduleIndex === -1) {
    return <Navigate to="/course/program/lesson/1" replace />
  }

  const lessonAllowed =
    type === 'lesson' &&
    (canAccessLesson(state, moduleId) || isLessonVideoComplete(moduleId))
  const quizAllowed =
    type === 'quiz' && (canAccessQuiz(state, moduleId) || isQuizComplete(moduleId))
  if ((type === 'lesson' && !lessonAllowed) || (type === 'quiz' && !quizAllowed)) {
    return <Navigate to={resumeRoute} replace />
  }

  const goLesson = (id) => {
    if (!canAccessLesson(state, id) && !isLessonVideoComplete(id)) return
    navigate(`/course/program/lesson/${id}`)
  }

  const goQuiz = (id) => {
    if (!canAccessQuiz(state, id) && !isQuizComplete(id)) return
    navigate(`/course/program/quiz/${id}`)
  }

  const watchRecord = getWatchRecord(state, moduleId)
  const videoComplete = isLessonVideoComplete(moduleId)
  const quizDone = isQuizComplete(moduleId)
  const quizAttempts = state.quizAttempts?.[String(moduleId)]?.count ?? 0

  const handleWatchProgress = (payload) => {
    updateWatchProgress(moduleId, {
      maxSeconds: payload.maxSeconds,
      durationSeconds: payload.durationSeconds,
      lastPosition: payload.lastPosition,
      completed: Boolean(payload.completed),
      completedAt: payload.completed ? Date.now() : watchRecord?.completedAt ?? null,
    })
  }

  const handleLessonNext = () => {
    if (!videoComplete) return
    goQuiz(moduleId)
  }

  const handleLessonPrevious = () => {
    if (moduleId <= 1) return
    const prevId = moduleId - 1
    if (isQuizComplete(prevId)) goLesson(prevId)
    else if (canAccessQuiz(state, prevId)) goQuiz(prevId)
  }

  const handleQuizPrevious = () => {
    goLesson(moduleId)
  }

  const handleQuizNext = () => {
    if (quizDone) return
    if (quizAttempts >= MAX_QUIZ_ATTEMPTS) return
    recordQuizAttempt(moduleId)
    markQuizComplete(moduleId)
    if (moduleId >= PROGRAM_MODULE_COUNT) {
      recordLessonComplete('chemical')
      navigate('/course/learn?unit=physical&intro=1')
      return
    }
    goLesson(moduleId + 1)
  }

  return (
    <motion.div
      className="flex min-h-0 w-full max-w-full flex-1 flex-col md:flex-row"
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <CourseSidebar
        progressState={state}
        activeType={type}
        activeModuleId={moduleId}
        progressPercent={percent}
        onNavigateLesson={goLesson}
        onNavigateQuiz={goQuiz}
      />

      <main className="min-h-0 min-w-0 w-full max-w-full flex-1 bg-gradient-to-b from-slate-950 via-[#070b14] to-slate-950 text-white">
        {type === 'lesson' ? (
          <LessonView
            module={module}
            moduleIndex={moduleIndex}
            totalModules={PROGRAM_MODULE_COUNT}
            watchRecord={watchRecord}
            videoComplete={videoComplete}
            onWatchProgress={handleWatchProgress}
            onVideoCompleted={() => {
              /* completion persisted via onWatchProgress */
            }}
            onPrevious={handleLessonPrevious}
            onNext={handleLessonNext}
            canGoPrevious={moduleId > 1}
          />
        ) : (
          <QuizPlaceholder
            title={module.quizTitle}
            moduleIndex={moduleIndex}
            totalModules={PROGRAM_MODULE_COUNT}
            alreadyCompleted={quizDone}
            onPrevious={handleQuizPrevious}
            onNext={handleQuizNext}
            isLastQuiz={moduleId >= PROGRAM_MODULE_COUNT}
            canSubmit={!quizDone && quizAttempts < MAX_QUIZ_ATTEMPTS}
          />
        )}
      </main>
    </motion.div>
  )
}
