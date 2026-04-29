import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { learningUnits } from '../data/courseData'
import { SidebarNavigation } from '../components/learning/SidebarNavigation'
import { StepNavigation } from '../components/course-ui/StepNavigation'
import { StepLayout } from '../components/course-ui/StepLayout'
import { CourseAccordion } from '../components/course-ui/CourseAccordion'

const TOTAL_PAGES = 5
const LS_KEY = 'vibration-risks-unit'

const EFFECTS_IMPACT_CARDS = [
  {
    id: 'nerves',
    icon: '🧠',
    title: 'التأثيرات العصبية والعضلية',
    text: 'قد تؤدي الاهتزازات المستمرة إلى تلف الأعصاب وضعف التحكم العضلي، مما يؤثر على أداء العامل ودقته في العمل.',
  },
  {
    id: 'sensation',
    icon: '✋',
    title: 'ضعف الإحساس',
    text: 'يقل الإحساس في اليدين تدريجيًا، مما يزيد من خطر الحوادث نتيجة فقدان القدرة على التحكم بالأدوات.',
  },
  {
    id: 'bloodflow',
    icon: '🫀',
    title: 'مشاكل في الدورة الدموية',
    text: 'تؤثر الاهتزازات على تدفق الدم، وقد تسبب برودة وتنميل في الأطراف، خاصة عند التعرض لفترات طويلة.',
  },
  {
    id: 'fatigue',
    icon: '😮‍💨',
    title: 'إجهاد مزمن',
    text: 'التعرض المستمر يؤدي إلى إرهاق جسدي مستمر وانخفاض في القدرة على التركيز والإنتاجية.',
  },
]

const ACCORDION_BULLETS = ['تنميل اليدين', 'ضعف التحكم العضلي', 'إجهاد عام في الجسم']

const ACCORDION_SECTIONS = [
  { id: 'hand', title: 'أعراض اليد والذراع', bullets: ACCORDION_BULLETS },
  { id: 'body', title: 'أعراض كامل الجسم', bullets: ACCORDION_BULLETS },
  { id: 'firstaid', title: 'إسعافات أولية للاهتزازات', bullets: ACCORDION_BULLETS },
]

const P5_OPTIONS = [
  { id: 'hand_arm', label: 'اليد والذراع' },
  { id: 'whole_body', label: 'كامل الجسم' },
  { id: 'harmless', label: 'غير ضارة' },
  { id: 'other', label: 'أخرى' },
]

const SOURCES_STEPS = [
  {
    id: 'sources',
    title: 'تحديد مصادر الاهتزاز',
    details:
      'تشمل مصادر الاهتزاز المعدات الثقيلة، الأدوات اليدوية، والآلات التي تعمل بشكل مستمر داخل بيئة العمل.',
  },
  {
    id: 'types',
    title: 'التمييز بين أنواع الاهتزاز',
    details:
      'تنقسم الاهتزازات إلى اهتزازات تؤثر على كامل الجسم وأخرى تتركز في اليد والذراع، ويختلف تأثيرها حسب مدة التعرض.',
  },
  {
    id: 'management',
    title: 'إدارة بيئة العمل',
    details:
      'يتم تقليل التعرض من خلال صيانة المعدات، استخدام أدوات مناسبة، وتنظيم أوقات العمل لتقليل الإجهاد.',
  },
  {
    id: 'monitoring',
    title: 'مراقبة التأثير على العاملين',
    details:
      'تشمل متابعة الأعراض مثل التنميل أو الألم، وإجراء تقييمات دورية لضمان سلامة العاملين.',
  },
]

