import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { learningUnits } from '../data/courseData'
import { SidebarNavigation } from '../components/learning/SidebarNavigation'
import { StepNavigation } from '../components/course-ui/StepNavigation'
import { RadiationChrome } from '../components/course-ui/RadiationChrome'

const TOTAL_PAGES = 6
const LS_KEY = 'radiation-risks-unit'

const SOURCE_TABS = [
  { id: 'strike', label: 'الاصطدام', icon: '🚧', hint: 'مخاطر الأجسام المتحركة' },
  { id: 'cut', label: 'القطع', icon: '🪚', hint: 'مخاطر الأدوات الحادة' },
  { id: 'slip', label: 'الانزلاق/التعثر', icon: '⚠️', hint: 'مخاطر الحركة داخل الموقع' },
  { id: 'trap', label: 'الاحتجاز', icon: '🔩', hint: 'مخاطر الانحشار داخل المعدات' },
]

const SOURCE_EXPLORER_CONTENT = {
  strike: {
    title: '🚧 الاصطدام',
    points: [
      'الاصطدام بأجسام متحركة مثل المعدات.',
      'قد يسبب إصابات مباشرة وخطيرة.',
      'الوقاية تكون بتنظيم الحركة وارتداء معدات الحماية.',
    ],
  },
  cut: {
    title: '🪚 القطع',
    points: [
      'يحدث القطع بسبب الأدوات الحادة أو الحواف المعدنية المكشوفة.',
      'قد يؤدي إلى جروح عميقة أو نزيف يتطلب تدخلًا سريعًا.',
      'الوقاية تتم باستخدام قفازات مناسبة وتأمين الأدوات بعد الاستخدام.',
    ],
  },
  slip: {
    title: '⚠️ الانزلاق/التعثر',
    points: [
      'ينتج عن الأرضيات غير المستوية أو الرطبة أو المزدحمة بالمخلفات.',
      'قد يؤدي إلى سقوط العامل وإصابات في المفاصل أو الظهر.',
      'الوقاية تشمل تحسين النظافة والإضاءة ووضع إشارات تحذيرية واضحة.',
    ],
  },
  trap: {
    title: '🔩 الاحتجاز',
    points: [
      'يحدث عند انحشار العامل بين أجزاء متحركة أو معدات ثقيلة.',
      'يؤدي إلى إصابات شديدة عند غياب إجراءات العزل والإيقاف.',
      'الوقاية تكون بإيقاف المعدات وعزل مصادر الطاقة قبل أي صيانة.',
    ],
  },
}

const BODY_LABELS_RIGHT = [
  'العينين',
  'العنق',
  'الرئتين',
  'الطحال',
  'الغدد الكظرية',
  'الكلى',
  'المثانة',
]

const BODY_LABELS_LEFT = ['الرأس', 'القلب', 'الكبد', 'المعدة', 'الأمعاء']

const P6_OPTIONS = [
  { id: 'strike', label: 'الاصطدام' },
  { id: 'slip', label: 'الانزلاق/التعثر' },
  { id: 'cut', label: 'القطع' },
  { id: 'trap', label: 'الاحتجاز' },
]

const P6_LIST = ['أنواع المخاطر', 'أمثلة مباشرة', 'كيفية التمييز']

