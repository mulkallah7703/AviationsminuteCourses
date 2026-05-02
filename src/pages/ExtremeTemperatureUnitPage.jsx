import { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useCourseProgress } from '../context/CourseProgressContext'
import { learningUnits } from '../data/courseData'
import { SidebarNavigation } from '../components/learning/SidebarNavigation'
import { PageLayout } from '../components/course-ui/PageLayout'
import { StepNavigation } from '../components/course-ui/StepNavigation'

const TOTAL_PAGES = 5
const LS_KEY = 'extreme-temperature-unit'

const P5_OPTIONS = [
  { id: 'thermal_cramps', label: 'تشنجات حرارية' },
  { id: 'chronic_pain', label: 'آلام مزمنة' },
  { id: 'joint_pain', label: 'آلام مفاصل' },
  { id: 'muscular_weakness', label: 'ضعف عضلي' },
]

const ET_SUMMARY_CARDS = [
  {
    id: 'types',
    icon: '◉',
    title: 'أنواع المخاطر',
    preview: 'نظرة عامة على أخطار بيئة العمل الفيزيائية الشائعة.',
    details: 'تشمل الضوضاء، الاهتزازات، درجات الحرارة القصوى، والإشعاعات التي قد تؤثر على صحة العاملين.',
  },
  {
    id: 'direct',
    icon: '◈',
    title: 'أمثلة مباشرة',
    preview: 'حالات تعرض ميداني مباشر أثناء تنفيذ الأعمال.',
    details: 'مثل التعرض لصوت مرتفع، العمل في بيئة حارة، استخدام معدات تهتز، أو التعرض للإشعاع.',
  },
  {
    id: 'indirect',
    icon: '◎',
    title: 'أمثلة غير مباشرة',
    preview: 'آثار تراكمية تظهر مع الاستمرار في التعرض.',
    details: 'مثل الإرهاق، ضعف التركيز، أو مشاكل عضلية نتيجة التعرض المستمر.',
  },
  {
    id: 'identify',
    icon: '◌',
    title: 'كيفية التمييز',
    preview: 'منهج عملي لتحليل الخطر وتحديد درجة تأثيره.',
    details: 'يتم من خلال تحديد مصدر الخطر، تقييم شدته، ومراقبة تأثيره على العامل.',
  },
]

function loadStored() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function EtFigureImage({ src, className, variant = 'heat' }) {
  const [broken, setBroken] = useState(false)

  useEffect(() => {
    setBroken(false)
  }, [src])

  if (broken) {
    return (
      <div
        className={`et-figure-fallback et-figure-fallback--${variant} ${className || ''}`.trim()}
        aria-hidden
      />
    )
  }
  return (
    <img
      src={src}
      alt=""
      className={className}
      onError={() => setBroken(true)}
    />
  )
}

function EtInteractiveSummaryCards() {
  const [openCardId, setOpenCardId] = useState('types')

  return (
    <article className="et-card et-card--summary">
      <h1 className="et-card__title et-card__title--rtl">
        أنواع المخاطر الفيزيائية التي يتعرض لها العمال
      </h1>

      <div className="et-summary-grid" role="list">
        {ET_SUMMARY_CARDS.map((card) => {
          const isOpen = openCardId === card.id
          return (
            <article
              key={card.id}
              className={`et-summary-item ${isOpen ? 'et-summary-item--open' : ''}`}
              role="listitem"
            >
              <button
                type="button"
                className="et-summary-item__trigger"
                aria-expanded={isOpen}
                onClick={() => setOpenCardId(isOpen ? null : card.id)}
              >
                <span className="et-summary-item__icon" aria-hidden>
                  {card.icon}
                </span>
                <h2 className="et-summary-item__title">{card.title}</h2>
                <p className="et-summary-item__preview">{card.preview}</p>
              </button>

              <div className={`et-summary-item__details ${isOpen ? 'is-open' : ''}`}>
                <p>{card.details}</p>
              </div>
            </article>
          )
        })}
      </div>
    </article>
  )
}

