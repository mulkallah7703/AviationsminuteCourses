/** Client-side integrity pepper — not server-grade, but detects casual localStorage edits. */
const INTEGRITY_PEPPER = 'lms-hazards-program-v2'

export const PROGRESS_STORAGE_VERSION = 2
export const MAX_QUIZ_ATTEMPTS = 1
export const VIDEO_COMPLETION_RATIO = 0.95
export const REWIND_TOLERANCE_SEC = 0.75

function stablePayload(state) {
  return JSON.stringify({
    v: state.version,
    lessons: [...state.lessons].sort((a, b) => a - b),
    quizzes: [...state.quizzes].sort((a, b) => a - b),
    watch: state.watch,
    quizAttempts: state.quizAttempts,
  })
}

function fnv1a(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

export function computeProgressChecksum(state) {
  return fnv1a(stablePayload(state) + INTEGRITY_PEPPER)
}

export function attachChecksum(state) {
  return { ...state, checksum: computeProgressChecksum(state) }
}

export function validateProgressChecksum(state) {
  if (!state?.checksum) return false
  const { checksum, ...rest } = state
  return computeProgressChecksum(rest) === checksum
}
