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

const BODY_ORGAN_HOTSPOTS = [
  {
    id: 'eyes',
    label: 'العينين',
    icon: '👁️',
    impact: 'العدسة والشبكية تتأثران بسرعة مع الجرعات المتكررة، لذلك يجب تقليل زمن التعرض المباشر.',
    labelPos: { x: 79, y: 14 },
    targetPos: { x: 53, y: 16 },
  },
  {
    id: 'neck',
    label: 'العنق',
    icon: '🫁',
    impact: 'الأنسجة الحساسة في العنق قد تتأثر مع التعرض المستمر، لذا يلزم الالتزام بالحواجز الواقية.',
    labelPos: { x: 20, y: 20 },
    targetPos: { x: 49, y: 23 },
  },
  {
    id: 'lungs',
    label: 'الرئتين',
    icon: '🫁',
    impact: 'تعرض الرئتين لفترات طويلة قد يسبب تغيرات نسيجية تدريجية، خصوصًا دون وسائل حماية.',
    labelPos: { x: 82, y: 31 },
    targetPos: { x: 54, y: 33 },
  },
  {
    id: 'heart',
    label: 'القلب',
    icon: '❤️',
    impact: 'الجرعات العالية الممتدة قد ترفع احتمالية التأثيرات القلبية، لذا المراقبة الدقيقة أساسية.',
    labelPos: { x: 19, y: 38 },
    targetPos: { x: 46, y: 39 },
  },
  {
    id: 'liver',
    label: 'الكبد',
    icon: '🧪',
    impact: 'الكبد قد يتأثر عند تكرار الجرعات، لذلك يعتمد الأمان على ضبط الجرعة والوقت والمسافة.',
    labelPos: { x: 80, y: 48 },
    targetPos: { x: 56, y: 48 },
  },
  {
    id: 'spleen',
    label: 'الطحال',
    icon: '🩸',
    impact: 'الطحال عضو دموي حساس، وتراكم التعرض الإشعاعي قد يؤثر في كفاءته الوظيفية.',
    labelPos: { x: 18, y: 54 },
    targetPos: { x: 43, y: 51 },
  },
  {
    id: 'stomach',
    label: 'المعدة',
    icon: '🫙',
    impact: 'الأغشية الداخلية للمعدة قد تتأثر إذا زادت الجرعة، مما يستدعي متابعة دقيقة.',
    labelPos: { x: 79, y: 62 },
    targetPos: { x: 52, y: 58 },
  },
  {
    id: 'adrenal',
    label: 'الغدد الكظرية',
    icon: '🧬',
    impact: 'الغدد الكظرية حساسة للتغيرات الهرمونية، والتعرض المتكرر قد يسبب اضطرابًا وظيفيًا.',
    labelPos: { x: 20, y: 67 },
    targetPos: { x: 49, y: 63 },
  },
  {
    id: 'kidneys',
    label: 'الكلى',
    icon: '🧫',
    impact: 'الكلى تتطلب حماية عالية لأن تراكم الجرعات قد يؤثر في الترشيح ووظائف الإخراج.',
    labelPos: { x: 80, y: 75 },
    targetPos: { x: 53, y: 70 },
  },
  {
    id: 'intestines',
    label: 'الأمعاء',
    icon: '🧠',
    impact: 'الخلايا سريعة الانقسام في الأمعاء تتأثر أسرع نسبيًا، ما يبرز أهمية تقليل التعرض.',
    labelPos: { x: 18, y: 80 },
    targetPos: { x: 47, y: 77 },
  },
  {
    id: 'bladder',
    label: 'المثانة',
    icon: '⚕️',
    impact: 'المثانة قد تتأثر بالجرعات المتكررة، لذلك تخطيط الفحوصات الوقائية يقلل المخاطر.',
    labelPos: { x: 73, y: 88 },
    targetPos: { x: 50, y: 86 },
  },
]

const P6_OPTIONS = [
  { id: 'strike', label: 'الاصطدام', icon: '🚧', desc: 'خطر ناتج عن أجسام متحركة أو مرور معدات.' },
  { id: 'slip', label: 'الانزلاق/التعثر', icon: '⚠️', desc: 'خطر شائع بسبب الأرضيات غير المستوية أو الرطبة.' },
  { id: 'cut', label: 'القطع', icon: '🪚', desc: 'خطر من الحواف الحادة أو الأدوات غير المؤمنة.' },
  { id: 'trap', label: 'الاحتجاز', icon: '🔩', desc: 'خطر الانحشار بين أجزاء معدات متحركة.' },
]