export function ExtremeTemperatureUnitPage() {
  const navigate = useNavigate()
  const { percent, recordLessonComplete } = useCourseProgress()
  const { step } = useParams()
  const stepNum = parseInt(step, 10)

  const [answers, setAnswers] = useState(() => loadStored()?.answers ?? {})

  const validStep = Number.isInteger(stepNum) && stepNum >= 1 && stepNum <= TOTAL_PAGES

  useEffect(() => {
    if (!validStep) return
    try {
      const prev = loadStored() || {}
      localStorage.setItem(LS_KEY, JSON.stringify({ ...prev, answers, lastStep: stepNum }))
    } catch {
      /* ignore */
    }
  }, [answers, stepNum, validStep])

  const go = useCallback(
    (n) => {
      navigate(`/course/extreme-temperature/${n}`)
    },
    [navigate],
  )

  const onPrevious = useCallback(() => {
    if (stepNum <= 1) {
      navigate('/course/physical-risks/types')
      return
    }
    go(stepNum - 1)
  }, [go, navigate, stepNum])

  const onNext = useCallback(() => {
    if (stepNum >= TOTAL_PAGES) return
    go(stepNum + 1)
  }, [go, stepNum])

  const setP5Selection = useCallback((id) => {
    setAnswers((prev) => ({ ...prev, muscularPerformanceExample: id }))
  }, [])

  if (!validStep) {
    return <Navigate to="/course/extreme-temperature/1" replace />
  }

  const p5Selected = answers.muscularPerformanceExample

  return (
    <div className="learning-layout">
      <SidebarNavigation
        units={learningUnits}
        activeUnitKey="extreme-temperature"
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
        <div className="et-unit-shell fade-slide-in" key={stepNum}>
          {stepNum === 1 ? (
            <>
              <PageLayout pageIndex={1} pageTotal={TOTAL_PAGES}>
                <div className="et-intro-hero" dir="rtl">
                  <div className="et-hero-split">
                    <img className="et-hero-split__full" src="/warm1.png" alt="" />
                  </div>

                  <h1 className="et-page-title">
                    لماذا تمثل درجات الحرارة القصوى خطرًا في بيئة العمل؟
                  </h1>
                  <ul className="et-body-list et-body-list--center">
                    <li>درجات الحرارة المرتفعة أو المنخفضة تؤثر بشكل مباشر على صحة العامل.</li>
                    <li>التعرض الطويل قد يؤدي إلى إجهاد حراري أو انخفاض حرارة الجسم.</li>
                    <li>الوقاية تعتمد على التوعية واستخدام معدات الحماية.</li>
                  </ul>
                </div>
              </PageLayout>
              <StepNavigation onPrevious={onPrevious} onNext={onNext} showPrevious />
            </>
          ) : null}

          {stepNum === 2 ? (
            <>
              <PageLayout pageIndex={2} pageTotal={TOTAL_PAGES}>
                <div className="et-content-block" dir="rtl">
                  <div className="et-figure-wrap">
                    <EtFigureImage
                      src="/warm2.png"
                      className="et-figure"
                      variant="heat"
                    />
                  </div>
                  <h1 className="et-page-title">كيف تظهر أعراض الحرارة المرتفعة على العاملين؟</h1>
                  <ul className="et-body-list et-body-list--center">
                    <li>الإجهاد الحراري</li>
                    <li>التعرق الشديد وفقدان السوائل</li>
                    <li>الدوخة والإرهاق</li>
                    <li>ضربة الشمس في الحالات المتقدمة</li>
                  </ul>
                </div>
              </PageLayout>
              <StepNavigation onPrevious={onPrevious} onNext={onNext} showPrevious />
            </>
          ) : null}

          {stepNum === 3 ? (
            <>
              <PageLayout pageIndex={3} pageTotal={TOTAL_PAGES}>
                <div className="et-content-block" dir="rtl">
                  <div className="et-figure-wrap">
                    <EtFigureImage
                      src="/warm3.png"
                      className="et-figure"
                      variant="cold"
                    />
                  </div>
                  <h1 className="et-page-title">كيف تظهر أعراض البرودة الشديدة على العاملين؟</h1>
                  <ul className="et-body-list et-body-list--center">
                    <li>انخفاض درجة حرارة الجسم</li>
                    <li>ضعف الدورة الدموية</li>
                    <li>فقدان الإحساس في الأطراف</li>
                    <li>خطر التجمد في الحالات الشديدة</li>
                  </ul>
                </div>
              </PageLayout>
              <StepNavigation onPrevious={onPrevious} onNext={onNext} showPrevious />
            </>
          ) : null}

          {stepNum === 4 ? (
            <>
              <PageLayout pageIndex={4} pageTotal={TOTAL_PAGES}>
                <div className="et-summary-flow" dir="rtl">
                  <EtInteractiveSummaryCards />
                </div>
              </PageLayout>
              <StepNavigation onPrevious={onPrevious} onNext={onNext} showPrevious />
            </>
          ) : null}

          {stepNum === 5 ? (
            <>
              <PageLayout pageIndex={5} pageTotal={TOTAL_PAGES}>
                <div className="et-classification" dir="rtl">
                  <h1 className="et-page-title">تصنيف أمثلة المشاكل العضلية</h1>
                  <div className="et-classification__card">
                    <h2 className="et-classification__prompt">ضعف الأداء العضلي</h2>
                    <div className="et-classification__options" role="group" aria-label="خيارات التصنيف">
                      {P5_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          className={`et-option-btn ${p5Selected === opt.id ? 'et-option-btn--active' : ''}`}
                          onClick={() => setP5Selection(opt.id)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </PageLayout>
              <StepNavigation
                onPrevious={onPrevious}
                onNext={() => {
                  recordLessonComplete('extreme-temperature')
                  navigate('/course/vibration-risks/1')
                }}
                showPrevious
              />
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}
