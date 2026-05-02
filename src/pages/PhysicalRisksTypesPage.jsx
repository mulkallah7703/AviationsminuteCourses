import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCourseProgress } from '../context/CourseProgressContext'
import { learningUnits } from '../data/courseData'
import { SidebarNavigation } from '../components/learning/SidebarNavigation'

const TABS = [
  { id: 'striking', label: 'الاصطدام (التأثير)' },
  { id: 'crushing', label: 'السحق' },
  { id: 'slip', label: 'الانزلاق / التعثر' },
  { id: 'entanglement', label: 'التشابك' },
]

const TAB_PANELS = {
  striking: {
    titleAr: 'الاصطدام والمخاطر الفيزيائية',
    bullets: [
      'تحدث هذه المخاطر نتيجة الاصطدام بالأجسام أو المعدات المتحركة داخل بيئة العمل.',
      'تشمل الأمثلة: الاصطدام بالمركبات الصناعية أو الأدوات الثقيلة.',
      'قد تؤدي إلى إصابات خطيرة مثل الكدمات أو الكسور.',
      'من المهم الانتباه للمحيط واستخدام معدات السلامة المناسبة.',
    ],
  },
  crushing: {
    titleAr: null,
    bullets: [
      'تحدث عند انحشار الجسم بين جسمين أو أكثر.',
      'مثل العمل بالقرب من الآلات الثقيلة.',
      'قد تسبب إصابات شديدة في الأطراف.',
    ],
  },
  slip: {
    titleAr: null,
    bullets: [
      'تحدث بسبب الأرضيات الزلقة أو غير المستوية.',
      'من أكثر أسباب الحوادث شيوعًا في بيئة العمل.',
      'الوقاية تشمل الحفاظ على نظافة المكان.',
    ],
  },
  entanglement: {
    titleAr: null,
    bullets: [
      'تحدث عند تشابك الملابس أو الشعر مع الآلات.',
      'خطيرة جدًا في المصانع.',
      'يجب ارتداء معدات الحماية المناسبة.',
    ],
  },
}

export function PhysicalRisksTypesPage() {
  const navigate = useNavigate()
  const { recordLessonComplete, percent } = useCourseProgress()
  const [activeTab, setActiveTab] = useState('striking')

  const panel = TAB_PANELS[activeTab]

  return (
    <div className="learning-layout">
      <SidebarNavigation
        units={learningUnits}
        activeUnitKey="physical"
        onSelectUnit={(unitKey) => {
          if (unitKey === 'extreme-temperature') navigate('/course/extreme-temperature/1')
          else if (unitKey === 'vibration') navigate('/course/vibration-risks/1')
          else if (unitKey === 'electricity') navigate('/course/electrical-risks/1')
          else if (unitKey === 'xray') navigate('/course/radiation-risks/1')
          else navigate(`/course/learn?unit=${unitKey}`)
        }}
        progressPercent={percent}
        courseHeading="برنامج التوعية التفاعلي: التعرف على أنواع المخاطر المهنية والاستجابة الآمنة"
      />

      <main className="learning-main">
        <div className="physical-types-page fade-slide-in" dir="ltr">
          <header className="physical-types-page__top">
            <span className="physical-types-page__page">Page 3 of 5</span>
          </header>

          <h1 className="physical-types-page__title">أنواع المخاطر الفيزيائية</h1>

          <div className="physical-types-card">
            <div className="physical-types-tabs" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`physical-types-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="physical-types-panel-wrap" key={activeTab}>
              <div className="physical-types-panel">
                {panel.titleAr ? (
                  <h2 className="physical-types-panel__title" dir="rtl">
                    {panel.titleAr}
                  </h2>
                ) : null}
                <ul className="physical-types-panel__list" dir="rtl">
                  {panel.bullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <footer className="physical-types-page__footer">
            <button
              type="button"
              className="ghost step-btn"
              onClick={() => navigate('/course/learn?unit=physical&page=2')}
            >
              السابق
            </button>
            <button
              type="button"
              className="primary step-btn"
              onClick={() => {
                recordLessonComplete('physical')
                navigate('/course/extreme-temperature/1')
              }}
            >
              التالي
            </button>
          </footer>
        </div>
      </main>
    </div>
  )
}
