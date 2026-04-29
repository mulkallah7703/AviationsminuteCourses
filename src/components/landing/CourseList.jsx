import { useNavigate } from 'react-router-dom'

const listItems = [
  { title: 'المخاطر الكيميائية', key: 'chemical' },
  { title: 'المخاطر الفيزيائية', key: 'physical' },
  { title: 'مخاطر درجات الحرارة القصوى', key: 'extreme-temperature' },
  { title: 'مخاطر الاهتزازات', key: 'vibration' },
  { title: 'المخاطر الناتجة عن تأثير الكهرباء', key: 'electricity' },
  { title: 'مخاطر الاشعة السينية', key: 'xray' },
  { title: 'التقييم التفاعلي', key: 'interactive-assessment' },
]

function unitPath(key) {
  if (key === 'extreme-temperature') return '/course/extreme-temperature/1'
  if (key === 'vibration') return '/course/vibration-risks/1'
  if (key === 'electricity') return '/course/electrical-risks/1'
  if (key === 'xray') return '/course/radiation-risks/1'
  return `/course/learn?unit=${key}`
}

export function CourseList() {
  const navigate = useNavigate()

  return (
    <section className="landing-section landing-list-section">
      <header className="landing-section-header">
        <h2>محاور البرنامج التفاعلي</h2>
      </header>

      <div className="course-list">
        {listItems.map((item, index) => (
          <article
            key={item.title}
            className="course-list-item"
            onClick={() => navigate(unitPath(item.key))}
            role="button"
            tabIndex={0}
            onKeyDown={(event) =>
              (event.key === 'Enter' || event.key === ' ') && navigate(unitPath(item.key))
            }
          >
            <span className="course-item-status">لم تبدأ</span>
            <p>{item.title}</p>
            <span className="course-item-number">{String(index + 1).padStart(2, '0')}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
