import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LESSON1_STEPS } from '../../../../data/lesson1ChemicalQuizData.js'

export const INTRO_INDEX = 0
export const RESULTS_INDEX = LESSON1_STEPS.length - 1

export const SCORABLE_STEPS = LESSON1_STEPS.filter(
  (s) => s.type !== 'intro' && s.type !== 'results',
)

export const SCORABLE_STEP_INDICES = LESSON1_STEPS.map((s, i) =>
  s.type !== 'intro' && s.type !== 'results' ? i : -1,
).filter((i) => i >= 0)

const emptySnapshot = () => ({
  phase: 'active',
  selectedId: null,
  feedback: null,
  consequence: null,
  hazardMatches: {},
  orderIds: [],
  tfIndex: 0,
  tfCorrectCount: 0,
  tfAnswered: [],
})

export function useLesson1QuizFlow() {
  const [stepIndex, setStepIndex] = useState(INTRO_INDEX)
  const [snapshots, setSnapshots] = useState({})
  const scoredRef = useRef(new Set())
  const stepStartedAt = useRef(Date.now())

  const step = LESSON1_STEPS[stepIndex]
  const scorableIndex = SCORABLE_STEPS.findIndex((s) => s.id === step?.id)
  const isIntro = step?.type === 'intro'
  const isResults = step?.type === 'results'
  const isQuestion = !isIntro && !isResults

  const current = snapshots[step?.id] ?? emptySnapshot()

  const persistCurrent = useCallback(
    (patch) => {
      if (!step?.id) return
      setSnapshots((prev) => ({
        ...prev,
        [step.id]: { ...(prev[step.id] ?? emptySnapshot()), ...patch },
      }))
    },
    [step?.id],
  )

  const patchCurrent = useCallback(
    (patch) => {
      if (!step?.id) return
      setSnapshots((prev) => {
        const base = prev[step.id] ?? emptySnapshot()
        const next = typeof patch === 'function' ? patch(base) : { ...base, ...patch }
        return { ...prev, [step.id]: next }
      })
    },
    [step?.id],
  )

  const answeredCount = useMemo(
    () => SCORABLE_STEPS.filter((s) => snapshots[s.id]?.phase === 'feedback').length,
    [snapshots],
  )

  const progressPercent = Math.round((answeredCount / SCORABLE_STEPS.length) * 100)

  const isStepAnswered = useCallback(
    (stepId) => snapshots[stepId]?.phase === 'feedback',
    [snapshots],
  )

  const goToStepIndex = useCallback((index) => {
    const clamped = Math.max(0, Math.min(index, LESSON1_STEPS.length - 1))
    setStepIndex(clamped)
    stepStartedAt.current = Date.now()
  }, [])

  const resetFlow = useCallback(() => {
    scoredRef.current = new Set()
    setSnapshots({})
    setStepIndex(INTRO_INDEX)
    stepStartedAt.current = Date.now()
  }, [])

  const goToScorable = useCallback(
    (idx) => {
      const stepIdx = SCORABLE_STEP_INDICES[idx]
      if (stepIdx != null) goToStepIndex(stepIdx)
    },
    [goToStepIndex],
  )

  const goNextQuestion = useCallback(() => {
    if (isResults) return
    if (isIntro) {
      goToStepIndex(1)
      return
    }
    if (scorableIndex < SCORABLE_STEPS.length - 1) {
      goToScorable(scorableIndex + 1)
    } else {
      goToStepIndex(RESULTS_INDEX)
    }
  }, [isIntro, isResults, scorableIndex, goToScorable, goToStepIndex])

  const goPrevQuestion = useCallback(() => {
    if (isIntro) return
    if (isResults) {
      goToScorable(SCORABLE_STEPS.length - 1)
      return
    }
    if (scorableIndex > 0) {
      goToScorable(scorableIndex - 1)
    } else {
      goToStepIndex(INTRO_INDEX)
    }
  }, [isIntro, isResults, scorableIndex, goToScorable, goToStepIndex])

  const markScored = useCallback((stepId) => {
    if (scoredRef.current.has(stepId)) return false
    scoredRef.current.add(stepId)
    return true
  }, [])

  const getElapsed = () => Date.now() - stepStartedAt.current

  return {
    step,
    stepIndex,
    scorableIndex,
    isIntro,
    isResults,
    isQuestion,
    current,
    patchCurrent,
    persistCurrent,
    snapshots,
    answeredCount,
    progressPercent,
    isStepAnswered,
    goToStepIndex,
    goToScorable,
    goNextQuestion,
    goPrevQuestion,
    resetFlow,
    markScored,
    getElapsed,
    stepStartedAt,
  }
}

/** Keyboard: ArrowLeft = next, ArrowRight = prev (RTL-friendly) */
export function useLesson1QuizKeyboard({ enabled, onNext, onPrev }) {
  useEffect(() => {
    if (!enabled) return undefined
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onNext?.()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        onPrev?.()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [enabled, onNext, onPrev])
}
