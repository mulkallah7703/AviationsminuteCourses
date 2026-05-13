import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useCourseProgress } from '../context/CourseProgressContext'
import { learningUnits } from '../data/courseData'
import { getUnitPath } from '../lib/unitNavigation'
import { SidebarNavigation } from '../components/learning/SidebarNavigation'
import { StepNavigation } from '../components/course-ui/StepNavigation'
import { ElectricalChrome } from '../components/course-ui/ElectricalChrome'

const TOTAL_PAGES = 5
const LS_KEY = 'electrical-risks-unit'

const DEMO_VIDEO =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

const STEP_HEADINGS = [
  'INTRODUCTION',
  '29% COMPLETE',
  'HEALTH EFFECTS',
  'PREVENTIVE MEASURES',
  'CLASSIFICATION EXERCISE',
]

const STEP_PROGRESS = [20, 29, 45, 72, 100]

const stepsData = [
  {
    id: 1,
    title: 'أنواع المخاطر',
    content: [
      'تشمل المخاطر الفيزيائية عدة أنواع مثل الحرارة، الضوضاء، الاهتزازات، والإشعاع.',
      'تؤثر هذه المخاطر بشكل مباشر على بيئة العمل وسلامة العاملين.',
      'يجب التعرف على كل نوع لتطبيق إجراءات السلامة المناسبة.',
    ],
  },
  {
    id: 2,
    title: 'أمثلة مباشرة',
    content: [
      'التعرض لأسلاك كهربائية مكشوفة.',
      'استخدام معدات تالفة أو غير معزولة.',
      'العمل بالقرب من مصادر حرارة عالية دون حماية.',
    ],
  },
  {
    id: 3,
    title: 'كيفية التمييز',
    content: [
      'ملاحظة مصدر الخطر (حرارة، كهرباء، اهتزاز).',
      'تحليل بيئة العمل والمعدات المستخدمة.',
      'استخدام أدوات القياس عند الحاجة.',
    ],
  },
  {
    id: 4,
    title: 'أنواع درجات الحرارة المرتفعة',
    content: [
      'حرارة بيئية عالية في مواقع العمل.',
      'حرارة ناتجة عن المعدات الصناعية.',
      'حرارة ناتجة عن التفاعل الكيميائي أو الاحتكاك.',
    ],
  },
  {
    id: 5,
    title: 'كيفية التطور',
    content: [
      'تبدأ المخاطر بسبب سوء الاستخدام أو الإهمال.',
      'تتطور إلى إصابات مثل الحروق أو الصعق الكهربائي.',
      'يمكن تقليلها من خلال التدريب واستخدام معدات الحماية.',
    ],
  },
]

const ELECTRIC_HEALTH_EFFECT_CARDS = [
  {
    id: 'shock',
    icon: '⚡',
    title: 'الصدمة الكهربائية',
    text: 'من أخطر التأثيرات المباشرة؛ قد تؤثر على الجسم بالكامل في لحظات وتتطلب تدخلًا فوريًا.',
  },
  {
    id: 'burns',
    icon: '🔥',
    title: 'الحروق الكهربائية',
    text: 'تسبب إصابات خطيرة في الجلد نتيجة مرور التيار الكهربائي.',
  },
  {
    id: 'consciousness',
    icon: '⚠️',
    title: 'فقدان الوعي',
    text: 'قد يفقد العامل وعيه نتيجة الصدمة الكهربائية.',
  },
  {
    id: 'heart',
    icon: '❤️',
    title: 'اضطرابات القلب',
    text: 'تؤثر الكهرباء على نظم القلب وقد تسبب توقفه.',
  },
  {
    id: 'nerves',
    icon: '🧠',
    title: 'تلف الأعصاب',
    text: 'قد يؤدي التعرض إلى ضعف الإحساس أو فقدان التحكم العضلي.',
  },
]