const P6_CORRECT_ID = 'cut'
const P6_PROGRESS_STEPS = ['فهم السياق', 'اتخاذ القرار', 'تثبيت المعلومة']
const P6_SCENARIO_TEXT =
  'أثناء العمل في موقع صناعي، يتحرك عامل بالقرب من معدات متحركة ويحمل أداة معدنية حادة. في لحظة انشغال، يقترب من الحافة الحادة للأداة دون انتباه كافٍ.'
const P6_FEEDBACK_BY_OPTION = {
  strike: {
    whyWrong: 'الاصطدام يرتبط عادةً بارتطام الجسم بمعدة متحركة، بينما الموقف هنا يركز على أداة حادة.',
  },
  slip: {
    whyWrong: 'لا توجد مؤشرات على أرضية زلقة أو تعثر؛ العامل الخطر هنا هو الحافة المعدنية الحادة.',
  },
  cut: {
    whyCorrect: 'هذا تصنيف صحيح لأن الخطر الأساسي في السيناريو ناتج عن أداة معدنية حادة قد تسبب جرحًا مباشرًا.',
  },
  trap: {
    whyWrong: 'الاحتجاز يحدث غالبًا عند الانحشار بين أجزاء متحركة، وهو غير موصوف في هذا السيناريو.',
  },
}

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

