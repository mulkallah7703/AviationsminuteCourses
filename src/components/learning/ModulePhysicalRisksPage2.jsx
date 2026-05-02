import { useNavigate } from 'react-router-dom'

const STEPS = [
  {
    num: 1,
    title: 'أنواع المخاطر الفيزيائية:',
    body: 'تشمل المخاطر الفيزيائية مجموعة من العوامل مثل الضوضاء، الاهتزازات، درجات الحرارة المرتفعة أو المنخفضة، والإشعاع.',
  },
  {
    num: 2,
    title: 'أمثلة مباشرة في بيئة العمل:',
    body: 'تظهر المخاطر الفيزيائية في مواقع العمل مثل المصانع، مواقع البناء، المختبرات، وأماكن تشغيل المعدات الثقيلة.',
  },
  {
    num: 3,
    title: 'كيفية التعرف عليها:',
    body: 'يمكن التعرف على هذه المخاطر من خلال الملاحظة المباشرة، تقييم بيئة العمل، واستخدام أدوات القياس مثل أجهزة قياس الصوت والحرارة.',
  },
]

export function ModulePhysicalRisksPage2({ onPrevious }) {
  const navigate = useNavigate()

  return (
    <div className="physical-risks-p2" dir="ltr">
      <header className="physical-risks-p2__top">
        <span className="physical-risks-p2__page">Page 2 of 5</span>
      </header>

      <h1 className="physical-risks-p2__title">أين توجد المخاطر الفيزيائية؟</h1>

      <ul className="physical-risks-p2__steps" dir="rtl">
        {STEPS.map((step) => (
          <li key={step.num} className="physical-risks-p2__step">
            <span className="physical-risks-p2__badge">{step.num}</span>
            <div className="physical-risks-p2__step-body">
              <strong className="physical-risks-p2__step-title">{step.title}</strong>
              <p className="physical-risks-p2__step-desc">{step.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <article className="physical-risks-p2__card">
        <h2 className="physical-risks-p2__card-title">ما هي المخاطر الفيزيائية؟</h2>
        <p className="physical-risks-p2__card-desc" dir="rtl">
          المخاطر الفيزيائية هي عوامل موجودة في بيئة العمل قد تؤثر على سلامة وصحة العاملين، مثل الضوضاء، الحرارة،
          والاهتزازات.
        </p>
        <div className="physical-risks-p2__card-img-wrap">
          <img
            className="physical-risks-p2__card-img"
            src="/physic2.png"
            alt=""
          />
        </div>
      </article>

      <footer className="physical-risks-p2__footer">
        <button
          type="button"
          className="ghost step-btn physical-risks-p2__prev"
          onClick={() => onPrevious?.()}
        >
          السابق
        </button>
        <button
          type="button"
          className="primary step-btn physical-risks-p2__next"
          onClick={() => navigate('/course/physical-risks/types')}
        >
          التالي
        </button>
      </footer>
    </div>
  )
}
