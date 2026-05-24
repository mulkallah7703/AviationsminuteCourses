import { motion } from 'framer-motion'
import { useCallback } from 'react'
import { flushSync } from 'react-dom'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCourseProgress } from '../context/CourseProgressContext'
import { CourseSidebar } from '../components/learning/program/CourseSidebar.jsx'
import { LessonView } from '../components/learning/program/LessonView.jsx'
import { Lesson1ChemicalSimulator } from '../components/learning/program/lesson1-quiz/Lesson1ChemicalSimulator.jsx'
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
  const [searchParams] = useSearchParams()
  const unlockLessonId = Number.parseInt(searchParams.get('unlock') ?? '', 10)
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

  const quizDoneForModule = isQuizComplete(moduleId)
  const quizAttemptsForModule = state.quizAttempts?.[String(moduleId)]?.count ?? 0

  /** Finish Lesson 1 quiz → unlock Lesson 2 → open video. Hooks must run before any return. */
  const completeQuizAndOpenNextLesson = useCallback(() => {
    const nextId = moduleId + 1
    const quizDone = isQuizComplete(moduleId)
    const quizAttempts = state.quizAttempts?.[String(moduleId)]?.count ?? 0

    if (moduleId >= PROGRAM_MODULE_COUNT) {
      if (!quizDone && quizAttempts < MAX_QUIZ_ATTEMPTS) {
        flushSync(() => {
          recordQuizAttempt(moduleId)
          markQuizComplete(moduleId)
        })
      }
      recordLessonComplete('chemical')
      navigate('/course/learn?unit=physical&intro=1')
      return
    }

    flushSync(() => {
      if (!quizDone && quizAttempts < MAX_QUIZ_ATTEMPTS) {
        recordQuizAttempt(moduleId)
        markQuizComplete(moduleId)
      }
    })

    navigate(`/course/program/lesson/${nextId}?autoplay=1&unlock=${nextId}`)
  }, [
    moduleId,
    state,
    recordQuizAttempt,
    markQuizComplete,
    recordLessonComplete,
    navigate,
    isQuizComplete,
  ])

  if (!isValidType || !module || moduleIndex === -1) {
    return <Navigate to="/course/program/lesson/1" replace />
  }

  const lessonAllowed =
    type === 'lesson' &&
    (canAccessLesson(state, moduleId) ||
      isLessonVideoComplete(moduleId) ||
      unlockLessonId === moduleId)
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
  const quizDone = quizDoneForModule
  const quizAttempts = quizAttemptsForModule

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

  const goCourseOverview = () => navigate('/course/program/lesson/1')
  const goCourses = () => navigate('/course')
  const goReviewCourse = () => navigate('/course/program/lesson/1')
  const goNextLessonAfterQuiz = () => {
    if (moduleId >= PROGRAM_MODULE_COUNT) {
      navigate('/course/learn?unit=physical&intro=1')
      return
    }
    goLesson(moduleId + 1)
  }

  const handleQuizSubmit = () => {
    if (quizDone) return
    if (quizAttempts >= MAX_QUIZ_ATTEMPTS) return
    recordQuizAttempt(moduleId)
    markQuizComplete(moduleId)
    if (moduleId >= PROGRAM_MODULE_COUNT) {
      recordLessonComplete('chemical')
    }
  }

  const sharedNav = {
    moduleId,
    onReturnToCourses: goCourses,
    onReviewCourse: goReviewCourse,
    onReturnToOverview: goCourseOverview,
    onGoToNextLesson: goNextLessonAfterQuiz,
  }

  return (
    <motion.div
      className="flex min-h-0 w-full max-w-full flex-1 flex-col md:flex-row md:items-start"
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
            quizDoneForModule={isQuizComplete(moduleId)}
            onReturnToCourses={goCourses}
            onReturnToOverview={goCourseOverview}
          />
        ) : moduleId === 1 ? (
          <Lesson1ChemicalSimulator
            title={module.quizTitle}
            moduleIndex={moduleIndex}
            totalModules={PROGRAM_MODULE_COUNT}
            alreadyCompleted={quizDone}
            onPrevious={handleQuizPrevious}
            onSubmitQuiz={handleQuizSubmit}
            onFinishAndContinue={completeQuizAndOpenNextLesson}
            isLastQuiz={moduleId >= PROGRAM_MODULE_COUNT}
            canSubmit={!quizDone && quizAttempts < MAX_QUIZ_ATTEMPTS}
            {...sharedNav}
          />
        ) : (
          <QuizPlaceholder
            title={module.quizTitle}
            moduleIndex={moduleIndex}
            totalModules={PROGRAM_MODULE_COUNT}
            alreadyCompleted={quizDone}
            onPrevious={handleQuizPrevious}
            onSubmitQuiz={handleQuizSubmit}
            isLastQuiz={moduleId >= PROGRAM_MODULE_COUNT}
            canSubmit={!quizDone && quizAttempts < MAX_QUIZ_ATTEMPTS}
            {...sharedNav}
          />
        )}
      </main>
    </motion.div>
  )
}