const ELECTRIC_INTRO_CARDS = [
  {
    id: 'direct-risk',
    icon: '⚡',
    title: 'خطر مباشر',
    text: 'تشكل المخاطر الكهربائية تهديدًا كبيرًا لسلامة العاملين داخل بيئة العمل.',
  },
  {
    id: 'severe-injuries',
    icon: '🔥',
    title: 'إصابات خطيرة',
    text: 'قد تؤدي إلى حروق أو صدمات كهربائية قد تكون مميتة في بعض الحالات.',
  },
  {
    id: 'prevention',
    icon: '🛡️',
    title: 'الوقاية',
    text: 'فهم إجراءات السلامة والتعامل الصحيح مع المعدات يقلل من المخاطر بشكل كبير.',
  },
]

const PREVENTIVE_TABS = [
  { id: 'explosion', label: 'الانفجار', icon: '💥' },
  { id: 'spark', label: 'الشرر', icon: '⚡' },
  { id: 'combustion', label: 'الاحتراق', icon: '🔥' },
]

const PREVENTIVE_CARDS = {
  explosion: [
    {
      id: 'exp-first-aid',
      icon: '⚡',
      title: 'إسعافات أولية للصدمة الكهربائية',
      points: ['فصل التيار فورًا', 'عدم لمس المصاب مباشرة', 'استخدام أدوات عزل', 'طلب المساعدة الطبية'],
    },
    {
      id: 'exp-engineering',
      icon: '🛠️',
      title: 'طرق الوقاية الهندسية',
      points: ['تركيب قواطع حماية', 'عزل الكابلات بشكل صحيح', 'فحص لوحات التوزيع دوريًا'],
    },
  ],
  spark: [
    {
      id: 'spark-safe-work',
      icon: '🧯',
      title: 'ممارسات العمل الآمنة',
      points: ['إبعاد المواد القابلة للاشتعال', 'استخدام معدات مقاومة للشرر', 'مراقبة بيئة العمل أثناء التشغيل'],
    },
    {
      id: 'spark-checklist',
      icon: '✅',
      title: 'قائمة فحص قبل التشغيل',
      points: ['التأكد من سلامة التوصيلات', 'فحص أدوات العزل', 'تحديد نقاط الطوارئ مسبقًا'],
    },
  ],
  combustion: [
    {
      id: 'combustion-environment',
      icon: '🏭',
      title: 'بيئة آمنة',
      points: ['تهوية مناسبة للموقع', 'تجهيز مطافئ ملائمة', 'وضع لوحات تحذيرية واضحة'],
    },
    {
      id: 'combustion-response',
      icon: '🛡️',
      title: 'استجابة وقائية سريعة',
      points: ['تدريب الفريق على الإخلاء', 'الإبلاغ الفوري عن أي خطر', 'تطبيق خطة الطوارئ دون تأخير'],
    },
  ],
}

const P5_CLASS_OPTIONS = [
  { id: 'hand_arm', label: 'اليد والذراع' },
  { id: 'whole_body', label: 'كامل الجسم' },
  { id: 'other', label: 'أخرى' },
  { id: 'harmless', label: 'غير ضارة' },
]

function loadStored() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function TripleGallery({ srcs }) {
  const [broken, setBroken] = useState(() => srcs.map(() => false))
  const setB = (i) => {
    setBroken((prev) => {
      const next = [...prev]
      next[i] = true
      return next
    })
  }
  return (
    <div className="er-triple" dir="rtl">
      {srcs.map((src, i) =>
        broken[i] ? null : (
          <div key={i} className="er-triple__cell">
            <img src={src} alt="" className="er-triple__img" onError={() => setB(i)} />
          </div>
        ),
      )}
    </div>
  )
}

