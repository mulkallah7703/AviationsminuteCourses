import { PROGRAM_MODULE_COUNT } from '../../../data/programCourse'

const LESSON_ORDINAL = {
  1: 'الأول',
  2: 'الثاني',
  3: 'الثالث',
  4: 'الرابع',
  5: 'الخامس',
  6: 'السادس',
  7: 'السابع',
}

/** Label for navigating to the lesson after quiz N */
export function getNextLessonButtonLabel(moduleId) {
  if (moduleId >= PROGRAM_MODULE_COUNT) return null
  const next = moduleId + 1
  const ord = LESSON_ORDINAL[next]
  return ord ? `الانتقال إلى الدرس ${ord}` : `الانتقال إلى الدرس ${next}`
}

export function getPreviousLessonButtonLabel(moduleId) {
  if (moduleId <= 1) return null
  const prev = moduleId - 1
  const ord = LESSON_ORDINAL[prev]
  return ord ? `مراجعة الدرس ${ord}` : `مراجعة الدرس ${prev}`
}
