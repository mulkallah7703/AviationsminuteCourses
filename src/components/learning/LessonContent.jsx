export function LessonContent({ unit }) {
  return (
    <section className="lesson-main-card fade-slide-in">
      <div className="lesson-illustration" aria-hidden="true">
        <span>{unit.icon}</span>
      </div>

      <div className="lesson-objectives">
        <h3>أهداف الدرس</h3>
        <p>في نهاية هذا الدرس، ستكون قادراً على:</p>
        <ul>
          {unit.objectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