const VIBRATION_RISK_TIMELINE = [
  {
    id: 'stage-1',
    icon: '◔',
    title: 'المرحلة الأولى',
    text: 'تبدأ المخاطر تدريجيًا نتيجة التعرض المستمر للاهتزاز.',
  },
  {
    id: 'stage-2',
    icon: '◑',
    title: 'المرحلة الثانية',
    text: 'قد تتطور إلى مشاكل صحية مثل تلف الأعصاب أو ضعف العضلات.',
  },
  {
    id: 'stage-3',
    icon: '◕',
    title: 'المرحلة الوقائية',
    text: 'الوقاية تعتمد على تقليل مدة التعرض واستخدام وسائل الحماية.',
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

function SplitFaceHero({ src }) {
  const [broken, setBroken] = useState(false)
  if (broken) {
    return <div className="vr-split-face" aria-hidden />
  }
  return (
    <img
      className="vr-split-face__img"
      src={src}
      alt=""
      onError={() => setBroken(true)}
    />
  )
}

export function VibrationRisksUnitPage() {
  const navigate = useNavigate()
  const { step } = useParams()
  const stepNum = parseInt(step, 10)

  const [answers, setAnswers] = useState(() => loadStored()?.answers ?? {})
  const [accordionOpen, setAccordionOpen] = useState('firstaid')
  const [activeSourceStep, setActiveSourceStep] = useState(SOURCES_STEPS[0].id)
  const [openImpactCardId, setOpenImpactCardId] = useState(EFFECTS_IMPACT_CARDS[0].id)
  const [dragOverZoneId, setDragOverZoneId] = useState('')
  const [p5Feedback, setP5Feedback] = useState('')

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

  const progressPercent = useMemo(
    () =>
      Math.round(
        ((learningUnits.findIndex((u) => u.key === 'vibration') + 1) / learningUnits.length) * 100,
      ),
    [],
  )

  const go = useCallback(
    (n) => {
      navigate(`/course/vibration-risks/${n}`)
    },
    [navigate],
  )

  const onPrevious = useCallback(() => {
    if (stepNum <= 1) {
      navigate('/course/extreme-temperature/5')
      return
    }
    go(stepNum - 1)
  }, [go, navigate, stepNum])

  const onNext = useCallback(() => {
    if (stepNum >= TOTAL_PAGES) return
    go(stepNum + 1)
  }, [go, stepNum])

  const setP5 = useCallback((id) => {
    const isCorrect = id === 'hand_arm'
    setAnswers((prev) => ({ ...prev, vibrationClassification: id }))
    setP5Feedback(isCorrect ? 'correct' : 'wrong')
  }, [])

  const onDragStartP5 = useCallback((event) => {
    event.dataTransfer.setData('text/plain', 'ضعف الأداء العضلي')
    event.dataTransfer.effectAllowed = 'move'
  }, [])

  const onDropP5 = useCallback((event, zoneId) => {
    event.preventDefault()
    setDragOverZoneId('')
    setP5(zoneId)
  }, [setP5])

  const onRetryP5 = useCallback(() => {
    setAnswers((prev) => ({ ...prev, vibrationClassification: '' }))
    setP5Feedback('')
    setDragOverZoneId('')
  }, [])

  if (!validStep) {
    return <Navigate to="/course/vibration-risks/1" replace />
  }

  const p5Sel = answers.vibrationClassification
  const p5IsCorrect = p5Sel === 'hand_arm'
  const activeSourceContent =
    SOURCES_STEPS.find((stepItem) => stepItem.id === activeSourceStep) ?? SOURCES_STEPS[0]

  const navProps = {
    onPrevious,
    onNext,
    showPrevious: true,
    previousLabel: 'السابق',
    nextLabel: 'التالي',
    className: 'vr-step-nav',
  }

  return (
    <div className="learning-layout">
      <SidebarNavigation
        units={learningUnits}
        activeUnitKey="vibration"
        onSelectUnit={(unitKey) => {
          if (unitKey === 'vibration') navigate('/course/vibration-risks/1')
          else if (unitKey === 'extreme-temperature') navigate('/course/extreme-temperature/1')
          else if (unitKey === 'electricity') navigate('/course/electrical-risks/1')
          else if (unitKey === 'xray') navigate('/course/radiation-risks/1')
          else navigate(`/course/learn?unit=${unitKey}`)
        }}
        progressPercent={progressPercent}
        courseHeading="برنامج التوعية التفاعلي: التعرف على أنواع المخاطر المهنية والاستجابة الآمنة"
      />

      <main className="learning-main">
        <div className="vr-unit-root fade-slide-in" key={stepNum}>
          {stepNum === 1 ? (
            <>
              <StepLayout
                programHeader={{
                  englishSubtitle: 'Introduction to Vibration Hazards',
                  progressPercent: 14,
                }}
              >
                <div className="vr-white-card">
                  <SplitFaceHero src="/motion1.png" />
                  <div className="vr-card-pad" dir="rtl">
                    <h2 className="vr-card-title">فهم أساسيات المخاطر الفيزيائية (الاهتزازات)</h2>
                    <ul className="vr-bullet-list">
                      <li>تنتج الاهتزازات من استخدام المعدات والآلات الثقيلة.</li>
                      <li>التعرض المستمر قد يؤدي إلى مشاكل صحية طويلة المدى.</li>
                      <li>من المهم فهم مصادر الاهتزازات لتقليل المخاطر.</li>
                    </ul>
                  </div>
                </div>
              </StepLayout>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 2 ? (
            <>
              <StepLayout
                englishModuleTitle="SOURCES OF VIBRATIONS"
                arabicModuleTitle="ما هي مصادر الاهتزازات؟"
              >
                <section className="vr-sources-interactive" dir="rtl" aria-label="مصادر الاهتزازات">
                  <div className="vr-sources-interactive__steps" role="tablist" aria-label="خطوات التعلم">
                    {SOURCES_STEPS.map((item, i) => {
                      const isActive = item.id === activeSourceStep
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          className={`vr-source-step-pill ${isActive ? 'vr-source-step-pill--active' : ''}`}
                          onClick={() => setActiveSourceStep(item.id)}
                        >
                          <span className="vr-source-step-pill__num">{i + 1}</span>
                          <span className="vr-source-step-pill__title">{item.title}</span>
                        </button>
                      )
                    })}
                  </div>

                  <article className="vr-source-detail" key={activeSourceStep}>
                    <h2 className="vr-source-detail__title">{activeSourceContent.title}</h2>
                    <p className="vr-source-detail__text">{activeSourceContent.details}</p>
                  </article>
                </section>

                <div className="vr-white-card vr-white-card--lift">
                  <div className="vr-card-pad" dir="rtl">
                    <h2 className="vr-card-title vr-card-title--right">
                      مراحل تطور مخاطر الاهتزازات في بيئة العمل
                    </h2>
                    <div className="vr-risk-timeline" role="list">
                      {VIBRATION_RISK_TIMELINE.map((item, index) => (
                        <article className="vr-risk-timeline__item" key={item.id} role="listitem">
                          <span className="vr-risk-timeline__dot" aria-hidden>
                            {item.icon}
                          </span>
                          {index < VIBRATION_RISK_TIMELINE.length - 1 ? (
                            <span className="vr-risk-timeline__line" aria-hidden />
                          ) : null}
                          <h3 className="vr-risk-timeline__title">{item.title}</h3>
                          <p className="vr-risk-timeline__text">{item.text}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </StepLayout>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 3 ? (
            <>
              <StepLayout englishModuleTitle="PREVENTIVE MEASURES" />
              <div className="vr-white-card">
                <div className="vr-card-banner" dir="rtl">
                  التعرف على الأعراض والتدابير الوقائية
                </div>
                <div className="vr-card-pad vr-card-pad--tight-top">
                  <div className="vr-figure-wrap">
                    <img className="vr-figure" src="/motion2.png" alt="" />
                  </div>
                  <CourseAccordion
                    sections={ACCORDION_SECTIONS}
                    openId={accordionOpen}
                    onToggle={(id) => setAccordionOpen((prev) => (prev === id ? '' : id))}
                  />
                </div>
              </div>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 4 ? (
            <>
              <StepLayout englishModuleTitle="TYPES OF VIBRATION & HEALTH EFFECTS" />
              <div className="vr-white-card vr-white-card--tabs">
                <div className="vr-tab-panel-wrap">
                  <div className="vr-card-pad" dir="rtl">
                    <h2 className="vr-card-title">كيف تؤثر الاهتزازات على صحة العاملين؟</h2>

                    <section className="vr-impact-visual">
                      <div className="vr-impact-grid">
                        {EFFECTS_IMPACT_CARDS.map((card) => {
                          const isOpen = openImpactCardId === card.id
                          return (
                            <article
                              key={card.id}
                              className={`vr-impact-card ${isOpen ? 'vr-impact-card--open' : ''}`}
                            >
                              <button
                                type="button"
                                className="vr-impact-card__btn"
                                onClick={() => setOpenImpactCardId(isOpen ? null : card.id)}
                                aria-expanded={isOpen}
                              >
                                <span className="vr-impact-card__icon" aria-hidden>
                                  {card.icon}
                                </span>
                                <h3 className="vr-impact-card__title">{card.title}</h3>
                                <p className="vr-impact-card__text">{card.text}</p>
                              </button>
                            </article>
                          )
                        })}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 5 ? (
            <>
              <StepLayout
                englishModuleTitle="CLASSIFICATION EXERCISE"
                arabicModuleTitle="تصنيف أمثلة مخاطر الاهتزازات"
              />
              <div className="vr-white-card">
                <div className="vr-card-pad" dir="rtl">
                  <div className="vr-classify-progress" aria-label="تقدم التمرين">
                    <span className="vr-classify-progress__label">السؤال 1 من 1</span>
                    <div className="vr-classify-progress__track">
                      <span
                        className="vr-classify-progress__fill"
                        style={{ width: p5IsCorrect ? '100%' : '35%' }}
                      />
                    </div>
                  </div>

                  <div
                    className={`vr-drag-target ${p5IsCorrect ? 'vr-drag-target--done' : ''}`}
                    draggable
                    onDragStart={onDragStartP5}
                  >
                    <span className="vr-drag-target__tag">اسحب البطاقة</span>
                    <span className="vr-drag-target__text">ضعف الأداء العضلي</span>
                  </div>

                  <div className="vr-opt-grid" role="group" aria-label="تصنيف المخاطر">
                    {P5_OPTIONS.map((opt) => (
                      <div
                        key={opt.id}
                        className={`vr-drop-zone ${dragOverZoneId === opt.id ? 'vr-drop-zone--over' : ''}`}
                        onDragOver={(event) => {
                          event.preventDefault()
                          setDragOverZoneId(opt.id)
                        }}
                        onDragLeave={() => setDragOverZoneId('')}
                        onDrop={(event) => onDropP5(event, opt.id)}
                      >
                        <button
                          type="button"
                          className={`vr-opt-tile ${p5Sel === opt.id ? 'vr-opt-tile--active' : ''} ${
                            p5IsCorrect && p5Sel === opt.id ? 'vr-opt-tile--correct' : ''
                          } ${
                            p5Feedback === 'wrong' && p5Sel === opt.id ? 'vr-opt-tile--wrong' : ''
                          }`}
                          onClick={() => setP5(opt.id)}
                        >
                          <span className="vr-opt-tile__icon" aria-hidden>
                            {opt.id === 'hand_arm' ? '✋' : opt.id === 'whole_body' ? '🧍' : opt.id === 'harmless' ? '✅' : '📦'}
                          </span>
                          <span>{opt.label}</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {p5Feedback === 'correct' ? (
                    <p className="vr-classify-feedback vr-classify-feedback--ok">إجابة صحيحة ✔</p>
                  ) : null}
                  {p5Feedback === 'wrong' ? (
                    <p className="vr-classify-feedback vr-classify-feedback--wrong">
                      تأثير ضعف الأداء العضلي يرتبط غالبًا بتأثير الاهتزاز على اليد والذراع.
                    </p>
                  ) : null}

                  <div className="vr-classify-actions">
                    <button
                      type="button"
                      className="ghost step-btn"
                      onClick={onRetryP5}
                      disabled={!p5Feedback}
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                </div>
              </div>
              <StepNavigation
                {...navProps}
                nextDisabled={!p5IsCorrect}
                onNext={() => navigate('/course/electrical-risks/1')}
              />
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}
