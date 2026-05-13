import { useCallback, useEffect, useMemo, useState } from 'react'
import { getTotalProgramSteps } from '../data/programCourse'
import {
  PROGRESS_STORAGE_VERSION,
  attachChecksum,
  validateProgressChecksum,
} from '../lib/programProgressIntegrity'
import {
  canAccessLesson,
  canAccessQuiz,
  getResumeRoute,
  isLessonVideoComplete,
  isQuizComplete,
} from '../lib/programLocks'

const LS_KEY = 'lms-program-progress'

const EMPTY_STATE = {
  version: PROGRESS_STORAGE_VERSION,
  lessons: [],
  quizzes: [],
  watch: {},
  quizAttempts: {},
  checksum: '',
}

function normalizeLoaded(raw) {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_STATE, checksum: '' }
  if (!validateProgressChecksum(raw)) {
    console.warn('[progress] integrity check failed — resetting program progress')
    return { ...EMPTY_STATE, checksum: '' }
  }
  return {
    version: PROGRESS_STORAGE_VERSION,
    lessons: Array.isArray(raw.lessons) ? [...new Set(raw.lessons)].sort((a, b) => a - b) : [],
    quizzes: Array.isArray(raw.quizzes) ? [...new Set(raw.quizzes)].sort((a, b) => a - b) : [],
    watch: raw.watch && typeof raw.watch === 'object' ? raw.watch : {},
    quizAttempts: raw.quizAttempts && typeof raw.quizAttempts === 'object' ? raw.quizAttempts : {},
    checksum: raw.checksum,
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return attachChecksum({ ...EMPTY_STATE })
    return normalizeLoaded(JSON.parse(raw))
  } catch {
    return attachChecksum({ ...EMPTY_STATE })
  }
}

function persistState(state) {
  try {
    const sealed = attachChecksum(state)
    localStorage.setItem(LS_KEY, JSON.stringify(sealed))
    return sealed
  } catch {
    return state
  }
}

export function useProgramProgress() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    persistState(state)
  }, [state])

  const updateWatchProgress = useCallback((moduleId, patch) => {
    const key = String(moduleId)
    setState((prev) => {
      const prevRec = prev.watch[key] ?? {
        maxSeconds: 0,
        durationSeconds: 0,
        lastPosition: 0,
        completed: false,
        completedAt: null,
      }
      const nextRec = { ...prevRec, ...patch }
      const next = {
        ...prev,
        watch: { ...prev.watch, [key]: nextRec },
      }
      if (nextRec.completed && !prev.lessons.includes(moduleId)) {
        next.lessons = [...prev.lessons, moduleId].sort((a, b) => a - b)
      }
      return next
    })
  }, [])

  const markLessonComplete = useCallback((moduleId) => {
    setState((prev) => {
      const key = String(moduleId)
      const rec = prev.watch[key]
      if (!rec?.completed) return prev
      if (prev.lessons.includes(moduleId)) return prev
      return { ...prev, lessons: [...prev.lessons, moduleId].sort((a, b) => a - b) }
    })
  }, [])

  const markQuizComplete = useCallback((moduleId) => {
    setState((prev) => {
      if (prev.quizzes.includes(moduleId)) return prev
      const key = String(moduleId)
      const attempts = prev.quizAttempts[key]?.count ?? 0
      return {
        ...prev,
        quizzes: [...prev.quizzes, moduleId].sort((a, b) => a - b),
        quizAttempts: {
          ...prev.quizAttempts,
          [key]: {
            count: Math.max(attempts, 1),
            completedAt: Date.now(),
          },
        },
      }
    })
  }, [])

  const recordQuizAttempt = useCallback((moduleId) => {
    const key = String(moduleId)
    setState((prev) => {
      const count = (prev.quizAttempts[key]?.count ?? 0) + 1
      return {
        ...prev,
        quizAttempts: {
          ...prev.quizAttempts,
          [key]: { ...prev.quizAttempts[key], count, lastAttemptAt: Date.now() },
        },
      }
    })
  }, [])

  const percent = useMemo(() => {
    const done = state.lessons.length + state.quizzes.length
    const total = getTotalProgramSteps()
    return total > 0 ? Math.round((done / total) * 100) : 0
  }, [state.lessons.length, state.quizzes.length])

  const resumeRoute = useMemo(() => getResumeRoute(state), [state])

  return {
    state,
    percent,
    resumeRoute,
    updateWatchProgress,
    markLessonComplete,
    markQuizComplete,
    recordQuizAttempt,
    canAccessLesson: useCallback((id) => canAccessLesson(state, id), [state]),
    canAccessQuiz: useCallback((id) => canAccessQuiz(state, id), [state]),
    isLessonVideoComplete: useCallback((id) => isLessonVideoComplete(state, id), [state]),
    isLessonComplete: useCallback((id) => isLessonVideoComplete(state, id), [state]),
    isQuizComplete: useCallback((id) => isQuizComplete(state, id), [state]),
  }
}
