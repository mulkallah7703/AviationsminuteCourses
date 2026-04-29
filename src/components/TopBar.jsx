export function TopBar({ courseTitle, activeUnitTitle, progressPercent, lessonCounter }) {
  return (
    <header className="topbar">
      <div>
        <h1>{courseTitle}</h1>
        <p className="active-unit">{activeUnitTitle}</p>
      </div>
      <div className="topbar-progress">
        <div className="progress-meta">
          <span>التقدم</span>
          <span>{lessonCounter}</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    </header>
  )
}
