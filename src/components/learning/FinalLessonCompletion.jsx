const COMPLETION_STATS = [
  { id: 'lessons', icon: '📘', label: 'عدد الدروس', value: '7 من 7 مكتملة ✔' },
  { id: 'time', icon: '⏱️', label: 'الوقت', value: '25 دقيقة تعلم' },
  { id: 'progress', icon: '🏁', label: 'التقدم', value: '100% إنجاز' },
]

const LEARNING_GAINS = [
  {
    id: 'recognize',
    icon: '🔎',
    title: 'التعرف على التقييم التفاعلي',
    text: 'أصبحت قادرًا على فهم طبيعة التقييم وكيفية قراءة متطلباته بسرعة.',
  },
  {
    id: 'understand',
    icon: '🧩',
    title: 'فهم طرق التعامل',
    text: 'تطورت مهارتك في اختيار الاستجابة الأنسب حسب نوع الخطر وسياق العمل.',
  },
  {
    id: 'apply',
    icon: '🛡️',
    title: 'تطبيق إجراءات السلامة',
    text: 'أصبحت أكثر استعدادًا لتطبيق قواعد السلامة بفعالية داخل بيئة العمل.',
  },
]

export function FinalLessonCompletion({ onPrimaryAction, onReviewLessons }) {
  return (
    <section className="final-completion fade-slide-in" dir="rtl">
      <header className="final-completion__hero">
        <div className="final-completion__hero-glow" aria-hidden />
        <h1>🎉 أحسنت! لقد أكملت البرنامج</h1>
        <p>أنت الآن مستعد لتطبيق ما تعلمته في بيئة العمل</p>
        <div className="final-completion__progress" aria-label="تقدم الإكمال">
          <span>100%</span>
          <div className="final-completion__progress-track" aria-hidden>
            <div className="final-completion__progress-fill" />
          </div>
        </div>
      </header>

      <section className="final-completion__stats" role="list" aria-label="إحصائيات الإكمال">
        {COMPLETION_STATS.map((item) => (
          <article key={item.id} className="final-completion__stat-card" role="listitem">
            <span className="final-completion__stat-icon" aria-hidden>
              {item.icon}
            </span>
            <h2>{item.label}</h2>
            <p>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="final-completion__badge-wrap" aria-label="شارة الإكمال">
        <div className="final-completion__badge" aria-hidden>
          ✅
        </div>
      </section>

      <section className="final-completion__gains">
        <h2>ما الذي اكتسبته؟</h2>
        <div className="final-completion__gain-grid" role="list">
          {LEARNING_GAINS.map((gain) => (
            <article key={gain.id} className="final-completion__gain-card" role="listitem">
              <span className="final-completion__gain-icon" aria-hidden>
                {gain.icon}
              </span>
              <h3>{gain.title}</h3>
              <p>{gain.text}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="final-completion__tip" role="note">
        <strong>💡 نصيحة</strong>
        <p>تطبيق ما تعلمته في الواقع هو الخطوة الأهم للسلامة.</p>
      </aside>

      <footer className="final-completion__actions">
        <button type="button" className="ghost" onClick={onReviewLessons}>
          مراجعة الدروس
        </button>
        <button type="button" className="primary" onClick={onPrimaryAction}>
          اختبر نفسك الآن
        </button>
      </footer>
    </section>
  )
}
