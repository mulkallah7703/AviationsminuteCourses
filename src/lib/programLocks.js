import { programModules } from '../data/programCourse'
import { MAX_QUIZ_ATTEMPTS } from './programProgressIntegrity'

export function getWatchRecord(state, moduleId) {
  return state.watch?.[String(moduleId)] ?? null
}

export function isLessonVideoComplete(state, moduleId) {
  if (state.lessons.includes(moduleId)) return true
  const rec = getWatchRecord(state, moduleId)
  return Boolean(rec?.completed)
}

export function isQuizComplete(state, moduleId) {
  return state.quizzes.includes(moduleId)
}

export function getQuizAttempts(state, moduleId) {
  return state.quizAttempts?.[String(moduleId)]?.count ?? 0
}

export function isQuizLockedAfterAttempts(state, moduleId) {
  if (isQuizComplete(state, moduleId)) return true
  return getQuizAttempts(state, moduleId) >= MAX_QUIZ_ATTEMPTS
}

/** Lesson 1 always open; lesson N requires quiz N-1 complete. */
export function canAccessLesson(state, moduleId) {
  if (moduleId <= 1) return true
  return isQuizComplete(state, moduleId - 1)
}

/** Quiz N requires lesson N video fully watched. */
export function canAccessQuiz(state, moduleId) {
  return isLessonVideoComplete(state, moduleId)
}

export function getLessonLockReason(state, moduleId) {
  if (canAccessLesson(state, moduleId)) return null
  return `أكمل اختبار الدرس ${moduleId - 1} أولاً`
}

export function getQuizLockReason(state, moduleId) {
  if (isQuizComplete(state, moduleId)) return 'تم إكمال الاختبار'
  if (!canAccessQuiz(state, moduleId)) return 'شاهد الدرس بالكامل لفتح الاختبار'
  if (isQuizLockedAfterAttempts(state, moduleId)) return 'لا توجد محاولات متبقية'
  return null
}

export function getStepStatus(state, kind, moduleId, activeType, activeModuleId) {
  const isActive =
    (kind === 'lesson' && activeType === 'lesson' && activeModuleId === moduleId) ||
    (kind === 'quiz' && activeType === 'quiz' && activeModuleId === moduleId)

  if (kind === 'lesson') {
    if (!canAccessLesson(state, moduleId)) return 'locked'
    if (isLessonVideoComplete(state, moduleId)) return 'completed'
    if (isActive) return 'active'
    return 'available'
  }

  if (!canAccessQuiz(state, moduleId) && !isQuizComplete(state, moduleId)) return 'locked'
  if (isQuizComplete(state, moduleId)) return 'completed'
  if (isActive) return 'active'
  return 'available'
}

/** First incomplete step — used for URL bypass redirects. */
export function getResumeRoute(state) {
  for (const mod of programModules) {
    if (!canAccessLesson(state, mod.id)) {
      return `/course/program/quiz/${mod.id - 1}`
    }
    if (!isLessonVideoComplete(state, mod.id)) {
      return `/course/program/lesson/${mod.id}`
    }
    if (!canAccessQuiz(state, mod.id)) {
      return `/course/program/lesson/${mod.id}`
    }
    if (!isQuizComplete(state, mod.id)) {
      return `/course/program/quiz/${mod.id}`
    }
  }
  return `/course/program/quiz/${programModules[programModules.length - 1].id}`
}
