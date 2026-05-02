/**
 * Course progress = completed units / total units (only `lessons` array affects %).
 * Other fields are persisted for future features / analytics.
 */

export const LESSON_KEYS = [
  'chemical',
  'physical',
  'extreme-temperature',
  'vibration',
  'electricity',
  'xray',
  'interactive-assessment',
]

export const TOTAL_UNITS = LESSON_KEYS.length

export const INTERACTIVE_KEYS = [
  'rad-natural',
  'rad-body',
  'rad-learning-lab',
  'exam-sort',
  'exam-q1',
  'exam-q3',
]

export const BONUS_KEYS = ['started-course', 'deep-dive']

export const STORAGE_KEY = 'course-progress-state-v1'

/** Denormalized count (synced on load/save) */
export const COMPLETED_UNITS_STORAGE_KEY = 'completedUnits'

export function defaultProgressState() {
  return {
    lessons: [],
    interactive: [],
    quizPassed: false,
    bonus: [],
  }
}

export function getCompletedUnitCount(state) {
  return LESSON_KEYS.filter((k) => state.lessons.includes(k)).length
}

/**
 * (completedUnits / totalUnits) * 100 — one decimal for uneven splits (e.g. 1/7 ≈ 14.3%).
 * Caps at 100%. If total is 0, returns 0.
 */
export function calculatePercent(state) {
  const total = LESSON_KEYS.length
  if (total <= 0) return 0
  const completed = getCompletedUnitCount(state)
  if (completed >= total) return 100
  const raw = (completed / total) * 100
  return Math.min(100, Math.round(raw * 10) / 10)
}

/** Sidebar / labels: clean string without trailing .0 */
export function formatPercentForDisplay(percent) {
  const n = Math.min(100, Math.max(0, Number(percent) || 0))
  if (n >= 99.95) return '100'
  const rounded = Math.round(n * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

function syncCompletedUnitsToStorage(state) {
  try {
    const n = getCompletedUnitCount(state)
    localStorage.setItem(COMPLETED_UNITS_STORAGE_KEY, String(n))
  } catch {
    /* ignore */
  }
}

export function loadProgressState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const empty = defaultProgressState()
      syncCompletedUnitsToStorage(empty)
      return empty
    }
    const parsed = JSON.parse(raw)
    const state = {
      lessons: Array.isArray(parsed.lessons) ? parsed.lessons : [],
      interactive: Array.isArray(parsed.interactive) ? parsed.interactive : [],
      quizPassed: Boolean(parsed.quizPassed),
      bonus: Array.isArray(parsed.bonus) ? parsed.bonus : [],
    }
    syncCompletedUnitsToStorage(state)
    return state
  } catch {
    const empty = defaultProgressState()
    syncCompletedUnitsToStorage(empty)
    return empty
  }
}

export function saveProgressState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    syncCompletedUnitsToStorage(state)
  } catch {
    /* ignore */
  }
}

/**
 * Milestone copy by progress bands (percent is 0–100).
 */
export function getMilestoneMessage(percent) {
  const p = Math.min(100, Math.max(0, Number(percent) || 0))
  if (p >= 100) return 'تم الإنجاز 🎉'
  if (p >= 70) return 'أوشكت على الانتهاء 🔥'
  if (p >= 30) return 'استمر 👍'
  if (p >= 0) return 'بداية جيدة'
  return ''
}