const NATURAL_RADIATION_INFO_CARDS = [
  {
    id: 'nature',
    icon: '🌌',
    title: 'من الطبيعة',
    text: 'تأتي بعض الأشعة من مصادر طبيعية مثل الفضاء والتربة.',
  },
  {
    id: 'low-impact',
    icon: '📉',
    title: 'منخفضة التأثير',
    text: 'عادةً ما يكون مستوى التعرض منخفضًا ولا يشكل خطرًا كبيرًا.',
  },
  {
    id: 'awareness',
    icon: '🧠',
    title: 'الوعي مهم',
    text: 'معرفة المصادر تساعد على فهم المخاطر والتعامل معها بوعي.',
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

export function RadiationRisksUnitPage() {
  const navigate = useNavigate()
  const { step } = useParams()
  const stepNum = parseInt(step, 10)

  const [answers, setAnswers] = useState(() => loadStored()?.answers ?? {})
  const [sourceTab, setSourceTab] = useState('strike')
  const [activeOrganId, setActiveOrganId] = useState(BODY_ORGAN_HOTSPOTS[0].id)
  const [bodyImageBroken, setBodyImageBroken] = useState(false)

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

  if (!validStep) {
    return <Navigate to="/course/radiation-risks/1" replace />
  }

  const p6Sel = answers.radiationClassification
  const p6Feedback = answers.radiationClassificationFeedback
  const sourceActiveCard = SOURCE_TABS.find((tab) => tab.id === sourceTab) ?? SOURCE_TABS[0]
  const sourceActiveContent = SOURCE_EXPLORER_CONTENT[sourceTab] ?? SOURCE_EXPLORER_CONTENT.strike
  const activeOrgan =
    BODY_ORGAN_HOTSPOTS.find((organ) => organ.id === activeOrganId) ?? BODY_ORGAN_HOTSPOTS[0]
  const p6Why = p6Sel ? P6_FEEDBACK_BY_OPTION[p6Sel] : null

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
              <StepNavigation {...navProps} onNext={onNext} className="rr-step-nav rr-step-nav--natural" />
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
                <div className="rr-white-card rr-natural-scene">
                  <div className="rr-card-pad rr-card-pad--natural" dir="rtl">
                    <section className="rr-natural-hero">
                      <div className="rr-natural-hero__bg" aria-hidden>
                        <span className="rr-natural-hero__particles" />
                        <span className="rr-natural-hero__waves" />
                      </div>
                      <div className="rr-natural-hero__content">
                        <h1 className="rr-natural-hero__title">مصادر الأشعة السينية الطبيعية</h1>
                        <p className="rr-natural-hero__subtitle">
                          بعض الأشعة تأتي من الطبيعة مثل الفضاء، وتكون عادة منخفضة التأثير.
                        </p>
                      </div>
                    </section>

                    <section className="rr-natural-cards" role="list" aria-label="بطاقات توعوية">
                      {NATURAL_RADIATION_INFO_CARDS.map((card, index) => (
                        <article
                          key={card.id}
                          className="rr-natural-card"
                          role="listitem"
                          style={{ animationDelay: `${index * 120}ms` }}
                        >
                          <span className="rr-natural-card__icon" aria-hidden>
                            {card.icon}
                          </span>
                          <h2 className="rr-natural-card__title">{card.title}</h2>
                          <p className="rr-natural-card__text">{card.text}</p>
                        </article>
                      ))}
                    </section>
                  </div>
                </div>
              </RadiationChrome>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 5 ? (
            <>
              <RadiationChrome leftHeading={null} showProgressBar={false}>
                <div className="rr-white-card rr-body-sim">
                  <div className="rr-card-pad rr-card-pad--body-sim" dir="rtl">
                    <header className="rr-body-sim__head">
                      <h1 className="rr-page-title rr-page-title--body-sim">أنواع الأشعة السينية الطبيعية</h1>
                      <p className="rr-page-sub rr-page-sub--body-sim">
                        اختر عضوًا لمعرفة التأثير المحتمل للأشعة السينية عليه.
                      </p>
                    </header>

                    <section className="rr-body-sim-stage" aria-label="محاكاة تفاعلية لأعضاء الجسم">
                      <svg className="rr-body-sim__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                        {BODY_ORGAN_HOTSPOTS.map((organ) => {
                          const isActive = organ.id === activeOrganId
                          return (
                            <line
                              key={`line-${organ.id}`}
                              x1={organ.labelPos.x}
                              y1={organ.labelPos.y}
                              x2={organ.targetPos.x}
                              y2={organ.targetPos.y}
                              className={`rr-body-sim__line ${isActive ? 'is-active' : ''}`}
                            />
                          )
                        })}
                      </svg>

                      <div className="rr-body-sim__figure-wrap">
                        <div className="rr-body-sim__figure-glow" aria-hidden />
                        {!bodyImageBroken ? (
                          <img
                            className="rr-body-sim__figure"
                            src="/radiation-body-diagram.png"
                            alt="رسم توضيحي لجسم الإنسان"
                            onError={() => setBodyImageBroken(true)}
                          />
                        ) : (
                          <div className="rr-body-sim__silhouette" aria-hidden />
                        )}
                      </div>

                      {BODY_ORGAN_HOTSPOTS.map((organ) => {
                        const isActive = organ.id === activeOrganId
                        return (
                          <button
                            key={organ.id}
                            type="button"
                            className={`rr-body-sim__hotspot ${isActive ? 'is-active' : ''}`}
                            style={{ left: `${organ.labelPos.x}%`, top: `${organ.labelPos.y}%` }}
                            onClick={() => setActiveOrganId(organ.id)}
                          >
                            <span className="rr-body-sim__hotspot-icon" aria-hidden>
                              {organ.icon}
                            </span>
                            <span>{organ.label}</span>
                            <span className="rr-body-sim__tooltip">عرض التأثير الإشعاعي</span>
                          </button>
                        )
                      })}

                      {BODY_ORGAN_HOTSPOTS.map((organ) => {
                        const isActive = organ.id === activeOrganId
                        return (
                          <span
                            key={`target-${organ.id}`}
                            className={`rr-body-sim__target ${isActive ? 'is-active' : ''}`}
                            style={{ left: `${organ.targetPos.x}%`, top: `${organ.targetPos.y}%` }}
                            aria-hidden
                          />
                        )
                      })}

                      <article
                        className="rr-body-sim__info-card"
                        style={{ left: `${activeOrgan.labelPos.x}%`, top: `${activeOrgan.labelPos.y}%` }}
                      >
                        <p className="rr-body-sim__info-kicker">تأثير إشعاعي محتمل</p>
                        <h2 className="rr-body-sim__info-title">
                          <span aria-hidden>{activeOrgan.icon}</span> {activeOrgan.label}
                        </h2>
                        <p className="rr-body-sim__info-text">{activeOrgan.impact}</p>
                      </article>
                    </section>

                    <section className="rr-body-sim-mobile" aria-label="قائمة أعضاء الجسم">
                      <div className="rr-body-sim-mobile__list" role="tablist">
                        {BODY_ORGAN_HOTSPOTS.map((organ) => (
                          <button
                            key={`mobile-${organ.id}`}
                            type="button"
                            role="tab"
                            aria-selected={activeOrganId === organ.id}
                            className={`rr-body-sim-mobile__pill ${activeOrganId === organ.id ? 'is-active' : ''}`}
                            onClick={() => setActiveOrganId(organ.id)}
                          >
                            {organ.icon} {organ.label}
                          </button>
                        ))}
                      </div>
                      <article className="rr-body-sim-mobile__card">
                        <h2>
                          <span aria-hidden>{activeOrgan.icon}</span> {activeOrgan.label}
                        </h2>
                        <p>{activeOrgan.impact}</p>
                      </article>
                    </section>
                  </div>
                </div>
              </RadiationChrome>
              <StepNavigation {...navProps} onNext={onNext} />
            </>
          ) : null}

          {stepNum === 6 ? (
            <>
              <RadiationChrome leftHeading={null} showProgressBar={false}>
                <div className="rr-white-card rr-learning-lab">
                  <div className="rr-card-pad rr-card-pad--learning-lab" dir="rtl">
                    <section className="rr-learning-lab__context">
                      <h1 className="rr-page-title rr-page-title--learning-lab">تجارب تفاعلية</h1>
                      <p className="rr-page-sub rr-page-sub--learning-lab">
                        هدف هذا التمرين هو الربط بين الموقف الواقعي وتصنيف الخطر الصحيح لتثبيت الفهم.
                      </p>
                      <p className="rr-learning-lab__scenario-intro">
                        أثناء العمل في موقع صناعي، قد يتعرض العامل لمواقف مثل السيناريو التالي.
                      </p>
                    </section>

                    <section className="rr-learning-lab__progress">
                      <div className="rr-learning-lab__progress-head">
                        <strong>1 من 3</strong>
                        <span>تقدم التعلم</span>
                      </div>
                      <div className="rr-learning-lab__progress-bar" aria-hidden>
                        <span className={`rr-learning-lab__progress-fill ${p6Sel ? 'is-engaged' : ''}`} />
                      </div>
                    </section>

                    <div className="rr-learning-lab__grid">
                      <aside className="rr-learning-lab__steps" aria-label="مراحل التمرين">
                        {P6_PROGRESS_STEPS.map((step, index) => (
                          <article
                            key={step}
                            className={`rr-learning-step ${
                              index === 0 || (index === 1 && p6Sel) || (index === 2 && p6Feedback)
                                ? 'is-active'
                                : ''
                            }`}
                          >
                            <span className="rr-learning-step__num">{index + 1}</span>
                            <p>{step}</p>
                          </article>
                        ))}
                      </aside>

                      <section className="rr-learning-lab__decision">
                        <article className="rr-learning-lab__scenario-card">
                          <h2>الموقف العملي</h2>
                          <p>{P6_SCENARIO_TEXT}</p>
                        </article>

                        <div className="rr-learning-lab__options" role="group" aria-label="خيارات التصنيف">
                          {P6_OPTIONS.map((opt) => {
                            const selected = p6Sel === opt.id
                            const isCorrect = selected && p6Feedback === 'correct'
                            const isWrong = selected && p6Feedback === 'wrong'
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                className={`rr-learning-option ${selected ? 'is-selected' : ''} ${isCorrect ? 'is-correct' : ''} ${isWrong ? 'is-wrong' : ''}`}
                                onClick={() => {
                                  const correct = opt.id === P6_CORRECT_ID
                                  setAnswers((prev) => ({
                                    ...prev,
                                    radiationClassification: opt.id,
                                    radiationClassificationFeedback: correct ? 'correct' : 'wrong',
                                  }))
                                }}
                              >
                                <span className="rr-learning-option__icon" aria-hidden>
                                  {opt.icon}
                                </span>
                                <span className="rr-learning-option__title">{opt.label}</span>
                                <span className="rr-learning-option__desc">{opt.desc}</span>
                                {selected ? <span className="rr-learning-option__badge">تم الاختيار</span> : null}
                              </button>
                            )
                          })}
                        </div>

                        {p6Sel ? (
                          <article
                            className={`rr-learning-lab__feedback ${
                              p6Feedback === 'correct' ? 'is-success' : 'is-warning'
                            }`}
                            aria-live="polite"
                          >
                            <h3>{p6Feedback === 'correct' ? 'إجابة صحيحة' : 'ليست الإجابة الأدق'}</h3>
                            <p>
                              {p6Feedback === 'correct'
                                ? p6Why?.whyCorrect
                                : `${p6Why?.whyWrong} الإجابة الأدق في هذا السياق: ${P6_OPTIONS.find((o) => o.id === P6_CORRECT_ID)?.label}.`}
                            </p>
                            <div className="rr-learning-lab__insight">
                              💡{' '}
                              {p6Feedback === 'correct'
                                ? 'القطع يحدث غالبًا عند الاقتراب من أدوات أو حواف حادة دون تركيز كاف.'
                                : 'التصنيف الدقيق يبدأ بتحديد مصدر الخطر المباشر قبل أي افتراض آخر.'}
                            </div>
                            <p className="rr-learning-lab__reinforce">
                              تذكر: بيئة العمل الديناميكية تزيد المخاطر، لكن الملاحظة الدقيقة لسلوك الخطر هي مفتاح القرار الصحيح.
                            </p>
                          </article>
                        ) : (
                          <p className="rr-learning-lab__guide">
                            اختر أحد الخيارات لعرض تفسير القرار وتثبيت المعلومة.
                          </p>
                        )}
                      </section>
                    </div>
                  </div>
                </div>
              </RadiationChrome>
              <StepNavigation
                {...navProps}
                onNext={() => navigate('/course/learn?unit=interactive-assessment')}
                nextDisabled={false}
                className="rr-step-nav rr-step-nav--learning-lab"
              />
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}
