export function LessonHeader({ title, lessonIndex, totalLessons }) {
  return (
    <header className="lesson-hero">
      <div className="lesson-hero-overlay" />
      <img src="/course-hero.png" alt="" className="lesson-hero-bg" />
      <div className="lesson-hero-content fade-slide-in">
        <h1>{title}</h1>
        <p>{`LESSON ${lessonIndex} OF ${totalLessons}`}</p>
      </div>
    </header>
  )
}
