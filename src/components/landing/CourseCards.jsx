const metaCards = [
  { icon: '📘', title: 'عدد الدروس', value: '8 دروس' },
  { icon: '🕒', title: 'مدة الدورة', value: '2-2 ساعات' },
  { icon: '📊', title: 'مستوى الدورة', value: 'جميع المستويات' },
  { icon: '🏅', title: 'شهادة إكمال', value: 'عند إتمام الدورة' },
]

export function CourseCards() {
  return (
    <section className="landing-section">
      <div className="course-meta-grid">
        {metaCards.map((card) => (
          <article key={card.title} className="course-meta-card">
            <div className="meta-icon-wrap" aria-hidden="true">
              <span>{card.icon}</span>
            </div>
            <div>
              <h3>{card.title}</h3>
              <p>{card.value}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
