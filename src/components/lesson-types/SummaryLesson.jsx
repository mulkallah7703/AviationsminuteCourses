export function SummaryLesson({ content }) {
  return (
    <div className="lesson-grid single">
      <div className="soft-card">
        <h4>الملخص</h4>
        <ul className="summary-list">
          {content.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