export function ElectricalRisksUnitPage() {
  const navigate = useNavigate()
  const { percent, recordLessonComplete } = useCourseProgress()
  const { step } = useParams()
  const stepNum = parseInt(step, 10)

  const [answers, setAnswers] = useState(() => loadStored()?.answers ?? {})
  const [preventiveTab, setPreventiveTab] = useState('explosion')
  const [activeStep, setActiveStep] = useState(1)

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
      navigate(`/course/electrical-risks/${n}`)
    },
    [navigate],
  )

  const onPrevious = useCallback(() => {
    if (stepNum <= 1) {
      navigate('/course/vibration-risks/5')
      return
    }
    go(stepNum - 1)
  }, [go, navigate, stepNum])

  const onNext = useCallback(() => {
    if (stepNum >= TOTAL_PAGES) return
    go(stepNum + 1)
  }, [go, stepNum])

  const setClassAnswer = useCallback((id) => {
    setAnswers((prev) => ({ ...prev, electricalClassification: id }))
  }, [])

  const activeStepData = useMemo(
    () => stepsData.find((s) => s.id === activeStep) ?? stepsData[0],
    [activeStep],
  )

  if (!validStep) {
    return <Navigate to="/course/electrical-risks/1" replace />
  }

  const leftHeading = STEP_HEADINGS[stepNum - 1]
  const barProgress = STEP_PROGRESS[stepNum - 1]
  const p5Sel = answers.electricalClassification
  const activePreventiveCards = PREVENTIVE_CARDS[preventiveTab] ?? PREVENTIVE_CARDS.explosion

  const navProps = {
    onPrevious,
    onNext,
    showPrevious: true,
    className: 'er-step-nav',
  }

  return (
    <div className="learning-layout">
      <SidebarNavigation
        units={learningUnits}
        activeUnitKey="electricity"
        onSelectUnit={(unitKey) => navigate(getUnitPath(unitKey))}
        progressPercent={percent}
        courseHeading="برنامج التوعية التفاعلي: التعرف على أنواع المخاطر المهنية والاستجابة الآمنة"
      />

      <main className="learning-main">
        <div className="er-unit-root fade-slide-in" key={stepNum}>
          {stepNum === 1 ? (
            <>
              <ElectricalChrome leftHeading={leftHeading} progressPercent={barProgress}>
                <div className="er-white-card">
                  <div className="er-card-pad" dir="rtl">
                    <section className="er-intro-premium">
                      <article className="er-intro-premium__header">
                        <span className="er-intro-premium__badge" aria-hidden>
                          ⚡
                        </span>
                        <h1 className="er-page-title er-page-title--intro">
                          لماذا يجب أن نولي اهتمامًا لمخاطر تأثير الكهرباء؟
                        </h1>
                        <p className="er-intro-premium__lead">
                          المخاطر الكهربائية قد تبدأ بإهمال بسيط لكنها تتطور بسرعة إلى إصابات جسيمة، لذلك
                          يصبح الوعي بإجراءات السلامة أمرًا أساسيًا لحماية العاملين.
                        </p>
                      </article>

                      <section className="er-intro-premium__cards" aria-label="نقاط رئيسية">
                        {ELECTRIC_INTRO_CARDS.map((item, index) => (
                          <article
                            key={item.id}
                            className="er-intro-point"
                            style={{ animationDelay: `${index * 90}ms` }}
                          >
                            <span className="er-intro-point__icon" aria-hidden>
                              {item.icon}
                            </span>
                            <h2 className="er-intro-point__title">{item.title}</h2>
                            <p className="er-intro-point__text">{item.text}</p>
                          </article>
                        ))}
                      </section>
                    </section>

                  </div>
                </div>
              </ElectricalChrome>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 2 ? (
            <>
              <ElectricalChrome leftHeading={leftHeading} progressPercent={barProgress}>
                <h1 className="er-page-title er-page-title--standalone" dir="rtl">التعريفات والأنواع</h1>
                <div className="er-white-card er-white-card--lift">
                  <div className="er-card-pad er-learning-journey" dir="rtl">
                    <aside className="er-journey-steps" aria-label="خطوات الرحلة التعليمية">
                      {stepsData.map((stepItem) => {
                        const isActive = stepItem.id === activeStep
                        const isCompleted = stepItem.id < activeStep
                        return (
                          <button
                            key={stepItem.id}
                            type="button"
                            className={`er-journey-step ${isActive ? 'er-journey-step--active' : ''} ${
                              isCompleted ? 'er-journey-step--done' : ''
                            }`}
                            onClick={() => setActiveStep(stepItem.id)}
                            aria-current={isActive ? 'step' : undefined}
                          >
                            <span className="er-journey-step__dot">{stepItem.id}</span>
                            <span className="er-journey-step__label">{stepItem.title}</span>
                          </button>
                        )
                      })}
                    </aside>

                    <section className="er-journey-content" key={activeStep}>
                      <div className="er-journey-progress">
                        <span className="er-journey-progress__meta">
                          أنت في الخطوة {activeStep} من {stepsData.length}
                        </span>
                        <div className="er-journey-progress__track">
                          <span
                            className="er-journey-progress__fill"
                            style={{
                              width: `${Math.round((activeStep / stepsData.length) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="er-content-card">
                        <h3 className="er-content-card__title">{activeStepData.title}</h3>
                        <ul className="er-content-card__list">
                          {activeStepData.content.map((item) => (
                            <li key={item} className="er-content-card__bullet">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </section>
                  </div>
                </div>
              </ElectricalChrome>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 3 ? (
            <>
              <ElectricalChrome leftHeading={leftHeading} progressPercent={barProgress}>
                <div className="er-white-card er-health-page">
                  <div className="er-card-pad er-card-pad--health" dir="rtl">
                    <div className="er-health-split">
                      <div className="er-health-main">
                        <header className="er-health-header">
                          <span className="er-health-header__icon" aria-hidden>
                            ⚡
                          </span>
                          <div className="er-health-header__text">
                            <h1 className="er-health-title">تأثيرات الكهرباء على صحة العاملين</h1>
                            <p className="er-health-intro">
                              التعرض للكهرباء قد يسبب أضرارًا متعددة تتراوح بين الإصابات الظاهرة والتأثيرات
                              الداخلية؛ تعرّف على أهم المخاطر لتطبيق الوقاية في الوقت المناسب.
                            </p>
                          </div>
                        </header>

                        <div className="er-health-grid" role="list">
                          {ELECTRIC_HEALTH_EFFECT_CARDS.map((card, i) => (
                            <article
                              key={card.id}
                              className="er-health-card"
                              role="listitem"
                              style={{ animationDelay: `${80 + i * 70}ms` }}
                            >
                              <span className="er-health-card__icon" aria-hidden>
                                {card.icon}
                              </span>
                              <h2 className="er-health-card__title">{card.title}</h2>
                              <p className="er-health-card__desc">{card.text}</p>
                            </article>
                          ))}
                        </div>
                      </div>

                      <aside className="er-health-aside" aria-label="ملخص وتنبيه">
                        <div className="er-health-highlight">
                          <p className="er-health-highlight__text">
                            ⚡ تأثير الكهرباء لا يقتصر على الإصابة الظاهرة، بل قد يسبب أضرارًا داخلية خطيرة على
                            الجهاز العصبي والدوري.
                          </p>
                        </div>
                        <div className="er-health-takeaway">
                          <span className="er-health-takeaway__label">خلاصة</span>
                          <p className="er-health-takeaway__text">
                            تؤثر الكهرباء بشكل مباشر على الجهاز العصبي والدوري.
                          </p>
                        </div>
                      </aside>
                    </div>
                  </div>
                </div>
              </ElectricalChrome>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 4 ? (
            <>
              <ElectricalChrome leftHeading={leftHeading} progressPercent={barProgress}>
                <div className="er-white-card er-white-card--tabs">
                  <div className="er-tab-panel-wrap" key={preventiveTab}>
                    <div className="er-card-pad er-preventive" dir="rtl">
                      <header className="er-preventive__header">
                        <h1 className="er-page-title er-page-title--standalone">
                          التعرف على الأعراض والتدابير الوقائية لمخاطر الكهرباء
                        </h1>
                        <p className="er-preventive__subtitle">
                          اختر نوع الخطر للاطلاع على إجراءات الوقاية العملية التي تساعد في تقليل الإصابات.
                        </p>
                      </header>

                      <div className="er-preventive-tabs" role="tablist" aria-label="أنواع المخاطر الوقائية">
                        {PREVENTIVE_TABS.map((tab) => {
                          const isActive = tab.id === preventiveTab
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              role="tab"
                              aria-selected={isActive}
                              className={`er-preventive-tab ${isActive ? 'er-preventive-tab--active' : ''}`}
                              onClick={() => setPreventiveTab(tab.id)}
                            >
                              <span aria-hidden>{tab.icon}</span>
                              <span>{tab.label}</span>
                            </button>
                          )
                        })}
                      </div>

                      <section className="er-preventive-grid" aria-label="بطاقات السلامة">
                        {activePreventiveCards.map((card) => (
                          <article key={card.id} className="er-preventive-card">
                            <h2 className="er-preventive-card__title">
                              <span aria-hidden>{card.icon}</span>
                              <span>{card.title}</span>
                            </h2>
                            <ul className="er-preventive-card__list">
                              {card.points.map((point) => (
                                <li key={point}>{point}</li>
                              ))}
                            </ul>
                          </article>
                        ))}
                      </section>

                      <aside className="er-preventive-warning" role="note">
                        <span className="er-preventive-warning__icon" aria-hidden>
                          ⚠️
                        </span>
                        <p className="er-preventive-warning__text">
                          التعامل السريع والصحيح مع الكهرباء يقلل بشكل كبير من خطر الإصابات الخطيرة أو الوفاة.
                        </p>
                      </aside>
                    </div>
                  </div>
                </div>
              </ElectricalChrome>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 5 ? (
            <>
              <ElectricalChrome leftHeading={leftHeading} progressPercent={barProgress}>
                <h1 className="er-page-title er-page-title--standalone" dir="rtl">
                  علامات يجب الانتباه لها عند التعامل مع المعدات الكهربائية
                </h1>
                <div className="er-video-shell">
                  <video
                    className="er-video"
                    controls
                    playsInline
                    poster="/electrical-multimeter-poster.png"
                    preload="metadata"
                  >
                    <source src={DEMO_VIDEO} type="video/mp4" />
                  </video>
                </div>
                <div className="er-white-card">
                  <div className="er-card-pad" dir="rtl">
                    <h2 className="er-card-title">تصنيف مخاطر الكهرباء</h2>
                    <p className="er-body-para">
                      تأثيرات درجات الحرارة على الجهاز العضلي قد تؤدي إلى تشنجات حرارية
                    </p>
                  </div>
                </div>
                <div className="er-white-card er-white-card--lift">
                  <div className="er-card-pad" dir="rtl">
                    <h2 className="er-card-title">تصنيف أمثلة مخاطر الكهرباء</h2>
                    <div className="er-drag-target">
                      <span className="er-drag-target__text">ضعف الأداء العضلي</span>
                    </div>
                    <div className="er-opt-row" role="group" aria-label="تصنيف">
                      {P5_CLASS_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          className={`er-opt-pill ${p5Sel === opt.id ? 'er-opt-pill--active' : ''}`}
                          onClick={() => setClassAnswer(opt.id)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ElectricalChrome>
              <StepNavigation
                {...navProps}
                onNext={() => {
                  recordLessonComplete('electricity')
                  navigate('/course/radiation-risks/1')
                }}
              />
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}
