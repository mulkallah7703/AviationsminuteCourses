export function LessonMeta({ lessonIndex, totalLessons, duration, progressPercent }) {
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
          <strong>{`${progressPercent}%`}</strong>
          <div className="lesson-inline-progress-track">
            <div className="lesson-inline-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </article>
    </section>
  )
}
