import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  BONUS_KEYS,
  INTERACTIVE_KEYS,
  LESSON_KEYS,
  TOTAL_UNITS,
  calculatePercent,
  getCompletedUnitCount,
  getMilestoneMessage,
  loadProgressState,
  saveProgressState,
} from '../lib/courseProgressModel'

const CourseProgressContext = createContext(null)

export function CourseProgressProvider({ children }) {
  const [state, setState] = useState(() => loadProgressState())
  const [toast, setToast] = useState('')

  useEffect(() => {
    saveProgressState(state)
  }, [state])

  const percent = useMemo(() => calculatePercent(state), [state])
  const completedUnits = useMemo(() => getCompletedUnitCount(state), [state])
  const milestone = useMemo(() => getMilestoneMessage(percent), [percent])

  const showDeltaToast = useCallback((before, after) => {
    const delta = Math.round((after - before) * 10) / 10
    if (delta > 0) {
      const ds = Number.isInteger(delta) ? String(delta) : delta.toFixed(1)
      setToast(`تم تحديث التقدم +${ds}%`)
      window.setTimeout(() => setToast(''), 3200)
    }
  }, [])

  /** Mark a course unit complete; idempotent. Recalculates % as (completed / TOTAL_UNITS) * 100. */
  const markUnitComplete = useCallback(
    (unitId) => {
      if (!LESSON_KEYS.includes(unitId)) return
      setState((prev) => {
        if (prev.lessons.includes(unitId)) return prev
        const before = calculatePercent(prev)
        const next = { ...prev, lessons: [...prev.lessons, unitId] }
        const after = calculatePercent(next)
        showDeltaToast(before, after)
        return next
      })
    },
    [showDeltaToast],
  )

  /** @deprecated Use markUnitComplete — kept for existing call sites */
  const recordLessonComplete = markUnitComplete

  const recordInteractive = useCallback(
    (id) => {
      if (!INTERACTIVE_KEYS.includes(id)) return
      setState((prev) => {
        if (prev.interactive.includes(id)) return prev
        const before = calculatePercent(prev)
        const next = { ...prev, interactive: [...prev.interactive, id] }
        const after = calculatePercent(next)
        showDeltaToast(before, after)
        return next
      })
    },
    [showDeltaToast],
  )

  const recordQuizPassed = useCallback(() => {
    setState((prev) => {
      if (prev.quizPassed) return prev
      const before = calculatePercent(prev)
      const next = { ...prev, quizPassed: true }
      const after = calculatePercent(next)
      showDeltaToast(before, after)
      return next
    })
  }, [showDeltaToast])

  const recordBonus = useCallback(
    (id) => {
      if (!BONUS_KEYS.includes(id)) return
      setState((prev) => {
        if (prev.bonus.includes(id)) return prev
        const before = calculatePercent(prev)
        const next = { ...prev, bonus: [...prev.bonus, id] }
        const after = calculatePercent(next)
        showDeltaToast(before, after)
        return next
      })
    },
    [showDeltaToast],
  )

  const value = useMemo(
    () => ({
      percent,
      completedUnits,
      totalUnits: TOTAL_UNITS,
      milestone,
      toast,
      markUnitComplete,
      recordLessonComplete,
      recordInteractive,
      recordQuizPassed,
      recordBonus,
      state,
    }),
    [
      percent,
      completedUnits,
      milestone,
      toast,
      markUnitComplete,
      recordLessonComplete,
      recordInteractive,
      recordQuizPassed,
      recordBonus,
      state,
    ],
  )

  return <CourseProgressContext.Provider value={value}>{children}</CourseProgressContext.Provider>
}

export function useCourseProgress() {
  const ctx = useContext(CourseProgressContext)
  if (!ctx) {
    throw new Error('useCourseProgress must be used within CourseProgressProvider')
  }
  return ctx
}

export function useCourseProgressOptional() {
  return useContext(CourseProgressContext)
}