const RADIATION_AWARENESS_CARDS = [
  {
    id: 'invisible',
    icon: '👁️',
    title: 'غير مرئية',
    text: 'الأشعة السينية غير مرئية، مما يجعل اكتشافها صعبًا بدون أدوات.',
  },
  {
    id: 'long-term',
    icon: '🧬',
    title: 'تأثير طويل المدى',
    text: 'التعرض المستمر قد يؤدي إلى أضرار صحية مزمنة وخطيرة.',
  },
  {
    id: 'prevention',
    icon: '🛡️',
    title: 'الوقاية',
    text: 'الالتزام بإجراءات السلامة يقلل من المخاطر بشكل كبير.',
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

function BodyDiagram({ src }) {
  const [broken, setBroken] = useState(false)
  return (
    <div className="rr-body-diagram" dir="rtl">
      <ul className="rr-body-diagram__col">
        {BODY_LABELS_RIGHT.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
      <div className="rr-body-diagram__center">
        {!broken ? (
          <img className="rr-body-img" src={src} alt="" onError={() => setBroken(true)} />
        ) : (
          <div className="rr-body-silhouette" aria-hidden />
        )}
      </div>
      <ul className="rr-body-diagram__col">
        {BODY_LABELS_LEFT.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </div>
  )
}

export function RadiationRisksUnitPage() {
  const navigate = useNavigate()
  const { step } = useParams()
  const stepNum = parseInt(step, 10)

  const [answers, setAnswers] = useState(() => loadStored()?.answers ?? {})
  const [sourceTab, setSourceTab] = useState('strike')
  const [naturalImgOk, setNaturalImgOk] = useState(true)

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
        ((learningUnits.findIndex((u) => u.key === 'xray') + 1) / learningUnits.length) * 100,
      ),
    [],
  )

  const go = useCallback(
    (n) => {
      navigate(`/course/radiation-risks/${n}`)
    },
    [navigate],
  )

  const onPrevious = useCallback(() => {
    if (stepNum <= 1) {
      navigate('/course/electrical-risks/5')
      return
    }
    go(stepNum - 1)
  }, [go, navigate, stepNum])

  const onNext = useCallback(() => {
    if (stepNum >= TOTAL_PAGES) return
    go(stepNum + 1)
  }, [go, stepNum])

  const setP6 = useCallback((id) => {
    setAnswers((prev) => ({ ...prev, radiationClassification: id }))
  }, [])

  if (!validStep) {
    return <Navigate to="/course/radiation-risks/1" replace />
  }

  const p6Sel = answers.radiationClassification
  const sourceActiveCard = SOURCE_TABS.find((tab) => tab.id === sourceTab) ?? SOURCE_TABS[0]
  const sourceActiveContent = SOURCE_EXPLORER_CONTENT[sourceTab] ?? SOURCE_EXPLORER_CONTENT.strike

  const navProps = {
    onPrevious,
    onNext,
    showPrevious: true,
    previousLabel: 'Previous',
    nextLabel: 'التالي',
    className: 'rr-step-nav',
  }

  const unitNav = (unitKey) => {
    if (unitKey === 'xray') navigate('/course/radiation-risks/1')
    else if (unitKey === 'electricity') navigate('/course/electrical-risks/1')
    else if (unitKey === 'vibration') navigate('/course/vibration-risks/1')
    else if (unitKey === 'extreme-temperature') navigate('/course/extreme-temperature/1')
    else navigate(`/course/learn?unit=${unitKey}`)
  }

  return (
    <div className="learning-layout">
      <SidebarNavigation
        units={learningUnits}
        activeUnitKey="xray"
        onSelectUnit={unitNav}
        progressPercent={progressPercent}
        courseHeading="برنامج التوعية التفاعلي: التعرف على أنواع المخاطر المهنية والاستجابة الآمنة"
      />

      <main className="learning-main">
        <div className="rr-unit-root fade-slide-in" key={stepNum}>
          {stepNum === 1 ? (
            <>
              <RadiationChrome leftHeading="86% COMPLETE" progressPercent={86}>
                <div className="rr-white-card rr-awareness-page">
                  <div className="rr-card-pad rr-card-pad--awareness" dir="rtl">
                    <section className="rr-awareness-hero">
                      <h1 className="rr-awareness-hero__title">☢️ هل يمكن أن تكون الأشعة غير المرئية خطرًا؟</h1>
                      <aside className="rr-awareness-warning" role="note">
                        ⚠️ الأشعة غير المرئية قد تكون أخطر من المرئية لأنها لا تُلاحظ بسهولة.
                      </aside>
                    </section>

                    <section className="rr-awareness-cards" role="list" aria-label="مخاطر غير مرئية">
                      {RADIATION_AWARENESS_CARDS.map((card, index) => (
                        <article
                          key={card.id}
                          className="rr-awareness-card"
                          role="listitem"
                          style={{ animationDelay: `${index * 90}ms` }}
                        >
                          <span className="rr-awareness-card__icon" aria-hidden>
                            {card.icon}
                          </span>
                          <h2 className="rr-awareness-card__title">{card.title}</h2>
                          <p className="rr-awareness-card__text">{card.text}</p>
                        </article>
                      ))}
                    </section>
                  </div>
                </div>
              </RadiationChrome>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 2 ? (
            <>
              <RadiationChrome leftHeading={null} showProgressBar={false}>
                <div className="rr-white-card rr-awareness-page">
                  <div className="rr-card-pad rr-card-pad--awareness" dir="rtl">
                    <section className="rr-awareness-hero">
                      <h1 className="rr-awareness-hero__title">☢️ هل يمكن أن تكون الأشعة غير المرئية خطرًا؟</h1>
                      <aside className="rr-awareness-warning" role="note">
                        ⚠️ الأشعة غير المرئية قد تكون أخطر من المرئية لأنها لا تُلاحظ بسهولة.
                      </aside>
                    </section>

                    <section className="rr-awareness-cards" role="list" aria-label="مخاطر غير مرئية">
                      {RADIATION_AWARENESS_CARDS.map((card, index) => (
                        <article
                          key={card.id}
                          className="rr-awareness-card"
                          role="listitem"
                          style={{ animationDelay: `${index * 90}ms` }}
                        >
                          <span className="rr-awareness-card__icon" aria-hidden>
                            {card.icon}
                          </span>
                          <h2 className="rr-awareness-card__title">{card.title}</h2>
                          <p className="rr-awareness-card__text">{card.text}</p>
                        </article>
                      ))}
                    </section>
                  </div>
                </div>
              </RadiationChrome>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 3 ? (
            <>
              <RadiationChrome leftHeading={null} showProgressBar={false}>
                <div className="rr-white-card rr-source-explorer">
                  <div className="rr-card-pad rr-card-pad--source" dir="rtl">
                    <header className="rr-source-head">
                      <h1 className="rr-page-title rr-page-title--source">مصادر المخاطر</h1>
                      <p className="rr-page-sub rr-page-sub--source">اضغط على نوع الخطر لعرض التفاصيل</p>
                    </header>

                    <section className="rr-source-cards" role="tablist" aria-label="أنواع المخاطر">
                      {SOURCE_TABS.map((tab) => {
                        const isActive = tab.id === sourceTab
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            className={`rr-source-card ${isActive ? 'rr-source-card--active' : ''}`}
                            onClick={() => setSourceTab(tab.id)}
                          >
                            <span className="rr-source-card__icon" aria-hidden>
                              {tab.icon}
                            </span>
                            <span className="rr-source-card__title">{tab.label}</span>
                            <span className="rr-source-card__hint">{tab.hint}</span>
                          </button>
                        )
                      })}
                    </section>

                    <section className="rr-source-panel" key={sourceTab}>
                      <h2 className="rr-source-panel__title">{sourceActiveContent.title}</h2>
                      <div className="rr-source-panel__divider" aria-hidden />
                      <ul className="rr-source-panel__list">
                        {sourceActiveContent.points.map((point, idx) => (
                          <li key={point}>
                            <span className="rr-source-panel__bullet" aria-hidden>
                              {idx === 0 ? sourceActiveCard.icon : '•'}
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </div>
              </RadiationChrome>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 4 ? (
            <>
              <RadiationChrome leftHeading="0% COMPLETE" progressPercent={0}>
                <div className="rr-white-card">
                  <div className="rr-card-pad rr-card-pad--tight-top">
                    <div className="rr-figure-wrap">
                      {naturalImgOk ? (
                        <img
                          className="rr-figure"
                          src="/radiation-natural-ct.png"
                          alt=""
                          onError={() => setNaturalImgOk(false)}
                        />
                      ) : null}
                      <div
                        className={`rr-figure-fallback ${naturalImgOk ? 'rr-figure-fallback--behind' : ''}`}
                        aria-hidden
                      />
                    </div>
                    <div dir="rtl">
                      <h1 className="rr-page-title rr-page-title--in-card">مصادر الأشعة السينية الطبيعية</h1>
                      <ul className="rr-bullet-list">
                        <li>بعض الأشعة تأتي من الطبيعة مثل الفضاء.</li>
                        <li>التعرض لها يكون منخفض عادة.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </RadiationChrome>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 5 ? (
            <>
              <RadiationChrome leftHeading={null} showProgressBar={false}>
                <div className="rr-page-head" dir="rtl">
                  <h1 className="rr-page-title">أنواع الأشعة السينية الطبيعية</h1>
                  <ul className="rr-bullet-list rr-bullet-list--flush">
                    <li>تؤثر على أعضاء الجسم المختلفة.</li>
                    <li>تعتمد خطورتها على مدة التعرض.</li>
                  </ul>
                </div>
                <div className="rr-white-card">
                  <div className="rr-card-pad">
                    <BodyDiagram src="/radiation-body-diagram.png" />
                  </div>
                </div>
              </RadiationChrome>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 6 ? (
            <>
              <RadiationChrome leftHeading={null} showProgressBar={false}>
                <div className="rr-page-head" dir="rtl">
                  <h1 className="rr-page-title">تجارب تفاعلية</h1>
                  <p className="rr-page-sub">صنف المخاطر الفيزيائية التالية</p>
                </div>
                <div className="rr-white-card">
                  <div className="rr-card-pad" dir="rtl">
                    <h2 className="rr-card-title">ميز الأشعة السينية</h2>
                    <ul className="rr-class-num-list">
                      {P6_LIST.map((line, i) => (
                        <li key={line} className="rr-class-num-list__item">
                          <span className="rr-class-num-list__badge">{i + 1}</span>
                          <span>{line}.</span>
                        </li>
                      ))}
                    </ul>
                    <div className="rr-class-sep" aria-hidden />
                    <div className="rr-opt-row" role="group" aria-label="تصنيف">
                      {P6_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          className={`rr-opt-pill ${p6Sel === opt.id ? 'rr-opt-pill--active' : ''}`}
                          onClick={() => setP6(opt.id)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </RadiationChrome>
              <StepNavigation {...navProps} onNext={() => {}} nextDisabled />
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}
