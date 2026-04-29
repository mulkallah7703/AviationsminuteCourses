export function Sidebar({
  units,
  lessons,
  activeLessonId,
  completedLessons,
  onSelectLesson,
}) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">الوحدات</h2>
      <div className="unit-list">
        {units.map((unit) => {
          const unitLessons = lessons.filter((lesson) => lesson.unitId === unit.id)
          const completedCount = unitLessons.filter((lesson) =>
            completedLessons.includes(lesson.id),
          ).length
          return (
            <section key={unit.id} className="unit-card">
              <div className="unit-header">
                <span className="unit-icon">{unit.icon}</span>
                <p>{unit.title}</p>
              </div>
              <div className="unit-progress">
                <span>{`${completedCount}/${unitLessons.length}`}</span>
              </div>
              <div className="lesson-links">
                {unitLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    className={`lesson-link ${activeLessonId === lesson.id ? 'active' : ''}`}
                    onClick={() => onSelectLesson(lesson.id)}
                  >
                    <span>{lesson.title}</span>
                    {completedLessons.includes(lesson.id) ? <span>✓</span> : null}
                  </button>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </aside>
  )
}
