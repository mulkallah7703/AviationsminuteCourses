import { formatPercentForDisplay } from '../../lib/courseProgressModel'

export function LessonMeta({ lessonIndex, totalLessons, duration, progressPercent }) {
  const pct = Math.min(100, Number(progressPercent) || 0)
  return (
    <section className="lesson-meta-strip">
      <article className="lesson-meta-card">
        <span className="lesson-meta-label">رقم الدرس</span>
        <strong>{`${lessonIndex} من ${totalLessons}`}</strong>
      </article>
      <article className="lesson-meta-card">
        <span className="lesson-meta-label">وقت الدرس المتوقع</span>
        <strong>{duration}</strong>
      </article>
      <article className="lesson-meta-card">
        <span className="lesson-meta-label">تقدم الدرس</span>
        <div className="lesson-inline-progress">
          <strong>{`${formatPercentForDisplay(pct)}%`}</strong>
          <div className="lesson-inline-progress-track">
            <div className="lesson-inline-progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </article>
    </section>
  )
}
